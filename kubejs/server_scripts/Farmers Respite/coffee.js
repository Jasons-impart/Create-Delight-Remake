ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "create_central_kitchen:mixing/coffee",
        "create_central_kitchen:filling/coffee",
        "farmersrespite:brewing/coffee_from_water",
        "farmersrespite:filling/coffee",
        "farmersrespite:filling/long_coffee",
        "farmersrespite:brewing/long_coffee_from_coffee",
        "farmersrespite:filling/strong_coffee",
        "farmersrespite:brewing/strong_coffee_from_coffee",
        "farmersrespite:emptying/coffee",
        "farmersrespite:emptying/long_coffee",
        "farmersrespite:emptying/strong_coffee",
        "farmersrespite:milling/coffee_beans",
        "farmersrespite:coffee_beans_sack"
    ])
    // 咖啡
    e.recipes.create.mixing(
        Fluid.of("createdelight:americano_fluid", 1000),
        [
            "createcafe:coffee_grounds",
            Fluid.of("water", 1000)
        ]
    )
        .heated()
        .id("createdelight:mixing/coffee/coffee_mixing")
    // 袋装咖啡豆
    e.recipes.minecraft.crafting_shapeless(
        "farmersrespite:coffee_beans_sack",
        ["9x createcafe:roasted_coffee_beans"]
    )
        .id("createdelight:coffee_beans_sack")
    e.recipes.minecraft.crafting_shapeless(
        "9x createcafe:roasted_coffee_beans",
        ["farmersrespite:coffee_beans_sack"]
    )
        .id("createdelight:coffee_beans")
    //焙烧咖啡豆
    blast_and_smelting(e, 'createcafe:coffee_beans', 'createcafe:roasted_coffee_beans', 0.7, 100)
    e.recipes.ratatouille.baking(
        "createcafe:roasted_coffee_beans",
        "createcafe:coffee_beans",
        200
    ).id("createdelight:baking/roasted_coffee_beans")
})