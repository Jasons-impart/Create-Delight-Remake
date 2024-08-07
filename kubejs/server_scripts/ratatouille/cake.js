ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "create:mixing/chocolate",
        "create:compacting/chocolate",
        "create:crafting/curiosities/cake",
        "aether:skyroot_milk_bucket_moa_egg_cake",
        "aether:skyroot_milk_bucket_cake",
        "aether:moa_egg_cake",
        "minecraft:cake",
        "extradelight:oven/cake",
        "farmersdelight:cake_from_slices",
        "farmersdelight:cake_from_milk_bottle",
        "create_central_kitchen:crafting/chocolate_cake_from_slices",
        "farmersrespite:coffee_cake",
        "create_central_kitchen:crafting/coffee_cake_from_dough",
        "create_central_kitchen:mixing/coffee_cake",
        "farmersrespite:coffee_cake_from_slices",
        "extradelight:coffee_cake_from_slice"
    ])
    // 肉酱配方修改
    e.recipes.create.mixing(
        Fluid.of("ratatouille:mince_meat", 250),
        [
            '#forge:meat/raw',
            ,
            'butchercraft:fat'
        ]
    )
        .id("create:mixing/mince_meat")
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
    e.recipes.create.sequenced_assembly('extradelight:coffe_cake_feast', 'ratatouille:cake_base', [
        e.recipes.create.filling("ratatouille:cake_base", ["ratatouille:cake_base", Fluid.of("minecraft:milk", 1000)]),
        e.recipes.create.deploying("ratatouille:cake_base", ["ratatouille:cake_base", 'extradelight:ground_cinnamon'])
    ])
        .transitionalItem("ratatouille:cake_base")
        .loops(1)
        .id("extradelight:oven/coffe_cake_feast")
})

ServerEvents.tags("item", e => {
    e.add("forge:salt", "ratatouille:salt")
})
