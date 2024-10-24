ServerEvents.recipes(e => {
    e.custom({
        type: "create:compacting",
        ingredients: [
            {
                amount: 1000,
                fluidTag: "createdelight:honey"
            }
        ],
        results: [
            {
                item: "minecraft:honey_block"
            }
        ]
    }).id("create:compacting/honey")
    e.recipes.create.compacting(
        "the_bumblezone:royal_jelly_block",
        Fluid.of("the_bumblezone:royal_jelly_fluid_still", 1000)
    ).id("create:compacting/royal_jelly")
    e.recipes.create.mixing(
        Fluid.of("the_bumblezone:royal_jelly_fluid_still", 1000),
        "the_bumblezone:royal_jelly_block",
    ).heated().id("create:mixing/royal_jelly")
    e.recipes.kubejs.shapeless(
        "the_bumblezone:royal_jelly_block",
        "the_bumblezone:royal_jelly_bucket"
    ).replaceIngredient("the_bumblezone:royal_jelly_bucket", "minecraft:bucket").id("the_bumblezone:royal_jelly_bucket/to_royal_jelly_block")
    e.custom({
        type: "create:filling",
        ingredients: [
            {
                item: "minecraft:glass_bottle"
            },
            {
                amount: 250,
                fluidTag: "createdelight:honey"
            }
        ],
        results: [
            {
                item: "minecraft:honey_bottle"
            }
        ]
    }).id("create:filling/honey_bottle")
    e.recipes.create.filling(
        'the_bumblezone:royal_jelly_bottle',
        [
            "minecraft:glass_bottle",
            Fluid.of("the_bumblezone:royal_jelly_fluid_still", 250)
        ]
    ).id("create:filling/royal_jelly_bottle")
    e.recipes.create.emptying(
        [
            "minecraft:glass_bottle",
            Fluid.of("the_bumblezone:honey_fluid_still", 250)
        ],
        "minecraft:honey_bottle"
    ).id("create:emptying/honey_bottle")
    e.recipes.create.mixing(
        Fluid.of("the_bumblezone:honey_fluid_still", 1000),
        "minecraft:honey_block"
    ).heated().id("create:mixing/honey")
    e.recipes.vintageimprovements.centrifugation(
        Fluid.of("the_bumblezone:honey_fluid_still", 100),
        "minecraft:honeycomb"
    ).id("vintageimprovements:centrifugation/honey_comb")
})
ServerEvents.tags("fluid", e => {
    e.add("createdelight:honey", [
        "create:honey",
        "the_bumblezone:honey_fluid_still"
    ])
})