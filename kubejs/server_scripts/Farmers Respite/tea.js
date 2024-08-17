ServerEvents.recipes(e => {
    let tea_recipes = [
        ["farmersrespite:green_tea_leaves", "farmersrespite:green_tea"],
        ['farmersrespite:yellow_tea_leaves', 'farmersrespite:yellow_tea'],
        ['farmersrespite:black_tea_leaves', 'farmersrespite:black_tea'],
        ['farmersrespite:rose_hips', 'farmersrespite:rose_hip_tea']
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
            .id(`farmersrespite:mixing/${output.split(":")[1]}`)
    });
    e.recipes.create.mixing(
        Fluid.of("farmersrespite:gamblers_tea", 1000),
        [
            Fluid.water(1000),
            "minecraft:glow_berries",
            "farmersrespite:coffee_berries"
        ]
    ).heated().id("farmersrespite:mixing/gamblers_tea")
    e.recipes.create.mixing(
        Fluid.of("farmersrespite:purulent_tea", 1000),
        [
            Fluid.water(1000),
            "minecraft:fermented_spider_eye",
            "minecraft:nether_wart"
        ]
    ).heated().id("farmersrespite:mixing/purulent_tea")
    e.recipes.create.mixing(
        Fluid.of("farmersrespite:dandelion_tea", 1000),
        [
            Fluid.water(1000),
            "#farmersrespite:tea_leaves",
            "minecraft:dandelion"
        ]
    ).heated().id("farmersrespite:mixing/dandelion_tea")

})