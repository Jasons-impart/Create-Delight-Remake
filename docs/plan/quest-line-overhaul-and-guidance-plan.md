# 任务线大修与指引补全规划

状态：前瞻想法 / 积压清单，尚未系统实施；后续可按模块拆分推进。文案约定见 `AGENTS.md` 的玩家可见文本规则；Tetra 图鉴结构见 `docs/plan/tetra-compendium-quest-rebuild-plan.md`；订单系统见 `docs/order-system-design.md` 与 `docs/plan/order-*.md`。

## 核心想法

目前任务线积累了巨量修改需求：大量章节任务需要重写，各种小功能（尤其是 QoL 类）缺少玩家可见的说明，冒险线、Tetra 系统、订单系统等复杂玩法的指引不足。目标是做一次系统性的任务线大修，让任务书成为玩家理解整合包的主要入口：知道要做什么、怎么做、会得到什么，以及各种小功能怎么用。

## 修改范围

### 1. 任务线积压修改（巨量）

- 各章节任务存在大量待改项：任务依赖、完成条件、奖励、布局、跳转和描述都可能需要调整。
- 修改不是单点润色，而是按章节成批梳理：先定章节定位与目标读者，再改任务结构，最后统一文案。
- 涉及章节大致覆盖 Introduction / Beginning_of_Journey、Junior_Engineer 与加工线、Tetra 五章图鉴、冒险与星球线（Voyage_of_Stars、Magnet_Field、Toxic_World、Prehistoric_Realm、Candyland、Abyssal_Depths 等）、Mouse_Chef 与食物线、Difficulty_System、Economic_Playground、Otherworldly_Challenges、Youkais_Homecoming 等；实际清单以积压内容为准，可另开子清单文档登记。

### 2. 小功能与 QoL 描写

- 整合包里有很多「小但很 QoL」的功能（快捷操作、过滤、自动补货、界面按钮、小工具等），玩家往往不知道存在或不会用。
- 为这类功能补充轻量说明：出现在对应章节的引导任务、任务附注、tooltip 或 JEI 提示中，重点回答「它解决什么麻烦、怎么触发/使用」。
- 描写保持短小；一个功能一两句即可，不写设计理由或版本历史。

### 3. 冒险线指引

- 维度旅行、Boss 挑战、灾变遗迹指引、洞穴入口等需要一条清晰的「下一步去哪、准备什么」路线。
- 与 `docs/plan/adventure-progression-overhaul-plan.md` 的阶段流程和 `docs/plan/cataclysm-boss-challenge-line-tetra-mod-plan.md` 的挑战线对齐：任务节点展示前置准备、召唤/触发方式、击败收益。
- 行星灾变遗迹指引任务已在内容地图登记（`docs/dev-knowledge/content-map.md`），本次属于在其基础上的成批文案与指引完善。

### 4. Tetra 指引

- Tetra 五章图鉴（基础工艺、近战、远程防御、护甲饰品、卷轴）是查询型内容，但仍需「从零上手」的引导路径：加工台在哪、怎么开槽、锤级怎么升、材料怎么换、改装/完整度/精力是什么。
- 指引与图鉴分工：图鉴负责按物品家族查询，指引任务负责带玩家走完第一条可玩的锻造路径；高级内容用跳转而不是重复讲解。
- 后续灾变 Boss 改装材料落地后，在对应图鉴页和挑战线任务中同步补充改装说明。

### 5. 订单系统指引

- 订单系统是新增玩法，需要从「声望解锁 → 接单 → 供货 → 交付 → 奖励」的完整指引，覆盖公告板、供货委托台、请求器、提交口等工具的使用时机。
- Economic_Playground 章节承担主要教学；工具各自的按钮、筛选、撤销、到账提示等 QoL 细节用短描写补齐。
- 文案只描述当前规则与结果（普通/加急倍率、市场饱和、凭证输入、包裹输出），不写开发自述。

### 6. 其他（后续补充）

- 新系统、新物品、新机制上线时同步评估是否需要任务指引，避免再次积压。
- 跨章节跳转、奖励领取条件、多人/服务器注意事项等按需补充。

## 文案约定

- 任务、tooltip、JEI、聊天提示只描述当前规则、条件、结果和操作；不写版本改动、迁移说明、设计理由或开发自述（见 `AGENTS.md`）。
- 任务文案优先回答「要做什么、怎么做、会得到什么」；只保留玩家必须识别的物品、方块和规则名，避免内部术语（Score、闭环、市场机会等）。
- 描写密度：QoL 小功能用短句；主线节点用「目标 → 准备 → 奖励」三段式。

## 与现有文档的关系

| 已有内容 | 本规划增量 |
|---|---|
| `docs/plan/tetra-compendium-quest-rebuild-plan.md`：五章图鉴结构与生成器 | 上手引导路径与 QoL 描写，不重建图鉴结构 |
| `docs/plan/adventure-progression-overhaul-plan.md`、`docs/plan/cataclysm-boss-challenge-line-tetra-mod-plan.md`：阶段与挑战线 | 任务书内的指引节点与文案 |
| `docs/order-system-design.md`、`docs/plan/order-*.md`：订单机制 | 玩家侧指引与工具使用描写 |
| `docs/dev-knowledge/content-map.md` | 已实现的具体体验改动登记；本规划是任务线批量修改的总入口 |

## 开放问题（后续慢慢写）

1. 积压修改的完整清单如何登记与拆分（按章节子任务，或单独 backlog 文档）。
2. 各章节的目标读者与深度基线（新手章 vs 查询型图鉴章）。
3. QoL 小功能的收录范围与检查方式（从 changelog、diff、脚本扫描还是人工体验收集）。
4. 指引与图鉴、tooltip、JEI 之间的分工边界，避免同一信息多处重复维护。
5. 多语言与旧存档任务进度迁移时的文案影响。
