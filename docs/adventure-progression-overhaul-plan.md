# 冒险流程与配方魔改规划

依据：`C:\Users\HASEE1\Downloads\齿轮盛宴 流程规划 草稿.docx`

本文用于统一 Create-Delight Remake 的冒险线、星系线和 More Mod Tetra 配方门槛。目标是让可制作卷轴、饰品基底、核心材料与“主世界冒险 -> 可选支线 -> Create: Northstar 星系探索 -> 后期 Boss”的流程相互支撑，避免低成本工作台配方绕过中后期内容。

## 定位总览

### 主线与支线

- Create: Northstar 替代 Ad Astra 成为星系探索主线。
- Cataclysm Boss 与星球阶段绑定，作为跨星球推进和高阶配方的主要战斗门槛。
- Tetra 锻造提供装备成长骨架，高阶材料消耗 Boss 战利品、星球矿物、Apotheosis 神化宝石和阶段性特殊材料。
- Iron's Spellbooks 作为流派化魔法成长线处理，究极魔法和强法杖卷轴需要绑定 Boss 或星球材料。
- 末地不只属于终局。末地易于到达，因此末影龙材料分层使用：普通末影龙材料进入中期支线，高阶龙心和末影守卫材料保留到后期。
- 蜜蜂领域是早中期可选冒险线，承担食物、流体、支援材料、饰品和圣所挑战奖励，不作为 Northstar 主线硬门槛。
- Alex's Caves 洞穴按星球地下、副本入口或小天体分配，避免强力洞穴材料在主线外孤立产出。

### 阶段材料原则

- 普通卷轴晚于对应模块的基础流程。
- 泰坦卷轴定位为阶段 Boss 或高阶支线奖励，不由 `writable_book`、下界之星或普通矿物宝石直接量产。
- 饰品基底可在中期开放，强镶嵌和流派饰品消耗 Boss、星球或圣所材料。
- Cataclysm core 消耗对应 Boss 战利品或召唤物，避免钻石芯配方直接量产。
- Ice and Fire 作为龙血、龙钢、龙骨主题补充，不作为所有中后期门槛的唯一主轴。
- 草稿中的“宝石”指 Apotheosis 神化宝石，不是普通钻石/绿宝石，也不是 Tetra 的 `pristine_*` 无瑕宝石。
- 神化宝石门槛采用“晶洞 + Tetra 加工台 + 锤级 + 阶段材料”路线，并受难度阶段限制。
- Tetra 无瑕宝石保留为锻造和基础配方耗材；神化宝石用于阶段奖励、强镶嵌、泰坦卷轴和高阶饰品门槛。

## 阶段流程

| 阶段 | 阶段标记来源 | 主要内容 | 材料定位 |
|---|---|---|---|
| 主世界基础 | Tetra 遗迹、主世界 Boss 或基础任务 | Tetra 遗迹、锻造钢、斯库拉、初级神化宝石 | 基础卷轴、基础饰品、早期雷系/战斗改装 |
| 蜜蜂领域 | 进入维度、蜂后交易、蜂之精华任务 | 糖水、蜂蜜、巢室迷宫、蜂后交易、蜂王浆 | 食物/流体经济、支援型饰品、浪漫/生命/回复主题材料 |
| 末地支线 | 击败末影龙、探索末地城 | 末影龙、末地城、龙筋、终结龙血、终结龙锭 | 末影回响、弓弦/投掷、末影法术、中期 Tetra 金属 |
| 月球 | 星图月球科研达标、登陆月球、击败先驱者 | 先驱者、月球矿物、初级星系设备 | 星图推进、虚空/机械核心、月背异常前置 |
| 火星 | 星图火星科研达标、登陆火星、击败下界合金巨兽 | 下界合金巨兽、火星钢、重型结构材料 | 高质量锻造、盾牌/重武器、火星装备门槛 |
| 水星 | 星图水星科研达标、登陆水星、击败炎魔 | 炎魔、高温环境、磁场洞穴 | 火系法术、磁场/机械饰品、耐热材料 |
| 金星 | 星图金星科研达标、登陆金星、击败远古遗魂 | 远古遗魂、辐射洞穴、原始洞穴 | 辐射防护、远古金属、原始/灭绝主题材料 |
| 土卫二 | 木星系推进、登陆土卫二、击败咒翼灵骸/利维坦 | 咒翼灵骸、冰封地表、渊海深窟、利维坦 | 深渊、水下生存、冰寒/诅咒高阶材料 |
| 星系终局 | 末影守卫、星系结晶、终局任务 | 末影守卫、终极龙心、星系结晶、AE2 奇点 | 终局泰坦卷轴、创造级镶嵌、最高阶装备 |

### Apotheosis 宝石体系

草稿中的宝石线对应 Apotheosis 的宝石系统。该系统的实际物品是 `apotheosis:gem`，具体种类和稀有度由宝石数据与 NBT 决定；配方设计时不应把它等同于 `#forge:gems/*` 或 Tetra 的 `tetra:pristine_*`。

| 来源 | 设计规则 |
|---|---|
| 阶段晶洞 | 在 Tetra 加工台开启。晶洞按阶段分级，需要对应阶段材料和锤级；开启后只产出该阶段允许的神化宝石。 |
| 精英怪 / Boss | 掉落逻辑接近原 Apotheosis，但采用“双轴限制”：流程阶段决定可出现的宝石种类，难度档位只决定品质上限和额外收益。 |
| 地牢/星球奖励 | 每个星球的大型地牢或 Boss 奖池提供对应主题宝石，作为探索和战斗的长期驱动力。 |
| 宝石切割 | `apotheosis:gem_cutting_table`、`apotheosis:gem_dust` 和珍宝材料保留为升级消耗；高稀有度升级应吃阶段材料。 |

本包已经通过 `kubejs/data/apotheosis/loot_modifiers/gems.json` 禁用了 Apotheosis 默认宝石战利品注入，后续需要用自定义战利品、任务奖励、晶洞开启或精英怪逻辑重新投放。

阶段分配建议：

| 阶段 | 神化宝石方向 |
|---|---|
| 主世界基础 | core 通用宝石与 overworld 宝石，如 `lightning`、`earth`、`royalty`。 |
| 蜜蜂领域 | 支援/回复/生命主题宝石，或将圣所精华作为宝石升级材料。 |
| 末地支线 | the_end 宝石，如 `endersurge`、`mageslayer`；绑定末影龙后和末地城探索。 |
| 月球 | `lunar`、虚空、低重力和机械主题宝石；用于月背异常区前置。 |
| 火星/水星/金星 | 火焰、高温、磁场、辐射和远古主题宝石。 |
| 土卫二 | 冰寒、深渊、水下生存、诅咒主题宝石。 |
| 星系终局 | 终局宝石池和星系结晶绑定，用作最终镶嵌和泰坦卷轴门槛。 |

### 难度系统整合

本包难度系统独立于原版和平/简单/普通/困难。当前 `config/improvedmobs/common.toml` 关闭了 Improved Mobs 原生难度缩放，实际流程由 FTB 任务自定义奖励、玩家死亡惩罚、HUD 显示和 KubeJS 掉落逻辑共同驱动。

难度值会上下浮动，也允许玩家手动调整或关闭变化，因此不适合作为主线硬锁。进阶难度以末影龙首杀作为解锁点；末影龙前即使难度值已经记录或浮动，奖励判定仍视为“风平浪静”。流程设计采用“双轴制”：

- 流程阶段轴负责解锁内容：Boss 首杀、维度抵达、星图科研、任务提交和特殊记录决定玩家或队伍已经到达哪个阶段。
- 难度轴负责奖励质量：难度只影响精英怪额外掉落、神化宝石品质、材料产量和高风险奖励池。
- 实际奖励池取两者交集：阶段决定“能出什么种类”，难度决定“能出多高品质”。

| 档位 | 启用条件 / 数值范围 | 名称 | 奖励用途 |
|---:|---|---|---|
| 0 | 末影龙首杀前 | 风平浪静 | 基础生存、建设和装备准备期；不启用高风险奖励、rare+ 神化宝石和主要死亡惩罚。 |
| 1 | 末影龙后，1-100 | 暗流涌动 | 进阶难度正式启用；普通额外掉落、common/uncommon 神化宝石品质上限。 |
| 2 | 末影龙后，101-200 | 危机四伏 | rare 品质上限，解锁部分高难度额外掉落。 |
| 3 | 末影龙后，201-300 | 险象环生 | epic 品质上限，适合作为中期刷取收益档。 |
| 4 | 末影龙后，301-450 | 生灵涂炭 | mythic 入门品质上限，提升星球地牢和精英怪收益。 |
| 5 | 末影龙后，451-600 | 末日降临 | mythic 稳定产出，适合作为后期刷取收益档。 |
| 6 | 末影龙后，600+ | 诸神黄昏 | ancient 品质上限和终局高风险奖励池。 |

机制规则：

- 难度增长由 FTB 任务自定义奖励标签驱动：`rank_1`、`rank_3`、`rank_5`、`rank_10`、`rank_15` 等增加数值，`unrank_10` 等降低数值。
- `rank_unrepeatable_*` 用于维度或关键节点的一次性难度奖励；普通 `rank_*` 任务会在领取后重置，可重复推进难度。
- 玩家可通过难度章节的交付任务手动增加或降低 10 点难度，也可用 `change_rank_change_state` 切换是否允许难度变化。
- 末影龙首杀前的难度值只作为基础记录、HUD 展示和轻量反馈，不参与高风险奖励池、rare+ 宝石品质和主要死亡惩罚。
- 末影龙首杀后解锁进阶难度判定；若此时记录值低于 1，应至少进入档位 1，避免击败末影龙后仍停留在无奖励的保护期。
- 死亡不会清空难度，而是扣除当前档位内约 35% 进度，并按 5 点粒度向上取整；刚进入新档位时可能掉回上一档后段。
- 屏幕左侧 HUD 显示当前档位和本档进度；`/improvedmobs` 可查看当前数值。

掉落与奖励规则：

- `kubejs/startup_scripts/custom/loot_data.js` 定义高难度额外掉落，`kubejs/server_scripts/Improved Mobs/loot.js` 按玩家当前档位判定是否加入掉落。
- 已有例子：`iceandfire:cockatrice_eye` 要求档位 2；`iceandfire:dragonsteel_ice_ingot` 要求档位 3。
- 高难度掉落应作为“额外收益”和“后期刷取减负”，不作为 Northstar 主线的唯一硬锁。
- 掉落脚本应先检查末影龙首杀状态；未解锁进阶难度时，玩家有效档位按 0 处理，即使底层难度值已经高于 0。
- 神化宝石投放采用双轴限制：精英怪、Boss、晶洞和星球地牢的宝石种类由流程阶段决定，品质上限由玩家当前难度档位决定。
- 主线关键材料必须存在阶段保底来源，例如 Boss 首杀、任务奖励、结构宝箱或星图记录奖励；难度只提高掉率、产量或附加战利品。
- 玩家击杀掉落存在按档位提升的脚本意图，后续调整高阶材料产量时需要同时检查全局掉落倍率，避免神化宝石和 Boss 材料过量。

神化宝石品质与难度对应：

| 难度档位 | 允许品质 | 含义 |
|---:|---|---|
| 0 | 无进阶品质 | 末影龙前不通过难度系统投放高风险宝石奖励，避免开局数值浮动破坏保护期。 |
| 1 | common / uncommon | 末影龙后开放基础战斗收益，不改变流程解锁。 |
| 2 | rare | 中低难玩家可获得可用宝石，但不会提前解锁后期种类。 |
| 3 | epic | 中期刷取收益档，适合末地/月球/火星阶段玩家。 |
| 4 | mythic 入门 | 高难收益档，适合水星/金星或同等阶段玩家。 |
| 5 | mythic 稳定 | 后期刷取收益档，适合土卫二和利维坦阶段玩家。 |
| 6 | ancient | 终局品质上限，仍需对应流程阶段才进入终局宝石池。 |

### 末地材料分层

| 材料 | 阶段 | 用途 |
|---|---:|---|
| `tetra:dragon_sinew` | 末影龙后 | 弓弦、投掷/回响改装、部分末影主题卷轴。该材料可较早进入流程，但不承担终局门槛。 |
| `blackknightarmor:end_dragon_blood` | 末影龙后 | 龙息/末影涂层、铁魔法末影或虚空方向、抗性/药剂类材料。 |
| `blackknightarmor:end_dragon_ingot` | 月球前后到火星前后 | 高锤级 Tetra 金属、末地支线装备、中后期强改装材料；避免作为所有泰坦卷轴的通用钥匙。 |
| `blackknightarmor:ultimate_dragon_heart` | 末影守卫或星系终局 | 终局龙系装备、星系结晶、最高阶泰坦卷轴材料。 |

### 蜜蜂领域分层

| 层级 | 内容 | 用途 |
|---|---|---|
| 早期层 | 进入蜜蜂领域、糖水、蜂蜜、花头饰、蜂群之护 | 主世界早期可选冒险；补充食物、蜂蜜流体、糖水生产和基础支援材料。 |
| 中期层 | 巢室迷宫、蜂蜜指南针、蜂后交易、蜂王浆、蜜蜂公文包、蜂蜜结晶装备 | Tetra 饰品、回复/支援、蜂蜜结晶装备、材料加工支线。 |
| 后期层 | 蜂之精华、永恒圣所、六色能力精华 | `the_legend_scroll_of_romance_titan`、特殊打磨、支援型镶嵌、非消耗任务门槛。 |

本包已经将蜜蜂领域接入 Create 化生产：

- 蜂王浆、蜂蜜、糖水具备流体处理、压缩、灌装或加压路线。
- 蜂面包改为使用 `the_bumblezone:pollen_puff` 与 `create:honey` 灌装。
- 蜜蜂汤改为 Farmer's Delight 烹饪路线，消耗蜂面包、蜂刺和蜂蜜相关材料。
- 结晶花掉落替换为 `createdelight:unactivated_crystalline_flower`，再通过经验灌装激活为 `the_bumblezone:crystalline_flower`。
- 蜂王浆和蜂之精华不作为普通工作台量产材料，应保持挑战、交易和任务价值。

### Boss 与洞穴分配

| 内容 | 阶段归属 |
|---|---|
| 斯库拉 | 主世界 Boss，雷系与早期战斗门槛 |
| 先驱者 | 月球 Boss，虚空/机械/星图推进门槛 |
| 下界合金巨兽 | 火星 Boss，重型金属与高质量锻造门槛 |
| 炎魔 | 水星 Boss，火系和高温材料门槛 |
| 远古遗魂 | 金星 Boss，远古金属和原始洞穴门槛 |
| 咒翼灵骸 | 土卫二地表 Boss，诅咒与冰封地表门槛 |
| 利维坦 | 土卫二地下 Boss，深海和渊海材料门槛 |
| 末影守卫 | 末地后期 Boss，终极龙心和终局门槛 |

| Alex's Caves 洞穴 | 归属 |
|---|---|
| 异寂空谷 / Forlorn Hollows | 月背异常区 / 深月裂谷，作为月球后置隐藏火箭目的地或副本入口 |
| 磁场洞穴 / Magnetic Caves | 水星地下，提供钕、磁场与机械主题材料 |
| 辐射洞穴 / Toxic Caves | 金星地下，提供辐射、核能与防护主题材料 |
| 原始洞穴 / Primordial Caves | 金星地下 / 远古地层，提供灭绝、琥珀、远古生物主题材料 |
| 渊海深窟 / Abyssal Chasm | 土卫二地下，提供深海、潜航、利维坦主题材料 |
| 糖果龋洞 / Candy Cavity | 可选小天体，如糖果彗星或糖晶小行星；用于食物、仙灵和趣味法术支线 |

土卫二替代草稿中的旧冰卫星阶段。当前仓库仍存在 `northstar:europa` / Europa 命名，落地时需要统一任务文本、维度 ID 和策划名称。

## 可用材料 ID

- Cataclysm：`cataclysm:essence_of_the_storm`、`cataclysm:void_core`、`cataclysm:void_crystal`、`cataclysm:void_eye`、`cataclysm:monstrous_horn`、`cataclysm:monstrous_eye`、`cataclysm:flame_eye`、`cataclysm:ignitium_ingot`、`cataclysm:witherite_ingot`、`cataclysm:ancient_metal_ingot`、`cataclysm:necklace_of_the_desert`、`cataclysm:abyssal_egg`、`cataclysm:abyssal_sacrifice`、`cataclysm:abyss_eye`、`cataclysm:tidal_claws`、`cataclysm:cursium_ingot`、`cataclysm:cursed_eye`、`cataclysm:cursed_tombstone`、`cataclysm:gauntlet_of_guard`
- Black Knight Armor：`blackknightarmor:ultimate_dragon_heart`、`blackknightarmor:storm_essence`、`blackknightarmor:end_dragon_ingot`、`blackknightarmor:end_dragon_blood`
- Ice and Fire：`#iceandfire:dragon_bloods`、`iceandfire:fire_dragon_blood`、`iceandfire:ice_dragon_blood`、`iceandfire:lightning_dragon_blood`、`iceandfire:dragonbone`、`iceandfire:cyclops_eye`、`iceandfire:pixie_dust`
- The Bumblezone：`the_bumblezone:essence_of_the_bees`、`the_bumblezone:royal_jelly_bottle`、`the_bumblezone:royal_jelly_bucket`、`the_bumblezone:pollen_puff`、`the_bumblezone:bee_stinger`、`the_bumblezone:honey_crystal_shards`、`the_bumblezone:glistering_honey_crystal`、`the_bumblezone:crystalline_flower`、`the_bumblezone:honey_crystal_shield`、`the_bumblezone:stinger_spear`、`the_bumblezone:bee_cannon`、`the_bumblezone:crystal_cannon`
- Alex's Caves：`alexscaves:shadow_silk`、`alexscaves:pure_darkness`、`alexscaves:occult_gem`、`alexscaves:immortal_embryo`、`alexscaves:abyssmarine`、`alexscaves:sea_glass_shards`、`alexscaves:marine_snow`、`alexscaves:magic_conch`、`alexscaves:submarine`、`alexscaves:floater`、`alexscaves:scarlet_neodymium_ingot`、`alexscaves:azure_neodymium_ingot`、`alexscaves:galena_gauntlet`、`alexscaves:heart_of_iron`、`alexscaves:telecore`、`alexscaves:holocoder`、`alexscaves:polymer_plate`、`alexscaves:fissile_core`、`alexscaves:uranium`、`alexscaves:uranium_rod`、`alexscaves:radon_bottle`、`alexscaves:waste_drum`、`alexscaves:raygun`、`alexscaves:tremorzilla_egg`、`alexscaves:tectonic_shard`、`alexscaves:ominous_catalyst`、`alexscaves:volcanic_core`
- Apotheosis：`apotheosis:gem`、`apotheosis:gem_dust`、`apotheosis:gem_cutting_table`、`apotheosis:gem_fused_slate`；宝石种类来自 `data/apotheosis/gems/**`，如 `lightning`、`lunar`、`earth`、`royalty`、`endersurge`、`mageslayer`、`inferno`、`blood_lord`
- 本包 / 其他流程材料：`createdelight:dread_heart`、`createdelight:forged_steel_ingot`、`createdelight:forged_steel_sheet`、`createdelight:sturdy_oxygen_tank`、`dreadsteel:dreadsteel_ingot`、`northstar:circuit`、`northstar:advanced_circuit`、`northstar:martian_steel_ingot`、`northstar:martian_steel_sheet`、`northstar:titanium_sheet`、`northstar:durable_fabric`、`tetra:pristine_amethyst`、`tetra:pristine_diamond`、`tetra:pristine_emerald`、`tetra:forged_mesh`、`tetra:forged_bolt`
- 终局/备选材料：`alexsmobs:void_worm_eye`、`ae2:singularity`

## MMT 配方门槛

### 当前状态

- `kubejs/data/tetra/recipes/more_mod_tetra/the_legend_scroll/titan/the_legend_scroll_of_time_titan.json` 已禁用。
- `kubejs/data/more_mod_tetra/recipes/arknights/**` 的胜利证明与资质凭证配方已禁用。
- `kubejs/data/more_mod_tetra/recipes/cataclysm/monstrous_core.json` 已禁用。
- `kubejs/data/more_mod_tetra/recipes/iron/{cloth,ingot}/sound_*.json` 已禁用。
- MMT JAR 内其他卷轴大多仍可合成，典型成本为 `minecraft:writable_book` 加普通材料。
- MMT JAR 内饰品基底、杆件、Cataclysm core 的原配方整体偏轻。

### 必须重做的卷轴

覆盖路径位于 `kubejs/data/tetra/recipes/more_mod_tetra/`。

| 覆盖路径 | 当前问题 | 阶段 | 配方方向 |
|---|---|---:|---|
| `forge_hammer/mmt_quality_scroll.json` | 基础成本偏低 | Tetra 基础后 | 保留 `tetra:planar_stabilizer`，追加 `createdelight:forged_steel_sheet`、`tetra:pristine_amethyst` |
| `forge_hammer/mmt_settled_scroll.json` | 遗迹件成本不足 | Tetra 基础后 | 保留 `tetra:lubricant_dispenser`、`tetra:vent_plate`，追加 `createdelight:forged_steel_ingot`、`tetra:forged_mesh` |
| `forge_hammer/mmt_high_quality_scroll.json` | 低级卷轴直接升级 | 主世界 Boss 后 | 2 张 `mmt_quality_scroll` + `cataclysm:essence_of_the_storm` + `tetra:pristine_diamond` |
| `forge_hammer/mmt_high_settled_scroll.json` | 低级卷轴直接升级 | 火星后 | 2 张 `mmt_settled_scroll` + `cataclysm:monstrous_horn` + `northstar:martian_steel_ingot` |
| `mmt_skill_improvements.json` | 只吃铁工具和废金属 | Tetra 基础后 | `writable_book` + `tetra:forged_mesh` + `createdelight:forged_steel_ingot` + `create:precision_mechanism` |
| `mmt_more_improvements.json` | 只吃钻石/紫水晶 | 月球后 | `mmt_skill_improvements` + `northstar:advanced_circuit` + `tetra:pristine_diamond` |
| `mmt_over_improvements.json` | 强改装过早打开 | 金星后 | `mmt_more_improvements` + `cataclysm:ancient_metal_ingot` + `#iceandfire:dragon_bloods` |
| `mmt_bow_improvements.json` | 木棍/线/龙筋过早 | 末地或月球后 | `northstar:durable_fabric` + `tetra:dragon_sinew` + `cataclysm:void_core` |
| `mmt_shield_skill.json` | 木板和铁即可 | 火星后 | `createdelight:forged_steel_sheet` + `northstar:martian_steel_sheet` + `cataclysm:monstrous_horn` |
| `mmt_critical_strike_improvements.json` | 绿宝石成本过低 | 主世界 Boss 后 | `tetra:pristine_emerald` + `iceandfire:cyclops_eye` + `cataclysm:essence_of_the_storm` |
| `mmt_katana_scroll.json` | 堆下界之星但不接流程 | 土卫二后 | `mmt_over_improvements` + `cataclysm:abyssal_egg` + `dreadsteel:dreadsteel_ingot` |
| `iceandfire/mmt_iceandfire_dragon_scroll.json` | 龙骨/手稿即可 | 龙猎支线中期 | `iceandfire:dragonbone` + 三色龙血各 1 + `createdelight:forged_steel_ingot`；主线锁定版本可追加 `northstar:martian_steel_ingot` |

### 泰坦卷轴

覆盖路径：`kubejs/data/tetra/recipes/more_mod_tetra/the_legend_scroll/titan/*.json`

基础结构：`mmt_more_improvements` 或 `mmt_over_improvements` + 阶段 Boss 战利品 + 阶段矿物/设备 + 对应阶段神化宝石或宝石粉。Tetra 无瑕宝石可作为锻造稳定材料追加，但不代表草稿中的宝石线。时间泰坦保持禁用，直到星系终局任务完成。

| 卷轴 | 阶段 | 主题耗材 |
|---|---:|---|
| `the_legend_scroll_of_worldbearing_titan.json` | 主世界 / 斯库拉后 | `cataclysm:essence_of_the_storm` + 主世界/雷系神化宝石 |
| `the_legend_scroll_of_reason_titan.json` | 月球 / 先驱者后 | `cataclysm:void_core` + `northstar:advanced_circuit` |
| `the_legend_scroll_of_earth_titan.json` | 火星 / 下界合金巨兽后 | `cataclysm:monstrous_horn` + `northstar:martian_steel_ingot` |
| `the_legend_scroll_of_law_titan.json` | 水星 / 炎魔后 | `cataclysm:ignitium_ingot` + `cataclysm:flame_eye` |
| `the_legend_scroll_of_passage_titan.json` | 金星 / 远古遗魂后 | `cataclysm:ancient_metal_ingot` + `cataclysm:necklace_of_the_desert` |
| `the_legend_scroll_of_ocean_titan.json` | 土卫二地下 / 利维坦后 | `cataclysm:abyssal_egg` + `cataclysm:tidal_claws` + `createdelight:sturdy_oxygen_tank` |
| `the_legend_scroll_of_death_titan.json` | 土卫二地表 / 咒翼灵骸后 | `cataclysm:cursium_ingot` + `cataclysm:cursed_eye` + `createdelight:dread_heart` |
| `the_legend_scroll_of_sky_titan.json` | 主世界 Boss 或雷系支线后 | `cataclysm:essence_of_the_storm` + `iceandfire:lightning_dragon_blood` |
| `the_legend_scroll_of_romance_titan.json` | 蜜蜂领域 / 圣所支线后 | `the_bumblezone:essence_of_the_bees` 或六色能力精华 + `iceandfire:pixie_dust` |
| `the_legend_scroll_of_strife_titan.json` | 终局战斗线 | `dreadsteel:dreadsteel_ingot` + `cataclysm:witherite_ingot` |
| `the_legend_scroll_of_cyrene_titan.json` | 末地后期 / 终局 | `blackknightarmor:ultimate_dragon_heart` + `blackknightarmor:end_dragon_ingot` |
| `the_legend_scroll_of_trickery_titan.json` | 末地 / 虚空支线 | `minecraft:echo_shard` + `alexscaves:pure_darkness` + `cataclysm:void_crystal` |
| `the_legend_scroll_of_time_titan.json` | 星系终局 | 保持禁用；启用时使用“星系结晶” + `ae2:singularity` + `blackknightarmor:ultimate_dragon_heart` |

### Iron's Spellbooks 卷轴

覆盖路径：`kubejs/data/tetra/recipes/more_mod_tetra/iron_spell/*.json`

| 范围 | 当前问题 | 配方方向 |
|---|---|---|
| `more_mod_tetra_iron_spell_staff_scroll.json` | 基础法杖卷轴成本偏轻 | `more_mod_tetra:empty_arcane_ingot` + `tetra:pristine_amethyst` + `createdelight:forged_steel_ingot` |
| 元素法杖卷轴 | 基础卷轴 + 符文即可 | 每个元素追加对应 `more_mod_tetra:*_arcane_ingot`，并绑定一个 Boss 或星球材料 |
| 雷系 / storm | 可与斯库拉支线重合 | 使用 `cataclysm:essence_of_the_storm`，定位主世界 Boss 后 |
| 火系 / ignis | 缺少星球门槛 | 使用 `cataclysm:ignitium_ingot` 或 `cataclysm:flame_eye`，定位水星 |
| 末影 / 虚空 | 应分层到月球和末地 | 中期用 `cataclysm:void_core` 或 `blackknightarmor:end_dragon_blood`，终局用 `cataclysm:void_crystal` |
| `more_mod_tetra_iron_spell_eldritch_staff_scroll.json` | 邪术类效果过早 | `minecraft:echo_shard` 或 `alexscaves:pure_darkness`，定位金星后或末地 |
| `more_mod_tetra_iron_spell_sound_staff_scroll.json` | sound 材料来源不稳定 | 保持禁用，直到 `familiarslib:sound_rune` 来源明确 |

### 可制作材料

覆盖路径位于 `kubejs/data/more_mod_tetra/recipes/`。

| 覆盖路径 | 当前问题 | 配方方向 |
|---|---|---|
| `amethyst_rod.json` | 普通紫水晶成本过低 | `tetra:pristine_amethyst` + `tetra:forged_bolt` + `createdelight:forged_steel_sheet` |
| `ender_rod.json` | 木棍 + 末影珍珠 | `minecraft:ender_eye` + `ends_delight:dried_chorus_flower` + `createdelight:forged_steel_ingot` |
| `nether_star_rod.json` | 下界之星产量过高 | `minecraft:nether_star` + `dreadsteel:dreadsteel_ingot` + `cataclysm:cursed_eye`，产量降为 2 |
| `tetra_curios/curios_ring.json` | 铁锭 + 紫水晶 | `createdelight:forged_steel_sheet` + `tetra:pristine_amethyst` + `create:precision_mechanism` |
| `tetra_curios/curios_bracelet.json` | 铁锭 + 紫水晶 | `northstar:titanium_sheet` + `tetra:pristine_emerald` + `cataclysm:essence_of_the_storm` |
| `tetra_curios/curios_emblem.json` | 铁锭/铁粒/圆石 | `createdelight:forged_steel_ingot` + `tetra:pristine_diamond` + `northstar:circuit` |
| `cataclysm/monstrous_core.json` | 原配方已禁用 | 重开时使用 `cataclysm:monstrous_horn` + `cataclysm:monstrous_eye` + `northstar:martian_steel_ingot` |
| `cataclysm/ignitium_core.json` | 钻石芯 + Ignitium | 追加 `cataclysm:flame_eye`，定位水星炎魔核心 |
| `cataclysm/harbinger_core.json` | 钻石芯 + Witherite | 追加 `cataclysm:void_core` + `northstar:advanced_circuit`，定位月球机械/能量核心 |
| `cataclysm/abyssal_core.json` | 钻石芯 + Abyssal | 追加 `cataclysm:abyssal_egg` + `createdelight:sturdy_oxygen_tank`，定位土卫二地下核心 |
| `cataclysm/cursium_core.json` | 钻石芯 + Cursium | 追加 `cataclysm:cursed_eye` + `createdelight:dread_heart`，定位土卫二地表核心 |
| `cataclysm/storm_core.json` | 钻石芯 + Storm | 追加 `cataclysm:essence_of_the_storm` + `northstar:advanced_circuit`，定位斯库拉/雷系核心 |
| `iron/ingot/empty_arcane_ingot.json` | 不接 Tetra | 追加 `tetra:pristine_amethyst` 或 `createdelight:forged_steel_ingot` |

### 保留但加门槛的材料

| 路径范围 | 处理方式 |
|---|---|
| `iceandfire/fire_dragonsteel_core.json`、`ice_dragonsteel_core.json`、`lightning_dragonsteel_core.json` | 保留龙心 + 龙钢主体；按火系、冰系、雷系分别追加水星、土卫二、斯库拉材料 |
| `iron/ingot/*_arcane_ingot.json` | 保留元素符文主题，统一追加 `more_mod_tetra:empty_arcane_ingot` 的上游成本 |
| `iron/cloth/*_magic_cloth.json` | 作为法术布料保留；强元素布料追加对应 `*_arcane_ingot` 或星球材料 |
| `alexscaves/*_core.json` | 绑定月背异寂、水星磁场、金星辐射/原始、土卫二深渊、糖果小天体 |
| `enigmaticlegacy/*_core.json`、`l2complements/hostility_core.json` | 逐个审查后再进入任务奖励或高阶配方 |

## Alex's Caves 联动

MMT JAR 中已有 Alex's Caves 配方：

- `data/more_mod_tetra/recipes/alexscaves/abyssal_ocean_ingot.json`
- `data/more_mod_tetra/recipes/alexscaves/radiation_absorption_core.json`
- `data/more_mod_tetra/recipes/alexscaves/extinction_core.json`

| 覆盖路径 / 目标 | 当前问题 | 阶段 | 配方方向 |
|---|---|---:|---|
| `alexscaves/abyssal_ocean_ingot.json` | `iron_ingot + immortal_embryo` 直接出 8 个 | 土卫二地下 / 渊海深窟 | `alexscaves:immortal_embryo` + `alexscaves:abyssmarine` + `alexscaves:sea_glass_shards` + `createdelight:sturdy_oxygen_tank`，产量降为 2 |
| `alexscaves/radiation_absorption_core.json` | 只吃 `polymer_plate + fissile_core` | 金星地下 / 辐射洞穴 | 追加 `alexscaves:radon_bottle`、`alexscaves:waste_drum`、`northstar:advanced_circuit`；后置版本追加 `alexscaves:tremorzilla_egg` |
| `alexscaves/extinction_core.json` | 与主线连接弱 | 金星后或末地前 | 追加 `cataclysm:ancient_metal_ingot`、`alexscaves:volcanic_core` 或 `alexscaves:amber_monolith` |

| 洞穴 / 支线 | 设计归属 | 可用材料 | MMT 用途 |
|---|---:|---|---|
| 异寂空谷 / Forlorn Hollows | 月背异常区 / 深月裂谷 | `alexscaves:shadow_silk`、`alexscaves:pure_darkness`、`alexscaves:occult_gem`、`alexscaves:dreadbow`、`alexscaves:totem_of_possession` | 暗影/邪术/诡计类泰坦卷轴；`pure_darkness` 作为暗系高阶材料 |
| 磁场洞穴 / Magnetic Caves | 水星地下 | `alexscaves:scarlet_neodymium_ingot`、`alexscaves:azure_neodymium_ingot`、`alexscaves:galena_gauntlet`、`alexscaves:heart_of_iron`、`alexscaves:telecore`、`alexscaves:holocoder` | 雷系、磁场、机械类饰品和卷轴 |
| 辐射洞穴 / Toxic Caves | 金星地下 | `alexscaves:polymer_plate`、`alexscaves:fissile_core`、`alexscaves:uranium`、`alexscaves:uranium_rod`、`alexscaves:radon_bottle`、`alexscaves:waste_drum`、`alexscaves:raygun` | 辐射吸收、防护、科技类核心 |
| 渊海深窟 / Abyssal Chasm | 土卫二地下 | `alexscaves:abyssmarine`、`alexscaves:sea_glass_shards`、`alexscaves:marine_snow`、`alexscaves:magic_conch`、`alexscaves:submarine`、`alexscaves:floater`、`alexscaves:immortal_embryo` | 深海、利维坦、水下生存类卷轴和饰品 |
| 原始洞穴 / Primordial Caves | 金星地下 / 远古地层 | `alexscaves:tectonic_shard`、`alexscaves:ominous_catalyst`、`alexscaves:volcanic_core`、`alexscaves:amber_monolith`、`alexscaves:amber_curiosity`、`alexscaves:tree_star` | 灭绝核心、远古遗魂、骸龙骨、缴械主题材料 |
| 糖果龋洞 / Candy Cavity | 可选糖果小天体 | `alexscaves:caramel`、`alexscaves:gingerbread_crumbs`、`alexscaves:shot_gum`、`alexscaves:frostmint_spear`、`alexscaves:sack_of_sating`、`alexscaves:sugar_staff`、`alexscaves:biome_treat` | 食物、仙灵、法术玩具、趣味饰品支线 |

当前仓库中 `alexscaves:magnetic_caves` 已出现在 `northstar:moon`，`alexscaves:toxic_caves` 已出现在 `northstar:venus`，`alexscaves:abyssal_chasm` 已出现在 `northstar:europa`。若采用本文阶段分配，需要同步维度数据和任务文本。

## Tetra 图纸和材料方向

当前 `kubejs/data/tetra/schematics/mmt_*` 已覆盖：

- 可改装戒指：`critical_strike_ring`、`gem`、`cast_time_gem`、`cooldown_gem`、`goety_cast_duration_gem`
- 可改装手镯：`critical_strike_bracelet`、`protect_bracelet`、`gem`
- 可改装徽章：`warrior_emblem`、`sorcerer_emblem`、`ranger_emblem`、`knight_emblem`、`avenger_emblem`

实施方向：

- 戒指和手镯基底图纸使用 `tetra:metal/`、`tetra:gem/` 路线，避免木/石基底进入强饰品线。
- 徽章图纸使用金属 + 宝石路线，避免任意木、石、骨材料直接制作。
- 镶嵌图纸保留 `tetra:gem/` 作为 Tetra 内部材料分类；高阶镶嵌额外消耗阶段神化宝石和 Boss 材料。
- 斯库拉线：`cataclysm:essence_of_the_storm` 用于雷系镶嵌。
- 蜜蜂领域线：蜂之精华和六色能力精华用于支援型镶嵌、特殊打磨或 `the_legend_scroll_of_romance_titan`，不进入普通工作台量产。
- 末地线：`tetra:dragon_sinew` 用于弓弦/回响/投掷改装，`blackknightarmor:end_dragon_ingot` 用于高锤级金属部件，`blackknightarmor:ultimate_dragon_heart` 保留到终局。
- 利维坦线：`cataclysm:abyssal_egg` 用于深渊镶嵌，效果方向为深渊恐惧或深渊灼烧。
- 远古遗魂线：`cataclysm:ancient_metal_ingot` 与骸龙骨类材料用于手柄、缴械和远古主题改装。
- 神化宝石线：阶段晶洞、精英怪和地牢奖励提供 `apotheosis:gem`，高阶 Tetra 镶嵌和泰坦卷轴消耗对应阶段神化宝石或宝石粉。
- 星系终局：星系结晶作为最终 Tetra 武器/盔甲镶嵌物和泰坦卷轴最高门槛。

## Northstar 机制附录

### 目的地机制

基于 `Northstar-0.6.1+1.20.1.jar` 的火箭核心逻辑：

- 火箭核心使用 `northstar:rocket_station`，目的地由放入的星图或返程票决定。
- 星图记录各星球科研点数。某个星球 science 达到该星球 `required_science` 后，火箭核心会枚举该星球下全部已注册的 `planet_dimension`。
- 火箭核心保存的目标是 `RocketDestination`，核心字段是具体维度 ID。
- 服务端保存/组装时会用服务器侧星图校验 `validateDestination`，目标必须存在于当前星图可选目的地中。
- `planet_dimension` 数据没有独立隐藏或前置字段。同一星球下新增“月球背面”维度会在月球科研达标后与月球地表同时出现。
- 月球背面不适合做成同轨道、同位置的普通可观测星球，望远镜中会产生重叠天体和交互问题。
- 月背异常区 / 深月裂谷应注册为独立隐藏目标，通过任务、遗迹、Boss 或特殊 `northstar:astronomical_reading` 写入星图。
- 特殊观测记录关键 NBT 为 `Origin`、`Planet`、`Science`、`Day`。天文台只要求 `Origin` 和 `Planet` 均为已注册星球。
- 可注册一个无维度、不可抵达的记录来源星体，专门作为异常记录的 `Origin`；实际可飞目标为月背异常区。
- 隐藏星球若不属于当前星系，发射时会走跨行星判断，需要星际导航仪，可作为月球后、火星/金星前后的技术门槛。

### 轨道探测仪与废弃站点

月背异常区的前置采用轨道探测事件：

1. 玩家解锁并前往 `northstar:earth_orbit`。
2. 在安全舱室或火箭附近使用“轨道遥测探测仪”。
3. 探测仪消耗月球科研记录、北极星电路、Tetra 锻造件或灾变 Boss 材料。
4. 服务器在地球轨道中生成封闭的“废弃轨道站”结构。
5. 站内固定放置 `northstar:rocket_waypoint`。
6. 玩家使用星图登记航点后，火箭核心将该航点列为地球轨道下的坐标目的地。
7. 废弃站点产出“残损月背遥测记录 / 特殊观测记录”，再通过天文台或任务解锁月背异常区。

实现判断：

- `northstar:rocket_waypoint` 原生将当前维度、方块坐标和点击方向写入星图。
- 航点属于具体 `planet_dimension` 的坐标目标；玩家解锁地球轨道后，火箭核心可列出地球轨道下的站点航点。
- 首次站点不能只依赖玩家实地登记。轨道维度为真空、低重力、虚空环境，远处站点缺少首个航点时通常不可达。
- 远处生成版本采用“生成结构 + 自动写入首个航点”。站内航点用于抵达后补录、重命名和给队友登记。

远处生成实现要求：

- 探测仪按玩家 UUID、队伍 ID 或世界种子派生固定远处坐标，避免多人站点覆盖。
- 生成结构前临时加载目标区块，可使用服务端 `forceload add` 或 Java/KubeJS 侧取区块；生成完成后释放。
- 结构可用 `/place template createdelight:abandoned_orbital_station <x> <y> <z>`、结构模板 API 或脚本逐块放置。
- 目标区块必须被加载/生成过，结构方块才会可靠落盘。
- 生成成功后把坐标保存到 world/player/team persistent data，后续使用探测仪只回显已有坐标。
- Northstar 航点记录维度 ID、坐标和方向。目标区块无需长期加载，航点方块也无需持续验证存在。

## 禁用或任务化配方

| 路径范围 | 处理方式 |
|---|---|
| `arknights/attainment_point/*.json` | 保持禁用；资质点作为挑战或任务奖励 |
| `arknights/win/*.json` | 保持禁用；胜利证明不作为工作台产物 |
| `iron/cloth/sound_magic_cloth.json`、`iron/ingot/sound_arcane_ingot.json` | 当前已禁用，等待 sound rune 来源明确 |
| `witherstormmod/witherstormmod_command_block_tools.json` | 不纳入常规流程，禁用或任务化 |
| `fake_tconstruct/*.json` | 兼容占位可保留；参与泰坦卷轴或强材料时改为任务/遗迹来源 |

## 实施顺序

1. 重做泰坦卷轴，按主世界、蜜蜂领域、末地、月球、火星、水星、金星、土卫二、星系终局分层。
2. 重做 `curios_ring`、`curios_bracelet`、`curios_emblem` 三个饰品基底。
3. 重做 `mmt_quality_scroll`、`mmt_settled_scroll` 和 high 版本，建立 Tetra 锻造与早期 Boss 门槛。
4. 重做 `mmt_skill_improvements`、`mmt_more_improvements`、`mmt_over_improvements` 三层通用改装卷轴。
5. 补齐末地材料用途，使 `tetra:dragon_sinew`、`blackknightarmor:end_dragon_blood`、`blackknightarmor:end_dragon_ingot`、`blackknightarmor:ultimate_dragon_heart` 分层进入配方。
6. 补齐神化宝石投放，使阶段晶洞、精英怪和星球地牢按难度限制产出对应种类与品质的 `apotheosis:gem`。
7. 补齐蜜蜂领域材料用途，使蜂王浆、蜂之精华、蜂蜜结晶和六色圣所精华进入支援型饰品、浪漫泰坦卷轴和特殊打磨。
8. 重开 `monstrous_core` 时接火星 Boss 线，使用 `cataclysm:monstrous_horn`、`cataclysm:monstrous_eye`、火星钢。
9. 处理 Iron's Spellbooks 卷轴，把元素法杖和究极魔法流派接入星球/Boss 材料。
10. 最后处理跨模组 core 和低优先级材料，确认对应模组流程稳定后再放行。
