// 木桶：barrel(result, carrier, ingredients?, fluid?, unit_time?)
// carrier 为装瓶容器，ingredients 最多 4 项；fluid 为裸流体 ID，unit_time 为正整数 tick。
new Schema("kaleidoscope_tavern:barrel")
    .simpleKey("result", "outputItem")
    .simpleKey("carrier", "inputItem")
    .simpleKey("ingredients", "inputItemArray", [])
    .simpleKey("fluid", "nonEmptyString", "minecraft:water")
    .simpleKey("unit_time", "intNumber", 2400)

// 压榨桶：pressing_tub(fluid, ingredient, fluid_amount?)
// fluid 为裸流体 ID，fluid_amount 单位为 mB。
// 原生 fluid 默认水；schema 可选字段须排在必填字段后，此处需显式传入流体输出。
new Schema("kaleidoscope_tavern:pressing_tub")
    .simpleKey("fluid", "nonEmptyString")
    .simpleKey("ingredient", "inputItem")
    .simpleKey("fluid_amount", "intNumber", 125)

// 调酒器：shaker(result, ingredients?)，ingredients 最多 3 项。
new Schema("kaleidoscope_tavern:shaker")
    .simpleKey("result", "outputItem")
    .simpleKey("ingredients", "inputItemArray", [])
