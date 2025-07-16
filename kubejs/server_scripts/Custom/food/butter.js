ServerEvents.tags("item", e => {
    e.add("forge:whipped_cream", [
        "cosmopolitan:cream_bucket",
        "cosmopolitan:cream"
    ])
    e.add("forge:animal_oil", [
        "butchercraft:lard",
        "createdelight:butter"
    ])
})

ServerEvents.recipes(e => {
    e.replaceInput({ id: "mynethersdelight:cooking/crimson_stroganoff" }, "#forge:milk", '#forge:cream')
    e.recipes.create.mixing(
        Fluid.of("cosmopolitan:cream", 500),
        Fluid.of("cosmopolitan:condensed_milk", 250)
    )
        .id("createdelight:mixing/cream")
    
    e.recipes.create.mixing(
        Fluid.of("cosmopolitan:condensed_milk", 250),
        [Fluid.of("minecraft:milk", 250), "minecraft:sugar"]
    )
        .heated()
        .id("createdelight:mixing/condensed_milk")
    centrifugation(e, 
        [
            Fluid.of("cosmopolitan:cream", 750),
            Fluid.of("minecraft:water", 250)
        ], 
        [Fluid.of("minecraft:milk", 1000), "minecraft:sugar"]
    )
        .id("createdelight:big_centrifugation/whipped_cream")
    e.recipes.create.mixing(
        "createdelight:butter",
        Fluid.of("cosmopolitan:cream", 250)
    )
        .id("createdelight:compacting/butter")
    e.recipes.kubejs.shapeless(
        '4x createdelight:butter',
        'cosmopolitan:cream_bucket'
    )
        .replaceIngredient('cosmopolitan:cream_bucket', 'minecraft:bucket')
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