ServerEvents.tags("item", e => {
    e.add("forge:whipped_cream", [
        "createdelight:whipped_cream_bucket",
        "createdelight:whipped_cream_bowl"
    ])
    e.add("forge:animal_oil", [
        'butchercraft:lard',
        'createdelight:butter'
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
    // 开酥
    e.recipes.create.mixing(
        'createdelight:oil_dough',
        [
            "#forge:animal_oil",
            'create:wheat_flour',
            Fluid.of("water", 50)
        ]
    ).id("createdelight:mixing/oil_dough")
    e.recipes.kubejs.shapeless(
        'createdelight:oil_dough',
        [
            "#forge:animal_oil",
            'create:wheat_flour',
            "water_bucket"
        ]
    ).id("createdelight:crafting/oil_dough").replaceIngredient("water_bucket", "bucket")
    let iner = 'createdelight:oil_dough_with_butter'
    e.recipes.create.sequenced_assembly('4x createdelight:puff_pastry', 'createdelight:oil_dough', [
        e.recipes.create.deploying(iner, [iner, '#forge:animal_oil']),
        e.recipes.create.pressing(iner, iner),
        e.recipes.create.deploying(iner, [iner, '#forge:animal_oil']),
        e.recipes.create.pressing(iner, iner),
        e.recipes.create.cutting(iner, iner)
    ])
        .transitionalItem(iner)
        .loops(1)
        .id("createdelight:puff_pastry")
})