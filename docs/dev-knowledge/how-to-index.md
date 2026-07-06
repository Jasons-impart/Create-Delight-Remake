# 技术做法索引

本文件记录紧凑的“某类修改该怎么做”项目笔记；如果流程已经复杂到需要固定步骤或多条命令，应提升为 skill。

| 目标 | 编辑位置 | 检查清单 | 验证方式 | 何时提升为 skill |
|---|---|---|---|---|
| 搭建本地开发环境 | `GettingStarted.md` | 该流程面向尚未 clone 仓库的用户，必须在根文档中自包含；不要提升为项目 skill。 | 确认实例目录含 `.git/`、`kubejs/`、`config/`、`mods/*.jar`、`pack.toml` 和 HMCL 版本文件。 | 不提升；clone 前无法依赖仓库内 skill。 |
| 修改 KubeJS 配方 | `kubejs/server_scripts/{Mod}/`，helper 位于 `kubejs/server_scripts/util/` | 搜索 `.js` 配方脚本，优先使用 `remove_recipes_id`、`cutting_2`、`centrifugation` 等既有 helper，配方 id 使用 `createdelight` 命名空间。 | 游戏内执行 `/kubejs reload server_scripts`；涉及标签或掉落时再执行 `/reload`。 | 任务需要批量生成、广泛迁移或命令密集验证。 |
| 添加自定义资源或翻译 | `kubejs/assets/{namespace}/`，语言文件位于 `lang/` | 模型、贴图和语言写入所属 namespace；群系翻译键使用 `biome.{namespace}.xxx`；CD 自定义资源优先放在 `createdelight`。 | 根据资源类型执行资源重载或重启游戏；语言文件由 schema 校验。 | 资源生成或本地化流程开始重复出现。 |
| 添加游戏内 Tips | `kubejs/assets/createdelight/tips/<id>.json`、`kubejs/assets/createdelight/lang/zh_cn.json`、`config/tips.json` | 由 Tips 模组（mod id `tipsmod`）从 `assets/<namespace>/tips/*.json` 加载提示；CD 自定义提示新建 JSON，内容用 `{"tip":{"translate":"createdelight.tip.<id>"}}` 指向语言键，并在 `zh_cn.json` 添加同名翻译，避免把 `createdelight` 加入 `ignoredNamespaces`。 | 校验 tips JSON 和语言 JSON；进游戏等待 tips 轮播或重载资源后查看。 | 需要批量生成、多语言同步或定制 Tips 过滤规则。 |
| 添加或更新整合包资产 | `mods/`、`resourcepacks/`、`shaderpacks/`、`packwiz-files/` | 使用 `/packwiz-assets` skill；除修复生成结果外，不手写 Packwiz 元数据。 | 运行 `scripts/sync-packwiz-assets.ps1`；检查 `.pw.toml` 和 `packwiz-files` diff。 | 已提升为 `.agents/skills/packwiz-assets/SKILL.md`。 |
| 记录已实现内容知识 | `docs/dev-knowledge/content-map.md`，长篇设计写在 `docs/` 专题文档 | 添加短行，包含玩家可见变化、实现概览、主要路径、相关文档和状态。 | 检查链接；涉及路由文件时运行 `scripts/validate-knowledge-base.ps1`。 | 某个内容领域需要独立的重复维护流程。 |

## 条目模板

| 目标 | 编辑位置 | 检查清单 | 验证方式 | 何时提升为 skill |
|---|---|---|---|---|
| `<任务>` | `<路径>` | `<步骤>` | `<检查>` | `<提升触发条件>` |
