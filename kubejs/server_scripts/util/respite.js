/**
 * 煮茶 + 倾倒：注册一条 brewing 煮制配方，并配套一条 kettle_pouring 倾倒配方（流体 → 瓶装物品）
 * @param { Internal.RecipesEventJS_ } event
 * @param { Internal.FluidStackJS_ } base 基础流体（煮制输入），如 "minecraft:water"
 * @param { InputItem_[] } inputs 配料，最多 2 个，支持物品 ID 或 "#tag" 标签写法
 * @param { Internal.FluidStackJS_ } fluid 煮出的流体，如 "createdelight:espresso_fluid"
 * @param { OutputItem_ } output 倾倒产出的瓶装物品，如 "youkaishomecoming:espresso"
 * @param { number } amount 流体数量（mB），base/result 共用，default 1000
 * @param { number } time 煮制时间（tick），default 200
 * @param { number } exp 给予的经验，default 0.35
 */
function brewingAndPouring(event, base, inputs, fluid, output, amount, time, exp) {
    amount = amount || 1000
    time = time || 200
    exp = exp || 0.35
    event.recipes.farmersrespite.brewing({ fluid: base, count: amount }, inputs, { fluid: fluid, count: amount }, time, exp)
        .id(`createdelight:brewing/${output.split(":")[1]}_from_${base.split(":")[1]}`)
    event.recipes.farmersrespite.kettle_pouring(fluid, output, "minecraft:glass_bottle", 250)
        .id(`createdelight:pouring/${output.split(":")[1]}_from_${base.split(":")[1]}`)
}

/**
 * 倾倒：注册 kettle_pouring（流体 → 瓶装物品）和 keg_pouring 灌注配方各一条
 * @param {Internal.RecipesEventJS_} event
 * @param {InputItem_} input 倾倒产出的瓶装物品，如 "vinery:apple_juice"
 * @param {Internal.FluidStackJS_} fluid 倾倒的流体，如 "createdelight:apple_juice"
 * @param {InputItem_} [container] 空容器，默认 "minecraft:glass_bottle"
 * @param {number} [amount] 每次倾倒的流体数量（mB），default 250
 */
function pouring(event, input, fluid, container, amount) {
    let ingr = Ingredient.of(input)
    let con = container || "minecraft:glass_bottle"
    amount = amount || 250
    event.recipes.farmersrespite.kettle_pouring(fluid, input, con, amount)
        .id(`createdelight:pouring/${ingr.getFirst().getId().split(":")[1]}`)
    event.recipes.brewinandchewin.keg_pouring(fluid, input, amount, true, con, false)
        .id(`createdelight:keg_pouring/${ingr.getFirst().getId().split(":")[1]}`)
}