// some_assembly_required:sandwich_spouting — 夹心注液（Create）
// 字段来自 SandwichFluidSpoutingRecipe$Serializer.fromJson：
// fluid 为 Create FluidIngredient（Fluid.of(id, amount) → {fluid, amount, nbt}）；
// result 为 ItemStack，count 必须为 1。
// KubeJS 要求必填键在前。调用：sandwich_spouting(fluid, result)
new Schema("some_assembly_required:sandwich_spouting")
    .simpleKey("fluid", "inputFluid")
    .simpleKey("result", "outputItem")
