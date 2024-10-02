ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "farmersdelight:cooking/peach_tea",
        "farmersdelight:cooking/mango_tea",
        "farmersdelight:cooking/mangosteen_tea",
        "farmersdelight:cooking/lychee_cherry_tea",
        "farmersdelight:cooking/hawberry_tea",
        "ends_delight:food/chorus_flower_tea",
        "farmersrespite:cutting/rose_bush"
    ])
    e.recipes.create.mixing(
        Fluid.of("fruitsdelight:peach_tea", 500),
        [
            Fluid.of("farmersrespite:yellow_tea", 500),
            "fruitsdelight:peach"
        ]
    )
        .heated().id("fruitsdelight:mixing/flowing_peach_tea")
    brewing(e, "farmersrespite:yellow_tea",
        [
            "fruitsdelight:peach",
            "fruitsdelight:peach"
        ], "fruitsdelight:peach_tea", "fruitsdelight:peach_tea"
    )
    e.recipes.create.mixing(
        Fluid.of("fruitsdelight:mango_tea", 500),
        [
            Fluid.of("farmersrespite:black_tea", 500),
            "fruitsdelight:mango"
        ]
    )
        .heated().id("fruitsdelight:mixing/flowing_mango_tea")
    brewing(e, "farmersrespite:black_tea",
        [
            "fruitsdelight:mango",
            "fruitsdelight:mango"
        ], "fruitsdelight:mango_tea", "fruitsdelight:mango_tea"
    )
    e.recipes.create.mixing(
        Fluid.of("fruitsdelight:mangosteen_tea", 500),
        [
            Fluid.of("farmersrespite:green_tea", 500),
            "fruitsdelight:mangosteen"
        ]
    )
        .heated().id("fruitsdelight:mixing/flowing_mangosteen_tea")
    brewing(e, "farmersrespite:green_tea",
        [
            "fruitsdelight:mangosteen",
            "fruitsdelight:mangosteen"
        ], "fruitsdelight:mangosteen_tea", "fruitsdelight:mangosteen_tea"
    )
    e.recipes.create.mixing(
        Fluid.of("fruitsdelight:lychee_cherry_tea", 1000),
        [
            Fluid.of("farmersrespite:green_tea", 1000),
            "fruitsdelight:lychee",
            "minecraft:cherry_leaves"
        ]
    )
        .heated().id("fruitsdelight:mixing/flowing_lychee_cherry_tea")
    brewing(e, "farmersrespite:green_tea",
        [
            "fruitsdelight:lychee",
            "minecraft:cherry_leaves"
        ], "fruitsdelight:lychee_cherry_tea", "fruitsdelight:lychee_cherry_tea"
    )
    e.recipes.create.mixing(
        Fluid.of("fruitsdelight:hawberry_tea", 500),
        [
            Fluid.of("farmersrespite:yellow_tea", 500),
            "fruitsdelight:hawberry"
        ]
    )
        .heated().id("fruitsdelight:mixing/flowing_hawberry_tea")
    brewing(e, "farmersrespite:yellow_tea",
        [
            "fruitsdelight:hawberry",
            "fruitsdelight:hawberry"
        ], "fruitsdelight:hawberry_tea", "fruitsdelight:hawberry_tea"
    )
    e.recipes.create.mixing(
        Fluid.of("create_central_kitchen:chorus_flower_tea", 500),
        [
            Fluid.water(500),
            "ends_delight:dried_chorus_flower"
        ]
    ).heated().id("create_central_kitchen:mixing/chorus_flower_tea")
    brewing(e, "minecraft:water",
        [
            "ends_delight:dried_chorus_flower",
            "ends_delight:dried_chorus_flower"
        ], "create_central_kitchen:chorus_flower_tea", "ends_delight:chorus_flower_tea"
    )
    cutting_3(e, "minecraft:rose_bush", [["farmersrespite:rose_hips", 2]])
    cutting_3(e, "farmersrespite:coffee_cake", [["farmersrespite:coffee_cake_slice", 7]])
    cutting_3(e, "farmersrespite:rose_hip_pie", [["farmersrespite:rose_hip_pie_slice", 4]])
})