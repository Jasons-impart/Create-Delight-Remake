ServerEvents.recipes(e => {
    remove_recipes_output(e, [
        "supplementaries:sugar_cube"
    ])
    // 古式墨水
    let iner_1 = "minecraft:glass_bottle"
    e.recipes.create.sequenced_assembly('supplementaries:antique_ink', 'minecraft:glass_bottle', 
        [
            e.recipes.create.filling(iner_1, [iner_1, Fluid.of("create_enchantment_industry:ink", 1000)]),
            e.recipes.create.deploying(iner_1, [iner_1, "#minecraft:planks"]),
        ]
    )
        .transitionalItem(iner_1)
        .loops(1)
        .id("createdelight:sequenced_assembly/antique_ink")
    // 高燃液体
    e.recipes.create.mixing(
        Fluid.of("supplementaries:lumisene", 100),
        [
            Fluid.of("minecraft:water", 90),
            Fluid.of("createdelight:fuel_mixtures", 10)
        ]
    ).id("createdelight:mixing/lumisene")
    e.recipes.create.filling(
        'supplementaries:lumisene_bottle',
        [
            "minecraft:glass_bottle",
            Fluid.of("supplementaries:lumisene", 250)
        ]
    ).id("createdelight:filling/lumisene_bottle")
    e.recipes.create.emptying(
        [
            "minecraft:glass_bottle",
            Fluid.of("supplementaries:lumisene", 250)
        ],
        'supplementaries:lumisene_bottle'
    ).id("createdelight:emptying/lumisene_bottle")
    e.recipes.create.emptying(
        [
            "minecraft:bucket",
            Fluid.of("supplementaries:lumisene", 1000)
        ],
        'supplementaries:lumisene_bucket'
    ).id("createdelight:emptying/lumisene_bucket")
    e.recipes.kubejs.shapeless(
        'supplementaries:lumisene_bucket',
        [
            "minecraft:bucket",
            "4x supplementaries:lumisene_bottle"
        ]
    )
        .replaceIngredient("supplementaries:lumisene_bottle", "minecraft:glass_bottle")
        .id("createdelight:lumisene_bucket")
    e.recipes.kubejs.shapeless(
        '4x supplementaries:lumisene_bottle',
        [
            "4x minecraft:glass_bottle",
            "supplementaries:lumisene_bucket"
        ]
    )
        .replaceIngredient("supplementaries:lumisene_bucket", "minecraft:bucket")
        .id("createdelight:lumisene_bottle")
    // 靛蓝炸弹合成
    let iner_2 = 'supplementaries:bomb'
    e.recipes.create.sequenced_assembly("supplementaries:bomb_blue", iner_2,
        [
            e.recipes.create.filling(iner_2, [iner_2, Fluid.of("supplementaries:lumisene", 100)]),
            e.recipes.create.deploying(iner_2, [iner_2, "minecraft:string"]),
        ]
    )   
        .transitionalItem(iner_2)
        .loops(2)
        .id("createdelight:sequenced_assembly/bomb_blue")
    // 高燃液体合成
    e.recipes.create.mixing(
        Fluid.of("supplementaries:lumisene", 100),
        [
            'minecraft:gunpowder',
            Fluid.of("createdieselgenerators:plant_oil", 100)
        ]
    ).id("createdelight:mixing/lumisene_2")
    e.recipes.create.mixing(
        Fluid.of("supplementaries:lumisene", 100),
        [
            'minecraft:gunpowder',
            Fluid.of("createdieselgenerators:ethanol", 100)
        ]
    ).id("createdelight:mixing/lumisene_3")
    e.recipes.create.mixing(
        Fluid.of("supplementaries:lumisene", 300),
        [
            'art_of_forging:potent_mixture',
            Fluid.of("createdieselgenerators:plant_oil", 100)
        ]
    ).id("createdelight:mixing/lumisene_4")
    e.recipes.create.mixing(
        Fluid.of("supplementaries:lumisene", 300),
        [
            'art_of_forging:potent_mixture',
            Fluid.of("createdieselgenerators:ethanol", 100)
        ]
    ).id("createdelight:mixing/lumisene_5")
})