ServerEvents.recipes(e => {
    const {create, vintageimprovements} = e.recipes
    vintageimprovements.pressurizing(Fluid.of("hotbath:hot_water_fluid", 500), Fluid.water(500))
    .id("vintageimprovements:pressurizing/hot_water_fluid")

    create.mixing(Fluid.of("hotbath:honey_bath_fluid", 1000), [Fluid.of("create:honey", 250), Fluid.of("hotbath:hot_water_fluid", 750)])
    .id("create:mixing/honey_bath_fluid")
    create.mixing(Fluid.of("hotbath:milk_bath_fluid", 1000), [Fluid.of("minecraft:milk", 500), Fluid.of("hotbath:hot_water_fluid", 500)])
    .id("create:mixing/milk_bath_fluid")
    create.mixing(Fluid.of("hotbath:peony_bath_fluid", 1000), ["2x minecraft:peony", Fluid.of("hotbath:hot_water_fluid", 1000)])
    .id("create:mixing/peony_bath_fluid")
    create.mixing(Fluid.of("hotbath:rose_bath_fluid", 1000), ["8x minecraft:rose_bush", Fluid.of("hotbath:hot_water_fluid", 1000)])
    .id("create:mixing/rose_bath_fluid")
    create.mixing(Fluid.of("hotbath:herbal_bath_fluid", 1000), ["2x hotbath:bath_herb", Fluid.of("hotbath:hot_water_fluid", 1000)])
    .id("create:mixing/herbal_bath_fluid")
})