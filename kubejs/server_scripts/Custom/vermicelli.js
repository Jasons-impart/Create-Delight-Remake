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
    e.recipes.farmersdelight.cooking(
        [
            'butchercraft:cubed_beef',
            'butchercraft:cubed_beef',
            'createdelight:board_noodles',
            "#forge:vegetables/carrot",
            "#forge:vegetables/cabbage",
            "#forge:vegetables/onion"
        ], 'casualness_delight:beef_noodles', 1.0, 200
    )
    .id("casualness_delight:cooking/beef_noodles")
    .container("bowl")
})