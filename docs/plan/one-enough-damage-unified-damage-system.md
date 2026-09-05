# OneEnoughDamage 统一伤害与抗性系统规划

日期：2026-07-19
状态：历史调研；OneEnoughDamage 已于 2026-09-05 从整合包移除，未实施统一伤害组与通用抗性系统

## 目标

利用 OneEnoughDamage（OED）对整合包内硬编码伤害调用点的扫描结果，将大量彼此独立的伤害入口整理为少数可理解、可装备化、可统一平衡的逻辑伤害组，同时补充对应抗性。

本规划追求的是“逻辑分类统一”，而不是强制替换各模组原有的 `DamageType`。原伤害源 ID、死亡信息、免疫判断和模组特殊行为应尽量保留。

预期职责分工：

```text
OED
负责发现和数值化硬编码伤害点
        ↓
KubeJS 虚拟伤害组
负责把多个 OED 属性视为同一种物理/火焰/冰霜/魔法伤害
        ↓
LivingHurtEvent
负责按实际 DamageSource 和受击者抗性计算最终伤害
```

## 历史环境与调查依据（移除前）

移除前安装版本：

```text
OneEnoughDamage-1.20.1-1.0.2-hotfix.jar
模组 ID：oneenoughdamage
版本：1.0.2
```

移除前 OED 扫描结果：

- 扫描 476 个 JAR。
- 扫描 124907 个 class。
- 找到 872 个伤害调用点。
- 初次扫描耗时约 10.46 秒。
- 生成可读字典和实体归属分析额外耗时约 17.54 秒。
- 缓存中约 185 个调用点的静态 `damageType` 标记为 `unknown`。
- 主 TOML 中生成约 543 个 OED 伤害点配置，并包含 87 个实体专属配置节。

移除前主要文件（均已随模组清理）：

| 文件 | 用途 | 是否手动修改 |
|---|---|---|
| `config/OED/oneenoughdamage.toml` | 扫描缓存、调试热重载和攻击者推断设置 | 是 |
| `config/OED/damage-point-dictionary.toml` | 实际伤害数值配置 | 是 |
| `config/OED/damage-point-dictionary.md` | 按模组和实体整理的可读参考 | 否 |
| `config/OED/damage-point-unattributed.md` | 无法静态归属到 LivingEntity 的伤害点报告 | 否 |
| `config/OED/damage_points-cache.json` | classpath 扫描缓存 | 否 |

## OED 实际提供的能力

### 每个伤害调用点都是实体属性

OED 会为扫描到的伤害调用点注册独立属性，例如：

```text
oneenoughdamage:com/github/l_ender/cataclysm/entity/animation_monster/boss_monsters/amethyst_crab_entity/area_attack/1/m
```

这些属性会被添加到 LivingEntity，可通过以下方式控制：

- 在 `damage-point-dictionary.toml` 中修改默认值。
- 用装备 AttributeModifier 修改。
- 用命令修改。
- 用 KubeJS 的 `modifyAttribute` 和 `removeAttribute` 动态修改。

### `/r` 与 `/m`

属性路径结尾决定处理模式：

| 模式 | 含义 | 计算方式 |
|---|---|---|
| `/r` | replace，替换固定伤害 | `属性值 × global_damage` |
| `/m` | multiply，乘算原始伤害 | `原始伤害 × 属性值 × global_damage` |

Minecraft 中 `2.0` 点伤害等于一颗心。当前 OED Mixin 在 `LivingEntity.hurt(DamageSource, float)` 入口修改传入的 `amount`，因此它是护甲、保护附魔和抗性等受击侧结算前的入射伤害，不是最终生命值差；完整阶段、Tetrawear/宝石档位以及 Quality Food 抗性食物的乘算影响见 `docs/attributeslib-armor-balance-analysis.md`。

### 全局伤害倍率

顶层配置：

```toml
"oneenoughdamage:global_damage" = 1.0
```

它会乘算能被 OED 匹配、且能找到 LivingEntity 属性持有者的伤害。未匹配调用点或无法找到攻击者的伤害保持原值。

该属性也能在实体配置节中覆盖：

```toml
[entity."minecraft:player"]
"minecraft:generic.attack_damage" = 1.0
"oneenoughdamage:global_damage" = 1.0
```

两项含义不同：

- `minecraft:generic.attack_damage` 是原版基础近战攻击。
- `oneenoughdamage:global_damage` 是该实体所有成功归属 OED 伤害的总倍率。

### 运行时攻击者归属

OED 优先从 `DamageSource` 的直接实体或实际攻击者中寻找 LivingEntity。没有直接攻击者时，可以根据受击者附近实体和扫描出的创建关系推断属性持有者。

当前配置：

```toml
inferAttributeHolder = true
inferAttributeHolderSearchRadius = 32.0
```

该能力适用于 AI Goal、召唤物、延迟效果和部分投射物，但密集战斗中可能把间接伤害错误归属给附近其他实体，后续应针对召唤物和 Boss 战测试。

## 推荐的 OED 基础配置

完成首次扫描后建议：

```toml
readCache = true
debugMode = false
inferAttributeHolder = true
inferAttributeHolderSearchRadius = 32.0
```

理由：

- `readCache = false` 会在每次启动时重扫所有 JAR，当前环境会增加约 28 秒启动时间。
- 增减或升级模组时，可临时设为 `false` 启动一次，重新生成缓存，然后恢复为 `true`。
- 字典重生成会备份旧 TOML，并尽量保留仍存在的同名配置值。
- 手动加入但未进入自动字典的“未归属伤害点”可能被重生成流程移除，应单独保留清单或补丁。
- `debugMode = true` 会启用字典热重载并同步已加载实体，适合调试；正式环境建议关闭。

## OED 不能直接完成的事情

当前 OED 1.0.2 没有以下机制：

- 伤害组或属性别名。
- 多个伤害点共享一个属性。
- `伤害点 → 物理/火焰/冰霜/魔法` 的组映射配置。
- 受击者抗性属性。
- 按伤害类别读取受击者属性并减伤。
- 将各模组 DamageType 自动合并成统一类别。

OED JAR 当前只注册：

- `oneenoughdamage:global_damage`
- 兼容遗留的 `oneenoughdamage:projectile_base_damage`
- 每个扫描调用点的独立属性

`damage-point-dictionary` 中的 `DamageType: m_269333`、`m_269075`、`unknown` 等主要是扫描诊断信息。大量条目是混淆方法名或伤害源工厂方法，不能直接当作稳定的 DamageType 注册 ID 使用。

## 统一伤害的两种含义

### 不推荐：替换真实 DamageSource

不应把以下真实 DamageType 全部替换成同一个 `createdelight:fire`：

```text
attributeslib:fire_damage
iceandfire:dragon_fire
minecraft:on_fire
```

强制替换可能破坏：

- 原模组免疫和易伤判断。
- 死亡信息。
- 附魔和药水判断。
- Boss 特殊机制。
- 战利品条件和成就。
- 直接实体、实际攻击者和投射物信息。

### 推荐：建立逻辑伤害组

保留真实 DamageSource，通过 KubeJS 将多个 OED 属性视为一个逻辑组。

首期建议只维护：

| 伤害组 | 说明 |
|---|---|
| `physical` | 普通近战、冲撞、劈砍和大部分纯物理技能 |
| `fire` | 火焰、龙炎、燃烧和火系附伤 |
| `cold` | 冰霜、冻结、龙霜和冰系附伤 |
| `magic` | 不属于火焰或冰霜的普通魔法伤害 |
| `true` | 明确设计为绕过常规防御的伤害 |

后续只有在内容确实需要时再增加 `lightning`、`poison` 等类别。

弹射物、爆炸和近战属于传递方式，不应直接等同于元素类别。火球可以同时是火焰、弹射物和爆炸。

## KubeJS 虚拟伤害组方案

### 可行性结论

当前 KubeJS 可以直接修改 OED 属性。示例：

```js
EntityEvents.hurt(event => {
    if (event.getEntity().is("cataclysm:amethyst_crab")) {
        /** @type {Internal.LivingEntity} */
        let entity = event.getEntity()
        let attr = "oneenoughdamage:com/github/l_ender/cataclysm/entity/animation_monster/boss_monsters/amethyst_crab_entity/area_attack/1/m"
        entity.modifyAttribute(attr, "oneenoughdamage:example", 1, "addition")
    }
})
```

该代码修改的是受伤紫水晶螃蟹自身的 OED 属性，因此影响它之后造成的区域攻击，不会改变本次受到的伤害。

KubeJS 的 `modifyAttribute` 行为：

- 使用 Modifier 名称的字符串哈希生成稳定 UUID。
- 添加前先移除同 UUID 的旧 Modifier。
- 使用相同 Modifier ID 重复执行不会无限叠加，而是覆盖。
- Modifier 会作为永久 AttributeModifier 保存；不再满足条件时应显式调用 `removeAttribute`。

### 分组表

建议在 startup 脚本中维护：

```js
global.OED_DAMAGE_GROUPS = {
    fire: [
        "oneenoughdamage:dev/shadowsoffire/attributeslib/impl/attribute_events/melee_damage_attributes/2/m"
    ],

    cold: [
        "oneenoughdamage:dev/shadowsoffire/attributeslib/impl/attribute_events/melee_damage_attributes/3/m"
    ],

    physical: [
        "oneenoughdamage:com/github/l_ender/cataclysm/entity/animation_monster/boss_monsters/amethyst_crab_entity/area_attack/1/m"
    ],

    magic: [],
    true: []
}
```

AttributesLib 1.3.7 的三个近战附伤调用顺序，经本地 JAR 字节码核对为：

| OED 路径序号 | 对应功能 |
|---|---|
| `melee_damage_attributes/1/m` | 当前生命值伤害 |
| `melee_damage_attributes/2/m` | 火焰伤害 |
| `melee_damage_attributes/3/m` | 冰霜伤害 |

这些条目当前位于 `damage-point-unattributed.md`，未自动写入主 TOML，但属性本身已注册并可由 KubeJS 修改。升级 AttributesLib 后必须重新确认调用顺序。

### 统一应用与移除 helper

```js
global.modifyOEDDamageGroup = function(entity, group, modifierId, amount, operation) {
    let attributes = global.OED_DAMAGE_GROUPS[group]
    if (attributes == null)
        return

    attributes.forEach(attribute => {
        entity.modifyAttribute(attribute, modifierId, amount, operation)
    })
}

global.removeOEDDamageGroupModifier = function(entity, group, modifierId) {
    let attributes = global.OED_DAMAGE_GROUPS[group]
    if (attributes == null)
        return

    attributes.forEach(attribute => {
        entity.removeAttribute(attribute, modifierId)
    })
}
```

### 统一百分比增伤必须优先使用 `multiply_total`

假设：

```text
/r 属性基础值 = 5
/m 属性基础值 = 1
```

使用 `0.2, "multiply_total"`：

```text
/r：5 → 6
/m：1 → 1.2
```

两者都表示增加 20%。

使用 `1, "addition"`：

```text
/r：5 → 6，只增加 1 点
/m：1 → 2，伤害翻倍
```

因此，同一伤害组同时包含 `/r` 和 `/m` 时：

- 百分比增减统一使用 `multiply_total`。
- `addition` 只用于明确知道属性模式、且确实需要固定值修正的场合。

### 玩家装备提供伤害组增益

```js
PlayerEvents.tick(event => {
    let player = event.player
    if (player.age % 20 != 0)
        return

    let modifierId = "createdelight:equipment_fire_damage"
    let enabled = player.mainHandItem.hasTag("createdelight:fire_damage_weapons")

    if (enabled) {
        global.modifyOEDDamageGroup(
            player,
            "fire",
            modifierId,
            0.25,
            "multiply_total"
        )
    } else {
        global.removeOEDDamageGroupModifier(player, "fire", modifierId)
    }
})
```

该做法不会在注册表层面把多个 OED 属性变成同一个属性，但从装备、词缀和玩法表现上等同于“火焰伤害 +25%”。

### 怪物专属伤害组调整

```js
EntityEvents.spawned("cataclysm:amethyst_crab", event => {
    global.modifyOEDDamageGroup(
        event.entity,
        "physical",
        "createdelight:amethyst_crab_physical_bonus",
        0.20,
        "multiply_total"
    )
})
```

若 Modifier 仅用于临时状态，应在状态结束、卸下装备或效果消失时调用 `removeAttribute`，避免永久保留在实体 NBT 中。

## OED 数值平衡建议

不要直接逐项重写全部 872 个调用点。建议按以下层次调整：

1. 用实体节下的 `minecraft:generic.attack_damage` 统一普通近战。
2. 用实体节下的 `oneenoughdamage:global_damage` 调整该实体所有可归属技能。
3. 用具体 `/r`、`/m` 条目修正少数离群技能。
4. 用 KubeJS 虚拟伤害组承载装备、词缀、材料和效果提供的类别增伤。

可作为初始参考的单次原始伤害档位：

| 定位 | 建议范围 |
|---|---:|
| 普通怪物 | 2–8 |
| 精英怪物 | 8–16 |
| Boss 常规攻击 | 12–25 |
| 高威胁蓄力技能 | 单独审查，不直接套用常规范围 |

这些只是审查起点，最终仍需结合难度系统、玩家护甲、保护附魔、生命上限和恢复能力测试。

## 抗性系统

### OED 属性不能直接作为受击抗性

OED 在伤害处理中读取的是攻击方的属性持有者：

```text
伤害调用点
→ 找到攻击者或推断归属实体
→ 读取该攻击者的 OED 属性
→ 修改输出伤害
```

因此，把负 Modifier 加在受击者的 OED 火焰伤害属性上，只会降低该受击者未来作为攻击者时造成的火焰伤害，不会降低它当前受到的火焰伤害。

### 当前整合包已有受击端先例

`kubejs/startup_scripts/forge_event.js` 已监听：

```js
ForgeEvents.onEvent("net.minecraftforge.event.entity.living.LivingHurtEvent", e => {
    // 调用多个攻击和防御 handler
})
```

`DragonBreathResistanceEffect.js` 已根据 DamageSource 和效果等级调用：

```js
e.setAmount(finalDamage)
```

因此，通用抗性可以继续复用该事件管线实现。

### 建议抗性属性

首期建议：

```text
createdelight:physical_resistance
createdelight:fire_resistance
createdelight:cold_resistance
createdelight:magic_resistance
```

可选：

```text
createdelight:true_resistance
```

通常真实伤害不应受普通抗性影响，因此首期可不注册真实伤害抗性。

KubeJS 2001.6.5 的注册表包含 `minecraft:attribute`，并且 startup 脚本可使用 `ForgeModEvents` 监听 `EntityAttributeModificationEvent`，理论上可以纯 KubeJS 注册 `RangedAttribute` 并添加给所有 LivingEntity。该部分尚未在本规划中实际运行验证。

若 KubeJS 注册属性的加载顺序、同步、死亡保留或装备提示表现不稳定，则将属性注册和 LivingHurtEvent 核心计算放入 CDC 或独立小模组，KubeJS 仍维护分组数据和内容配置。

### 抗性公式

建议：

```text
最终伤害 = 当前伤害 × (1 - 抗性)
```

含义：

| 抗性值 | 效果 |
|---:|---|
| `0.20` | 减少 20% |
| `0.50` | 减少 50% |
| `0.80` | 减少 80% |
| `-0.25` | 受到 125% 伤害 |

正抗性建议封顶 `0.80`，允许负数表达易伤。完全免疫应由专门药水、能力或 DamageType 免疫规则处理。

### 伤害类别判定

建议按以下优先级选择一个主要抗性，避免火焰和魔法抗性重复乘算：

```text
真实伤害
  ↓
明确 OED 点位映射或明确 DamageType ID
  ↓
火焰
  ↓
冰霜
  ↓
普通魔法
  ↓
物理
  ↓
未分类
```

已确认的基础映射：

| DamageType | 逻辑组 |
|---|---|
| `attributeslib:fire_damage` | `fire` |
| `attributeslib:cold_damage` | `cold` |
| `iceandfire:dragon_fire` | `fire` |
| `iceandfire:dragon_ice` | `cold` |
| `minecraft:on_fire` 等 `#minecraft:is_fire` | `fire` |
| `minecraft:freeze` 等 `#minecraft:is_freezing` | `cold` |
| `#forge:is_magic` 且不属于 fire/cold | `magic` |
| `#forge:is_physical` 且不属于更高优先级类别 | `physical` |

### DamageType 标签只适合作为抗性分类辅助

可在 `kubejs/data/createdelight/tags/damage_type/` 建立逻辑标签，也可扩展原版 `minecraft:is_fire` 和 `minecraft:is_freezing`，使抗火、火焰保护及其他依赖标签的逻辑识别模组伤害。

但标签无法解决所有硬编码技能：多个完全不同的技能可能共用 `minecraft:mob_attack` 或 `minecraft:magic`。这时 OED 调用点路径比 DamageType 更精确。

## 纯 KubeJS 的边界

### 可以完成

- 按数组批量修改 OED 属性，建立虚拟伤害组。
- 让玩家装备、Tetra 材料、词缀、药水或怪物阶段提供类别增伤。
- 在 `LivingHurtEvent` 中读取实际 DamageSource。
- 修改最终伤害。
- 基于 DamageType ID、标签、攻击者、投射物、武器和效果进行抗性分类。
- 理论上注册新的伤害/抗性属性并添加给 LivingEntity。

### 当前无法可靠完成

KubeJS 的 `LivingHurtEvent` 看不到 OED 内部本次匹配到的具体 `DamagePoint` 路径。

如果以下三个技能都使用同一个 `minecraft:mob_attack`：

```text
技能 A：物理
技能 B：火焰
技能 C：魔法
```

且攻击者、投射物和武器也无法区分，KubeJS 只能看到相同 DamageSource，无法判断当前是哪个 OED 调用点。

这一限制不影响“预先给攻击者的一组 OED 属性批量加成”，但会影响“受击时根据精确 OED 点位选择抗性”。

### 若需要完全精确分类

最小 Java 扩展方案：

1. OED 的 `DamagePointFinder` 匹配到调用点后，把当前点位 ID 写入短生命周期 ThreadLocal。
2. 在伤害事件完成后清理 ThreadLocal，防止嵌套伤害污染。
3. 向 Forge 事件或 KubeJS 暴露只读的当前 OED 点位 ID。
4. KubeJS 根据点位 ID 查询 `physical/fire/cold/magic/true` 映射。

不建议通过 KubeJS 反射访问 OED 私有 `finder()` 或在每次受击时自行扫描 Java 调用栈，因为这会依赖私有实现，并带来明显性能和兼容风险。

## 建议实现结构

```text
kubejs/
├── startup_scripts/
│   └── damage_system/
│       ├── oed_damage_groups.js       # OED 属性分组与批量 Modifier helper
│       ├── resistance_attributes.js   # 抗性属性注册与实体属性附加
│       └── hurt_event.js              # 统一 LivingHurtEvent 入口
├── data/
│   └── createdelight/
│       └── tags/damage_type/           # fire/cold/magic/physical 辅助标签
└── config/
    └── oed_damage_groups.json          # 可选：把长属性列表从脚本中拆出
```

现有 `kubejs/startup_scripts/forge_event.js` 已集中调度多个 `LivingHurtEvent` handler。统一抗性 handler 应在所有攻击增伤之后执行，并替代或吸收 `DragonBreathResistanceEffect`，避免同一种抗性重复结算。

建议顺序：

```text
攻击方材料/武器增伤
→ 其他技能增伤
→ OED 已完成的硬编码数值变换
→ 统一类别抗性
→ 特殊护盾、免疫或伤害下限
```

实际 Forge 事件和 OED mixin 的精确顺序需要在开发版中输出调试日志确认。

## 主要风险

### Modifier 生命周期

- `modifyAttribute` 添加的是永久 Modifier。
- 条件消失时必须用相同 ID 调用 `removeAttribute`。
- 每个来源使用稳定且唯一的 Modifier ID，例如装备、药水、套装和怪物阶段分别命名。
- 不要让不同系统误用同一个 Modifier ID，否则后写入者会覆盖前者。

### `/r` 与 `/m` 混用

- 组级百分比统一使用 `multiply_total`。
- 不要对未知模式的属性批量使用 `addition`。
- 固定加伤需要拆分 `/r` 与 `/m` 清单，分别设计公式。

### 伤害重复结算

- 当前已有多个 `LivingHurtEvent` handler 修改 `e.amount`。
- 龙息抗性、太阳守卫、材料增伤等逻辑可能与新系统叠乘。
- 迁移时应明确每个 handler 属于攻击增伤、统一抗性还是特殊护盾，并规定唯一顺序。

### OED 推断错误

- `inferAttributeHolderSearchRadius = 32` 可能在密集战斗中选错附近实体。
- 召唤物、延迟爆炸、无主投射物和环境伤害需要专项测试。
- 无法稳定归属的伤害不应默认为附近任意玩家或 Boss。

### 模组升级导致点位变化

- OED 属性路径包含 class、method 和 ordinal。
- 模组更新、反混淆差异或方法重构可能改变路径。
- 重扫后必须比较旧清单与新清单，检查已删除、重命名和新增点位。
- AttributesLib `/1`、`/2`、`/3` 的语义也必须在升级后复核。

### 性能

- 不应在每次受击时遍历全部 872 个 OED 属性。
- 组列表应预先构建，只遍历当前相关组。
- 玩家装备同步可每 20 tick 检查一次，或在装备变化事件中更新。
- DamageType 分类应优先使用集合和直接 ID 查询，避免每次事件进行字符串正则或调用栈扫描。

## 验证计划

### OED 基础验证

- 设置 `readCache = true` 后确认启动不再重扫 476 个 JAR。
- 修改一个 `/r` 条目并重启，确认固定伤害改变。
- 修改一个 `/m` 条目并重启，确认动态伤害按倍率变化。
- 修改实体节 `global_damage`，确认普通攻击和特殊技能的覆盖范围。

### KubeJS 分组验证

- 给同一个实体的两个 `/m` 点位加入同一 Modifier，确认都按相同比例变化。
- 给一个 `/r` 和一个 `/m` 点位加入 `multiply_total`，确认都按百分比变化。
- 重复执行同一 Modifier ID，确认不会叠层。
- 调用 `removeAttribute` 后确认属性恢复。
- 保存退出并重新进入，确认永久 Modifier 的保存行为符合预期。

### 抗性验证

- `attributeslib:fire_damage` 只受到火焰抗性影响。
- `attributeslib:cold_damage` 只受到冰霜抗性影响。
- `iceandfire:dragon_fire` 和 `dragon_ice` 进入对应类别。
- 同时属于魔法标签的火焰/冰霜伤害不重复结算普通魔法抗性。
- 负抗性正确产生易伤。
- 正抗性不超过设计上限。
- 原版抗火、火焰保护和现有龙息抗性不会重复减伤。

### 复杂场景

- 多个相同 Boss 同场时，OED 伤害归属正确。
- 玩家、召唤物和投射物混战时不误用附近实体属性。
- 连锁伤害和反伤不会因事件递归重复处理。
- 无攻击者环境伤害保持合理分类。
- OED 未匹配的伤害不会被错误应用攻击方组倍率。

## 当前决策与待确认项

已确认：

- OED 用于统一硬编码伤害数值入口，而不是替换 DamageSource。
- KubeJS 用数组和批量 Modifier helper 建立虚拟伤害组是可行的。
- 组级增伤优先使用 `multiply_total`。
- 抗性在 `LivingHurtEvent` 中独立计算。
- 真实 DamageSource 保留，分类使用逻辑组。
- 现有龙息抗性应在统一抗性实施时迁移，避免重复结算。

待确认：

- 首期是否只做 `physical/fire/cold/magic` 四类，还是同时加入 `lightning/poison`。
- 抗性属性由纯 KubeJS 注册，还是由 CDC/独立小模组注册。
- 是否需要修改 OED，向 KubeJS 暴露当前精确 DamagePoint。
- OED 组映射存放于 JS、JSON 还是单独 TOML。
- 玩家装备、Tetra 材料、Apotheosis/Fallen 词缀分别如何提供伤害组增益与抗性。
- 最终伤害管线中护盾、免疫、类别抗性和通用抗性的先后顺序。
