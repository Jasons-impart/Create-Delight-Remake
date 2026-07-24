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
| Frycooks Delight 油菜作物模型 | 资源兼容 | Frycooks Delight `1.0.1` 的 8 个油菜阶段仍引用 `farmersdelight:block/crop_cross`；Farmer's Delight `1.3.2` 将通用模板重命名为 `template_crop_cross`，造成紫黑缺失模型。 | `kubejs/assets/farmersdelight/models/block/crop_cross.json`：以旧路径提供与新模板等价的模型。 | 已由用户通过资源重载确认紫黑块消失；[#2007](https://github.com/Jasons-impart/Create-Delight-Remake/issues/2007)。 | Frycooks Delight 更新为引用 `farmersdelight:block/template_crop_cross` 或不再引用旧路径后，移除覆盖并回归油菜 8 个阶段。 | 生效中 |
