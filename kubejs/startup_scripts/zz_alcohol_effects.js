// priority: -100
// CDC 统一完成饮用；FoodBuilder 只配置食品条目，避免原生与公共钩子重复叠加。
ItemEvents.modification(event => {
    if (!Platform.isLoaded("youkaishomecoming")) return


    global.CDAlcoholDrinks.forEach(drink => {
        if (!Item.exists(drink.item)) return
        global.CDStartupJavaClasses.$AlcoholDrinks.registerFluid(drink.fluid)
        event.modify(drink.item, item => {
            global.CDStartupJavaClasses.$AlcoholDrinks.registerDrink(drink.item, 2000, 0)
            if (drink.tooltipEffects) drink.tooltipEffects.forEach(effect => {
                global.CDStartupJavaClasses.$AlcoholDrinks.registerTooltipEffect(
                    drink.item, effect.effect, effect.duration, effect.amplifier)
            })
            if (item.getFoodProperties() !== null) {
                item.foodProperties = new global.CDStartupJavaClasses.$FoodBuilder(item.getFoodProperties())
                    .removeEffect("youkaishomecoming:drunk")
                    .removeEffect("brewinandchewin:tipsy")
                    .removeEffect("brewinandchewin:intoxication")
                    .build()
                if (drink.removeNausea) {
                    item.foodProperties = new global.CDStartupJavaClasses.$FoodBuilder(item.getFoodProperties())
                        .removeEffect("minecraft:nausea")
                        .build()
                }
            }
        })
    })
    global.CDRemovedWineItems.forEach(id => {
        event.modify(id, item => {
            if (item.getFoodProperties() !== null) {
                item.foodProperties = new global.CDStartupJavaClasses.$FoodBuilder(item.getFoodProperties())
                    .removeEffect("youkaishomecoming:drunk")
                    .removeEffect("youkaishomecoming:earthy")
                    .removeEffect("youkaishomecoming:enjoyable")
                    .build()
            }
        })
    })
})
