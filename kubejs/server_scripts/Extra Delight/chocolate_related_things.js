ServerEvents.tags("item", e => {
    e.add('forge:bars/chocolate', [
        'create_confectionery:bar_of_ruby_chocolate',
        'create_confectionery:bar_of_black_chocolate',
        'create_confectionery:bar_of_white_chocolate'
    ])
})
ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "farmersdelight:integration/create/filling/chocolate_pie",
        "create_confectionery:crushed_cocoa_recipe",
        "create_confectionery:cocoa_powder_and_butter_recipe",
        "extradelight:chocolate_milk_bucket",
        "extradelight:chocolate_milk"
    ])
    // 巧克力派
    e.custom({
        "type": "extradelight:oven",
        "container": {
          "item": "extradelight:pie_dish"
        },
        "cookingtime": 800,
        "experience": 1.0,
        "ingredients": [
            {
                "item": 'ratatouille:cocoa_solids'
            },
            {
                "tag": "forge:whipped_cream"
            },
            {
                "item": 'ratatouille:cocoa_butter'
            },
            {
                "item": "extradelight:egg_mix"
            },
            {
                "item": 'minecraft:sugar'
            },
            {
                "tag": "forge:flour"
            },
            {
                "tag": "extradelight:sweetener"
            },
            {
                "item": "farmersdelight:pie_crust"
            },
            {
                "tag": "extradelight:sweetener"
            }
        ],
        "recipe_book_tab": "meals",
        "result": {
            "item": "farmersdelight:chocolate_pie"
        }
    })
        .id("extradelight:oven/chocolate_pie")
    e.custom({
        "type": "extradelight:oven",
        "container": {
          "item": "extradelight:pie_dish"
        },
        "cookingtime": 800,
        "experience": 1.0,
        "ingredients": [
            {
                "tag": "forge:bars/chocolate"
            },
            {
                "item": "extradelight:egg_mix"
            },
            {
                "tag": "forge:flour"
            },
            {
                "tag": "extradelight:sweetener"
            },
            {
                "item": "farmersdelight:pie_crust"
            },
            {
                "tag": "extradelight:sweetener"
            }
        ],
        "recipe_book_tab": "meals",
        "result": {
            "item": "farmersdelight:chocolate_pie"
        }
    })
        .id("extradelight:oven/chocolate_pie2")
    // 巧克力蛋奶沙司
    e.custom({
        "type": "create:mixing",
        "heatRequirement": "heated",
        "ingredients": [
            {
                "tag": "forge:bars/chocolate"
            },
            {
                "tag": "forge:milk"
            },
            {
                "tag": "forge:eggs"
            },
            {
                "tag": "extradelight:sweetener"
            },
            {
                "item": "minecraft:glass_bottle"
            }
        ],
        "results": [
            {
                "item": "extradelight:chocolate_custard"
            }
        ]
    })
    .id("create:mixing/chocolate_custard_create")
    e.custom({
        "type": "farmersdelight:cooking",
        "cookingtime": 200,
        "experience": 1.0,
        "ingredients": [
            {
                "tag": "forge:eggs"
            },
            {
                "tag": "forge:milk"
            },
            {
                "tag": "forge:bars/chocolate"
            },
            {
                "tag": "extradelight:sweetener"
            }
        ],
        "recipe_book_tab": "meals",
        "result": {
          "item": "extradelight:chocolate_custard"
        }
    })
    .id("extradelight:chocolate_custard")
    // 巧克力奶酪蛋糕
    e.custom({
        "type": "extradelight:oven",
        "container": {
          "item": "extradelight:pie_dish"
        },
        "cookingtime": 800,
        "experience": 1.0,
        "ingredients": [
            {
                "tag": "forge:bars/chocolate"
            },
            {
                "item": "farmersdelight:pie_crust"
            },
            {
                "tag": "forge:cheese"
            }
        ],
        "recipe_book_tab": "meals",
        "result": {
            "item": "extradelight:chocolate_cheesecake"
        }
    })
    .id("extradelight:oven/chocolate_cheesecake")
    // 巧克力曲奇粉
    e.custom({
        "type": "extradelight:mixing_bowl",
        "ingredients": [
            {
                "tag": "forge:flour"
            },
            {
                "tag": "extradelight:sweetener"
            },
            {
                "tag": "forge:butter"
            },
            {
                "tag": "forge:eggs"
            },
            {
                "tag": "forge:bars/chocolate"
            }
        ],
        "result": {
            "item": "extradelight:chocolate_chip_cookie_dough"
        },
        "stirs": 4,
        "usedItem": {
            "item": "minecraft:air"
        }
    })
    .id("extradelight:mixing/chocolate_chip_cookie_dough")
    e.custom({
        "type": "extradelight:mixing_bowl",
        "ingredients": [
            {
                "tag": "forge:cookie_dough/sugar"
            },
            {
                "tag": "forge:bars/chocolate"
            }
        ],
        "result": {
            "item": "extradelight:chocolate_chip_cookie_dough"
        },
        "stirs": 4,
        "usedItem": {
            "item": "minecraft:air"
        }
    })
    .id("extradelight:mixing/chocolate_chip_cookie_dough_sugar")
    // 巧克力奶昔
    e.custom({
        "type": "extradelight:mixing_bowl",
        "ingredients": [
            {
                "tag": "forge:milk"
            },
            {
                "item": "extradelight:ice_cream"
            },
            {
                "tag": "forge:bars/chocolate"
            }
        ],
        "result": {
            "item": "extradelight:chocolate_milkshake"
        },
        "stirs": 4,
        "usedItem": {
            "item": "minecraft:glass_bottle"
        }
    }).id("extradelight:mixing/chocolate_milkshake")
    e.custom({
        "type": "create:mixing",
        "ingredients": [
            {
                "tag": "forge:milk"
            },
            {
                "item": "extradelight:ice_cream"
            },
            {
                "tag": "forge:bars/chocolate"
            },
            {
                "item": "minecraft:glass_bottle"
            }
        ],
        "results": [
            {
                "item": "extradelight:chocolate_milkshake"
            }
        ]
    })
    .id("create:mixing/chocolate_milkshake_create")
    // 巧克力冰淇淋
    e.custom({
        "type": "create:mixing",
        "ingredients": [
            {
                "tag": "forge:milk"
            },
            {
                "tag": "extradelight:sweetener"
            },
            {
                "tag": "forge:bars/chocolate"
            },
            {
                "item": "minecraft:ice"
            },
            {
                "item": "minecraft:bowl"
            }
        ],
        "results": [
            {
                "item": "extradelight:chocolate_ice_cream"
            }
        ]
    })
    .id("create:mixing/chocolate_ice_cream_create")
    e.custom({
        "type": "extradelight:mixing_bowl",
        "ingredients": [
            {
                "tag": "forge:milk"
            },
            {
                "tag": "extradelight:sweetener"
            },
            {
                "tag": "forge:bars/chocolate"
            },
            {
                "item": "minecraft:ice"
            }
        ],
        "result": {
            "item": "extradelight:chocolate_ice_cream"
        },
        "stirs": 8,
        "usedItem": {
            "item": "minecraft:bowl"
        }
    })
    .id("extradelight:mixing/chocolate_ice_cream")
    // 巧克力冰棍
    e.custom({
        "type": "minecraft:crafting_shaped",
        "key": {
            "S": {
                "item": "minecraft:stick"
            },
            "c": {
                "tag": "forge:bars/chocolate"
            },
            "i": {
                "item": "minecraft:ice"
            },
            "m": {
                "tag": "forge:milk"
            },
            "s": {
                "tag": "extradelight:sweetener"
            }
        },
        "pattern": [
            " sm",
            "ics",
            "Si "
        ],
        "result": {
            "item": "extradelight:fudge_popsicle"
        }
    })
    .id("extradelight:fudge_popsicle")
    // 奥利奥面团
    e.custom({
        "type": "minecraft:crafting_shapeless",
        "ingredients": [
            {
                "tag": "forge:flour/wheat"
            },
            {
                "tag": "forge:bars/chocolate"
            },
            {
                "item": "minecraft:water_bucket"
            }
        ],
        "result": {
            "item": "createcafe:oreo_dough"
        }
    })
    .id("createcafe:crafting/oreo_dough_shapeless")
    e.custom({
        "type": "create:mixing",
        "ingredients": [
            {
                "item": "create:wheat_flour"
            },
            {
                "tag": "forge:bars/chocolate"
            },
            {
                "fluid": "minecraft:water",
                "nbt": {},
                "amount": 1000
            }
        ],
        "results": [
            {
                "item": "createcafe:oreo_dough"
            }
        ]
    })
    .id("createcafe:mixing/oreo_dough_mixing")
    e.custom({
        "type": "create:mixing",
        "ingredients": [
            {
                "item": "create:wheat_flour"
            },
            {
                "fluid": "create:chocolate",
                "nbt": {},
                "amount": 250
            },
            {
                "fluid": "minecraft:water",
                "nbt": {},
                "amount": 1000
            }
        ],
        "results": [
            {
                "item": "createcafe:oreo_dough"
            }
        ]
    })
    .id("createcafe:mixing/oreo_dough_mixing2")

})