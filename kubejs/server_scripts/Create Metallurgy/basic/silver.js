ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "create:smelting/silver_ingot_compat_iceandfire",
        "create:blasting/silver_ingot_compat_iceandfire",
        "create:splashing/iceandfire/crushed_raw_silver"
    ])
    metal_production_line_2(e,
        [
            "iceandfire:silver_block",
            "iceandfire:silver_ingot",
            "iceandfire:silver_nugget",
            "vintageimprovements:silver_sheet",
            "createdelight:molten_sliver"
        ], "heated", 40
    )
    e.recipes.create.splashing([
        "9x iceandfire:silver_nugget",
        Item.of("vintageimprovements:sulfur_chunk").withChance(0.75)
    ], "create:crushed_raw_silver").id("create:splashing/crushed_raw_silver")
    e.recipes.create.milling([
        "createdelight:dirty_silver_dust",
        Item.of("createdelight:dirty_silver_dust").withChance(0.25)
    ], "create:crushed_raw_silver").id("createmetallurgy:milling/crushed_raw_silver")
    e.recipes.create.splashing([
        "createdelight:silver_dust",
        Item.of("vintageimprovements:sulfur_chunk").withChance(0.50)
    ], "createdelight:dirty_silver_dust").id("createmetallurgy:splashing/dirty_silver_dust")
    e.recipes.createmetallurgy.melting(
        Fluid.of("createdelight:molten_sliver", 90),
        "createdelight:dirty_silver_dust",
        "heated",
        20
    ).id("createmetallurgy:melting/melting_dirty_silver_dust")
    e.recipes.createmetallurgy.melting(
        Fluid.of("createdelight:molten_sliver", 120),
        "createdelight:silver_dust",
        "heated",
        20
    ).id("createmetallurgy:melting/melting_silver_dust")
    blast_and_smelting(e, "create:crushed_raw_silver", "iceandfire:silver_ingot", 0.1, 100)

    metal_production_line_5(e,
        [
            "createdelight:dirty_silver_dust",
            "createdelight:silver_dust",
            "create:crushed_raw_silver",
            "iceandfire:raw_silver",
            "iceandfire:silver_nugget"
        ]
    )
})
