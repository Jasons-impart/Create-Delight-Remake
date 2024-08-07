ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "farmersdelight:integration/create/mixing/pie_crust_from_mixing"
    ])
    // 油面团
    e.recipes.create.mixing(
        '3x createdelight:oil_dough',
        [
            'extradelight:butter',
            'extradelight:yeast',
            '#extradelight:sweetener',
            '3x create:wheat_flour'
        ]
    )
    e.recipes.create.mixing(
        '3x createdelight:oil_dough',
        [
            'extradelight:butter',
            'extradelight:yeast',
            Fluid.of("create:honey", 250),
            '3x create:wheat_flour'
        ]
    )
    e.recipes.minecraft.crafting_shapeless(
        '3x createdelight:oil_dough',
        [
            'extradelight:butter',
            'extradelight:yeast',
            '#extradelight:sweetener',
            '3x create:wheat_flour'
        ]
    )
    // 酥皮
    let iner = "createdelight:oil_dough_with_butter"
    e.recipes.create.sequenced_assembly(
        '2x createdelight:puff_pastry',
        'createdelight:oil_dough', [
            e.recipes.create.deploying(iner, [iner, "extradelight:butter"]),
            e.recipes.create.pressing(iner, iner)
        ]
    )
    .transitionalItem(iner)
    .loops(2)
    e.shapeless(
        "createdelight:oil_dough_with_butter",
        [
            'createdelight:oil_dough',
            "extradelight:butter"
        ]
    )
    e.custom({
        "type": "extradelight:dough_shaping",
        "count": 1,
        "ingredient": {
            "item": "createdelight:oil_dough_with_butter"
        },
        "result": 'createdelight:puff_pastry'
    })
    e.custom({
        "type": "extradelight:oven",
        "container": {
            "item": "extradelight:pie_dish"
        },
        "cookingtime": 800,
        "experience": 1.0,
        "ingredients": [
            {
                "item": "createdelight:puff_pastry"
            }
        ],
        "recipe_book_tab": "meals",
        "result": {
            "item": 'farmersdelight:pie_crust'
        }
    })
    .id("extradelight:oven/pie_crust")
    e.custom({
        "type": "extradelight:oven",
        "container": {
            "item": "extradelight:pie_dish"
        },
        "cookingtime": 800,
        "experience": 2.0,
        "ingredients": [
            {
                "item": "createdelight:puff_pastry"
            },
            {
                "item": "createdelight:puff_pastry"
            },
        ],
        "recipe_book_tab": "meals",
        "result": {
            "count": 2,
            "item": 'farmersdelight:pie_crust'
        }
    })
    .id("extradelight:oven/pie_crust2")
    e.custom({
        "type": "extradelight:oven",
        "container": {
            "item": "extradelight:pie_dish"
        },
        "cookingtime": 800,
        "experience": 3.0,
        "ingredients": [
            {
                "item": "createdelight:puff_pastry"
            },
            {
                "item": "createdelight:puff_pastry"
            },
            {
                "item": "createdelight:puff_pastry"
            },
        ],
        "recipe_book_tab": "meals",
        "result": {
            "count": 3,
            "item": 'farmersdelight:pie_crust'
        }
    })
    .id("extradelight:oven/pie_crust3")
    e.custom({
        "type": "extradelight:oven",
        "container": {
            "item": "extradelight:pie_dish"
        },
        "cookingtime": 800,
        "experience": 4.0,
        "ingredients": [
            {
                "item": "createdelight:puff_pastry"
            },
            {
                "item": "createdelight:puff_pastry"
            },
            {
                "item": "createdelight:puff_pastry"
            },
            {
                "item": "createdelight:puff_pastry"
            },
        ],
        "recipe_book_tab": "meals",
        "result": {
            "count": 4,
            "item": 'farmersdelight:pie_crust'
        }
    })
    .id("extradelight:oven/pie_crust4")
    e.custom({
        "type": "extradelight:oven",
        "container": {
            "item": "extradelight:pie_dish"
        },
        "cookingtime": 800,
        "experience": 5.0,
        "ingredients": [
            {
                "item": "createdelight:puff_pastry"
            },
            {
                "item": "createdelight:puff_pastry"
            },
            {
                "item": "createdelight:puff_pastry"
            },
            {
                "item": "createdelight:puff_pastry"
            },
            {
                "item": "createdelight:puff_pastry"
            },
        ],
        "recipe_book_tab": "meals",
        "result": {
            "count": 5,
            "item": 'farmersdelight:pie_crust'
        }
    })
    .id("extradelight:oven/pie_crust5")
    e.custom({
        "type": "extradelight:oven",
        "container": {
            "item": "extradelight:pie_dish"
        },
        "cookingtime": 800,
        "experience": 6.0,
        "ingredients": [
            {
                "item": "createdelight:puff_pastry"
            },
            {
                "item": "createdelight:puff_pastry"
            },
            {
                "item": "createdelight:puff_pastry"
            },
            {
                "item": "createdelight:puff_pastry"
            },
            {
                "item": "createdelight:puff_pastry"
            },
            {
                "item": "createdelight:puff_pastry"
            },
        ],
        "recipe_book_tab": "meals",
        "result": {
            "count": 6,
            "item": 'farmersdelight:pie_crust'
        }
    })
    .id("extradelight:oven/pie_crust6")
    e.custom({
        "type": "extradelight:oven",
        "container": {
            "item": "extradelight:pie_dish"
        },
        "cookingtime": 800,
        "experience": 7.0,
        "ingredients": [
            {
                "item": "createdelight:puff_pastry"
            },
            {
                "item": "createdelight:puff_pastry"
            },
            {
                "item": "createdelight:puff_pastry"
            },
            {
                "item": "createdelight:puff_pastry"
            },
            {
                "item": "createdelight:puff_pastry"
            },
            {
                "item": "createdelight:puff_pastry"
            },
            {
                "item": "createdelight:puff_pastry"
            },
        ],
        "recipe_book_tab": "meals",
        "result": {
            "count": 7,
            "item": 'farmersdelight:pie_crust'
        }
    })
    .id("extradelight:oven/pie_crust7")
    e.custom({
        "type": "extradelight:oven",
        "container": {
            "item": "extradelight:pie_dish"
        },
        "cookingtime": 800,
        "experience": 8.0,
        "ingredients": [
            {
                "item": "createdelight:puff_pastry"
            },
            {
                "item": "createdelight:puff_pastry"
            },
            {
                "item": "createdelight:puff_pastry"
            },
            {
                "item": "createdelight:puff_pastry"
            },
            {
                "item": "createdelight:puff_pastry"
            },
            {
                "item": "createdelight:puff_pastry"
            },
            {
                "item": "createdelight:puff_pastry"
            },
            {
                "item": "createdelight:puff_pastry"
            },
        ],
        "recipe_book_tab": "meals",
        "result": {
            "count": 8,
            "item": 'farmersdelight:pie_crust'
        }
    })
    .id("extradelight:oven/pie_crust8")
    e.custom({
        "type": "extradelight:oven",
        "container": {
            "item": "extradelight:pie_dish"
        },
        "cookingtime": 800,
        "experience": 9.0,
        "ingredients": [
            {
                "item": "createdelight:puff_pastry"
            },
            {
                "item": "createdelight:puff_pastry"
            },
            {
                "item": "createdelight:puff_pastry"
            },
            {
                "item": "createdelight:puff_pastry"
            },
            {
                "item": "createdelight:puff_pastry"
            },
            {
                "item": "createdelight:puff_pastry"
            },
            {
                "item": "createdelight:puff_pastry"
            },
            {
                "item": "createdelight:puff_pastry"
            },
            {
                "item": "createdelight:puff_pastry"
            },
        ],
        "recipe_book_tab": "meals",
        "result": {
            "count": 9,
            "item": 'farmersdelight:pie_crust'
        }
    })
    .id("extradelight:oven/pie_crust9")
})