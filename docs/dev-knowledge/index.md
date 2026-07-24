# 开发知识索引

本目录是项目开发知识的稳定入口，用于存放对未来开发有价值、但不适合常驻在 `AGENTS.md` 的信息。

## 存放规则

| 知识类型 | 文件 |
|---|---|
| 已实现的内容改动、玩家可见行为、实现概览和代码位置 | `docs/dev-knowledge/content-map.md` |
| 仍在生效的整合包覆写：第三方兼容、KubeJS、配置、HotAI 行为调整、CDC compat/mixin 的上游跟踪和复核条件 | `docs/dev-knowledge/compatibility-patches.md` |
| 技术向“某类修改该怎么做”的轻量笔记，且尚未复杂到需要 skill | `docs/dev-knowledge/how-to-index.md` |
| 稳定设计说明、参考和取舍 | `docs/` 下的专题文档 |
| 前瞻设计规划、分阶段计划和未来扩展 | `docs/plan/` 下的专题文档 |
| 命令密集、容易出错或需要固定步骤的重复流程 | `.agents/skills/<name>/SKILL.md` |
| 简短常驻约束和入口路由 | `AGENTS.md` 或模块级 `AGENTS.md` |
| 历史坑、根因和修复经验 | `docs/lessons-learned.md` |

## 条目规则

- 内容向事实写成“改了什么、如何工作、位置在哪里、当前状态”。
- 技术向事实写成“目标、编辑位置、检查清单、验证方式”。
- 优先链接长文档，不复制长段落。
- 当 how-to 依赖命令顺序、验证步骤或触发描述时，提升为 skill。
- 本目录正文必须以中文为主；路径、命令、函数名、mod 名和必要英文术语可以保留英文。

## 现有专题文档归类

| 文档 | 类型 | 用途 |
|---|---|---|
| `GettingStarted.md` | 仓库外部启动入口 | 开发环境快速开始；面向尚未 clone 仓库的用户，必须保持自包含，不能依赖项目 skill。 |
| `docs/development.md` | 人工开发指南 | 保留人工阅读的开发规范和入口指针，复杂流程转到 skill。 |
| `docs/mod-research.md` | 调研清单 | 记录候选模组和已有优化模组参考，不属于实现事实。 |
| `docs/order-system-design.md` | 内容设计说明 | 订单系统当前实现、设计原则和后续建议。 |
| `docs/plan/order-acquisition-channels-plan.md` | 内容设计计划 | 订单获取渠道的长期设计。 |
| `docs/plan/order-acquisition-crystal-modifier-plan.md` | 内容设计计划 | 订单构筑和修饰系统设计。 |
| `docs/plan/order-time-and-automation-strategy.md` | 内容设计策略 | 订单时间机制与自动化产线假设。 |
| `docs/plan/quality-harvest-life-matter-plan.md` | 内容设计计划 | 品质收割、生命质回收和生命质扩展用途规划。 |
| `docs/plan/fluid-quality-mod-plan.md` | 内容设计计划 | Quality Food 流体品质附属 mod 的数据模型、Create 接入、世界流体品质和阶段实施方案。 |
| `docs/plan/adventure-progression-overhaul-plan.md` | 内容设计计划 | 冒险流程、配方门槛和阶段推进规划。 |
| `docs/plan/apotheosis-fallen-gems-affixes-integration-plan.md` | 内容设计计划 | Apotheosis、Fallen Gems & Affixes 与 Tetra 的职责边界、投放和数值控制规划。 |
| `docs/plan/chromatic-compound-endgame-plan.md` | 内容设计计划 | 异彩化合物双路线、光辉石与暗影钢终盘分支的材料链规划。 |
| `docs/plan/one-enough-damage-unified-damage-system.md` | 技术设计计划 | OneEnoughDamage 伤害扫描、逻辑分组、增伤与抗性统一方案。 |
| `docs/attributeslib-traveloptics-echoing-strikes-analysis.md` | 技术研究参考 | AttributesLib 多重暴击、Travel Optics 暗影瘴气和 Iron's Spells 回响打击的跨模组伤害放大链、上游变化与修复取舍。 |
| `docs/dev-knowledge/compatibility-patches.md` | 整合包覆写与兼容补丁台账 | 跟踪为调整或兼容第三方模组而保留的 KubeJS、配置、HotAI 行为覆写、CDC compat/mixin 覆写、验证和复核条件。HotAI 新增内容改写入 content map。 |
| `docs/plan/player-world-tier-progression-plan.md` | 内容设计计划 | 玩家独立世界等级、永久解锁上限、当前等级选择和晋阶试炼条件规划。 |
| `docs/plan/mmt-curios-stage-progression-plan.md` | 内容设计计划 | MMT 模块化饰品的阶段开放、流派调律、重复制作和数值边界设计。 |
| `docs/tetra-design-reference-2026-06-22.md` | 设计参考 | Tetra/MMT 数值、材料和模块参考。 |
| `docs/announcement.md` | 发布素材 | 稳定版本公告片段，不作为开发知识入口。 |
