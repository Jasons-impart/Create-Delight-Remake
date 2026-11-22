// priority: 1050
if (global.CDStartupJavaClasses.$ItemFluidContainers) {
    global.CDAlcoholDrinks.concat([global.CDVinegar]).forEach(drink => {
        global.CDStartupJavaClasses.$ItemFluidContainers.registerIfPresent(
            drink.item, drink.fluid, drink.amount, drink.container
        )
    })
}
