ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "create:mixing/chocolate",
        "create:compacting/chocolate",
        "create:crafting/curiosities/cake",
        "aether:skyroot_milk_bucket_moa_egg_cake",
        "aether:skyroot_milk_bucket_cake",
        "aether:moa_egg_cake",
        "minecraft:cake",
        "farmersdelight:cake_from_slices",
        "farmersdelight:cake_from_milk_bottle",
        "create_central_kitchen:crafting/chocolate_cake_from_slices",
        "farmersrespite:coffee_cake",
        "create_central_kitchen:crafting/coffee_cake_from_dough",
        "create_central_kitchen:mixing/coffee_cake",
        "farmersrespite:coffee_cake_from_slices",
        "mynethersdelight:magma_cake"
    ])
    // 肉酱配方修改
    e.recipes.create.mixing(Fluid.of("ratatouille:mince_meat", 250), [
            '#forge:meat/raw',
            "#forge:salt",
            'butchercraft:fat'
        ]
    ).id("create:mixing/mince_meat")
    
    // 蛋糕相关
    e.recipes.create.filling(
        'createaddition:chocolate_cake',
        [
            'ratatouille:cake_base',
            Fluid.of("create:chocolate", 1000)
        ]
    ).id("create:filling/chocolate_cake")
    e.recipes.create.sequenced_assembly('farmersrespite:coffee_cake', 'ratatouille:cake_base', [
        e.recipes.create.filling("ratatouille:cake_base", ["ratatouille:cake_base", Fluid.of("createcafe:coffee", 1000)]),
        e.recipes.create.deploying("ratatouille:cake_base", ["ratatouille:cake_base", "createcafe:roasted_coffee_beans"])
    ])
        .transitionalItem("ratatouille:cake_base")
        .loops(1)
    let iner = 'ratatouille:cake_base'
    e.recipes.create.sequenced_assembly('mynethersdelight:magma_cake', "ratatouille:cake_base", [
        e.recipes.create.filling(iner, [iner, Fluid.lava(250)]),
        e.recipes.create.deploying(iner, [iner, "minecraft:gunpowder"]),
        e.recipes.create.deploying([iner, "minecraft:bucket"], [iner, "mynethersdelight:hot_cream"]),
        e.recipes.create.deploying(iner, [iner, "minecraft:magma_cream"])
    ])
        .transitionalItem(iner)
        .loops(1)
    e.recipes.create.compacting('create:blaze_cake_base', [
        Fluid.of("ratatouille:cake_batter", 500),
        "create:cinder_flour"
    ]).id("create:compacting/blaze_cake")
})