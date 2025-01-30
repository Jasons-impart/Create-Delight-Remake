ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "create_central_kitchen:mixing/coffee",
        "create_central_kitchen:filling/coffee"
    ])
    // 咖啡
    e.recipes.create.mixing(
        Fluid.of("farmersrespite:coffee", 500),
        [
            "createcafe:coffee_grounds",
            Fluid.of("water", 500)
        ]
    )
        .heated()
        .id("createcafe:mixing/coffee/coffee_mixing")
    // 袋装咖啡豆
    e.recipes.minecraft.crafting_shapeless(
        "farmersrespite:coffee_beans_sack",
        ["9x createcafe:roasted_coffee_beans"]
    )
        .id("farmersrespite:coffee_beans_sack")
    e.recipes.minecraft.crafting_shapeless(
        "9x createcafe:roasted_coffee_beans",
        ["farmersrespite:coffee_beans_sack"]
    )
        .id("farmersrespite:coffee_beans")
    // 咖啡豆粉碎
    e.recipes.create.milling(
        [
            "createcafe:coffee_grounds",
            Item.of("2x createcafe:coffee_grounds").withChance(0.25)
        ], "farmersrespite:coffee_beans"
    ).id("farmersrespite:milling/coffee_beans")
    e.custom({
        "type": "farmersrespite:brewing",
        "base": {
            "count": 1000,
            "fluid": "minecraft:water"
        },
        "cookingtime": 2400,
        "experience": 0.35,
        "ingredients": [
            {
                "item": "createcafe:coffee_grounds"
            },
            {
                "item": "createcafe:coffee_grounds"
            }
        ],
        "result": {
            "count": 1000,
            "fluid": "farmersrespite:coffee"
        }
    }).id("farmersrespite:brewing/coffee_from_water")
    e.recipes.create.filling(
        "createcafe:iced_coffee",
        [
            "createcafe:iced_coffee_cup_ice",
            Fluid.of("farmersrespite:coffee", 250)
        ]
    ).id("createcafe:filling/coffee/iced_coffee_filling")
})