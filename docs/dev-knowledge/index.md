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
| 当前设计、研究和取舍 | `docs/<专题>/README.md`；单页专题可直接位于 `docs/`。 |
| 与仓库实现直接相关的技术专题 | `docs/dev-knowledge/<专题>/README.md`。 |
| 尚未实施的分阶段设计 | `docs/plan/`。 |
| 面向人工的通用开发入口 | [development.md](../development.md)。 |
| 未 clone 仓库时的环境启动说明 | `GettingStarted.md`（保持自包含）。 |

`docs/plan/`、`docs/<专题>/` 和 `docs/dev-knowledge/<专题>/` 会随功能增减；不在本页维护容易过期的专题内逐文件清单。需要按主题查找时，先查看专题入口和一级标题，再按 dev-knowledge skill 的路由规则决定是否新增索引条目。

## 现有专题文档归类

| 文档 | 类型 | 用途 |
|---|---|---|
| `GettingStarted.md` | 仓库外部启动入口 | 开发环境快速开始；面向尚未 clone 仓库的用户，必须保持自包含，不能依赖项目 skill。 |
| `docs/development.md` | 人工开发指南 | 保留人工阅读的开发规范和入口指针，复杂流程转到 skill。 |
| `docs/mod-research.md` | 调研清单 | 记录候选模组和已有优化模组参考，不属于实现事实。 |
| `docs/order-system-design.md` | 内容设计说明 | 订单系统当前实现、设计原则和后续建议。 |
| [hotai/](hotai/README.md) | 技术参考专题 | `hotai` 二进制补丁的运行机制、按领域行为、逐文件明细与自动生成状态。 |
| `docs/plan/order-acquisition-channels-plan.md` | 内容设计计划 | 订单获取渠道的长期设计。 |
| `docs/plan/order-acquisition-crystal-modifier-plan.md` | 内容设计计划 | 订单构筑和修饰系统设计。 |
| `docs/plan/order-time-and-automation-strategy.md` | 内容设计策略 | 订单时间机制与自动化产线假设。 |
| `docs/plan/quality-harvest-life-matter-plan.md` | 内容设计计划 | 品质收割、生命质回收和生命质扩展用途规划。 |
| `docs/plan/fluid-quality-mod-plan.md` | 内容设计计划 | Quality Food 流体品质附属 mod 的数据模型、Create 接入、世界流体品质和阶段实施方案。 |
| `docs/plan/adventure-progression-overhaul-plan.md` | 内容设计计划 | 冒险流程、配方门槛和阶段推进规划。 |
| `docs/plan/chromatic-compound-endgame-plan.md` | 内容设计计划 | 异彩化合物双路线、光辉石与暗影钢终盘分支的材料链规划。 |
| `docs/plan/player-world-tier-progression-plan.md` | 内容设计计划 | 玩家独立世界等级、永久解锁上限、当前等级选择和晋阶试炼条件规划。 |
| `docs/plan/mmt-curios-stage-progression-plan.md` | 内容设计计划 | MMT 模块化饰品的阶段开放、流派调律、重复制作和数值边界设计。 |
| `docs/tetra-design-reference-2026-06-22.md` | 设计参考 | Tetra/MMT 数值、材料和模块参考。 |
| `docs/announcement.md` | 发布素材 | 稳定版本公告片段，不作为开发知识入口。 |
