---
name: mekanism-integration
description: 在 Create-Delight Remake 新版本中重建通用机械（Mekanism 四件套）深度魔改的设计规范与操作手册。涵盖装包清单、owner 制材料统一、电路/机器阶梯/工厂/升级重铺、Generators 门控、锇铅矿链、AE2 联动、自建配方 Schema 与级联中断防护验证协议；全部代码模板来自已验证的自研实现。
---

# 通用机械深度魔改（自研版重建手册）

本 skill 是设计事实与可重复流程合一的重建手册：在新版本实例上按章节顺序执行，即可复现整套 Mekanism 融合。所有配方 ID 均经 Mekanism 10.4.16.80 JAR 实测；所有代码块为已运行验证的模板原文。

## 〇、前置条件与血泪教训（必读，跳过会全盘翻车）

1. **级联中断（最高优先级）**：`ServerEvents.recipes` 事件中任一脚本抛出未捕获异常，会**中止其后所有监听器**——监听器按文件系统目录序执行（macOS APFS 为创建序，新文件永远排在后面）。症状：`Loaded script` 正常、无报错、但修改全部不生效。**开工前必须让 `logs/kubejs/server.log` 的配方事件 ERROR 归零**。历史根因：`mbd2_recipes/alloy_electric_furnace.js` 的 `e.recipes.createdelight` undefined——由 `kubejs/data` 未随脚本同步（943 vs 2094 的缺口）导致 MBD2 机器数据缺失。**教训：同步脚本时必须整树同步 `kubejs/`（含 data/）**。
2. **KubeJS 锁 build.24**（`kubejs-forge-2001.6.5-build.24.jar`，file-id 8010958）。不要用 build.16（行为异常）与 build.26（食物属性回归，#2131）。
3. **macOS 实例专属**：包内 `acceleratedrendering` 声明要求 OpenGL ≥4.6，mac 上限 4.1 → 启动即崩（NoChatReports NPE 连锁）。处理：移入 `disabled-mods-mac/`。全 mods 扫描 `unzip -p <jar> META-INF/mods.toml | grep -E "^\[features\."` 确认无其他未注释的 OpenGL 声明。
4. **「Loaded script ≠ 执行成功」**：加载日志只证明扫描与解析。生效验证必须走 §九 的探针协议。
5. **ID 实测纪律**：所有 Mek 配方 ID 以 JAR 内 `data/mekanism/recipes/` 路径为准（`unzip -l Mekanism-1.20.1-10.4.16.80.jar | grep <关键词>`），不凭记忆拼写。删除用包内 `remove_recipes_id(e, [...])`，禁止裸 `e.remove()`。
6. **注册类改动需重启**：startup 注册物（过渡物等）改后必须完整重启，`/kubejs reload server_scripts` 不重建注册表。

## 一、装包清单

| 模组 | 版本 | side | 说明 |
|---|---|---|---|
| Mekanism | 1.20.1-10.4.16.80 | both | 本体（file 6552911） |
| Mekanism Generators | 同版本号 | both | 发电与核工业（6552914） |
| Mekanism Tools | 同版本号 | both | 材料消费出口（6552915） |
| Mekanism Additions | 同版本号 | both | 塑料/小生物（6552913） |
| Applied Mekanistics | 1.4.3 | both | AE2 存化学品（§七深绑） |
| JustEnough Mekanism Multiblocks | 4.10 | client | JEI 看多方块 |
| mekanismcurios | 1.2.1 | both | 饰品栏 |
| ~~KubeJS Mekanism UNOFFICIAL~~ | — | — | **不装**，用 §六自建 Schema 替代 |

四件套版本号必须一致。装包走 `add-packwiz-target.ps1`；首版 `stable = false`。

**矿生配置**（`defaultconfigs/Mekanism/world.toml`，键名经 Mekanism 1.20.x `WorldConfig.java` 核实）：

| 矿 | 配置 |
|---|---|
| 锡 tin | `shouldGenerate = false`（包内 createdelightcore 是唯一来源） |
| 铀 uranium | `shouldGenerate = false`（alexscaves 链唯一来源） |
| 盐 salt | `shouldGenerate = false` |
| 锇 osmium | 默认（upper 65 / middle 6 / small 8） |
| 铅 lead | 默认（normal 8） |
| 萤石 fluorite | 默认（normal 5 / buried 3） |

结构：`[world_generation.<ore>]` 下 `shouldGenerate`，矿脉子节 `[world_generation.<ore>.<small|middle|large|upper|buried|normal>]` 下 `perChunk/maxVeinSize/shouldGenerate`。10.4 的放置器带 `mekanism:disableable`，配置关闭即生效，无需数据包覆盖。

## 二、材料统一（owner 制 + 1:1 互转）

**理念**：包内已有金属保持 owner 地位，通过 forge 标签喂给 Mek 配方；同时提供 1:1 无序互转保证玩家存量 Mek 物品不废。不用 replaceOutput（保留 Mek 物品流通性、JEI 透明）。

| 金属 | owner | Mek 侧处理 |
|---|---|---|
| 青铜 | `createdelightcore:bronze_ingot` | 互转配方双向 |
| 钢 | `createmetallurgy:steel_ingot` | **全链退役**（§二.3），不设互转 |
| 锡 | `createdelightcore:tin_ingot` / `createdelight:tin_dust` | 锭/粉互转（Mek 锡无生成来源，仅作机器产物形态回收） |
| 铀 | `alexscaves:uranium` | 单向：alexscaves 铀 → Mek 铀锭（供裂变燃料链取料） |
| 锇/铅 | `mekanism`（raw/ingot/dust 全系） | 完整双链接入（§七.2） |

**tags.js**（`server_scripts/Mekanism/tags.js`）：

```js
ServerEvents.tags("minecraft:item", e => {
    // 锡：包内是唯一来源，挂入常规标签驱动 Mek 青铜等配方
    e.add("forge:ingots/tin", ["createdelightcore:tin_ingot"])
    e.add("forge:nuggets/tin", ["createdelightcore:tin_nugget"])
    e.add("forge:storage_blocks/tin", ["createdelightcore:tin_block"])
    e.add("forge:raw_materials/tin", ["createdelightcore:raw_tin"])
    e.add("forge:raw_material_blocks/tin", ["createdelightcore:raw_tin_block"])
    e.add("forge:ores/tin", ["createdelightcore:tin_ore", "createdelightcore:deepslate_tin_ore"])
    // createdelight:tin_dust 已在注册时挂 forge:dusts/tin，无需重复
    // 青铜：owner createdelightcore
    e.add("forge:ingots/bronze", ["createdelightcore:bronze_ingot"])
    // 钢：owner createmetallurgy
    e.add("forge:ingots/steel", ["createmetallurgy:steel_ingot"])
    // 铀：alexscaves 已挂 forge:ingots/uranium，Mek 铀锭由模组自挂，三向互通
})
```

**unification.js**（互转层）：

```js
ServerEvents.recipes(e => {
    // 青铜双向
    e.recipes.kubejs.shapeless("createdelightcore:bronze_ingot", "mekanism:ingot_bronze")
        .id("createdelight:crafting/mekanism/mek_bronze_2_bronze")
    e.recipes.kubejs.shapeless("mekanism:ingot_bronze", "createdelightcore:bronze_ingot")
        .id("createdelight:crafting/mekanism/bronze_2_mek_bronze")
    // 锡（锭+粉）
    e.recipes.kubejs.shapeless("createdelightcore:tin_ingot", "mekanism:ingot_tin")
        .id("createdelight:crafting/mekanism/mek_tin_2_tin")
    e.recipes.kubejs.shapeless("createdelight:tin_dust", "mekanism:dust_tin")
        .id("createdelight:crafting/mekanism/mek_tin_dust_2_tin_dust")
    // 铀单向
    e.recipes.kubejs.shapeless("mekanism:ingot_uranium", "alexscaves:uranium")
        .id("createdelight:crafting/mekanism/uranium_2_mek_uranium")
})
```

**steel_retire.js**（Mek 钢退役——掐断全部生产）：

```js
ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "mekanism:processing/steel/enriched_iron_to_dust",   // 钢的诞生点（富集铁→钢粉）
        "mekanism:processing/steel/ingot/from_block",
        "mekanism:processing/steel/ingot/from_dust_blasting",
        "mekanism:processing/steel/ingot/from_dust_smelting",
        "mekanism:processing/steel/ingot/from_nuggets",
        "mekanism:processing/steel/ingot_to_dust"
    ])
})
```

## 三、控制电路四级（进度脊柱）

电路是全部 Mek 机器/工厂/QIO 的核心耗材，等级梯度即进度门控；高阶绑定 Create 机械合成与 Northstar。

```js
ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "mekanism:control_circuit/basic", "mekanism:control_circuit/advanced",
        "mekanism:control_circuit/elite", "mekanism:control_circuit/ultimate"
    ])
    // 基础：黄铜 + 电子管 + 红石（工作台）
    e.recipes.kubejs.shaped("2x mekanism:basic_control_circuit", ["RBR","BAB","RBR"], {
        R: "minecraft:redstone", B: "create:brass_ingot", A: "create:electron_tube"
    }).id("createdelight:crafting/mekanism/basic_control_circuit")
    // 进阶：精密机构 + 注入合金 + CCA 电容
    e.recipes.kubejs.shaped("2x mekanism:advanced_control_circuit", ["IPI","PAP","IPI"], {
        I: "mekanism:alloy_infused", P: "create:precision_mechanism", A: "createaddition:capacitor"
    }).id("createdelight:crafting/mekanism/advanced_control_circuit")
    // 精英：4x4 机械合成（northstar 电路 + 强化合金 + 电子管）
    e.recipes.create.mechanical_crafting("2x mekanism:elite_control_circuit", ["IRRI","REER","REER","IRRI"], {
        I: "northstar:circuit", R: "mekanism:alloy_reinforced", E: "create:electron_tube"
    }).id("createdelight:mechanical_crafting/mekanism/elite_control_circuit")
    // 终极：5x5 机械合成（高级电路 + 原子合金 + 钨 + 精密机构 + 电容）
    e.recipes.create.mechanical_crafting("2x mekanism:ultimate_control_circuit", ["IAAAI","ATPTA","APCPA","ATPTA","IAAAI"], {
        I: "northstar:advanced_circuit", A: "mekanism:alloy_atomic",
        T: "createmetallurgy:tungsten_ingot", P: "create:precision_mechanism",
        C: "createaddition:capacitor"
    }).id("createdelight:mechanical_crafting/mekanism/ultimate_control_circuit")
})
```

## 四、机器阶梯（machine_tiers.js）

**关键认知**：Mek 机器的等级存在方块 NBT 中，高阶机器不是独立物品——**升级唯一途径是等级安装器（tier_installer）**，因此安装器配方是整个阶梯的核心，做成 Create 序列装配。

三档模板（统一 `basic_machine` / `chemical_machine` / `late_machine` 函数 + 风味核心材料）：

| 档 | 机器（9/8/2 台） | 模板材料 | 风味核心 |
|---|---|---|---|
| 基础 | enrichment_chamber / crusher / energized_smelter / precision_sawmill / osmium_compressor / combiner / metallurgic_infuser / purification_chamber / chemical_injection_chamber | 安山合金 + 铜板 + 基础电路 + 安山机壳（AUA/PCP/AKA） | 铁/铜/木板/锇/圆石/红石/铅/锇 |
| 化学 | electrolytic_separator / chemical_infuser / chemical_oxidizer / chemical_dissolution_chamber / chemical_washer / chemical_crystallizer / rotary_condensentrator / pressurized_reaction_chamber | 黄铜 + 黄铜机壳 + 进阶电路（PUP/BCB/PUP） | 铜线卷/加压管/硫粉/玻璃/流体罐/玫瑰石英/机械泵/螺旋桨 |
| 后阶 | isotopic_centrifuge / solar_neutron_activator | 冶金钢 + 精英电路（SXS/XCX/SXS） | 强化合金 / CCA 电容 |

**删除注意**：Mek 机器配方是 `mekanism:mek_data` 类型，必须按精确 ID 删除（`remove_recipes_id` + `mekanism:<机器名>`，JAR 路径 `recipes/<机器名>.json` 已逐一核实）。

**等级安装器**（四级全部序列装配；过渡物 `createdelight:incomplete_tier_installer`）：

```js
function tier_installer(installer, circuit, bond) {
    let iner = "createdelight:incomplete_tier_installer"
    e.recipes.create.sequenced_assembly(installer, "create:iron_sheet", [
        e.recipes.create.deploying(iner, [iner, circuit]),
        e.recipes.create.pressing(iner, iner),
        e.recipes.create.deploying(iner, [iner, bond])
    ]).transitionalItem(iner).loops(1)
        .id(`createdelight:sequenced_assembly/${installer.split(":")[1]}`)
}
tier_installer("mekanism:basic_tier_installer",    "mekanism:basic_control_circuit",    "create:andesite_alloy")
tier_installer("mekanism:advanced_tier_installer", "mekanism:advanced_control_circuit", "create:brass_ingot")
tier_installer("mekanism:elite_tier_installer",    "mekanism:elite_control_circuit",    "createmetallurgy:steel_ingot")
tier_installer("mekanism:ultimate_tier_installer", "mekanism:ultimate_control_circuit", "createmetallurgy:tungsten_ingot")
```

（删除原版：`mekanism:tier_installer/{basic,advanced,elite,ultimate}`。）

## 五、工厂与升级

**factories.js**——9 种工厂类型（smelting/enriching/crushing/sawing/compressing/combining/infusing/purifying/injecting）× 4 等级全部序列装配，叙事"单机上装配线，机械手逐步加装"。**低阶工厂是高阶的装配基底**（渐进链）：

```js
// 基础工厂：单机为基底 + 2 单机 + 2 精密机构 + 2 HDPE 板（6 步部署）
// 进阶工厂：基础工厂为基底 + 2 进阶电路 + 黄铜机壳 + HDPE 板
// 精英/终极：同模式，基底与阶位材料递进【按模板补全】
let iner = "createdelight:incomplete_factory"
// 删除：mekanism:factory/{basic,advanced,elite,ultimate}/{九类型}（Rhino 无 flatMap，双循环拼数组）
```

**upgrades.js**——选择性 Create 化（只改影响平衡的）：

| 升级 | 处理 | 新配方核心 |
|---|---|---|
| speed | 重铺 | 锇锭 + **Create 齿轮** + 红石（动力学超频） |
| energy | 重铺 | 电子管 + **CCA 电容** + 铜线卷（与包内 FE 体系同源） |
| gas | 重铺 | 铅锭 + 加压管 + HDPE 板 |
| filter | 重铺 | 纸 + **Create 过滤网** + 锇锭（接包内造纸链） |
| muffling / anchor / stone_generator | **保留原版** | 纯 QoL，无平衡影响 |

### 装备门槛（gear_gating.js，范围化 replaceInput 不重排配方）

| 对象 | 门槛 |
|---|---|
| jetpack 模块 | mekanism:jetpack → `northstar:lunar_sapphire_shard`（飞行=星际特权） |
| electrolytic_breathing 模块 | 电解芯 → `createdelight:sturdy_oxygen_tank`（制氧=北极星终点） |
| gravitational_modulating 模块 | 下界之星 → `alexscaves:occult_gem`（反重力=深渊） |
| locomotive_boosting 模块 | 钻石护腿 → `northstar:advanced_circuit`（速度=星际科技） |
| hydraulic_propulsion 模块 | 自由跑鞋 → `#forge:spring/between_500_2_1000`（跳跃=Create 高阶弹簧） |
| vision_enhancement 模块 | 绿宝石 → 望远镜 |
| magnetic_attraction 模块 | 铁栏杆 → `alexscaves:magnetron`（磁吸=磁洞） |
| attack_amplification 模块 | 铁剑 → `iceandfire:dragonbone`（伤害=屠龙） |
| radiation_shielding 模块 | 不改（原版即铅块门槛） |
| MekaTool | 原子分解器 → `#more_mod_tetra:over_core`（与命定之门同源）+ 外壳冶金钢 |
| MekaSuit 本体 ×4 | 外壳→冶金钢、精炼萤石→深渊宝珠 |
| Mekanism Tools 全装备 | `remove_recipes_mod(e, ["mekanismtools"])` 断获取（配合客户端 JEI 隐藏） |

## 六、@recipes Schema 自建（替代 KubeJS Mekanism 插件）

**版本耦合警告**：`@recipes/` 的 Schema API 由同目录 `prelude.js` 定义，**新旧两版 API 不兼容**。新版语法（`complexKey` 回调收 `k.addKey(...)`）在旧版 prelude 上会在 `StartupEvents.recipeSchemaRegistry` 阶段抛 "Cannot convert ... to RecipeKey[]"，且**中断 forEach 后续全部 schema 注册**（createmetallurgy/createdieselgenerators 等陪葬）并穿透到 FML loadComplete。**旧版实例（如 v0.5.0.7-test zip）上直接省略 mekanism Schema 文件**——当前全部脚本用 `e.recipes.kubejs.*` / `e.recipes.create.*` / `e.recipes.vintageimprovements.*` / `event.custom()`，对 `e.recipes.mekanism.*` 零依赖。仅在实例已整体同步新版 kubejs 树（含新 prelude）时才部署下面的 Schema：

```js
new Schema("mekanism:crushing")
    .complexKey("input", true, k => k.addKey("ingredient", "inputItem"))
    .simpleKey("output", "outputItem")
new Schema("mekanism:enriching")  // 同构
new Schema("mekanism:smelting")   // 同构
new Schema("mekanism:sawing")
    .complexKey("input", true, k => k.addKey("ingredient", "inputItem"))
    .simpleKey("mainOutput", "outputItem")
    .simpleKey("secondaryOutput", "outputItem", null)
new Schema("mekanism:combining")
    .complexKey("mainInput", true, k => k.addKey("ingredient", "inputItem"))
    .complexKey("extraInput", true, k => k.addKey("ingredient", "inputItem"))
    .simpleKey("output", "outputItem")
new Schema("mekanism:energy_conversion")
    .complexKey("input", true, k => k.addKey("ingredient", "inputItem"))
    .simpleKey("output", "doubleNumber")   // 输出为数值（J）
```

## 七、Generators 门控、矿链与跨模组联动

### 7.1 generators.js（只门控"改变游戏节奏"的设备，常规发电机保持原版）

| 设备 | 门控设计 |
|---|---|
| 燃气发电机 | 冶金钢+铜板+进阶电路+CCA 电容+黄铜机壳（乙烯链发电核心） |
| **数字矿机** | **5×5 机械合成，核心槽 = `createoreexcavation:extractor`（COE 提取器是它的原型机——叙事门控）** + 精英电路 + HDPE + 钢机壳 |
| QIO 全家（dashboard/drive_array/importer/exporter/redstone_adapter/portable） | 绑 AE2：仪表盘=基础电路+精密机构；驱动阵列=机械合成+进阶电路+逻辑处理器系【按模板补全】 |
| 聚变控制器 | 终局门槛，机械合成【按模板补全】 |
| 裂变端口 + SPS 端口 | 核体系分阶段门槛，机械合成【按模板补全】 |

### 7.2 矿链（锇/铅进包内冶金体系）

- **ore_processing.js**：氟石 `crushing_ore(e, "mekanism:fluorite_ore", "mekanism:fluorite_gem", 5, "minecraft:cobblestone")`（Create 链 5+副产 vs Mek 原生 5-6 宝石）。
- **Create Ore/recipes.js 扩展**：主世界金属矿簇破碎/振动产物加入 `create:crushed_raw_osmium/lead/uranium` 与 `mekanism:raw_osmium/raw_lead`（withChance 0.25-0.5）；贵金属矿簇加 `mekanism:fluorite_gem`——**锇/铅/铀/氟石并入数字矿机矿簇产物**（保留原配方 id 避免重复注册）。
- **Custom/metal/osmium.js + lead.js**（完整双链模板）：

```js
ServerEvents.recipes(e => {
    // 副产物：锇矿石伴生青金石（铅：伴生硫 0.5）
    byProductMap.set("mekanism:dust_osmium", ["minecraft:lapis_lazuli", 0.4])
    // Create 湿法洗练链：脏粉→粉→粉碎矿→粗矿→粒（粉碎矿用 Create 6 自带物品）
    metal_production_line_5(e, [
        "mekanism:dirty_dust_osmium", "mekanism:dust_osmium",
        "create:crushed_raw_osmium", "mekanism:raw_osmium", "mekanism:nugget_osmium"
    ])
    // 冶金热熔链：锇块/锭 ↔ 熔融锇（解锁 createmetallurgy:molten_osmium）
    metal_production_line_7(e, ["mekanism:block_osmium", "mekanism:ingot_osmium",
        "createmetallurgy:molten_osmium"], "heated", 80)
})
```

### 7.3 chemical_chain.js（农业盈余直通乙烯链）

Mek 原生已有 100+ 原版物品→生物燃料的粉碎配方；补包内自创作物与 FD 食材（adzuki_beans_seed / artemisia_argyi_seed / rice / tomato），`event.custom({type:"mekanism:crushing", ...})` 出 `mekanism:bio_fuel` ×2。

### 7.4 Applied Mekanistics 深绑（对齐 AE2 章 processor&cellcasing.js 风格）

- 化学品元件外壳：删 `appmek:chemical_cell_housing`，锇锭走 **VI 压弯**（复用包内 `createdelight:cell_housing_curving_head`，与 AE2 元件外壳同一产线）。
- 化学品存储元件五级（1k-256k）：删原版，shaped `QCQ/CHC/QCQ`（赛特斯石英粉 + 对应级 Mek 电路：1k/4k=基础、16k=进阶、64k=精英、256k=终极 + 外壳）。
- 便携元件：对应元件 + HDPE + 能量平板 + 进阶电路。

### 7.5 经济接入

- unified_loot 科技池：tier1 加锇锭/基础电路，tier2 加进阶电路/氟石/alexscaves 铀。
- `startup/custom/value_data.js` 采矿价值源：`raw_osmium: 3`、`raw_lead: 3`、`fluorite_gem: 2`（价值经配方链自动传导至粉/锭/电路/塑料）。

## 八、客户端脚本

- **info_mekanism.js**：JEI 信息页照包内三元组规范（key + zh + en 同步挂语言）。覆盖物品：等级安装器（右键原地升级说明）、数字矿机（COE 原型机叙事 + 半径/精准/回填）、盖革计数器（辐射机制与 `/mek radiation cure`）、化学品元件外壳。
- **mekanism_tools_hide.js**：`JEIEvents.hideItems` 隐藏 Mekanism Tools 全部装备（6 材质 × 11 类：sword/pickaxe/axe/shovel/hoe/paxel/shield/四件甲 + 原版材质多用镐 6 件）与 Mek 钢系列 + 富集铁（已退役无获取途径）；**材料物品（锇/青铜/精炼黑曜石/精炼萤石锭等）保留**。

## 九、验证协议（级联防护，每阶段收尾必跑）

1. **静态**：`node --check` 全部新脚本；删除 ID 逐一对照 JAR 路径。
2. **开工前置门槛**：进一次世界后配方事件 ERROR 数必须为 **0**（alloy 教训——一个错误杀死排序在其后的所有脚本）。
3. **日志铁律**：KubeJS 的 `server.log` 在初次加载时**不完整**（它自己会警告），配方事件的真实输出（含探针异常与 Added/removed 统计）在 **`logs/latest.log`**——取证一律读 latest.log。
4. **探针法**（验证「执行」而非「加载」）：投掷型探针读配方管理器状态。两条铁律：
   - **探针文件必须在所有目标脚本之后创建**——监听器按 APFS 创建序执行，探针先创建就会先执行、读到修改前的假象（本项目曾因此误判整晚）；
   - 事件中途 `forEachRecipe` 只能查到"删除"效果（原版残留=0 ✓），**查不到刚添加的配方**——新增配方以游戏内 JEI 实见为准。模板：

```js
ServerEvents.recipes(e => {
    let n = 0
    e.forEachRecipe({ id: "mekanism:upgrade/speed" }, r => n++)
    throw new Error("PROBE 原版速度升级残留=" + n)
})
```

5. **JEI 三点抽检**（世界内，非标题界面）：速度升级=锇锭+齿轮+红石；基础控制电路=黄铜+电子管；粉碎机=安山合金机壳模板。
6. **数字对比**：健康基线为 Added≈2000+/removed≈1000+（本实例实测 2035/1020）；若骤降到几百级（如 616/287）= 存在级联死区。
7. 探针用后即删。

## 十、边界与后续项

- 装备门槛（§五 gear_gating.js）已实现；剩余后续项仅 OED 数值审查。
- 不用 hotai 补 Mek；能配置/配方解决的不上字节码，确需算法级改造再评估 CDC 可选依赖。
- **版本升级核对单**：四件套同步升版本 → 重跑 §一矿生配置 diff → §〇.5 全 ID 走查 → §九全协议 → Crash Assistant 基线重建。
- 同步脚本到实例时**必须整树同步 `kubejs/`（含 `data/`）**，脚本与数据分离是级联中断的历史根因。
