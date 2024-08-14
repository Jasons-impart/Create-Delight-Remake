ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "createmetallurgy:melting/melting_tungsten",
        "createmetallurgy:casting_in_table/tungsten_plate"
    ])
    metal_production_line_2(e, 
        [
            "createmetallurgy:tungsten_block",
            'createmetallurgy:tungsten_ingot',
            "createmetallurgy:tungsten_nugget",
            'createmetallurgy:tungsten_sheet',
            "createmetallurgy:molten_tungsten"
        ], "superheated", 160
    )
    e.recipes.createmetallurgy.melting(
        Fluid.of("createmetallurgy:molten_tungsten", 90),
        'createmetallurgy:dirty_wolframite_dust',
        "superheated",
        20
    ).id("createmetallurgy:melting/melting_dirty_wolframite_dust")
    e.recipes.createmetallurgy.melting(
        Fluid.of("createmetallurgy:molten_tungsten", 90),
        'createmetallurgy:wolframite_dust',
        "superheated",
        20
    ).id("createmetallurgy:melting/melting_wolframite_dust")
})