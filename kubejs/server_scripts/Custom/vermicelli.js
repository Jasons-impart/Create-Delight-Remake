ServerEvents.recipes(e => {
    e.custom({
        "type": "farmersdelight:cooking",
        "cookingtime": 200,
        "experience": 1.0,
        "ingredients": [
            {
                "item": "minecraft:carrot"
            },
            {
                "item": "minecraft:brown_mushroom"
            },
            {
                "item": 'createdelight:vermicelli'
            },
            {
                "tag": "forge:salad_ingredients"
            },
            {
                "tag": "forge:vegetables"
            }
        ],
        "recipe_book_tab": "meals",
        "result": {
            "item": "farmersdelight:vegetable_noodles"
        }
    })
    .id("farmersdelight:cooking/vegetable_noodles")
    e.custom({
        "type": "farmersdelight:cooking",
        "cookingtime": 200,
        "experience": 1.0,
        "ingredients": [
            {
                "item": 'createdelight:vermicelli'
            },
            {
                "tag": "forge:cooked_eggs"
            },
            {
                "item": "minecraft:dried_kelp"
            },
            {
                "tag": "forge:raw_pork"
            }
        ],
        "recipe_book_tab": "meals",
        "result": {
            "item": "farmersdelight:noodle_soup"
        }
    })
    .id("farmersdelight:cooking/noodle_soup")
    e.custom({
        "type": "farmersdelight:cooking",
        "ingredients": [
            {
                "item": 'butchercraft:cubed_beef'
            },
            {
                "item": 'butchercraft:cubed_beef'
            },
            {
                "item": 'createdelight:board_noodles'
            },
            {
                "tag": "forge:vegetables/carrot"
            },
            {
                "tag": "forge:crops/cabbage"
            },
            {
                "tag": "forge:vegetables/onion"
            }
        ],
        "result": {
            "item": "casualness_delight:beef_noodles"
        },
        "container": {
            "item": "minecraft:bowl"
        },
        "cookingtime": 200
    })
    .id("casualness_delight:cooking/beef_noodles")
})