ServerEvents.tags("item", e => {
    e.add("crabbersdelight:cooked_seafood", [
        'alexsmobs:cooked_lobster_tail'
    ])
    e.add('crabbersdelight:raw_seafood', [
        'alexsmobs:lobster_tail'
    ])
    e.add("crabbersdelight:lobster", [
        'alexsmobs:lobster_tail',
        'crabbersdelight:clawster'
    ])
})
ServerEvents.recipes(e => {
    e.custom({
        "type": "farmersdelight:cutting",
        "ingredients": [
            {
                "item": 'crabbersdelight:clawster'
            }
        ],
        "result": [
            {
                "item": 'alexsmobs:lobster_tail'
            },
            {
                "item": 'alexsmobs:lobster_tail',
                "chance": 0.3
            }
        ],
        "tool": {
            "tag": "forge:tools/knives"
        }
    }).id("alexmobs:cutting/lobster_tail")
    e.custom({
        "type": "farmersdelight:cooking",
        "container": {
            "item": "minecraft:bowl"
        },
        "cookingtime": 200,
        "experience": 1.0,
        "ingredients": [
            {
                "tag": "crabbersdelight:lobster"
            },
            {
                "item": "crabbersdelight:shrimp"
            },
            {
                "item": "farmersdelight:onion"
            },
            {
                "item": "farmersdelight:rice"
            },
            {
                "item": "minecraft:porkchop"
            }
        ],
        "recipe_book_tab": "meals",
        "result": {
            "item": "crabbersdelight:seafood_gumbo"
        }
    })
    .id("farmersdelight:cooking/seafood_gumbo")
})