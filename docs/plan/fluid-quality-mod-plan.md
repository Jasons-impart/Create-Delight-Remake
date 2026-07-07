# Quality Food 流体品质附属 mod 设计方案

本文记录一个 Quality Food 附属 Forge mod 的设计方向：把 Quality Food 的物品品质扩展到可被 Create 管道、储罐和加工线使用的“品质流体”，但不把品质变成可免费复制或随意混合的隐藏数值。

## 背景观察

当前整合包已经把 Quality Food 当成核心食物经济系统使用：

- `kubejs/server_scripts/Quality Food/tags.js` 扩展了可带品质的作物、食材和方块。
- `kubejs/server_scripts/Quality Food/absorber.js` 与 `kubejs/server_scripts/mbd2/life_matter_extractor.js` 把带品质物品回收为生命质。
- `docs/plan/quality-harvest-life-matter-plan.md` 已经确立原则：品质自动化需要额外成本，不能通过普通静态配方直接输出带品质 NBT。
- `CDC-mod-src` 通过 mixin 接入 Quality Food，主要围绕作物收获、物品配方传播、AE2 终端和订单系统。

Quality Food 自身的核心模型仍然是“物品品质”和“方块/世界数据”：

- `Quality` 等级为 `NONE`、`IRON`、`GOLD`、`DIAMOND` 等，正式品质等级对应 `level()` 1 到 3。
- `QualityUtils.QUALITY_TAG` 为 `quality_food`，内部品质键为 `quality`。
- `LevelData` 是挂在 `Level` 上的 capability，用 `BlockPos.asLong()` 保存方块位置品质；序列化时直接把位置 long 写成 NBT key。
- `BlockItemMixin` 在方块物品放置成功后读取手中物品品质，并把品质写入 `LevelData` 的被点击位置；无品质玩家放置会写 `NONE_PLAYER_PLACED`。
- `LevelMixin` 在原位置从有效品质方块变成无效方块时清除 `LevelData`。
- `Utils.isValidBlock` 只认 `quality_food:quality_blocks` 或能反查为有效物品的方块；流体方块不会天然进入这套逻辑。
- `Utils.storeQuality(state, level, sourcePos, targetPos, chance)` 可以把一个位置的品质转存到另一个位置，是世界状态传播的可借鉴模型。
- Create 兼容主要在 Basin、Fan、RecipeApplier、Harvester 等物品加工路径传播品质。

因此流体品质不应试图绕开 Quality Food 另起一套品质系统。这个 mod 应明确作为 Quality Food 附属存在，直接复用 `Quality`、`QualityUtils`、`LevelData` 的语义，并通过 mixin、accessor 和专用数据补上流体存储、传输、混合、配方传播和物品互转的规则。

## 设计目标

- 让果汁、奶昔、冰淇淋液、糖浆、奶油、面糊等食物流体能承载品质。
- 让 Create 的倒出、注入、搅拌、储罐、管道在明确边界内保留品质。
- 当流体确实能作为世界方块放下时，让源方块也能保存、展示和被取回品质。
- 让 KubeJS 和数据包能声明哪些流体可带品质，以及不同工艺如何传播或损耗品质。
- 明确硬依赖 Quality Food，直接使用它的品质等级、物品 NBT 和世界品质语义。
- 防止品质复制：一个带品质物品被流体化后，只能按体积守恒转成有限量品质流体，不能通过加水、混罐或循环填充无成本扩增。

## 非目标

- 不为每一种流体注册 3 个额外品质流体，例如 `iron_milk`、`gold_milk`、`diamond_milk`。
- 不让任意 Forge 流体容器都自动可靠保存品质，除非验证其 `FluidStack` NBT 行为。
- 不让普通水、熔岩、燃料、酸、熔融金属等工业流体默认参与品质系统。
- 不提供“品质流体 + 普通食物 = 带品质食物”的通用静态配方。
- 不强行让 `VirtualFluid` 或本来不能放置的流体获得世界方块形态。
- 不做脱离 Quality Food 的备用品质实现；没有 Quality Food 时不加载本 mod。
- 不把普通流动方块伪装成 Quality Food 作物/食品方块，避免误触掉落品质和 `NONE_PLAYER_PLACED` 语义。
- 第一版不重写所有第三方机器，只覆盖 Create 食物流体主链路和明确注册的容器。

## 实现立场

这是 Quality Food 的流体侧附属，不是通用品质框架。实现时优先直接 import Quality Food 的公开类；公开类不够用时，使用 accessor 或 mixin 补出需要的读写入口，而不是在本 mod 内复制一套相似但不同源的品质语义。

可以直接依赖的 Quality Food 内容包括：

- `de.cadentem.quality_food.core.Quality`
- `de.cadentem.quality_food.util.QualityUtils`
- `de.cadentem.quality_food.capability.LevelData`
- Quality Food 现有的方块品质、物品 NBT、掉落和显示规则

本 mod 自己只新增“流体如何承载、传输和落到世界位置”的规则；一旦流体品质需要回到物品或食品方块语义，应尽量回交给 Quality Food 原本的逻辑处理。

## 核心结论

推荐使用双层数据模型：

1. 容器和机器内使用 `FluidStack` NBT 承载 Quality Food 品质等级。
2. 世界中已放置的流体源方块保存位置品质，并在需要时桥接到 Quality Food 的 `LevelData` 语义。

第一版只允许同流体同品质合并：

```text
FluidStack tag:
{
  quality_food_fluids: {
    quality: 0-3,
    version: 1
  }
}
```

理由：

- Forge `FluidStack` 本身支持 NBT，适合作为跨管道、跨储罐的最小承载格式。
- 不注册品质变体流体，避免配方、贴图、tag 和 JEI 展示爆炸。
- 同品质合并规则最容易防复制，也最容易解释：铁品质牛奶和普通牛奶不是同一批次。
- 世界流体没有可携带 NBT 的 `BlockState`，只能额外按维度和方块位置保存品质。
- 品质等级、显示文案、食物效果和物品 NBT 都以 Quality Food 为准，本 mod 不定义第二套品质来源。

需要注意：不是所有流体处理器都严格保留或区分 `FluidStack` NBT。第一阶段必须把“已验证支持品质”的交互范围写清楚，未验证容器输入时默认清除或拒绝品质。

## 品质流体语义

品质只表示这一批流体的原料质量，不表示营养值、温度、污染度或浓度。

默认等级：

| 等级 | 含义 | 对应 Quality Food |
|---:|---|---|
| 0 | 无品质 | `NONE` |
| 1 | 铁品质 | `IRON` |
| 2 | 金品质 | `GOLD` |
| 3 | 钻石品质 | `DIAMOND` |

混合规则第一版保持保守：

- 同流体、同品质：可以合并。
- 同流体、不同品质：普通储罐和管道拒绝合并，专用混合配方才能处理。
- 带品质流体和无品质同种流体：默认拒绝合并，除非配方声明“稀释并降级”。
- 不同流体：按原机器规则处理，输出品质由配方策略决定。

专用混合策略可以后续扩展：

| 策略 | 作用 |
|---|---|
| `lowest` | 输出取所有相关输入的最低品质，适合奶昔、面糊、汤底 |
| `weighted_average_floor` | 按体积和品质权重计算，向下取整，适合大批次混合 |
| `require_all_quality` | 任一相关输入无品质则输出无品质 |
| `primary_input` | 输出继承主输入品质，适合果汁加糖浆等主料明确的工艺 |
| `clear` | 明确清除品质，适合高温、离心、化工或非食品工艺 |

## 数据入口

使用 tag 和数据 JSON，而不是硬编码整合包物品。

推荐 tag：

| tag | 含义 |
|---|---|
| `#quality_food_fluids:quality_fluids` | 可以承载品质的流体 |
| `#quality_food_fluids:quality_containers` | 可以把品质流体装成品质物品的容器 |
| `#quality_food_fluids:quality_sources` | 可以被抽取为品质流体的带品质物品 |
| `#quality_food_fluids:world_quality_fluids` | 可以作为世界方块保存品质的可放置流体 |
| `#quality_food_fluids:source_only_world_quality_fluids` | 只允许源方块保存品质，不让流动方块扩散品质 |
| `#quality_food_fluids:clear_quality_fluids` | 明确禁止携带品质的流体 |

推荐数据文件：

```json
{
  "fluid": "createdelightcore:red_grapejuice",
  "source_items": ["vinery:red_grape"],
  "unit": 250,
  "policy": "primary_input",
  "max_quality": 3
}
```

整合包侧第一批适合接入的流体：

- 葡萄汁：`createdelightcore:*_grapejuice`
- 冰淇淋液：`cosmopolitan:*_ice_cream`
- 奶昔：`create_central_kitchen:*_milkshake`、`createdelightcore:*_milkshake`
- 糖浆、奶油、面糊：`createdelight:*_syrup`、`cosmopolitan:cream`、`createdelight:cake_batter`

明确不建议接入：

- `minecraft:water`、`minecraft:lava`
- 工业燃料、原油、酸、冷却剂
- 熔融金属和核反应堆相关流体
- 没有明确食品语义的通用加工液

## API 草案

附属 mod 提供一个稳定 API 包，供 CDC、KubeJS helper 或其他兼容 mod 调用；因为这是 Quality Food 硬依赖附属，API 类型直接暴露 Quality Food 的 `Quality`：

```java
public final class QualityFoodFluidsApi {
    public static Quality getQuality(FluidStack stack);
    public static boolean hasQuality(FluidStack stack);
    public static FluidStack withQuality(FluidStack stack, Quality quality);
    public static FluidStack clearQuality(FluidStack stack);
    public static boolean canCarryQuality(FluidStack stack);

    public static Quality getItemQuality(ItemStack stack);
    public static ItemStack applyItemQuality(ItemStack stack, Quality quality);

    public static FluidStack copyItemQualityToFluid(ItemStack source, FluidStack fluid);
    public static ItemStack copyFluidQualityToItem(FluidStack source, ItemStack item);

    public static Quality getWorldQuality(LevelAccessor level, BlockPos pos);
    public static void setWorldQuality(LevelAccessor level, BlockPos pos, Quality quality);
    public static void clearWorldQuality(LevelAccessor level, BlockPos pos);
    public static FluidStack copyWorldQualityToFluid(LevelAccessor level, BlockPos pos, FluidStack fluid);
    public static void copyFluidQualityToWorld(FluidStack source, LevelAccessor level, BlockPos pos);
}
```

实现规则：

- `getItemQuality` 直接调用 `QualityUtils.getQuality(item)`。
- `applyItemQuality` 直接调用 `QualityUtils.applyQuality(item, quality)`。
- 清除品质可以通过 mixin/accessor 提供明确 helper；必要时直接移除 `QualityUtils.QUALITY_TAG`。
- 流体 NBT 中保存 `quality.level()` 或 `quality.ordinal()` 均可，但对外 API 应返回 `Quality`。
- 可以为 `QualityUtils`、`LevelData` 或 Quality Food 的 mixin 上下文补 accessor，避免在业务代码里散落 NBT 字符串。

## 世界流体品质

如果流体能放进世界，品质应跟随“源方块批次”存在，而不是跟随普通流动方块无限扩散。推荐新增 `WorldFluidQualityData`，并把它视为 Quality Food `LevelData` 的流体侧扩展：

```text
Dimension -> Long2ObjectMap<WorldFluidQuality>

WorldFluidQuality:
{
  fluid: "createdelightcore:red_grapejuice",
  quality: 1-3,
  source: "bucket|pipe|create_hose|debug",
  placedGameTime: long,
  volume: 1000
}
```

存储规则：

- key 使用 `BlockPos.asLong()`，与 Quality Food `LevelData` 的位置索引方式一致。
- value 必须同时保存流体 ID；读取时如果当前位置 `FluidState` 已不是同一种流体，立即清除该记录。
- 默认只记录源方块；流动方块不复制品质，避免一桶钻石品质果汁铺成整片品质湖。
- 如果需要让流动方块短暂显示品质，可只在客户端粒子或 overlay 上从最近源方块推断，不写入正式存档。
- `LevelEvent.Unload` 时清理缓存，存档数据走 `SavedData` 或 level capability 均可；第一版推荐 `SavedData`，跨维度和调试更直接。

放置和取回规则：

| 入口 | 行为 |
|---|---|
| 品质桶右键放置 | 在实际放下的源方块位置写入世界流体品质 |
| `BucketItem.emptyContents` / `DispenseItemBehavior` | mixin 捕获成功放置位置，写入品质 |
| Create Hose Pulley / open-ended pipe 放置流体 | 如果 `FluidStack` 带品质且目标是源方块，写入世界品质 |
| 玩家或机器取走源方块 | 输出 `FluidStack` 或桶继承世界品质，然后清除该位置 |
| 源方块被替换、蒸发、凝固或交互转成方块 | 清除世界品质；如转成食品方块，需要专用规则才继承 |

与 Quality Food `LevelData` 的关系：

- 本 mod 可以直接依赖并调用 `de.cadentem.quality_food.capability.LevelData`，也可以通过 accessor/mixin 暴露更方便的读写入口。
- 普通流体源方块默认仍建议保存在 `WorldFluidQualityData`，因为 Quality Food `LevelData` 把位置解释为品质方块/作物位置，会参与掉落品质、有效方块清理和 `NONE_PLAYER_PLACED` 逻辑。
- 当某个品质流体凝固、冷却或交互转成 `quality_food:quality_blocks` 中的食品方块时，应把世界流体品质写入 Quality Food `LevelData`，让后续破坏、掉落和展示走原生 Quality Food 逻辑。
- 可以直接复用或 mixin `Utils.storeQuality` 的接口形态，例如补一个 `QualityFoodFluidsHooks.storeWorldFluidQuality(level, fromPos, toPos, chance)`。
- 如果实测 Quality Food 的 `LevelData` 对特定流体源方块没有副作用，也可以为 `#quality_food_fluids:level_data_backed_world_fluids` 开一条配置化路径，直接把这类源方块写入 `LevelData`；第一版不把它作为默认。

流动和混合规则第一版保持严格：

- 品质源方块流出去的非源流体不保存品质。
- 两个不同品质源方块相邻时不自动平均、不自动升级、不自动污染。
- 普通无限水源逻辑不适用于品质流体；`world_quality_fluids` 默认不应包含可形成无限源的流体。
- Hose Pulley 判定无限流体时，品质必须被清除或拒绝抽取，不能从无限湖抽出无限品质流体。

可选的后续方向是“品质流体源簇”：同一批次可记录多个源方块和总量，用于大桶倾倒或专用多方块池。但第一版不建议做，调试和防复制成本会明显上升。

## Create 兼容

第一阶段优先覆盖这些路径：

| Create 路径 | 规则 |
|---|---|
| Emptying / Item Drain | 带品质物品倒出为白名单流体时，流体继承物品品质 |
| Filling / Spout | 品质流体装入可带品质食品或饮品时，输出物品继承流体品质 |
| Basin Mixing / Compacting | 输出流体或物品按配方策略结算品质 |
| Fluid Tank / Pipe | 保留 `FluidStack` NBT；不同品质同流体不自动合并 |
| Smart Fluid Pipe / Filter | 过滤可选择是否匹配品质，第一版默认只按流体种类 |
| Hose Pulley / Open-ended Pipe | 抽取品质世界源方块时复制品质；向世界放置品质流体源时写入世界品质；无限流体场景清除或拒绝品质 |

需要重点验证的 Create 细节：

- `SmartFluidTank` 是否在所有插入、序列化、网络同步路径保留 tag。
- 管道流体传输是否会创建不带 tag 的新 `FluidStack`。
- Basin 配方消耗多个流体输入时，输入 tag 是否能被 recipe applier 读到。
- Hose Pulley 和 open-ended pipe 是否能拿到目标 `BlockPos` 与参与交互的 `FluidStack` tag。
- Ponder、goggles、Jade 或 tooltip 是否能展示品质，避免玩家看不出管道里为什么不能混合。

如果发现 Create 某些流体路径会丢 tag，第一版可以收窄支持范围：

- 只保证本 mod 的品质储罐和 Create Basin/Spout/Drain 端点。
- 管道传输只作为已验证兼容项开放。
- 未验证第三方容器抽取时默认清除品质或拒绝抽取。

## KubeJS 兼容

推荐提供 KubeJS server API：

```js
QualityFoodFluidsEvents.rules(e => {
  e.qualityFluid("createdelightcore:red_grapejuice")
    .sourceItem("vinery:red_grape")
    .unit(250)
    .policy("primary_input")
    .maxQuality(3)
})
```

推荐提供 recipe helper：

```js
qualityFoodFluids.retain("createdelight:mixing/red_grapejuice", {
  policy: "primary_input",
  primary: "vinery:red_grape"
})

qualityFoodFluids.clear("createdelight:big_centrifugation/separation/chocolate_milkshake")
```

这样整合包可以把现有大量 `create.mixing`、`create.filling`、`create.emptying` 食物流体配方逐步接入，而不用在每条 KubeJS 配方里手写 NBT。

## 玩家流程

第一版目标流程：

1. 玩家通过手动种植和 Quality Food 机制获得带品质葡萄、草莓、香草等食材。
2. 使用分液池、注液器或搅拌盆把带品质食材转为品质流体。
3. 品质流体在已验证的 Create 储罐和管道中作为独立批次流转。
4. 如果流体可放置，玩家可以把品质流体作为源方块短期存放或展示；取回时保留品质。
5. 使用注液器把品质流体装回饮品、冰品、面糊制品或订单食物。
6. 订单系统或售卖系统按最终物品品质结算价值。

关键限制：

- 品质流体不会凭空提升无品质物品。
- 有品质的流体批次不能无成本被普通流体稀释扩容。
- 配方必须显式声明传播策略，否则默认清除品质。

## 仓库结构建议

仓库名建议：`QualityFoodFluids`。modid 建议使用 `quality_food_fluids`，明确表达它是 Quality Food 附属，而不是通用品质系统。

```text
QualityFoodFluids/
├── build.gradle
├── gradle.properties
├── settings.gradle
├── src/main/java/
│   └── io/github/createdelight/qualityfoodfluids/
│       ├── QualityFoodFluids.java
│       ├── api/
│       ├── create/
│       ├── kubejs/
│       ├── jade/
│       ├── data/
│       ├── world/
│       ├── mixin/
│       └── registry/
├── src/main/resources/
│   ├── META-INF/mods.toml
│   ├── quality_food_fluids.mixins.json
│   ├── data/quality_food_fluids/tags/fluids/
│   └── assets/quality_food_fluids/lang/
└── README.md
```

依赖建议：

| 依赖 | 类型 | 用途 |
|---|---|---|
| Forge 47.x / Minecraft 1.20.1 | 必需 | 整合包版本对齐 |
| Quality Food | 必需 | 品质等级、物品 NBT、世界方块品质和食品效果的唯一来源 |
| Create | 必需或强建议必需 | Spout、Drain、Basin、Tank、Hose Pulley 是第一版核心目标 |
| KubeJS | 可选 | 数据和配方策略脚本入口 |
| Jade / JEI | 可选 | 展示和调试 |

第一版建议在 `mods.toml` 中硬依赖 Quality Food；Create 如果第一版核心就是 Create 流体链路，也可以硬依赖。KubeJS、Jade、JEI 保持软依赖即可。

## 第一阶段里程碑

### M1：核心数据层

- 注册 `QualityFoodFluidsApi`。
- 完成 `FluidStack` NBT 读写、清除、复制。
- 添加 `#quality_food_fluids:quality_fluids`、`#quality_food_fluids:world_quality_fluids` 和 `#quality_food_fluids:clear_quality_fluids`。
- 添加单元测试或 GameTest：序列化、反序列化、同品质合并、不同品质拒绝。

### M2：世界流体数据层

- 新增 `WorldFluidQualityData`，按维度和 `BlockPos.asLong()` 保存源方块品质。
- 实现放置、替换、取回、区块卸载和存档重载后的清理规则。
- GameTest 覆盖品质桶放置、取回、源方块被替换、流动方块不复制品质。

### M3：Quality Food 深度接入

- 直接 import `QualityUtils`、`Quality` 和 `LevelData`。
- 实现物品品质、流体品质和世界流体品质的互转。
- 为 Quality Food 需要的私有逻辑补 accessor/mixin，减少直接手写 `quality_food` NBT。
- 明确普通世界流体默认写入 `WorldFluidQualityData`；“流体凝固为食品方块”等专用规则再写入 Quality Food `LevelData`。
- 验证 `quality_food` tag 不被错误残留或破坏。

### M4：Create 最小闭环

- Emptying：品质食材到品质流体。
- Filling：品质流体到品质饮品或食品。
- Basin：按 `primary_input` 和 `lowest` 两种策略传播。
- Tank/Pipe：验证或补 mixin 保留 `FluidStack` tag。
- Hose Pulley / Open-ended Pipe：验证世界品质流体的放置、抽取和无限流体边界。

### M5：整合包接入

- 先接葡萄汁链路，因为 `kubejs/server_scripts/Lets Do/bug_fix.js` 已经有清晰的葡萄汁 emptying/filling/mixing。
- 再接冰淇淋和奶昔链路，因为 `kubejs/server_scripts/Custom/food/icecream.js` 已经统一封装 `make_ice_cream`。
- 最后接面糊、糖浆、奶油等更容易混配的批量食物流体。

## 验证清单

- 品质葡萄 emptying 后得到同等级品质葡萄汁。
- 品质葡萄汁 filling 回瓶装葡萄汁后保留品质。
- 铁品质葡萄汁和普通葡萄汁不能在普通储罐里无提示合并。
- 铁品质葡萄汁和金品质葡萄汁不能被普通管道自动混成更大量品质流体。
- 无品质输入参与未声明策略的配方时，输出品质被清除。
- Quality Food 硬依赖声明正确；缺失时由加载器给出明确依赖错误。
- 服务端重启后品质流体储罐保存品质。
- 品质桶放下源方块后，世界品质数据保存；取回桶后继承品质。
- 品质源方块流动出的普通流动方块不保存品质。
- Hose Pulley 不能从无限品质流体场景抽出无限品质 `FluidStack`。
- 品质流体源方块被其他方块替换后，世界品质数据被清理。
- 客户端 tooltip、Jade 或 goggles 能看到品质等级。

## 风险与待确认

- Create 是否在所有流体网络路径保留 `FluidStack` NBT，需要实测或补 mixin。
- Forge 流体过滤器、桶、第三方储罐和 AE2 流体单元对 NBT 的支持不一致，不能默认承诺全兼容。
- 世界流体没有原生 NBT，必须额外维护位置数据；流动、替换、区块加载和流体交互都可能留下脏数据。
- Quality Food `LevelData` 适合品质作物和食品方块；如果直接承载可流动液体，需要验证不会误触掉落、清理和 `NONE_PLAYER_PLACED` 逻辑。
- Create Hose Pulley 的无限流体规则是最大复制风险点，必须优先验证。
- KubeJS 配方生成量很大，需要规则系统降低手工维护成本。
- 如果品质流体进入订单经济，必须重新评估高品质饮品和冰品的价值倍率。
- 需要决定不同品质同流体在储罐里是“拒绝合并”还是“专用多批次储罐”。第一版推荐拒绝合并，后续再做多批次品质储罐。

## 推荐取舍

第一版做小但扎实：

1. 只支持 `#quality_food_fluids:quality_fluids` 白名单。
2. 只支持 0 到 3 的 Quality Food 对齐等级。
3. 普通储罐只允许同品质合并。
4. 未声明传播策略的配方默认清除品质。
5. 世界流体品质只记录源方块，不记录普通流动方块。
6. Hose Pulley 和无限源场景先按清除或拒绝品质处理。
7. 先完成葡萄汁和冰淇淋/奶昔两条链路，再扩展到全部食品流体。

这条路线能让流体品质成为 Create 食品自动化的真实系统，而不是一个藏在 NBT 里的奖励复制器。
