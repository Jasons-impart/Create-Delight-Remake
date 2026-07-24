# 整合包覆写与第三方兼容补丁台账

本台账记录当前仍生效、改变第三方模组行为的整合包覆写：KubeJS 资源、数据和脚本，`config/` 与 `defaultconfigs/`，`hotai/`，以及 CDC 的 `compat/` 和 `mixin/`。模组升级或调整设计时，先按“复核条件”检查对应行；确认不再需要后删除覆盖并移除此行。

## 路由范围

| 改动位置 | 默认记录位置 | 说明 |
|---|---|---|
| `kubejs/server_scripts/`、`startup_scripts/`、`client_scripts/`、第三方命名空间的 `assets/` 与 `data/` | 本台账 | 记录对既有模组配方、注册、客户端行为、资源和数据的调整意图。 |
| `config/`、`defaultconfigs/` | 本台账 | 记录改变模组默认行为、生成或平衡的配置意图及复核条件。 |
| `hotai/` | 按意图选择本台账或 `content-map.md` | 调整既有 NPC/AI、兼容或平衡写入本台账；新增 NPC、剧情、任务或玩法内容写入内容地图。 |
| `CDC-mod-src/.../compat/`、`CDC-mod-src/.../mixin/` | 本台账 | 记录对 Minecraft 或其他模组的 Java 集成、修复和行为补丁。 |
| `kubejs/{assets,data}/createdelight/`、CDC 的 `content/`、`registry/` 等自有实现 | `content-map.md` | 新增 CD 自有玩法、物品、机器或系统时记录玩家可见意图和实现状态，而不是当作上游覆写。 |

按一个明确的设计目标汇总一行，不要求每个配方或 JSON 单独立项；同一目标新增文件时更新该行的路径与验证状态即可。

| 覆写 | 类型 | 受影响版本与意图/根因 | 覆盖位置 | 验证与跟踪 | 复核/移除条件 | 状态 |
|---|---|---|---|---|---|---|
| Frycooks Delight 油菜作物模型 | 资源兼容 | Frycooks Delight `1.0.1` 的 8 个油菜阶段仍引用 `farmersdelight:block/crop_cross`；Farmer's Delight `1.3.2` 将通用模板重命名为 `template_crop_cross`，造成紫黑缺失模型。 | `kubejs/assets/farmersdelight/models/block/crop_cross.json`：以旧路径提供与新模板等价的模型。 | 已由用户通过资源重载确认紫黑块消失；[#2007](https://github.com/Jasons-impart/Create-Delight-Remake/issues/2007)。 | Frycooks Delight 更新为引用 `farmersdelight:block/template_crop_cross` 或不再引用旧路径后，移除覆盖并回归油菜 8 个阶段。 | 生效中 |
