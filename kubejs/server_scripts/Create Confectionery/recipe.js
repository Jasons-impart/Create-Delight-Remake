ServerEvents.recipes(e => {
    const {create} = e.recipes
    create.mixing("create_confectionery:candy_cane", [
        Fluid.water(250),
        "4x minecraft:sugar",
        "neapolitan:mint_leaves"
    ])
    create.mixing(
        "2x create_confectionery:honey_candy",
        [
            "2x minecraft:sugar",
            'bakeries:flour',
            Fluid.of("create:honey", 250)
        ]
    ).id("create_confectionery:honey_candy_recipe")
})