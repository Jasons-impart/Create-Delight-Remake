ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "createmetallurgy:melting/melting_iron",
        "createmetallurgy:casting_in_table/iron_plate"
    ])
    metal_production_line_2(e, 
        [
            "minecraft:iron_block",
            "minecraft:iron_ingot",
            "minecraft:iron_nugget",
            "create:iron_sheet",
            "createmetallurgy:molten_iron"
        ], "heated", 80
    )
    e.recipes.createmetallurgy.melting(
        Fluid.of("createmetallurgy:molten_iron", 90),
        "createmetallurgy:dirty_iron_dust",
        "heated",
        20
    ).id("createmetallurgy:melting/melting_dirty_iron_dust")
    e.recipes.createmetallurgy.melting(
        Fluid.of("createmetallurgy:molten_iron", 90),
        "createmetallurgy:iron_dust",
        "heated",
        20
    ).id("createmetallurgy:melting/melting_iron_dust")
})