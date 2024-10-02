ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "createmetallurgy:melting/melting_copper",
        "createmetallurgy:casting_in_table/copper_plate"
    ])
    metal_production_line_2(e,
        [
            "minecraft:copper_block",
            "minecraft:copper_ingot",
            "create:copper_nugget",
            "create:copper_sheet",
            "createmetallurgy:molten_copper"
        ], "heated", 40
    )
    e.recipes.createmetallurgy.melting(
        Fluid.of("createmetallurgy:molten_copper", 90),
        "createmetallurgy:dirty_copper_dust",
        "heated",
        20
    ).id("createmetallurgy:melting/melting_dirty_copper_dust")
    e.recipes.createmetallurgy.melting(
        Fluid.of("createmetallurgy:molten_copper", 120),
        "createmetallurgy:copper_dust",
        "heated",
        20
    ).id("createmetallurgy:melting/melting_copper_dust")
    metal_production_line_5(e, 
        [
            "createmetallurgy:dirty_copper_dust",
            "createmetallurgy:copper_dust",
            "create:crushed_raw_copper",
            "minecraft:raw_copper",
            "create:copper_nugget"
        ]
    )
})