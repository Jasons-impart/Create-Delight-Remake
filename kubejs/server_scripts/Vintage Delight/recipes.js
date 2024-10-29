ServerEvents.tags("item", e => {
    //腌渍乐事种子添加种子tag
    e.add("forge:seeds", "vintagedelight:oat_seeds")
    e.add("forge:seeds", "vintagedelight:peanut")
    e.add("forge:seeds", "vintagedelight:cucumber_seeds")
    e.add("forge:seeds", "vintagedelight:ghost_pepper_seeds")
    e.add("forge:seeds", "vintagedelight:gearo_berry")
})
ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "culturaldelights:cutting/wild_cucumbers",
        "vintagedelight:cutting/cucumber_cutting",
        "culturaldelights:cutting/cut_cucumber",
    ])
    e.replaceOutput({id: "vintagedelight:fermenting/fermented_spider_eye_from_fermenting"}, "vintagedelight:pickle", "minecraft:fermented_spider_eye")
    e.replaceInput({}, 'farmersdelight:raw_pasta', "#forge:pasta")
    // 腊肠
    e.recipes.vintagedelight.fermenting(
        "5x createdelight:salami",
        [
            "ratatouille:raw_sausage",
            "ratatouille:raw_sausage",
            "ratatouille:raw_sausage",
            "ratatouille:raw_sausage",
            "ratatouille:raw_sausage",
            "#forge:salt"
        ], 5000
    ).id("vintagedelight:fermenting/salami")
    // 黄瓜
    remove_recipes_id(e, [
        "culturaldelights:cucumber_crate",
        "culturaldelights:from_crate/cucumber",

    ])
    e.replaceInput({ mod: "culturaldelights" }, "culturaldelights:cucumber", "vintagedelight:cucumber")
    e.replaceInput({ mod: "vintagedelight" }, "vintagedelight:pickle", "#forge:pickle")
    e.recipes.kubejs.shapeless(
        "vintagedelight:cucumber_crate",
        "9x vintagedelight:cucumber"
    ).id("vintagedelight:cucumber_crate")
    e.recipes.vintagedelight.fermenting(
        "5x culturaldelights:pickle",
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
        "5x culturaldelights:cut_pickle",
        [
            "culturaldelights:cut_cucumber",
            "culturaldelights:cut_cucumber",
            "culturaldelights:cut_cucumber",
            "culturaldelights:cut_cucumber",
            "culturaldelights:cut_cucumber",
            "#forge:salt"
        ], 3000
    ).id("vintagedelight:fermenting/cut_pickle_from_fermenting")
    cutting(e, "culturaldelights:wild_cucumbers", [
        ["vintagedelight:cucumber_seeds"],
        ["minecraft:green_dye"]
    ])
    cutting(e, "culturaldelights:cut_cucumber", [["vintagedelight:cucumber_noodles"]])
    cutting(e, "vintagedelight:cucumber", [["culturaldelights:cut_cucumber", 2]])
    // 盐
    e.recipes.create.mixing(
        "vintagedelight:salt_dust",
        Fluid.of("water", 250)
    )
        .heated()
        .id("ratatouille:salt")
    e.recipes.kubejs.shapeless(
        "4x vintagedelight:salt_dust",
        "vintagedelight:salt_bucket"
    ).id("vintagedelight:salt_bucket_to_salt")
    // 腌制
    e.recipes.vintagedelight.fermenting(
        "5x festival_delicacies:preserved_meat",
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
    e.recipes.vintagedelight.fermenting(
        "vintagedelight:century_egg",
        [
            "#forge:dragonegg",
            "#forge:ash",
            "#forge:salt"
        ], 72000
    ).id("vintagedelight:fermenting/century_egg_from_dragonegg")
    e.recipes.vintagedelight.fermenting(
        "vintagedelight:century_egg",
        [
            "alexsmobs:emu_egg",
            "#forge:ash",
            "#forge:salt"
        ], 72000
    ).id("vintagedelight:fermenting/century_egg_from_emu_egg")
    e.custom({
        "type": "vintagedelight:fermenting",
        "processingTime": 5000,
        "ingredients": [
            { "tag": "createdelight:cabbage_leaves" },
            { "tag": "createdelight:cabbage_leaves" },
            { "tag": "createdelight:cabbage_leaves" },
            { "tag": "createdelight:cabbage_leaves" },
            { "tag": "forge:salt" },
            { "tag": "forge:chilipepper" }
        ],
        "output": {
            "count": 4,
            "item": "vintagedelight:kimchi"
        },
        "secondaryOutput": {
            "item": "vintagedelight:pickled_pepper"
        }
    }).id("vintagedelight:fermenting/kimchi_from_fermenting")
})
