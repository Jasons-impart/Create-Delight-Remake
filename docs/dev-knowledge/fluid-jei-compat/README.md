# CGT 流体 JEI 与拖放崩溃修复记录

JEI 展示兼容的验证基线为 Forge 1.20.1、CGT `1.2.0`、CDC `2.2.16v` 和 QFF `0.1.4`。配对的 QFF 载荷为 `quality_food_fluids-1.20.1-0.1.4-cdr-vinegar-compat3.jar`。CDC 子模块和打包 JAR 对应 Core `1.20.1` 的合并提交 `d19d83f8`，其源码树与运行时回归版本一致。

## 当前行为

- CGT 的 JEI 额外流体列表通过 CDC 的可选客户端 `CgtJeiPluginMixin` 收敛为每种 source fluid 一个 1000 mB、无 NBT 的普通代表；只转换列表样本，不修改真实配方或已储存流体。
- CGT 的 JEI 装瓶、分液样本通过可选客户端 `CgtJeiDrinkRecipesMixin` 收敛为每种酒一组基础配方；灌装流体输入和分液流体输出使用无 NBT 副本并保留原容量。无 `DrinkVariant` 时 CGT 默认酿造等级为 0，因此不追加等级效果提示或品质后缀；不修改真实 `DrinkFluidConversions`、服务器配方或储存数据。
- CDC 的 `CgtJeiFluidSubtypeMixin` 在 JEI subtype 查询的流体副本上仅删除 CGT 的 `DrinkVariant`，防止基础流体与酿造等级变体分裂配方查找；其他原生 NBT 继续区分。以上三个 Mixin 只登记在客户端，且仅要求 CGT 与 JEI 存在，不依赖 QFF。
- 同时安装 CGT 和 QFF 时，CDC 的 `CgtJeiSubtypeRegistrationMixin` 在 CGT 的源流体和流动流体注册点调用 QFF 的 `canCarryQuality`。命中时由 QFF 注册，其他酒液由 CGT 注册。打包客户端交换两个插件的注册顺序后，醋和流动醋均由 QFF 注册，燃烧瓶酒液的两种形态均由 CGT 注册。
- QFF 不再向 JEI 运行时追加铁、金、钻石品质流体；真实流体的品质和配方匹配功能继续保留。QFF 主代码不再包含 CGT 专用实现。

## 源码与验证

| 内容 | 位置或依据 |
|---|---|
| CDC 展示兼容 | 源码在 `CDC-mod-src/src/main/java/io/github/jasonsimpart/createdelightcore/{compat,mixin}/creategearsandtavern/`。`dab4ab9` 迁入流体列表、装排液和 subtype 的展示归一化。`d19d83f8` 增加 CGT 与 QFF 的 subtype 注册分工。复核入口见 [CDC 兼容台账](../../../CDC-mod-src/docs/dev-knowledge/compatibility-patches.md)。 |
| QFF 通用展示 | 迁出提交 `b228658` 已合入 QFF `main`（`f8e60043`）；`QualityFoodFluidsJeiPlugin` 不再调用 `addIngredientsAtRuntime` 追加品质流体，原有品质配方查找与传递保留。旧的 CGT 增量补丁已退役，历史见 Git。 |
| CGT 实际目标 | `creategearsandtavern-1.2.0-1.20.1.jar`；[公开源码](https://github.com/yision1/GearsandTavern/tree/1.20.1) 当时仍为 1.1.9，不能直接构建替换当前包。 |
| 原始崩溃 | `crash-2026-11-19_19.55.01-client.txt`：`No fluid proxy registered for creategearsandtavern:vinegar`，由 JEI ghost target 调入 `FluidProxyRegistry.createKey`。 |
| 自动回归 | QFF 与 CDC 的 Java 17 完整构建通过，CDC refmap 检查通过。使用 QFF 隔离 GameTest harness 加载本次 CDC 生产 helper、三个 Mixin 和实际 CGT 1.2.0、KT 1.2.0、修复版 FluidLogistics，17/17 通过：40 种饮料四品质代理、40 条基础灌装与 40 条基础分液的容量及无 NBT、真实酿造等级 6 转换保留 NBT、列表副本与 subtype。该结果不代表完整 CDC 客户端或全部 GameTest 已回归；测试类和测试配置不进入生产 JAR。 |
| 客户端回归 | 用户于 2026-11-19 确认旧配对的过滤器拖放可用。2026-11-21 的打包客户端在有 QFF 的专用服上登录和重载时没有 CGT 流体重复注册。无 QFF 的单机读取到 40 条基础灌装和 40 条基础分液配方，流体均无 NBT。 |

## 属性过滤器拖放崩溃：上游已解决

FluidLogistics `1.3.2` 在物品注册阶段建立代理，早于 CGT 在流体类型注册阶段登记酒液。因此从 JEI 拖入 Create 的属性过滤器时，缺少代理会触发异常。2026-11-21 用户确认新版已修复该问题，本地运行 JAR 与 [FluidLogistics 官方 1.3.3](https://www.curseforge.com/minecraft/mc-mods/create-fluidlogistic/files/9712725) 的哈希一致。Packwiz 已恢复官方来源，旧临时载荷和补丁已移出当前工作区。

用户要求 JEI 列表及酒类配方只显示普通流体是独立的显示偏好；升级时应保留该行为，并复核 `CGTJeiDrinkRecipes.samples/registerRecipes` 的注入点，或使用等价原生选项。复核时至少检查醋列表和装瓶/分液配方数量、容量与效果提示、属性过滤器拖放，以及已有过滤器和带品质酒液保存后重进仍正常。
