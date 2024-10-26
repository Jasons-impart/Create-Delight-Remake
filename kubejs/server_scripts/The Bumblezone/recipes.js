ServerEvents.recipes(e => {
    // 蜂王浆
    e.recipes.create.compacting(
        "the_bumblezone:royal_jelly_block",
        Fluid.of("the_bumblezone:royal_jelly_fluid_still", 1000)
    ).id("create:compacting/royal_jelly")
    e.recipes.create.compacting(
        "minecraft:honey_block",
        Fluid.of("create:honey", 1000)
    ).id("create:compacting/honey")
    e.recipes.create.mixing(
        Fluid.of("the_bumblezone:royal_jelly_fluid_still", 1000),
        "the_bumblezone:royal_jelly_block",
    ).heated().id("create:mixing/royal_jelly")
    e.recipes.kubejs.shapeless(
        "the_bumblezone:royal_jelly_block",
        "the_bumblezone:royal_jelly_bucket"
    ).replaceIngredient("the_bumblezone:royal_jelly_bucket", "minecraft:bucket").id("the_bumblezone:royal_jelly_bucket/to_royal_jelly_block")
    e.recipes.kubejs.shapeless(
        "the_bumblezone:royal_jelly_bucket",
        [
            "minecraft:bucket",
            "the_bumblezone:royal_jelly_block"
        ]
    ).id("the_bumblezone:royal_jelly_bucket/from_royal_jelly_block")
    e.recipes.create.filling(
        'the_bumblezone:royal_jelly_bottle',
        [
            "minecraft:glass_bottle",
            Fluid.of("the_bumblezone:royal_jelly_fluid_still", 250)
        ]
    ).id("create:filling/royal_jelly_bottle")
    // 蜂蜜
    e.recipes.create.emptying(
        [
            Fluid.of("create:honey", 1000),
            "minecraft:bucket"
        ],
        "create:honey_bucket"
    ).id("create:emptying/honey_bucket")
    e.recipes.create.filling(
        'minecraft:honey_bottle',
        [
            "minecraft:glass_bottle",
            Fluid.of("create:honey", 250)
        ]
    ).id("create:filling/honey_bottle")
    e.replaceInput({mod: "the_bumblezone"}, "the_bumblezone:honey_bucket", "create:honey_bucket")
    e.replaceOutput({mod: "the_bumblezone"}, "the_bumblezone:honey_bucket", "create:honey_bucket")
    e.recipes.kubejs.shapeless(
        "create:honey_bucket",
        [
            "minecraft:bucket",
            "4x minecraft:honey_bottle"
        ]
    ).replaceIngredient("minecraft:honey_bottle", "minecraft:glass_bottle").id("the_bumblezone:honey_bucket/from_honey_bottle")
})
