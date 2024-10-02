ServerEvents.recipes(e => {
    metal_production_line_2(e, 
        [
            "ad_astra:ostrum_block",
            "ad_astra:ostrum_ingot",
            "ad_astra:ostrum_nugget",
            "ad_astra:ostrum_plate",
            "createdelight:molten_ostrum"
        ], "superheated", 120
    )
    e.replaceOutput({type: "create:crushing"}, 'ad_astra:raw_ostrum', "createdelight:crushed_raw_ostrum")
    e.recipes.create.crushing([
        'createdelight:crushed_raw_ostrum',
        Item.of("create:experience_nugget").withChance(0.75)
    ], 'ad_astra:raw_ostrum').id("create:crushing/raw_ostrum")
    e.recipes.create.crushing([
        '9x createdelight:crushed_raw_ostrum',
        Item.of("9x create:experience_nugget").withChance(0.75)
    ], 'ad_astra:raw_ostrum_block').id("create:crushing/raw_ostrum_block")
    e.recipes.create.splashing([
        "9x ad_astra:ostrum_nugget",
        Item.of('iceandfire:myrmex_desert_resin').withChance(0.25)
    ], 'createdelight:crushed_raw_ostrum').id("create:splashing/crushed_raw_ostrum")
    e.recipes.create.milling([
        "createdelight:dirty_ostrum_dust",
        Item.of("createdelight:dirty_ostrum_dust").withChance(0.25)
    ], "createdelight:crushed_raw_ostrum").id("createmetallurgy:milling/crushed_raw_ostrum")
    e.recipes.create.splashing([
        'createdelight:ostrum_dust',
        Item.of('iceandfire:myrmex_desert_resin').withChance(0.10)
    ], "createdelight:dirty_ostrum_dust").id("createmetallurgy:splashing/dirty_ostrum_dust")
    e.recipes.createmetallurgy.melting(
        Fluid.of("createdelight:molten_ostrum", 90),
        "createdelight:dirty_ostrum_dust",
        "superheated",
        20
    ).id("createmetallurgy:melting/melting_dirty_ostrum_dust")
    e.recipes.createmetallurgy.melting(
        Fluid.of("createdelight:molten_ostrum", 120),
        "createdelight:ostrum_dust",
        "superheated",
        20
    ).id("createmetallurgy:melting/melting_ostrum_dust")
    blast_and_smelting(e, 'createdelight:crushed_raw_ostrum', "ad_astra:ostrum_ingot", 0.1, 100)

    metal_production_line_5(e, 
        [
            "createdelight:dirty_ostrum_dust",
            "createdelight:ostrum_dust",
            "createdelight:crushed_raw_ostrum",
            "ad_astra:raw_ostrum",
            "ad_astra:ostrum_nugget"
        ]
    )
})