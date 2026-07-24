# 开发知识索引

本目录是项目开发知识的稳定入口，用于存放对未来开发有价值、但不适合常驻在 `AGENTS.md` 的信息。知识应存放在哪里、何时提升为 skill 的规则，以 [dev-knowledge skill](../../.agents/skills/dev-knowledge/SKILL.md) 为唯一来源；本页只提供导航，避免两处规则漂移。

## 本目录

| 文件 | 用途 |
|---|---|
| [content-map.md](content-map.md) | 已实现或正在落地的内容改动地图。 |
| [compatibility-patches.md](compatibility-patches.md) | 兼容、回归和上游适配补丁台账。 |
| [how-to-index.md](how-to-index.md) | 尚未复杂到需要 skill 的轻量技术做法。 |

## 关联入口

| 需求 | 入口 |
|---|---|
| 常驻约束与模块入口 | 根目录或模块内的 `AGENTS.md`。 |
| 可重复、命令密集或脆弱的流程 | `.agents/skills/` 中对应 skill。 |
| 已归纳的历史根因与绕路 | [lessons-learned.md](../lessons-learned.md)。 |
| 当前设计、研究和取舍 | `docs/` 根目录下的专题文档。 |
| 尚未实施的分阶段设计 | `docs/plan/`。 |
| 面向人工的通用开发入口 | [development.md](../development.md)。 |
| 未 clone 仓库时的环境启动说明 | `GettingStarted.md`（保持自包含）。 |

`docs/plan/` 和 `docs/` 专题文档会随功能增减；不在本页维护容易过期的逐文件清单。需要按主题查找时，先查看目录名和一级标题，再按 dev-knowledge skill 的路由规则决定是否新增索引条目。
