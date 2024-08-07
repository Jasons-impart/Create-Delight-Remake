ServerEvents.recipes(e => {
    // 约克郡布丁
    e.custom({
        "type": "extradelight:oven",
        "container": {
            "item": "extradelight:sheet"
        },
        "cookingtime": 1000,
        "experience": 1.0,
        "ingredients": [
            { "item": 'create:wheat_flour' },
            { "item": 'create:wheat_flour' },
            { "item": 'create:wheat_flour' },
            { "item": 'minecraft:egg' },
            { "tag": 'forge:salt' },
            { "tag": 'forge:milk' },
        ],
        "recipe_book_tab": "meals",
        "result": {
            "item": 'casualness_delight:yorkshire_pudding'
        }
    })
    // 牛排配约克郡布丁
    e.shapeless("createdelight:yorkshire_pudding_and_beef", [
        "#forge:cooked_beef",
        "casualness_delight:yorkshire_pudding"
    ])
})