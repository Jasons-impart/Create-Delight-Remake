// priority: -1100
// 最后清理，避免各模组原生配方或统一物流补缺再次引入已退出的强化苹果酒。
ServerEvents.recipes(event => {
    const removed = ["farmersrespite:strong_apple_cider", "farmersrespite:long_apple_cider"]
    const ids = []
    event.forEachRecipe({}, recipe => {
        const json = recipe.json.toString()
        if (removed.some(id => json.indexOf('"' + id + '"') !== -1)) ids.push(recipe.getId())
    })
    remove_recipes_id(event, ids)
})

ServerEvents.tags("item", event => {
    event.removeAllTagsFrom(["farmersrespite:strong_apple_cider", "farmersrespite:long_apple_cider"])
})

ServerEvents.tags("fluid", event => {
    ;["farmersrespite:strong_apple_cider", "farmersrespite:long_apple_cider"].forEach(id => {
        event.remove("quality_food_fluids:quality_fluids", id)
        let fluid = global.CDServerJavaClasses.$ForgeRegistries.FLUIDS.getValue(
            global.CDServerJavaClasses.$ResourceLocation.tryParse(id))
        if (fluid instanceof global.CDServerJavaClasses.$FlowingFluid) {
            event.remove("quality_food_fluids:quality_fluids",
                global.CDServerJavaClasses.$ForgeRegistries.FLUIDS.getKey(fluid.getFlowing()).toString())
        }
    })
})
