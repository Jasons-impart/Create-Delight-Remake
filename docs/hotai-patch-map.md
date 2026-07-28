# HotAI 补丁地图

本文记录整合包 `hotai/` 目录下的 HotAI 二进制补丁意图和当前可确认行为。HotAI 本体由 `mods/hotai-1.0.jar` 提供，源代码参考 [friendlyhj/Hotai](https://github.com/friendlyhj/Hotai)。逐文件方法级明细和自动生成的目标 class 命中表见 `docs/hotai-badiff-details.md`。

## 文档组织

- 本文只保留 HotAI 机制、补丁领域概览和维护原则。
- `docs/hotai-badiff-details.md` 记录每个 `.badiff` 的代码化改动摘要、历史提交依据和当前适用性。
- `docs/hotai-badiff-details.md` 中的 `HOTAI_STATUS` 区块由 `scripts/update-hotai-docs.ps1` 生成；人工推测和方法级解释写在区块外。

## 运行机制

- 整合包实际使用的 `hotai-1.0.jar` 是 Forge ModLauncher `ITransformationService`，启动时读取游戏目录 `hotai/` 下的 `.badiff` 或 `.class`。
- `.badiff` 文件路径就是目标 class 的 internal name，例如 `hotai/com/simibubi/create/content/fluids/transfer/FluidDrainingBehaviour.badiff` 会补丁 `com/simibubi/create/content/fluids/transfer/FluidDrainingBehaviour`。
- `.badiff` 是针对目标 class 字节码的二进制 diff，和目标模组版本强绑定。目标 class 缺失或字节码变化过大时，补丁不会按预期生效，需看启动日志中的 `Patched class:`。
- GitHub 当前 HEAD 已移植到 NeoForge `ClassProcessorProvider`，但读取 `hotai/`、支持 `.badiff`、支持把 `.class` 转存为 `.badiff` 的核心语义与整合包使用的 Forge 版一致。

## 当前可还原确认的补丁

| 目标领域 | 补丁文件 | 行为变化 |
|---|---|---|
| Create 分液池/流体搜索 | `com/simibubi/create/content/fluids/transfer/FluidManipulationBehaviour.badiff`、`FluidDrainingBehaviour.badiff`、`compat/jei/category/ItemDrainCategory.badiff` | 抽液搜索增加可覆写的继续搜索钩子，分液池按源方块数量判断无限流体，而不是按访问过的流体方块数量；同时区分源流体和流动流体。JEI 分液展示在复制物品后重新检查 `FLUID_HANDLER_ITEM`，避免 capability 消失导致异常。 |
| Create 连接纹理缓存 | `com/simibubi/create/foundation/block/connected/CTSpriteShifter.badiff` | 将连接纹理缓存从 `HashMap` 改为 `ConcurrentHashMap`，降低并发注册/资源重载时的竞态风险。 |
| Create Liquid Fuel 液体烈焰人燃烧室 | `com/forsteri/createliquidfuel/core/BurnerStomachHandler.badiff`、`mixin/MixinBlazeBurnerTileEntity.badiff` | 液体燃料 tick 返回是否已处理并可取消原 tick 后续逻辑；向燃烧室倒入流体时按容量部分抽取、更新容器状态，并在失败路径显式返回 false，避免容器未扣除或溢出。 |
| Create Addition 超导电力线 | `com/mrh0/createaddition/index/CAItems.badiff`、`CABlocks.badiff`、`CABlockEntities.badiff`、`blocks/connector/ConnectorType.badiff`、`energy/WireType.badiff`、`WireConnectResult.badiff`、`IWireNode.badiff`、`energy/network/EnergyNetwork.badiff` | 注册 `superconducting_wire`、`superconducting_spool`、`superconducting_connector`，加入 `SUPERCONDUCTING` 线缆类型和 `Superconducting` 连接器类型；只允许两个超导连接器使用超导线缆互连，禁止超导/普通连接器混接或普通连接器使用超导线；能量网络缓冲上限提升到 `Integer.MAX_VALUE`，使用饱和加法并拒绝非正数推拉。配套资源、配方和掉落位于 `kubejs/assets/createaddition/`、`kubejs/server_scripts/Create Addition/`。 |
| Create Addition Ponder 清理 | `com/mrh0/createaddition/index/CAPonders.badiff` | 从 `FLUIDS` 标签和 `liquid_blaze_burner` 场景入口移除 `CAItems.STRAW`，保留烈焰人燃烧室本体的场景入口，避免吸管重复展示该 Ponder。 |
| Create New Age Ponder 清理 | `org/antarcticgardens/cna/content/ponders/CNAPonders.badiff` | 基于当前包路径移除 heating、heater、reactor、wires 场景和 `WIRING`、`HEATING`、`REACTOR` 标签，保留电气、磁力、发电和电机扩展 Ponder；配套结构位于 `kubejs/assets/create_new_age/ponder/`。 |
| TACZ 创造模式页签图标 | `com/tacz/guns/init/ModCreativeTabs.badiff` | 将 TACZ 弹药、配件和枪械页签图标从默认资产替换为整合包自定义 `create_armorer` / `applied_armorer` 资产，和 Kinetic Pixel、TACZ 配方线保持一致。 |
| Create Mechanical Spawner 刷怪实体创建 | `com/oierbravo/create_mechanical_spawner/foundation/utility/LivingEntityHelper.badiff` | 使用带 `ServerLevel`、`BlockPos`、`MobSpawnType.SPAWNER` 的实体创建入口，保留刷怪笼生成原因，减少依赖默认 `EntityType#create(Level)` 带来的兼容问题。 |
| Vintage Improvements Ponder | `com/negodya1/vintageimprovements/infrastructure/ponder/VintagePonderScene.badiff`、`VintagePonderTag.badiff` | 从 Ponder 场景和 `KINETIC_APPLIANCES` 标签中移除 `BELT_GRINDER` 条目，避免砂带磨床 Ponder 继续注册。 |
| Neapolitan 客户端页签编辑 | `com/teamabnormals/neapolitan/core/Neapolitan.badiff` | 客户端初始化时跳过 `NeapolitanBlocks.setupTabEditors()` 和 `NeapolitanItems.setupTabEditors()`，避免 Neapolitan 自行编辑创造页签。 |
| Better Compatibility Checker 状态 ping mixin | `dev/wuffs/bcc/mixins/ServerStatusPingerMixin.badiff` | 将匿名内部类捕获的 `ServerData` 改为反射查找，并兼容混淆/反混淆方法名；注入点改到响应处理尾部，降低字段名变化造成的 mixin 失败。 |
| Quality Food 方块掉落品质 | `de/cadentem/quality_food/mixin/BlockMixin.badiff` | 只在存在 `DropData` 且方块通过 `Utils.isValidBlock` 时应用方块品质，移除无上下文时对掉落物套品质的 fallback。 |

## 目标类未在当前 JAR 扫描中还原的补丁

以下 `.badiff` 文件存在于 `hotai/`，但按当前 `mods/*.jar` 直接查找同名 class 时未找到目标，分析时无法还原补丁后源码。它们可能是历史遗留、目标模组版本迁移后的无效补丁，或依赖实际启动环境中其他来源的 class；修改相关模组版本时必须用启动日志验证。

| 补丁文件 | 备注 |
|---|---|
| `com/mrh0/createaddition/blocks/connector/SuperconductingConnectorBlock.badiff`、`SuperconductingConnectorBlockEntity.badiff`、`SuperconductingConnectorBlockEntity$1.badiff` | 配套注册补丁会引用超导连接器类，但当前 `createaddition-1.20.1-1.3.3.jar` 直接扫描未找到这些 class；实际可用性需以最新启动日志和游戏内注册结果为准。 |

## 维护注意

- 更新目标模组时，先确认对应 class 路径仍存在，再看 `logs/latest.log` 是否出现每个目标的 `Patched class:`。
- 修改 `hotai/**/*.badiff` 后运行 `scripts/update-hotai-docs.ps1`，再运行 `scripts/update-hotai-docs.ps1 -Check` 或 `scripts/validate-knowledge-base.ps1`；校验会阻止生成状态区过期。
- 新增或替换补丁时优先保留 `.badiff`，不要把目标模组完整 class 当作长期源文件；HotAI 可在加载 `.class` 后自动转存为 `.badiff`。
- 超导连接器不仅依赖 HotAI 注册补丁，还依赖 `kubejs/assets/createaddition/` 的模型、贴图、语言和 `kubejs/server_scripts/Create Addition/` 的配方、标签、掉落。
