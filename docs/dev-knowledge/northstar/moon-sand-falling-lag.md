# Northstar 月尘自动下落与低重力卡顿

## 结论

月球的月尘（`northstar:moon_sand`）会在没有玩家手动更新相邻方块的情况下开始下落，根因不是月球区块加载机制与主世界不同，也不是月尘拥有独立的下落逻辑。

根因是 Northstar 的月球陨石坑地物 `CraterFeature`：它在洞穴已经雕刻完成后，将月尘直接铺到陨石坑底部，并明确请求原版世界生成的 post-processing。该后处理会传播方块形状更新；月尘继承 `FallingBlock`，因此收到更新后安排下落 tick。陨石坑代码没有验证月尘下方是否有支撑方块，故可能把月尘放在洞穴顶部的一层薄壳上。区块进入模拟范围后，这些已安排的 tick 开始执行，悬空月尘会批量转为下落方块实体。

月球低重力不是下落的触发原因，但会将问题显著放大：下落方块实体的重力被 Northstar 按维度重力缩放，月球约为主世界的六分之一重力。大量实体缓慢下落、长期同时存在并持续 tick，因而产生明显卡顿。

## 与主世界悬空沙子的区别

原版沙子和月尘都属于 `FallingBlock`。未发生更新且未安排 tick 的悬空原版沙子，会保持静止；主世界不存在“每次加载区块都扫描全部沙子并强制下落”的特殊规则。

差异来自月尘的生成链：

1. 月球陨石坑在世界生成阶段主动移除坑内方块。
2. 它把坑底的可删除月球自然方块替换为月尘。
3. 它对月尘上方调用 `markAboveForPostProcessing`，请求后续形状更新。
4. 若月尘下方恰好是洞穴空气或其他可下落空间，形状更新安排的下落 tick 会使它开始下落。

所以，玩家靠近并非触发方块检查；玩家只是使已生成区块进入服务器的模拟范围，让先前安排的下落 tick 得以执行。

## 已核对的代码与数据

### 月尘没有专用自动下落实现

本机运行 JAR 为 `Northstar-0.6.4+1.20.1.jar`。其 `NorthstarBlocks.MOON_SAND` 字段的类型为 `BlockEntry<GravelBlock>`；上游 1.20.1/create5 分支的对应注册为：

```java
public static final BlockEntry<GravelBlock> MOON_SAND = REGISTRATE
    .block("moon_sand", GravelBlock::new)
    .initialProperties(() -> SAND)
    // ...
    .register();
```

`GravelBlock` 与 `SandBlock` 同样继承原版 `FallingBlock`。Northstar 的重力 Mixin 改变的是 `FallingBlock.tick()` 已执行后的下落判定和 `FallingBlockEntity` 的重力，不会单独为月尘安排 tick。

### 陨石坑以月尘作为坑底材料

Northstar 的以下配置将陨石坑的 `block_provider` 设为 `northstar:moon_sand`：

- `data/northstar/worldgen/configured_feature/moon_crater.json`：半径 6--12、深度 2--3。
- `data/northstar/worldgen/configured_feature/moon_crater_big.json`：半径 12--24、深度 3--6。

对应 placed feature 的稀有度筛选分别为 1/6 和 1/10 候选区块；月球平原会生成普通陨石坑，月球陨石坑区域会同时生成普通和大型陨石坑。因此单个新生成区块附近可能出现大量月尘。

### `CraterFeature` 的关键逻辑

本机 JAR 的 `com.lightning.northstar.world.gen.feature.CraterFeature` 字节码与上游 1.20.1/create5 源码均显示，坑底放置逻辑等价于：

```java
protected boolean placeColumnBelow(..., BlockPos.MutableBlockPos pos) {
    BlockState state = config.blockProvider().getState(random, pos);
    if (level.getBlockState(pos) == Blocks.AIR.defaultBlockState()) {
        return false;
    }
    if (level.getBlockState(pos).is(config.canDelete())) {
        level.setBlock(pos, state, 2);
    }
    this.markAboveForPostProcessing(level, pos);
    return true;
}
```

这里的两个关键问题是：

- 检查的是月尘自身要写入的格子是否为空，以及是否属于 `#northstar:natural_moon_blocks`；**没有检查 `pos.below()` 能否支撑下落方块**。
- 无论是否实际写入月尘，都会调用 `markAboveForPostProcessing`。原版世界生成完成该标记时会进行邻接形状更新，进而触发下方月尘的 `FallingBlock.updateShape()`；后者会安排下落 tick。

`placeColumn` 在挖除坑内方块后也调用同一后处理方法，随后 `clearAir` 继续清理向上 24 格的自然月球方块。这一组合提高了坑底月尘附近存在空腔的概率。

## 本整合包中的影响范围

Northstar 原生月球和齿轮盛宴的月背维度均需要关注：

- 原生月球数据位于 `kubejs/data/northstar/dimension/moon.json`，使用 `northstar:moon` 噪声设置和 Northstar 月球群系。
- 月背维度位于 `kubejs/data/createdelight/dimension/lunar_farside.json`，虽使用 `createdelight:lunar_farside` 噪声设置，但其群系仍复用 `northstar:moon_crater` 与 `northstar:moon_crater_big` placed feature。
- `kubejs/data/createdelight/worldgen/biome/lunar_farside_plains.json` 启用普通月尘陨石坑；`lunar_farside_crater_fields.json` 同时启用普通和大型陨石坑。

月背噪声设置中虽然也保留了月尘表层规则，但该规则匹配 `northstar:lunar_*` 群系，而月背使用 `createdelight:lunar_farside_*` 群系；月背中由陨石坑写入的月尘因而是需要优先排查的来源。

## 修复方向

优先级从保守到彻底如下：

1. **临时减灾：** 对月背群系移除 `northstar:moon_crater` 与 `northstar:moon_crater_big` placed feature。该方法只影响新生成区域，保留既有区块，代价是失去陨石坑地貌。
2. **数据层替代：** 覆写陨石坑 configured feature 的 `block_provider`，以不可下落的月面方块替代月尘。应先确认这不会同时改变原生月球，并评估地貌视觉和配方来源影响。
3. **上游正确修复：** 修改 `CraterFeature.placeColumnBelow`，在写入任何 `FallingBlock` 前验证其下方可支撑；对不满足条件的位置改用稳定方块或跳过写入。后处理标记只应保留给确有形状更新需要的位置。
4. **既有存档治理：** 上述改动不会自动修复已生成区块中的悬空月尘或已积压的下落 tick。处理前必须备份存档，并单独设计受限范围的清理与回归方案，避免批量删除月球地形。

## 已实施修复

CDC `2.2.16f` 新增 `CraterFeatureMixin`，重定向 `placeColumnBelow` 中唯一的 `WorldGenLevel.setBlock` 调用：候选方块属于 `FallingBlock` 且下方为可下落空间时不写入，保留原有 `#northstar:natural_moon_blocks` 坑底；其他写入保持原行为。该标签当前不包含月尘，因此后续的原版 post-processing 更新的是稳定月岩或矿石，不会安排月尘下落 tick。

补丁同时更新 CDC 的 Northstar 开发依赖到整合包锁定的 CurseForge 文件 `8486123`，并已重新构建和同步 `Create-Delight-Core-1.20.1-dev.jar`。该修复只影响新生成的陨石坑；既有存档不自动清理。

## 验证建议

1. 在新的月球或月背区块定位陨石坑，记录其坑底月尘坐标和下方方块。
2. 在玩家进入模拟范围前后比较该区域的月尘数量和 `minecraft:falling_block` 实体数量。
3. 对照在相同位置放置的 `minecraft:sand`：在未更新时应保持静止；触发更新后也会下落，证明差异是 tick 安排而非方块的基础类别。
4. 对候选修复生成全新区块，确认陨石坑坑底没有悬空月尘，随后观察玩家进入区块时的实体峰值和服务器 MSPT。
5. 同时在原生月球与 `createdelight:lunar_farside` 验证，避免仅修复一个维度。

## 证据状态与后续复核

- 已通过本机 `Northstar-0.6.4+1.20.1.jar` 的 `javap` 验证 `MOON_SAND` 的 `GravelBlock` 注册、`CraterFeature` 对 `WorldGenLevel.setBlock(..., 2)` 与 `Feature.markAboveForPostProcessing(...)` 的调用。
- 已核对整合包 KubeJS 中不存在监听 `northstar:moon_sand` 并主动安排下落的脚本；现有引用仅为配方、任务图标和世界生成数据。
- CDC `./gradlew.bat build --no-daemon --console=plain` 已通过；最终 refmap 将补丁调用点的 `WorldGenLevel.setBlock` 映射为生产名称 `m_7731_`。
- 尚未取得运行中客户端的 MCP 连接，因此“某个实际卡顿坐标的下方为空”以及修复后的实体峰值，仍需按上节在游戏内回归确认。
