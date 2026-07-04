ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "culturaldelights:cutting/raw_calamari",
        "culturaldelights:cutting/raw_calamari_from_glowsquid",
        "culturaldelights:cutting/wild_cucumbers",
        "culturaldelights:corn_dough",
        "culturaldelights:cutting/wild_corn",
        "culturaldelights:cutting/corn_kernels",
        "culturaldelights:smelting/cooked_calamari",
        "culturaldelights:smelting/cooked_calamari_from_campfire",
        "culturaldelights:smelting/cooked_calamari_from_smoking",
        "culturaldelights:egg_roll",
        "culturaldelights:pufferfish_roll",
        "culturaldelights:tropical_roll",
        "culturaldelights:calamari_roll",
        "culturaldelights:midori_roll",
        "culturaldelights:chicken_roll"
    ])
    e.replaceInput({id: "culturaldelights:cooking/eggplant_parmesan"}, "#forge:milk", "#forge:cheese")
    e.recipes.kubejs.shapeless(
        "createdelight:raw_empanada",
        [
            "2x culturaldelights:corn_dough",
            "#culturaldelights:avocados",
            "#forge:vegetables/tomato",
            "#forge:vegetables/onion"
        ]
    ).id("culturaldelights:cooking/empanada")
    cutting(e, 'vintagedelight:cucumber', '2x culturaldelights:cut_cucumber')
    cutting(e, 'culturaldelights:glow_squid', [
        '2x oceanic_delight:glow_squid_tentacles',
        Item.of('3x minecraft:glow_ink_sac').withChance(0.5)
    ])
    cutting(e, 'culturaldelights:squid', [
        '2x oceanic_delight:squid_tentacles',
        Item.of('3x minecraft:ink_sac').withChance(0.5),
    ])
    cutting(e, 'culturaldelights:cooked_squid', '2x oceanic_delight:grilled_squid_tentacles')
    cutting(e, "vintagedelight:wild_cucumbers", [
            "vintagedelight:cucumber_seeds",
            "minecraft:green_dye"
    ])
    cutting(e, "culturaldelights:wild_cucumbers", [
            "vintagedelight:cucumber_seeds",
            "minecraft:green_dye"
    ])
    //饭团
    e.recipes.kubejs.shapeless(
        "2x culturaldelights:rice_ball",
        [
            "minecraft:dried_kelp",
            "createdelight:empty_riceball",
            "createdelight:empty_riceball",
            "#alexscaves:sweet_berries",
            "#forge:raw_fishes/salmon"
        ]
    ).id("culturaldelights:rice_ball")

    package_item(e, "culturaldelights:squid", "crabbersdelight:squid_barrel", 9)
    package_item(e, "culturaldelights:glow_squid", "crabbersdelight:glow_squid_barrel", 9)
})