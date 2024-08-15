ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "create:mixing/brass_ingot",
        "createmetallurgy:melting/melting_brass",
        "create:crafting/materials/brass_block_from_compacting",
        "create:crafting/materials/brass_ingot_from_compacting",
        "create:crafting/materials/brass_ingot_from_decompacting",
        "create:crafting/materials/brass_nugget_from_decompacting",
        "createmetallurgy:casting_in_table/brass_plate"
    ])
    metal_production_line(e, [
        "create:brass_block",
        "create:brass_ingot",
        "create:brass_nugget",
        "create:brass_sheet",
        "createmetallurgy:molten_brass"
    ], "heated", 40)
    e.recipes.createmetallurgy.alloying(
        Fluid.of("createmetallurgy:molten_brass", 30),
        [
            Fluid.of("createmetallurgy:molten_copper", 15),
            Fluid.of("createmetallurgy:molten_zinc", 15)
        ], "superheated", 50
    ).id("createmetallurgy:alloying/alloying_brass")
})