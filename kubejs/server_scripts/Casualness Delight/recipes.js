ServerEvents.recipes(e => {
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
    ).id("casualness_delight:mixing/raw_gluten")
    // 春卷
    e.recipes.kubejs.shapeless(
        'casualness_delight:raw_spring_roll',
        [
            "#forge:meat/processed/raw",
            "#forge:dough",
            "#forge:vegetables/cabbage"
        ]
    ).id("casualness_delight:crafting_shaped/raw_spring_roll")
})