// brewinandchewin:keg_pouring — 酒桶灌注
// 字段来自 KegPouringRecipe$Serializer.fromJson。
// KubeJS 要求必填键在前、可选键在后。
// 调用：keg_pouring(fluid, output, amount, filling, container, strict)
new Schema("brewinandchewin:keg_pouring")
    // 流体 ID 裸字符串，如 "create:honey"（不是 FluidStack，不要写 amount）
    .simpleKey("fluid", "nonEmptyString")
    // 产出物品（ItemStack JSON：item/count/nbt）
    .simpleKey("output", "outputItem")
    // 每次灌注的流体数量（mB），默认 250
    .simpleKey("amount", "intNumber", 250)
    // true=装桶（流体→容器物品）；false=倒出（容器物品→流体），默认 true
    .simpleKey("filling", "bool", true)
    // 空容器物品；可省略，但 output 无 crafting remainder 时必填
    // （例如蜂蜜瓶自带 remainder 玻璃瓶，可不写；蜂巢需显式指定）
    .simpleKey("container", "outputItem", null)
    // true=流体必须完全匹配；false=允许部分/模糊匹配，默认 false
    .simpleKey("strict", "bool", false)
