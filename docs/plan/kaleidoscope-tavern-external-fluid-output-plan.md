# 通用酒瓶流体能力与森罗酒桶自动化计划

> Core 已合入 `1.20.1`（`f21e1e4`），整合包已同步子模块指针和 Packwiz 成品 JAR。
> 2026-11-21 建立，2026-11-22 修订。
> 关联计划见[酿造分工与森罗酒馆适配](kaleidoscope-tavern-alcohol-integration-plan.md)。

## 目标与已确认事实

KJS 显式登记固定瓶装酒与包内已有酒液的对应关系。CDC 在森罗酒桶初酿完成后，把已登记的外部成品存为对应流体，再通过 CGT 的现有接入点提供管道出料。管道和水龙头共用一个成品流体罐。固定酒瓶的标准流体能力复用同一份登记数据，可独立实施。

以下事实已通过脚本、源码与本地 JAR 字节码核对，运行时验收待实施后进行。

- 森罗酒馆 `1.2.0` 将成品保存为物品份数并清空输入流体。CDC 当前延迟到初酿完成后才生成可取成品。
- Create Gears and Tavern（CGT）`1.2.0` 的 `CGTKaleidoscopeBarrelFluids.getVisibleFluid()` 先查自己的饮品目录，再用 `DrinkFluidConversions.fromItem()` 转换。后者按 `drinkId` 从 `CGTFluids` 取 CGT 自己的流体。CGT 在 `FLUID_TYPES` 注册阶段生成对应流体并冻结目录，事后单加物品映射无法补齐流体注册。
- CGT 的虚拟出料每累计抽取 250 mB 才从物品槽扣一份，零头存于按维度与坐标索引的静态 `VIRTUAL_DRAIN_REMAINDER`。森罗龙头直接扣物品份数，能在管道部分抽液后多取末瓶。内存零头会随重启丢失，龙头清空后也可能残留到下一批。
- 当前六款外部酒已有各自的包内酒液及 Create 装排液定义，调查发现其酒瓶缺少适用的物品流体能力。装排液配方由 Create 机器执行，与酒瓶标准能力分开。

## 一、KJS 显式登记已有酒液

### 拟新增 API

在 CDC 增加 `compat/alcohol/ItemFluidContainers`，提供固定酒液映射的登记和查询。KJS 通过现有 `global.CDStartupJavaClasses` 暴露的 `$ItemFluidContainers` 登记数据，沿用 `AlcoholDrinks` 的 Java 静态调用方式。CDC 的 Java 代码负责查表、保存批次及出料。

| API | 约定 |
|---|---|
| `register(itemId, fluidId, amount, emptyContainerId)` | 严格登记固定满瓶规则。校验三个 ID、正整数液量和冲突重复定义 |
| `registerIfPresent(itemId, fluidId, amount, emptyContainerId)` | 用于含可选模组的清单。物品、流体或容器缺失时跳过并记录，参数错误仍报错 |

同一条规则可重复登记。同一物品出现不同流体、单份液量或空容器时报告冲突。新增 startup 脚本拟按下列方式读取现有酒类清单。

```js
// 优先级低于 01_alcohol_drinks.js，依赖拟新增的 CDC 接口。
global.CDAlcoholDrinks.forEach(drink => {
    global.CDStartupJavaClasses.$ItemFluidContainers.registerIfPresent(
        drink.item, drink.fluid, drink.amount, drink.container
    )
})
```

- `global.CDAlcoholDrinks` 是固定酒的物品、流体、单份液量和空容器的唯一内容来源。苹果酒使用 `farmersdelight:apple_cider`、`farmersrespite:apple_cider`、250 mB 与 `minecraft:glass_bottle`。包内现有 Create 装排液配方可继续通过相同流体 ID 使用这份酒。
- startup 阶段先收集 ID，在相关注册表可用且世界开始使用前解析、校验和冻结。客户端和服务端加载同一份规则，变更登记需完整重启。
- `global.CDTavernFermentedDrinks` 继续供现有品质批次和陈酿规则使用。酒桶的流体适配直接查固定酒液登记。
- 新增固定外部酒时，在清单登记这四个字段，并提供以该物品为结果的森罗酒桶配方。登记适用于单一物品 ID 对应固定酒液和液量的成品。部分装填、液体身份由 NBT 决定或含多个罐的外部容器继续按物品出料。

## 二、根据酿造成品确定流体

在 `BarrelQualityMixin` 取得 `BarrelRecipe.assemble()` 的实际结果后，记录配方 ID 和实际组装份数，以 `copyWithCount(1)` 保存成品模板。CGT 原生饮品与已登记的外部酒分别使用下面的转换规则。

1. **CGT 原生饮品**按原有目录和饮品变体规则处理。沿用 CGT 的单份液量和瓶器，在初酿完成写入成品罐时调用 `DrinkFluidConversions.fromItem()` 生成正确的原生流体。
2. **已登记的外部酒**由 CDC 用成品物品 ID 查固定酒液登记。验证登记的空容器满足配方 `carrier`，记录允许使用的空容器。初酿完成时按登记的现有流体和批次总量创建 `FluidStack`，并写入本批次的 QFF 品质。原模板的药效和变体 NBT 供龙头装瓶。
3. **其余成品或无法转换的批次**按物品模式出料。转换校验失败时记录配方 ID、成品 ID 和原因。酒桶依据显式登记或 CGT 原生转换选择流体模式，Create emptying 和 filling 继续服务实体酒瓶的机器转换。

外部酒的查表和转换留在 CDC 的酒桶适配，CGT 的目录、流体注册表和 `DrinkFluidConversions.fromItem()` 的转换规则继续服务原生饮品。使用同一份酒液登记的各酒种无需新增 Java 分支。已开始的批次保存本次映射及容器约束，配方与标签重载后由下一批使用新数据。

## 三、真实成品罐与统一出料

### 酿造和陈酿

- 保留输入罐，另增专用成品 `FluidTank`。流体模式以罐内 mB 为唯一库存，原成品模板只用于恢复瓶装物品。
- 批次保存实际组装份数、单份量、原成品模板、容器约束、对应流体和品质状态。按「实际组装份数 × 单份液量」用有界运算校验 4,000 mB 酒桶容量。超容量时按物品模式出料，并记录原因和原始数量。
- 所有流体模式批次都等待配方 `unit_time`。初酿期间只有待产出记录，初酿完成一次性生成成品流体并写 QFF 品质。模板仅供显示和还原瓶装物品。
- 陈酿及调酒资格沿用现有规则。`TavernBarrelBatch.tick()` 在初酿和陈酿完成时都会报告阶段变化。初酿完成写入库存，陈酿完成只更新罐内剩余酒的品质。正常出料沿用当前品质和计时。
- 更新 `BarrelQualityMixin` 的空输出槽判断、完成写出和清理，显式区分物品模式与流体模式，避免流体罐尚有酒时旧逻辑提前重置，或又生成一份物品产物。

### 管道与 Forge/Create 接入

- CDC Mixin 接到 CGT 的 `CGTKaleidoscopeBarrelFluids.getVisibleFluid()` 和 `BarrelFluidHandler`。流体模式从成品罐返回可见液量和容量，两个 `drain` 重载直接委托该罐。外部酒在查询 CGT 全局目录前由这个成品罐分支处理。多方块控制器解析、允许接入面及 Forge/Create 能力查询沿用 CGT 的现有接入点。
- 空闲时使用原输入罐，初酿中隐藏成品。成品对外只排液，支持任意 mB 与精确 NBT/品质匹配。模拟只读，执行后保存并同步实际余量。
- 部分抽取后的余量留在成品罐中。流体模式直接扣罐内实际 mB，覆盖 CGT 原有通过静态 `VIRTUAL_DRAIN_REMAINDER` 按 250 mB 逐瓶扣减的路径。

### 水龙头、地面容器与置物台

- 保留当前批次的原成品单件模板和允许容器，龙头不需要全局反查“这个流体属于哪一瓶酒”。
- 先验证容器、完整单份液量和接收容量，再原子提交扣液、耗容器和交付。失败不扣料、不掉落溢出物，末瓶品质在清理批次前写入。
- 成品保留原物品 ID、效果和必要 NBT；品质由当前酒液写入。外部酒不增加森罗 `BrewLevel`；原生酒保持原有瓶器、变体和可放置容器行为。
- 覆盖原生开阀检查、`extractOneOutput`、放置容器、地面物品及 `TavernTapDepot`，全部使用统一出料服务，保留手动/红石开阀、堆叠空瓶及满缓冲恢复。
- 残液不足一瓶时龙头暂停，管道仍可抽取。4,000 mB 抽走 100 mB 后再取 15 瓶，只剩 150 mB，低于第 16 瓶所需的 250 mB。

### 存档和显示

- 版本化保存实际流体/NBT、单份液量、原成品模板、容器约束、转换来源、模式及初酿/陈酿状态。排空时统一清理后再允许下一桶。
- 旧成品通过流体、空容器和容量校验后，一次性将已保存的物品库存迁入成品罐，成功后清理旧库存。无法确定转换的批次仍按物品模式出料。初酿中的批次在完成时转换，陈酿计时照常恢复。迁移以旧存档保存的库存为准，旧版静态 Map 中随重启丢失的历史零头无法还原。
- Jade、交互提示及适用液面渲染读取相同状态，显示实际 mB 和可装瓶数；不假填输入 tank，也不更改原开盖规则。

## 四、独立的固定酒瓶流体能力

CDC 可读取第一节登记，为缺少适用原生能力的固定酒瓶提供标准 `IFluidHandlerItem`。这项能力供直接处理酒瓶的通用机器使用，可独立交付。酒桶主线直接使用登记数据。

### 固定满瓶模型

- 为每个目标 `ItemStack` 附加并缓存独立 handler。内容和容量由固定登记和当前单件物品给出。旧酒瓶可以在没有 `Fluid` NBT 时通过 `getFluidInTank(0)` 返回含品质的准确单份流体副本，无效槽返回空。
- 两种 `drain` 重载均校验流体身份、NBT、请求量和容器状态。请求低于一份时返回空，请求足够时可排出一份。查询与 `SIMULATE` 保持物品 NBT 和内容，`EXECUTE` 后该栈的 handler 变为排空状态，重复查询沿用同一状态。
- `getContainer()` 返回一件干净的指定空容器，调用方用它替换已处理的单件酒瓶。堆叠先由调用方分出一件。能力只支持排液，`fill` 返回零，空瓶使用现有 Create filling 配方重新装瓶。直接饮用、物品属性和喝完返瓶由原物品处理。

### 品质、既有能力与启动时序

- 流体品质由 `QualityUtils.getQuality(stack)` 与 QFF `withQuality` 等直接 API 桥接。流体使用登记的身份和明确桥接的品质字段。能力的 `getFluid/getFluidInTank` 使用直接读取来避开 `applyEmptyingQuality` 再次查询能力造成的递归。
- 森罗、妖归等已有适用原生能力的物品沿用原 handler。能力与登记不一致时给出诊断。将原生探测与同栈能力构建分开，验证 Forge 附加顺序、缓存行为、提前创建的模板和旧存档物品。
- PowerfulJS `1.6.1` 的 `CapabilityBuilder.FLUID.customItemStack()` 默认读取 `Fluid` NBT，`onDrain` 也缺少指定另一件空容器的返回值。固定满瓶内容、排空状态和返瓶由 CDC handler 实现。

## 五、实施阶段和验收

1. **固定酒液登记与批次选择**。实现 CDC 静态接口、startup facade、现有清单接入、容器校验以及 CGT 原生分支。
2. **成品库存与存档**。实现初酿结束写入流体、陈酿、旧存档迁移、空库存判断和批次清理。
3. **统一出料**。改接 CGT/Forge/Create 出液、全部龙头分支、置物台和显示。
4. **独立瓶能力**。复用同一登记实现固定满瓶 handler，验证标准排液、返瓶和品质。
5. **回归与交付**。执行针对性 GameTest、Java 构建及 Mixin/refmap 检查。重启并确认加载新 JAR 后进行真实游戏验证。

| 验证对象 | 验收要求 |
|---|---|
| 配置校验 | 验证合法与非法 ID、可选模组缺失、非正液量、相同与冲突登记、注册表就绪时序及两端规则一致 |
| 当前六款外部酒 | 苹果酒、紫颂果酒、三款魔法酒、恶魂烈酒。满桶 16 份对应 4,000 mB，管道输出清单中的已有流体，装瓶保留原效果和瓶器 |
| 新增固定外部酒 | 仅新增 KJS 登记和酒桶配方即可进入流体模式。用没有物品流体能力、没有 Create 装排液配方的成品验证 |
| 未登记或容器不合 | 未登记的外部酒仅有物品能力、emptying 或 filling 时仍走物品模式。登记空瓶与配方 `carrier` 不相容时也按物品模式出料并诊断 |
| CGT 原生酒 | 原生酒沿用 `fromItem()` 的流体、变体和瓶器，可放置容器及现有品质行为正确 |
| 四档品质 | 普通、铁、金、钻在桶内陈酿、管道运输和重新装瓶时一致，品质变化只应用于桶内剩余酒液 |
| 不同单份量与小量抽液 | 用 100 mB、500 mB 等登记量验证总量与容量边界。验证连续小量抽液、超量请求、NBT 不匹配及堵塞 |
| 混用出料 | 抽 100 mB、取 15 瓶后剩 150 mB，管道可继续抽余量。验证主/代理部件、允许面、手动/红石和满缓冲恢复 |
| 批次与存档 | 残液、初酿中、陈酿中、旧物品库存、重载和标签变化、区块卸载及重启时均可恢复正确库存和批次 |
| 单一库存 | 流体模式无法再经旧输出槽、原生出瓶或 CGT 虚拟成品提取第二份库存；非流体模式可正常取物品 |
| 独立瓶能力 | 旧瓶没有 `Fluid` NBT 仍报告满瓶。验证两种 drain、模拟、整瓶返容器、单件处理、实排后重复查询、品质传递与已有原生能力 |

既有 GameTest 曾在 Mixin 配置资源读取阶段启动失败，实施时先排除测试启动问题，编译不等于行为测试通过。CDC 改动走 Core PR；正式更新父包指针和打包 JAR 时，按 `cdc-bump`、`packwiz-assets` 流程引用已合入 `1.20.1` 的提交。

2026-11-22 回归使用 Java 17。构建与 refmap 校验通过。补齐 RunicLib，使用 `-I src/test/humidity-regression.gradle` 启动 GameTest，并为旧 CGT JEI 用例复用已存在的空结构。80 项中 78 项通过，酒桶和固定瓶本轮用例均通过。剩余两项分别涉及妖怪归家原生产量断言和 JEI 客户端类在专用服的加载。

整合包隔离专用服加载了哈希一致的重映射 JAR。六款生产配方初酿完成各产 4,000 mB，实际流体转移和 250 mB 整瓶返玻璃瓶均通过。苹果酒抽走 100 mB 后通过置物台取 15 瓶，再将剩余 150 mB 排空。紫颂果酒分别通过红石和玩家交互触发实际龙头。测试日志见 `tmp-opencode/tavern-shared-fluid/`，客户端 Jade 和液面实机复核待补。

## 主要实现入口和维护边界

- CDC 拟新增 `compat/alcohol/ItemFluidContainers`、`compat/kaleidoscopetavern/` 下的酒液选择、成品库存和统一出料服务、对应的 CGT 酒桶 Mixin，以及独立的固定满瓶 handler。
- 既有 CDC：`TavernBarrelAccess`、`TavernBarrelBatch`、`TavernQuality`、`TavernTapDepot` 及对应 `BarrelQualityMixin`、`BarrelTapDepotMixin`、`DrinkFluidConversionsMixin`、`BarrelJadeMixin`；Java 注册入口按本模块 AGENTS 执行。
- KJS 在 `startup_scripts/00_java_classes.js` 增加 facade，并新增 startup 登记脚本复用 `01_alcohol_drinks.js`。`Alcohol/{production,recipes}.js` 继续配置酒桶生产与 Create 装排液。
- CGT 或森罗酒馆升级时复核 Mixin 落点、输入罐与出料能力的路由、原生出料分支和清理时机。固定酒瓶能力随 Forge 的物品栈能力生命周期与 QFF 品质规则复核。
- 当前实现见 [CDC 品质机制](../../CDC-mod-src/docs/dev-knowledge/quality-food.md#成品罐与固定酒瓶)。
