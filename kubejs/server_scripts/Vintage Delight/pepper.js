ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "farmersrespite:cooking/blazing_chili"
    ])
    e.replaceInput({ id: "corn_delight:cooking/nachos_block" }, "farmersdelight:tomato_sauce", "#mynethersdelight:hot_spice")
    e.replaceInput({ id: "culturaldelights:cooking/spicy_curry" }, "farmersdelight:tomato_sauce", "#mynethersdelight:hot_spice")
    e.replaceInput({ id: "casualness_delight:cooking/spicy_strips" }, "#forge:vegetables/onion", "#mynethersdelight:hot_spice")
    e.replaceInput({ id: "mynethersdelight:cooking/spicy_hoglin_stew" }, "mynethersdelight:bullet_pepper", "#mynethersdelight:hot_spice")
    e.recipes.kubejs.shapeless(
        "vintagedelight:stuffed_burrito",
        [
            "culturaldelights:tortilla",
            "farmersdelight:beef_patty",
            "#forge:vegetables/cabbage",
            "#forge:vegetables/tomato",
            "ad_astra:cheese",
            "#mynethersdelight:hot_spice"
        ]
    ).id("vintagedelight:stuffed_burrito")
    e.recipes.kubejs.shapeless(
        "mynethersdelight:spicy_skewer",
        [
            "#mynethersdelight:strider_meats",
            "vintagedelight:ghost_pepper",
            "minecraft:blaze_rod",
            "vintagedelight:ghost_pepper"
        ]
    ).id("mynethersdelight:crafting/spicy_skewer_2")
    e.recipes.farmersdelight.cooking(
        [
            "minecraft:blaze_powder",
            "#mynethersdelight:hot_spice",
            "minecraft:nether_wart",
            "butchercraft:beef_stewmeat"
        ],
        "farmersrespite:blazing_chili", 1.0, 200, "minecraft:bowl"
    ).id("mynethersdelight:cooking/blazing_chili")
})
