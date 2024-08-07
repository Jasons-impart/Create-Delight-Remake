BlockEvents.rightClicked(e => {
    const {
        player,
        block
    } = e;

    if (player.mainHandItem.hasTag('forge:tools/knives') && block.id === 'brewinandchewin:flaxen_cheese_wheel') {
        block.set("air")
        block.popItem("4x ad_astra:cheese")
        e.cancel()
    }
})
ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        'casualness_delight:raw_cheese_wheel',
        "extradelight:cheese_block",
        "extradelight:cheese_block_to_item",
        "extradelight:cheese_vinegar",
        "create:mixing/cheese_vinegar_create"
    ])
    // 替换配方
    e.replaceInput(
        { mod: 'brewinandchewin'},
        'brewinandchewin:flaxen_cheese_wedge',
        '#forge:cheese'
    )
    // 幻翼泡芙
    e.custom({
        "type": "farmersdelight:cooking",
        "cookingtime": 200,
        "experience": 1.0,
        "ingredients": [
            {
                "item": "minecraft:phantom_membrane"
            },
            {
                "tag": 'forge:cheese'
            },
            {
                "tag": "forge:milk"
            }
        ],
        "recipe_book_tab": "misc",
        "result": {
            "count": 2,
            "item": "casualness_delight:phantom_puff"
        }
    })
    .id("casualness_delight:cooking/phantom_puff")
    // 奶酪相关
    e.custom({
        "type": "farmersdelight:cutting",
        "ingredients": [
            {
                "item": "brewinandchewin:flaxen_cheese_wheel"
            }
        ],
        "result": [
            {
                "count": 4,
                "item": 'ad_astra:cheese'
            }
        ],
        "tool": {
            "tag": "forge:tools/knives"
        }
    })
    .id("brewinandchewin:cutting/flaxen_cheese_wheel")
    // 披萨制作
    e.custom({
        "type": "extradelight:oven",
        "container": {
            "item": 'extradelight:baking_stone'
        },
        "cookingtime": 1600,
        "experience": 1.0,
        "ingredients": [
            {
                "item": "ad_astra:cheese"
            },
            {
                "item": "ad_astra:cheese"
            },
            {
                "item": "ad_astra:cheese"
            },
            {
                "item": 'extradelight:ketchup_jar_item'
            },
            {
                "item": 'minecraft:brown_mushroom'
            },
            {
                "tag": 'forge:beef/ground/raw'
            },
            {
                "item": 'extradelight:corn_meal'
            },
            {
                "item": 'create:dough'
            },
            {
                "item": 'extradelight:corn_meal'
            }
        ],
        "recipe_book_tab": "meals",
        "result": {
            "item": 'brewinandchewin:pizza'
        }
    })
    .id("brewinandchewin:pizza")
    // 芝士意面
    e.custom({
        "type": "farmersdelight:cooking",
        "cookingtime": 200,
        "experience": 1.0,
        "ingredients": [
            {
                "item": "ad_astra:cheese"
            },
            {
                "item": "farmersdelight:raw_pasta"
            },
            {
                "item": "farmersdelight:tomato"
            },
            {
                "tag": "forge:crops/cabbage"
            }
        ],
        "recipe_book_tab": "meals",
        "result": {
            "item": "brewinandchewin:cheesy_pasta"
        }
    })
    .id("brewinandchewin:cooking/cheesy_pasta")
    // 奶油洋葱浓汤
    e.custom({
        "type": "farmersdelight:cooking",
        "cookingtime": 200,
        "experience": 1.0,
        "ingredients": [
            {
                "item": "ad_astra:cheese"
            },
            {
                "item": "farmersdelight:onion"
            },
            {
                "item": "farmersdelight:onion"
            },
            {
                "item": "minecraft:bread"
            }
        ],
        "recipe_book_tab": "meals",
        "result": {
            "item": "brewinandchewin:creamy_onion_soup"
        }
    })
    .id("brewinandchewin:cooking/creamy_onion_soup")
    // 蔬菜煎蛋卷
    e.custom({
        "type": "farmersdelight:cooking",
        "cookingtime": 200,
        "experience": 1.0,
        "ingredients": [
            {
                "item": "ad_astra:cheese"
            },
            {
                "item": "minecraft:egg"
            },
            {
                "item": "minecraft:egg"
            },
            {
                "item": "farmersdelight:onion"
            },
            {
                "item": "minecraft:carrot"
            }
        ],
        "recipe_book_tab": "meals",
        "result": {
            "item": "brewinandchewin:vegetable_omelet"
        }
    })
    .id("brewinandchewin:cooking/vegetable_omelet")
})