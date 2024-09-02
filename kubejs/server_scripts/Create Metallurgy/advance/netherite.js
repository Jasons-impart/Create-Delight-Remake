ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "minecraft:netherite_ingot"
    ])
    e.recipes.createmetallurgy.alloying(
        Fluid.of("createdelight:molten_netherite", 27),
        [
            Fluid.of("createmetallurgy:molten_gold", 90),
            "minecraft:netherite_scrap"
        ], "superheated", 180
    ).id("createmetallurgy:alloying/molten_netherite")
    e.recipes.create.mixing(
        Fluid.of("createdelight:molten_netherite", 27),
        [
            Fluid.of("createmetallurgy:molten_gold", 90),
            "minecraft:netherite_scrap"
        ], 900, "superheated"
    ).id("createmetallurgy:mixing/molten_netherite")
    metal_production_line_3(e, 
        [
            "minecraft:netherite_block",
            "minecraft:netherite_ingot",
            "vintageimprovements:netherite_sheet",
            "createdelight:molten_netherite"
        ], "superheated", 180
    )
})