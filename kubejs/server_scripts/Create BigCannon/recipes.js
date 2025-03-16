ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "createbigcannons:compacting/forge_nethersteel_nugget",
        "quark:building/crafting/compressed/gunpowder_sack_uncompress"
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
        "createbigcannons:guncotton",
        [
            Fluid.of("alexscaves:acid", 100),
            "minecraft:gunpowder",
            "minecraft:paper"
        ]
    ).id("createbigcannons:mixing/guncotton")
    e.recipes.create.mixing(
        "createbigcannons:guncotton",
        [
            Fluid.of("vintageimprovements:sulfuric_acid", 100),
            "minecraft:gunpowder",
            "minecraft:paper"
        ]
    ).id("createbigcannons:mixing/guncotton_1")
    e.recipes.create.mixing(
        "createbigcannons:guncotton",
        [
            Fluid.of("alexscaves:acid", 100),
            Fluid.of("supplementaries:lumisene", 100),
            "minecraft:paper"
        ]
    ).id("createbigcannons:mixing/guncotton_2")
    e.recipes.create.mixing(
        "createbigcannons:guncotton",
        [
            Fluid.of("vintageimprovements:sulfuric_acid", 100),
            Fluid.of("supplementaries:lumisene", 100),
            "minecraft:paper"
        ]
    ).id("createbigcannons:mixing/guncotton_3")
})