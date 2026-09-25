// farmersrespite:brewing — 煮茶
// base/result: {fluid: 流体ID字符串, count}，非标准 FluidStack，故用 complexKey
// 时间字段为 "brewingtime"（datagen 写的 cookingtime 解析器不读）
// 调用：brewing(base, ingredients, result, brewingtime?, experience?)
new Schema("farmersrespite:brewing")
    .complexKey("base", true, key => {
        key.addKey("fluid", "nonEmptyString")
        key.addKey("count", "intNumber")
    })
    .simpleKey("ingredients", "inputItemArray")
    .complexKey("result", true, key => {
        key.addKey("fluid", "nonEmptyString")
        key.addKey("count", "intNumber")
    })
    .simpleKey("brewingtime", "intNumber", 200, true) // tick
    .simpleKey("experience", "doubleNumber", 0, true)

// farmersrespite:kettle_pouring — 倾倒
// fluid 为流体 ID 裸字符串；output/container 须为 {"item":...} 对象
// 调用：kettle_pouring(fluid, output, container?, amount?)
new Schema("farmersrespite:kettle_pouring")
    .simpleKey("fluid", "nonEmptyString")
    .simpleKey("output", "outputItem")
    .simpleKey("container", "outputItem", "minecraft:glass_bottle")
    .simpleKey("amount", "intNumber", 250, true) // mB
