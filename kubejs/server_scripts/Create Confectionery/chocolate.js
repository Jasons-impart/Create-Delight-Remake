ServerEvents.recipes(e => {
    // 巧克力
    e.recipes.create.mixing(
        Fluid.of("create:chocolate", 250),
        [
            'ratatouille:cocoa_solids',
            'ratatouille:cocoa_butter',
            Fluid.of("minecraft:milk", 250),
            "minecraft:sugar"
        ]
    )
        .heated()
        .id("create:mixing/chocolate")
    // 黑巧
    e.recipes.create.mixing(
        Fluid.of("create_confectionery:black_chocolate", 250),
        [
            'ratatouille:cocoa_solids',
            'ratatouille:cocoa_butter',
            Fluid.of("minecraft:milk", 250)
        ]
    )
        .heated()
        .id("create_confectionery:black_chocolate_recipe")
    e.recipes.create.filling(
        'createdelightcore:black_chocolate_mold_filled',
        [
            Fluid.of("create_confectionery:black_chocolate", 250),
            'ratatouille:chocolate_mold'
        ]
    )
        .id("create:filling/black_chocolate_mold_filled")
    e.custom({
        "type": "ratatouille:demolding",
        "ingredients": [
            {
                "item": "createdelightcore:black_chocolate_mold_solid"
            }
        ],
        "results": [
            {
                "item": 'create_confectionery:bar_of_black_chocolate'
            },
            {
                "item": "ratatouille:chocolate_mold"
            }
        ]
    })
        .id("create_confectionery:bar_of_black_chocolate_recipe")
    // 白巧
    e.recipes.create.mixing(
        Fluid.of("create_confectionery:white_chocolate", 250),
        [
            'ratatouille:cocoa_butter',
            Fluid.of("minecraft:milk", 250),
            "minecraft:sugar"
        ]
    )
        .heated()
        .id("create_confectionery:white_chocolate_recipe")
    e.recipes.create.filling(
        'createdelightcore:white_chocolate_mold_filled',
        [
            Fluid.of("create_confectionery:white_chocolate", 250),
            'ratatouille:chocolate_mold'
        ]
    )
        .id("create:filling/white_chocolate_mold_filled")
    e.custom({
        "type": "ratatouille:demolding",
        "ingredients": [
            {
                "item": "createdelightcore:white_chocolate_mold_solid"
            }
        ],
        "results": [
            {
                "item": 'create_confectionery:bar_of_white_chocolate'
            },
            {
                "item": "ratatouille:chocolate_mold"
            }
        ]
    })
        .id("create_confectionery:bar_of_white_chocolate_recipe")
    // 红宝石巧克力
    e.recipes.create.mixing(
        [
            Fluid.of("create_confectionery:ruby_chocolate", 250),
            "minecraft:glass_bottle"
        ],
        [
            'ratatouille:cocoa_solids',
            'ratatouille:cocoa_butter',
            "minecraft:dragon_breath",
            "minecraft:sugar"
        ]
    )
        .heated()
        .id("create_confectionery:ruby_chocolate_recipe")
    e.recipes.create.filling(
        'createdelightcore:ruby_chocolate_mold_filled',
        [
            Fluid.of("create_confectionery:ruby_chocolate", 250),
            'ratatouille:chocolate_mold'
        ]
    )
        .id("create:filling/ruby_chocolate_mold_filled")
    e.custom({
        "type": "ratatouille:demolding",
        "ingredients": [
            {
                "item": "createdelightcore:ruby_chocolate_mold_solid"
            }
        ],
        "results": [
            {
                "item": 'create_confectionery:bar_of_ruby_chocolate'
            },
            {
                "item": "ratatouille:chocolate_mold"
            }
        ]
    })
        .id("create_confectionery:bar_of_ruby_chocolate_recipe")
    // 热巧克力
    e.recipes.create.mixing(
        Fluid.of("create_confectionery:hot_chocolate", 250),
        [
            Fluid.of("minecraft:milk", 250),
            "minecraft:sugar",
            "create:bar_of_chocolate"
        ]
    )
        .heated()
        .id("create_confectionery:hot_chocolate_recipe")
})