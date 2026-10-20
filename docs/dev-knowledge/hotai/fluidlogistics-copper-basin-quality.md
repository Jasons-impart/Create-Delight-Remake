# FluidLogistics 铜工作盆流体品质补丁

本文单独记录 `hotai/com/yision/fluidlogistics/content/processing/copperBasin/CopperBasinBlockEntity.badiff`。
其余补丁的领域表和逐文件明细分别见 [patch-map.md](patch-map.md) 与 [badiff-details.md](badiff-details.md)；本条待上游文档同步时并入那两份。

## 背景

反馈单 MQSM7F：动力搅拌器处理**铜工作盆**时，若配方产物是**流体**，品质丢失；Create 原版工作盆未复现。

铜工作盆是 FluidLogistics 新增的方块，不是 Create 原版工作盆。

## 目标

- 模组：`fluidlogistics-1.2.7.jar`
- 类：`com/yision/fluidlogistics/content/processing/copperBasin/CopperBasinBlockEntity`
- 补丁文件：`hotai/com/yision/fluidlogistics/content/processing/copperBasin/CopperBasinBlockEntity.badiff`

## 根因

两条代码路径互相咬合：

1. **Create 原版工作盆**：`BasinRecipe.apply` 内部调 `basin.acceptOutputs(items, fluids, simulate)`，Quality Food Fluids 的 `BasinBlockEntityMixin` 注入在这个方法的 HEAD，把品质写回 outputFluids。
2. **铜工作盆**：`CopperBasinBlockEntity extends BasinBlockEntity`，但**覆写了 acceptOutputs**：有流体时把流体从 `super` 调用里剥掉（传 `Collections.emptyList()`），改由 `acceptFluidsIntoOutputTank` 自己灌进 outputTank。

于是 Quality Food Fluids 的注入永远拿到空流体列表，守卫条件 `!hasQualityCapableOutput(空) && !hasQualityFluidSource(consumedFluids)` 成立时直接 `return true` 跳过，品质被静默丢弃。

## 修法

在 `CopperBasinBlockEntity.acceptOutputs` 方法开头插入一次主动调用：

```java
BasinRecipeQualityContext.applyToOutputs(this, outputItems, outputFluids, simulate);
```

此时 outputFluids 还是 BasinRecipe 传进来的可变原列表，Quality Food Fluids 用它已算好的 ticket 把带品质的 `FluidStack` 写回该列表，铜工作盆随后灌罐即为带品质流体。

注入指令位于 `acceptOutputs(List, List, boolean)` 的 offset 4：

```
ALOAD 0 / ALOAD 1 / ALOAD 2 / ILOAD 3
INVOKESTATIC io/github/createdelight/qualityfoodfluids/internal/BasinRecipeQualityContext
             applyToOutputs (Lcom/simibubi/create/content/processing/basin/BasinBlockEntity;Ljava/util/List;Ljava/util/List;Z)Z
POP
```

`maxStack` 由 4 抬到 5。

## 安全性

- `CopperBasinBlockEntity` 是 `BasinBlockEntity` 子类，第一个参数类型兼容。
- `applyToOutputs` 内部有 `context == null` 守卫，从非配方路径（管道插入等）调用时直接 return true，无副作用。
- 注入点在 `outputTank.allowInsertion()` 之前、`Collections.emptyList()` 分支之外，不干扰 try/finally，也不会对不可变列表写入。

## 验证

| 层 | 内容 | 结果 |
|---|---|---|
| ① | 生成器内 roundtrip（`apply(before, diff)` == `after`） | PASS |
| ② | `ApplyBadiff` 打回 class，14742 字节 | PASS |
| ③ | `javap -p -c` 确认 `invokestatic applyToOutputs` 位于 `acceptOutputs` offset 4 | PASS |

部署到 0.5.0.15 测试服实测：铜工作盆 + 动力搅拌器产出流体已带品质。

## 影响范围

- 只影响铜工作盆（FluidLogistics）产出流体的配方，例如 cosmopolitan 的冰淇淋系列（`水果 + 冰块 + 糖 + 750mB 牛奶 → 750mB 冰淇淋`）。
- Create 原版工作盆行为不变。
- 输入流体带品质的配方同样覆盖（走 `hasQualityFluidSource` 分支）。
