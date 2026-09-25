# 工作站配方兼容整理与机器问题修复计划

> 状态：规划中，尚未实施。本文是三项近期工作的统一计划入口，各自落地后按内容写入 `docs/dev-knowledge/content-map.md` 或 `docs/dev-knowledge/compatibility-patches.md`。

## 总览

| 编号 | 计划 | 类型 | 现状 |
|---|---|---|---|
| 1 | 妖怪归家工作站配方与整合包工作站配方兼容整理 | 内容兼容 | 已有大量零散兼容改动，待系统性盘点与对齐 |
| 2 | 动力砂轮无法正常运行（修复，或迁移到附魔工业机械砂轮） | Bug 修复 / 功能迁移 | 已知异常，根因未定位；迁移为备选方案 |
| 3 | 杠杆锤锤烂铁砧 | Bug 修复 | 已知异常，根因未定位 |

---

## 1. 妖怪归家工作站配方与整合包工作站配方兼容整理

### 背景

妖怪归家（`youkaishomecoming` 2.7.0）自带一套完整烹饪/饮品工作站与配方类型。整合包已通过 `kubejs/server_scripts/Youkai's Homecoming/` 做过一批兼容（移除冲突配方、`replaceInput` 换料、补充整合包材料链配方），但改动分散在 `recipe.js`、`sushi.js` 中，缺少与整合包其他食物工作站体系的对照台账。

妖怪归家原生配方类型分布（JAR 内 `data/youkaishomecoming/recipes/`）：

| 配方类型 | 数量 | 对应工作站/玩法 |
|---|---|---|
| `youkaishomecoming:simple_fermentation` | 22 | 发酵罐 |
| `youkaishomecoming:kettle` | 15 | 水壶（茶/咖啡） |
| `youkaishomecoming:cuisine_ordered` | 15 | 有序料理 |
| `youkaishomecoming:steaming` | 14 | 蒸笼/蒸锅 |
| `youkaishomecoming:unordered_cooking` | 13 | 无序烹饪 |
| `youkaishomecoming:moka_pot` | 10 | 摩卡壶 |
| `youkaishomecoming:drying_rack` | 8 | 晾晒架 |
| `youkaishomecoming:cuisine_mixed` | 7 | 混合料理 |
| `youkaishomecoming:immediate_soup` | 4 | 即食汤 |
| `youkaishomecoming:simple_basin` | 3 | 简易盆 |
| `youkaishomecoming:cuisine_fixed` | 3 | 固定料理 |

相关方块还包括：`stockpot`（汤锅）、`short_iron_pot` / `small_iron_pot`（铁锅）、`steamer_pot`（蒸锅）、`fermentation_tank`（发酵罐）、`copper_tank` / `copper_faucet`（铜水箱/龙头）、`saucer`（碟）、各类茶包与食材袋。

### 目标

- 盘点妖怪归家各工作站配方与整合包现有食物工作站（Farmer's Delight 烹饪锅/砧板、Bakeries、Create Cafe、Vintage Delight、Ratatouille、Farmers Respite 等）的职责重叠与缺口。
- 明确每类工作站的“权威配方来源”：哪些食材/成品只走妖怪归家工作站，哪些允许整合包工作站产出，避免同一产物多条成本差异过大的路径。
- 把已有 `replaceInput`、移除和补配方收敛为可维护的对照表，后续模组升级时能按工作站逐项复核。
- 食材替换规则与整合包材料链对齐（如小麦→米粉/面粉、可可→巧克力等既有替换需确认覆盖是否完整、是否有漏网配方）。

### 非目标

- 不重做妖怪归家的烹饪玩法本身（弹幕、妖怪化、boss 等与工作站无关的内容不动）。
- 不强行把妖怪归家工作站配方迁到 Create 加工线；仅在明确重复或失衡时才改路径。

### 实施步骤（待展开）

1. 按工作站分类导出妖怪归家原生配方与 `kubejs/server_scripts/Youkai's Homecoming/` 现有改动清单。
2. 对照整合包其他食物工作站，标出重复产物、独占产物、材料替换遗漏和成本失衡项。
3. 产出兼容对照表（可落在 `docs/` 或 dev-knowledge），并据此补/删/改配方。
4. JEI 内逐工作站复核展示与实际制作路径。

### 开放问题

- 对照表放在哪一层（`docs/` 专题还是 dev-knowledge）取决于最终体量；若只是台账，优先 `docs/dev-knowledge/content-map.md` 条目 + 简短专题。
- 蒸笼/发酵罐与 Farmer's Delight 烹饪锅、Bakeries 的边界是否需要统一的“加工时间/燃料成本”基线？

---

## 2. 动力砂轮无法正常运行（修复或迁移到附魔工业机械砂轮）

### 背景

`createdelight:mechanic_grinding_wheel`（动力砂轮）是 MBD2 动能机器：

- 定义：`ldlib/assets/mbd2/kinetic_machine/mechanic_grinding_wheel.km`、模型与贴图在 `ldlib/assets/mbd2/models|textures/`。
- 逻辑：`kubejs/server_scripts/mbd2/mechanic_grinding_wheel.js`
  - tick：按转速间隔把 `item_input_slot` 中物品移出品质 NBT 后送入 `item_output_slot`（只去品质、保留普通物品、不产出生命质）。
  - 右键：对可损坏物品造成基于转速的耐久伤害，并推进 Tetra 磨砺（honing）。
- 合成：`kubejs/server_scripts/Crate Delight/recipe.js`。
- 玩家说明见 FTB Quests `Feast_Afoot.snbt`（“动力砂轮只负责自动移除品质并保留普通物品……”）。

**现状问题**：机器目前无法正常运行（具体表现待复现：不 tick、不吞吐、trait 名对不上、转速判定异常等均有可能）。根因未定位。

### 备选方案

| 方案 | 内容 | 取舍 |
|---|---|---|
| A. 修复现有动力砂轮 | 定位 MBD2 机器/trait/脚本问题并修复 | 保留自定义机器与任务文本；若 MBD2 动能机本身脆弱，后续维护成本高 |
| B. 迁移到附魔工业机械砂轮 | 用 `create_enchantment_industry:mechanical_grindstone`（及其 `grindstone_drain`）承载去品质与磨砺功能 | 与附魔工业体验统一、少一台自定义机器；需要改配方/任务/tooltip，并把去品质与 Tetra 磨砺逻辑挂到 CEI 砂轮上（CEI 原生 grinding 主要面向经验产物） |

### 目标

- 动力砂轮的两项能力（自动去品质、右键磨砺 Tetra 武器）有稳定可用的实现入口。
- 若迁移：任务、JEI、合成配方与玩家文案同步更新，不出现“幽灵机器”或失效任务。
- 去品质仍不产出生命质（与品质吸收器/生命质萃取仓职责边界保持一致）。

### 实施步骤（待展开）

1. 进游戏复现“无法正常运行”，确认是机器注册、trait 名（`item_input_slot`/`item_output_slot`）、动能接入还是脚本逻辑问题。
2. 评估方案 A 修复成本；若问题在 MBD2 动能机定义层且难修，转方案 B。
3. 方案 B 需确认 CEI `MechanicalGrindstone` / `GrindingRecipe` 的扩展点（能否挂自定义 grinding 配方或事件），再决定是数据驱动还是 KubeJS/CDC 侧挂逻辑。
4. 同步更新 `Feast_Afoot.snbt` 任务文本与相关 tooltip（任务文案只写当前规则，不写迁移说明）。

### 开放问题

- 去品质是否做成 CEI grinding 配方（数据驱动），还是保留脚本按 NBT 处理？后者更贴现有 `QualityUtils` 逻辑。
- Tetra 磨砺是否必须保留手动右键手感，还是允许砂轮全自动磨砺？

---

## 3. 杠杆锤会锤烂铁砧

### 背景

杠杆锤是 Vintage Improvements（`vintageimprovements` 0.3.7.8）的 `vintageimprovements:helve_hammer`。按模组设计：

- 配上锻造台可处理锻造配方；
- 配上铁砧可处理特殊锤击配方（`vintageimprovements:hammering` 类）。

**现状问题**：使用杠杆锤时会把铁砧锤烂（方块被破坏/损坏异常）。是锤击逻辑误伤铁砧方块、还是借用原版铁砧“使用损耗”却未正确限制，待定位。根因未定位。

### 目标

- 杠杆锤正常执行锤击配方，铁砧不被误破坏；或在确实需要损耗时提供明确、可控的耐久/替换机制（如专用锤击铁砧）。
- 不改变杠杆锤“锻造台 / 铁砧”双模式的玩法分工。

### 实施步骤（待展开）

1. 进游戏复现：确认铁砧是被方块破坏、耐久扣光、还是转化为其他状态；记录是否仅特定铁砧类型/朝向触发。
2. 查 Vintage Improvements 0.3.7.8 对应交互代码（或已有 issue），判断是上游缺陷还是整合包配置/其他模组干扰。
3. 优先考虑配置或 KubeJS 层修复；若确为上游 bug，按兼容补丁流程处理（记入 `docs/dev-knowledge/compatibility-patches.md`），必要时 hotai/上游补丁。
4. 回归：杠杆锤 + 锻造台、杠杆锤 + 铁砧两条路径均正常，铁砧在长期运行后状态符合设计。

### 开放问题

- “锤烂”是否期望行为（设计上铁砧应有损耗）？若是期望损耗，需改为可感知的耐久机制而非直接消失。
- 是否需要为高频自动锤击提供不可破坏的专用铁砧（多方块或变体）？

---

## 关联文档

- 品质与生命质职责边界：[quality-harvest-life-matter-plan.md](./quality-harvest-life-matter-plan.md)
- 妖怪归家已有内容改动：`docs/dev-knowledge/content-map.md`（妖怪料理横行霸道等）
- KubeJS 自定义配方 schema 约定：`kubejs/AGENTS.md`（`youkaishomecoming:kettle` 等已有内置 schema，不要重复注册）
