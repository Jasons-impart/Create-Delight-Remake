---
name: dev-knowledge
description: 开发知识路由、知识库整理、实现记录、代码位置索引、设计规划归档、技术 how-to。用于查找或记录 Create-Delight Remake 项目知识，或判断信息应写入 AGENTS、docs/dev-knowledge、docs/plan、docs/lessons-learned 还是项目 skill。
---

# 开发知识

当任务涉及开发知识存放位置、查找既有实现上下文，或在功能/调查后记录新知识时，使用本 skill。

本 skill 是知识存放路由的唯一来源；`knowledge-check` 应引用这里的存放表，而不是重复维护一份规则。

## 任务中随手记录

任务进行中遇到非显而易见的失败、绕路、根因或约束时，不要等任务结束再回忆：立即用 `scripts/add-knowledge-note.ps1` 追加临时 note（写入 `tmp-opencode/knowledge-notes.md`）。Stop hook 的候选报告只扫描 diff，看不到这类过程信息；note 会被报告读入 Process Notes 并路由到 knowledge-check。任务结束落库或否决后，运行 `scripts/resolve-knowledge-candidate.ps1` 清掉临时 note，避免重复出现。

## 存放表

| 知识类型 | 目标位置 | 使用场景 |
|---|---|---|
| 常驻约束和入口路由 | `AGENTS.md`、`kubejs/AGENTS.md`、`CDC-mod-src/AGENTS.md` | 每次相关任务都必须看到的事实。 |
| 内容改动（feat） | `docs/dev-knowledge/content-map.md` | 记录有意新增或调整的玩家体验、玩法与平衡，以及实现位置。 |
| 模组兼容补丁 | `docs/dev-knowledge/compatibility-patches.md` | 记录外部模组的缺陷，以及 CDR 与外部模组、多个外部模组之间因版本、API、数据或运行时行为差异产生的补丁、验证与复核条件。 |
| 轻量技术做法 | `docs/dev-knowledge/how-to-index.md` | 记录“想做某类修改该怎么做”，但复杂度还不足以成为 skill。 |
| 项目技术专题参考 | `docs/dev-knowledge/<专题>/` 下的专题文档 | 记录与仓库实现和维护直接相关的机制、状态与参考；多文件专题以 `README.md` 为唯一入口。 |
| 可重复或脆弱流程 | `.agents/skills/<name>/SKILL.md` | 任务依赖步骤顺序、命令、验证规则或触发描述。 |
| 历史故障和绕路经验 | `docs/lessons-learned.md` | 主要价值是避免再次踩同一个坑。 |
| 稳定设计说明和参考 | `docs/<专题>/` 下的专题文档 | 功能需要叙述当前设计、取舍或参考资料；专题有多份关联文档时以 `README.md` 作为唯一入口。 |
| 前瞻设计规划 | `docs/plan/` 下的专题文档 | 功能仍在规划、分阶段推进或描述未来扩展。 |

## 内容地图条目

当一个功能已经足够具体，未来 agent 需要知道以下信息时，更新 `docs/dev-knowledge/content-map.md`：

- 玩家能感知到的变化。
- 实现的大致方式。
- 主要代码、数据或配置位置。
- 相关设计文档。
- 当前状态和验证备注。

条目保持短小；长篇设计理由只链接 `docs/` 或 `docs/plan/` 的专题文档，不复制正文。

仅新增、升级、降级或移除第三方模组（以及对应的 Packwiz 元数据、完整性清单或模组列表更新）不属于内容地图条目；这些变更由 `mods/*.pw.toml` 和模组清单文档记录。只有在模组接入之外实施了整合包自定义玩法、平衡或体验改动时，才写入 `content-map.md`。

## 模组兼容补丁条目

当根因是外部模组自身缺陷，或补丁为 CDR 与外部模组、多个外部模组之间的兼容问题时，更新 `docs/dev-knowledge/compatibility-patches.md`。外部问题由 CDR 的 KubeJS、CDC、HotAI、配置或资源覆盖修补时同样准入。条目必须说明受影响的外部模组、版本/API/数据或运行时行为差异，以及何时需要复核或移除。

- 普通 CDR 内部 bug 不入账：包括自有 KubeJS/CDC 代码之间的生产者-消费者不一致、空值防御、容量边界和局部状态逻辑；即使实现调用了第三方 API，也不能仅因“修复 bug”或文件位于 KubeJS/CDC 而准入。
- 仅当根因是外部模组缺陷、外部接口、版本或运行时行为不兼容，并且上游变化会影响补丁存续时才准入；引用某个模组的稳定 API 本身不足以构成兼容补丁。
- 每个条目一行，记录外部触发条件、补丁文件、验证方式、上游跟踪位置和复核/移除条件；同一目标的一组配方或配置可合并，避免逐文件流水账。
- 有意新增或调整玩家体验的内容写入 `content-map.md`；不需要长期复用的内部修复不记录；只有可脱离具体补丁复用的通用踩坑才写入 `docs/lessons-learned.md`。

## 技术做法条目

当未来任务可能会问“某类修改该怎么做”时，更新 `docs/dev-knowledge/how-to-index.md`。

- 每个条目保持为紧凑 checklist。
- 优先写具体路径和已有 helper 名称。
- 一旦条目变成多步骤流程、包含重复命令或有明显踩坑风险，就提升为 `.agents/skills/<name>/SKILL.md`。
- 已有专题入口或专用 skill 时，只保留链接和分类，不复制专题事实或操作步骤。

## 语言规则

- `docs/dev-knowledge/` 和本 skill 的正文必须以中文为主；mod 名、文件路径、命令、函数名、英文术语可保留英文。
- 新增条目的叙述性文字必须写中文；`scripts/validate-knowledge-base.ps1` 会检查 dev-knowledge Markdown 正文中是否存在无中文的英文叙述行。

## 更新流程

1. 搜索 `docs/dev-knowledge/`、`AGENTS.md`、相关模块 `AGENTS.md`、`.agents/skills/` 和 `docs/lessons-learned.md`。
2. 按存放表选择最小且持久的目标位置。
3. 一个事实只写在一个地方；需要关联时使用链接，不复制内容。
4. 修改 AGENTS、skill 或 dev-knowledge 索引后，运行 `scripts/validate-knowledge-base.ps1`。
