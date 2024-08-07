ServerEvents.tags("item", e => {
    e.remove("forge:dough", [
        'create:dough'
    ]);
    e.remove("forge:dough/wheat", [
        'create:dough'
    ])
    e.remove("forge:eggs", [
        'alexsmobs:emu_egg'
    ])
    e.add("forge:chorus_fruits", [
        'ends_delight:chorus_fruit_grain',
        'minecraft:chorus_fruit'
    ])
})
ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "create:milling/wheat",
        "create_central_kitchen:crafting/dough_4",
        "create_central_kitchen:crafting/dough_3",
        "create_central_kitchen:crafting/dough_2",
        "create_central_kitchen:crafting/dough_1",
        "farmersdelight:wheat_dough_from_water",
        "create:mixing/wheat_dough_egg_create",
        "extradelight:mixing/wheat_dough",
        "minecraft:bread",
        "quark:tweaks/crafting/utility/bent/bread",
        "farmersdelight:cutting/tag_dough",
        "extradelight:seaweed_paste",
        "culturaldelights:cooking/raw_pasta",
        "ends_delight:food/chorus_fruit_pie",
        "create_central_kitchen:sequenced_assembly/chorus_fruit_pie",
        "unusualend:chorus_pie_recipe"
    ])
    // 脱粒机相关
    e.custom({
        "type": "ratatouille:threshing",
        "ingredients": [
            {
                "item": "minecraft:wheat"
            }
        ],
        "processingTime": 200,
        "results": [
            {
                "item": "ratatouille:wheat_kernels",
                "count": 2
            },
            {
                "item": "farmersdelight:straw",
                "count": 1
            },
            {
                "item": "ratatouille:wheat_kernels",
                "count": 1,
                "chance": 0.5
            }
        ]
    })
        .id("ratatouille:threshing/wheat_kernels")
    // 小麦→麦粒
    e.custom({
        "type": "farmersdelight:cutting",
        "ingredients": [
            {
                "item": "minecraft:wheat"
            }
        ],
        "result": [
            {
                "count": 2,
                "item": 'ratatouille:wheat_kernels'
            },
            {
                "item": "farmersdelight:straw"
            }
        ],
        "tool": {
            "tag": "forge:tools/knives"
        }
    })
        .id("extradelight:cutting/wheat_seeds")
    // 磨粉
    e.custom({
        "type": "extradelight:mortar",
        "grinds": 4,
        "ingredient": {
            "item": 'ratatouille:wheat_kernels'
        },
        "result": {
            "item": 'create:wheat_flour'
        }
    })
        .id("extradelight:dynamic_feast/mortar/flour")
    // 袋装面粉
    e.shapeless(
        '9x create:wheat_flour',
        'extradelight:flour_sack'
    )
        .id("extradelight:flour_from_block")
    // 哈吉斯
    e.custom({
        "type": "extradelight:oven",
        "container": {
            "item": "extradelight:tray"
        },
        "cookingtime": 1600,
        "experience": 1.0,
        "ingredients": [
            {
                "tag": "forge:offal"
            },
            {
                "tag": "forge:offal"
            },
            {
                "tag": "forge:offal"
            },
            {
                "tag": "forge:lung"
            },
            {
                "tag": "forge:stomach"
            },
            {
                "tag": "forge:meat/scrap"
            },
            {
                "item": 'ratatouille:wheat_kernels'
            },
            {
                "item": 'ratatouille:wheat_kernels'
            },
            {
                "item": 'ratatouille:wheat_kernels'
            }
        ],
        "recipe_book_tab": "meals",
        "result": {
            "item": "extradelight:haggis_block_item"
        }
    })
        .id("extradelight:oven/haggis_block_item")
    // 苹果酥
    e.custom({
        "type": "extradelight:oven",
        "container": {
            "item": "extradelight:square_pan"
        },
        "cookingtime": 800,
        "experience": 1.0,
        "ingredients": [
            {
                "item": 'ratatouille:wheat_kernels'
            },
            {
                "tag": "forge:flour"
            },
            {
                "tag": "extradelight:sweetener"
            },
            {
                "tag": "extradelight:processed/apple"
            },
            {
                "tag": "forge:butter"
            },
            {
                "tag": "extradelight:processed/apple"
            }
        ],
        "recipe_book_tab": "meals",
        "result": {
            "item": "extradelight:apple_crisp_feast"
        }
    })
        .id("extradelight:oven/apple_crisp_feast")
    // 蛋液适配
    e.custom({
        "type": "create:emptying",
        "ingredients": [
            {
                "tag": "forge:eggs"
            }
        ],
        "results": [
            {
                "amount": 250,
                "fluid": "ratatouille:egg_yolk"
            },
            {
                "item": "ratatouille:egg_shell"
            }
        ]
    })
        .id("create:emptying/yolk")
    e.custom({
        "type": "create:emptying",
        "ingredients": [
            {
                "item": 'alexsmobs:emu_egg'
            }
        ],
        "results": [
            {
                "amount": 1000,
                "fluid": "ratatouille:egg_yolk"
            },
            {
                "item": "ratatouille:egg_shell"
            }
        ]
    })
        .id("create:emptying/emu_yolk")
    // 面团相关
    e.recipes.create.mixing(
        '3x create_confectionery:gingerdough',
        [
            Fluid.of("create:honey", 250),
            "minecraft:sugar",
            "3x create:wheat_flour",
            "create:cinder_flour",
            'extradelight:grated_ginger'
        ]
    )
        .id("create_confectionery:gingerdough_recipe")
    e.custom({
        "type": "extradelight:mixing_bowl",
        "ingredients": [
            {
                "tag": "forge:flour"
            },
            {
                "tag": "forge:flour"
            },
            {
                "tag": "forge:flour"
            },
            {
                "tag": "forge:eggs"
            }
        ],
        "result": {
            "count": 3,
            "item": "farmersdelight:wheat_dough"
        },
        "stirs": 8,
        "usedItem": {
            "item": "air"
        }
    })
        .id("extradelight:mixing/wheat_dough_egg")
    e.recipes.create.mixing(
        'farmersdelight:wheat_dough',
        [
            Fluid.of("ratatouille:egg_yolk", 50),
            'create:wheat_flour'
        ]
    )
    e.recipes.create.mixing(
        'ratatouille:salty_dough',
        [
            Fluid.of("ratatouille:egg_yolk", 100),
            '2x create:wheat_flour',
            "#forge:salt"
        ]
    )
        .id("create:mixing/salty_dough")
    e.recipes.create.mixing(
        "extradelight:seaweed_paste",
        "minecraft:kelp"
    )
        .id("create:mixing/seaweed_paste_create")
    // 意大利面合成
    e.custom({
        "type": "extradelight:dough_shaping",
        "count": 2,
        "ingredient": {
            "item": 'ratatouille:salty_dough'
        },
        "result": "farmersdelight:raw_pasta"
    })
        .id("extradelight:dynamic_feast/raw_pasta")
    e.custom({
        "type": "extradelight:dough_shaping",
        "count": 2,
        "ingredient": {
            "item": 'ratatouille:salty_dough'
        },
        "result": "extradelight:macaroni"
    })
        .id("extradelight:dynamic_feast/macaroni_pasta")
    e.custom({
        "type": "extradelight:dough_shaping",
        "count": 2,
        "ingredient": {
            "item": 'ratatouille:salty_dough'
        },
        "result": "extradelight:lasagna_noodles"
    })
        .id("extradelight:dynamic_feast/lasagna_pasta")
    // 山竹糕合成
    e.custom({
        "type": "farmersdelight:cooking",
        "container": {
            "item": "minecraft:bowl"
        },
        "cookingtime": 200,
        "experience": 0.1,
        "ingredients": [
            {
                "item": 'farmersdelight:rice'
            },
            {
                "item": 'farmersdelight:rice'
            },
            {
                "item": "minecraft:sugar"
            },
            {
                "item": "minecraft:sugar"
            },
            {
                "tag": "forge:fruits/mangosteen"
            },
            {
                "tag": "forge:fruits/mangosteen"
            }
        ],
        "result": {
            "item": "fruitsdelight:mangosteen_cake"
        }
    })
        .id("farmersdelight:cooking/mangosteen_cake")
    // 紫颂果派合成
    e.custom({
        "type": "extradelight:oven",
        "container": {
            "item": "extradelight:pie_dish"
        },
        "cookingtime": 800,
        "experience": 1.0,
        "ingredients": [
            {
                "tag": "forge:flour"
            },
            {
                "tag": "forge:flour"
            },
            {
                "tag": "forge:flour"
            },
            {
                "tag": "forge:chorus_fruits"
            },
            {
                "tag": "forge:chorus_fruits"
            },
            {
                "tag": "forge:chorus_fruits"
            },
            {
                "tag": 'extradelight:sweetener'
            },
            {
                "item": "farmersdelight:pie_crust"
            },
            {
                "tag": 'extradelight:sweetener'
            }
        ],
        "recipe_book_tab": "meals",
        "result": {
            "item": "ends_delight:chorus_fruit_pie"
        }
    })
    // 煎饼合成
    e.custom({
        "type": "extradelight:oven",
        "container": {
            "item": "extradelight:sheet"
        },
        "cookingtime": 800,
        "experience": 1.0,
        "ingredients": [
            {
                "tag": "forge:eggs"
            },
            {
                "tag": "forge:flour"
            },
            {
                "tag": "forge:milk"
            },
            {
                "tag": 'extradelight:sweetener'
            }
        ],
        "recipe_book_tab": "meals",
        "result": {
            "item": "supplementaries:pancake"
        }
    })
        .id("supplementaries:pancake")
    // 板面
    e.custom({
        "type": "extradelight:dough_shaping",
        "count": 1,
        "ingredient": {
            "item": 'create:dough'
        },
        "result": 'createdelight:board_noodles'
    })
})