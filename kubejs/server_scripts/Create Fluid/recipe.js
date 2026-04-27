ServerEvents.recipes(e => {
    const {create, kubejs} = e.recipes
    e.replaceInput({id: "fluid:centrifugal_pump"}, "create:propeller", "create_sa:hydraulic_engine")
    e.replaceInput({id: "fluid:mechanical_pipette"}, "create:precision_mechanism", "create_sa:hydraulic_engine")
    remove_recipes_id(e, [
        "fluid:mechanical_pipette",
        "fluid:copper_tap",
        "fluid:copper_sink"
    ])
    kubejs.shaped("2x fluid:copper_tap", [
        " A ",
        "BCB",
        " D "
    ], {
        A: "create:copper_valve_handle",
        B: "create:copper_sheet",
        C: "#forge:spring/below_500",
        D: "minecraft:dried_kelp",
    }).id("createdelight:copper_tap")
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
    }).id("createdelight:mechanical_pipette")
    kubejs.shaped("fluid:copper_sink", [
        " A ",
        "BBB",
        " A "
    ], {
        A: "create:copper_sheet",
        B: "minecraft:water_bucket"
    }).replaceIngredient("minecraft:water_bucket", "minecraft:bucket")
    .id("createdelight:copper_sink")
})