ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "ad_astra:alloying/steel_ingot_from_alloying_iron_ingot_and_coals",
        "ad_astra:steel_ingot_from_steel_block",
        "ad_astra:steel_ingot",
        "ad_astra:steel_rod",
        "ad_astra:steel_nugget",
        "createmetallurgy:melting/melting_steel",
        "createmetallurgy:steel_ingots_from_block",
        "createmetallurgy:steel_block_from_steel_ingots"
    ])
    metal_production_line_2(e, [
        "createmetallurgy:steel_block",
        "createmetallurgy:steel_ingot",
        "ad_astra:steel_nugget",
        "ad_astra:steel_plate",
        "createmetallurgy:molten_steel"
    ], "superheated", 100)
    e.recipes.createmetallurgy.melting(
        Fluid.of("createmetallurgy:molten_steel", 10),
        "createbigcannons:steel_scrap",
        "superheated",
        50
    ).id("createmetallurgy:melting/steel_nugget_2")
    e.recipes.create.mixing(
        Fluid.of("createmetallurgy:molten_steel", 90),
        [
            Fluid.of("createmetallurgy:molten_iron", 90),
            "createmetallurgy:coke"
        ], 250, "superheated"
    ).id("createmetallurgy:mixing/molten_steel")
})