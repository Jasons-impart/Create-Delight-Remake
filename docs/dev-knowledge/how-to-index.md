# 技术做法索引

本文件记录紧凑的“某类修改该怎么做”项目笔记；如果流程已经复杂到需要固定步骤或多条命令，应提升为 skill。

| 目标 | 编辑位置 | 检查清单 | 验证方式 | 何时提升为 skill |
|---|---|---|---|---|
| 修改 KubeJS 配方 | `kubejs/server_scripts/{Mod}/`，helper 位于 `kubejs/server_scripts/util/` | 搜索 `.js` 配方脚本，优先使用 `remove_recipes_id`、`cutting_2`、`centrifugation` 等既有 helper，配方 id 使用 `createdelight` 命名空间。 | 游戏内执行 `/kubejs reload server_scripts`；涉及标签或掉落时再执行 `/reload`。 | 任务需要批量生成、广泛迁移或命令密集验证。 |
| 添加自定义资源或翻译 | `kubejs/assets/{namespace}/`，语言文件位于 `lang/` | 模型、贴图和语言写入所属 namespace；群系翻译键使用 `biome.{namespace}.xxx`；CD 自定义资源优先放在 `createdelight`。 | 根据资源类型执行资源重载或重启游戏；语言文件由 schema 校验。 | 资源生成或本地化流程开始重复出现。 |
| 添加或更新整合包资产 | `mods/`、`resourcepacks/`、`shaderpacks/`、`packwiz-files/` | 使用 `/packwiz-assets` skill；除修复生成结果外，不手写 Packwiz 元数据。 | 运行 `scripts/sync-packwiz-assets.ps1`；检查 `.pw.toml` 和 `packwiz-files` diff。 | 已提升为 `.agents/skills/packwiz-assets/SKILL.md`。 |
| 记录已实现内容知识 | `docs/dev-knowledge/content-map.md`，长篇设计写在 `docs/` 专题文档 | 添加短行，包含玩家可见变化、实现概览、主要路径、相关文档和状态。 | 检查链接；涉及路由文件时运行 `scripts/validate-knowledge-base.ps1`。 | 某个内容领域需要独立的重复维护流程。 |

## 条目模板

| 目标 | 编辑位置 | 检查清单 | 验证方式 | 何时提升为 skill |
|---|---|---|---|---|
| `<任务>` | `<路径>` | `<步骤>` | `<检查>` | `<提升触发条件>` |
