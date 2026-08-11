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

## 当前验证状态

- 已核对 JAR 元数据、依赖、哈希、资源数量、四件物品、槽位、replacements、配置字段和 `ArmorHelper` 字节码。
- Tetrawear 已通过 Packwiz 同步到运行目录，GeoTetraArmor 运行 JAR 已移除。
- 两个 JavaScript 目标文件通过 `node --check`；整合包中用于复刻 Geo 数值的 7 个 Tetrawear 模块覆盖和 5 个方案覆盖已移除，官方 JAR 数据重新成为唯一来源。
- Packwiz 元数据、Crash Assistant 模组清单、知识库校验和 `git diff --check` 已通过；全仓只在迁移说明与历史教训中保留 Geo 名称。
- 尚未启动客户端；外观、工作台转换、全息入口、energy/dodge/temperature、honing 和旧存档处理仍需人工回归。
