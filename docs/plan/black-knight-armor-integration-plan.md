# Black Knight Armor 整合与重构规划

日期：2026-07-18
状态：材料、配方、注册项与 Tetra 身份效果第一版已实施，等待完整重启和游戏内验证；原模组 Java 战斗逻辑重构尚未实施

## 目标

保留 Black Knight Armor 的武器主动能力、套装状态机、风暴生物和升级祭坛等特色，同时解决材料定位重复、配方同质化、数值失控和流程绕过问题，并将 Alex's Caves、Cataclysm、The Bumblezone、NetherExp、Endergetic 等冒险内容接入材料分支，再将合适的能力用于 Tetra、GeoTetraArmor、Better Combat、Farmer's Delight 与 Create。

## 第一阶段实施记录

- `kubejs/startup_scripts/registry_item.js` 补注册原模组遗漏的 `blackknightarmor:knight_upgrade_smithing_template`，复用 JAR 内已有模型和贴图。
- `kubejs/startup_scripts/registry_fluid.js` 注册 `createdelight:end_dragon_blood`，并在 Black Knight Armor 配方脚本中加入终结龙血物品与 250 mB 流体的双向转换。
- `kubejs/server_scripts/Black Knight Armor/recipes.js` 已禁用六种主题锭、六套护甲、六把基础武器和三张终结龙锭龙钢锻炉旧配方；六种主题锭与终结龙锭统一改用工作盆压块塑形。
- 六套护甲和六把基础武器已改用骑士升级模板锻造；燃烧剑魂、无尽愤怒、阳光精华已重做，冰冷欲望已补齐来源。
- `createdelight:dread_heart` 已接入现有难度掉落系统：险象环生及以上难度时，悚怖巫妖、悚怖骑士、悚怖尸妖和悚怖奴仆开始按不同概率掉落；它不再作为怒魂锭的直接消耗材料。
- 末影龙血流体复用现有雷龙血动画贴图并经过色相偏移、增饱和与压暗处理，保持龙血材质语言同时形成深紫末影配色。
- `kubejs/data/tetra/materials/metal/end_dragon_ingot.json` 已将终结龙锭 `primary` 从 14 调整为 13，使其成为悚怖钢 12 附近的末地侧升。
- 当前只完成静态语法、JSON、物品 ID 和差异检查；注册项需要重启游戏，配方与锻造保留 NBT 仍需真实运行验证。

## 调查范围与证据

- 当前整合包只维护 `packwiz-files/mods/blackknightarmor-1.0.3-20260322-1620-reobf.jar`，仓库内没有原始 Java 源码工程；源码结论来自对该 JAR 的反编译检查。
- JAR 内包含 445 个 class、113 张配方、215 个物品模型、4 个进度和 8 个全局战利品修改器。
- 第一阶段实施前，整合包只在 `kubejs/server_scripts/Black Knight Armor/recipes.js` 中重做了混合花香冰淇淋，其余装备、材料和食物基本沿用模组原配方。
- 当前 CDR Tetra 基准：三系龙钢 `primary` 为 10，`dreadsteel:dreadsteel_ingot` 为 12；Black Knight Armor 原基准中的终结龙锭为 14，现已通过 CDR 数据覆盖调整为 13。
- `docs/plan/adventure-progression-overhaul-plan.md` 已将终结龙血、终结龙锭和终极龙心分别规划为末影龙后、中后期高锤级金属和终局材料，本规划沿用该分层。
- 冒险材料来源额外核对了 `alexscaves-2.0.2.jar`、`L_Enders_Cataclysm-3.16.jar`、`the_bumblezone-7.13.0+1.20.1-forge.jar`、`Jadens-Nether-Expansion-2.3.5.jar` 和 `endergetic-1.20.1-5.0.1.jar` 的战利品表、配方与当前 FTB Quests 投放。

## 当前主要问题

### 六种材料配方同质化

`dark_flame_ingot`、`rage_soul_ingot`、`sun_light_ingot`、`ghoststeel_ingot`、`frost_tooth_ingot`、`dragon_fire_ingot` 使用同一模板：

- 火、冰、雷龙钢锭各 2 个。
- 风暴精华 1 个。
- 下界合金锭 1 个。
- 仅使用灵魂沙、下界疣、萤石粉、灵质、蓝冰或熔岩桶区分主题。
- 每批产出 4 个锭。

一套护甲需要 24 个对应特殊锭，即六批材料，单是特殊锭就消耗三系龙钢各 12 个，之后还需要原始龙钢护甲作为基底。六条路线成本、阶段和材料叙事几乎完全重叠。

CDR 已经通过悚怖钢承担“三系龙钢融合”定位，因此 Black Knight Armor 不应再同时维护六种三系融合合金。

### 数值与源码风险

- 多个终局套装的护甲值总和约为 44～52，明显高于原版下界合金套的 20，耐久倍率最高为 296。
- 龙息减伤逻辑同时监听 `LivingHurtEvent` 和 `LivingDamageEvent`，同一减伤可能执行两次；终极套装的 95% 龙息减伤可能变为约 99.75%，普通伤害的两次 50% 减伤可能变为 75%。
- 终结龙套的龙息减伤上限为 99%，若重复结算将接近完全免疫。
- 日耀之盾受到伤害时只消耗层数并产生反击爆炸，没有降低本次伤害，名称与实际效果不一致。
- 狂战士最高阶提供约 +17 固定攻击和较高攻速，叠加 Tetra/MMT 后风险较高。
- 终极龙心只要位于玩家背包中即可启动 60 秒飞行，启动后总冷却为 90 秒，实际空窗仅 30 秒。
- `cold_desire` 暂未找到正常配方、掉落或现有 KubeJS 来源，霜兽斧升级路线可能不可完成。
- JAR 内虽然包含 `knight_upgrade_smithing_template` 的模型、贴图和物品标签引用，但 `ModItems` 未实际注册该物品，当前 Probe 中也不存在 `blackknightarmor:knight_upgrade_smithing_template`。
- 燃烧剑魂和阳光精华同时存在直接合成与怪物掉落来源，容易绕过预期流程。
- 风暴龙和风暴凋零龙在灵魂沙峡谷的自然生成权重分别为 15 和 6，不适合高强度或 Boss 定位。
- 主要伤害、冷却、生成和掉落参数硬编码在 Java 中，现有配置缺少有效的服务端平衡入口。

### 整合包流程绕过

- `config/bountiful/bounty_pools/blacksmith_objs.json` 可投放 `blackknightarmor:end_dragon_ingot`，可能绕过末影龙阶段。
- `config/ftbquests/quests/reward_tables/7c7f5ec61ac97c50.snbt` 可直接奖励霜兽斧、黑骑士剑和熔岩大剑，可能绕过材料与升级祭坛流程。

## 材料体系重构原则

材料分为两层：

1. 龙钢、悚怖钢和终结龙锭负责硬度、韧性、耐久、工具等级等物理属性。
2. 暗炎、怒魂、日耀、霜牙、灵钢、风暴精华和终极龙心负责能力核心、图纸解锁或特殊改良。

悚怖钢保留为唯一的三系龙钢融合母材。六种同质化特殊锭统一改为“悚怖钢二次处理分支”，不再直接重复消耗火、冰、雷龙钢。

每条分支继续区分两类冒险材料：

- **路线解锁物**：每次 Boss、任务链或遗迹只稳定获得 1～4 个的材料，用于解锁图纸、祭坛路线或制造一次性能力核心，不参与每枚锭的批量消耗。
- **批量处理物**：一次遭遇可获得多份、可探索补充或可自动化生产的材料，用于将悚怖钢批量转化为主题锭。

护甲每件消耗 1 枚主题锭；主题锭统一采用 1 枚悚怖钢加工为 1 枚主题锭，玩家可按实际装备需求逐枚生产，不强制整批制造。

## 冒险材料筛选结果

| 模组与材料 | 实际来源与数量 | 适合用途 | 不建议用途 |
|---|---|---|---|
| `alexscaves:pure_darkness` | Forsaken 固定掉落 7～12 个，同时已用于传送门和 Tetra socket | 暗炎批量处理物，每批少量消耗 | 大量消耗或每件装备重复消耗 |
| `alexscaves:occult_gem` | Watcher 为 0～1 个，异寂空谷遗迹箱低权重出现 | 黑暗/幽灵路线解锁物、终极武器核心 | 普通锭的逐枚材料 |
| `alexscaves:tectonic_shard` | Luxtructosaurus 固定掉落 7～11 个，可受抢夺影响 | 地热、重击、构造体和高温大斧路线 | 冰冷、冻土或霜牙材料；该碎片具有明显的高热语义 |
| `alexscaves:immortal_embryo` | Hullbreaker 固定 1 个，当前还被网关和任务使用 | 终极龙心、复生或生命类唯一核心 | 普通护甲和普通锭量产 |
| `cataclysm:essence_of_the_storm` | Scylla 固定掉落 3～4 个 | 怒魂、雷系或风暴能力核心 | 六条路线共同消耗 |
| `cataclysm:monstrous_horn` | Netherite Monstrosity 固定 1 个 | 怒魂路线解锁、整套狂战护甲的祭坛核心 | 每件护甲或每枚锭消耗 1 个 |
| `cataclysm:ignitium_ingot` | Ignis 固定掉落 3 个 | 红莲龙炎最终核心、高阶火系能力或 Tetra 专属强化 | 与同强度的普通主题锭逐枚绑定，避免红莲路线成本显著高于其他分支 |
| `cataclysm:cursium_ingot` | Maledictus 固定掉落 3～4 个 | 幽灵套终极升级、死灵或快速攻击效果 | 早期灵钢量产 |
| `the_bumblezone:honey_crystal_shards` / `glistering_honey_crystal` | 蜜蜂领域洞穴、结构和结晶方块可稳定获取 | 日光锭的晶体骨架和可量产耗材 | 作为终局唯一门槛 |
| `the_bumblezone:essence_radiance` | 黄色竞技场胜利固定奖励 1 个 | 日耀路线图纸、任务或配方解锁；作为不消耗的能力证明 | 普通锭逐批消耗 |
| `the_bumblezone:royal_jelly_bottle` / Royal Jelly 流体 | Bee Queen 愿望进度逐项奖励，可完成后重置 | 阳光精华或日耀最终强化少量消耗 | 日光锭量产或每批消耗一整桶 |
| `the_bumblezone:essence_of_the_bees` | Bee Queen 完整愿望链终点奖励 | 日耀路线图纸或最终强化解锁 | 普通合成消耗；该物品本身适合玩家使用 |
| `netherexp:wraithing_flesh` / `netherexp:ectoplasm` | Vessel 掉落 2～4 个腐灵肉，整合包已支持压实为灵质流体 | 暗炎、灵钢的批量流体与幽魂载体 | 作为稀有 Boss 门槛 |
| `netherexp:banshee_rod` / `banshee_powder` | Banshee 为 0～1 根，整合包可粉碎增产 | 灵钢或烛光之剑的强化核心 | 每枚锭固定消耗一根 |
| `netherexp:treacherous_flame` | 兼具遗迹钥匙和升级材料身份 | 暗炎路线的图纸钥匙、可保留的加工催化物 | 大批量消耗，避免玩家失去探索钥匙 |
| `netherexp:soul_permafrost` | NetherExp 黑冰/灵魂冻土内容 | 霜牙的冰冷批量基质 | 其他火系和幽灵分支 |
| `endergetic:portaplasm` | Purpoid 掉落 1～3，Purpazoid 掉落 4～8 | 灵钢的相位处理物、末地能力核心 | 作为不可重复的终局奖杯 |
| `endergetic:poise_cluster` | 末地群系方块稳定采集 | Endergetic 专属 Tetra 模块或末地装备结构材料 | 塞入基础终结龙锭；普通紫颂果已经足以承担可量产的末地填充物 |

筛选结论：稀有 Boss 材料控制“能否开启路线”，普通洞穴材料和流体控制“能制作多少”，两者不要混为同一种批量成本。

## 建议材料定位与配方方向

| 材料 | 新定位 | 单枚处理方向 | 路线解锁物 | Tetra 载体 |
|---|---|---|---|---|
| `dark_flame_ingot` | 灵魂火与黑炎攻击核心 | 悚怖钢 ×1 + 纯粹黑暗 ×1 + NetherExp 灵质 250 mB | `netherexp:treacherous_flame` 或 `alexscaves:occult_gem` | 刀刃/重刃改良，不作为泛用金属 |
| `rage_soul_ingot` | 高风险狂战核心 | 悚怖钢 ×1 + Black Knight 风暴精华 ×1 + 雷龙血 250 mB | 难度系统投放的悚怖之心与 `cataclysm:monstrous_horn` | 刀刃、握柄或护甲组合改良 |
| `sun_light_ingot` | 防御、充能与反击核心 | 悚怖钢 ×1 + 闪耀蜂蜜结晶 ×1 + Ambersol ×1 | 黄色竞技场与 `the_bumblezone:essence_radiance` 对应的图纸/任务解锁 | 盾板和护甲专属改良 |
| `frost_tooth_ingot` | 冻结、重击和斧类专精 | 悚怖钢 ×1 + Soul Permafrost ×1 + 冰龙血 250 mB | `cold_desire` 核心或冰系任务 | 斧头、重刃和护甲材料 |
| `ghoststeel_ingot` | 轻质、隐匿和高魔力容量材料 | 悚怖钢 ×1 + Portaplasm ×1 + Ice and Fire 灵质 ×1 | `alexscaves:occult_gem`；咒魂锭留给最终强化 | 握柄、绑定件和护甲衬层 |
| `dragon_fire_ingot` | 红莲龙炎与高温冲锋核心 | 悚怖钢 ×1 + 构造碎片 ×1 + 火龙血 250 mB | `cataclysm:flame_eye` 或 Ignis 击杀进度 | 火系武器和护甲专用 |
| `end_dragon_ingot` | 悚怖钢同层的末地侧升金属 | 悚怖钢 ×1 + 紫颂果 ×1 + 终结龙血 250 mB | 末影龙击杀与终结龙珍宝 | `primary` 已从 14 调整为 13，以末地能力和加工性区别于悚怖钢，而不是靠跨级硬度压制 |

六种主题锭是悚怖钢的能力侧向处理，不应在硬度上全面超过悚怖钢；其 Tetra 基础数值可围绕悚怖钢下浮或保持接近，主要通过限定模块效果形成差异。终结龙锭同样处在悚怖钢层级，只作为末影龙后的侧升或上半级：硬度略高，魔力、效果与适用模块不同，但不形成新的完整金属大阶段。

### 与灾变材料的等级关系

整合包中的 Ice and Fire 高阶龙实际战斗难度高于大部分 Cataclysm Boss，因此材料等级按整合包实战而不是模组各自的终局命名排序：灾变金属位于三系龙钢之前，龙钢之后才进入悚怖钢、六种主题锭和终结龙锭层级。灾变核心仍可作为后期限定能力催化剂，但不抬高对应基础金属的通用材质等级。

| 灾变金属 | `primary / secondary / tertiary` | 定位 |
|---|---|---|
| 远古金属 / 黑钢 | 保留 MMT 原值 `6.2 / 4.3 / 3.5`、`6.5 / 3.3 / 1.5` | 灾变前段材料，原本已低于锻造钢与龙钢 |
| 深渊锭 | `9.6 / 3.6 / 4.4` | 稳健型 Boss 金属，依靠深渊诅咒保持特色 |
| 风暴锭 | `9.8 / 3.0 / 2.5` | 高爆发、低韧性的雷暴材料 |
| 咒魂锭 | `9.5 / 3.0 / 4.5` | 轻质灵体系材料，保留幽灵形态与快速攻击 |
| 腾炎锭 | `9.8 / 4.0 / 3.5` | 火系攻击材料，保留炽炎烙印与护甲效果 |
| 凋灵合金 | `9.6 / 4.5 / 3.0` | 高密度、低韧性的凋灵材料 |

上述五种原本偏高的 MMT 材料同时将耐久下调至 `1250～1400`、完整度增益下调至 7、工具效率下调至 9.5，并统一要求 `hammer_dig: 7`；它们仍可凭借原有效果成为龙钢前的特色侧升，但综合材质不再压过 `10 / 4 / 5`、耐久 1500、同为 7 级锤门槛的三系龙钢。远古金属与黑钢继续保留原有铁锤门槛，作为更早期材料。覆盖文件位于 `kubejs/data/tetra/materials/metal/more_mod_tetra/cataclysm/`，并使用 `"replace": true` 防止 Tetra 的合并式材料数据存储把上游字段重新并入。

`burning_sword_soul`、`endless_anger`、`sunlight_essence` 和缺失来源的 `cold_desire` 可作为真正的稀有升级核心：

- 燃烧剑魂：暗炎锭 + 诡谲之火 + 下界之星。
- 无尽愤怒：怒魂锭 + 怪物角 + 下界之星。
- 阳光精华：日光锭 + 一瓶 Royal Jelly + Ambersol；辉光精华负责日耀路线解锁，不直接消耗。
- 冰冷欲望：霜牙锭 + 冰龙心 + 霜百合簇 + Soul Permafrost。

## 具体配方修改草案

### 需要禁用的原配方

首先通过 `remove_recipes_id(e, [...])` 禁用以下原始配方：

- 六种主题锭：`blackknightarmor:dark_flame_ingot`、`blackknightarmor:rage_soul_ingot`、`blackknightarmor:sun_light_ingot`、`blackknightarmor:ghoststeel_ingot`、`blackknightarmor:frost_tooth_ingot`、`blackknightarmor:dragon_fire_ingot`。
- 六套护甲的 24 张工作台配方：`black_knight_armor_*_crafting`、`berserk_armor_*_crafting`、`solar_flare_armor_*_crafting`、`white_behemoth_*_crafting`、`ghost_*_crafting`、`dragon_fire_armor_*_crafting`，其中 `*` 分别为 `helmet`、`chestplate`、`leggings`、`boots`，命名空间均为 `blackknightarmor`。
- 基础武器：`blackknightarmor:black_knight_sword_crafting`、`blackknightarmor:dragon_slayer_sword_crafting`、`blackknightarmor:daybreak_spear_crafting`、`blackknightarmor:ice_tooth_axe_crafting`、`blackknightarmor:candlelight_sword`、`blackknightarmor:dragon_fire_sword_crafting`。
- 当前实际位于 `data/` 并会加载的三张无序升级配方：`blackknightarmor:ultimate_black_knight_sword_crafting`、`blackknightarmor:mad_soul_dragon_slayer_sword_crafting`、`blackknightarmor:frost_beast_axe_crafting`；耀阳的同类 JSON 位于错误的 `assets/blackknightarmor/recipes/` 路径，不作为有效数据包配方处理。
- 三张终结龙锭龙钢锻炉配方：`blackknightarmor:end_dragon_ingot_fire_forge`、`blackknightarmor:end_dragon_ingot_ice_forge`、`blackknightarmor:end_dragon_ingot_lightning_forge`。

### 六种主题锭

所有路线统一使用 Create 工作盆压块塑形（`create:compacting`），不再混用顺序组装、搅拌、真空处理和冶金合金。六种主题锭均为三种输入、1 枚悚怖钢加工成 1 枚主题锭；路线差异只来自材料与热力条件。诡谲之火、秘法宝石、辉光精华等稀有路线证明改为任务或图纸解锁，不塞进量产配方。

| 产物 | 加工方式 | 具体投入 | 产量与平衡理由 |
|---|---|---|---|
| 暗炎锭 | 加热压块塑形 | `dreadsteel:dreadsteel_ingot` ×1；`alexscaves:pure_darkness` ×1；`netherexp:ectoplasm` 250 mB | 产出 1；诡谲之火只负责暗炎图纸或任务解锁 |
| 怒魂锭 | 超级加热压块塑形 | `dreadsteel:dreadsteel_ingot` ×1；`blackknightarmor:storm_essence` ×1；`createdelight:lightning_dragon_blood` 250 mB | 产出 1；悚怖之心改由险象环生难度投放，不作为配方耗材 |
| 日光锭 | 加热压块塑形 | `dreadsteel:dreadsteel_ingot` ×1；`the_bumblezone:glistering_honey_crystal` ×1；`alexscaves:ambersol` ×1 | 产出 1；不使用蜂蜜、花粉或 Royal Jelly，辉光精华只负责路线解锁 |
| 霜牙锭 | 无热源压块塑形 | `dreadsteel:dreadsteel_ingot` ×1；`netherexp:soul_permafrost` ×1；`createdelight:ice_dragon_blood` 250 mB | 产出 1；构造碎片属于高热材料，不进入冰系路线 |
| 灵钢锭 | 无热源压块塑形 | `dreadsteel:dreadsteel_ingot` ×1；`endergetic:portaplasm` ×1；`iceandfire:ectoplasm` ×1 | 产出 1；沿用原模组和 Ice and Fire 幽灵剑的幽灵材料线，秘法宝石只负责图纸或任务解锁 |
| 红莲龙炎锭 | 超级加热压块塑形 | `dreadsteel:dreadsteel_ingot` ×1；`alexscaves:tectonic_shard` ×1；`createdelight:fire_dragon_blood` 250 mB | 产出 1；构造碎片的地热语义用于高温路线，Ignitium 留给更高阶红莲核心 |

Royal Jelly 不进入日光锭量产配方，只在阳光精华或日耀最终强化中少量消耗；如果龙血 250 mB 的成本实测仍然过高，优先降低流体消耗，不增加普通廉价填充物。主题材料应保持清晰，避免再次形成“主体相同、最后塞一个辅料”的配方。

### 终结龙锭

先在 KubeJS startup registry 注册 `createdelight:end_dragon_blood` 流体，使其与整合包已有的火、冰、雷龙血保持同一加工语义：

- `blackknightarmor:end_dragon_blood` ×1 通过分液池倒出 `createdelight:end_dragon_blood` 250 mB，并返还玻璃瓶。
- 玻璃瓶灌装 250 mB 流体可还原为 `blackknightarmor:end_dragon_blood`，避免物品与流体成为两套不可逆资源。
- 流体加入 `forge:bloods`，后续可用于终结龙锭、末影涂层、Tetra 改良和终极龙心，不作为普通通用血液替代品。
- 每个末影龙珍宝当前固定产生 24～30 个终结龙之血，即 6000～7500 mB；终结龙锭每枚消耗 250 mB，流体化后仍保持一份血对应一枚锭，不额外增产。

终结龙锭不再使用“铁锭 + 终结龙血”的直接龙钢锻炉配方，统一改为加热压块塑形：`dreadsteel:dreadsteel_ingot` ×1 + `createdelight:end_dragon_blood` 250 mB + `minecraft:chorus_fruit` ×1 → `blackknightarmor:end_dragon_ingot` ×1。

该配方与六种主题锭一样只有三种输入，明确表示终结龙锭由悚怖钢末地化处理而来；终结龙血决定末影龙门槛，紫颂果提供可量产的末地介质。它不再由铁锭或龙钢直接转化，也不再承担比悚怖钢高出完整大阶段的硬度定位。

### 锻造模板

模组原本显然计划提供 `blackknightarmor:knight_upgrade_smithing_template`：JAR 中已有模型、贴图，`data/minecraft/tags/items/smithing_template.json` 也引用了该 ID，但物品本身没有注册。实施时建议通过 KubeJS startup registry 补注册这个遗留物品，复用 JAR 内现成资源，再将其作为六条装备分支的共同模板；在补注册完成前不能直接添加引用它的锻造配方。

- 首张模板：`createdelight:dread_upgrade_smithing_template` + 悚怖钢锭 ×2 + Black Knight 风暴精华 + 回响碎片，产出 1 张。
- 复制模板：骑士升级模板 + 悚怖碎片 ×2 + 回响碎片，产出 2 张；悚怖碎片提供模板坯体，回响碎片复制图样，不再消耗用于装备锻造的悚怖钢。

模板只负责证明玩家已经进入“悚怖钢二次锻造”阶段；主题差异由追加材料决定，不为六条路线各注册一张新模板。

### 护甲升级

六套护甲改用 `minecraft:smithing_transform`，每件只消耗 1 枚对应主题锭并保留 NBT：

| 目标套装 | 基底护甲 | 追加材料 |
|---|---|---|
| 黑骑士 | 火龙钢护甲 | 暗炎锭 |
| 狂战士 | 雷龙钢护甲 | 怒魂锭 |
| 日耀 | 火龙钢护甲 | 日光锭 |
| 白色巨兽 | 冰龙钢护甲 | 霜牙锭 |
| 幽灵 | 冰龙钢护甲 | 灵钢锭 |
| 红莲龙炎 | 火龙钢护甲 | 红莲龙炎锭 |

主题锭采用 1→1 加工，升级整套护甲需要分别制造 4 枚；原生套装的高强度完整能力继续要求四件同套装备，不能通过单件混搭获得。

### 基础武器升级

基础武器同样使用骑士升级模板和对应主题锭：

| 目标武器 | 基底武器 | 追加材料 |
|---|---|---|
| 黑骑士剑 | 火龙钢剑 | 暗炎锭 |
| 斩龙 | 雷龙钢剑 | 怒魂锭 |
| 黎明之枪 | 火龙钢剑或龙骨长枪基底 | 日光锭 |
| 冰齿斧 | 冰龙钢斧 | 霜牙锭 |
| 烛光之剑 | Ice and Fire 幽灵剑 | 灵钢锭 |
| 红莲龙炎剑 | 火龙钢剑 | 红莲龙炎锭 |

`dragonsteel_overlord` 不继续消耗三把完整龙钢剑；后续更适合改为 Tetra 三系龙钢改良，或使用悚怖钢武器 + 风暴/龙心核心升级。

### 四种高级升级核心

| 核心 | 建议配方 | 用途 |
|---|---|---|
| 燃烧剑魂 | 暗炎锭 ×4 + 下界之星 + 诡谲之火 + 秘法宝石 | 黑骑士剑在升级祭坛转化为终极黑骑士剑 |
| 无尽愤怒 | 怒魂锭 ×4 + 下界之星 + 怪物角 + 风暴精华 | 斩龙在升级祭坛转化为怒魂斩龙 |
| 阳光精华 | 日光锭 ×4 + Ambersol + 结晶花 + Royal Jelly 瓶 | 黎明之枪在升级祭坛转化为耀阳；Royal Jelly 只在最终核心阶段消耗一瓶 |
| 冰冷欲望 | 霜牙锭 ×4 + 冰龙心 + 霜百合簇 + Soul Permafrost | 冰齿斧在升级祭坛转化为霜兽斧，并补齐当前缺失来源 |

燃烧剑魂和阳光精华的旧随机掉落应移除或改成低概率配方素材返还，避免同时存在“直接掉核心”和“完整冒险制造核心”两套互相绕过的来源。

### 升级祭坛

升级祭坛保留并扩展为最终装备升级设备：

- 保留黑骑士剑 + 燃烧剑魂、斩龙 + 无尽愤怒、黎明之枪 + 阳光精华三条现有源码逻辑。
- 新增冰齿斧 + 冰冷欲望 → 霜兽斧。
- 移除三条当前有效的无序合成替代配方；耀阳原本误放在 `assets/` 下的配方不迁移到有效数据路径，确保升级祭坛有实际用途。
- 继续保留附魔、名称和其他 NBT；实现时补充耐久比例继承测试。

## 装备升级路线

护甲与高级武器改用锻造台或升级祭坛升级，不再使用“原装备外包围大量特殊锭”的工作台配方：

- 使用三系龙钢护甲作为基础装备。
- 每件装备消耗 1 个能力核心或少量特殊锭。
- 保留附魔、名称、耐久和其他 NBT。
- 扩展升级祭坛，使其支持黑骑士、狂战士、日耀、白色巨兽、幽灵和红莲龙炎护甲。
- 原生完整套装保留完整能力，Tetra 改良只提供削弱版本或需要多部位组合。

建议流程：

```text
三系龙钢
  ├─ 悚怖钢：三系融合与泛用高阶金属
  ├─ 暗炎 / 怒魂 / 日耀：能力分支
  ├─ 霜牙 / 红莲：冰火专精分支
  └─ 灵钢：独立探索与幽灵支线

末影龙
  └─ 终结龙血 + 悚怖钢
       └─ 终结龙锭：悚怖钢同层的末地侧升
            └─ 终结龙套 / 终极龙心
```

终极龙心应继续接入末影守卫、虚空结晶、不朽胚胎或星系终局阶段，并改为 Curios、指定槽位或完整套装能力；不建议仅凭背包持有就提供飞行。Endergetic 的 Portaplasm 与 Poise Cluster 更适合进入末地 Tetra 模块、能力核心或装备结构强化，不进入基础终结龙锭。

## Tetra 与 GeoTetraArmor 接入

Tetra 会把材料效果直接合并到使用该材料的模块中，因此材料只承载一级身份效果和少量基础效果；主动技能、完整套装状态机和更高等级能力仍使用限定 schematic/improvement，避免普通材料直接复制原生套装的完整能力。

六种主题锭作为 Tetra 金属注册，三值围绕悚怖钢 `12 / 4 / 5` 做侧向分化。材料 JSON 直接提供一级身份效果，不需要单独注册 `ItemEffect`；效果会随同一器具上使用该材料的部件数量叠加。已有基础效果和六个身份效果的第一版行为均已接入：

| 材料 | `primary / secondary / tertiary` | 物理定位 | 材料效果 |
|---|---|---|---|
| 暗炎锭 | `12 / 4.5 / 4` | 保持硬度、略增重量、降低韧性，偏锋刃进攻 | 暗炎锋刃 I；炽热 II；重伤 I |
| 怒魂锭 | `12 / 5 / 3.5` | 更重更脆的狂战材料，以密度换取重击收益和攻速代价 | 怒魂核心 I |
| 日光锭 | `11 / 6 / 5.5` | 降低攻击向硬度，以高密度和高韧性转向重型防御 | 日耀守护 I；耐久 I |
| 霜牙锭 | `11.5 / 5 / 5` | 稳重的冰系斧刃与重击材料 | 霜牙重击 I；冰冻 IV |
| 灵钢锭 | `10 / 2.5 / 7.5` | 轻质、高韧和高魔力容量，适合握柄、绑定与护甲衬层 | 灵钢衬层 I；生命汲取 I |
| 红莲龙炎锭 | `12 / 4 / 4.5` | 保持悚怖钢级硬度，稍降韧性，偏高温冲锋攻击 | 红莲冲锋 I；炽热 IV |

六个身份效果的第一版行为已经接入：

| 效果 | 第一版行为 |
|---|---|
| 暗炎锋刃 | 近战命中使目标燃烧 `2 + 等级` 秒；材料同时提供 MMT 重伤 I，使目标在 10 秒内降低 20% 所有生命恢复 |
| 怒魂核心 | 玩家每损失 10% 生命值，每级提高 1% 近战伤害；每级最多贡献 5%，总加成最高 30% |
| 日耀守护 | GeoTetraArmor 总等级加主副手最高等级共同决定减伤，使日光盾牌同样可用；每 7 秒恢复一层、最多三层，受击消耗一层并每级减伤 4%、上限 24%，同时反射部分已减免伤害；复用 `blackknightarmor:solar_shield` Buff 显示 |
| 霜牙重击 | 对已经处于 Ice and Fire 冰冻状态的目标每级增伤 3%、上限 18%，并提高击退；随后原有 `createdelight:frozen` 继续刷新冰冻 |
| 灵钢衬层 | GeoTetraArmor 穿戴者停止攻击和受击后进入灵体状态，获得速度并清除附近怪物仇恨；复用 `blackknightarmor:ghost` Buff 显示，等级缩短等待并扩大范围 |
| 红莲冲锋 | 冲刺或完全蓄力近战每级增伤 4%、上限 24%，延长燃烧并短暂给予防火 Buff |

原模组的 `blackknightarmor:berserk` Buff 即使最低等级也会直接增加约 3 点攻击和 0.2 攻速，不适合作为主题材料的基础 Buff；怒魂因此使用独立的按失血比例增伤，不直接套用原狂战 Buff。`red_dragon` 的完整范围灼烧和 `ice_crystal` 的自动冰箭也保留给原生完整套装，不由普通材料常驻获得。

日光锭的主防御不是简单堆高 `primary`：GeoTetraArmor 普通胸甲公式下，它约提供 `3.15` 护甲与 `0.413` 护甲韧性；悚怖钢约为 `3.28` 护甲与 `0.307` 护甲韧性。因此日光锭会少一点基础护甲和武器白值，但明显提高护甲韧性，并由高密度带来更重、更慢的代价。

| 原生能力 | Tetra/护甲改良 | 适用模块 |
|---|---|---|
| 黑骑士燃烧模式 | 暗炎锋刃 | 刀刃、重刃 |
| 狂战士累计伤害 | 怒魂核心 | 刀刃、握柄、护甲组合 |
| 日耀盾充能反击 | 日耀守护 | 盾板、GeoTetraArmor |
| 白色巨兽自动冰箭 | 巨兽之眼 | 头盔或完整护甲组合 |
| 幽灵脱战 | 灵钢衬层 | 护甲、绑定件 |
| 风弹与追踪箭 | 风暴核心 | 弓臂、弓弦、长柄 |
| 龙息减伤 | 龙鳞或终结龙涂层 | 护甲 |
| 末地飞行 | 终极龙心 | Curios 或终局完整套装 |

建议强度分层：

- Black Knight Armor 原生完整套装提供完整能力。
- 单个 Tetra 改良提供约 25%～40% 的削弱版本，并消耗完整度。
- 多个匹配护甲模块才解锁完整联动。
- 主动能力需要图纸或能力核心，不能仅由普通材料自动附带。

源码应增加统一能力判断入口，使原生物品、物品标签和 Tetra effect ID 都能声明同一能力，避免事件处理器继续硬编码具体物品相等判断。

## 其他兼容方向

### Better Combat

为巨斧、巨剑、巨戟、黎明之枪、耀阳、斩龙等物品提供明确的武器属性映射，避免只依赖物品 ID 正则和底层 `SwordItem` 类型：

- 龙炎巨斧：双手斧。
- 龙霜巨刃、斩龙、怒魂斩龙：大剑。
- 龙霆巨戟、黎明之枪、耀阳：长枪。
- 烛光之剑、黑魔法剑：法剑或轻剑。

### 料理线

将龙肉、蛇尾、泽鹗、骏鹰和龙系宴席接入 Farmer's Delight 与 Create：

- 使用烹饪锅、砧板、搅拌、灌装和切割替代普通工作台量产。
- 接入 Quality Food 品质体系。
- 龙系宴席提供短时龙息抗性或冰、火、雷环境抗性。
- 料理作为战斗支援，不承担终局锻造门槛。

### 风暴生物

- 风暴凋零龙改为号角、祭坛或任务召唤，不再高权重自然生成。
- 风暴龙可保留极低概率自然生成，或改为结构/事件遭遇。
- 风暴精华改为稳定 Boss 战利品或尸体采集奖励，不再同时依赖高刷怪率和低概率掉落。

## 源码修改清单

1. 合并龙息减伤事件，只在一个确定的伤害阶段结算。
2. 将套装检测从具体物品相等判断改为标签、套装 ID 或统一能力接口。
3. 为伤害、冷却、生成权重、掉落率和套装强度增加 common/server 配置。
4. 让日耀之盾实际减伤或吸收伤害，再触发反击。
5. 下调狂战士固定攻击加成并设置与 Tetra/MMT 叠加后的上限。
6. 将 Solar 与 Berserk 的玩家状态从静态 UUID Map 迁移到持久化 capability/NBT，并在退出、死亡和重载时清理。
7. 修复 `cold_desire` 来源，统一燃烧剑魂、阳光精华和无尽愤怒的获取逻辑。
8. 将终极龙心飞行限制到 Curios、指定槽位或完整套装。
9. 为 Tetra/GeoTetraArmor 暴露能力检测入口，而不是在模组中硬编码 Tetra 具体类。

## 实施顺序

### P0：源码安全与平衡

- 修复重复减伤。
- 修复日耀盾和狂战士强度。
- 修复飞行条件和 `cold_desire` 来源。
- 调整风暴生物生成方式。

### P1：材料与配方

- 禁用六张重复三龙钢配方。
- 保留悚怖钢为唯一三系融合母材。
- 六种主题锭和终结龙锭统一使用 Create 工作盆压块塑形，全部采用三种输入和1→1产出，只以主题材料与热力条件区分路线；升级祭坛仅负责高级武器转化。
- 调整 Bountiful 与 FTB Quests 的流程绕过。

### P2：Tetra 试点

- 先实现暗炎锋刃、怒魂核心、灵钢衬层和风暴核心。
- 通过实战测试确定效果等级、完整度消耗和模块白名单。
- 验证 GeoTetraArmor、多件组合、MMT 效果合并和 Better Combat 交互。

### P3：内容完善

- 补齐 Better Combat 映射。
- 重做料理线。
- 增加任务章节、祭坛说明、材料用途和进度门槛。

## 验证重点

- 同一次伤害事件中龙息和普通减伤只结算一次。
- 原生套装与 Tetra/GeoTetraArmor 的能力强度分层明确。
- 主题材料不会在不合理的 Tetra 模块上出现能力。
- 任何终结龙锭、终极龙心和高阶武器来源都不能绕过对应阶段。
- 升级祭坛正确保留附魔、名称、耐久和其他 NBT。
- 风暴生物不会在灵魂沙峡谷形成普通刷怪灾害。
