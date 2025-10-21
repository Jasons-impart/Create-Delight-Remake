ServerEvents.recipes(e => {
    const {create, kubejs} = e.recipes
    e.replaceInput({id: "fluid:centrifugal_pump"}, "create:propeller", "create_sa:hydraulic_engine")
    e.replaceInput({id: "fluid:mechanical_pipette"}, "create:precision_mechanism", "create_sa:hydraulic_engine")
    remove_recipes_id(e, [
        "fluid:mechanical_pipette"
    ])

    kubejs.shaped("fluid:pipette", [
        "AAB",
        "AC ",
        "DE "
    ], {
        A: "create:brass_sheet",
        B: "minecraft:copper_ingot",
        C: "#forge:spring/between_500_2_1000",
        D: "create_sa:hydraulic_engine",
        E: "create:brass_casing"
    }).id("fluid:mechanical_pipette")
})