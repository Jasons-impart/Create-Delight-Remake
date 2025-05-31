ServerEvents.recipes(e => {
    // e.recipes.kubejs.shapeless("fluid_transporter:fluid_transporter", ["supplementaries:faucet", "create_sa:large_fueling_tank"])
    // .id("fluid_transporter:fluid_transporter")
    e.recipes.create.filling(
        'createfluidstuffs:multi_fluid_tank',
        [
            'create:fluid_tank',
            Fluid.of("createmetallurgy:molten_brass", 270)
        ]
    ).id("createfluidstuffs:multi_fluid_tank")
})