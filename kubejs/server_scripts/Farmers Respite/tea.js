ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "create_central_kitchen:emptying/apple_cider",
        "create_central_kitchen:filling/apple_cider",
        "minecraft:red_dye",
        "farmersrespite:brewing/gamblers_tea_from_water",
    ])
    let tea_recipes = [
        ["farmersrespite:green_tea_leaves", "farmersrespite:green_tea"],
        ["farmersrespite:yellow_tea_leaves", "farmersrespite:yellow_tea"],
        ["farmersrespite:black_tea_leaves", "farmersrespite:black_tea"],
        ["farmersrespite:rose_hips", "farmersrespite:rose_hip_tea"]
    ]
    tea_recipes.forEach(([input, output]) => {
        e.recipes.create.mixing(
            Fluid.of(output, 500),
            [
                Fluid.water(500),
                input
            ]
        )
            .heated()
            .id(`createdelight:mixing/${output.split(":")[1]}`)
    });
    e.recipes.create.mixing(
        Fluid.of("farmersrespite:gamblers_tea", 1000),
        [
            Fluid.water(1000),
            "minecraft:glow_berries",
            "createcafe:coffee_fruit"
        ]
    ).heated().id("createdelight:mixing/gamblers_tea")
    e.recipes.create.mixing(
        Fluid.of("farmersrespite:purulent_tea", 1000),
        [
            Fluid.water(1000),
            "minecraft:fermented_spider_eye",
            "minecraft:nether_wart"
        ]
    ).heated().id("createdelight:mixing/purulent_tea")
    brewing(e, "minecraft:water", ["minecraft:dandelion", "minecraft:dandelion"], "farmersrespite:dandelion_tea", 'farmersrespite:dandelion_tea')
    brewing_2(e, "minecraft:water", ["minecraft:glow_berries", "createcafe:coffee_fruit"], "farmersrespite:gamblers_tea")
    e.recipes.create.mixing(
        Fluid.of("farmersrespite:dandelion_tea", 500),
        [
            Fluid.water(500),
            "minecraft:dandelion"
        ]
    ).heated().id("createdelight:mixing/dandelion_tea")

})