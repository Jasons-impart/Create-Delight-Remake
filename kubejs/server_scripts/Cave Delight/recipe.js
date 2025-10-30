ServerEvents.recipes(e => {
    remove_recipes_input(e, [
        "cavedelight:pinenut_pie",
        "cavedelight:tectonic_cheesecake",
        "farmersrespite:filling/water_cup"
    ])
    remove_recipes_output(e, [
        "cavedelight:fiddlehead_tea"
    ])
    e.replaceInput({id: "cavedelight:star_cookie"}, "minecraft:wheat", "ratatouille:wheat_kernels")
    cutting_2(e, "cavedelight:tectonic_cheesecake", [["cavedelight:slice_of_tectonic_cheesecake", 4]])
    cutting_2(e, "cavedelight:pinenut_pie", [["cavedelight:slice_of_pinenut_pie", 4]])
    brewing(e, 'farmersrespite:green_tea', ['alexscaves:fiddlehead', 'alexscaves:fiddlehead'], 'createdelight:fiddlehead_tea', 'cavedelight:fiddlehead_tea')
    e.recipes.create.mixing(
        Fluid.of("createdelight:fiddlehead_tea", 500),
        [
            Fluid.of("farmersrespite:green_tea", 500),
            "alexscaves:fiddlehead"
        ]
    ).id("cavedelight:mixing/fiddlehead_tea")
    e.recipes.create.filling(
        "cavedelight:fiddlehead_tea",
        [
            Fluid.of("createdelight:fiddlehead_tea", 250),
            "minecraft:glass_bottle"
        ]
    ).id("cavedelight:filling/fiddlehead_tea")
    e.recipes.create.emptying(
       [
            Fluid.of("createdelight:fiddlehead_tea", 250),
            "minecraft:glass_bottle"
       ],
       "cavedelight:fiddlehead_tea"
    ).id("cavedelight:emptying/fiddlehead_tea")
    e.recipes.create.filling(
        "minecraft:copper_ingot",
        [
            'miners_delight:copper_cup',
            Fluid.of("minecraft:lava", 1000)
        ]
    ).id("cavedelight:filling/copper_ingot_from_copper_cup")
})