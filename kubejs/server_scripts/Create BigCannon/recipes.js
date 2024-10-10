ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "createbigcannons:compacting/forge_nethersteel_nugget",
        "createbigcannons:mixing/alloy_nethersteel_steel",
        "createbigcannons:compacting/forge_nethersteel_ingot"
    ])    
    e.recipes.createmetallurgy.alloying(
        Fluid.of("createbigcannons:molten_nethersteel", 30),
        [
            Fluid.of("createmetallurgy:molten_steel", 15),
            Fluid.of("createdelight:molten_netherite", 15)
        ], "superheated", 180
    ).id("createmetallurgy:alloying/molten_nethersteel")
    metal_production_line_6(e, [
        "createbigcannons:nethersteel_block",
        "createbigcannons:nethersteel_ingot",
        "createbigcannons:nethersteel_nugget",
        "vintageimprovements:nethersteel_sheet",
        "vintageimprovements:nethersteel_rod",
        "vintageimprovements:nethersteel_wire",
        "createbigcannons:molten_nethersteel"
    ], "heated", 80)
})