# 通用机械深度融合设计

本文记录 Mekanism 四件套（Mekanism / Generators / Tools / Additions）融入本包的完整设计：定位为 Create 产线的气相化学精炼层，不是平行科技线。操作流程见 `.agents/skills/mekanism-integration/SKILL.md`；本文只记录设计事实、数值与门槛。

## 设计目标

- 让 Mek 的气体/化学品体系成为 Create、农夫乐事、北极星、Alex 洞穴四系共享的"气相层"。
- 复刻 AE2 翻译模式：机器合成机械手序列化、加工配方挂包内材料门槛，消灭平行进度。
- 铅/锇保留世界生成（前期手动挖），量产接入矿簇再生体系；锡/铀与既有体系统一。
- 全部新配方命名空间 `createdelight`，删除配方使用 `remove_recipes_*` 工具函数族。
- Mek 全装备线纳入包内终局门槛（tetra 材料 / BKA 主题锭 / 龙血 / `#more_mod_tetra:over_core`），数值交 OED 审查。

## 非目标

- 不添加任何 Mek 社区附属（More Mekanism Processing、Mekanism Tweaks 等）。
- 不用 hotai 补 Mek；能配置/配方解决的不上字节码。
- 不实现自定义化学品注册（kubejs_mekanism UNOFFICIAL 失败时接受 `event.custom()` 回退）。
- 不做种子矿脉结构（世界生成保留后无必要）。
- 第一版不做 CDC 桥（气↔流体程序化互转、辐射×难度联动仅在出现明确阻塞时评估）。

## 核心结论

1. 全家桶 = 四件套，版本号一致（1.20.1 线当前为 10.4.16.80），`side = "both"`，首版 `stable = false`。
2. 一条 7 步序列组装产出"通用机械基座"，基座 + 特征件一步出机器；大机器走 MBD2 装配线。
3. 四级控制电路用包内材料重铺（铜线 → 电子管 → 精密构件 → 超导连接器），成为 Mek 与 Create 冶金线的四个焊点。
4. 五段矿处理倍率保留，门槛做在机器本体：2x 基础 / 3x 进阶 / 4x 锻造钢 / 5x 超导金属。
5. 九台 MBD2 融合机器（化学槽部件）承担五系桥接：聚合反应器、催熟间、氢化反应器、充氧站、推进剂混合站、琥珀酸萃取器、酸洗站等。

## 玩家流程

早期（Create 时代）：
- 主世界手动挖到铅矿（默认密度）与稀遇锇矿（低密度，perChunk 压至默认 1/3~1/2）。
- 电冶金分离器作为"钢的气相快线"：铁锭 + 包内碳粉 → 钢粉，仍需过 Create 熔铸成锭。

中期（锻造钢时代）：
- 序列组装线量产通用机械基座，基座 + 特征件铺开基础机器。
- 2x/3x 矿处理接入 Create 破碎矿（`create:crushed_raw_*` → Mek 富集）。
- 聚合反应器统一乙烯认知：Mek 乙烯气体 ⇄ `createdelight:ethylene_fluid`，毒洞塑料回收入环。
- 矿簇投产：`lead_ore_cluster`（普通档）、`osmium_ore_cluster`（noble 档）→ Mek 粗矿。

后期（超导/星际时代）：
- 4x/5x 解锁；裂变堆并网（燃料 = 包内铀链改型）；核废料 → 钋/钚 → SPS → 反物质。
- 充氧站/推进剂混合站打通北极星氧与燃料闭环。
- 聚变点火为终局仪式：Hohlraum + D-T 燃料 + 超导网络供电的激光点火，与"命定之门"并列。

## 一、装包与配置

| 项 | 决策 |
|---|---|
| 模组 | Mekanism、Mekanism Generators、Mekanism Tools、Mekanism Additions，1.20.1 线（当前 10.4.16.80），四件版本一致 |
| KubeJS 插件 | CurseForge `KubeJS Mekanism UNOFFICIAL`（官方无 1.20.1 版，当前文件 kubejs-mekanism-forge-2001.1.5.1-build.2）；`stable = false`；首启冒烟，失败即移除并全量回退 `event.custom()` |
| 矿生成 | `defaultconfigs/Mekanism/world.toml`：锡/铀 `shouldGenerate = false`；铅默认；锇压密度（upper 65→20、middle 6→3、small 8→4，合计约默认 34%）；盐/萤石保留默认（盐是盐水-氯链入口）。配置键已从 10.4.16.80 源码核实：`[world_generation.<矿>.<矿脉>]` 下 `shouldGenerate/perChunk`，`perChunk` 取值下限为 1 |
| 内容移除 | 数字矿机、地震仪：`remove_recipes_id` + `StartupEvents.modifyCreativeTab(...).remove(...)`（无效再 `JEIEvents.hideItems`），不用配置禁用 |
| 杂项配方 | 批量删除 Mek 自动生成的石材/木料处理配方（`remove_recipes_type/output` 按 JEI 走查清单） |

## 二、矿务与材料

| 矿 | 世界生成 | 前期 | 后期量产 |
|---|---|---|---|
| 铅（普通档） | 保留默认密度 | 手动挖 | `createdelight:lead_ore_cluster` 主世界矿簇 → `mekanism:raw_lead` |
| 锇（贵金属档） | 低密度（1/3~1/2） | 手动挖（偶遇惊喜） | `createdelight:osmium_ore_cluster` noble 矿簇 → `mekanism:raw_osmium` |
| 锡 | 关 | `createdelightcore:tin_ingot` 既有线 | — |
| 铀 | 关 | Alex 洞穴深渊铀链 | — |

矿簇物品照 `createdelight:moon_ore_cluster` 一族结构注册（`registry_item.js`），处理配方挂 `forge:raw_materials/*` 双向标签。不新增 `createdelight:raw_*` 粗矿物品。

### 控制电路四级重铺

| 等级 | 新配方 | 门槛 |
|---|---|---|
| `mekanism:basic_control_circuit` | 锇锭 + 红石 + 铜线（包内无红石合金，用红石） | Create 前中期 |
| `mekanism:advanced_control_circuit` | 基础电路 + `createdelightcore:bronze_ingot` ×2 + 电子管 | 电子管产线 |
| `mekanism:elite_control_circuit` | 进阶电路 + `createmetallurgy:steel_ingot` ×2 + 精密构件 | 精密构件产线 |
| `mekanism:ultimate_control_circuit` | 精英电路 + 精炼黑曜石 + 超导连接器 | 超导时代 |

### 合金统一

- 青铜：删 Mek 铜锡灌注，统一 `createdelightcore:bronze_ingot`（Create 铜锌线为唯一真源）。
- 钢：删 Mek 铁碳灌注；电冶金分离器改产钢粉（须过 Create 熔铸成 `createmetallurgy:steel_ingot`）。
- 精炼黑曜石/萤石：保留 Mek 工艺，黑曜石来源挂包内资源再生链，玻璃外壳用 Create 玻璃。

## 三、通用机械基座与机器装配

### 基座序列组装（产物 `createdelight:mek_chassis`）

| 步 | 动作 | 材料 | 时长 |
|---|---|---|---|
| 1 | 部署 | `createmetallurgy:steel_ingot` ×2 | 10s |
| 2 | 部署 | `createdelightcore:bronze_ingot` | 10s |
| 3 | 灌注 | 熔融玻璃 100mB | 12s |
| 4 | 部署 | `mekanism:basic_control_circuit` | 12s |
| 5 | 部署 | 电子管（Create） | 15s |
| 6 | 灌注 | 润滑油 50mB | 10s |
| 7 | 部署 | `#forge:spring/between_500_2_1000` 任一 | 15s |

过渡物 `incomplete_mek_chassis` / `incomplete_upgrade_chip_base`（单一过渡物，`create:sequenced_assembly` 类型）注册于 `startup_scripts/registry_item_mekanism.js`（注册改动需重启）。

### 机器 = 基座 + 特征件

| 组 | 机器 | 特征件 |
|---|---|---|
| 粉碎系 | crusher / enrichment_chamber / energized_smelter | 钨磨头 / 锇板 / 红石灯 |
| 化学初级 | purification_chamber / chemical_injection_chamber | 铜板+氧储罐 / 聚乙烯管 |
| 灌注系 | metallurgic_infuser | 石墨锭 |
| 电化学 | electrolytic_separator | 电极桶（铅板+铜线） |
| 溶解链 | chemical_dissolution_chamber / chemical_washer / chemical_crystallizer | 硫酸罐 / 塑料滤网 / 冰晶石模具 |
| 氧化/反应 | chemical_oxidizer / pressurized_reaction_chamber / isotopic_centrifuge | 风扇+过滤网 / 耐压壳（锻造钢板）/ 超导连接器 |
| 生活杂项 | nutritional_liquifier / electric_pump / fluidic_plenisher / chargepad / personal_chest | 低门槛直合成，不走基座 |
| 自动化 | formulaic_assemblicator / configurator / robit | 序列组件 / 超导线 / 齿轮+红石 |

### 大机器（MBD2 装配线）

| 机器 | 装配线 | 关键材料 |
|---|---|---|
| 溶解三件套 | 二级 | 基座 + 锻造钢板 ×4 + 精英电路 |
| 裂变堆 controller/port/casing | 三级 | 基座 ×4 + `createdelight:fission_fuel_assembly` + 终极电路 |
| 聚变堆 controller/frame/port | 三级 + 点火仪式 | 基座 ×8 + 超导连接器 ×4 + `northstar:advanced_circuit` |
| SPS casing/port | 三级 | 基座 ×6 + 钚锭 + 精炼黑曜石 |
| 涡轮/锅炉 | 二级 | 基座 + 钢 + `mekanism:structural_glass`（Create 玻璃合成） |

Factory 变体 = 基础机器 + 工厂转换件（基片 ×2 + 对应等级电路），不做独立序列。

## 四、升级模块与装备

### 通用升级基片 `createdelight:upgrade_chip_base`

硅晶圆 → 部署基础电路 → 基片（2 步，成本 ≈ 1.5 张基础电路）。

| 模块 | 终步材料 | 高阶组合 |
|---|---|---|
| speed_upgrade | 红石 | 见下方注记 |
| energy_upgrade | 金锭 | 见下方注记 |
| gas_upgrade | 聚乙烯板 | 单档 |
| filter_upgrade | 纸 | 单档 |
| muffling_upgrade | 白毛毡 | 单档 |
| anchor_upgrade | 锁链 | 单档 |
| stone_generator_upgrade | 黑曜石粉 | 单档 |

注：升级行为由 Mek Java 侧实现，KubeJS 无法新增更高等级的升级件；原设计"高阶组合"（加压/极限速度等）移入 P4 评估是否由 CDC 注册自定义升级物品。

### MekaSuit 逐模块门槛

| 模块（`module_` 前缀） | 追加消耗 |
|---|---|
| jetpack_unit | `northstar:lunar_sapphire_shard`（替换 mekanism:jetpack） |
| electrolytic_breathing_unit | `createdelight:sturdy_oxygen_tank`（替换电解芯） |
| gravitational_modulating_unit | `alexscaves:occult_gem`（替换下界之星） |
| locomotive_boosting_unit | `northstar:advanced_circuit`（替换钻石护腿） |
| hydraulic_propulsion_unit | `#forge:spring/between_500_2_1000`（替换自由跑鞋） |
| radiation_shielding_unit | 原版即铅块门槛，不改（铅的刚需出口） |
| attack_amplification_unit | `iceandfire:dragonbone`（替换铁剑；龙血流体无法入合成台） |
| vision_enhancement_unit | 望远镜（替换绿宝石） |
| magnetic_attraction_unit | `alexscaves:magnetron`（替换铁栏杆） |
| MekaSuit 本体 ×4 | 外壳换锻造钢、精炼萤石换 `alexscaves:occult_gem`（BKA 主题锭待首启核实 ID 后替换） |
| MekaTool | `#more_mod_tetra:over_core`（替换原子分解器）+ 锻造钢；龙血仪式延后至 P2 血系机器 |

注：1.20.1 无 solar_recharging 模块（P1 落地时从 JAR 核实），原表该行作废；泰坦火种卷轴 ID 未核实前以 `northstar:advanced_circuit` 顶替速度模块门槛。

Tools 线：锇/青铜/钢工具保留（材料 sink）；精炼黑曜石/萤石套挂聚变时代门槛；全装备数值入 OED 审查。MekaSuit 模块全枚举以游戏内注册表转储为准（P1 时补全本表）。

## 五、加工配方重铺

| 段 | 机器 | 倍率 | 门槛 | 联动 |
|---|---|---|---|---|
| 1x | crusher | 矿→1 粉 | 基座 | 与 Create 破碎机并行（Mek 快、Create 出副产） |
| 2x | enrichment_chamber | →2 粉 | 基础电路 | `create:crushed_raw_*` 入口 → 1.5 粉 |
| 3x | purification_chamber | →3 粉（耗氧） | 进阶电路 | 电解供氧，电 = CA 网络 |
| 4x | chemical_injection_chamber | →4 結晶（耗氯） | 锻造钢门槛 | 氯来自电解盐水 |
| 5x | 溶解三件套 | →5 结晶 | 超导金属门槛 | 脏浆液入口 = `forge:raw_materials/*` + Create 破碎矿 |

Mek 机器 FE 消耗保留默认，只动门槛与产线归属。custom JSON 字段名以 `/kubejs hand` 实测为准（P0 校准）。

## 六、五系融合机器（MBD2，均用化学槽部件）

| 机器 ID | 配方核心 | 门槛 |
|---|---|---|
| `createdelight:polymerization_reactor` | Mek 乙烯 200mB ⇄ `createdelight:ethylene_fluid` 250mB；毒洞聚乙烯废料+氧→乙烯；乙烯+锡催化剂→聚乙烯板 | 锻造钢 |
| `createdelight:ripening_chamber` | 乙烯 50mB + 作物 → 立即成熟，品质强制最低档；白名单挂 `createdelight:quality_crops` | 进阶电路 |
| `createdelight:hydrogenation_reactor` | Mek 氢 100mB + 植物油 100mB → 人造黄油（FoodBuilder 注册） | 进阶电路 |
| `createdelight:oxygen_charging_station` | Mek 氧 1000mB → northstar 氧气罐充填；月冰 4 → 水 1000mB（月面闭环） | 金星科技后 |
| `createdelight:propellant_mixing_station` | 氢 250 + 氧 250 → northstar 推进剂 500mB | 金星科技后 |
| `createdelight:amber_acid_extractor` | `alexscaves:ambersol` + Mek 硫酸 100mB → 琥珀酸 ×2 + 史前琥珀糖（epic） | 深渊探索后 |
| `createdelight:acid_washing_station` | `alexscaves:acid` ⇄ Mek 硫酸/氢氯酸（1:1.2） | 进阶电路 |
| 营养液化器重铺（配方层） | 市场饱和过剩类目食物 ×2 → `mekanism:biomass`（读 `global.Order.getModifier`） | 基座 |
| 核循环扩展（配方层） | alexscaves 铀 → 自研燃料组件 或 Mek 裂变燃料气；废料→钋/钚；钋与鸡蛇之眼难度掉落互备 | 超导时代 |

## 七、电力定位

CA 发电机（早期）→ CDG 燃油 + CNA（中期）→ 水电（可再生）→ Mek 涡轮（中期大功率）→ 裂变（后期）→ 聚变（终局，出力档位刻意压到"唯有超导网络可承载"）。涡轮叶片收益递增与冷却需求同步上涨，参照自研堆 `40960×倍率×1.0415^组件` 的指数传统。

## 八、订单系统扩展

- `category_groups.json` 新增 `machine` 类目；饱和衰减系数 0.6× 食物档。
- 顾客组：外星工程师 / 机器人主厨 / 废土军火商。
- 供货目录起步 8 项：基础/精英电路、精密构件、钢锭、聚乙烯板、`fission_fuel_assembly`、超导连接器、琥珀酸、人造黄油。
- 新条款：`precision_tolerance`（品控+1 级付 1.5×）、`sterile_packaging`（附保鲜膜）、`cold_chain`（限时+冷却剂）。
- 回礼表 `robot_restaurant`（12 条目，照现有 18 张表格式）。

## 九、任务章节「气相革命」（24 任务）

主线（10）：气相之始（基座）→ 首台富集仓 → 氧气瓶 → 塑料之心 → 化学之门（4x）→ 矿簇精炼师 → 裂变并网 → 聚变点火（终局仪式，奖励超导蓝图+异彩化合物）→ 反物质传奇 → SPS 满负荷。
支线（14）：催熟间与节气的取舍（阅读+对比 ×2）、废料回收商（×2）、琥珀酸甜品师（FD 联动 ×3）、机器人常客（machine 订单声望链 ×4）、Mek 难度条目（×3）。
依赖：`Super_Multiblock → Voyage_of_Stars` 之后；聚变点火与「命定之门」并列终局。文案遵守 AGENTS 玩家文案条款。

## 十、难度与杂项

- 辐射区掉落挂难度：危机四伏+ 掉钋尘、险象环生+ 掉贫铀（复用 `rank_N` custom reward）。
- Additions 小生物 4 条目进难度索引（rank_1 档）；黑曜石 TNT 纳入爆炸规则审查。
- JEI 新增「化学品速查」信息页（client_scripts `info.js` 模式）；`unified_loot.js` 北极星池追加 Mek 电路。

## 十一、语言与登记

新 lang 键约 40 条：`block.createdelight.*`（9 机器）、`item.createdelight.*`（基座/基片/矿簇 ×2/人造黄油/琥珀酸/琥珀糖/电极桶/耐压壳等）、`gui.createdelight.*.status.*`、`message.*` 6 条；中文风格对齐现有（口语化但术语克制）。

## 十二、验证与验收

| 系统 | 端到端用例 |
|---|---|
| 装包 | 首启无崩溃；JEI 无 Mek 锡/铀矿；CA 超导线 ↔ Mek 通用线缆 + 能量立方 FE 双向 |
| 基座 | 一条部署器产线实跑 7 步序列；JEI 全机器合成链可达 |
| 矿务 | 铅/锇可挖、矿簇可产、标签双向（Mek 机器吃包内矿、包内产线吃 Mek 粉） |
| 融合机器 | 9 台机器各自核心配方跑通一遍 |
| 经济 | machine 订单全流程（草稿→开封→备货→交付→回礼） |
| 平衡 | MekaSuit/MekaTool/Tools 高阶套在难度 4 档下的战斗表现 |

## 十三、PR 映射

| 阶段 | PR | 内容 |
|---|---|---|
| P0 | 1 | 四件套+插件装包、矿生配置、杂项配方清理、CA 白名单、首启验证 |
| P1 | 2-3 | 材料统一、基座序列+特征件、升级模块、装备门槛与 OED |
| P2 | 3-5 | 九台融合机器、核循环、乙烯桥、氧气/推进剂、订单 machine 类目 |
| P3 | 2-3 | 任务章节、战利品/难度接入、lang/JEI 收尾 |
| P4 | 按需 | CDC 桥（仅阻塞时） |

## P0 实测确认清单

- [x] Tools 四件在 1.20.1 的 CurseForge 文件可用性（2026-08-24 确认：四件均有 10.4.16.80）
- [x] `world.toml` 矿生配置实际键名（2026-08-24 从 Mekanism 1.20.x 分支 WorldConfig.java/OreType.java 核实：`[world_generation.<ore>.<vein>]`，vein 名 small/middle/large/upper/buried/normal；10.4.16 的矿生成放置器带 `mekanism:disableable`，配置关闭即生效，无需数据包覆盖）
- [ ] Mek 裂变燃料气/废料气体 ID（isotopic centrifuge 链）
- [ ] custom JSON 化学配料字段名（`/kubejs hand` 校准 separating/reacting 等）
- [ ] MekaSuit 模块全枚举（注册表转储补全 §四 表）
- [ ] UNOFFICIAL 插件与 KubeJS build.24 兼容冒烟（插件版本前缀指向 2001.1.x，风险已知）
- [ ] Additions 小生物被 OED 与 Improved Mobs 正确扫描

