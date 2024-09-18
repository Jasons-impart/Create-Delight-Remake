ServerEvents.recipes(e => {
    e.recipes.custommachinery.custom_machine("createdelight:alloy_electric_furnace", 80)
        .priority(1)
        .produceItem("2x create:brass_ingot")
        .requireItem("minecraft:copper_ingot")
        .requireItem("create:zinc_ingot")
        .requireEnergy(1000)
        .jei()
})