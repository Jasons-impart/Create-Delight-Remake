ServerEvents.tags("fluid", event => {
    global.CDAlcoholWorts.forEach(wort => {
        event.add("quality_food_fluids:quality_fluids", wort.fluid)
        let fluid = global.CDServerJavaClasses.$ForgeRegistries.FLUIDS.getValue(
            global.CDServerJavaClasses.$ResourceLocation.tryParse(wort.fluid))
        if (fluid instanceof global.CDServerJavaClasses.$FlowingFluid) {
            event.add("quality_food_fluids:quality_fluids",
                global.CDServerJavaClasses.$ForgeRegistries.FLUIDS.getKey(fluid.getFlowing()).toString())
        }
    })
    global.CDAlcoholDrinks.forEach(drink => {
        if (!Item.exists(drink.item)) return
        event.add("quality_food_fluids:quality_fluids", drink.fluid)
        // 从实际 FlowingFluid family 获取变体，不猜测各模组的命名。
        let fluid = global.CDServerJavaClasses.$ForgeRegistries.FLUIDS.getValue(
            global.CDServerJavaClasses.$ResourceLocation.tryParse(drink.fluid))
        if (fluid instanceof global.CDServerJavaClasses.$FlowingFluid) {
            event.add("quality_food_fluids:quality_fluids",
                global.CDServerJavaClasses.$ForgeRegistries.FLUIDS.getKey(fluid.getFlowing()).toString())
        }
    })
    global.CDRemovedWineCups.forEach(id => {
        event.remove("quality_food_fluids:quality_fluids", id)
        let fluid = global.CDServerJavaClasses.$ForgeRegistries.FLUIDS.getValue(
            global.CDServerJavaClasses.$ResourceLocation.tryParse(id))
        if (fluid instanceof global.CDServerJavaClasses.$FlowingFluid) {
            event.remove("quality_food_fluids:quality_fluids",
                global.CDServerJavaClasses.$ForgeRegistries.FLUIDS.getKey(fluid.getFlowing()).toString())
        }
    })
})

ServerEvents.tags("item", event => {
    event.add("createdelight:tavern_yeast", "createdelight:dry_yeast")
    event.add("createdelight:tavern_fermented_drinks", global.CDTavernFermentedDrinks)
})
