// priority: -1000
// 在各模组处理原生配方之后补充酒类装排液。
ServerEvents.recipes(event => {
    global.CDAlcoholDrinks.forEach(drink => {
        if (!Item.exists(drink.item)) return
        alcohol_bottling(event, drink)
    })
})

/** 补充单款酒缺少的 Create 装排液与 FR/B&C 倒酒配方，配方路径保留物品命名空间。 */
function alcohol_bottling(event, drink) {
    const item = drink.item
    const itemPath = item.replace(":", "/")
    let hasFilling = false
    let hasEmptying = false
    event.forEachRecipe({type: "create:filling", output: item}, () => { hasFilling = true })
    event.forEachRecipe({type: "create:emptying", input: item}, () => { hasEmptying = true })
    if (!hasFilling) {
        event.recipes.create.filling(item, [drink.container, Fluid.of(drink.fluid, drink.amount)])
            .id(drink.fillingId || "createdelight:alcohol/filling/" + itemPath)
    }
    if (!hasEmptying) {
        event.recipes.create.emptying([drink.container, Fluid.of(drink.fluid, drink.amount)], item)
            .id(drink.emptyingId || "createdelight:alcohol/emptying/" + itemPath)
    }
    pouring(event, item, drink.fluid, drink.container, drink.amount, "alcohol/" + itemPath, true)
}
