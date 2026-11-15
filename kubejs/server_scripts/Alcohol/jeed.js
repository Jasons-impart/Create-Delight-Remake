ServerEvents.recipes(event => {
    if (!Platform.isLoaded("jeed")) return
    jeed_effect_provider(event, "youkaishomecoming:drunk", {
        providers: ["#createdelight:order/wine"],
        fluid_providers: global.CDAlcoholDrinks.filter(drink => Item.exists(drink.item))
            .map(drink => drink.fluid)
    }).id("createdelight:jeed/alcohol/drunk")
    const nativeProviders = {}
    global.CDAlcoholDrinks.forEach(drink => {
        if (!Item.exists(drink.item) || !drink.tooltipEffects) return
        drink.tooltipEffects.forEach(effect => {
            if (!nativeProviders[effect.effect]) nativeProviders[effect.effect] = []
            nativeProviders[effect.effect].push(drink.item)
        })
    })
    Object.keys(nativeProviders).forEach(effect => {
        jeed_effect_provider(event, effect, {providers: nativeProviders[effect]})
            .id("createdelight:jeed/alcohol/native/" + effect.replace(":", "/"))
    })
})
