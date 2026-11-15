// priority: -1000
// 在原生配方与各模组替换脚本之后补缺，保留已有容量/容器及配方。
ServerEvents.recipes(event => {
    global.CDAlcoholDrinks.forEach(drink => {
        if (!Item.exists(drink.item)) return
        alcohol_bottling(event, drink.item, drink.fluid, drink.amount, drink.container)
    })
})

/** 补充单款酒缺少的 Create 装排液与 FR/B&C 倒酒配方，配方路径保留物品命名空间。 */
function alcohol_bottling(event, item, fluid, amount, container) {
    let hasFilling = false
    let hasEmptying = false
    let path = "alcohol/" + item.replace(":", "/")
    event.forEachRecipe({type: "create:filling", output: item}, () => { hasFilling = true })
    event.forEachRecipe({type: "create:emptying", input: item}, () => { hasEmptying = true })
    if (!hasFilling) {
        event.recipes.create.filling(item, [container, Fluid.of(fluid, amount)])
            .id("createdelight:alcohol/filling/" + item.replace(":", "/"))
    }
    if (!hasEmptying) {
        event.recipes.create.emptying([container, Fluid.of(fluid, amount)], item)
            .id("createdelight:alcohol/emptying/" + item.replace(":", "/"))
    }
    pouring(event, item, fluid, container, amount, path, true)
}
