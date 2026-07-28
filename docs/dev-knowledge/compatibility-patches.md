# 兼容与问题修复（bugfix/compat）台账

本台账记录恢复预期行为、修复回归或适配上游变化的改动。KubeJS、配置、HotAI、CDC 和 mixin 都可能承载这类修复，但目录不决定分类；有意新增或调整玩家体验的改动应记入 `content-map.md`。

## 分类原则

| 改动目的 | 记录位置 | 说明 |
|---|---|---|
| 新增或有意调整玩法、平衡、NPC、剧情、任务、物品、机器或系统 | `content-map.md` | 内容改动（feat），记录玩家可见意图、实现位置和状态。 |
| 恢复预期行为、修复错误或回归、适配上游模组变化 | 本台账 | 兼容与问题修复（bugfix/compat），记录问题、补丁、验证和复核/移除条件。 |

按一个明确目的汇总一行，不要求每个配方、配置或 JSON 单独立项；同一目标新增文件时更新该行的路径与验证状态即可。

| 修复 | 类型 | 问题或根因 | 补丁位置 | 验证与跟踪 | 复核/移除条件 | 状态 |
|---|---|---|---|---|---|---|
| 虚拟卫星持久数据、远程区块与实体航点 | 自定义玩法修复 | 首版部署读取不存在的 `level.gameTime`，使裸 `NaN` 破坏 JSON；远程高度查询未先生成区块，只得到空区块高度，且 Rhino 无法消歧 `WorldBorder.isWithinBounds(BlockPos/AABB)`；只写 `SpaceAtlasContent` 而不放置航点时，Northstar 发射阶段还会在目的地坐标查询 `ROCKET_WAYPOINT` POI 并报“缺少火箭航点”。 | `kubejs/server_scripts/Northstar/virtual_satellite_navigation.js`：改用 `level.time` 并迁移非有限数值；采样前调用 `ServerLevel.getChunk`，边界检查使用双坐标重载；在地表上一格通过 `setBlockAndUpdate` 放置 `northstar:rocket_waypoint`，将同一坐标和非空方向写入星图，并清理首版低一格的旧目的地；临时 `[CD-SAT]` 聊天与信息日志已在验证后移除，仅保留真正的异常错误日志。 | 数据卡 `-6240,-2432` 解析到地表 `-6256,276,-2448`，实际航点和星图目的地均为 `-6256,277,-2448`；`execute if block` 与 `/locate poi northstar:rocket_waypoint` 均确认航点及 POI，脚本热重载 340/340、0 错误，用户确认火箭可使用。 | 重启持久化与其他星球仍需回归；若正式系统迁移到 CDC `SavedData`，删除 KubeJS 迁移代码。 | 主世界实际发射已验证 |
| 月球废弃空间站缺少实体航点 | 自定义玩法修复 | 轨道遥测扫描仪只把栈桥坐标写入星图，目标处仍是 `create:metal_girder`，Northstar 发射时无法在该精确位置找到 `ROCKET_WAYPOINT` POI。 | `kubejs/server_scripts/Northstar/lunar_farside.js`：统一计算栈桥目的地坐标，在首次建站后放置 `northstar:rocket_waypoint`；再次扫描已生成空间站时重新放置，可修复旧存档或被破坏的航点。 | 热重载 340/340、0 错误；玩家现有空间站目的地 `northstar:earth_orbit@-36768,95,-34446` 已确认存在 `northstar:rocket_waypoint`，`/locate poi` 在 0 格外命中，实际发射待用户回归。 | Northstar 若取消目的地 POI 校验，或空间站改用结构模板自带航点时复核。 | 航点与 POI 已验证 |
| LazyTick × Vintage Improvements 压缩机工作盆缓存 | 模组兼容 | LazyTick `2.4.9` 的 Basin 配方缓存不会感知 Vacuum Chamber 继承的配方上下文变化，导致压缩机偶发需移动或重设过滤器后才加工。 | `mods/CreateLazyTick.pw.toml` 更新至 `2.5.15`，使用上游 `VacuumChamberBasinBypassMixin`/`IBasinLazyTickBypass`；`mods/vintageimprovements.pw.toml` 更新至 `0.3.7.8`，撤回 VI 侧临时快照 Mixin。 | 已核对 LazyTick 发布 JAR 包含上游旁路类，VI 发布 JAR 不再包含 LazyTick/`BasinStateSnapshot` Mixin；运行时 JAR SHA-256 分别为 `2416ABA4…BA77AD`、`BF590658…DAE4E`。 | LazyTick 后续移除该上游兼容或 VI 不再继承 Basin 配方路径时重新复核；无需在 VI 侧恢复重复补丁。 | 已同步，待游戏内压缩机回归 |
| Frycooks Delight 油菜作物模型 | 资源兼容 | Frycooks Delight `1.0.1` 的 8 个油菜阶段仍引用 `farmersdelight:block/crop_cross`；Farmer's Delight `1.3.2` 将通用模板重命名为 `template_crop_cross`，造成紫黑缺失模型。 | `kubejs/assets/farmersdelight/models/block/crop_cross.json`：以旧路径提供与新模板等价的模型。 | 已由用户通过资源重载确认紫黑块消失；[#2007](https://github.com/Jasons-impart/Create-Delight-Remake/issues/2007)。 | Frycooks Delight 更新为引用 `farmersdelight:block/template_crop_cross` 或不再引用旧路径后，移除覆盖并回归油菜 8 个阶段。 | 生效中 |
