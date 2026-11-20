# CGT 流体 JEI 与代理临时兼容

适用基线为 Forge 1.20.1、CGT `1.2.0`、FluidLogistics `1.3.2` 和 QFF `0.1.4`。当前 QFF 载荷为 `quality_food_fluids-1.20.1-0.1.4-cdr-vinegar-compat2.jar`，FluidLogistics 仍为 `fluidlogistics-1.3.2-mc1.20.1-cdr-vinegar-compat1.jar`；两个对应的 `mods/*.pw.toml` 指向本仓库载荷，不保留指向未修复上游文件的 CurseForge 提示。

## 当前行为

- CGT 的 JEI 额外流体列表通过 QFF 的可选客户端 `CgtJeiPluginMixin` 收敛为每种 source fluid 一个 1000 mB、无 NBT 的普通代表；只转换列表样本，不修改真实配方或已储存流体。
- CGT 的 JEI 装瓶、分液样本通过可选客户端 `CgtJeiDrinkRecipesMixin` 收敛为每种酒一组基础配方；灌装流体输入和分液流体输出使用无 NBT 副本并保留原容量。无 `DrinkVariant` 时 CGT 默认酿造等级为 0，因此不追加等级效果提示或品质后缀；不修改真实 `DrinkFluidConversions`、服务器配方或储存数据。
- QFF 不再向 JEI 运行时追加铁、金、钻石品质流体；真实流体的品质和配方匹配功能继续保留。CGT 的冗余 `DrinkVariant` 不参与 QFF 的 JEI subtype，其他原生 NBT 继续区分。
- FluidLogistics 原本在物品注册阶段建立代理；CGT 更晚在流体类型注册阶段根据酒物品动态发现并登记流体。临时包以可选 `AFTER creategearsandtavern` 排序，在同一阶段补齐遗漏代理，保留原代理 ID，并为 JEI/EMI 缺代理的拖放增加守卫。
- FluidLogistics 的 JEI 隐藏列表为空时跳过 `removeIngredientsAtRuntime`，避免 JEI 拒绝空集合而中断该插件回调。

## 源码与验证

| 内容 | 位置或依据 |
|---|---|
| QFF 本次增量 | [quality-food-fluids.patch](quality-food-fluids.patch)，基于本机 `D:/Project/QualityFoodFluids` 的既有 0.1.4 开发状态；该目录在任务前已有未提交实现，补丁只记录本次增量，不能直接应用到旧的公开 HEAD。 |
| QFF 配方展示增量 | [quality-food-fluids-recipes.patch](quality-food-fluids-recipes.patch)，基于 QFF `f7416e5a605ba66be926c4fc3fa5b41dc0cf298a`；本机源码提交 `2ba87dd`，在上一轮列表兼容之上加入 JEI 配方归一化。 |
| FluidLogistics 增量 | [fluidlogistics.patch](fluidlogistics.patch)，基于 [1.20.1 分支](https://github.com/yision1/CreateFluidLogistics/tree/1.20.1) 的 `2bd458c5f88864219afd0fb09bc2e4211a435a07`；本机修复提交 `dff9ca0`。 |
| CGT 实际目标 | `creategearsandtavern-1.2.0-1.20.1.jar`；[公开源码](https://github.com/yision1/GearsandTavern/tree/1.20.1) 当时仍为 1.1.9，不能直接构建替换当前包。 |
| 原始崩溃 | `crash-2026-11-19_19.55.01-client.txt`：`No fluid proxy registered for creategearsandtavern:vinegar`，由 JEI ghost target 调入 `FluidProxyRegistry.createKey`。 |
| 自动回归 | Java 17 构建通过；加载实际 CGT 1.2.0、KT 1.2.0 和修复版 FluidLogistics 的 Forge GameTest 17/17 通过：40 种饮料四档品质的代理与 NBT 回归，以及实际 CGT 类生成的 40 条无 NBT 灌装、40 条无 NBT 分液配方、容量一致和真实酿造等级 6 转换保留 NBT。生产配方 Mixin 通过测试专用启动配置在隔离 GameTest 进程实际应用；测试类与测试配置不进入发布 JAR。 |
| 客户端回归 | 可选列表 Mixin 随隔离客户端正常启动；用户于 2026-11-19 确认过滤器拖放可用。2026-11-21 的基础 JEI 配方展示已部署，需重启后由用户确认界面。 |

## 撤销条件

作者表示下一次发布会修复代理注册问题。**更新新版 FluidLogistics（流包）和 CGT，确认新版包含上游修复且回归通过后，回滚此临时兼容修复。**具体撤销代理补登记、对应排序与缺代理拖放守卫，并复核是否还需要 CGT 列表 Mixin/subtype 兼容；恢复上游 Packwiz 来源并移除不再使用的临时载荷与补丁。

用户要求 JEI 列表及酒类配方只显示普通流体是独立的显示偏好；升级时应保留该行为，并复核 `CGTJeiDrinkRecipes.samples/registerRecipes` 的注入点，或使用等价原生选项。复核时至少检查醋列表和装瓶/分液配方数量、容量与效果提示、属性过滤器拖放，以及已有过滤器和带品质酒液保存后重进仍正常。
