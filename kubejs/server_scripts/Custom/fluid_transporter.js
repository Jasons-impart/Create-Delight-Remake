ServerEvents.recipes(e => {
    // e.recipes.kubejs.shapeless("fluid_transporter:fluid_transporter", ["supplementaries:faucet", "create_sa:large_fueling_tank"])
    // .id("fluid_transporter:fluid_transporter")
    e.recipes.create.filling(
        'fluidlogistics:multi_fluid_tank',
        [
            'create:fluid_tank',
            Fluid.of("createmetallurgy:molten_brass", 270)
        ]
    ).id("createdelight:multi_fluid_tank")

    e.recipes.create.filling(
        'fluidlogistics:horizontal_multi_fluid_tank',
        [
            'create_connected:fluid_vessel',
            Fluid.of("createmetallurgy:molten_brass", 270)
        ]
    ).id("createdelight:horizontal_multi_fluid_tank")
})