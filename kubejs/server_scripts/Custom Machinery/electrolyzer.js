ServerEvents.recipes(e => {
    e.recipes.custommachinery.custom_machine("createdelight:electrolyzer", 20)
        .priority(1)
        .produceFluid(Fluid.of("ad_astra:oxygen", 30))
        .produceFluid(Fluid.of("ad_astra:hydrogen", 60))
        .requireFluid(Fluid.of("minecraft:water", 100))
        .requireEnergy(200)
        .jei()
})