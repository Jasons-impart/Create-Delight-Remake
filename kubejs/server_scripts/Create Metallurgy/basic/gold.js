ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "createmetallurgy:melting/melting_gold",
        "createmetallurgy:casting_in_table/gold_plate"
    ])
    metal_production_line_2(e,
        [
            "minecraft:gold_block",
            "minecraft:gold_ingot",
            "minecraft:gold_nugget",
            "create:golden_sheet",
            "createmetallurgy:molten_gold"
        ], "heated", 40
    )
    metal_production_line_5(e, 
        [
            "createmetallurgy:dirty_gold_dust",
            "createmetallurgy:gold_dust",
            "create:crushed_raw_gold",
            "minecraft:raw_gold",
            "minecraft:gold_nugget"
        ]
    )
    e.recipes.createmetallurgy.melting(
        Fluid.of("createmetallurgy:molten_gold", 90),
        "createmetallurgy:dirty_gold_dust",
        "heated",
        20
    ).id("createmetallurgy:melting/melting_dirty_gold_dust")
    e.recipes.createmetallurgy.melting(
        Fluid.of("createmetallurgy:molten_gold", 120),
        "createmetallurgy:gold_dust",
        "heated",
        20
    ).id("createmetallurgy:melting/melting_gold_dust")
})