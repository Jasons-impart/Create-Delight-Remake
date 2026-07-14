# Tetra / MMT 当前包设计参考

日期：2026-06-22

范围：以当前整合包实际安装的 Tetra、More Mod Tetra、GeoTetraArmor 以及当前 KubeJS 覆盖为准，整理 Tetra 基础属性、原版模块/效果、MMT 扩展收益和当前包里值得关注的数值入口。MMT jar 内含大量跨模组集成；当前包没有安装的集成不列入收益表。

数据来源：

- `mods/more_mod_tetra-2.3.01-all.jar`
- `mods/tetra-1.20.1-6.9.0.jar`
- `kubejs/data/tetra/`
- `logs/latest.log` 中 `[CDCore][MMT Damage]`
- `javap` 对关键 MMT class 的反编译结果

### 源码参考仓库

以下三个仓库是项目根目录下的本地只读参考仓库，供开发时查阅源码使用。它们被 `.gitignore` 的 `/*` 规则屏蔽，不作为 git 子模块提交到远程。运行时实际加载的是 `mods/` 目录下的编译 JAR。

| 目录 | 仓库 | 分支 | 在整合包中的角色 |
|------|------|------|------|
| `tetra/` | [mickelus/tetra](https://github.com/mickelus/tetra) | `1.20` | **核心模组**。提供模块化工具/武器/弓弩系统，包括材料三属性（硬度/密度/韧性）、模块组装、效果等级、改良打磨、工具腰带等完整框架。是 MMT 和 GeoTetraArmor 的依赖基础。JAR: `mods/tetra-1.20.1-6.9.0.jar` |
| `tetracelium/` | [mickelus/tetracelium](https://github.com/mickelus/tetracelium) | `1.20` | **轻量级自定义 addon**。仅为一个 Tetra 小刀模块（`knife`）提供自定义模型和 GUI 贴图（glyph），不涉及数值设计，不新增效果或材料。JAR: `mods/tetracelium-1.20.1-1.3.1.jar` |
| `GeoTetraArmor/` | [yiran1457/GeoTetraArmor](https://github.com/yiran1457/GeoTetraArmor) | `6.9.0` | **盔甲扩展模组**。为 Tetra 添加 GeckoLib 动画驱动的模块化盔甲系统（头盔/胸甲/护腿/靴子），按 Tetra 材料三属性计算护甲值和韧性，支持香草和重型两种风格。JAR: `mods/GeoTetraArmor-6.9.0-1.0.4-fix.jar` |

编译后的 JAR 通过 Packwiz 管理；KubeJS 覆盖（`kubejs/data/tetra/`）在此基础上调整模块定义、改良数值和材料属性。

## 0. 阅读对照

文档里保留英文 ID 是为了方便回查 JSON、日志和代码；能加中文的地方都在后面用括号或中文名补上。

常见变量：

| 变量/写法 | 中文含义 |
|---|---|
| `base` | MMT 处理前的原始事件伤害 |
| `fixed` | 固定伤害，先加到原始伤害上 |
| `normalMulti` | 普通增伤，加法堆叠，最后变成 `1 + normalMulti` |
| `independentProduct` | 独立乘区，多个来源互相乘算 |
| `eventAmountAfterMMT` | MMT 处理后的最终事件伤害 |
| `level` | 效果等级 |
| `coreflames` | `pyric_corpus`（此身为炬）读取的火种/轮回计数 |
| `primaryAttributes` | 第一属性/硬度对属性栏的加成 |
| `secondaryAttributes` | 第二属性/密度对属性栏的加成 |
| `tertiaryAttributes` | 第三属性/韧性对属性栏的加成 |
| `primaryEffects` | 第一属性/硬度对 Tetra 效果等级的加成 |
| `secondaryEffects` | 第二属性/密度对 Tetra 效果等级的加成 |
| `tertiaryEffects` | 第三属性/韧性对 Tetra 效果等级的加成 |

常见属性：

| 属性 ID | 中文含义 |
|---|---|
| `generic.attack_damage` | 攻击伤害 |
| `generic.attack_speed` | 攻击速度 |
| `generic.armor` | 护甲 |
| `generic.armor_toughness` | 护甲韧性 |
| `generic.max_health` | 最大生命 |
| `generic.movement_speed` | 移动速度 |
| `generic.knockback_resistance` | 击退抗性 |
| `forge:attack_range` | 攻击距离 |
| `forge:reach_distance` | 交互距离 |
| `forge:step_height_addition` | 台阶高度 |
| `tetra:draw_speed` | 拉弓/弩速度；数值越低通常越快 |
| `tetra:draw_strength` | 弓/弩力度 |
| `tetra:draw_damage` | 弓/弩伤害倍率类属性 |
| `tetra:ability_damage` | 盾牌/工具能力伤害 |
| `tetra:ability_cooldown` | 能力冷却；数值越高通常越慢 |
| `attributeslib:crit_chance` | 暴击率 |
| `attributeslib:crit_damage` | 暴击伤害 |
| `*属性名` | Tetra 的属性乘法/倍率写法，当前泰坦和颂歌已改成这一档 |
| `**属性名` | 更强的乘法属性写法，MMT 部分饰品模块仍保留 |

## 1. Tetra 基础设计参考

这一节是给后续 MMT 分析打底：Tetra 原版的模块、材料、效果本身已经是一套“部件 + 材料三属性 + 效果词条 + 改良”的设计系统。MMT 的数值膨胀，很多时候是把更多模块和更高材料三属性接进了这套系统。

### 1.1 材料与属性语义

| 设计项 | 含义 | 对数值设计的影响 |
|---|---|---|
| `integrity`（完整度） | 模块会占用或提供完整度 | 决定一件工具能不能继续加模块/改良，是 Tetra 的基础容量限制 |
| `durability`（耐久） | 模块和材料共同决定耐久 | 高耐久会提高长期使用价值，但不一定直接增伤 |
| `magicCapacity`（魔力容量） | 影响附魔/魔法承载 | 适合控制附魔上限和特殊模块强度 |
| `primary`（第一属性/硬度） | 材料的硬度向量 | 常用于攻击、挖掘、护甲、主效果等级 |
| `secondary`（第二属性/密度） | 材料的密度向量 | 常用于重量、攻速、部分防御或副效果等级 |
| `tertiary`（第三属性/韧性） | 材料的韧性向量 | 常用于稳定性、速度修正、附加效果或远程属性 |
| `attributes`（属性） | 直接写到属性栏 | 例如攻击、攻速、护甲、距离、弓力 |
| `effects`（效果） | Tetra 效果等级 | 例如横扫、投掷、穿透、迅刺、能力连段 |
| `aspects`（性质） | 模块分类/能力标签 | 例如 `edged_weapon`（刃器）、`block_breaker`（破方块）、`throwable`（可投掷） |
| `improvements`（改良） | 模块可进一步强化的入口 | 卷轴、打磨、缠绕、强化等通常走这里 |

设计上可以把 Tetra 的数值来源分成三层：

1. 模块本体给基础属性/效果，例如 `heavy_blade`（重剑身）给横扫和真横扫，`long_handle`（长握把）给距离。
2. 材料三属性按模块 JSON 的 `primaryAttributes`、`secondaryAttributes`、`tertiaryAttributes` 与对应 `*Effects` 转成额外收益。
3. 改良、socket、卷轴再追加属性或效果。

#### 1.1.x 材料定义 JSON 字段示例

下面是一个完整的 Tetra 材料定义 JSON，每一个字段的含义：

```json
{
  "key": "bone",
  "category": "bone",
  "primary": 5,
  "secondary": 1.9,
  "tertiary": 4.5,
  "durability": 120,
  "integrityCost": 1,
  "integrityGain": 5,
  "magicCapacity": 108,
  "toolLevel": "minecraft:stone",
  "toolEfficiency": 4.5,
  "tints": {
    "glyph": "bone_glyph",
    "texture": "bone"
  },
  "textures": ["bone", "crude"],
  "material": { "items": ["minecraft:bone"] },
  "requiredTools": { "hammer_dig": "minecraft:wood" }
}
```

| 字段 | 含义 | 说明 |
|------|------|------|
| `key` | 材料标识符 | 命名用，也用于汉化 key |
| `category` | 材料类别 | `wood`/`stone`/`socket`/`skin`/`scale`/`rod`/`misc`/`metal`/`gem`/`fibre`/`fabric`/`bone` |
| `primary` | 硬度 | 第一属性，影响攻击、挖掘、护甲、主效果等级 |
| `secondary` | 密度 | 第二属性，影响重量、攻速、部分防御或副效果 |
| `tertiary` | 韧性 | 第三属性，影响稳定性、速度修正、附加效果 |
| `durability` | 耐久 | 模块耐久度加成 |
| `integrityCost` | 完整度消耗 | 安装此模块消耗的完整度 |
| `integrityGain` | 完整度获得 | 安装此模块获得的完整度 |
| `magicCapacity` | 魔力容量 | 影响附魔/魔法承载 |
| `toolLevel` | 挖掘等级 | 如 `"minecraft:stone"`，定义工具可挖掘方块等级 |
| `toolEfficiency` | 挖掘效率 | 数值越高挖掘越快 |
| `tints` | 纹理效果 | `glyph` 为材质颜色，`texture` 为加工台内的纹理 |
| `textures` | 贴图 | 模块在不同工具上的贴图表现 |
| `material` | 材料物品 | 定义使用哪些物品作为材料（通常为 `items` 数组） |
| `requiredTools` | 锻造等级 | 制作所需的锻造锤等级（填材料而非数字） |

#### 1.1.y 材料本地化指南

汉化文件位置：`kubejs/assets/tetra/lang/zh_cn.json`（也可直接把 Tetra 原版的 `zh_cn.json` 复制过来修改）

格式：

```
"tetra.material.<key>.prefix": "<锻造后武器名称前缀>",
"tetra.material.<key>": "<全息球内显示的材料名称>"
```

例如材料 key 为 `ssbs` 的写法：

```json
"tetra.material.ssbs.prefix": "神圣宝石",
"tetra.material.ssbs": "神圣宝石"
```

### 1.2 材料三值设计思路

这里的统计来自当前 Tetra 相关 jar 与 `kubejs/data/tetra/materials/` 中带 `primary/secondary/tertiary` 的材料。MMT jar 里有不少未安装联动材料，所以表里的“典型范围”更适合看设计倾向；具体平衡仍以当前包实际可用材料为准。

| 材料类别 | 三值画像 | 当前包例子 | 设计含义 |
|---|---|---|---|
| `metal`（金属） | 硬度高，密度中高，韧性中等 | `iron`（铁）`5/3.8/3`，`netherite`（下界合金）`7.24/2.9/3.5`，龙钢 `10/4/5`，恐钢 `12/4/5` | 最标准的战斗材料。适合给攻击、护甲、工具等级和稳定的中等韧性；终局金属可以抬硬度，但最好避免三项同时无代价拉满 |
| `gem`（宝石） | 硬度高，密度中高，韧性通常为 0 | `diamond`（钻石）`6/2.9/0`，`emerald`（绿宝石）`5.5/2.5/0`，`amethyst`（紫水晶）`5/2.7/0` | 硬而脆，适合攻击、切削、魔法、socket 特效；不适合当柔韧结构材料。若给韧性，应视为特殊宝石或人工晶体 |
| `stone`（石材） | 硬度中高，密度高，韧性为 0 | `blackstone`（黑石）`4.5/4.5/0`，`obsidian`（黑曜石）`6/5.5/0` | 重、硬、脆。适合早期工具、钝器、石工；不适合提供速度、弹性或耐弯曲收益 |
| `wood`（木材） | 硬度中低，密度低，韧性高 | 常规木材约 `3/1.7/6`，`crimson`（绯红木）`4/2.5/7.5`，`warped`（诡异木）`3/1.2/8.5` | 轻而有弹性。适合握把、弓臂、长柄、完整度和速度手感；攻击白值通常不应太高 |
| `fabric`（布料） | 硬度低，密度低，韧性高 | 羊毛类偏 `1/1/5`，`northstar:durable_fabric`（耐用织物）`5/3.2/6.4` | 软结构材料。适合包、缠绕、护具衬层、槽位系统和韧性收益；高硬度布料应作为强化织物处理 |
| `fibre`（纤维） | 硬度低到中，密度低，韧性高 | `string`（线）偏低硬度，`shadow_silk`（影丝）`7.8/4.5/7.2`，`warped_muscle`（扭曲肌腱）`6.5/7.8/6.9` | 更像“线/筋/丝”的材料。适合弓弦、缠绕、拉力、稳定和特殊生物材料；高三值纤维会强烈影响弓弩和饰品模块 |
| `skin`（皮革/外皮） | 硬度中等，密度中低，韧性较高 | `leather`（皮革）偏软，龙鳞皮革覆盖为 `6/2/5` | 介于布料和鳞甲之间。适合护甲、软护具、手套、鞋、饰品；韧性是主要身份 |
| `scale` / `dragon_scales`（鳞片） | 普通壳片偏硬但韧性低；龙鳞偏韧性高 | `shulker_shell`（潜影壳）`5/0.4/1`，龙鳞 `3/2.5/6` | 壳片像硬壳，龙鳞像柔韧护片。前者偏硬质防护，后者偏护甲/外皮/抗性 |
| `bone`（骨料） | 硬度高，密度中等，韧性中等 | `dragon_tooth`（龙牙）`7.24/2/6`，`dragonbone`（龙骨）偏高硬度 | 轻于金属但仍有硬度。适合尖刺、矛、骨刃、穿刺、穿甲和生物系特殊效果 |
| `rod`（棍/杆） | 按材料来源变化大，通常密度低 | `stick`（木棍）约 `2/0.5/5.5`，`blaze_rod`（烈焰棒）`5/0.4/1`，`nether_star_rod`（下界之星杆）`8/0.2/0.5` | 主要服务握把/杆件。木杆给韧性，魔法杆给特殊硬度或效果，密度通常不高 |
| `socket` / `reagent` / `dyes`（镶嵌/试剂/染料） | 三值通常为 `0/0/0` | 紫水晶 socket、红石粉 reagent、染料 | 不作为结构材料，而是效果载体。平衡重点看 `attributes`、`effects` 和适用槽位 |
| `special_material`（特殊材料） | 按主题破格 | Alex's Caves 等特殊材料 | 可以打破类别规律，但最好有明确代价、限制槽位或只服务特定玩法 |

可以把三值当成一个材质“性格”：

- 硬度高：更适合攻击、挖掘、护甲值、穿刺和主效果等级。MMT 武器模块常把硬度转成攻击或关键效果，所以硬度最容易放大伤害。
- 密度高：更像重量和压实度，适合护甲、护甲韧性、弓力或重型工具，但也应该伴随攻速、拉弓速度、移速之类的代价。
- 韧性高：更像弹性、抗弯曲和软结构强度，适合木材、皮革、纤维、布料、弓臂、弓弦、护具和稳定性。

当前包做新材料时，可以优先按这些边界控制：

| 设计目标 | 推荐三值方向 | 注意点 |
|---|---|---|
| 新的终局金属 | 高硬度，中高密度，中等韧性 | 不要同时给过高硬度、过高韧性和强独立效果；否则会被 MMT 武器/盔甲模块一起放大 |
| 新的魔法宝石 | 高硬度，中等密度，低韧性 | 特效可以强，但结构三值最好保留“脆”的身份 |
| 新的弓弦/纤维 | 低到中硬度，低密度，高韧性 | 若硬度也很高，会同时强化远程伤害和结构收益 |
| 新的皮革/鳞甲 | 中硬度，中低密度，高韧性 | 适合护甲和饰品；如果用于武器模块，需要留意攻击收益 |
| 新的石材 | 中高硬度，高密度，零韧性 | 强在硬和重，不应兼具弹性 |
| 新的 socket/reagent | 三值归零，靠效果表达主题 | 这样不会意外喂给模块三属性公式 |

### 1.3 原版 Tetra 效果速查

| 类型 | 效果 ID | 设计含义 |
|---|---|---|
| 近战范围 | `sweeping`（横扫），`truesweep`（真横扫），`sweepingStrike`（横扫打击），`sweepingFocus`（横扫集中），`planarSweep`（平面横扫） | 控制攻击范围、横扫倍率或横扫触发方式 |
| 快速攻击 | `jab`（快刺），`quickStrike`（快速打击），`lunge`（突刺） | 提高低蓄力/快速出手收益，容易和高攻速构筑联动 |
| 穿透/破防 | `armorPenetration`（穿甲），`piercing`（穿透），`puncture`（破甲），`pry`（撬开） | 绕过护甲、降低护甲或提高穿透能力 |
| 处决/背刺 | `execute`（处决），`backstab`（背刺），`unarmoredDamage`（无甲增伤） | 对特定状态目标增伤 |
| 负面状态 | `bleeding`（流血），`severing`（截肢），`crushing`（粉碎），`skewering`（穿刺），`haunted`（萦魂） | 给目标状态或附带额外伤害逻辑 |
| 防御/格挡 | `blocking`（格挡），`blockingReflect`（格挡反射），`bashing`（盾击），`shieldbreaker`（破盾） | 盾牌和护手常见；影响防御与反击 |
| 投掷 | `throwable`（可投掷），`ricochet`（弹射），`enderReverb`（末影回响） | 让近战部件转向投掷玩法 |
| 远程 | `velocity`（弹速），`spread`（散布），`multishot`（多重射击），`overbowed`（过度拉弓），`focus`（瞄准），`zoom`（缩放） | 弓弩的速度、散布、射击数量和瞄准体验 |
| 工具采掘 | `strikingCut`（砍伐打击），`strikingPickaxe`（镐击），`strikingHoe`（锄击），`denailing`（拔钉），`extraction`（提取） | 控制工具用途和范围采掘 |
| 远古/遗迹 | `unboundExtraction`（未绑定提取），`sculkTaint`（幽匿污染），`percussionScanner`（叩击扫描） | 遗迹模块或特殊工具玩法 |
| 能力系 | `tetra:ability_damage`（能力伤害属性）、`abilityCombo`（能力连段），`abilitySpeed`（能力速度），`abilityMomentum`（能力动量），`abilityOvercharge`（能力过充），`abilityDefensive`（防御能力） | 多用于盾牌、能力型模块和改良 |
| 辅助槽位 | `quickAccess`（快捷取用），`quickSlot`（快捷槽），`quiverSlot`（箭袋槽），`storageSlot`（存储槽），`potionSlot`（药水槽） | 工具腰带、箭袋和容器类玩法 |
| 质量/稳定 | `workable`（可加工），`intuit`（洞察），`stabilizing`（稳定），`unstable`（不稳定），`suspend`（悬浮/挂载） | 工艺、稳定性或功能性收益 |

### 1.4 原版武器与工具模块

| 类别 | 模块 | 基础属性/效果 | 材料三值收益 | 设计定位 |
|---|---|---|---|---|
| 剑 | `basic_blade`（基本剑身） | 攻速 `-1.9`，`sweeping +1` | 硬度：攻击 `+1` | 标准剑身，作为多数剑构筑基准 |
| 剑 | `short_blade`（短剑身） | 攻速 `-1`，攻击 `-0.5`，`jab +130` | 硬度：攻击 `+1`；密度：攻速 `-0.1`、`jab -8` | 轻武器/副手/快刺路线 |
| 剑 | `heavy_blade`（重剑身） | 攻速 `-1.7`，`sweeping [2,0.5]`，`truesweep +1` | 硬度：攻击 `+0.8`、横扫 `+0.3`；密度：攻击 `+0.4`、攻速 `-0.15` | 慢速大范围横扫 |
| 剑 | `machete`（砍刀身） | 攻速 `-1.8`，横扫、砍伐、范围收割 | 硬度：攻击 `+1`；密度：攻速 `-0.1` | 植物/作物范围处理和混合近战 |
| 剑 | `throwing_knife`（飞刀） | 攻速 `-1.3`，攻击 `-1`，`throwable [1,0.7]` | 硬度：攻击 `+1`；密度：投掷第二参数 `+0.15` | 投掷型剑身 |
| 剑 | `stonecutter`（切石器） | 攻击 `+3`，攻速 `-2.8`，`strikingPickaxe`，`sweepingStrike`，`sweeping +2` | 原版模块不从三值继续加收益 | 重型采掘/范围攻击 |
| 剑配件 | `wide_guard`（大护手） | 护甲 `+1`，攻速 `-0.1` | 硬度：护甲 `+0.5`；密度：攻速 `-0.05`；韧性：护甲 `+0.2` | 牺牲速度换防御 |
| 剑配件 | `sturdy_guard`（坚固剑格） | 攻速 `-0.1`，`blocking [1,2.5]` | 硬度：格挡 `+0.2`；密度：格挡第二参数 `+0.1` | 格挡型近战 |
| 剑配件 | `forefinger_ring`（指环） | `quickStrike +2/+3/+5` | 原版模块不从三值继续加收益 | 提高快速攻击下限 |
| 剑配件 | `grip_loop`（环首） | 攻击距离 `+0.5`，`sweeping [0,1]` | 原版模块不从三值继续加收益 | 距离和横扫范围 |
| 剑配件 | `howling`（风啸刃） | 攻速 `-0.1`，`howling [-1,1]` | 硬度：风啸第一参数 `+0.5`；密度：攻速 `-0.05`；韧性：风啸第二参数 `+0.2` | 防弹/风啸辅助 |
| 工具 | `basic_axe`（斧头） | 攻击 `+3.5`，攻速 `-1.6`，`shieldbreaker +1` | 硬度：攻击 `+0.65`；密度：攻击 `+0.25` | 斧、破盾、木材处理 |
| 工具 | `basic_pickaxe`（镐头） | 攻击 `-2`，攻速 `-1.2` | 硬度：攻击 `+1` | 挖矿基准 |
| 工具 | `basic_hammer`（锤头） | 攻速 `-1.1`，`blunt_weapon` | 硬度：攻击 `+0.5`；密度：攻击 `+1`、攻速 `-0.08` | 锤击/合成工作等级，密度收益明显 |
| 工具 | `adze`（锛头） | 攻击 `-2`，攻速 `-1.4` | 硬度：攻击 `+1` | 木工/挖掘混合 |
| 工具 | `claw`（爪头） | 攻击 `-3`，攻速 `-1`，`denailing +1` | 硬度：攻击 `+1` | 拆解/拔钉 |
| 工具 | `sickle`（镰头） | 攻击 `-2`，攻速 `-1.5`，`strikingHoe`，`sweeping`，`planarSweep` | 硬度：攻击 `+1` | 作物/植物范围收割 |
| 单头 | `long_handle`（长握把） | 攻速 `-1.1`，攻击距离/交互距离 `+0.5` | 硬度：距离各 `+0.1`；密度：攻速 `-0.25`；韧性：距离各 `+0.2` | 长柄距离路线，韧性最贴合长柄收益 |
| 单头 | `light_handle`（轻握把） | 攻速 `-1.1`，`throwable [1,0.8]` | 密度：攻速 `-0.1`、投掷第二参数 `+0.1` | 可投掷工具路线 |
| 单头 | `spearhead`（矛头） | 攻速 `-0.9`，`pointy_weapon`，`throwable` | 硬度：攻击 `+1.2`；密度：攻击 `+0.1`、攻速 `-0.1` | 矛/投掷基础 |
| 单头 | `trident`（三叉戟） | 攻击 `+8`，攻速 `-1.25`，`pointy_weapon`，`throwable` | 原版模块不从三值继续加收益 | 高基础攻击投掷头 |
| 单头 | `earthpiercer`（凿地器） | 攻击 `+2`，攻速 `-1.95`，`piercing +2`，`piercingHarvest +1` | 原版模块不从三值继续加收益 | 多方块/穿透采掘 |

### 1.5 原版远程与盾牌模块

| 类别 | 模块 | 基础属性/效果 | 材料三值收益 | 设计定位 |
|---|---|---|---|---|
| 弓 | `straight_stave`（直弓臂） | `draw_speed +1.2`，`spread [0,99]` | 硬度：拉弓速度 `+0.15`、弓力 `+1`；韧性：拉弓速度 `-0.07`、弓力 `+0.6` | 标准弓臂；硬度给力但变慢，韧性兼顾力和速度 |
| 弓 | `long_stave`（长弓臂） | `draw_speed +1.6`，`draw_strength +1.5`，`overbowed +60` | 硬度：拉弓速度 `+0.22`、弓力 `+1.3`、过度拉弓 `-6`；韧性：拉弓速度 `-0.04`、弓力 `+0.75` | 慢拉高力度 |
| 弓 | `recurve_stave`（反曲弓臂） | `draw_speed +0.95`，`spread [0,95]` | 硬度：拉弓速度 `+0.14`、弓力 `+0.95`；韧性：拉弓速度 `-0.09`、弓力 `+0.5` | 更快更稳，韧性收益更偏速度 |
| 弓 | `laminated_stave`（层压弓臂） | `draw_speed +0.95`，`spread [0,95]` | 同反曲弓臂：硬度给弓力，韧性改善拉弓速度 | 稳定弓臂 |
| 弓 | `basic_string`（基础弓弦） | `draw_speed -0.05` | 密度：拉弓速度 `+0.07` | 小幅加快拉弓；高密度弓弦会拖慢 |
| 弓配件 | `extended_rest`（延伸箭台） | `multishot [0,10]` 到 `[4,10]` | 部分变体硬度：多重射击 `+0.9`；韧性：多重射击第二参数 `-1` | 多重射击入口 |
| 弓配件 | `sights`（瞄具） | `zoom +6/+12`，`focus`，可带 `focusEcho`/`unstable` | 部分变体硬度：缩放 `+3.4`、瞄准第二参数 `-0.02`；韧性：缩放 `-0.7`、瞄准第二参数 `+0.08` | 瞄准和稳定 |
| 弓配件 | `stabilizer`（稳定器） | `velocity +15/+20`，可带 `suspend` | 部分变体韧性：弹速 `+6` | 弹速和悬挂 |
| 弩 | `basic_stave`（基础弩臂） | `draw_speed +1`，`draw_strength +0.5` | 硬度：拉弓速度 `+0.2`、弓力 `+1.2`；韧性：拉弓速度 `-0.1`、弓力 `+0.9` | 弩臂基准；韧性对弩速度很重要 |
| 弩 | `basic_stock`（基础弩托） | `draw_speed +0.5` | 密度：拉弓速度 `+0.2` | 弩托基准，高密度拖慢装填 |
| 弩配件 | `basic_string`（基础弩弦） | `draw_speed -0.05` | 密度：拉弓速度 `+0.07` | 小幅加快装填；高密度拖慢 |
| 弩配件 | `stirrup`（脚蹬） | `draw_speed -0.05` | 硬度：拉弓速度 `-0.02`；密度：拉弓速度 `+0.01` | 小幅加快装填 |
| 盾 | `buckler`（小圆盾） | `ability_damage +1`，`ability_cooldown +1`，护甲韧性 `+0.5` | 硬度：能力伤害 `+0.4`、护甲韧性 `+0.4`；密度：能力伤害 `+0.1`、冷却 `+0.15`、韧性 `+0.3`；韧性：护甲韧性 `+0.2` | 轻盾/快能力 |
| 盾 | `heater`（鸢盾） | `ability_damage +1`，`ability_cooldown +2`，`blocking [2.5,1]` | 硬度：能力伤害 `+0.8`、格挡 `+0.3`；密度：能力伤害 `+0.2`、冷却 `+0.3`、格挡 `-0.2`；韧性：格挡 `+0.3` | 标准格挡盾 |
| 盾 | `tower`（塔盾） | `ability_damage +5`，`ability_cooldown +5`，`blocking +16` | 硬度：能力伤害 `+0.6`；密度：能力伤害 `+0.3`、冷却 `+0.35`；韧性：冷却 `-0.2` | 高防御、慢能力；韧性可抵消部分笨重感 |
| 盾配件 | `spike`（盾刺） | `ability_cooldown +0.3`，`blockingReflect [38,0.9]` | 硬度：反射第二参数 `+0.05`；密度：冷却 `+0.1`、反射第一参数 `-2` | 反射/反击 |
| 盾配件 | `sturdy_boss`（坚固盾突） | `ability_cooldown +0.3`，`bashing [1,1]` | 硬度：盾击 `[+0.2,+0.3]`；密度：冷却 `+0.3`、盾击 `[+0.3,+0.1]` | 盾击 |

### 1.6 原版工具腰带模块

| 模块 | 效果 | 设计定位 |
|---|---|---|
| `belt` / `belt_wool`（腰带主体） | - | 工具腰带基础结构，主要决定可安装槽位 |
| `strap`（挂带） | `quickSlot +1` 到 `+4` | 快捷槽数量 |
| `storage`（储物袋） | `storageSlot +4/+6/+13/+16` | 额外存储槽 |
| `quiver`（箭袋） | `quiverSlot +2/+6/+8/+9` | 弹药/箭矢槽 |
| `potion_storage`（药水袋） | `potionSlot +1/+2/+3/+4` | 药水槽 |
| `booster`（推进器） | `booster +1` | 位移/推进功能 |
| `suspender`（吊带） | `suspendSelf +1` | 悬挂/自身悬浮相关 |

### 1.7 原版改良与设计入口

| 改良/入口 | 常见文件位置 | 设计含义 |
|---|---|---|
| `hone`（打磨） | `improvements/*/shared*/hone_*` | 提高模块性能，是 Tetra 的长期成长线 |
| `quality`（品质） | `improvements/*/shared/quality.json` | 通用质量提升 |
| `wrap`（缠绕） | `improvements/*/*/wrap.json` | 常见于握把/弓臂/弓弦，提高稳定或耐用 |
| `warforged`（战铸） | `improvements/double/*/warforged.json` | 工具头强化路线 |
| `socket`（镶嵌） | `modules/*/socket.json` | 让宝石/特殊材料给属性或效果 |
| `perk_socket_0`（华丽镶嵌） | `modules/*/perk_socket_0.json` | 更偏特殊收益的镶嵌入口 |
| `schematics`（图纸） | `data/tetra/schematics/` | 控制模块解锁和可制作性 |
| `synergies`（协同） | `data/tetra/synergies/` | 控制双头工具、模块组合等额外加成 |

### 1.8 原版打磨与当前包倍率平衡

Tetra 原版打磨分成两种：白值型直接加属性，倍率型使用 `**` 属性。倍率型会先进入基础属性计算，再被 MMT 普通增伤和独立乘区继续放大，所以当前包对打磨里的 `**` 项做了压低覆盖。

| 打磨来源 | 原版 1-5 级 | 当前包 1-5 级 | 说明 |
|---|---|---|---|
| 剑刃/矛头攻击打磨 | `generic.attack_damage +0.5/+1/+1.5/+2/+3` | 保持原版 | 攻击白值型，成长明确但不会作为额外倍率再叠 |
| 剑柄攻击打磨 | `**generic.attack_damage +5%/+10%/+15%/+20%/+25%` | `+2%/+4%/+6%/+8%/+10%` | 攻击倍率型，当前包已压低 |
| 弓弦/复合弓弦伤害打磨 | `**tetra:draw_strength +5%/+10%/+15%/+20%/+30%` | `+2%/+4%/+6%/+8%/+10%` | 远程弓力倍率，当前包已压低 |
| 盾带伤害打磨 | `**tetra:ability_damage +10%/+20%/+30%/+40%/+50%` | `+4%/+8%/+12%/+16%/+20%` | 盾能力伤害倍率，保留较高上限但砍掉原版 50% 峰值 |
| 剑刃速度打磨 | `**generic.attack_speed +5%/+10%/+15%/+20%/+25%` | `+2%/+4%/+6%/+8%/+10%` | 攻速倍率型，当前包已压低 |
| 单头握把速度打磨 | `**generic.attack_speed +5%/+10%/+15%/+20%/+25%` | `+2%/+4%/+6%/+8%/+10%` | 长柄/单头工具攻速倍率，当前包已压低 |
| 弓臂速度打磨 | `**tetra:draw_speed -5%/-10%/-15%/-20%/-25%` | `-2%/-4%/-6%/-8%/-10%` | `draw_speed` 越低通常越快，当前包压低速度倍率 |
| 盾握把速度打磨 | `**tetra:ability_cooldown -10%/-20%/-30%/-40%/-50%` | `-5%/-10%/-15%/-20%/-25%` | 盾能力冷却倍率，当前包砍半 |
| 盾板速度打磨 | `**tetra:ability_cooldown -5%/-15%/-20%/-30%/-40%` | `-3%/-6%/-9%/-12%/-15%` | 盾板冷却倍率，当前包进一步压低 |
| 剑柄/工具头速度打磨 | `generic.attack_speed +0.05` 到 `+0.25` | 保持原版 | 攻速白值型，不属于 `**` 倍率压低范围 |
| 盾板/盾握把白值伤害打磨 | `tetra:ability_damage +0.5` 到 `+3` | 保持原版 | 能力伤害白值型 |
| 盾带速度打磨 | `tetra:ability_cooldown -0.5` 到 `-2.5` | 保持原版 | 冷却白值型 |

### 1.9 GeoTetraArmor 盔甲模块

当前包对 GeoTetraArmor 有 KubeJS 覆盖和中文说明，盔甲也按 Tetra 的材料三属性计算。

| 部位/模块 | 风格 | 材料三属性对应收益 | 备注 |
|---|---|---|---|
| `armor/head/base`（头盔主体） | `vanilla`（香草）/ `heavy`（重型） | 硬度主要提高护甲；密度少量提高护甲并提高护甲韧性；韧性提高护甲韧性 | 重型约为香草 `1.2x` 护甲、`1.5x` 韧性，并降低移速 |
| `armor/chest/base`（胸甲主体） | 香草/重型 | 同上 | 胸甲主体权重较高，是护甲值主要来源 |
| `armor/chest/left/right`（左右肩甲） | 香草/重型 | 同上 | 分摊胸甲侧边收益 |
| `armor/legs/belt`（腰带） | 香草/重型 | 同上 | 腿部中间模块，权重比单侧腿甲更高 |
| `armor/legs/left/right`（左右腿甲） | 香草/重型 | 同上 | 分摊护腿收益 |
| `armor/feet/left/right`（左右鞋子） | 香草/重型 | 同上 | 分摊靴子收益 |
| `armor/chest/extra/dragon_wing`（龙翼额外件） | 特殊额外模块 | 主要走额外能力/外观入口 | 来自 GeoTetraArmor jar；可作为特殊胸甲扩展位 |

盔甲模块的设计重点是：材料三属性不直接进入攻击乘区，但会通过护甲、护甲韧性、移动速度惩罚和附魔承载改变生存曲线。重型模块如果堆得太多，防御会变高，但移速损失也会叠加。

### 1.10 Tetra 效果参数语义：level 与 efficiency

Tetra 效果在模块/改良/协同 JSON 中以 `"效果ID": 数值` 或 `"效果ID": [A, B]` 形式定义。理解数组两项的含义需要结合反序列化器和具体效果类的代码。

#### 1.10.1 反序列化规则（EffectData$Deserializer）

来源：`se.mickelus.tetra.module.data.EffectData$Deserializer`（位于 `mods/tetra-1.20.1-6.9.0.jar`）

| JSON 写法 | levelMap | efficiencyMap | 说明 |
|-----------|----------|---------------|------|
| `"stun": 30` | `levelMap["stun"] = 30.0f` | 不动（默认 0） | 单值仅设 level |
| `"stun": [75, 3]` | `levelMap["stun"] = 75.0f` | `efficiencyMap["stun"] = 3.0f` | 数组两项分别设 level 和 efficiency |

`TierData.getLevel(key)` 返回 `Math.round(levelMap.get(key))` 的 int；`getEfficiency(key)` 返回 float 原值。多来源（模块、材料、改良、协同）的 level/efficiency 会**求和叠加**。

#### 1.10.2 效果参数语义对照

**efficiency 不是统一语义**，由具体效果类决定。以下是已核实的效果参数含义：

| 效果 ID | level `[0]` 含义 | efficiency `[1]` 含义 | 来源/触发方式 |
|---------|-------------------|----------------------|--------------|
| `reap`（收割） | 伤害百分比：`level / 100` 倍攻击力 | AOE 范围（格），直接用作检测盒半径 | 蓄力技能（右键充能），`ReapEffect` |
| `stun`（击晕） | 触发概率：`random < level / 100` 时生效 | 眩晕时间（秒），`efficiency × 20` = 生效刻数 | 近战命中即判定（`LivingHurtEvent`），`StunEffect` |
| `abilityMomentum`（惯性） | 玩家自身击退免疫时间（秒/hit）：`level × hitCount` 秒 | 目标眩晕时间（秒/hit）：`efficiency × hitCount` 秒 | 任意蓄力技能命中后追加，`ReapEffect.applyBuff()` + `hitEntities()` |
| `abilityOvercharge`（超蓄） | 每层超蓄的名义加成幅度（%） | **折扣乘数**（0~1 无量纲）：有效值 = `level × efficiency` | 蓄力技能多段充能时每层累加 |

**sickle.json 协同实例解读**：

| 协同组合 | JSON | 实际含义 |
|----------|------|----------|
| 左镰刀（warsickle） | `"reap": [75, 3]` | 蓄力横扫造成 75% 攻击力伤害，范围半径 3 格 |
| 左镰刀 + 右斧 | `"abilityOvercharge": [10, 0.3]` | 超蓄每层名义 +10%，实际仅 3%（10 × 0.3）生效 |
| 左镰刀 + 右锤 | `"abilityMomentum": [15, 2]` | 每命中一个实体：玩家免疫击退 15 秒，目标晕眩 2 秒 |
| 左镰刀 + 右锛 | `"abilityDefensive": [160, 45]` | 能力防御类效果（未深入分析） |
| 左镰刀 + 右镐 | `"abilityCombo": [10, 5]` | 能力连段效果（未深入分析） |

#### 1.10.3 查询方法

要确定某个效果的 level/efficiency 具体语义，需反编译对应效果类的 `perform()` 或`applyBuff()` 方法：

```
javap -c -p -classpath mods/tetra-1.20.1-6.9.0.jar se.mickelus.tetra.effect.<EffectName>
```

关键识别标识：
- 调用 `getEffectLevel(stack, itemEffect)` → 读取 level
- 调用 `getEffectEfficiency(stack, itemEffect)` → 读取 efficiency
- level 常参与概率判断（`random < level / 100.0`）或百分比计算
- efficiency 在不同类中含义差异最大：可能是物理量（秒、格）、折扣乘数、或计数器步长

### 1.11 abilityExhilaration（振奋）数值逻辑

`abilityExhilaration` 是一个跨技能的效果乘子，定义在重剑身模块（`modules/sword/heavy_blade.json`）中。它不是独立触发的效果，而是嵌入到各个蓄力技能（execute、reap、lunge、puncture、pry、overpower、slam）的 `perform()` 与 `applyBuff()` 中，在击杀或命中时提供额外收益。其字段 `[level, efficiency]` 与 §1.10 的反序列化规则一致。

#### 1.11.1 数据来源

| 数据来源 | 内容 |
|---|---|
| `kubejs/data/tetra/modules/sword/heavy_blade.json` | 唯一提供 `abilityExhilaration` 的模块，基准值 `[4, 10]` |
| 反编译：`se.mickelus.tetra.effect.{Execute,Reap,Lunge,Puncture,Pry,Overpower,Slam}Effect` | 各技能内嵌的 exhilaration 逻辑，通过 `getEffectLevel(stack, abilityExhilaration)` 和 `getEffectEfficiency(stack, abilityExhilaration)` 读取参数 |
| 反编译：`se.mickelus.tetra.effect.potion.{Exhausted,SmallStrength,SmallAbsorb}PotionEffect` | 振奋触发的药水效果数值 |
| `kubejs/assets/tetra/lang/zh_cn.json` | 各技能 `*_exhilaration.tooltip` 汉化说明 |

#### 1.11.2 heavy_blade.json 中的振奋数值

| 位置 | JSON 路径 | 值 | 含义 |
|---|---|---|---|
| 基础效果 | `effects.abilityExhilaration` | `[1, 10]` | level=1, efficiency=10 |
| 第一属性/硬度加成 | `extract.primaryEffects.abilityExhilaration` | `[0, 1]` | 每点硬度：+0 level, +1 efficiency |
| 第二属性/密度加成 | `extract.secondaryEffects.abilityExhilaration` | `[0, 1]` | 每点密度：+0 level, +1 efficiency |
| 第三属性/韧性加成 | `extract.tertiaryEffects.abilityExhilaration` | `[0, 2]` | 每点韧性：+0 level, +2 efficiency |

> **总效果等级计算**：最终 `level` 和 `efficiency` 是所有来源（模块基础、材料三属性加成、改良）的求和叠加。例如，使用硬度 5 的金属 + 密度 3 的金属 + 韧性 4 的木材时，振奋总值为：
> - level = 1 + 5×0 + 3×0 + 4×0 = **1**
> - efficiency = 10 + 5×1 + 3×1 + 4×2 = **26**

> 注意：当前材料三属性对 level 的加成均为 0，level 仅由基础值和改良提供；efficiency 可通过三属性轻松堆叠。

#### 1.11.3 各技能振奋效果速查

| 技能 | level `[0]` 语义 | efficiency `[1]` 语义 | 触发条件 | 收益概述 |
|---|---|---|---|---|
| **reap**（收割） | 吸收护盾基数（见下方公式） | 冷却缩减百分比 | 收割命中后有实体死亡 | CD 缩短 + 获得 30s 吸收护盾 |
| **execute**（处决） | 伤害加成阈值：每 `level%` 已损 HP → +1 伤害 | 加成持续时间因子：`min(200, efficiency × 目标最大HP)` 秒 | 处决命中未死亡目标 | 按目标已损血量比例获得攻击 buff |
| **lunge**（猛冲） | 伤害增幅（额外倍率） | — | 猛冲命中 | 提升猛冲伤害，未命中则施加精疲力竭 |
| **puncture**（刺穿） | 护甲阈值判定 | 流血持续时间（秒） | 刺穿命中 | 若目标护甲 < 6 则重置 CD；已减甲目标附加流血 |
| **pry**（撬击） | — | 每层撬击的伤害增幅百分比 | 撬击命中 | 提升撬击伤害 |
| **overpower**（压制） | — | — | 压制击杀 | 移除持有者精疲力竭效果 |
| **slam**（下砸） | 单目标距离加成上限 | 多人伤害增幅百分比 | 下砸命中 | 多人 +efficiency%；单人：击退距离加成（20格满） |

#### 1.11.4 逐个技能详细公式

##### reap（收割）振奋

触发条件：收割命中实体后，该实体死亡（`isDeadOrDying()`）。

**冷却缩减（perform 方法）：**
```
if (efficiency > 0 && affectedEntityCount > 0):
    cooldown = cooldown × (1 - efficiency / 100)
```
即振奋效率值 = 冷却缩短百分比。基准 efficiency=10 → 击杀后 CD 缩短 10%。

**吸收护盾（applyBuff 方法）：**
```
if (level > 0):
    existingAmplifier = player.getEffect(SmallAbsorb).amplifier  // 无效果时 = -1
    finalAmplifier = max(existingAmplifier, killCount - 1)
    player.addEffect(new SmallAbsorb(600ticks=30s, finalAmplifier))
```

`SmallAbsorb` 每级提供 `amplifier + 1` 点吸收值（详见 §1.11.5）。击杀实体数越多，护盾等级越高；后续收割击杀会刷新并保留较高等级。

> 注意：此处的 `level` 值用于判断"是否启用吸盾"（`level > 0`），但最终的护盾等级由击杀数决定，不直接等于 `level`。

##### execute（处决）振奋

触发条件：处决命中目标，但目标未死亡（`!isDeadOrDying()`）。

**攻击加成（regularExecute 方法）：**
```
healthLostFraction = 1 - (currentHP / maxHP)
damageAmplifier = Math.round(healthLostFraction × 100 / level) - 1
if (damageAmplifier < 0): 不施加
```

**持续时间（秒）：**
```
durationSeconds = min(200, efficiency × maxHP)
// durationTicks = durationSeconds × 20
```

**施加效果：**
```
player.addEffect(new SmallStrength(durationTicks, damageAmplifier))
```

`SmallStrength` 每级提供 +1 攻击伤害（ADDITION 模式，详见 §1.11.5）。

**实例计算（基准 level=1, efficiency=10）：**

| 目标最大 HP | 击杀时剩余 HP | 已损比例 | amplifier | 攻击加成 | 持续时间 |
|---|---|---|---|---|---|
| 20 | 10 (50%) | 50% | `round(50/1)-1=49` | +50 | `min(200,10×20)=200s` |
| 20 | 0 (0%) | 100% | `round(100/1)-1=99` | +100 | 200s |
| 20 | 18 (90%) | 10% | `round(10/1)-1=9` | +10 | 200s |
| 20 | 19 (95%) | 5% | `round(5/1)-1=4` | +5 | 200s |
| 5 | 0 (0%) | 100% | `round(100/1)-1=99` | +100 | `min(200,10×5)=50s` |

> 由于 level=1（每 1% 已损 HP → +1 伤害），处决振奋的收益极高，但 duration 与目标最大 HP 成正比，对低血量目标持续时间短。

##### lunge（猛冲）振奋

触发条件：猛冲命中目标。

**精疲力竭机制：**
- 猛冲未命中：施加 `ExhaustedPotionEffect`（精疲力竭，持续 20s，amplifier=4）
- Exhausted 每级：移动速度 **-10%**（MULTIPLY_TOTAL）、攻击速度 **-5%**（MULTIPLY_TOTAL）、挖掘速度额外降低 `(amplifier+1)×5%`

振奋调整了猛冲的伤害量（具体公式见 LungeEffect 内部计算），level 用作伤害增幅参数。

##### puncture（刺穿）振奋

触发条件：刺穿命中目标。

**冷却重置：**
```
if (targetArmorAfterPierce < 6):  resetCooldown()
```

**流血附加：**
```
if (targetHasArmorReductionEffect):  inflictBleeding(efficiency seconds)
```

即 efficiency 值 = 流血持续时间（秒）。

##### pry（撬击）振奋

触发条件：撬击命中目标。

```
每层 pryEffect 伤害提升: +efficiency%（具体乘入 pry 伤害计算链）
```

##### overpower（压制）振奋

触发条件：压制击杀目标。

```
if (overpower_killed_target):  removeExhaustedEffectFrom(wielder)
```

移除持有者的精疲力竭效果，不涉及 level/efficiency 数值。

##### slam（下砸）振奋

触发条件：下砸冲击命中。

**多人模式：**
```
每个命中目标额外伤害 = +efficiency%（乘入基础伤害）
```

**单人模式（仅命中 1 目标）：**
```
获得 10 秒攻击 buff，加成 = f(knockbackDistance)
// 20 格距离时达到最大加成 = level
```

#### 1.11.5 振奋触发的药水效果数值

| 药水效果 | 触发技能 | 属性/机制 | 每级数值 |
|---|---|---|---|
| `SmallStrength` | execute（处决） | `generic.attack_damage`，ADDITION 模式 | **+1** 攻击伤害/级 |
| `SmallAbsorb` | reap（收割） | `absorption`，直接加减模式 | **amplifier+1** 点吸收 |
| `Exhausted` | lunge（猛冲，未命中） | `generic.movement_speed`，MULTIPLY_TOTAL | **-10%** 移速/级 |
| | | `generic.attack_speed`，MULTIPLY_TOTAL | **-5%** 攻速/级 |
| | | 挖掘速度 | 额外 `-(amplifier+1)×5%` |
| `Stun` | reap（击晕附属） | 眩晕 | abilityMomentum 控制时间 |
| `Steeled` | reap（防御附属） | 伤害吸收 | abilityDefensive 级数 |

#### 1.11.6 设计考量

1. **振奋只来源于重剑身**：当前包仅有 `heavy_blade`（重剑身）提供 `abilityExhilaration`，其他模块不提供。这意味着振奋是重剑身路线的专属机制，不会意外地与其他模块叠加。

2. **level 越高，各技能收益越线性增长**：
   - execute：阈值更低（每 1% 已损HP 就有 +1），同等目标提供更多攻击加成
   - reap：吸盾启用（但实际上吸盾等级由击杀数决定，level 仅作为启用开关）
   - lunge/pry/slam：伤害增幅更明显

3. **efficiency 越高，持续/冷却收益越好**：
   - execute：buff 持续时间更长（与目标 HP 相乘，高 efficiency 对小怪也有较长覆盖）
   - reap：CD 缩减更多（10% 基准 + 材料效率加成）
   - puncture：流血时间更长

4. **材料三属性导向**（当前值）：
   - 三属性对 level 加成均为 0：level 仅由基础值（1）和改良提供，execute 收益天花板由改良控制
   - 硬度（primary）+ 密度（secondary）各给 +1 efficiency/单位
   - 韧性（tertiary）给 +2 efficiency/单位，最优先提升 CD 缩减和持续时间

### 1.12 abilityOvercharge（超蓄）数值逻辑

`abilityOvercharge` 是 Tetra 蓄力技能的二次蓄力机制，定义在重剑身模块（`modules/sword/heavy_blade.json`）中。当一件工具同时拥有某个蓄力技能效果（如 `reap`、`execute` 等）和 `abilityOvercharge` 时，玩家可以在蓄力满之后继续按住右键，进入"超蓄"阶段，获得额外的技能强化。

#### 1.12.1 超蓄段数与进度计算

核心逻辑位于 `ChargedAbilityEffect.getOverchargeBonus()` 和 `getOverchargeProgress()`。

```
progress = useTicks / chargeTime - 1.0   // 超出满蓄力的比例
```

| progress 区间 | getOverchargeProgress 公式 | 对应蓄力时间 | overchargeTier |
|---|---|---|---|
| ≤ 0.5 | `2 × progress` | 1.0~1.5 倍蓄力时间 | 0~1 |
| 0.5 < p ≤ 1.5 | `progress + 0.5` | 1.5~2.5 倍蓄力时间 | 1~2 |
| > 1.5 | `0.75 × progress + 0.875` | 2.5+ 倍蓄力时间 | 2~3 |

```java
overchargeTier = (int)Math.clamp(getOverchargeProgress(progress), 0, 3)
```

即超蓄最多 **3 段**（0~3），每段需要蓄力满后继续按住约 50% 额外时间。

**必要条件**：`item.getEffectLevel(stack, abilityOvercharge) > 0`（工具上必须有 >0 级的超蓄效果）。

#### 1.12.2 heavy_blade.json 中的超蓄数值

| 位置 | JSON 路径 | 值 | 含义 |
|---|---|---|---|
| 基础效果 | `effects.abilityOvercharge` | `[10, 1]` | level=10, efficiency=1.0 |
| 第一属性/硬度 | `extract.primaryEffects.abilityOvercharge` | `[5, 1]` | 每点硬度：+5 level, +1 efficiency |
| 第二属性/密度 | `extract.secondaryEffects.abilityOvercharge` | `[5, 1]` | 每点密度：+5 level, +1 efficiency |
| 第三属性/韧性 | （无） | — | 韧性不给超蓄加成 |

> **总效果计算**：最终 `level` 和 `efficiency` 是所有来源（模块基础、材料三属性、改良）的求和叠加。例如硬度 5 + 密度 3 的材料：
> - level = 10 + 5×5 + 3×5 = **50**
> - efficiency = 1 + 5×1 + 3×1 = **9**

#### 1.12.3 各技能超蓄效果速查

| 技能 | level `[0]` 语义 | efficiency `[1]` 语义 | 每段收益 |
|---|---|---|---|
| **execute**（处决） | 伤害乘区：`×(1 + tier × level/100)` | （未使用） | +level% 伤害（乘法） |
| **reap**（收割） | 伤害百分比加值：`+ tier × level/100` | 击杀 buff 持续时间因子 | +level% 伤害（加法），+0.5 范围，+efficiency×100% buff时间 |
| **lunge**（猛冲） | 初始速度增幅 | 伤害增幅 | +level% 速度，+efficiency%（level×eff%）伤害 |
| **overpower**（压制） | 伤害增幅 | （工具提示含） | +level%×efficiency% 伤害，双方+额外精疲力竭层 |
| **pry**（撬击） | 伤害增幅 | 护甲削减值 | +level%×efficiency% 伤害，+efficiency 护甲削减 |
| **puncture**（刺穿） | 护甲削减增幅 | 流血时间 | +level% 护甲削减，+efficiency 秒流血 |
| **slam**（下砸） | 伤害增幅 | 冲击波射程 / 击退 | +level%×efficiency% 伤害，+efficiency 冲击波射程，+level% 击退 |

> **level 与 efficiency 的角色差异**：
> - **execute**：只用 level（直乘），efficiency 闲置
> - **reap**：level 控伤害/范围（加法），efficiency 控 buff 持续时间
> - 其余技能（lunge/overpower/pry/puncture/slam）：来自 MMT jar 或 tetra jar 的公式有所不同，具体使用时 `level × efficiency` 常作为折扣后的有效百分比（参见 §1.10.2 sickle 协同示例：`[10, 0.3]` → 有效 3%/段）

#### 1.12.4 逐个技能详细公式

##### execute（处决）超蓄

`regularExecute` 方法中的伤害乘算（已验证字节码）：

```
if (canOvercharge):
    damageMultiplier *= (1 + overchargeTier × getEffectLevel(stack, abilityOvercharge) / 100.0)
```

对 execute 原始伤害公式的 **乘法修正**。每多一段超蓄，总伤害乘以 `(1 + level/100)`。

**实例（基准 level=10）：**

| 超蓄段数 | 充能时间 | 伤害倍率 |
|---|---|---|
| 0 | 1.0× chargeTime | ×1.00 |
| 1 | ~1.5× chargeTime | ×1.10 |
| 2 | ~2.0× chargeTime | ×1.20 |
| 3 | ~2.5× chargeTime | ×1.30 |

以硬度 5 + 密度 3 材料（level=50）为例：
- Tier 1: ×1.50
- Tier 3: ×2.50

##### reap（收割）超蓄

`perform` 方法中的伤害/范围加法修正（已验证字节码）：

```
if (overchargeTier > 0):
    damagePercent += overchargeTier × getEffectLevel(stack, abilityOvercharge) / 100.0
    range += overchargeTier × 0.5
```

`applyBuff` 中的击杀 buff 时间修正：

```
duration = 600 × (1 + overchargeTier × getEffectEfficiency(stack, abilityOvercharge))
// efficiency=1.0 时：Tier1=1200ticks(60s), Tier3=2400ticks(120s)
```

**实例（基准 level=10, efficiency=1.0）：**

| 段数 | 伤害百分比 | 范围（格） | 击杀 buff 时间 |
|---|---|---|---|
| 0 | 100% | 3.0 | 30s |
| 1 | 110% | 3.5 | 60s |
| 2 | 120% | 4.0 | 90s |
| 3 | 130% | 4.5 | 120s |

##### lunge（猛冲）超蓄

（以下基于工具提示参数推断，未逐字节验证）

```
初始速度 += overchargeTier × level%
伤害 += overchargeTier × (level × efficiency)%
```

##### overpower（压制）超蓄

```
伤害 += overchargeTier × (level × efficiency)%
双方额外精疲力竭层数 += overchargeTier × (固定值或 efficiency)
```

##### pry（撬击）超蓄

```
伤害 += overchargeTier × (level × efficiency)%
目标护甲削减 += overchargeTier × efficiency
蓄力时间增加（每段额外耗时）
```

##### puncture（刺穿）超蓄

```
护甲削减效果 += overchargeTier × level%
流血时间 += overchargeTier × efficiency 秒
```

##### slam（下砸）超蓄

```
伤害 += overchargeTier × (level × efficiency)%
冲击波射程 += overchargeTier × efficiency
直接目标击退 += overchargeTier × level%
```

#### 1.12.5 超蓄与振奋的叠加

由于 `heavy_blade` 同时提供 `abilityOvercharge` 和 `abilityExhilaration`，两者在同一技能中可以协同生效。以 **reap** 为例：

1. 玩家超蓄 3 段 → damagePercent 从 100% → 130%，范围从 3.0 → 4.5
2. 击杀目标 → CD 缩减 efficiency% = 10%（振奋冷却缩减）
3. 击杀目标 → 获得 SmallStrength buff，持续时间 120s（超蓄 extended）× 每杀 +1 攻击
4. 获得 SmallAbsorb 护盾（振奋）

> **注意**：超蓄的 efficiency 和振奋的 efficiency 是独立的两个值，分别来自 `abilityOvercharge[1]` 和 `abilityExhilaration[1]`，不要混淆。

#### 1.12.6 设计考量

1. **超蓄来源仅 heavy_blade**：与振奋相同，超蓄只由重剑身模块提供，不与其它模块意外叠加。

2. **level 主导伤害增益**：所有技能中 level 都是伤害相关参数。execute 用乘法（更强），reap 用加法，其余技能走 `level × efficiency` 折扣。

3. **efficiency 的角色**：在 reap 中控制 buff 时间，在其它技能中作为 level 的折扣乘数。高 efficiency 让超蓄的"额外"效果（时间/范围/减甲）更显著。

4. **材料导向**：
   - 硬度（primary）+ 密度（secondary）各给 `[+5, +1]` / 单位——level 快速增长
   - 韧性（tertiary）不给超蓄加成——选择韧性材料即放弃超蓄强度
   - 高三值材料（如 5 硬度 + 3 密度 = level +40）会显著放大超蓄收益

5. **与 1.10.2 的 efficiency 一致**：多来源超蓄叠加时，`level × efficiency` 作为有效折扣百分比，与 sickle.json 协同的 `[10, 0.3] → 3%` 语义一致。

### 1.13 abilitySpeed（冷却）数值逻辑

`abilitySpeed` 是 Tetra 能力系统的全局冷却加速效果。与 `abilityOvercharge` / `abilityExhilaration` 不同，它**不由 heavy_blade 模块提供**，而是仅通过双头战铸（warforged）协同（synergy）获得。它有两个独立的用途：全局冷却缩减（读 level）和收割击杀后移速增益（读 efficiency）。

#### 1.13.1 数据来源

| 来源 | 协同组合 | 值 | 含义 |
|---|---|---|---|
| Tetra jar: `synergies/double/warforged/butt.json` | 右握把头（`double/butt_right`）+ 战铸 | `"abilitySpeed": 20` | level=20, efficiency=默认 0 |
| Tetra jar: `synergies/double/warforged/sickle.json` | 左镰刀（`double/sickle_left`）+ 右握把头 + 战铸 | `"abilitySpeed": [0, 30]` | level=0, efficiency=30 |

> 当前 KubeJS 无 `abilitySpeed` 覆盖或新增定义（`kubejs/data/tetra/` 下无任何 JSON 包含此字段）。

#### 1.13.2 用途一：全局冷却与蓄力时间缩减

核心代码位于 `ChargedAbilityEffect.getSpeedBonusMultiplier()`，对所有蓄力技能（execute、reap、lunge 等）生效：

```
speedMultiplier = (100 - level) / 100.0
chargeTime = baseChargeTime × speedMultiplier
cooldown   = baseCooldown   × speedMultiplier
```

- 仅使用 `abilitySpeed` 的 **level** 值
- level 每 +1 → 冷却和蓄力时间缩减 **1%**（线性，非乘算叠加）
- 来源叠加时 level 求和（例：butt 20 + warsickle+butt 0 = 总 level 20）

**实例（right butt + warforged，level=20）：**

| 技能 | 原始冷却 | 缩减后冷却 |
|---|---|---|
| Reap | 40 ticks (2s) | `40 × 0.80 = 32 ticks (1.6s)` |
| Execute | 40 ticks (2s) | `40 × 0.80 = 32 ticks (1.6s)` |

> 注意：`getSpeedBonusMultiplier` 返回的倍率直接乘以冷却和蓄力时间，多个 abilitySpeed 来源先求和再统一乘算。

**与 abilityOvercharge 的交互**：冷却和蓄力时间缩减后，超蓄的触发阈值（1.0× 充能时间）也相应缩短，因此 abilitySpeed 间接加快了超蓄节奏。

#### 1.13.3 用途二：收割击杀后移速增益

`ReapEffect.applyBuff()` 中，收割击杀目标时触发：

```
if (abilitySpeedLevel > 0):
    duration = efficiency × 20 (ticks = efficiency 秒)
    player.addEffect(MOVEMENT_SPEED, duration, killCount - 1)
```

- level 仅作为启用开关（`> 0` 即启用）
- **efficiency** 决定移速 buff 的持续时间（秒）
- amplifier = `killCount - 1`（击杀越多、移速等级越高）

**实例：**

| 协同来源 | level | efficiency | 收割击杀后果 |
|---|---|---|---|
| butt warforged (`abilitySpeed: 20`) | 20 | 0 | 冷却缩减 20%，**无移速 buff**（efficiency=0） |
| sickle+butt warforged (`[0, 30]`) | 0 | 30 | **无冷却缩减**（level=0），每次收割击杀获得 `MOVEMENT_SPEED × killCount`，持续 **30 秒** |
| 两者叠加 | 20 | 30 | 冷却缩减 20%，收割击杀后 30 秒移速 buff |

#### 1.13.4 abilitySpeed 的 level 与 efficiency 语义总结

| 参数 | 用于 | 计算公式 | 作用对象 |
|---|---|---|---|
| **level** `[0]` | 全局冷却/蓄力缩减 | `(100 - level)%` 倍率 | 所有蓄力技能（execute/reap/lunge/puncture/pry/overpower/slam） |
| **efficiency** `[1]` | 收割移速 buff 时间 | `efficiency 秒` | 仅 ReapEffect 的 applyBuff 击杀后 |

> 与 `abilityOvercharge` 不同：abilitySpeed 的 level 和 efficiency 是**完全独立的两条路径**，不存在 `level × efficiency` 的折扣关系。两个值各自服务不同的机制。

#### 1.13.5 工具提示与显示

| 统计 ID | EN 名 | 中文名 | 显示内容 |
|---|---|---|---|
| `ability_speed` | Cooldown | 冷却 | 计算后的基础冷却时间（秒） |
| `ability_speed_bonus` | Light | 轻盈 | 冷却/蓄力缩减百分比（来自 level） |
| `ability_speed_normalized` | Cooldown | 冷却 | 与基础值的差异（秒） |
| `reap_speed_bonus` | — | — | 收割专属：冷却缩减% + 击杀后攻速 buff 持续时间 |
| `pry_speed_bonus` | — | — | 撬击专属：冷却缩减值 |

#### 1.13.6 设计考量

1. **稀有来源**：abilitySpeed 仅来自双头工具的战铸协同，且必须包含右握把头（butt）。这限制了冷却缩减的普适性——单头工具和不需要 butt 的双头组合无法获得此效果。

2. **level 与 efficiency 分离**：两个参数互不干扰。
   - 需要冷却缩减 → 看 level（如 butt 20）
   - 需要收割移速 buff → 看 efficiency（如 sickle+butt 30）
   - 两者可叠加（同时启用冷却缩减和移速 buff）

3. **与 abilityOvercharge 的协同**：冷却缩减后，蓄满加速 → 超蓄触发更快 → 同时间内可获得更多超蓄段数。例如 butt warforged 提供 20% 冷却缩减后，在同样的等待时间里可能多获取一段超蓄。

## 2. MMT 伤害公式

CDC 日志打印的公式：

```text
max(((base + fixed) * (1 + normalMulti)) * independentProduct, 0)
```

解释：

- `base`（原始伤害）：MMT 处理前的伤害。
- `fixed`（固定伤害）：先加到 `base`（原始伤害）。
- `normalMulti`（普通增伤）：加法堆叠，最后作为 `(1 + normalMulti)`。
- `independentProduct`（独立乘区）：乘法堆叠。

日志样例：

```text
base(原始伤害)=139.7206
fixed(固定伤害)=13.8438
normalMulti(普通增伤)=7.1300
independentProduct(独立乘区)=1.6380
eventAmountAfterMMT(MMT处理后伤害)=2045.0071
```

对应：

```text
(139.7206 + 13.8438) * (1 + 7.1300) * 1.6380 = 2045.0071
```

## 3. MMT 主要收益机制与样例数值

下面这一组数值来自一次测试观察，用来说明这些效果进入哪个乘区、在实战里可能表现到什么量级；没有同一份日志时，也可以按同样的公式和效果等级重新代入。

| 效果 | 样例数值 | 乘区 | 来源/说明 |
|---|---:|---|---|
| `more_mod_tetra:duel` 终焉决斗 | `+2.1600` | 普通增伤 | 等级约 27，满层挑战者/被挑战合计 amplifier 为 8 |
| `more_mod_tetra:heavy_chop` 重劈 | `+2.0000` | 普通增伤 | 敌人缺护甲件数越多收益越高 |
| `more_mod_tetra:torch_the_laws_of_old` 燃尽旧日律法 | `+1.7500` | 普通增伤 | 和双方血量差有关，样例里 law titan 等级 50 |
| `more_mod_tetra:notes` 记事 | `x1.3000` | 独立乘区 | boss/精英增伤；非近战按代码可走更高倍率 |
| `more_mod_tetra:curios_melee_damage_up` 饰品近战增幅 | `x1.2600` | 独立乘区 | 饰品总等级 26 |
| `more_mod_tetra:ode_to_cyrene` 献给昔涟的颂歌 | `+13.8438` | 固定伤害 | 先加到 base |
| `more_mod_tetra:ode_to_trailblaze` 开拓颂歌 | `+0.2000` | 普通增伤 | 等级 20 -> `+20%` |

一次测试里，同一套攻击不带 Duel 时：

```text
normalMulti(普通增伤)=4.9700
amount(伤害)=1501.6842
```

满 Duel 后：

```text
normalMulti(普通增伤)=7.1300
amount(伤害)=2045.0071
```

`Duel`（终焉决斗）在这次样例中的实际最终收益约 `+36.2%`，但它本身向普通乘区塞入了 `+216%`。

### 3.1 伤害收益按乘区速查

| 类别 | 来源 | 样例/公式 | 说明 |
|---|---|---|---|
| 固定伤害 | `ode_to_cyrene`（献给昔涟的颂歌） | 样例 `+13.8438`，旧测试也见过 `+5.0000` | 进入 `fixed`（固定伤害），先加到 `base`（原始伤害） |
| 普通增伤 | `ode_to_trailblaze`（献给开拓的颂歌） | 等级 20 -> 样例 `+0.2000` | 进入 `normalMulti`（普通增伤） |
| 普通增伤 | `duel`（终焉决斗） | 满挑战者/被挑战时：`(双方药水等级合计) * 效果等级 / 100`；样例出现 `+0.54`、`+1.08`、`+1.62`、`+2.16` | 来源主要是 `sword_stem_handguard`（剑茎护手） |
| 普通增伤 | `heavy_chop`（重劈） | 样例常见 `+1.48` 到 `+2.00` | 来源主要是 `mmt_ceremonial_sword`（佩刀/礼仪剑），目标缺护甲件数越多越高 |
| 普通增伤 | `torch_the_laws_of_old`（燃尽旧日律法） | 泰坦卷轴等级 50 时样例 `+1.7500`；颂歌等级 25 | 和双方血量差有关，是影响较明显的律法系普通增伤 |
| 普通增伤 | `sirenic_serenade`（海妖在欢唱） | 泰坦卷轴等级 10，颂歌等级 5 | 给负面状态，并对负面目标增伤；不是独立乘区 |
| 普通增伤 | `pyric_corpus`（此身为炬） | `level / 100 * coreflames / 33550336`；泰坦等级 1000，颂歌等级 500 | 火种/轮回计满时，泰坦理论 `+10.0`，颂歌理论 `+5.0` |
| 普通增伤 | `Witherite B`（凋灵合金日志项） | 样例 `+1.0067` 到 `+1.0200` | Cataclysm 相关，不是 MMT 本体，但和 MMT 乘区叠在一起 |
| 独立乘区 | `notes`（记事） | 样例 `x1.3000` | Rosmontis 相关 socket，boss/精英独立增伤；可能来自副手 |
| 独立乘区 | `curios_melee_damage_up`（饰品近战伤害增幅） | `1 + 总等级 / 100`；样例 `x1.2600` | 说明该样例里饰品近战增幅总等级为 26 |
| 独立乘区 | `curios_projectile_damage_up`（饰品弹射物伤害增幅） | `1 + 总等级 / 100` | 游侠徽章等来源 |
| 独立乘区 | `curios_magic_damage_up`（饰品魔法伤害增幅） | `1 + 总等级 / 100` | 巫师徽章等来源 |
| 独立乘区 | `curios_all_damage_up`（饰品全伤害增幅） | `1 + 总等级 / 100` | 复仇者徽章来源 |
| 独立乘区 | `titan_slayer`（泰坦杀手） | 泰坦卷轴等级 20 -> `x1.20`；颂歌等级 10 -> `x1.10` | boss/精英独立增伤 |
| 额外通用伤害 | `createdelight:overwhelm`（压倒） | `目标当前生命值 * 等级 / 100` | KubeJS 实现，不是 MMT 乘区；目标血量越高，追加伤害越高 |

### 3.2 攻击、暴击、爆伤来源速查

| 收益 | 来源 | 数值 |
|---|---|---|
| 攻击/攻速/弓属性倍率 | 每个泰坦卷轴强化、普通颂歌 | `*attack_speed +0.05`，`*attack_damage +0.05`，`*draw_speed -0.05`，`*draw_strength +0.05` |
| 攻击/攻速/弓属性倍率 | `ode_to_strife`（纷争颂歌） | 上面四项的 4 倍：`+0.20/-0.20` |
| 暴击率/爆伤 | `critical_strike_probability_up`（暴击率强化） | 1-5 级：暴击率 `+0.10/+0.15/+0.18/+0.22/+0.30`，爆伤 `+0.20/+0.30/+0.40/+0.45/+0.50` |
| 暴击率/爆伤 | `critical_strike_damage_up`（暴击伤害强化） | 1-5 级：暴击率 `+0.03/+0.06/+0.09/+0.12/+0.15`，爆伤 `+0.25/+0.40/+0.55/+0.70/+0.85` |
| 暴击率 | `critical_strike_bracelet`（暴击手镯）、手镯 `gem`（镶嵌） | 各 `+0.01` |
| 爆伤 | `critical_strike_ring`（暴击之戒）、戒指 `gem`（镶嵌） | `+0.0175`、`+0.025` |
| 暴击率/爆伤 | `tracking`（追迹核心） | 暴击率 `+0.03`，爆伤 `+0.05` |
| 攻击伤害 | `powder_cannon`（火药炮强化，剑/单头/双头） | `generic.attack_damage +2` |
| 弓/弩力度 | `powder_cannon`（火药炮强化，弓/弩） | `tetra:draw_strength +2` |
| 攻击伤害倍率 | `pristine_diamond`（无瑕钻石强化） | `**generic.attack_damage +0.1` |
| 暴击 | `pristine_emerald`（无瑕绿宝石强化） | `criticalStrike [15,1]` |
| 攻击距离 | `pristine_amethyst`（无瑕紫水晶强化） | `reach_distance +0.5`，`attack_range +0.5`，`reaching [6,0.25]` |

## 4. 泰坦卷轴与颂歌

当前包已覆盖 MMT 原版 `**` 直接属性，改为 `*`。因此这些词条仍然提高攻速/攻击/弓属性，但不再走原先更夸张的 `**` 乘法属性写法。

通用直接属性：

```text
*generic.attack_speed(攻击速度) = +0.05
*generic.attack_damage(攻击伤害) = +0.05
*tetra:draw_speed(拉弓/弩速度) = -0.05
*tetra:draw_strength(弓/弩力度) = +0.05
```

`ode_to_strife` 例外：

```text
*generic.attack_speed(攻击速度) = +0.20
*generic.attack_damage(攻击伤害) = +0.20
*tetra:draw_speed(拉弓/弩速度) = -0.20
*tetra:draw_strength(弓/弩力度) = +0.20
```

### 4.1 泰坦卷轴

| 文件 | 效果 | 等级 | 收益类型 |
|---|---|---:|---|
| `the_legend_scroll_of_death_titan_up.json`（死亡泰坦卷轴强化） | `sanctuary_of_mooncocoon`（月茧之庇） | 5 | 保命/免伤，非直接增伤 |
| `the_legend_scroll_of_earth_titan_up.json`（大地泰坦卷轴强化） | `though_worlds_apart`（纵然山河万程） | 10 | 攻击后按攻击力给伤害吸收 |
| `the_legend_scroll_of_law_titan_up.json`（律法泰坦卷轴强化） | `torch_the_laws_of_old`（燃尽旧日律法） | 50 | 普通增伤/受击减伤；一次测试观察到 `+1.7500` |
| `the_legend_scroll_of_ocean_titan_up.json`（海洋泰坦卷轴强化） | `sirenic_serenade`（海妖在欢唱） | 10 | 给负面状态；对七类负面目标增伤，普通乘区 |
| `the_legend_scroll_of_passage_titan_up.json`（通路泰坦卷轴强化） | `the_century_gate`（百界门） | 1 | 战利品传送，非伤害 |
| `the_legend_scroll_of_reason_titan_up.json`（理性泰坦卷轴强化） | `everything_is_in_everything`（万物皆在万物之中） | 400 | 经验收益；非伤害 |
| `the_legend_scroll_of_reason_titan_up.json`（理性泰坦卷轴强化） | `experience_edge`（经验之刃） | `[25,50]` | 经验相关 |
| `the_legend_scroll_of_romance_titan_up.json`（浪漫泰坦卷轴强化） | `invulnerable_time_down`（破妄） | 25 | 降低无敌帧，间接提高连击收益 |
| `the_legend_scroll_of_sky_titan_up.json`（天空泰坦卷轴强化） | `first_light_heals_the_world`（疗愈世间的晨曦） | 10 | 回复增强，非直接增伤 |
| `the_legend_scroll_of_time_titan_up.json`（时间泰坦卷轴强化） | `to_evernights_stars`（致长夜的星光） | 20 | 按血量变化增伤/回血 |
| `the_legend_scroll_of_trickery_titan_up.json`（诡计泰坦卷轴强化） | `jackpot_for_the_taking`（空手套白银） | 1 | 额外战利品，非伤害 |
| `the_legend_scroll_of_worldbearing_titan_up.json`（负世泰坦卷轴强化） | `pyric_corpus`（此身为炬） | 1000 | 普通增伤，上限较高 |
| `the_legend_scroll_of_worldbearing_titan_up.json`（负世泰坦卷轴强化） | `titan_slayer`（泰坦杀手） | 20 | boss/精英独立增伤 `x1.20` |

`pyric_corpus` 反编译确认公式核心为：

```text
normalMulti(普通增伤) += level(效果等级) / 100 * coreflames(火种/轮回计数) / 33550336
```

因此 `pyric_corpus=1000` 在火种轮回计满时理论上可给 `+10.0` 普通增伤。平时收益取决于 NBT 中累计的火种/轮回。

### 4.2 颂歌

| 文件 | 效果 | 等级 | 收益类型 |
|---|---|---:|---|
| `ode_to_cyrene.json`（昔涟颂歌） | `ode_to_cyrene`（献给昔涟的颂歌） | 25 | 固定伤害；日志样例 `+13.8438` |
| `ode_to_death.json`（死亡颂歌） | `sanctuary_of_mooncocoon`（月茧之庇） | 45 | 强保命，非直接增伤 |
| `ode_to_earth.json`（大地颂歌） | `though_worlds_apart`（纵然山河万程） | 5 | 攻击后伤害吸收 |
| `ode_to_law.json`（律法颂歌） | `torch_the_laws_of_old`（燃尽旧日律法） | 25 | 普通增伤/受击减伤 |
| `ode_to_ocean.json`（海洋颂歌） | `sirenic_serenade`（海妖在欢唱） | 5 | 负面状态与普通增伤 |
| `ode_to_passage.json`（通路颂歌） | `ode_to_passage`（献给通路的颂歌） | 15 | 通道/位移相关，非日志伤害核心 |
| `ode_to_reason.json`（理性颂歌） | `everything_is_in_everything`（万物皆在万物之中） | 400 | 经验收益 |
| `ode_to_reason.json`（理性颂歌） | `experience_edge`（经验之刃） | `[25,0]` | 经验相关 |
| `ode_to_romance.json`（浪漫颂歌） | `invulnerable_time_down`（破妄） | 12.5 | 降低无敌帧 |
| `ode_to_sky.json`（天空颂歌） | `first_light_heals_the_world`（疗愈世间的晨曦） | 5 | 回复增强 |
| `ode_to_strife.json`（纷争颂歌） | 无 MMT `runtime effect`（运行时效果） | - | 但直接属性为普通颂歌 4 倍 |
| `ode_to_time.json`（时间颂歌） | `to_evernights_stars`（致长夜的星光） | 10 | 血量变化增伤/回血 |
| `ode_to_trailblaze.json`（开拓颂歌） | `ode_to_trailblaze`（献给开拓的颂歌） | 20 | 普通增伤；日志样例 `+0.2000` |
| `ode_to_trickery.json`（诡计颂歌） | `jackpot_for_the_taking`（空手套白银） | 1 | 额外战利品 |
| `ode_to_worldbearing.json`（负世颂歌） | `pyric_corpus`（此身为炬） | 500 | 普通增伤，轮回计满理论 `+5.0` |
| `ode_to_worldbearing.json`（负世颂歌） | `titan_slayer`（泰坦杀手） | 10 | boss/精英独立增伤 `x1.10` |

## 5. 饰品收益

MMT 饰品收益通过 Curios 读取。伤害类 Curios 效果反编译确认均为独立乘区：

```text
independentProduct(独立乘区) *= 1 + curiosEffectLevel(饰品效果总等级) / 100
```

| 效果 | 中文名 | 乘区 | 说明 |
|---|---|---|---|
| `curios_melee_damage_up`（近战伤害增幅） | 饰品·近战伤害增幅 | 独立 | 一次测试观察到 `x1.2600`，说明总等级 26 |
| `curios_projectile_damage_up`（弹射物伤害增幅） | 饰品·弹射物伤害增幅 | 独立 | 弹射物伤害 |
| `curios_magic_damage_up`（魔法伤害增幅） | 饰品·魔法伤害增幅 | 独立 | 魔法伤害 |
| `curios_all_damage_up`（全伤害增幅） | 饰品·全伤害增幅 | 独立 | 所有伤害 |
| `curios_protect`（伤害减免） | 饰品·伤害减免 | 防御 | 减少所受伤害 |
| `curios_armor_penetration`（固定穿甲） | 饰品·固定穿甲 | 进攻 | 无视固定护甲值 |

### 5.1 饰品模块

下表与原版模块表保持同一格式：`primary`（第一属性/硬度）、`secondary`（第二属性/密度）、`tertiary`（第三属性/韧性）统一写入“材料三值收益”。`属性` 对应 `*Attributes`，会改属性栏；`效果` 对应 `*Effects`，会改 Tetra 效果等级。数组值保留 MMT 原始写法，例如 `[5,1]` 通常是同一效果的两个参数。

| 模块 | 槽位 | 本体属性/效果 | 材料三值收益 |
|---|---|---|---|
| `critical_strike_bracelet`（暴击手镯） | `mmt_bracelet/base_bracelet` | 属性：`attributeslib:crit_chance`（暴击率）`+0.01` | 硬度属性：`attributeslib:crit_damage`（爆伤）`+0.0075` |
| `cyclone_bracelet`（疾风手镯） | `mmt_bracelet/base_bracelet` | 属性：`generic.attack_speed`（攻速）`+0.05` | 硬度属性：攻速 `+0.05`；密度属性：攻速 `-0.01` |
| `protect_bracelet`（抗性手镯） | `mmt_bracelet/base_bracelet` | 效果：`curios_protect`（饰品伤害减免）`+5` | 硬度效果：伤害减免 `+0.25`；密度效果：伤害减免 `+0.25` |
| `gem`（手镯镶嵌） | `mmt_bracelet/inlay` | 属性：暴击率 `+0.01` | 硬度属性：爆伤 `+0.015` |
| `king_crown`（王者之冠） | `mmt_crown/crown_ring` | 属性：`**attack_damage/armor/max_health/armor_toughness/attack_speed/movement_speed` 各 `+0.0125` | 硬度属性：`**attack_damage`（攻击）`+0.0025`，`**armor`（护甲）`+0.0025`；密度属性：`**max_health`（生命）`+0.005`，`**armor_toughness`（韧性）`+0.005`，`**movement_speed`（移速）`-0.00125`；韧性属性：`**attack_speed`（攻速）`+0.0025`，`**movement_speed`（移速）`+0.0025` |
| `avenger_emblem`（复仇者徽章） | `mmt_emblem/emblem_type` | 效果：`curios_all_damage_up`（饰品全伤害增幅）`+3` | 硬度效果：全伤害 `+0.35`；密度效果：全伤害 `+0.50`；韧性效果：全伤害 `+0.20` |
| `knight_emblem`（骑士徽章） | `mmt_emblem/emblem_type` | 效果：伤害减免 `+5` | 硬度效果：伤害减免 `+1.00`；密度效果：伤害减免 `+0.75`；韧性效果：伤害减免 `+0.325` |
| `ranger_emblem`（游侠徽章） | `mmt_emblem/emblem_type` | 效果：`curios_projectile_damage_up`（弹射物伤害增幅）`+5` | 硬度效果：弹射物伤害 `+0.50`；密度效果：弹射物伤害 `+0.375`；韧性效果：弹射物伤害 `+0.75` |
| `sorcerer_emblem`（巫师徽章） | `mmt_emblem/emblem_type` | 效果：`curios_magic_damage_up`（魔法伤害增幅）`+5` | 硬度效果：魔法伤害 `+0.50`；密度效果：魔法伤害 `+0.75`；韧性效果：魔法伤害 `+0.375` |
| `warrior_emblem`（战士徽章） | `mmt_emblem/emblem_type` | 效果：`curios_melee_damage_up`（近战伤害增幅）`+5` | 硬度效果：近战伤害 `+0.75`；密度效果：近战伤害 `+0.50`；韧性效果：近战伤害 `+0.375` |
| `hard_glove`（坚硬手套） | `mmt_glove/base_glove` | 属性：`forge:attack_range`（攻击距离）`+0.5`，`forge:reach_distance`（交互距离）`+0.5`，攻击 `+1` | 硬度属性：攻击 `+0.3`；密度属性：`**attack_speed`（攻速）`-0.01`，攻击 `+0.1` |
| `soft_glove`（柔软手套） | `mmt_glove/base_glove` | 属性：攻击距离 `+0.5`，交互距离 `+0.5`，`**attack_speed`（攻速）`+0.10` | 密度属性：`**attack_speed`（攻速）`-0.01`；韧性属性：`**attack_speed`（攻速）`+0.015` |
| `soft_base`（柔韧护心镜基底） | `mmt_heart_protecting_mirror/base` | 效果：伤害减免 `+2.25` | 韧性效果：伤害减免 `+0.75` |
| `health_core`（生命核心） | `mmt_heart_protecting_mirror/core` | 属性：`generic.max_health`（最大生命）`+4` | 密度属性：最大生命 `+2` |
| `cross`（十字坠饰） | `mmt_necklace/pendant` | 效果：`curios_kamui`（饰品神威）`+15` | 硬度效果：神威 `+2` |
| `fang`（尖牙坠饰） | `mmt_necklace/pendant` | 效果：`curios_armor_penetration`（固定穿甲）`+2` | 硬度效果：固定穿甲 `+0.4`；密度效果：固定穿甲 `+0.2` |
| `critical_strike_ring`（暴击之戒） | `mmt_ring/base_ring` | 属性：爆伤 `+0.0175` | 硬度属性：暴击率 `+0.005` |
| `jank_ring`（磁力之戒） | `mmt_ring/base_ring` | 效果：`curios_jank`（饰品磁力）`+5` | 硬度效果：磁力 `+1`；密度效果：磁力 `+1`；韧性效果：磁力 `+0.75` |
| `gem`（戒指镶嵌） | `mmt_ring/inlay` | 属性：爆伤 `+0.025` | 硬度属性：暴击率 `+0.0075` |
| `tracking`（追迹核心） | `mmt_ring/inlay` | 属性：暴击率 `+0.03`，爆伤 `+0.05`；效果：`curios_projectile_tracking`（弹射物追踪）`+1` | 原模块不从三值继续加收益 |
| `block_sole`（鞋底） | `mmt_shoes/sole` | 属性：`**generic.movement_speed`（移速）`+0.075` | 原模块不从三值继续加收益 |
| `flat_sole`（平底鞋底） | `mmt_shoes/sole` | 属性：`**movement_speed`（移速）`+0.15` | 硬度属性：`**knockback_resistance`（击退抗性）`+0.015`；密度属性：击退抗性 `+0.005`；韧性效果：`curios_feather_falling`（摔落保护）`+7` |
| `platform_shoes`（加厚鞋底） | `mmt_shoes/sole` | 属性：`**movement_speed`（移速）`+0.02` | 硬度属性：击退抗性 `+0.00375`，`forge:step_height_addition`（台阶高度）`+0.05`；密度属性：击退抗性 `+0.0025`，台阶高度 `+0.05`，移速 `-0.0125`；韧性效果：摔落保护 `+9` |
| `spiked_shoes`（钉形鞋底） | `mmt_shoes/sole` | 属性：`**movement_speed`（移速）`+0.025` | 硬度属性：击退抗性 `+0.0135`；密度属性：击退抗性 `+0.0075`，移速 `-0.015`；韧性效果：摔落保护 `+5` |
| `long_boots`（长靴鞋面） | `mmt_shoes/upper` | 属性：`**movement_speed`（移速）`+0.035`，`**knockback_resistance`（击退抗性）`+0.10` | 硬度属性：移速 `+0.004`，击退抗性 `+0.02`；密度属性：移速 `-0.02`，击退抗性 `+0.01` |
| `short_boots`（短靴鞋面） | `mmt_shoes/upper` | 属性：`**movement_speed`（移速）`+0.065`，台阶高度 `+0.3` | 硬度属性：移速 `+0.004`，台阶高度 `+0.1`；密度属性：移速 `-0.016`，台阶高度 `+0.2` |
| `sports_shoes`（运动鞋面） | `mmt_shoes/upper` | 属性：`**movement_speed`（移速）`+0.15` | 硬度属性：移速 `+0.01`；密度属性：移速 `-0.03` |
| `base_totem_core`（图腾核心） | `mmt_totem_of_undying/totem_core` | 效果：`curios_totem_effect`（图腾增强）`[5,1]` | 硬度效果：图腾增强 `[+1,+0]`；密度效果：图腾增强 `[+0,+0.7]` |
| `base_totem_shell`（不死图腾外壳） | `mmt_totem_of_undying/totem_shell` | 效果：`curios_totem_cooldown`（图腾冷却）`180`，`curios_totem_health`（图腾回复）`10` | 硬度效果：图腾冷却 `-4`；密度效果：图腾回复 `+3` |

未列入正文的饰品模块：依赖当前未安装联动的模块。

### 5.2 暴击与爆伤

当前包中和 MMT/饰品最相关的暴击属性：

| 来源 | 暴击率 | 爆伤 |
|---|---:|---:|
| `mmt_bracelet/base_bracelet/critical_strike_bracelet`（暴击手镯） | `+0.01` | - |
| `mmt_bracelet/inlay/gem`（手镯镶嵌） | `+0.01` | - |
| `mmt_ring/base_ring/critical_strike_ring`（暴击之戒） | - | `+0.0175` |
| `mmt_ring/inlay/gem`（戒指镶嵌） | - | `+0.025` |
| `mmt_ring/inlay/tracking`（追迹核心） | `+0.03` | `+0.05` |

当前包共享强化还存在两组暴击/爆伤强化：

| 强化 | 等级 | 暴击率 | 爆伤 |
|---|---:|---:|---:|
| `critical_strike_probability_up`（暴击率强化） | 1 | `+0.10` | `+0.20` |
| `critical_strike_probability_up`（暴击率强化） | 2 | `+0.15` | `+0.30` |
| `critical_strike_probability_up`（暴击率强化） | 3 | `+0.18` | `+0.40` |
| `critical_strike_probability_up`（暴击率强化） | 4 | `+0.22` | `+0.45` |
| `critical_strike_probability_up`（暴击率强化） | 5 | `+0.30` | `+0.50` |
| `critical_strike_damage_up`（暴击伤害强化） | 1 | `+0.03` | `+0.25` |
| `critical_strike_damage_up`（暴击伤害强化） | 2 | `+0.06` | `+0.40` |
| `critical_strike_damage_up`（暴击伤害强化） | 3 | `+0.09` | `+0.55` |
| `critical_strike_damage_up`（暴击伤害强化） | 4 | `+0.12` | `+0.70` |
| `critical_strike_damage_up`（暴击伤害强化） | 5 | `+0.15` | `+0.85` |

## 6. MMT 武器与远程模块

同样，材料三属性按原版模块表的格式写作：硬度、密度、韧性统一放入“材料三值收益”。注意 `primaryEffects` 里偶尔会出现 `generic.attack_damage` 这种名字，它在 JSON 位置上仍是效果项，不是属性项。

| 模块 | 槽位 | 本体属性/效果 | 材料三值收益 |
|---|---|---|---|
| `mmt_ceremonial_sword`（佩刀/礼仪剑） | `sword/blade` | 属性：攻速 `-1.9`，护甲 `+1`，护甲韧性 `+1`；效果：`heavy_chop`（重劈）`+5`，`sweeping`（横扫）`+1.2` | 硬度属性：攻击 `+0.85`，护甲 `+0.5`，护甲韧性 `+0.5`；硬度效果：重劈 `+0.75`；密度效果：重劈 `+0.5` |
| `sword_stem_handguard`（剑茎护手） | `sword/pommel` | 效果：`duel`（终焉决斗）`[1,1]` | 硬度效果：终焉决斗 `[+1,+0.15]`；密度效果：`counterweight`（配重）`+1`，终焉决斗 `[+0.4,+1]`；韧性效果：终焉决斗 `[+0.2,+0.5]` |
| `mmt_rapier`（西洋剑） | `sword/blade` | 属性：攻速 `-1.3`；效果：`puncture`（迅刺）`+75` | 硬度属性：攻击 `+0.7`；硬度效果：迅刺 `+6`；密度效果：迅刺 `+5`；韧性效果：迅刺 `+3` |
| `mmt_katana`（太刀） | `sword/blade` | 属性：攻速 `-1.5`，攻击 `+0.2`；效果：横扫 `+1`，`severing`（截肢）`[10,1]` | 硬度属性：攻击 `+1`；硬度效果：`skewering`（穿刺）`+0.3`，横扫 `+0.1`，截肢 `[+4.5,+0.2]`；密度效果：横扫 `+0.15`，截肢 `[+3,+0.15]`；韧性效果：截肢 `[+3,+0.1]`，横扫 `+0.3`，`abilityMomentum`（能力动量）`+0.1` |
| `wakizashi`（胁差） | `sword/blade` | 属性：攻速 `-1.5`，攻击 `+0.2`；效果：横扫 `+1`，`jab`（快刺）`+110` | 硬度属性：攻击 `+1`；硬度效果：`generic.attack_damage`（攻击伤害效果项）`+0.8`，快刺 `+0.75`；密度效果：`generic.attack_speed`（攻速效果项）`-0.1`，快刺 `+0.5`；韧性效果：横扫 `+0.3`，快刺 `+0.1` |
| `mmt_twin_blade`（双剑） | `sword/blade` | 属性：攻速 `-1`，攻击 `-0.5`；效果：快刺 `+50`，`star_burst_stream`（星爆气流斩）`+3` | 硬度属性：攻击 `+0.75` |
| `kunai`（苦无） | `sword/blade` | 属性：攻速 `-1.3`，攻击 `-1`；效果：`throwable`（投掷）`[1,1.7]`，`assassinate`（暗杀）`+60` | 硬度属性：攻击 `+1`；硬度效果：暗杀 `+20`；密度效果：投掷 `[+0,+0.15]` |
| `mmt_coin_sword`（铜钱剑） | `sword/blade` | 属性：攻速 `-1.7`，攻击 `-0.5`；效果：横扫 `+1`，`defeat_demons`（退魔）`+50` | 硬度属性：攻击 `+1` |
| `cooking_knife`（厨刀） | `sword/blade` | 属性：攻速 `-1`，攻击 `-0.8`；效果：`food_acquisition`（食材获取）`+3`，`beheading`（斩首）`+10` | 硬度属性：攻击 `+1`；密度属性：攻速 `-0.1` |
| `mmt_flanged_mace`（凸缘钉头锤） | `single/head` | 属性：攻速 `-2.2`，攻击 `+3.2`；效果：`heavy_hit`（重砸）`+10` | 硬度属性：攻击 `+0.62`；硬度效果：重砸 `+2`；密度属性：攻击 `+0.21`；密度效果：重砸 `+3`；韧性效果：重砸 `-1` |
| `naginata`（薙刀） | `single/head` | 属性：攻击距离 `+2`，攻速 `-1.5`；效果：横扫 `+5`，`truesweep`（真横扫）`+1` | 硬度属性：攻击 `+0.8`，横扫属性项 `[0,0.2]`；硬度效果：横扫 `[0,0.2]`；密度属性：攻击 `+0.4`，攻速 `-0.15`，横扫属性项 `[0,0.2]` |
| `wrench`（扳手） | `single/head` | 属性：攻速 `-1.1`，攻击 `+2`；效果：`denailing`（拔钉）`+1`，`industrial_protection`（工业防护）`+1` | 硬度属性：攻击 `+0.5`；硬度效果：工业防护 `+0.5`；密度属性：攻击 `+0.2`；密度效果：工业防护 `+0.5` |
| `paxel`（镐尖斧） | `double/head_left` | 属性：攻击 `-2`，攻速 `-1.2` | 硬度属性：攻击 `+1` |
| `ama_no_mahagaki_no_yumi`（天之麻迦古弓） | `bow/stave` | 属性：`tetra:draw_speed`（拉弓速度）`+1.2`，`tetra:draw_strength`（弓力）`+4.5`；效果：`spread`（散布）`[0,99]`，`overbowed`（过度拉弓）`+60` | 硬度属性：拉弓速度 `+0.25`，弓力 `+2.3`；硬度效果：退魔 `+6.5`，`velocity`（弹速）`+3`；韧性属性：拉弓速度 `-0.16`，弓力 `+1.8`；韧性效果：退魔 `+3`，弹速 `+6` |
| `apollo_bow`（光之弓） | `bow/stave` | 属性：拉弓速度 `+0.35`，弓力 `+1.1`；效果：散布 `[0,99]`，`multishot`（多重射击）`[1,10]` | 硬度属性：拉弓速度 `+0.11`，弓力 `+1.55`；硬度效果：`glowing`（光芒）`+2`，多重射击 `+0.5`；韧性属性：拉弓速度 `-0.45`，弓力 `+0.9`；韧性效果：光芒 `+1.5`，多重射击 `+0.5` |
| `blade_bow`（刃弓） | `bow/stave` | 属性：拉弓速度 `+1.2`，攻速 `-1.4`，攻击 `+0.1`；效果：散布 `[0,100]` | 硬度属性：攻击 `+0.3`，拉弓速度 `+0.1`，弓力 `+0.92`；韧性属性：拉弓速度 `-0.075`，弓力 `+0.7` |
| `sun_shooting_bow`（射日弓） | `bow/stave` | 属性：拉弓速度 `+0.76`，弓力 `+2.5`；效果：散布 `[0,99]`，`shooting_sun`（射日）`+1` | 硬度属性：拉弓速度 `+0.16`，弓力 `+1.9`；硬度效果：射日 `+4`，弹速 `+5`；韧性属性：拉弓速度 `-0.3`，弓力 `+1.3`；韧性效果：射日 `+2`，弹速 `+4` |
| `accelerator`（弩箭加速器） | `crossbow/attachment_0/1` | - | 硬度效果：`piercing`（穿透）`+0.7`，弹速 `+5`；密度效果：穿透 `+0.5`，弹速 `+5` |
| `diffusion_rest`（散射弩箭台） | `crossbow/attachment_0/1` | 效果：多重射击 `[0,10]` | 硬度效果：多重射击 `+0.9`；韧性效果：多重射击 `[0,-1]` |
| `sun_shooting_crossbow`（射日弩） | `crossbow/stave` | 属性：拉弓速度 `+1.05`，弓力 `+2.5`；效果：射日 `+1` | 硬度属性：拉弓速度 `+0.21`，弓力 `+2.15`；硬度效果：射日 `+5`，弹速 `+4`；韧性属性：拉弓速度 `-0.28`，弓力 `+1.7`；韧性效果：射日 `+3`，弹速 `+3` |
| `ama_no_mahagaki_no_yumi`（天之麻迦古弩） | `crossbow/stave` | 属性：拉弓速度 `+1.3`，弓力 `+5` | 硬度属性：拉弓速度 `+0.26`，弓力 `+2.5`；硬度效果：退魔 `+6`，弹速 `+2`，穿透 `+0.5`；韧性属性：拉弓速度 `-0.15`，弓力 `+2`；韧性效果：退魔 `+2.5`，弹速 `+4`，穿透 `+0.5` |
| `apollo_crossbow`（光之弩） | `crossbow/stave` | 属性：拉弓速度 `+0.55`，弓力 `+1.5`；效果：多重射击 `[1,10]` | 硬度属性：拉弓速度 `+0.16`，弓力 `+1.75`；硬度效果：光芒 `+2`，多重射击 `+0.5`；韧性属性：拉弓速度 `-0.4`，弓力 `+1.35`；韧性效果：光芒 `+1.5`，多重射击 `+0.5` |
| `long_stave`（长弩臂） | `crossbow/stave` | 属性：拉弓速度 `+1.4`，弓力 `+2` | 硬度属性：拉弓速度 `+0.27`，弓力 `+1.5`；韧性属性：拉弓速度 `-0.07`，弓力 `+1.05` |
| `recurve_stave`（反曲弩臂） | `crossbow/stave` | 属性：拉弓速度 `+0.75`，弓力 `+0.5` | 硬度属性：拉弓速度 `+0.19`，弓力 `+1.15`；韧性属性：拉弓速度 `-0.12`，弓力 `+0.8` |
| `snipe_stock`（狙击弩座） | `crossbow/stock` | 属性：拉弓速度 `+0.58`，弓力 `+1.5` | 硬度属性：弓力 `+1`；密度属性：拉弓速度 `+0.25`，弓力 `+0.125` |
| `submachine_stock`（连发弩座） | `crossbow/stock` | 属性：拉弓速度 `+0.25` | 硬度属性：拉弓速度 `-0.05`；密度属性：拉弓速度 `+0.12` |

未列入正文的武器模块：依赖当前未安装联动的模块。

当前包还存在一批 MMT 容器/外观/基础结构模块，它们不直接给本次伤害相关属性，或只提供材料失效保护/容器配色，所以不展开收益公式：`mmt_amulet`（护符）的 `dye_item/fabric_envelope/fill_item`（染色/布套/填充物），`mmt_emblem/emblem_ring/base_ring`（徽章底环）与 `blank_emblem`（空白徽章），`mmt_necklace/chain`（项链链条）的三种 chain 和无直接伤害的 `arcane/heart/shield` pendant（奥术/心形/护盾坠饰），`mmt_crown/top/gem`（王冠顶部宝石），`mmt_glove/wristband`（手套腕带）的三种 wristband，`mmt_heart_protecting_mirror/base/hard_base`（坚硬护心镜基底），`mmt_jetpack`（喷气背包）的 shell/battery（外壳/电池），`mmt_white_bag/container/quiver/scabbard`（白色背包/容器/箭袋/剑鞘）的彩虹模块。

## 7. 当前包内材料与 socket 收益

当前已安装相关集成：Alex's Caves、Cataclysm、Ice and Fire、Alex's Mobs、AE2、Create、Dreadsteel、Black Knight Armor、Apotheosis/Apothic Attributes、Curios、Quark、Waystones。下面只列当前包能实际关联到的内容；未安装集成不列。

### 7.1 Socket

| Socket/材料 | 属性 | 效果 | 备注 |
|---|---|---|---|
| `proof_of_victory_rosmontis`（罗丝蒙蒂斯相关 socket） | - | `more_mod_tetra:notes`（记事） | boss/精英独立增伤，样例 `x1.3000`；可能来自副手 |
| `amethyst`（紫水晶碎片） | `reach_distance +0.5`，`attack_range +0.5` | `reaching [6,0.45]` | 攻击/交互距离 |
| `bleak_electron_tube`（黯淡电子管） | `generic.attack_damage +3` | - | 直接白值攻击 |
| `heart_of_ender`（末影之心，实际材料为虚空蠕虫眼） | - | `janking [4,0.05]`（磁力/牵引） | 功能性 |
| `immortal_embryo`（不朽胚胎） | `reach_distance +1`，`attack_range +1` | `tetra:dragon_sinew_loss [1,0]`，洞察 `+5` | 距离和功能性 |
| `precision_mechanism`（精密构件） | `toolEfficiency +2` | 洞察 `+5` | 工具效率/功能性 |
| `pristine_amethyst`（无瑕紫水晶） | `reach_distance +1`，`attack_range +1` | `reaching [9,0.45]` | 高攻击/交互距离 |
| `shards_of_malice`（恶意碎片） | `**generic.attack_damage +0.1` | - | 攻击伤害倍率 |
| `sigil_of_eden`（伊甸印记） | 攻击 `+2` | `criticalStrike [20,2]`（暴击），洞察 `+5` | 暴击和攻击白值 |
| `singularity`（奇点） | `reach_distance +3`，`attack_range +1` | `janking [10,0]`（磁力/牵引） | 较高交互距离 |
| `totem_of_undying`（不死图腾） | 攻击 `+2` | - | 直接白值攻击 |
| `void_worm_eye`（虚空蠕虫眼） | 攻击 `+2`，`reach_distance +1`，`attack_range +1` | `criticalStrike [25,1.5]`，洞察 `+5` | 暴击、攻击、距离都给 |

### 7.2 共享强化与材料

| 来源 | 属性/效果 | 收益 |
|---|---|---|
| `powder_cannon`（火药炮，剑/单头/双头） | `generic.attack_damage +2` | 直接攻击白值 |
| `powder_cannon`（火药炮，弓/弩） | `tetra:draw_strength +2` | 远程伤害/力度 |
| `powder_cannon`（火药炮，盾） | `tetra:ability_damage +2` | 能力伤害 |
| `pristine_diamond`（无瑕钻石） | `**generic.attack_damage +0.1` | 攻击伤害倍率 |
| `pristine_emerald`（无瑕绿宝石） | `criticalStrike [15,1]` | 暴击 |
| `pristine_amethyst`（无瑕紫水晶） | `reach_distance +0.5`，`attack_range +0.5`，`reaching [6,0.25]` | 攻击/交互距离 |
| Ice and Fire dragonsteel（龙钢） | 当前包统一使用 MMT key：`iceandfire_fire/ice/lightning_dragonsteel`，三值为 `primary 10`（硬度）/ `secondary 4`（密度）/ `tertiary 5`（韧性），并保留龙克制/冻结/电击与 MMT 龙钢材料效果 | MMT jar 原值为 `24/4.5/2`，当前已覆盖到包内龙钢曲线 |
| Dreadsteel（恐钢） | `primary 12`（硬度）/ `secondary 4`（密度）/ `tertiary 5`（韧性），三类龙克制 `+9`，`shocking +1`，`frozen +15` | 当前包里硬度较高的材料之一，会明显喂给硬度系数 |
| Cataclysm witherite（凋灵合金相关） | `Witherite B`（凋灵合金增伤日志项） | 一次测试里常见 `+1.0067` 到 `+1.0200` 普通增伤 |

### 7.3 MMT 新增材料给予的效果

这一节列 MMT jar 自带、并且当前包有对应联动基础的材料效果。为了便于阅读，同一批颜色/变体不同但数值一致的材料会归并成一行；未安装联动不列入表内。

| 材料/来源 | 给予的属性 | 给予的效果 | 备注 |
|---|---|---|---|
| `koboleton_bone`（科博勒顿骨，Cataclysm） | - | `bone_fracture +1`（骨折） | 骨类材料 |
| `dragonbone`（龙骨，Ice and Fire） | - | `armorPenetration +10`（固定穿甲） | 基础龙骨 |
| `fire/ice/lightning_dragonbone`（火/冰/雷龙骨，Ice and Fire） | - | `armorPenetration +15`，对应龙血涂层 `+75` | 元素龙骨 |
| `hydra_fang`（九头蛇尖牙，Ice and Fire） | - | `armorPenetration +20`，`poison +1`（中毒） | 穿甲和毒 |
| `sea_serpent_fang`（海蛇尖牙，Ice and Fire） | - | `crushing +2`（破甲/粉碎） | 近战效果 |
| `witherbone`（凋灵骨，Ice and Fire） | - | `wither +1`（凋灵） | 负面状态 |
| `alexscaves_bioluminesscence`（生物荧光，Alex's Caves） | `**generic.attack_damage +0.015` | `attack_glowing_buff +10`（攻击发光增益） | fuller 材料 |
| `alexscaves_ferrouslime_ball`（铁黏液球，Alex's Caves） | `**generic.attack_damage +0.025` | `magnetizing_metal +10`（磁化金属） | fuller 材料 |
| `alexscaves_pewen_sap`（佩文树液，Alex's Caves） | `**generic.attack_damage +0.01` | - | fuller 材料 |
| `alexscaves_toxic_paste`（毒性膏，Alex's Caves） | `**generic.attack_damage +0.01` | `radioactive_material +5`（放射性材料） | fuller 材料 |
| `cataclysm_dying_ember`（将熄余烬，Cataclysm） | `**generic.attack_damage +0.05` | `fire_combo +12`（火焰连段） | fuller 材料 |
| `cataclysm_essence_of_the_storm`（风暴精华，Cataclysm） | `**generic.attack_damage +0.1` | `unceasing_storm +1`（不息风暴），`lightning_combo +5`（雷电连段） | fuller 材料 |
| `iceandfire_*_dragon_blood`（火/冰/雷龙血，Ice and Fire） | `**generic.attack_damage +0.05` | `armorPenetration +20`，对应龙血涂层 `+80` | fuller 材料 |
| `ae2_certus_quartz_crystal`（赛特斯石英，AE2） | - | `industrial_protection +1`（工业防护） | 宝石 |
| `ae2_charged_certus_quartz_crystal`（充能赛特斯石英，AE2） | - | `industrial_protection +1`，`lightning_combo +10` | 宝石 |
| `ae2_fluix_crystal`（福鲁伊克斯水晶，AE2） | - | `industrial_protection +2`，`lightning_combo +15` | 宝石 |
| `occult_gem`（秘法宝石，Alex's Caves） | - | `deep_dark_fantasy +1`（深暗幻想） | 宝石 |
| `pearl`（珍珠，Alex's Caves） | - | `ocean_pearl +1`（海洋珍珠） | 宝石 |
| `uranium`（铀，Alex's Caves） | - | `radioactive_material +1`（放射性材料） | 宝石 |
| `lacrima`（泪滴石，Cataclysm） | - | `tears_of_thunder +20`（雷霆之泪） | 宝石 |
| Quark corundum clusters（刚玉簇，Quark） | 红色：`**generic.max_health +0.1` | 黑：`beheading +20`（斩首）；蓝：`blessings_of_water +7`（水之祝福）；绿：`multishot [4,3]`（多重射击）；靛：`fortune_and_looting +2`（时运/抢夺）；橙：`fire_combo +10`；紫：`dragon_breath_combo +10`（龙息连段）；白：`diamond_guard +4`（钻石守护）；黄：`lightning_combo +10` | 宝石，按颜色分效果 |
| `dreadsteel_ingot`（恐钢锭，Dreadsteel） | `**attack_speed +0.02`，`**attack_damage +0.02`，`**draw_speed -0.02`，`**draw_strength +0.02` | `rising_slash +4`（上挑），`armorPenetration +20` | MMT jar 版本；当前 KubeJS 另有材料三属性覆盖 |
| `iceandfire_*_dragonsteel`（火/冰/雷龙钢，Ice and Fire） | 当前包覆盖为 `10/4/5`，并使用 `heavy/metal` 纹理 | 对应 `*_dragonsteel_material +20`（龙钢材料效果），并合并当前包龙克制/冻结/电击效果 | 已替代 MMT jar 原始 `24/4.5/2`，避免同一龙钢物品存在两套材料曲线 |
| `ae2_silicon`（硅，AE2） | - | `fragile +500`（易碎） | 金属类材料 |
| `abyssal_ocean_ingot`（深渊海洋锭，Alex's Caves） | - | `abyssal_ocean_echo +10`（深渊回声），`into_bubbled +5`（气泡化） | 金属类材料 |
| `alex_floater`（漂浮物，Alex's Caves） | - | `into_bubbled +10`（气泡化） | 金属类材料 |
| `azure/scarlet_neodymium_ingot`（蓝/红钕锭，Alex's Caves） | - | `magnetizing_metal +5`，对应磁极 `+10` | 金属类材料 |
| `alex_candy_cane`（拐杖糖，Alex's Caves） | `**generic.movement_speed +0.15` | - | 移速材料 |
| `alex_tectonic_shard`（构造碎片，Alex's Caves） | - | `lava_mob +7`（熔岩生物） | 金属类材料 |
| `bone_ingot`（骨锭，MMT） | - | `growing +1`（成长） | MMT 基础材料 |
| Cataclysm metals（灾变金属组） | - | `abyssal_ingot`：`abyssal_curse +1`；`ancient_metal_ingot`：`bone_fracture +1`；`black_steel_ingot`：`cataclysm_stun +15`；`cursium_ingot`：`ghost_form +2`、`quickStrike +8`；`ignitium_ingot`：`blazing_brand +1`；`storm_ingot`：`unceasing_storm +1`；`witherite_ingot`：`witherite +10` | 金属类材料 |
| `andesite_alloy`（安山合金，Create） | - | `industrial_protection +1`，`unbreaking +1`（耐久） | Create 材料 |
| `brass_ingot`（黄铜锭，Create） | - | `industrial_protection +2`，`unbreaking +2` | Create 材料 |
| `ghost_ingot`（幽灵锭，Ice and Fire） | `**generic.attack_speed +0.1` | `ghost_sword +50`（幽灵剑） | 攻速材料 |
| `quark_clear_shard`（透明碎片，Quark） | - | `fragile +100`（易碎） | 金属类材料 |
| Dragon scales（龙鳞，Ice and Fire） | `**generic.attack_damage +0.1`，`**tetra:draw_damage +0.1`，`**tetra:ability_damage +0.1` | `armorPenetration +10`，对应火/冰/雷龙血涂层 `+10` | 皮革/外皮材料；不同颜色效果一致 |
| Sea serpent scales（海蛇鳞，Ice and Fire） | `**generic.attack_damage +0.02` | `crushing +5`，`water_power +2`（水力） | 皮革/外皮材料；不同颜色效果一致 |
| `quark_ravager_hide`（劫掠兽皮，Quark） | `generic.armor +1`，`generic.armor_toughness +1` | - | 防御材料 |
| `ae2_fluix_pearl`（福鲁伊克斯珍珠，AE2） | - | `industrial_protection +2`，`janking [8,0]`（磁力/牵引） | Socket |
| `ae2_singularity`（奇点，AE2） | - | `industrial_protection +3`，`the_century_gate +1`（百界门） | Socket |
| Alex's Caves sockets（洞穴 socket 组） | `extinction_core`、`immortal_embryo`：`**attack_damage/draw_damage/ability_damage +0.1` | `extinction_core`：`extinction +12`、`lava_mob +21`；`fissile_core`：`radiation_core +1`；`immortal_embryo`：`underocean +25`、`abyssal_ocean_echo +10`；`radiation_absorption_core`：`radiation_absorption +1`；`telecore`：`radioactive_material +1`、双磁极 `+20` | Socket |
| Cataclysm sockets（灾变 socket 组） | 多数核心给 `**attack_damage/draw_damage/ability_damage +0.1` | `abyssal_core`：`abyssal_finish +1`、`abyssal_curse +2`；`cursium_core`：`over_postmortal +2`、`quickStrike +20`；`harbinger_core`：`analysis +1`、`witherite +2`；`ignitium_core`：`blazing_absorb +6`、`blazing_brand +2`；`storm_core`：`unceasing_storm +2`、`i_am_storm +1`；`void_core`：`cataclysm_stun +30` | Socket |
| Cataclysm sockets（灾变肉/角类） | `blessed_amethyst_crab_meat`、`monstrous_horn` 多带 `**attack_damage/draw_damage/ability_damage +0.1` | `blessing_of_amethyst +1`（紫晶祝福），`monstrous +1`（怪物之力）等 | Socket |
| Ice and Fire sockets（龙心/龙钢核心） | 多数龙心/龙钢核心给 `**attack_damage/draw_damage/ability_damage +0.1` | 龙心给 `armorPenetration +20` 和对应龙血涂层；龙钢核心给对应 `dragonsteel_material +30` 与 `dragon_power +30/50` | Socket |
| `iceandfire_ghost_core`（幽灵核心，Ice and Fire） | `**attack_damage/draw_damage/ability_damage +0.1`，`**attack_speed +0.1` | `ghost_sword +50`，`unlimited_phantasmal_blade_works +1`（无限幻刃） | Socket |
| `hydra_heart`（九头蛇心，Ice and Fire） | - | `undead_hydra [25,45]`（不死九头蛇） | Socket |
| `quark_diamond_heart`（钻石之心，Quark） | `**generic.attack_damage +0.25` | - | Socket 攻击倍率 |
| `waystones_warp_stone`（传送石，Waystones） | `**generic.movement_speed +0.3` | `the_century_gate +1`（百界门） | Socket 移速/传送 |
| Cataclysm white materials（灾变白色材料） | - | `white_cataclysm_abyssal_curse_attack +1`、`white_cataclysm_blazing_brand_attack +1` 等 | 白色背包/容器类材料，主要继承对应灾变攻击触发 |

`createdelight:overwhelm` 来自 KubeJS：

```text
kubejs/server_scripts/Tetra/effect/overwhelm.js
```

核心逻辑：

```js
entity.attack(player.damageSources().generic(), hp(目标生命值) * level(压倒等级) / 100)
```

这不是 MMT 乘区，但它能解释高血量目标上的异常跳数：目标血量越高，追加伤害越明显。

## 8. 可选调整方向

如果后续想压低伤害曲线，可以先观察这些方向：

1. 限制 `duel`（终焉决斗）堆叠。一次测试倒推等级约 27，满层给 `+216%` 普通增伤。
2. 限制 `heavy_chop`（重劈）在高等级时的普通乘区贡献，尤其是无护甲目标。
3. 调整 `torch_the_laws_of_old`（燃尽旧日律法）或给它设置上限，law titan（律法泰坦）等级 50 时曾观察到 `+175%` 普通增伤。
4. 保持泰坦/颂歌直接属性使用 `*`，不要回到 `**`。
5. 对 Curios 伤害类饰品设置更低等级或更少来源，因为它们是独立乘区。
6. 对 `overwhelm`（压倒）加上目标血量上限、boss/假人限制或冷却。
7. 检查副手 Tetra 物品，因为 MMT 很多效果取主手/副手最大等级。

## 10. MMT OP 物品清单

当前包内识别出的过于强力（Overpowered）的 MMT 卷轴与改良，所有数据均来自 `more_mod_tetra-2.4.1-all.jar` 原始文件和 `kubejs/data/tetra/` 覆盖，已交叉验证 schematic + improvement 文件。

### 10.1 锻造技艺卷轴（完整性基础设施）

| 卷轴 | Scroll Key | 生效方式 | 效果 |
|------|-----------|----------|------|
| ~~锻造技艺:稳固Ⅰ~~ | `mmt_settled_scroll` | `crafting_effects/scroll/` 直接施加 | **已禁用**：配方 `forge:false` + crafting_effect 覆盖为 no-op |
| ~~锻造技艺:稳固Ⅱ~~ | `mmt_high_settled_scroll` | 同上 | **已禁用**：配方 `forge:false` + crafting_effect 覆盖为 no-op |
| 锻造技艺:匠魂巧工 | `shared/mmt_more_improvements` | 解锁 `locked` 门 | 解锁 10 种魂匠改良 schematic，每项均为一次性 +1 完整度 |
| 锻造技艺:超凡铭刻 | `shared/mmt_over_improvements` | 解锁 `locked` 门 | 解锁 13 种铭刻 schematic（5 级打磨渐进），见 §10.2 |

**稳固Ⅰ/Ⅱ 配方**：通过 `forge_hammer` 合成台制作。稳固Ⅰ需书与笔+润滑剂分配器+金属碎片×2+排风板。稳固Ⅱ由 2 张稳固Ⅰ无序合成。

**匠魂巧工 解锁的 10 种魂匠改良**（均为一次性 improvement，提供 +1 完整度）：
`amethyst_up`, `echo_shard_up`, `gilded_up`, `draconic_up`, `harmonious_up`, `netherite_up`, `recapitated_up`, `resurrected_up`, `tidelines_up`, `writable_up`

共同条件：`tetra:locked` on `tetra:shared/mmt_more_improvements` + 模块槽位未安装此改良。示意图路径：`schematics/shared/more_mod_tetra/improvement/<key>.json`。

### 10.2 超凡铭刻（over_improvements）13 种铭刻

由 `mmt_over_improvements` 卷轴解锁（配方：书与笔 + 铁剑×2 + 龙腱×2）。**没有 KubeJS 覆盖**，所有数值来自 MMT 原始 jar。全部为 5 级 `hone` 打磨（`experienceFactor: 2`），适用 70+ 武器模块槽位。

| # | Improvement Key | 中文名 | Effect | 5 级数值 | 完整度消耗(L1-L5) | 效果说明 |
|---|---------|--------|--------|---------|---------|---------|
| 1 | `over_slash_up` | 铭刻·斩身 | `more_mod_tetra:over_slash` | 50 | -1,-1,-2,-2,-3 | 对血量 ≥50% 目标增伤（level = 增幅参数） |
| 2 | `ultimate_slash_up` | 铭刻·斩魂 | `more_mod_tetra:ultimate_slash` | 50 | -1,-1,-2,-2,-3 | 对血量 ≤50% 目标增伤 |
| 3 | `rising_slash_up` | 铭刻·斩业 | `more_mod_tetra:rising_slash` | 15 | -1,-1,-2,-2,-3 | 15% 几率附加目标 5% 最大生命值的额外伤害 |
| 4 | `final_slash_up` | 铭刻·斩命 | `more_mod_tetra:final_slash` | 20 | -1,-1,-2,-2,-3 | 目标血量低于 level% 时，追加目标剩余生命值伤害 |
| 5 | `exceed_slash_up` | 铭刻·斩缘 | `more_mod_tetra:exceed_slash` | 10 | -1,-1,-2,-2,-3 | 目标每损失 1% 生命值，额外 +0.1×level% 伤害 |
| 6 | `origin_slash_up` | 铭刻·斩念 | `more_mod_tetra:origin_slash` | 10 | -1,-1,-2,-2,-3 | 目标每有 1% 生命值，额外 +0.1×level% 伤害 |
| 7 | `awakening_slash_up` | 铭刻·斩昔 | `more_mod_tetra:awakening_slash` | 50 | -1,-1,-2,-2,-3 | 追加目标已损失生命值 × level% 的伤害 |
| 8 | `true_slash_up` | 铭刻·斩御 | `more_mod_tetra:true_slash` | 50 | -1,-1,-2,-2,-3 | 追加目标护甲值 × level% 的伤害 |
| 9 | `assassinate_up` | 铭刻·暗杀 | `more_mod_tetra:assassinate` | 500 | -1,-1,-2,-2,-3 | 对满血目标增伤（level = 增幅参数） |
| 10 | `ban_heal_up` | 铭刻·重伤 | `more_mod_tetra:ban_heal` | 5 | -1,-1,-2,-2,-3 | 攻击附加重伤：每级降低目标 20% 生命恢复 |
| 11 | `powerless_up` | 铭刻·无力 | `more_mod_tetra:powerless` | 5 | -1,-1,-2,-2,-3 | 攻击附加无力：每级降低目标 15% 所造成伤害 |
| 12 | `constant_flux_up` | 铭刻·流转 | `more_mod_tetra:constant_flux` | 5 | -1,-1,-2,-2,-3 | 攻击时获得流转 buff：每级 +15% 攻速 |
| 13 | `invulnerable_time_down_up` | 铭刻·破妄 | `more_mod_tetra:invulnerable_time_down` | 25 | **-2,-2,-4,-4,-6** | 减少目标无敌帧 level%（最低 0 秒） |

> **注意**：`defeat_demons_up`（退魔，5 级 200）不在超凡铭刻解锁范围内——它绑定 `mmt_coin_sword` 模块（铜钱剑专精），不需要 `mmt_over_improvements` 卷轴。

**schematic 层级结构**（以 over_slash 为例）：
```
mmt_over_improvements 卷轴
  └── over_slash_up_1 (需 locked 门 + 该改良未安装)
        └── over_slash_up_2 (需 L1 已安装)
              └── ... 至 over_slash_up_5
```
同级 13 种铭刻的 L1 各自独立，L2-L5 链式依赖前一级。

**integrity 总消耗**（13 种全满 5 级）：`13 × 9 = -117` 完整度，破妄额外 `-(6+4+4+2+2) = -18`，总计约 **-135 完整度**。

### 10.3 铭记传说之卷·泰坦十三章

**架构说明**：13 张泰坦卷轴中，仅 11 张拥有完整的 `schematic → improvement` 体系。`strife`（其八）和 `cyrene`（其十三）无独立泰坦 improvement，而是作为"元卷轴"解锁不同的 schematic 体系。

**通用设计**：
- 所有 schematic 配方消耗：8 钻石，expFactor 15
- 适用槽位：sword/blade、greatsword/blade、polearm/head、single/head、double/head_left、bow/stave、crossbow/stave、shield/plate + 70+ MMO 模块化武器槽
- MMT jar 属性：`**generic.attack_speed +0.05`、`**generic.attack_damage +0.05`、`**tetra:draw_speed -0.05`、`**tetra:draw_strength +0.05`
- **KubeJS 覆盖**：全部 11 个 improvement 的 `**` → `*`，并新增 `integrity: -1`。schematic 无覆盖。
- `time`（岁月铭记）卷轴配方在 KubeJS 中被禁用（`forge:false`）

#### 10.3.1 11 张核心泰坦卷轴（有 schematic + improvement）

| # | Key | 中文名 | MMT 效果 | 等级 | 备注 |
|---|-----|--------|----------|------|------|
| 1 | `sky` | 其一·天空指引 | `first_light_heals_the_world`（疗愈世间的晨曦） | 10 | 持有时每 5 秒回血 |
| 2 | `earth` | 其二·大地庇护 | `though_worlds_apart`（纵然山河万程） | 10 | 攻击后按攻击力给伤害吸收 |
| 3 | `ocean` | 其三·海洋回涛 | `sirenic_serenade`（海妖在欢唱） | 10 | 攻击附加负面状态，对负面目标普通增伤 |
| 4 | `romance` | 其四·浪漫相伴 | `invulnerable_time_down`（破妄） | 25 | 降低无敌帧 |
| 5 | `worldbearing` | 其五·负世伟业 | `pyric_corpus`（此身为炬）+ `titan_slayer`（泰坦杀手） | 1000 + 20 | 火种计满 +10.0 普通增伤；Boss 独立乘区 x1.20 |
| 6 | `reason` | 其六·理性启迪 | `everything_is_in_everything` + `experience_edge` | 400 + [25,50] | 经验获取 + 经验之刃 |
| 7 | `trickery` | 其七·诡计赐福 | `jackpot_for_the_taking`（空手套白银） | 1 | 击杀额外战利品 |
| 8 | `death` | 其九·死亡祝佑 | `sanctuary_of_mooncocoon`（月茧之庇） | 5 | 持有时免疫死亡 |
| 9 | `time` | 其十·岁月铭记 | `to_evernights_stars`（致长夜的星光） | 20 | 血量变动增伤/回血（配方已禁用） |
| 10 | `law` | 其十一·律法裁定 | `torch_the_laws_of_old`（燃尽旧日律法） | 50 | 血量差普通增伤（测试 +175%） |
| 11 | `passage` | 其十二·门径祝福 | `the_century_gate`（百界门） | 1 | 战利品远程传送至绑定容器 |

**文件路径**：
- schematic：`data/tetra/schematics/shared/more_mod_tetra/titan/the_legend_scroll_of_<key>_titan_up.json`（MMT jar 内，无 KubeJS 覆盖）
- improvement（jar）：`data/tetra/improvements/shared/titan/the_legend_scroll_of_<key>_titan_up.json`
- improvement（KubeJS）：`kubejs/data/tetra/improvements/shared/titan/the_legend_scroll_of_<key>_titan_up.json`

#### 10.3.2 其八·纷争铸造（strife）—— 元卷轴

**无泰坦 improvement 和 schematic**。此卷轴作为 `locked` 门，解锁 29+ 种武器模块的 `strife_forged` 改良（独立 schematic）：katana、wakizashi、kunai、basic_blade、heavy_blade、machete、short_blade、mmt_ceremonial_sword、mmt_rapier、mmt_twin_blade、cooking_knife、throwing_knife、naginata、spearhead、flanged_mace、wrench、blade_bow + 弓弩变体。

配方：下界合金剑 + 下界合金斧 + 龙腱×2 + 匠魂巧工卷轴。

#### 10.3.3 其十三·真我之诗（cyrene）—— 元卷轴

**无泰坦 improvement 和 schematic**。此卷轴作为 `locked` 门，解锁 14 首颂歌示意图。schematic 配方消耗：2 下界合金锭，expFactor 20。

配方：下界之星×4 + 龙腱×4 + 匠魂巧工卷轴。

#### 10.3.4 Cyrene 颂歌（14 首，由 cyrene 卷轴解锁）

所有颂歌通用属性与泰坦相同（KubeJS 覆盖 `**` → `*`）。12 首需要对应泰坦已安装 + cyrene 锁，2 首仅需 cyrene 锁。

| 颂歌 | 前置条件 | MMT 效果 | 等级 | 备注 |
|------|---------|----------|------|------|
| `ode_to_cyrene` | 仅 cyrene 锁 | `ode_to_cyrene`（固定伤害 `fixed` 段） | 25 | 测试观察 +13.8438 |
| `ode_to_trailblaze` | 仅 cyrene 锁 | `ode_to_trailblaze`（普通增伤） | 20 | 普通增伤 +0.20 |
| `ode_to_sky` | + sky_titan | `first_light_heals_the_world` | 5 | 回血增强 |
| `ode_to_earth` | + earth_titan | `though_worlds_apart` | 5 | 伤害吸收增强 |
| `ode_to_ocean` | + ocean_titan | `sirenic_serenade` | 5 | 负面状态增强 |
| `ode_to_romance` | + romance_titan | `invulnerable_time_down` | 12.5 | 无敌帧削减增强 |
| `ode_to_worldbearing` | + worldbearing_titan | `pyric_corpus` + `titan_slayer` | 500 + 10 | 火种 +5.0，Boss 独立 x1.10 |
| `ode_to_reason` | + reason_titan | `everything_is_in_everything` + `experience_edge` | 400 + [25,0] | 经验增强 |
| `ode_to_trickery` | + trickery_titan | `jackpot_for_the_taking` | 1 | 战利品增强 |
| `ode_to_death` | + death_titan | `sanctuary_of_mooncocoon` | 45 | 更强免死 |
| `ode_to_time` | + time_titan | `to_evernights_stars` | 10 | 血量变动增强 |
| `ode_to_law` | + law_titan | `torch_the_laws_of_old` | 25 | 血量差增伤增强 |
| `ode_to_passage` | + passage_titan | `ode_to_passage` | 15 | 传送增强 |
| `ode_to_strife` | cyrene 锁 + 任意 strife_forged | 无 runtime 效果 | - | 通用属性 4 倍：+0.20/-0.20 |

文件路径：
- schematic：`data/tetra/schematics/shared/more_mod_tetra/cyrene/ode_to_<key>.json`（MMT jar 内，无 KubeJS 覆盖）
- improvement（jar）：`data/tetra/improvements/shared/cyrene/ode_to_<key>.json`
- improvement（KubeJS）：`kubejs/data/tetra/improvements/shared/cyrene/ode_to_<key>.json`

### 10.4 OP 等级汇总

| 等级 | 项目 | 核心 OP 机制 | 验证状态 |
|------|------|-------------|---------|
| **S** | 泰坦 11 卷（全叠加） | 11×(`*` 四属性 + MMT 专属效果)，包括增伤、免死、无敌帧削减、血差增伤、火种 +10.0、Boss 独立 x1.20 | schematic + improvement 已核实 |
| **S** | 超凡铭刻（13 种 × 5 级） | 暗杀满血、斩身高血量 +50、斩魂低血量 +50、破妄 -25% 无敌帧、流转 +75% 攻速 | schematic + improvement 已核实 |
| **A** | Cyrene 颂歌（14 首） | 所有泰坦效果二次放大 + 固定伤害 +25、纷争 4 倍属性 | schematic + improvement 已核实 |
| **A** | 匠魂巧工（10 种魂匠） | 额外完整度，让 S 级物品共存于同一工具 | schematic 已核实 |
| **B** | Strife 铸造（29+ 种 forge） | 对 29+ 种武器模块直接强化 | schematic 已核实 |
| **B** | 稳固Ⅰ/Ⅱ | ~~降低完整度消耗~~ | **已禁用**（见 §10.1） |

### 10.5 相关文件位置索引

| 内容 | MMT jar 原始 | KubeJS 覆盖 |
|------|-------------|------------|
| 泰坦 improvement | `data/tetra/improvements/shared/titan/*_up.json`（11 个） | `kubejs/data/tetra/improvements/shared/titan/`（`**`→`*`+integrity:-1） |
| 泰坦 schematic | `data/tetra/schematics/shared/more_mod_tetra/titan/*_up.json`（11 个） | 无覆盖 |
| Cyrene 颂歌 improvement | `data/tetra/improvements/shared/cyrene/ode_to_*.json`（14 个） | `kubejs/data/tetra/improvements/shared/cyrene/`（`**`→`*`） |
| Cyrene 颂歌 schematic | `data/tetra/schematics/shared/more_mod_tetra/cyrene/ode_to_*.json`（14 个） | 无覆盖 |
| 铭刻 improvement | `data/tetra/improvements/shared/<key>_up.json`（13 个） | 无覆盖 |
| 铭刻 schematic | `data/tetra/schematics/shared/more_mod_tetra/<key>/<key>_up_{1-5}.json`（13 组 × 5） | 无覆盖 |
| 魂匠改良 schematic | `data/tetra/schematics/shared/more_mod_tetra/improvement/<key>.json`（10 个） | 无覆盖 |
| 卷轴 crafting_effects | `data/tetra/crafting_effects/scroll/mmt_settled_scroll.json` 等 | 无覆盖 |
| 泰坦卷轴配方 | `data/tetra/recipes/more_mod_tetra/the_legend_scroll/titan/*.json`（13 个） | `time` 禁用 |
| 锻造技艺配方 | `data/tetra/recipes/more_mod_tetra/forge_hammer/*scroll*.json` | 无覆盖 |

## 9. 快速检索命令

查看 MMT 伤害日志：

```powershell
rg -n "\[CDCore\]\[MMT Damage|from Duel|from Notes|Torch The Laws Of Old|Heavy Chop|Curios Melee" logs/latest.log
```

查模块三类材料系数：

```powershell
rg -n "primaryAttributes|secondaryAttributes|tertiaryAttributes|primaryEffects|secondaryEffects|tertiaryEffects|more_mod_tetra:" kubejs/data/tetra mods -g "*.json"
```

查当前覆盖的泰坦/颂歌：

```powershell
rg -n "more_mod_tetra:|\\*generic|\\*tetra" kubejs/data/tetra/improvements/shared/titan kubejs/data/tetra/improvements/shared/cyrene
```

查当前包 KubeJS 覆盖的 Tetra 模块：

```powershell
rg -n "\"replace\"|primaryAttributes|secondaryAttributes|tertiaryAttributes|effects|attributes" kubejs/data/tetra/modules -g "*.json"
```

查当前包 KubeJS 材料三值：

```powershell
rg -n "\"category\"|\"primary\"|\"secondary\"|\"tertiary\"" kubejs/data/tetra/materials -g "*.json"
```

查 GeoTetraArmor 盔甲模块：

```powershell
rg -n "armor/(head|chest|legs|feet)|generic\\.armor|generic\\.armor_toughness|movement_speed" kubejs/data/tetra/modules/armor kubejs/data/tetra/schematics/armor
```

## 11. chthonic_extractor 跨维度矿物提取 — 待实现设计

日期：2026-07-14 | 状态：**搁置，待未来实现**

### 11.1 源码分析结论

通过反编译 `ChthonicExtractorBlock.class` + `FracturedBedrockTile.class`（Tetra 6.9.0），确认：

- **无硬编码维度限制**：`isBedrock()` 直接比对 `Blocks.BEDROCK`（即 `minecraft:bedrock`），不检查 `Level.dimension()`
- 核心判定链：
  1. 放置目标必须是 `minecraft:bedrock` → `fractured_bedrock`
  2. 裂缝扩张通过 `breakBlock()` → 检查方块是否在 `tetra:extractor_breakable` 标签中
  3. 向下延伸通过 `traceDown()` → 穿透空气寻找更多基岩
  4. 矿石产出从 `data/tetra/loot_tables/extractor/tier{1-4}.json` 战利品表抽取
  5. 生物群系加成通过 `updateLuck()` → 检测群系怪物列表是否有 `husk`/`stray`/`witch`（仅主世界有效）

### 11.2 各维度可行性

| 维度 | 有基岩 | 裂缝可扩张 | 矿石适用性 | 群系加成 | 综合 |
|------|--------|-----------|-----------|---------|------|
| 主世界 | ✅ y=-64~-59 | ✅ 石头/沙砾等 | ✅ 深板岩矿石 | ✅ | 完整 |
| 地狱 | ✅ 天花板y=127 / 地板y=0-4 | ❌ 地狱岩不在 extractor_breakable 标签 | ⚠️ 产出深板岩矿石（画风不搭） | ❌ | 部分可用 |
| 末地 | ⚠️ 仅传送门/黑曜石柱顶端 | ❌ 末地石不在标签 | ⚠️ 同上 | ❌ | 基本不可用 |
| 自定义维度 | ✅ (alexscaves/abyssal_chasm/europa/flat 均有) | ❌ 自定义岩石不在标签 | ⚠️ 同上 | ❌ | 取决于标签配置 |

### 11.3 关键障碍：`extractor_breakable` 标签

当前标签仅含：`#minecraft:sand`、`#minecraft:dirt`、`#forge:gravel`、`#forge:obsidian`、`#forge:ores`、`#forge:stone`、`minecraft:clay` 等。

**缺失**：`#forge:netherrack`、`#forge:end_stones`、以及本包自定义维度的岩石。

### 11.4 实现方案（三选一）

#### 方案 A：仅启用扩张（最简单）
覆写 `kubejs/data/tetra/tags/blocks/extractor_breakable.json`，追加 `#forge:netherrack`、`#forge:end_stones` 及自定义维度岩石标签。裂缝可在对应维度扩张，但产出仍为深板岩矿石。

#### 方案 B：按维度差异化矿石产出（推荐）
覆写 4 级战利品表，使用 `location_check` condition 按维度路由：
```json
{
    "condition": "minecraft:location_check",
    "predicate": { "dimension": "minecraft:the_nether" }
}
```
地狱产出下界石英、下界金矿、远古残骸等；末地产出末地石相关矿物。

#### 方案 C：KubeJS 事件脚本（最灵活）
`kubejs/server_scripts/Tetra/extractor.js` → 监听方块破坏/放置事件，动态修改产出逻辑。

### 11.5 实施步骤（待将来执行）

| 步骤 | 操作 | 文件 |
|------|------|------|
| 1 | 覆写 `extractor_breakable` 标签，添加各维度岩石 | `kubejs/data/tetra/tags/blocks/extractor_breakable.json` |
| 2 | 覆写 4 级战利品表，按 `location_check` 维度条件路由 | `kubejs/data/tetra/loot_tables/extractor/tier{1-4}.json` |
| 3 | 可选：添加维度专属矿石到 `forge:ores/*` 标签 | 在各维度对应 data 目录操作 |
| 4 | 测试地狱天花板放置提取器 + 裂缝扩张 | 游戏内验证 |

### 11.6 关键文件索引

| 文件 | 位置 | 作用 |
|------|------|------|
| extractor_breakable 标签 | `data/tetra/tags/blocks/extractor_breakable.json`（Tetra JAR） | 控制哪些方块可被裂缝破坏 |
| Tier 1-4 战利品表 | `data/tetra/loot_tables/extractor/tier{1-4}.json`（Tetra JAR） | 矿石产出权重表 |
| 主逻辑类 | `se/mickelus/tetra/blocks/forged/chthonic/FracturedBedrockTile.class` | `tick()`/`breakBlock()`/`spawnOre()`/`updateLuck()` |
