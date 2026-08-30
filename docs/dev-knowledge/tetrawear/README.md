# Tetrawear 模块化护甲接入

本文记录官方 Tetra 护甲附属 Tetrawear 的实际 JAR 内容、整合包覆盖和从 GeoTetraArmor 迁移时的边界。当前结论基于 `tetrawear-1.20.1-1.0.0.jar`、Tetra `6.17.0` 与 Mutil `6.3.0` 的静态检查。

## 版本与分发

- 模组标识：`tetrawear`。
- 官方作者：Mickelus。
- 适用游戏版本：Minecraft `[1.20.1,1.21)`。
- 模组加载器要求：Forge `[47,)`。
- 核心依赖版本：Tetra `[6.17.0,)`，Mutil `[6.3.0,)`。
- CurseForge 项目：project `670545`，file `8570793`。
- Modrinth 项目：project `UsT8b7aC`。
- 许可证类型：ARR。
- 文件校验值：SHA-256 为 `5D85E73AC10573D2454BECE84CFAF418A00D72E6A9EA9700B49E3ED23F237DD0`。

项目页允许通过 CurseForge 或 Modrinth 将原版文件加入整合包，也允许用 datapack/KubeJS 做数据集成；ARR 不等于允许重分发修改版 JAR，因此当前包只分发上游原文件。整合包保留 Tetrawear 官方模块、方案与数值，仅用 KubeJS 补充本地化和材料效果调用。

## 内容规模

JAR 内包含 4 个模块化护甲物品、35 个模块定义、81 个 improvements、326 个 schematics、5 个 replacements 和 4 个原生全息球入口。

| 物品 | 模块槽位 |
|---|---|
| `tetrawear:modular_helmet` | `helmet/lining`、`helmet/cover`、`helmet/attachment` |
| `tetrawear:modular_chest` | `chest/inner`、`chest/outer`、`chest/arms` |
| `tetrawear:modular_leggings` | `leggings/lining`、`leggings/cover`、`leggings/attachment` |
| `tetrawear:modular_boots` | `boots/lining`、`boots/body`、`boots/sole`、`boots/attachment` |

`data/tetra/replacements/armor/` 会在原版头盔、胸甲、护腿、靴子或鞘翅放入 Tetra 工作台时转换为对应模块化护甲。该替换只处理原版物品，不会把已有 GeoTetraArmor 装备自动转换为 Tetrawear；移除 Geo 前应提醒玩家自行拆解或更换旧装备。

主要结构模块包括内衬、cap/sallet、cuirass、shoulderguards、heavy shoulderguards、legplates、heavy legplates、plate body、sole、armwraps、guise、shroud、lacing 和 harness。护甲支持染色、盔甲纹饰与 honing，并提供以下原生系统：

- 能量值、攻击/挖掘/格挡/物品使用消耗与恢复。
- 双击方向键闪避，并由 agility、闪避强度和能量消耗共同约束。
- 温度、寒冷/炎热状态与相关能量倍率。
- 潜行、黑暗和生物朝向相关的侦测范围与 stealth。
- 重型肩甲和重型腿甲的高防御、低 agility 取舍。

服务端配置覆盖 energy、temperature、dodge、stealth、四部位 honing 与穿戴行为；客户端配置覆盖能量条、温度条位置及闪避双击间隔。默认 `systems.opt_in_features = false`，即启用的全局系统不要求玩家必须穿模块化护甲，调整服务器配置时要特别复核这一点。

## 全息球与本地化

Tetrawear 自带以下原生入口：

```text
assets/tetra/holosphere_entries/helmet.json
assets/tetra/holosphere_entries/chest.json
assets/tetra/holosphere_entries/leggings.json
assets/tetra/holosphere_entries/boots.json
```

整合包不再覆盖这四个路径。旧 Geo 文件中的 `chest.json` 会覆盖同名官方入口并引用不存在的物品，因此已全部删除。JAR 只有 `assets/tetrawear/lang/en_us.json`，当前尚未补充完整 `zh_cn`。

## 官方模块与迁移边界

GeoTetraArmor 的九部件结构不能与 Tetrawear 一一对应，因此整合包不再迁移旧 Geo 的护甲、韧性或移动速度换算。`sallet`、`cuirass`、`shoulderguards`、`heavy shoulderguards`、`legplates`、`heavy legplates` 和 `plate body` 均直接使用 Tetrawear JAR 自带的数据。

材料的 `primary / secondary / tertiary` 仍会按官方模块定义换算为防御属性；重甲代价也完全交给官方 `tetrawear:agility`、energy、dodge 与 honing 系统。`kubejs/data/tetra/modules/armor/` 和 `kubejs/data/tetra/schematics/armor/` 不保留用于复刻 Geo 数值的同路径覆盖。

## 效果汇总与材料上下文

Tetrawear 的 `se.mickelus.tetrawear.util.ArmorHelper#getArmorEffects` 会遍历实体的四个装备栏，只汇总 `ModularArmor` 的 `EffectData`。KubeJS 的 `TetraUtil.getArmorEffectLevel` 直接调用该官方 API，不再依赖 Geo 的 `ArmorEffectUtil`。

Tetrawear 没有 GeoTetraArmor 的材料 `contexts.armor`、`armor_head`、`armor_chest`、`armor_legs` 或 `armor_feet` 解析。JAR 中 stat bar JSON 的 `contexts` 仅控制属性栏显示在工作台或全息球，不是材料上下文。Tetra `6.17` 的 `MaterialData` 也不再声明或反序列化旧 `contexts` 字段，因此整合包已删除这些无效数据。

根级已经存在的 `solar_guard`、`ghoststeel`、mana regeneration/repair 和 diamond guard 等效果会被 Tetrawear 正常汇总。以下 Geo/MMT 遗留行为不再模拟，改以 Tetrawear 原生护甲构筑为主：

- 三系龙钢的护甲专属 thorns 与 `armor_last_stand`。
- Cursium 四部位效果和 Cursium/Ignitium 的护甲专属击退抗性。
- Ignitium 的 `ignitium_suit` 护甲上下文效果。
- Botania/Extrabotany 材料仅在护甲上的额外暴击率与暴击伤害。

不要把这些属性机械移动到材料根级，否则同材料武器也会获得护甲专属属性；也不要为此重新实现一套 Geo 上下文模拟，除非后续有明确玩法需求和独立平衡设计。

## 精力、完整度与 Apotheosis 叠加

以下分析基于当前实际安装的 Tetrawear `1.0.0`、Tetra `6.17.0`、Apotheosis `7.4.8`、Placebo `8.6.3`、Apothic Attributes `1.3.7`，以及世界配置 `saves/新的世界 (2)/serverconfig/tetrawear-server.toml`。当前运行目录没有 Fallen Gems & Affixes，因此这里只计算原生 Apotheosis 词缀和宝石，不把 Fallen 的额外宝石强度、套装词缀和 Fabled 数值混入结论。

### 结论

Tetrawear 与 Apotheosis 叠加后确实存在明显问题，而且不只是“神化补的护甲高于护甲模块本身”这一条：

- 实际最高精力构筑不是完全裸模块，而是保留 ravager hide 轻甲和丝质 underpants：`40 agility / 4.0 energy`，同时仍有 `10.2 armor / 4 toughness`。除轻型 cover/body 外，肩甲、重腿、鞋底、附件等槽位可以继续留空。
- 完整度会阻止胸甲把所有 improvement 和所有 honing 同时堆满；但 `+9` 胸甲预算仍足以容纳多个危险组合，例如龙鳞 armwrap、Ghost Ingot reinforced/vambraces/stabilizers 与伤害 honing 8 恰好用完 9 点。
- More Mod Tetra 的 Ghost Ingot 把 `+10% generic.attack_speed` 放在材料根级。它每被一个护甲模块或 improvement 使用一次就再次进入属性合并，重腿和重肩的零完整度 trim 也能再带入一次，因此它不是单个模块强，而是“材料使用次数”越多越强。
- Apotheosis 的固定护甲、韧性和 Guardian 孔位不消耗 Tetrawear 完整度，也不降低 agility 或精力伤害。最高精力轻甲在 Ancient 双防词缀、期望 Guardian 孔和 Royalty 下可达到约 `93.61 / 32.20`；十颗 Guardian 上限时约 `126.73 / 32.20`。
- Royalty 实际是头盔宝石，不是词缀。Ancient Royalty 会同时把 `generic.attack_damage`、`generic.attack_speed`、护甲和韧性乘 `1.15`；它既提高 Ghost 构筑 DPS，又因为最终攻速更高而降低 Tetrawear 每击耗能。
- 弓箭还有一个独立的数据方向问题：Tetra `6.17` 的 `tetra:draw_speed` 是“拉弓时长倍率”，数值越低越快。Tetrawear bracers 和“拉弓速度” honing 却给正值，实际会延长拉弓时间。此前把 paper 的正值直接解释为射速提升是错误的。

因此，Apotheosis 会显著压缩轻甲/输出流与重甲/生存流的差距；Ghost Ingot 和 Royalty 还会把问题从“低甲高伤”扩大为“中高甲、高攻速、高精力伤害、低耗能”同时成立。

当前世界配置的基础精力规则为：

```text
基础 agility = 10
每个护甲部位 = +5 agility；空护甲槽也计 +5
四部位基础总值 = 30 agility
最大精力 = agility × 0.1
每次回复 = 0.05 + agility × 0.0025
回复间隔 = 4 tick
使用后回复延迟 = 15 个精力 tick，约 3 秒
受击消耗 = clamp(护甲前伤害 × 0.04, 0.04, 1.0)
```

攻击、受击、主动护甲、闪避和物品使用共享同一条精力。连续高压受击仍会关闭精力伤害和主动护甲，这是系统保留下来的真实限制；但 Apotheosis 提供的静态护甲、韧性和宝石属性不会随精力耗尽而消失。

### 完整度如何计算

Tetra `6.17` 的模块结果按下面的规则结算完整度：

```text
模块完整度 = 固定 integrity
  + round(正 extract.integrity × material.integrityGain)
  + round(负 extract.integrity × material.integrityCost)
```

这意味着 lining/harness/underpants 一般读取 `integrityGain` 提供容量；甲片、armwraps 和材料 improvement 一般读取 `integrityCost` 消耗容量；honing 使用固定负完整度。四件装备分别结算，头盔多出的完整度不能借给胸甲。

当前最实用的容量材料如下：

| 材料 | `P/S/T` | gain / cost | 标准 lining 最终完整度 | 备注 |
|---|---:|---:|---:|---|
| 强化纤维 reinforced fiber | `5 / 3.2 / 6.4` | `8 / 1` | `+9` | 低 cost，综合最实用 |
| 龙筋 dragon sinew | `1 / 1.5 / 4` | `8 / 2` | `+9` | 容量相同，但用于消耗型模块时更贵 |
| 丝质内裤 silk underpants | 固定 variant | 固定 `+4` | `+4` | 额外 `+2 agility`，不是材料换算 |
| 劫掠兽皮裤 ravager hide pants | `6 / 3.5 / 3` | `5 / 1` | 额外 `+4` | pants 的正 `0.7 integrity` 读取 gain；另有 `3 armor / 1 toughness` |

标准头盔 lining、胸甲 harness、普通 underpants 和靴子 lining 使用 reinforced fiber 时通常都是 `1 + 8 = +9`。胸甲 undercoat 即使加 reinforce 也只有约 `+8`，所以需要高完整度的 armwrap 构筑应优先用 harness。

### Honing 容量和解锁

护甲 honing limit 的基础公式为：

```text
hone limit = 256 + 128 × material.integrityCost
```

之后还会乘 workable 修正。当前代表材料足以覆盖下面构筑需要的 honed 等级；真正限制这些构筑的是完整度和 schematic 前置，不是 hone limit 数值。

高阶 honing 路径会要求耐久、其他分支和 `hone_gild` 作为前置。这里把镀金卷轴视为已解锁，因为 Tetra 原生地狱堡垒 loot 可获得 `hone/gild_1`，而 `config/ftbquests/quests/chapters/the_schematic.snbt` 还提供 `hone/gild_1` 和 `hone/gild_5`。这不代表新存档开局即可直接选择所有等级。

按当前 schematic requirement 搜索到的最低完整度消耗如下：

| 目标 | 最低消耗 | 最终属性 |
|---|---:|---:|
| 头盔 agility 4 | `-6` | `+2 agility` |
| 头盔 agility 4 + attack speed 4 | `-7` | `+2 agility`、`+0.32 attack speed` |
| 胸甲 agility 1 / 2 / 3 / 4 | `0 / -3 / -4 / -7` | `+0.5 / +1 / +1.5 / +2 agility` |
| 护腿 agility 1 / 2 / 3 / 4 | `0 / -2 / -4 / -6` | `+0.5 / +1 / +1.5 / +2 agility` |
| 靴子 agility 4 | `-6` | `+2 agility` |
| armwrap 伤害 8 | `-2` | `+24% energy attack damage` |
| armwrap 攻击耗能 8 | `-3` | `-40% energy attack cost` |
| 上述近战双满 | `-5` | honed 总等级 16 |
| bracers 拉弓力量 8 | `-2` | `+32% draw strength` |
| bracers “拉弓速度” 8 | `-2` | `+32% draw duration`，实际更慢 |

### 各护甲模块的当前最佳材料

“最佳”必须按目标拆分，不能只取最高 `primary`。下面均是当前实际可用材料，并已计入材料根属性和真实 `MULTIPLY_TOTAL` 合并。

#### 轻甲

ravager hide 是轻甲的明确最优：每次材料使用都会额外带入 `+1 armor / +1 toughness`。

| 模块 | 属性 | 完整度 |
|---|---:|---:|
| 软帽 cap | `2.1 / 1` | `-1` |
| 背心 vest | `3 / 1` | `-1` |
| 长裤 pants | `3 / 1` | `+4` |
| 标准靴身 standard boots body | `2.1 / 1` | `-1` |

四件合计 `10.2 / 4`。pants 还反向提供完整度，因此丝质 underpants `+4` 加 ravager pants `+4` 足以承受 agility 4 的 `-6`。

#### 锁甲

End Dragon 是纯护甲最高，Ghost Ingot 则用较低护甲换取较低完整度消耗和每模块 `+10% attack speed`。

| 构筑 | 护甲 / 韧性 | 模块 agility | honing 后 agility / 精力 | 额外攻速 |
|---|---:|---:|---:|---:|
| End Dragon 全锁甲 | `23 / 0` | `-4` | `33.5 / 3.35` | 无 |
| Ghost 全锁甲 | `18.5 / 0` | `-4` | `34 / 3.40` | `1.1^4 = 1.4641×` |

四件 End Dragon 锁甲模块各消耗 `-3`；Ghost 各消耗 `-2`。胸甲 End Dragon 剩余 6 点，只能做到 agility 3；Ghost 剩余 7 点，可做到 agility 4。

#### 板甲

Ghost Ingot 的 `P/S/T = 10/1/0` 会避开 cuirass、legplates 和 plate boots 中 secondary/tertiary 的负向扣分，因此它在胸甲、护腿和靴子上反而比 End Dragon 提供更多护甲。

| 模块 | End Dragon 属性 / 完整度 | Ghost 属性 / 完整度 |
|---|---:|---:|
| 轻盔 sallet | `5.5 / 6.3`，`-3` | `5.5 / 4.5`，`-2` |
| 胸甲 cuirass | `8.6 / 7.1`，`-3` | `9.8 / 5`，`-2` |
| 腿甲 legplates | `8.6 / 7.1`，`-3` | `9.8 / 5`，`-2` |
| 板甲靴 plate boots | `5.6 / 6.3`，`-3` | `6.5 / 4.5`，`-2` |

全套结果：

| 构筑 | 护甲 / 韧性 | honing 后 agility / 精力 | 每件剩余完整度（头/胸/腿/脚） |
|---|---:|---:|---:|
| Ghost 板甲 | `31.6 / 19` | `22 / 2.20` | `1 / 0 / 1 / 1` |
| End Dragon 板甲 | `28.3 / 26.8` | `21.5 / 2.15` | `0 / 2 / 0 / 0` |

Ghost 板甲同时有 `1.1^4 = 1.4641×` 的材料根攻速倍率；End Dragon 的优势是高 `7.8` 韧性，而不是护甲值。

#### 重甲

| 模块 | End Dragon 属性 / 完整度 | Ghost 属性 / 完整度 |
|---|---:|---:|
| 平板式重型护肩（`flat heavy shoulders`） | `6.1 / 3.9`，`-2` | `4.3 / 2.7`，`-1` |
| 板式重型腿甲（`plate heavy legplates`） | `9.7 / 9.4`，`-3` | `8.05 / 6.1`，`-2` |
| 对应 Ghost trim | 无根攻速 | `0` 完整度、额外 `+10% attack speed` |

把 sallet、cuirass、重肩、重腿和 plate boots 组合后：

| 构筑 | 护甲 / 韧性 | honing 后 agility / 精力 | Ghost 使用次数 |
|---|---:|---:|---:|
| End Dragon 重甲 | `35.5 / 33` | `16.65 / 1.665` | 0 |
| Ghost 重甲 | `34.15 / 22.8` | `15.9 / 1.59` | 7 |

Ghost 重甲的七次材料使用来自 sallet、cuirass、重肩、重肩 trim、重腿、重腿 trim 和 plate boots，材料根攻速为 `1.1^7 = 1.948717×`。若头盔同时走 agility 4 + attack speed 4，普通剑从 `1.6` 提升到：

```text
(1.6 + 0.32) × 1.1^7 = 3.741537 attack speed
```

这已经接近 Tetrawear 攻击耗能映射的 4.0 端点。

### 最高精力构筑

实际最大值是 `40 agility / 4.0 energy`：

| 部位 | 模块与 honing | 完整度结算 | agility 收益 |
|---|---|---:|---:|
| 头盔 | reinforced fiber lining、ravager cap、agility 4 | `9 - 1 - 6 = 2` | `+2` |
| 胸甲 | reinforced fiber harness、ravager vest、agility 4 | `9 - 1 - 7 = 1` | `+2` |
| 护腿 | silk underpants、ravager pants、agility 4 | `4 + 4 - 6 = 2` | `+2 + 2` |
| 靴子 | reinforced fiber lining、ravager body、agility 4 | `9 - 1 - 6 = 2` | `+2` |

基础 `30` 加四件 honing 的 `+8` 和 silk 的 `+2`，得到 `40`。完全不装可选模块时反而只有 `39.5`：silk underpants 只有 4 点完整度，只能承受 agility 3；ravager pants 提供的额外 4 点容量使 agility 4 成为可能。

### 近战伤害和耗能

Tetra 会把同属性的多个 `MULTIPLY_TOTAL` 分量按乘法合并：

```text
合并结果 = product(1 + 每个分量) - 1
```

强化护臂公式为：

```text
energy_attack_damage = 0.02 + 0.04P + 0.03S - 0.02T
```

因此 Rage Soul reinforced 不是简单 `+58%`。其内部四个分量的真实结果是：

```text
(1.02 × 1.48 × 1.15 × 0.93) - 1 = +61.4517%
```

主要 reinforced 候选如下：

| 材料 | 完整度 | 精力伤害 | 其他根属性 | 单材料 DPS 倾向 |
|---|---:|---:|---:|---|
| 怒魂锭 Rage Soul | `-3` | `+61.4517%` | 无 | 最高单击 |
| 幽灵锭 Ghost Ingot | `-2` | `+47.0840%` | `+10% attack speed` | DPS/完整度最佳 |
| 恐惧钢 Dreadsteel | `-3` | `+52.1677%` | `+2% attack damage / speed` | 中间方案 |

每击耗能为：

```text
每击耗能 = 0.1
  × product(1 + energy_attack_cost 修饰符)
  × clampedMap(最终 attack speed, 0..4, 4..1)
```

普通剑 `1.6 attack speed` 的速度耗能倍率是 `2.8`。下表假定除护甲外没有武器、词缀、药水或其他攻速/伤害修饰，攻击均完整等待冷却，并且精力没有被闪避、受击、挖掘或物品使用分走：

| 构筑 | 胸甲完整度 | 满精力 | 单击倍率 | DPS 倍率 | 每击耗能 | 满条攻击数 |
|---|---:|---:|---:|---:|---:|---:|
| 龙鳞 armwrap + Rage reinforced + 伤害 8 + 耗能 8 | `9-1-3-2-3=0` | `3.85` | `2.6426×` | `2.6426×` | `0.1386` | `27.8` |
| 龙鳞 armwrap + Ghost reinforced + 双满 | `9-1-2-2-3=1` | `3.85` | `2.4075×` | `2.6482×` | `0.1326` | `29.0` |
| warped muscle armwrap + Ghost reinforced + 双满 | `9-2-2-2-3=0` | `3.85` | `2.1886×` | `2.4075×` | `0.1242` | `31.0` |

龙鳞 armwrap 本体还带 `+10% generic.attack_damage`，所以 Rage 的完整单击倍率为：

```text
1.1 × 1.2 × 1.614517 × 1.24 = 2.642641
```

Rage 仍是最高单击；Ghost 因 `+10% attack speed` 以少 1 点完整度取得略高的持续 DPS；warped muscle 的攻击耗能约 `-22.75%`，是纯续航方向。

#### Ghost 多插槽极限

一个静态可成立的极端构筑是：

- 头盔：Ghost sallet，agility 4 + attack speed 4。
- 胸甲：龙鳞 armwrap、Ghost reinforced、Ghost vambraces、Ghost stabilizers、伤害 honing 8；不装 outer。
- 护腿：Ghost heavy legplates + Ghost trim，agility 4。
- 靴子：Ghost plate body，agility 4。

逐件完整度：

```text
头盔：9 - 2 - 7 = 0
胸甲：9 - 1 - 2 - 2 - 2 - 2 = 0
护腿：9 - 2 + 0 - 6 = 1
靴子：9 - 2 - 6 = 1
```

该构筑有七次 Ghost 材料使用，`21.45 agility / 2.145 energy`，静态 `20.05 armor / 15.1 toughness`；有精力时 armwrap 本体和 Ghost vambraces 再提供约 `9.7 energy armor / 4.55 energy toughness`。

普通剑结果：

| 状态 | 最终攻速 | 单击倍率 | DPS 倍率 | 每击耗能 | 满条攻击数 |
|---|---:|---:|---:|---:|---:|
| 仅 Tetrawear/MMT | `3.7415` | `2.4075×` | `5.6298×` | `0.0985` | `21.8` |
| 再加 Ancient Royalty | `4.3028` | `2.7686×` | `7.4454×` | `0.0825` | `26.0` |

Royalty 把攻速推过 4 后，Tetrawear 的速度耗能倍率被夹到最低 `1`。这组 `7.45×` 是护甲和头盔宝石对一把基线 `1.6` 普通剑的静态属性乘积，不含武器本身的 Tetra 模块、Apotheosis 武器词缀、暴击、穿甲、命中间隔丢失和目标机制，不能直接当作实战秒伤；但它足以证明 Ghost 根属性与精力耗能公式存在正反馈。

### 主动防御构筑

armwrap 本体和 vambraces 提供的不是静态护甲，而是有精力时临时转入普通护甲属性：

```text
armwrap body:
energy_armor = 0.5 + 0.1P
energy_toughness = 0.5 + 0.1P + 0.1S
```

warped muscle armwrap `-2`、End Dragon vambraces `-3`、energy armor honing 8 `-2`、energy toughness honing 4 `-2`，刚好用完 harness 的 9 点完整度：

```text
9 - 2 - 3 - 2 - 2 = 0
```

最终主动属性约为 `17.65 energy armor / 8.93 energy toughness`。这套不能再同时加入 reinforced；“improvement group 不互斥”只说明结构上可以共存，不代表完整度允许全部满配。

### 弓箭构筑和 draw speed 方向

Tetra `ModularBowItem#getDrawDuration` 在无 Quick Charge 时按下面的方向计算：

```text
满拉弓时长约为 20 × tetra:draw_speed
```

所以 `tetra:draw_speed < 1` 才是加速，正 `MULTIPLY_TOTAL` 会变慢。Tetrawear 自带 stat tooltip 也把该属性标记为 `inverted`，但 bracers 和 honing 数据仍给正数。

按真实“拉弓力量 / 拉弓时长”比值搜索，当前 bracers 最优不是 paper，而是 ravager hide：

| bracers 材料 | draw strength 倍率 | draw duration 倍率 | 力量/时间 |
|---|---:|---:|---:|
| 劫掠兽皮 ravager hide | `1.1288×` | `0.5118×` | `2.2054×` |
| 强化纤维 reinforced fiber | `1.3289×` | `0.6548×` | `2.0294×` |
| 龙鳞 | `1.3664×` | `0.8475×` | `1.6123×`，另有材料根 `draw_damage` |
| 纸 paper | `1.4698×` | `1.2099×` | `1.2148×` |

拉弓力量 honing 8 对 ravager bracers 再乘 `1.32`，得到：

```text
draw strength = 1.1288 × 1.32 = 1.4900
draw duration = 0.5118
确认的 Tetra 力量/时间倍率 = 1.4900 / 0.5118 = 2.9111
```

龙鳞 armwrap 本体另有 `+10% tetra:draw_damage`。如果当前 MMT projectile 路径正常消费该属性，静态乘积约为 `3.2023×`；Tetra 原生箭矢路径已确认读取 `tetra:draw_strength`，但 MMT `draw_damage` 的最终实战覆盖仍需客户端射击验证。

推荐的当前静态弓箭胸甲是：龙鳞 armwrap `-1`、ravager bracers `-1`、拉弓力量 8 `-2`、物品使用耗能 8 `-3`，总消耗 `-7`，还剩 2 点。不要点正值的“拉弓速度” honing；它会把时长再乘 `1.32`，与同级力量 honing 的 DPS 收益互相抵消。

当前 `energy_bow_draw_tick_cost = 0.01`。上述构筑满拉约 `10.24 tick`，计入龙鳞 armwrap 的物品使用耗能和 honing 后，每次完整拉弓静态消耗约 `0.05135 energy`；`3.85` 精力约支持 75 次完整拉弓。实际射击还会受取整、松弦时机、弓自身 draw speed/strength、Quick Charge、箭矢和服务器 tick 影响。

### Apotheosis 外部属性

当前原生 Apotheosis 的关键叠加源如下：

| 来源 | Ancient 效果 | 约束 |
|---|---:|---|
| `ironforged` 护甲词缀 | 四件满值合计 `+20 armor` | 不消耗 Tetrawear 完整度 |
| `steel_touched` 护甲词缀 | 四件满值合计 `+24 toughness` | 不消耗 Tetrawear 完整度 |
| Guardian 宝石 | 每颗 `+8 armor` | 仅胸甲/护腿；非 unique，可同件重复 |
| Tyrannical 宝石 | 每颗 `+6 toughness` | 仅胸甲/护腿；unique，会占用 Guardian 孔 |
| Royalty 宝石 | 头盔 `+15% all stats` | unique；列表明确包含伤害、攻速、护甲和韧性 |

Ancient 单件理论最多 5 孔，因此胸甲和护腿理论可放 10 颗 Guardian，合计 `+80 armor`。按五个孔位依次具有 `1 / 0.85 / 0.65 / 0.45 / 0.25` 的出现概率，Ancient 单件期望孔数为 3.2；胸甲和护腿合计约 6.4 孔，对应 `+51.2 armor`。这里的“期望”只指孔数分布，不代表自然掉落时会自动生成全 Guardian。

计算顺序按四件满值双防词缀、指定 Guardian 总量，再由头盔 Royalty 乘 `1.15`：

```text
最终护甲 = (Tetrawear 静态护甲 + 20 + Guardian) × 1.15
最终韧性 = (Tetrawear 静态韧性 + 24) × 1.15
```

### 当前减伤结果

`config/attributeslib.cfg` 使用当前整合包的护甲软上限公式：

```text
a = 12 + 3 * sqrt(damage)
taken = a / (a + armor / (1 + armor / 120)
  * (0.7 + 0.3 * min(1, toughness / 10)))
```

下表只计算这条护甲公式，不含 Protection、Resistance、吸收、闪避、专属伤害减免、护甲穿透或护甲撕裂：

| 构筑 | Guardian 情况 | 最终护甲 / 韧性 | 40 伤害减免 | 100 伤害减免 | 400 伤害减免 |
|---|---|---:|---:|---:|---:|
| 最高精力 ravager 轻甲 | 期望 6.4 孔 | `93.61 / 32.20` | `62.9%` | `55.6%` | `42.2%` |
| 最高精力 ravager 轻甲 | 十颗上限 | `126.73 / 32.20` | `66.6%` | `59.5%` | `46.1%` |
| Ghost 极限输出流 | 期望 6.4 孔 | `104.94 / 44.97` | `64.4%` | `57.1%` | `43.7%` |
| Ghost 极限输出流 | 十颗上限 | `138.06 / 44.97` | `67.5%` | `60.5%` | `47.1%` |
| Ghost 全板甲 | 期望 6.4 孔 | `118.22 / 49.45` | `65.8%` | `58.6%` | `45.3%` |
| End Dragon 全重甲 | 期望 6.4 孔 | `122.71 / 65.55` | `66.2%` | `59.1%` | `45.7%` |

Ghost 极限输出流有精力时还会增加 `9.7 / 4.55` 主动防御；在期望 Guardian 情况下，Royalty 结算后约为 `116.09 armor / 50.20 toughness`，100 点伤害的护甲减免约 `58.4%`。

软上限阻止了 150 护甲直接变成无敌，但角色差异已被严重压缩：最高精力轻甲与 End Dragon 全重甲在 100 点伤害下只差约 `3.5` 个百分点；十颗 Guardian 时会进一步压缩。重甲仍有较好的低压和无精力防御，但“少几十点 Tetrawear 护甲换高输出”的核心代价已经被外部固定属性绕过。

### 风险分级与处理建议

当前不应先改官方 Tetrawear 的所有材料和模块数值；问题来自官方机制、MMT 材料根属性和 Apotheosis 外部属性的交叉。建议按以下顺序处理：

1. **优先修 Ghost Ingot 根属性泄漏。** `+10% generic.attack_speed` 不应在每次护甲模块、vambraces、stabilizers 和零完整度 trim 使用时重复叠加。更合适的是限制到武器上下文，或在 Tetrawear 护甲结果中剥离该根属性。
2. **修正 bracers 的 draw speed 符号。** 如果设计意图是提高射速，`tetra:draw_speed` 应给负值；修正后还要重新评估 ravager hide、reinforced fiber 和力量 honing 的倍率。
3. **让精力伤害读取最终总护甲。** reinforced 激活时可按最终 `generic.armor` 衰减伤害，或对最终护甲施加比例代价。只有读取最终属性，才能覆盖 Apotheosis 词缀、宝石和其他模组的外部护甲。
4. **让输出和主动防御形成真实分支。** 当前 9 点预算会阻止“全 improvement + 全 honing”，但 Ghost reinforced/vambraces/stabilizers + 伤害 8 仍能恰好满配。可考虑 reinforced 与 vambraces 互斥，或让 damage/cost/defence honing 共用排他分支。
5. **若只想限制 Apotheosis，优先做 Tetrawear 定向规则。** 例如限制 Tetrawear 护甲的 Guardian 重复数量，而不是全局把 Guardian 设为 unique；全局改宝石会影响所有原版和模组护甲。
6. **不要只降低 `energy_attack_multiplier`。** 从 `1.2` 降到 `1.0` 只能线性压低精力乘区，不能解决 Ghost 攻速重复、Royalty 降耗和外部护甲绕过完整度的问题。

## 当前验证状态

- 已静态核对当前安装 JAR、KubeJS 材料 JSON、世界 serverconfig、Tetra/Tetrawear 字节码、模块公式、材料根属性和 Apotheosis 原生词缀/宝石数据。
- 已按实际 schematic requirement 搜索 agility、伤害、耗能和弓箭 honing 路径，并分别结算四件装备完整度。
- 已确认 Tetra `MULTIPLY_TOTAL` 使用乘法合并、Tetrawear 攻击耗能读取最终 attack speed、Tetra bow 的 draw duration 与 `tetra:draw_speed` 同向。
- 尚未在工作台实际组装上述每套装备，也未验证所有 honing 在 UI 中的显示顺序和卷轴解锁状态。
- 尚未做连续攻击、受击共享耗能、主动护甲失效时机、Apotheosis reforging/socketing、Royalty/Guardian 镶嵌、弓箭射速和实际箭伤害回归。
- 客户端启动、构筑可见和无报错只能作为部分证明；在完成真实攻击、射击和受击测试前，本文的数值属于当前版本的 JAR/数据/公式级静态结论。
