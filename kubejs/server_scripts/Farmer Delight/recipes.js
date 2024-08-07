ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "create:mixing/normal_chocolate",
        "farmersdelight:cooking/hot_cocoa"
    ])
    // 热可可
    e.recipes.create.mixing(
        Fluid.of("create_central_kitchen:hot_cocoa"),
        [
            "minecraft:sugar",
            Fluid.of("minecraft:milk", 250),
            "ratatouille:cocoa_powder"
        ]
    )
    .heated()
    .id("create_central_kitchen:mixing/hot_cocoa")
    e.custom({
        "type": "farmersrespite:brewing",
        "container": {
            "item": "farmersdelight:milk_bottle"
        },
        "cookingtime": 2400,
        "experience": 0.35,
        "group": "hot_cocoa",
        "ingredients": [
            {
                "item": "ratatouille:cocoa_powder"
            },
            {
                "item": "minecraft:sugar"
            }
        ],
        "needwater": false,
        "recipe_book_tab": "drinks",
        "result": {
            "item": "farmersdelight:hot_cocoa"
        }
    })
    .id("farmersrespite:brewing/hot_cocoa")
})