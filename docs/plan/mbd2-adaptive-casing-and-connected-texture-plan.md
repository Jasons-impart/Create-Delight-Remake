# MBD2 自适应机壳与连接纹理方案

本文记录 MBD2 通用输入总线、输出总线、输入仓和输出仓自动继承所属多方块机壳外观，并与周围机壳连续显示 LDLib 连接纹理的技术方案。

当前状态为“调研完成、尚未实现”。本文基于整合包当前使用的 Create 6.0.8、LDLib 1.0.50 和 MBD2 1.0.38.a；后续升级依赖版本时必须重新核对目标类和渲染链。

连接纹理图集格式与 Create/LDLib 互转方式见 [Create 与 LDLib 连接纹理互转](../create-ldlib-connected-texture-conversion.md)。图集转换只解决像素布局，不会自动实现控制器材质选择、Forge appearance 或 MBD2 动态模型的 CTM 重烘焙。

## 目标

- 同一个通用总线或仓口方块可以被不同 MBD2 多方块机器复用。
- 结构成型后，部件的机壳区域自动显示所属控制器对应的机壳材质。
- 部件正面的输入、输出或流体面板保持自身模型，不被机壳材质替换。
- 使用 LDLib CTM 的机壳能够跨普通机壳与功能部件连续连接。
- 结构失效后恢复未成型外观，区块重载和客户端同步后保持一致。
- 最终方案能够统一服务物品总线、流体仓和后续新增的 MBD2 通用部件。

## 非目标

- 第一阶段不要求支持任意复杂方块模型、动态染色、多 RenderType 或特殊发光层。
- 不允许一个完整方块部件同时显示两种不同控制器机壳；不同材质机器之间不共享自适应部件。
- 不把 Create/LDLib 图集互转脚本当作运行时兼容层。
- 不在纯 `.sm`、PNG 或 `.png.mcmeta` 中模拟完整的通用控制器外观继承。

## 当前实现基础与缺口

| 能力 | 当前状态 | 结论 |
|---|---|---|
| 部件取得控制器 | `MBDPartMachine.controllerPositions` 已同步，`getControllers()` 可取得实际 `IMultiController` | 部件不需要扫描附近方块。 |
| 同一方块按实例换模型 | `machineState` 已同步；`MBDBlockRenderer` 会按世界位置取得机器实例，再渲染当前状态的 `realRenderer` | 可以让同一通用总线的不同实例显示不同机壳。 |
| 控制器提供部件外观 | `IMultiController.getPartAppearance(...)` 已声明 | API 已预留，但当前没有实际调用点。 |
| 部件 Forge appearance | `MBDMachineBlock.getAppearance(...)` 委托机器实例；`MBDMachine.getAppearance(...)` 默认返回自身状态 | 需要让 `MBDPartMachine` 继续委托所属控制器。 |
| LDLib 邻接判断 | `ICTMPredicate.DEFAULT` 比较连接双方经过 Forge appearance 后的 `BlockState` | 部件返回机壳状态后，可以被视为同一种机壳。 |
| MBD2 动态模型 CTM | `MBDBlockRenderer` 只转发内层 renderer 的 quads，没有执行 LDLib CTM rebake | 只添加贴图和 metadata 不会生效。 |

当前已有三套可复用的输入总线模型：

- `ldlib/assets/mbd2/models/andesite_import_bus.json`
- `ldlib/assets/mbd2/models/steel_import_bus.json`
- `ldlib/assets/mbd2/models/forged_steel_import_bus.json`

输出总线也有对应模型。这些模型的主要差异是 `side` 和 `top` 分别引用安山机壳、钢制机壳与锻造钢机壳，因此适合直接用于第一阶段验证。

## 第一阶段：有限材质 KubeJS MVP

第一阶段先验证“一个通用部件按控制器切换外观”，不立即实现任意材质 renderer。

### 状态模型

在同一个通用部件 `.sm` 中预定义已知材质状态，例如：

- `casing_andesite`
- `casing_steel`
- `casing_forged_steel`

每个状态使用现有对应 JSON model。未成型时使用 `base`。

如果部件还要根据配方状态显示动画，则需要组合材质与生命周期状态，例如：

- `steel_formed`
- `steel_working`
- `forged_steel_formed`
- `forged_steel_working`

普通输入输出总线没有工作动画时，一个材质状态即可。

### KubeJS 事件时序

材质状态应在控制器的 `MBDMachineEvents.onRecipeStatusChanged` 中设置，不能只使用 `onStructureFormed`。MBD2 当前顺序为：

1. 控制器成型并调用 `part.addedToController(this)`。
2. 部件先自动切换为 `formed`。
3. 控制器调用 `notifyRecipeStatusChanged(current, current)`。
4. 部件又按配方状态自动切换为 `formed`、`working`、`waiting` 或 `suspend`。
5. 最后发布控制器的 `MachineRecipeStatusChangedEvent`。

因此在最后一个事件中调用 `part.setMachineState(...)`，可以覆盖 MBD2 的自动状态切换。机器首次成型时也会主动触发一次该事件，通常不需要延迟一 tick。

结构失效时，`removedFromController()` 会在最后一个控制器移除后自动将部件恢复为 `base`。

### 共享限制

自适应部件必须设置 `canShare = false`。当前已有安山、钢和锻钢总线允许共享，但一个部件只有一个 `machineState`；若同时属于不同材质的控制器，最后一次状态事件会覆盖先前外观。

如果未来确实需要共享，只能要求所有控制器返回相同机壳 appearance，或者定义明确的优先级；一个完整方块模型无法同时表现两种机壳。

### MVP 验收标准

- 同一个通用输入总线可在安山、钢和锻钢控制器中分别显示正确外观。
- 配方从空闲切换为工作、等待或暂停时，材质不会被自动状态覆盖。
- 拆除结构后恢复 `base`，再次成型能重新选择材质。
- 区块卸载和重载后，服务端与客户端显示一致。
- 部件不能同时加入两台控制器。

## 第二阶段：通用自适应机壳 renderer

完整的 GregTech 风格方案应放在 Create Delight Core 的 MBD2 兼容层中，而不是为每种材质继续复制总线方块。

### 控制器外观映射

建立统一的控制器外观注册表，最低键值为：

```text
controller definition ID -> casing BlockState
```

固定机壳机器可以直接按控制器 ID 映射。如果结构允许多种实际机壳并要求继承玩家放置的那一种，则需要同步最终选中的 `BlockState` 或稳定的 `casingKey`，不能只依赖控制器定义。

优先保存 `BlockState` 或可还原为 `BlockState` 的 key，而不是只保存纹理路径，因为 Forge appearance、CTM 邻接和复杂模型复用都需要方块状态语义。

### Part appearance 桥接

在 `MBDPartMachine.getAppearance(...)` 中：

1. 未成型时返回自身状态。
2. 遍历 `getControllers()`。
3. 调用控制器的 `getPartAppearance(part, side, queryState, queryPos)`。
4. 返回第一个非空机壳状态。
5. 没有有效控制器外观时回退到自身状态。

该桥接补齐 MBD2 已预留但未接通的 API，使 LDLib 默认 `ICTMPredicate` 能把总线与机壳视为同一种 appearance。

### 自适应 renderer

新增一个可复用的自适应机壳 renderer，渲染顺序为：

1. 根据当前世界位置取得 `MBDPartMachine`。
2. 从所属控制器取得机壳 `BlockState` 或 `casingKey`。
3. 渲染或替换部件模型中的机壳区域。
4. 保留输入、输出、流体仓等正面 overlay。
5. 在材质选择完成后统一执行 CTM 重烘焙。

标准立方体机壳可使用占位 sprite 标记需要替换的 quads，然后只替换这些 quads 的 sprite/UV。遇到复杂几何、多层贴图、染色、发光或特殊 RenderType 时，应优先复用目标机壳的完整 baked model，再叠加功能面板。

动态模型缓存至少必须包含：

```text
casingKey + facing + machineState
```

不能只按朝向缓存，否则第一台机器选择的机壳可能污染其他通用部件实例。

## 第三阶段：MBD2 动态模型 CTM 兼容

当前渲染链为：

```text
LDLRendererModel.RendererBakedModel
  -> MBDBlockRenderer
  -> 当前 MachineState 的 realRenderer
  -> quads
```

外层 `MBDBlockRenderer` 没有触发 LDLib 的 `CustomBakedModel.reBakeCustomQuads(...)`。最稳妥的兼容方式是在 `MBDBlockRenderer.renderModel(...)` 委托真实 renderer 得到 quads 后：

1. 检查 quads 中是否至少有一个 sprite 带 LDLib metadata。
2. 仅在需要时调用 `CustomBakedModel.reBakeCustomQuads(...)`。
3. 使用 `0.0f` offset，避免默认 `0.002f` 将整个模型表面沿法线外移。
4. 先完成自适应机壳材质替换，再计算 CTM。

不建议只让外层 `reBakeCustomQuads()` 永远返回 `true`：

- 没有 metadata 的模型也会被重新生成 quads。
- 默认 offset 不适合替换原模型表面的纯 CTM。
- LDLib 1.0.50 的 `LDLRendererModel.getQuads()` 在该分支提前返回，未执行后续 ThreadLocal 清理，存在渲染上下文残留风险。

部件 appearance 桥接完成后，LDLib 默认邻接判断会比较部件和相邻机壳各自的 appearance；两者都解析为同一个机壳 `BlockState` 时，连接纹理便可跨功能部件连续。

带正确 `cullface` 的完整方块面最适合 LDLib CTM。`side == null` 的非裁剪 quads、非立方面板和多层透明模型需要单独验证。

## 推荐代码位置

Java 实现属于独立的 Create Delight Core 源码仓库，后续应在 CDC 功能分支中完成并单独提交，再由整合包更新子模块与打包 JAR。

| 内容 | 建议位置 |
|---|---|
| MBD2 非侵入兼容与控制器外观注册表 | `CDC-mod-src/src/main/java/io/github/jasonsimpart/createdelightcore/compat/mbd2/` |
| `MBDPartMachine` appearance 桥接 | `CDC-mod-src/src/main/java/io/github/jasonsimpart/createdelightcore/mixin/mbd2/` |
| `MBDBlockRenderer` CTM 兼容 | `CDC-mod-src/src/main/java/io/github/jasonsimpart/createdelightcore/mixin/mbd2/` |
| Mixin 注册 | `CDC-mod-src/src/main/resources/mixins.createdelightcore.json` |
| 通用部件 `.sm` 与模型 | `ldlib/assets/mbd2/machine/`、`ldlib/assets/mbd2/models/` |
| 控制器到有限材质的 MVP 映射 | `kubejs/server_scripts/mbd2/` |
| CTM 图集与 metadata | `ldlib/assets/mbd2/textures/block/` |

Mixin 目标依赖具体版本，实施前需要重新核对 CDC `build.gradle` 中的 MBD2/LDLib 依赖和目标方法，并遵守 `CDC-mod-src/src/main/java/io/github/jasonsimpart/createdelightcore/mixin/AGENTS.md`。

## 推荐实施顺序

1. 用现有三套模型制作一个关闭共享的通用输入总线 MVP。
2. 用 KubeJS `onRecipeStatusChanged` 验证按控制器切换材质和状态时序。
3. 在 CDC 增加 MBD2 动态模型的条件式 CTM rebake，并验证现有机器不受影响。
4. 接通 `getPartAppearance(...)`，验证普通机壳与总线跨方块连接。
5. 将有限状态模型替换为通用自适应 renderer。
6. 扩展到输出总线、物品/流体输入仓和输出仓。

## 完整验证清单

- 安山、钢、锻钢三种控制器分别选择正确机壳。
- 同一个方块 ID 的不同实例不会互相污染材质缓存。
- 六个方向和不同朝向的功能面板均正确。
- 普通机壳与功能部件之间的边、角和内凹角 CTM 连续。
- 配方状态切换不会覆盖材质选择。
- 结构失效、重新成型、区块重载和客户端重连后外观正确。
- 物品栏模型使用稳定的默认材质，不依赖世界控制器。
- 没有 LDLib metadata 的 MBD2 模型不产生多余 rebake 或视觉变化。
- 多个相邻 MBD2 动态机器不会出现 ThreadLocal 上下文串用。
- 自适应部件不能被不同机壳控制器共享。

## 待决定事项

- 第一版通用部件是新注册方块，还是迁移并兼容现有三套总线 ID。
- 控制器外观固定按 definition ID 映射，还是允许结构匹配结果选择实际机壳。
- 标准机壳采用 sprite 替换，还是统一复用完整 casing baked model。
- 正面功能面板采用过滤原机壳 front quad，还是以轻微偏移的 overlay 叠加。
- LDLib metadata 检测使用公开 API、缓存表还是窄范围 accessor/mixin。
- 是否同时保留材质与 `working` 动画状态，以及状态组合的命名规则。
