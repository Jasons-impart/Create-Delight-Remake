ServerEvents.tags("item", e => {
    e.add("forge:bars/chocolate", [
        "create_confectionery:bar_of_white_chocolate",
        "create_confectionery:bar_of_ruby_chocolate",
        "create_confectionery:bar_of_black_chocolate"
    ])
    e.add("supplementaries:chocolate_bars", [
        "create_confectionery:bar_of_white_chocolate",
        "create_confectionery:bar_of_ruby_chocolate",
        "create_confectionery:bar_of_black_chocolate"
    ])
})

ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "create_confectionery:crushed_cocoa_recipe",
        "create_confectionery:cocoa_powder_and_butter_recipe",
        "create:mixing/normal_chocolate",
        "farmersdelight:cooking/hot_cocoa",
        "create_central_kitchen:emptying/hot_cocoa",
        "create_central_kitchen:filling/hot_cocoa",
        "ratatouille:freezing/chocolate_mold_filled"
    ])
    e.replaceInput({ mod: "createcafe" }, "minecraft:cocoa_beans", "ratatouille:cocoa_powder")
    // 热可可
    e.recipes.create.mixing(
        Fluid.of("farmersrespite:hot_cocoa"),
        [
            "minecraft:sugar",
            Fluid.of("minecraft:milk"),
            "ratatouille:cocoa_powder"
        ]
    )
        .heated()
        .id("create_central_kitchen:mixing/hot_cocoa")

    e.custom({
        type: "farmersrespite:brewing",
        base: {
            count: 1000,
            fluid: "minecraft:milk"
        },
        cookingtime: 2400,
        experience: 0.35,
        ingredients: [
            {
                item: "ratatouille:cocoa_powder"
            },
            {
                item: "minecraft:sugar"
            }
        ],
        result: {
            count: 1000,
            fluid: "farmersrespite:hot_cocoa"
        }
    }).id("farmersrespite:brewing/hot_cocoa_from_milk")
    // 巧克力
    e.recipes.create.mixing(
        Fluid.of("create:chocolate", 250),
        [
            "ratatouille:cocoa_solids",
            "ratatouille:cocoa_butter",
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
            "ratatouille:cocoa_solids",
            "ratatouille:cocoa_butter",
            Fluid.of("minecraft:milk", 250)
        ]
    )
        .heated()
        .id("create_confectionery:black_chocolate_recipe")
    e.recipes.create.filling(
        "createdelightcore:black_chocolate_mold_filled",
        [
            Fluid.of("create_confectionery:black_chocolate", 250),
            "ratatouille:chocolate_mold"
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
                "item": "create_confectionery:bar_of_black_chocolate"
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
            "ratatouille:cocoa_butter",
            Fluid.of("minecraft:milk", 250),
            "minecraft:sugar"
        ]
    )
        .heated()
        .id("create_confectionery:white_chocolate_recipe")
    e.recipes.create.filling(
        "createdelightcore:white_chocolate_mold_filled",
        [
            Fluid.of("create_confectionery:white_chocolate", 250),
            "ratatouille:chocolate_mold"
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
                "item": "create_confectionery:bar_of_white_chocolate"
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
            Fluid.of("create_confectionery:ruby_chocolate", 250)
        ],
        [
            "ratatouille:cocoa_solids",
            "ratatouille:cocoa_butter",
            Fluid.of("create_central_kitchen:dragon_breath", 250),
            "minecraft:sugar"
        ]
    )
        .heated()
        .id("create_confectionery:ruby_chocolate_recipe")
    e.recipes.create.filling(
        "createdelightcore:ruby_chocolate_mold_filled",
        [
            Fluid.of("create_confectionery:ruby_chocolate", 250),
            "ratatouille:chocolate_mold"
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
                "item": "create_confectionery:bar_of_ruby_chocolate"
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
    freezing(e, "ratatouille:chocolate_mold_filled", 'ratatouille:chocolate_mold_solid', 60)
    freezing(e, 'createdelightcore:black_chocolate_mold_filled', 'createdelightcore:black_chocolate_mold_solid', 60)
    freezing(e, 'createdelightcore:white_chocolate_mold_filled', 'createdelightcore:white_chocolate_mold_solid', 60)
    freezing(e, 'createdelightcore:ruby_chocolate_mold_filled', 'createdelightcore:ruby_chocolate_mold_solid', 60)
})
