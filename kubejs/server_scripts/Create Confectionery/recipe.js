ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "create_confectionery:black_chocolate_recipe_6",
        "create_confectionery:chocolate_recipe_6",
        "create_confectionery:ruby_chocolate_recipe_6",
        "create_confectionery:white_chocolate_recipe_6"
    ])

    e.replaceInput({id: "create_confectionery:black_chocolate_candy_1_recipe"}, "#forge:bars/chocolate", "create:bar_of_chocolate")
    e.replaceInput({id: "create_confectionery:white_chocolate_candy_1_recipe"}, "#forge:bars/chocolate", "create:bar_of_chocolate")
    e.replaceInput({id: "create_confectionery:ruby_chocolate_candy_1_recipe"}, "#forge:bars/chocolate", "create:bar_of_chocolate")
    const {create} = e.recipes

    create.mixing(
        Fluid.of("create_confectionery:black_chocolate", 1000),
        ["create_confectionery:black_chocolate_bricks"]
    ).heated().id("create_confectionery:black_chocolate_recipe_6")
    create.mixing(
        Fluid.of("create:chocolate", 1000),
        ["create_confectionery:chocolate_bricks"]
    ).heated().id("create_confectionery:chocolate_recipe_6")
    create.mixing(
        Fluid.of("create_confectionery:ruby_chocolate", 1000),
        ["create_confectionery:ruby_chocolate_bricks"]
    ).heated().id("create_confectionery:ruby_chocolate_recipe_6")
    create.mixing(
        Fluid.of("create_confectionery:white_chocolate", 1000),
        ["create_confectionery:white_chocolate_bricks"]
    ).heated().id("create_confectionery:white_chocolate_recipe_6")

    create.mixing(
        "2x create_confectionery:honey_candy",
        [
            "2x minecraft:sugar",
            'bakeries:flour',
            Fluid.of("create:honey", 250)
        ]
    ).id("createdelight:honey_candy_recipe")
})
