LootJS.modifiers(e => {
    e.addBlockLootModifier("culturaldelights:wild_corn")
        .replaceLoot("minecraft:wheat_seeds", "culturaldelights:corn_kernels")
    e.addBlockLootModifier("corn_delight:wild_corn")
        .replaceLoot("corn_delight:corn_seeds", "culturaldelights:corn_kernels")
})
ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "corn_delight:integration/create/milling/wild_corn",
        "culturaldelights:cutting/corn_kernels",
        "corn_delight:integration/create/mixing/cornbread_batter_from_mixing",
        "corn_delight:cornbread_batter",
        "corn_delight:corn_crate",
        "culturaldelights:corn_dough",
        "corn_delight:cutting/tortilla_chip",
        "corn_delight:tortilla_from_smoking",
        "corn_delight:tortilla",
        "corn_delight:tortilla_from_campfire_cooking",
        "corn_delight:tortilla_raw",
        "corn_delight:integration/create/splashing/tortilla_raw",
        "corn_delight:cooking/creamed_corn",
        "corn_delight:taco",
        "corn_delight:cutting/wild_corn",
        "corn_delight:corn_from_crate",
    ])
    remove_recipes_output(e, [
        "corn_delight:corn_seeds"
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
    e.replaceInput({ id: "culturaldelights:cooking/creamed_corn" }, "#forge:milk", "#forge:whipped_cream")
    e.replaceInput({ id: "corn_delight:cooking/creamy_corn_drink" }, "culturaldelights:corn_cob", "createdelight:corn_flour")
    e.recipes.kubejs.shapeless(
        "9x culturaldelights:corn_kernels",
        "corn_delight:corn_kernel_bag"
    ).id("corn_delight:corn_kernels")
    cutting(e, "corn_delight:wild_corn", [
        ["culturaldelights:corn_kernels"],
        ["culturaldelights:corn_kernels", 1, 0.5]
    ])
    e.custom({
        type: "farmersdelight:cutting",
        ingredients: [{item: "culturaldelights:corn_cob"}],
        result: [{item: "culturaldelights:corn_kernels", count: 4}, {item: "farmersdelight:straw", count: 1}],
        tool: {type: "farmersdelight:tool_action", action: "blade_cut"}
    }).id("tetracelium:cutting/corn_cob")
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
    e.recipes.kubejs.shapeless(
        "3x culturaldelights:corn_dough",
        [
            "minecraft:water_bucket",
            "3x createdelight:corn_flour"
        ]
    ).replaceIngredient("minecraft:water_bucket", "minecraft:bucket").id("corn_delight:crafting/corn_dough")
    e.recipes.create.mixing(
        "culturaldelights:corn_dough",
        [
            Fluid.of("water", 50),
            "createdelight:corn_flour"
        ]
    ).id("corn_delight:mixing/corn_dough")
    e.recipes.create.splashing(
        "culturaldelights:corn_dough",
        "createdelight:corn_flour"
    ).id("corn_delight:splashing/corn_dough")
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
            "culturaldelights:corn_dough",
            "#forge:cheese",
            "#forge:cooked_pork",
            "farmersdelight:tomato_sauce"
        ], "corn_delight:classic_corn_dog", 0.5, 200, "minecraft:stick"
    ).id("corn_delight:cooking/classic_corn_dog")
    e.recipes.farmersdelight.cooking(
        [
            "culturaldelights:corn_dough",
            "#forge:cheese",
            "#forge:cooked_pork"
        ], "corn_delight:corn_dog", 0.5, 200, "minecraft:stick"
    ).id("corn_delight:cooking/corn_dog")
    e.recipes.farmersdelight.cooking(
        [
            "corn_delight:cornbread",
            "#forge:vegetables",
            "#forge:sausage",
            "#forge:vegetables/onion"
        ], "corn_delight:cornbread_stuffing", 1.0, 200, "minecraft:bowl"
    ).id("corn_delight:cooking/cornbread_stuffing")
})