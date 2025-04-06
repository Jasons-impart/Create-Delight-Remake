ServerEvents.tags("item", e => {
    e.add("forge:whipped_cream", [
        "createdelight:whipped_cream_bucket",
        "createdelight:whipped_cream_bowl"
    ])
    e.add("forge:animal_oil", [
        "butchercraft:lard",
        "createdelight:butter"
    ])
})

ServerEvents.recipes(e => {
    e.replaceInput({ id: "mynethersdelight:cooking/crimson_stroganoff" }, "#forge:milk", "#forge:whipped_cream")
    e.recipes.create.mixing(
        Fluid.of("createdelight:whipped_cream", 250),
        Fluid.of("milk", 500)
    )
        .heated()
        .id("createdelight:mixing/whipped_cream")
    centrifugation(e, 
        [
            Fluid.of("createdelight:whipped_cream", 750),
            Fluid.of("minecraft:water", 250)
        ], 
        Fluid.of("minecraft:milk", 1000)
    )
        .id("createdelight:big_centrifugation/whipped_cream")
    e.recipes.create.emptying(
        [
            Fluid.of("createdelight:whipped_cream", 250),
            "minecraft:bowl"
        ], "createdelight:whipped_cream_bowl"
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
    e.recipes.create.compacting(
        "createdelight:butter",
        Fluid.of("createdelight:whipped_cream", 250)
    )
        .id("createdelight:compacting/butter")
    e.recipes.kubejs.shapeless(
        '4x createdelight:butter',
        'createdelight:whipped_cream_bucket'
    )
        .replaceIngredient('createdelight:whipped_cream_bucket', 'minecraft:bucket')
        .id('createdelight:crafting/butter')
    // 开酥
    e.recipes.kubejs.shapeless(
        "createdelight:oil_dough",
        [
            "#forge:animal_oil",
            "create:dough"
        ]
    ).id("createdelight:crafting/oil_dough")
    let iner = "createdelight:oil_dough_with_butter"
    e.recipes.create.sequenced_assembly("4x createdelight:puff_pastry", "createdelight:oil_dough", [
        e.recipes.create.deploying(iner, [iner, "#forge:animal_oil"]),
        e.recipes.create.pressing(iner, iner),
        e.recipes.create.deploying(iner, [iner, "#forge:animal_oil"]),
        e.recipes.create.pressing(iner, iner),
        e.recipes.create.cutting(iner, iner)
    ])
        .transitionalItem(iner)
        .loops(1)
        .id("createdelight:puff_pastry")
})