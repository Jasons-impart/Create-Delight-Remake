ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "createmetallurgy:melting/melting_zinc",
        "createmetallurgy:casting_in_table/zinc_plate"
    ])
    metal_production_line_2(e, 
        [
            "create:zinc_block",
            'create:zinc_ingot',
            "create:zinc_nugget",
            'createaddition:zinc_sheet',
            "createmetallurgy:molten_zinc"
        ], "heated", 80
    )
    e.recipes.createmetallurgy.melting(
        Fluid.of("createmetallurgy:molten_zinc", 90),
        "createmetallurgy:dirty_zinc_dust",
        "heated",
        20
    ).id("createmetallurgy:melting/melting_dirty_zinc_dust")
    e.recipes.createmetallurgy.melting(
        Fluid.of("createmetallurgy:molten_zinc", 90),
        "createmetallurgy:zinc_dust",
        "heated",
        20
    ).id("createmetallurgy:melting/melting_zinc_dust")
})