ServerEvents.recipes(e => {
    metal_production_line_2(e,
        [
            "ad_astra:desh_block",
            "ad_astra:desh_ingot",
            "ad_astra:desh_nugget",
            "ad_astra:desh_plate",
            "createdelight:molten_desh"
        ], "superheated", 100
    )
    e.replaceOutput({ type: "create:crushing" }, "ad_astra:raw_desh", "createdelight:crushed_raw_desh")
    e.recipes.create.crushing([
        "createdelight:crushed_raw_desh",
        Item.of("create:experience_nugget").withChance(0.75)
    ], "ad_astra:raw_desh").id("create:crushing/raw_desh")
    e.recipes.create.crushing([
        "9x createdelight:crushed_raw_desh",
        Item.of("9x create:experience_nugget").withChance(0.75)
    ], "ad_astra:raw_desh_block").id("create:crushing/raw_desh_block")
    e.recipes.create.splashing([
        "9x ad_astra:desh_nugget",
        Item.of("ad_astra:cheese").withChance(0.25)
    ], "createdelight:crushed_raw_desh").id("create:splashing/crushed_raw_desh")
    e.recipes.create.milling([
        "createdelight:dirty_desh_dust",
        Item.of("createdelight:dirty_desh_dust").withChance(0.25)
    ], "createdelight:crushed_raw_desh").id("createmetallurgy:milling/crushed_raw_desh")
    e.recipes.create.splashing([
        "createdelight:desh_dust",
        Item.of("ad_astra:cheese").withChance(0.10)
    ], "createdelight:dirty_desh_dust").id("createmetallurgy:splashing/dirty_desh_dust")
    e.recipes.createmetallurgy.melting(
        Fluid.of("createdelight:molten_desh", 90),
        "createdelight:dirty_desh_dust",
        "superheated",
        20
    ).id("createmetallurgy:melting/melting_dirty_desh_dust")
    e.recipes.createmetallurgy.melting(
        Fluid.of("createdelight:molten_desh", 120),
        "createdelight:desh_dust",
        "superheated",
        20
    ).id("createmetallurgy:melting/melting_desh_dust")
    blast_and_smelting(e, "createdelight:crushed_raw_desh", "ad_astra:desh_ingot", 0.1, 100)
    metal_production_line_5(e,
        [
            "createdelight:dirty_desh_dust",
            "createdelight:desh_dust",
            "createdelight:crushed_raw_desh",
            "ad_astra:raw_desh",
            "ad_astra:desh_nugget"
        ]
    )
})