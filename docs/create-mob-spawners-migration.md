# 动力刷怪笼替换与存档迁移

CDR 已用 `Create: Mob Spawners` 替换 `Create Mechanical Spawner`。两个模组的注册命名空间不同，旧方块、战利品收集器和刷怪液不会自动转换。

## 玩家更新前处理

1. 拆除并收回所有旧动力刷怪笼和战利品收集器。
2. 排空管道、储罐和机器内的 `create_mechanical_spawner:*` 刷怪液。
3. 更新后重新制作 `create_mob_spawners:mechanical_spawner` 与灵魂捕捉器。
4. 用对应等级的遗传培养液重新搭建刷怪与击杀产线。

已有世界会保留 `saves/<世界>/serverconfig/create_mob_spawners-server.toml`，不会被 `defaultconfigs` 自动覆盖。需要应用新增捕获黑名单时，应在备份后手动同步 `entity_blacklist`，或删除该世界配置并让 Forge 重新生成；不要在世界运行时替换配置。

旧存档如未提前处理，旧模组方块和流体会作为缺失注册项被移除；旧方块实体数据无法映射到新刷怪笼。

## 新系统边界

- 灵魂捕捉器记录具体生物样本；目标必须带虚弱效果且生命不高于 25%。
- 首领、村民、流浪商人、铁傀儡、雪傀儡和监守者不能被捕获。
- 五个种子等级共用 CDC 的 `createdelightcore:genetic_culture` 虚拟流体，通过 `Grade`、`Lineage`、`Variant`、`Color`、`Name` NBT 区分等级、谱系、颜色和本地化名称；增加新分型不再需要注册新流体。
- 当前有畜牧、温顺野生、地表敌对、亡灵、水生、下界、末影、洞穴、珍稀、异常和灾变仆从 11 个基础谱系；后三个纯粹谱系另有完美效率版本，共 14 种培养液。
- 每种培养液使用一个现有物品作为谱系标记，仍只消耗 1 个标记、1 个对应等级种子和 250 mB 灵质；单个实体白名单最多 10 项。
- 完美培养液不解锁额外生物，只复用对应纯粹谱系的白名单，并降低流体消耗、缩短生成时间。
- 虚空蠕虫、诡异蚊鬼、Alex's Caves 大型稀有怪与 Cataclysm 结构精英等非普通量产生物已加入灵魂捕捉器黑名单。
- 新刷怪笼没有直接结算掉落的战利品收集器，必须搭配实际击杀和收集结构。
- 刷怪笼生成的是对应实体类型的新个体，不复制捕获个体的装备、驯服关系、变种或特殊 NBT。

## 培养液谱系

| 等级 | 谱系与标记物 | 单次消耗 | 满速生成时间 |
|---|---|---:|---:|
| 劣质 | 畜牧/小麦、温顺野生/甜浆果 | 250 mB | 160 tick |
| 普通 | 地表敌对/火药、亡灵/骨头、水生/海晶碎片 | 200 mB | 140 tick |
| 精炼 | 下界/烈焰粉、末影/紫颂果、洞穴/发光浆果 | 150 mB | 120 tick |
| 纯粹 | 珍稀/绿宝石、异常/铀碎片、灾变仆从/黑钢锭 | 125 mB | 100 tick |
| 完美 | 复用珍稀、异常、灾变仆从三个纯粹谱系及其标记物 | 100 mB | 80 tick |

标记物只负责选择谱系；每桶培养液仍需对应等级遗传种子与 250 mB 灵质。实体清单以配方脚本为准。

## 主要实现位置

- Packwiz：`mods/create-mob-spawners.pw.toml`
- 默认配置：`defaultconfigs/create_mob_spawners-server.toml`
- 配方与白名单：`kubejs/server_scripts/Create Mob Spawners/recipes.js`
- 培养液注册与 NBT 渲染：CDC `CDFluids.GENETIC_CULTURE`、`GeneticCultureFluidType`
- 培养液 NBT 分型：`kubejs/server_scripts/Create Mob Spawners/recipes.js`
- 中文覆盖：`kubejs/assets/create_mob_spawners/lang/zh_cn.json`
