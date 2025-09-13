LootJS.modifiers(e => {
    e.addBlockLootModifier("culturaldelights:wild_corn")
        .replaceLoot("minecraft:wheat_seeds", "culturaldelights:corn_kernels")
})
ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "corn_delight:integration/create/milling/wild_corn",
        "corn_delight:integration/create/milling/corn",
        "corn_delight:cutting/corn",
        "corn_delight:integration/create/mixing/cornbread_batter_from_mixing",
        "corn_delight:cornbread_batter",
        "corn_delight:corn_crate",
        "corn_delight:cutting/tortilla_chip",
        "corn_delight:tortilla_from_smoking",
        "corn_delight:tortilla",
        "corn_delight:tortilla_from_campfire_cooking",
        "corn_delight:tortilla_raw",
        "corn_delight:integration/create/splashing/tortilla_raw",
        "corn_delight:cooking/creamed_corn",
        "corn_delight:taco",
        "corn_delight:corn_from_crate",
        "corn_delight:organic_compost_from_corncob",
        "corn_delight:cob_pipe",
        "corn_delight:paper_from_corncob",
        "corn_delight:cooking/corn_dog",
        "corn_delight:classic_corn_dog_from_crafting",
        "corn_delight:cooking/classic_corn_dog",
        "corn_delight:popcorn_from_campfire_cooking",
        "corn_delight:popcorn",
        "corn_delight:popcorn_from_smoking"
    ])
    e.replaceInput({ id: "vintagedelight:stuffed_burrito" }, "#forge:bread", "culturaldelights:tortilla")
    e.replaceInput({ mod: "corn_delight" }, "corn_delight:cornbread_batter", "culturaldelights:corn_dough")
    e.replaceInput({ mod: "corn_delight" }, "corn_delight:corn", "culturaldelights:corn_cob")
    e.replaceInput({ mod: "corn_delight" }, "corn_delight:tortilla_chip", "culturaldelights:tortilla_chips")
    e.replaceInput({ id: "culturaldelights:smelting/tortilla_from_campfire" }, "culturaldelights:corn_dough", "corn_delight:tortilla_raw")
    e.replaceInput({ id: "culturaldelights:smelting/tortilla" }, "culturaldelights:corn_dough", "corn_delight:tortilla_raw")
    e.replaceInput({ id: "culturaldelights:smelting/tortilla_from_smoking" }, "culturaldelights:corn_dough", "corn_delight:tortilla_raw")
    e.replaceInput({ id: "corn_delight:cooking/corn_soup" }, "culturaldelights:corn_cob", "createdelight:corn_flour")
    e.replaceInput({ id: "culturaldelights:cooking/creamed_corn" }, "culturaldelights:corn_cob", "culturaldelights:corn_kernels")
    e.replaceInput({ id: "culturaldelights:cooking/creamed_corn" }, "#forge:milk", '#forge:cream')
    e.replaceInput({ id: "corn_delight:cooking/creamy_corn_drink" }, "culturaldelights:corn_cob", "createdelight:corn_flour")
    e.recipes.kubejs.shapeless(
        "9x culturaldelights:corn_kernels",
        "corn_delight:corn_kernel_bag"
    ).id("corn_delight:corn_kernels")
    threshing(e,
        "culturaldelights:corn_cob",
        [
            "4x culturaldelights:corn_kernels",
            "farmersdelight:straw",
            Item.of("3x culturaldelights:corn_kernels").withChance(0.5)
        ], 400
    )
    e.recipes.create.milling(
        [
            "2x createdelight:corn_flour",
            Item.of("2x createdelight:corn_flour").withChance(0.5)
        ],
        "culturaldelights:corn_kernels"
    ).id("createdelight:milling/corn_flour")
    e.recipes.create.mixing("culturaldelights:corn_dough", [
        Fluid.water(50),
        "createdelight:corn_flour"
    ]).id("culturaldelights:mixing/corn_dough")
    e.recipes.create.splashing("culturaldelights:corn_dough", "createdelight:corn_flour")
    .id("culturaldelights:splashing/corn_dough")
    e.recipes.create.pressing(
        [
            "corn_delight:tortilla_raw",
            Item.of("corn_delight:tortilla_raw").withChance(0.5)
        ],
        "culturaldelights:corn_dough"
    ).id("corn_delight:pressing/tortilla_raw")
    e.recipes.kubejs.shapeless(
        "corn_delight:tortilla_raw",
        "culturaldelights:corn_dough"
    ).id("corn_delight:crafting/tortilla_raw")
    e.recipes.farmersdelight.cooking(
        [
            "corn_delight:cornbread",
            "#forge:vegetables",
            "#forge:sausage",
            "#forge:vegetables/onion"
        ], "corn_delight:cornbread_stuffing", 1.0, 200, "minecraft:bowl"
    ).id("corn_delight:cooking/cornbread_stuffing")
})