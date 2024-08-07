ServerEvents.recipes(e => {
    // 搅拌合成：烧烤汁
    e.recipes.create.mixing(
        "extradelight:bbq_jar_item",
        [
            "#forge:crops/tomato",
            "#forge:crops/onion",
            Fluid.of("create:honey", 250),
            "minecraft:glass_bottle",
            "extradelight:vinegar"
        ]
    )
        .id("create:mixing/bbq_sugar_create2")
        .heated()
    // 搅拌合成：番茄酱
    e.recipes.create.mixing(
        "extradelight:ketchup_jar_item",
        [
            Fluid.of("create:honey", 250),
            "2x #forge:crops/tomato",
            "extradelight:vinegar",
            "minecraft:glass_bottle"
        ]
    )
        .id("create:mixing/ketchup_jar_create2")
        .heated()
    // 食用油合成
    e.custom({
        "type": "farmersdelight:cooking",
        "container": {
            "item": "minecraft:glass_bottle"
          },
        "ingredients": [
            {
                "item": 'butchercraft:lard'
            }
        ],
        "result": {
            "item": 'extradelight:cooking_oil',
            "count": 3
        },
        "cookingtime": 20
    })
    .id("minecraft:dynamic_feast/mint_to_oil")
})
