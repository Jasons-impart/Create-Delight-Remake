ServerEvents.recipes(e => {
    e.replaceInput({id: "create_confectionery:black_chocolate_candy_1_recipe"}, "#forge:bars/chocolate", "create:bar_of_chocolate")
    e.replaceInput({id: "create_confectionery:white_chocolate_candy_1_recipe"}, "#forge:bars/chocolate", "create:bar_of_chocolate")
    e.replaceInput({id: "create_confectionery:ruby_chocolate_candy_1_recipe"}, "#forge:bars/chocolate", "create:bar_of_chocolate")
    const {create} = e.recipes
    create.mixing(
        "2x create_confectionery:honey_candy",
        [
            "2x minecraft:sugar",
            'bakeries:flour',
            Fluid.of("create:honey", 250)
        ]
    ).id("createdelight:honey_candy_recipe")
})