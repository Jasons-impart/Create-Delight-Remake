ServerEvents.tags("item", e => {
    e.add("forge:whipped_cream", [
        "createdelight:whipped_cream_bucket",
        "createdelight:whipped_cream_bowl"
    ])
})

ServerEvents.recipes(e => {
    e.recipes.create.mixing(
        Fluid.of("createdelight:whipped_cream", 250),
        Fluid.of("milk", 500)
    )
        .heated()
        .id("createdelight:mixing/whipped_cream")
    e.recipes.create.emptying(
        [
            Fluid.of("createdelight:whipped_cream", 250),
            "minecraft:bowl"
        ],"createdelight:whipped_cream_bowl"
    ).id("createdelight:emptying/whipped_cream_bowl")
    e.recipes.create.filling(
        "createdelight:whipped_cream_bowl",
        [
            Fluid.of("createdelight:whipped_cream", 250),
            "minecraft:bowl"
        ]
    ).id("createdelight:filling/whipped_cream_bowl")
    e.recipes.kubejs.shapeless(
        "createdelight:whipped_cream_bucket",
        [
            "minecraft:bucket",
            "4x createdelight:whipped_cream_bowl"
        ]
    ).id("createdelight:crafting/whipped_cream_bucket").replaceIngredient("createdelight:whipped_cream_bowl", "minecraft:bowl")
    e.recipes.kubejs.shapeless(
        "4x createdelight:whipped_cream_bowl",
        [
            "createdelight:whipped_cream_bucket",
            "4x minecraft:bowl"
        ]
    ).id("createdelight:crafting/whipped_cream_bowl").replaceIngredient("createdelight:whipped_cream_bucket", "minecraft:bucket")
    e.recipes.create.mixing(
        'createdelight:butter',
        Fluid.of("createdelight:whipped_cream", 250),
        200
    )
        .heated()
        .id("createdelight:mixing/butter")
})