ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "createbigcannons:compacting/forge_nethersteel_nugget",
        "quark:building/crafting/compressed/gunpowder_sack_uncompress",
        "createbigcannons:mixing/guncotton"
    ])
    e.recipes.createmetallurgy.alloying(
        Fluid.of("createbigcannons:molten_nethersteel", 90),
        [
            Fluid.of("createmetallurgy:molten_steel", 15),
            Fluid.of("createmetallurgy:molten_netherite", 15)
        ], 180, "superheated"
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
    e.recipes.create.mixing(
        "4x createbigcannons:guncotton",
        [
            FluidIngredients("createdelight:acid", 100),
            "minecraft:gunpowder",
            "minecraft:paper"
        ]
    ).id("createbigcannons:mixing/guncotton_paper_gunpowder")
    e.recipes.create.mixing(
        "4x createbigcannons:guncotton",
        [
            FluidIngredients("createdelight:acid", 100),
            Fluid.of("supplementaries:lumisene", 100),
            "minecraft:paper"
        ]
    ).id("createbigcannons:mixing/guncotton_paper_lumisene")

    e.recipes.create.mixing(
        "16x createbigcannons:guncotton",
        [
            FluidIngredients("createdelight:acid", 100),
            "minecraft:gunpowder",
            "kinetic_pixel:graycotton"
        ]
    ).id("createbigcannons:mixing/guncotton_graycotton_gunpowder")
    e.recipes.create.mixing(
        "16x createbigcannons:guncotton",
        [
            FluidIngredients("createdelight:acid", 100),
            Fluid.of("supplementaries:lumisene", 100),
            "kinetic_pixel:graycotton"
        ]
    ).id("createbigcannons:mixing/guncotton_graycotton_lumisene")
    
    e.recipes.createmetallurgy.melting(Fluid.of("createmetallurgy:molten_bronze", 10), "createbigcannons:bronze_scrap")
    .id("createbigcannon:melting/bronze_scrap")
    e.recipes.createmetallurgy.melting(Fluid.of("createmetallurgy:molten_steel", 10), "createbigcannons:steel_scrap")
    .id("createbigcannon:melting/steel_scrap")
    e.recipes.kubejs.shapeless("createdelightcore:bronze_ingot", "9x createbigcannons:bronze_scrap")
    .id("createdelightcore:bronze_ingot_from_bronze_scrap")
    e.recipes.kubejs.shapeless("createmetallurgy:steel_ingot", "9x createbigcannons:steel_scrap")
    .id("createdelightcore:steel_ingot_from_steel_scrap")
    metal_production_line_6(e, [
        "createbigcannons:cast_iron_block",
        "createbigcannons:cast_iron_ingot",
        "createbigcannons:cast_iron_nugget",
        "vintageimprovements:cast_iron_sheet",
        "vintageimprovements:cast_iron_rod",
        "vintageimprovements:cast_iron_wire",
        "createbigcannons:molten_cast_iron"
    ], "heated", 80)
})