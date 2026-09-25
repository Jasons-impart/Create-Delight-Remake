ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "casualness_delight:crafting_shaped/raw_spring_roll",
        "casualness_delight:cooking/fish_and_chips",
        "casualness_delight:cooking/raw_cheese_wheel",
        "casualness_delight:cooking/beef_noodles"
    ])
    // 牛排配约克郡布丁
    e.recipes.kubejs.shapeless("createdelight:yorkshire_pudding_and_beef", [
        "#forge:cooked_beef",
        "casualness_delight:yorkshire_pudding"
    ])
    // 土豆串
    e.replaceInput({id: "casualness_delight:crafting_shaped/raw_potato_bobo_chicken"}, "minecraft:potato", "casualness_delight:potato_slice")
    // 面筋
    e.recipes.create.mixing(
        'casualness_delight:raw_gluten',
        [
            "#forge:dough",
            Fluid.of("minecraft:water", 500)
        ]
    ).id("createdelight:mixing/raw_gluten")
    // 春卷
    e.recipes.kubejs.shapeless(
        'casualness_delight:raw_spring_roll',
        [
            "#forge:meat/processed/raw",
            "#forge:dough",
            "#forge:vegetables/cabbage"
        ]
    ).id("createdelight:crafting_shaped/raw_spring_roll")

    // 烹饪锅配方（原为 kubejs/data/casualness_delight/recipes/cooking/ 下的数据包配方）
    e.recipes.farmersdelight.cooking(
        [
            "casualness_delight:raw_cabbage_bobo_chicken",
            "casualness_delight:raw_cabbage_bobo_chicken",
            "casualness_delight:raw_potato_bobo_chicken",
            "casualness_delight:raw_potato_bobo_chicken",
            "casualness_delight:raw_chicken_bobo_chicken",
            "casualness_delight:raw_chicken_bobo_chicken"
        ],
        "casualness_delight:bobo_chicken",
        0.0, 200, "farmersdelight:tomato_sauce"
    ).id("casualness_delight:cooking/bobo_chicken")
})