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
        "minecraft:bread",
        "quark:tweaks/crafting/utility/bent/bread",
        "farmersdelight:cutting/tag_dough",
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
        .id("ratatouille:cutting/wheat_seeds")
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
    // 意大利面合成
    // 山竹糕合成
    e.recipes.farmersdelight.cooking(
        [
            "farmersdelight:rice",
            "minecraft:sugar",
            "minecraft:sugar",
            '#forge:fruits/mangosteen',
            '#forge:fruits/mangosteen'
        ], "fruitsdelight:mangosteen_cake", 1.0, 200
    )
    .id("farmersdelight:cooking/mangosteen_cake")
    // 紫颂果派合成
    // 煎饼合成
})