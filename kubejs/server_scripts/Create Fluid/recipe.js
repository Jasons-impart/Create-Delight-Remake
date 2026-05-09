ServerEvents.recipes(e => {
    const {create, kubejs, fluid} = e.recipes
    e.replaceInput({id: "fluid:centrifugal_pump"}, "create:propeller", "create_sa:hydraulic_engine")
    e.replaceInput({id: "fluid:mechanical_pipette"}, "create:precision_mechanism", "create_sa:hydraulic_engine")
    e.replaceInput({id: "fluid:can_filler"}, "minecraft:copper_ingot", "create:copper_sheet")
    
    remove_recipes_id(e, [
        "fluid:mechanical_pipette",
        "fluid:copper_tap",
        "fluid:copper_sink",
        "fluid:compacting/slime_ball_from_slime_fluid",
        "fluid:mixing/slime_fluid_from_slime_ball",
        "fluid:communicating_vessel",
        "fluid:fluid_atomizer",
        "fluid:freezing/breeze_rod_from_blaze_rod"
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
    
    kubejs.shaped("fluid:fluid_atomizer", [
        " A ",
        " B ",
        " C "
    ], {
        A: "create_connected:empty_fan_catalyst",
        B: "create:encased_fan",
        C: "createprism:copper_clear_glass_casing"
    }).id("createdelight:fluid_atomizer")
    
    kubejs.shaped("fluid:communicating_vessel", [
        "   ",
        "ABA",
        "   "
    ], {
        A: "createdeco:andesite_sheet",
        B: "create:fluid_pipe"
    }).id("createdelight:communicating_vessel")
    
    create.mixing(
        Fluid.of("fluid:slime_fluid", 1000),
        [
            Fluid.of("createdelightcore:slime", 500),
            Fluid.water(500)
        ]
    ).id("createdelight:mixing/slime_fluid")

    fluid.freezing("minecraft:obsidian", "minecraft:crying_obsidian")
    .id("createdelight:fluid_freezing/crying_obsidian")
    //该配方会多生成一个空桶，在流体作者修复前禁用
    /* fluid.freezing("minecraft:powder_snow_bucket", "minecraft:water_bucket")
    .id("createdelight:fluid_freezing/water_bucket") */
    fluid.freezing("minecraft:snow", "minecraft:snowball")
    .id("createdelight:fluid_freezing/snowball")
    fluid.freezing("minecraft:snow_block", "minecraft:snow")
    .id("createdelight:fluid_freezing/snow")
    e.custom({
        type: "fluid:freezing",
        ingredients: [{item: "create:blaze_cake"}],
        results: [
            {item: "create:powdered_obsidian"},
            {item: "create:cinder_flour", chance: 0.9}
        ]
    }).id("createdelight:fluid_freezing/blaze_cake")
})