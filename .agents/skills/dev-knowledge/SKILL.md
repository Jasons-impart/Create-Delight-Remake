---
name: dev-knowledge
description: 开发知识路由、知识库整理、实现记录、代码位置索引、设计规划归档、技术 how-to。用于查找或记录 Create-Delight Remake 项目知识，或判断信息应写入 AGENTS、docs/dev-knowledge、docs/plan、docs/lessons-learned 还是项目 skill。
---

# 开发知识

当任务涉及开发知识存放位置、查找既有实现上下文，或在功能/调查后记录新知识时，使用本 skill。

本 skill 是知识存放路由的唯一来源；`knowledge-check` 应引用这里的存放表，而不是重复维护一份规则。

## 存放表

| 知识类型 | 目标位置 | 使用场景 |
|---|---|---|
| 常驻约束和入口路由 | `AGENTS.md`、`kubejs/AGENTS.md`、`CDC-mod-src/AGENTS.md` | 每次相关任务都必须看到的事实。 |
| 内容改动（feat） | `docs/dev-knowledge/content-map.md` | 记录有意新增或调整的玩家体验、玩法与平衡，以及实现位置。 |
| 兼容与问题修复（bugfix/compat） | `docs/dev-knowledge/compatibility-patches.md` | 记录恢复预期行为、修复回归或适配上游变更的补丁、验证与后续复核条件。 |
| 轻量技术做法 | `docs/dev-knowledge/how-to-index.md` | 记录“想做某类修改该怎么做”，但复杂度还不足以成为 skill。 |
| 可重复或脆弱流程 | `.agents/skills/<name>/SKILL.md` | 任务依赖步骤顺序、命令、验证规则或触发描述。 |
| 历史故障和绕路经验 | `docs/lessons-learned.md` | 主要价值是避免再次踩同一个坑。 |
| 稳定设计说明和参考 | `docs/` 下的专题文档 | 功能需要叙述当前设计、取舍或参考资料。 |
| 前瞻设计规划 | `docs/plan/` 下的专题文档 | 功能仍在规划、分阶段推进或描述未来扩展。 |

## 内容地图条目

当一个功能已经足够具体，未来 agent 需要知道以下信息时，更新 `docs/dev-knowledge/content-map.md`：

- 玩家能感知到的变化。
- 实现的大致方式。
- 主要代码、数据或配置位置。
- 相关设计文档。
- 当前状态和验证备注。

条目保持短小；长篇设计理由只链接 `docs/` 或 `docs/plan/` 的专题文档，不复制正文。

## 兼容与问题修复条目

当改动的主要目的为恢复预期行为、修复错误或适配上游模组更新时，更新 `docs/dev-knowledge/compatibility-patches.md`。

- 每个明确修复一行，记录问题或上游变化、受影响模组与版本、补丁文件、验证方式、上游跟踪位置和复核/移除条件。
- 不按 KubeJS、配置、HotAI、CDC 或 mixin 的目录决定落点：有意新增或调整玩家体验的是 feat；恢复预期行为、修复回归或适配上游的是 bugfix/compat。
- 同一目标的一组配方或配置可合并为一行，避免逐文件流水账；纯翻译、格式化或不改变行为的资源不入账。
- 同一事实不再重复写入 `docs/lessons-learned.md`；只有可脱离具体补丁复用的通用踩坑才写 lesson。

## 技术做法条目

当未来任务可能会问“某类修改该怎么做”时，更新 `docs/dev-knowledge/how-to-index.md`。

- 每个条目保持为紧凑 checklist。
- 优先写具体路径和已有 helper 名称。
- 一旦条目变成多步骤流程、包含重复命令或有明显踩坑风险，就提升为 `.agents/skills/<name>/SKILL.md`。

## 语言规则

- `docs/dev-knowledge/` 和本 skill 的正文必须以中文为主；mod 名、文件路径、命令、函数名、英文术语可保留英文。
- 新增条目的叙述性文字必须写中文；`scripts/validate-knowledge-base.ps1` 会检查 dev-knowledge Markdown 正文中是否存在无中文的英文叙述行。

## 更新流程

1. 搜索 `docs/dev-knowledge/`、`AGENTS.md`、相关模块 `AGENTS.md`、`.agents/skills/` 和 `docs/lessons-learned.md`。
2. 按存放表选择最小且持久的目标位置。
3. 一个事实只写在一个地方；需要关联时使用链接，不复制内容。
4. 修改 AGENTS、skill 或 dev-knowledge 索引后，运行 `scripts/validate-knowledge-base.ps1`。
