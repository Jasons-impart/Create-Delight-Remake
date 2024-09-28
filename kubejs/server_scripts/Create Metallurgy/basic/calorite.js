ServerEvents.recipes(e => {
    metal_production_line_2(e, 
        [
            "ad_astra:calorite_block",
            "ad_astra:calorite_ingot",
            "ad_astra:calorite_nugget",
            "ad_astra:calorite_plate",
            "createdelight:molten_calorite"
        ], "superheated", 140
    )
    e.replaceOutput({type: "create:crushing"}, 'ad_astra:raw_calorite', "createdelight:crushed_raw_calorite")
    e.recipes.create.crushing([
        'createdelight:crushed_raw_calorite',
        Item.of("create:experience_nugget").withChance(0.75)
    ], 'ad_astra:raw_calorite').id("create:crushing/raw_calorite")
    e.recipes.create.crushing([
        '9x createdelight:crushed_raw_calorite',
        Item.of("9x create:experience_nugget").withChance(0.75)
    ], 'ad_astra:raw_calorite_block').id("create:crushing/raw_calorite_block")
    e.recipes.create.splashing([
        "9x ad_astra:calorite_nugget",
        Item.of('iceandfire:deathworm_egg').withChance(0.25)
    ], 'createdelight:crushed_raw_calorite').id("create:splashing/crushed_raw_calorite")
    e.recipes.create.milling([
        "createdelight:dirty_calorite_dust",
        Item.of("createdelight:dirty_calorite_dust").withChance(0.25)
    ], "createdelight:crushed_raw_calorite").id("createmetallurgy:milling/crushed_raw_calorite")
    e.recipes.create.splashing([
        'createdelight:calorite_dust',
        Item.of('iceandfire:deathworm_egg').withChance(0.10)
    ], "createdelight:dirty_calorite_dust").id("createmetallurgy:splashing/dirty_calorite_dust")
    e.recipes.createmetallurgy.melting(
        Fluid.of("createdelight:molten_calorite", 90),
        "createdelight:dirty_calorite_dust",
        "superheated",
        20
    ).id("createmetallurgy:melting/melting_dirty_calorite_dust")
    e.recipes.createmetallurgy.melting(
        Fluid.of("createdelight:molten_calorite", 90),
        "createdelight:calorite_dust",
        "superheated",
        20
    ).id("createmetallurgy:melting/melting_calorite_dust")
    blast_and_smelting(e, 'createdelight:crushed_raw_calorite', "ad_astra:calorite_ingot", 0.1, 100)

})