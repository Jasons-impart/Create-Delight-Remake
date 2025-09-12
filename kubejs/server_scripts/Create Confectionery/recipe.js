ServerEvents.recipes(e => {
    const {create} = e.recipes
    create.mixing(
        "2x create_confectionery:honey_candy",
        [
            "2x minecraft:sugar",
            'bakeries:flour',
            Fluid.of("create:honey", 250)
        ]
    ).id("create_confectionery:honey_candy_recipe")
})