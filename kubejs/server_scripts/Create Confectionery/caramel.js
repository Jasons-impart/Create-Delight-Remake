ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "create:fill_minecraft_bucket_with_createcafe_caramel_syrup",
        "createcafe:mixing/syrups/caramel_syrup_mixing"
    ])
    e.recipes.create.mixing(
        Fluid.of("create_confectionery:caramel", 250),
        [
            Fluid.water(250),
            "2x minecraft:sugar"
        ], 500
    )
        .superheated()
        .id("create_confectionery:caramel_recipe")
    e.recipes.create.filling(
        "createcafe:caramel_iced_coffee",
        [
            "createcafe:iced_coffee",
            Fluid.of("create_confectionery:caramel", 250)
        ]
    ).id("createcafe:filling/coffee/caramel_iced_coffee_filling")
    e.recipes.create.filling(
        "corn_delight:caramel_popcorn",
        [
            "culturaldelights:popcorn",
            Fluid.of("create_confectionery:caramel", 250)
        ]
    ).id("corn_delight:caramel_popcorn")
    e.recipes.farmersdelight.cooking(
        [
            "create_confectionery:bar_of_caramel",
            "culturaldelights:corn_kernels"
        ], "corn_delight:caramel_popcorn", 1.0, 200
    ).id("corn_delight:cooking/caramel_popcorn")
})
