ServerEvents.recipes(e => {
    // 腊肠
    e.recipes.vintagedelight.fermenting(
        '5x createdelight:salami',
        [
            'ratatouille:raw_sausage',
            'ratatouille:raw_sausage',
            'ratatouille:raw_sausage',
            'ratatouille:raw_sausage',
            'ratatouille:raw_sausage',
            "#forge:salt"
        ], 5000
    ).id("vintagedelight:fermenting/salami")
    // 黄瓜
    remove_recipes_id(e, [
        "culturaldelights:cucumber_crate",
        "culturaldelights:from_crate/cucumber",
        
    ])
    e.replaceInput({mod: "culturaldelights"}, "culturaldelights:cucumber", "vintagedelight:cucumber")
    e.replaceInput({mod: "vintagedelight"}, "vintagedelight:pickle", "#forge:pickle")
    e.recipes.kubejs.shapeless(
        'vintagedelight:cucumber_crate',
        "9x vintagedelight:cucumber"
    ).id("vintagedelight:cucumber_crate")
    e.recipes.vintagedelight.fermenting(
        "culturaldelights:pickle",
        [
            "vintagedelight:cucumber",
            "vintagedelight:cucumber",
            "vintagedelight:cucumber",
            "vintagedelight:cucumber",
            "vintagedelight:cucumber",
            "#forge:salt"
        ], 6000
    ).id("vintagedelight:fermenting/pickle_from_fermenting")
    e.recipes.vintagedelight.fermenting(
        "culturaldelights:cut_pickle",
        [
            "culturaldelights:cut_cucumber",
            "culturaldelights:cut_cucumber",
            "culturaldelights:cut_cucumber",
            "culturaldelights:cut_cucumber",
            "culturaldelights:cut_cucumber",
            "#forge:salt"
        ], 3000
    ).id("vintagedelight:fermenting/cut_pickle_from_fermenting")

    e.recipes.farmersdelight.cutting(
        "culturaldelights:wild_cucumbers",
        "#forge:tools/knives",
        [
            "vintagedelight:cucumber_seeds",
            "minecraft:green_dye"
        ]
    ).id("culturaldelights:cutting/wild_cucumbers")
    e.recipes.farmersdelight.cutting(
        "culturaldelights:cut_cucumber",
        "#forge:tools/knives",
        "vintagedelight:cucumber_noodles"
    ).id("vintagedelight:cutting/cucumber_cutting")
    // 盐
    e.recipes.create.mixing(
        'vintagedelight:salt_dust',
        Fluid.of("water", 250)
    )
    .heated()
    .id("ratatouille:salt")
    e.recipes.kubejs.shapeless(
        '4x vintagedelight:salt_dust',
        'vintagedelight:salt_bucket'
    ).id("vintagedelight:salt_bucket_to_salt")
    // 腌制
    e.recipes.vintagedelight.fermenting(
        '5x festival_delicacies:preserved_meat',
        [
            "#forge:raw_pork",
            "#forge:raw_pork",
            "#forge:raw_pork",
            "#forge:raw_pork",
            "#forge:raw_pork",
            "#forge:salt"
        ], 5000
    ).id("vintagedelight:fermenting/preserved_meat")
    e.recipes.vintagedelight.fermenting(
        "vintagedelight:century_egg",
        [
            "minecraft:sniffer_egg",
            "#forge:ash",
            "#forge:salt"
        ], 72000
    ).id("vintagedelight:fermenting/century_egg_from_fermenting")
})