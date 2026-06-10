ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "cavedelight:cutting/tectonic_pie",
        "cavedelight:cutting/radgill",
        "cavedelight:cutting/radgill_using_deployer",
        "alexscaves:slam",
        "cavedelight:musubi",
        "luncheonmeatsdelight:fry_luncheon_meat",
        "luncheonmeatsdelight:fry_luncheon_meat_smoking",
        "luncheonmeatsdelight:fry_luncheon_meat_campfire",
        "cavedelight:nutrient_bar",
    ])
    remove_recipes_input(e, [
        "cavedelight:pinenut_pie",
        "cavedelight:tectonic_cheesecake",
        "farmersrespite:filling/water_cup"
    ])
    remove_recipes_output(e, [
        "cavedelight:fiddlehead_tea"
    ])
    e.replaceInput({id: "cavedelight:star_cookie"}, "minecraft:wheat", "bakeries:flour")
    e.replaceInput({id: "luncheonmeatsdelight:cooking/fried_egg_luncheon_meat"}, "luncheonmeatsdelight:luncheon_meat", "cavedelight:cooked_slam_slice")
    e.replaceInput({id: "cavedelight:slam_breakfast"}, "#cavedelight:slam", "cavedelight:cooked_slam_slice")
    e.replaceInput({id: "cavedelight:slam_burger"}, "#cavedelight:slam", "cavedelight:cooked_slam_slice")
    cutting_2(e, "cavedelight:tectonic_cheesecake", [["cavedelight:slice_of_tectonic_cheesecake", 4]])
    e.recipes.create.compacting(
        'cavedelight:nutrient_bar',
        [
            'bakeries:flour',
            Fluid.of("createdelight:soya_milk", 50),
            'alexscaves:sulfur_dust'
        ]
    )
        .heated()
        .id("createdelight:mixing/nutrient_bar")
    e.recipes.farmersdelight.cutting(
        "cavedelight:tectonic_cheesecake",
        "#forge:tools/knives",
        ["4x cavedelight:slice_of_tectonic_cheesecake"]
    ).id("cavedelight:cutting/tectonic_pie")
    cutting_2(e, "cavedelight:pinenut_pie", [["cavedelight:slice_of_pinenut_pie", 4]])
    cutting_2(e, "alexscaves:radgill", [["cavedelight:radgill_slice", 2], ["crabbersdelight:fish_bones", 1]])
    brewing(e, 'farmersrespite:green_tea', ['alexscaves:fiddlehead', 'alexscaves:fiddlehead'], 'createdelight:fiddlehead_tea', 'cavedelight:fiddlehead_tea')
    e.recipes.create.mixing(
        Fluid.of("createdelight:fiddlehead_tea", 500),
        [
            Fluid.of("farmersrespite:green_tea", 500),
            "alexscaves:fiddlehead"
        ]
    ).id("createdelight:mixing/fiddlehead_tea")
    e.recipes.create.filling(
        "cavedelight:fiddlehead_tea",
        [
            Fluid.of("createdelight:fiddlehead_tea", 250),
            "minecraft:glass_bottle"
        ]
    ).id("createdelight:filling/fiddlehead_tea")
    e.recipes.create.emptying(
       [
            Fluid.of("createdelight:fiddlehead_tea", 250),
            "minecraft:glass_bottle"
       ],
       "cavedelight:fiddlehead_tea"
    ).id("createdelight:emptying/fiddlehead_tea")
    e.recipes.create.filling(
        "minecraft:copper_ingot",
        [
            'miners_delight:copper_cup',
            Fluid.of("minecraft:lava", 1000)
        ]
    ).id("createdelight:filling/copper_ingot_from_copper_cup")
    e.recipes.create.emptying(
        [
            Fluid.of("createdelight:green_soylent", 500),
            'create:cardboard'
        ],
        'alexscaves:green_soylent'
    ).id("createdelight:emptying/green_soylent")
    e.recipes.create.filling(
        'cavedelight:bottle_of_green_soylent',
        [
            Fluid.of("createdelight:green_soylent", 250),
            "minecraft:glass_bottle"
        ]
    ).id("createdelight:filling/bottle_of_green_soylent")
    e.recipes.create.mixing(
        Fluid.of("createdelight:radpop_fluid", 500),
        [
            Fluid.of("createdelight:green_soylent", 250),
            Fluid.of("alexscaves:acid", 250),
            "2x minecraft:sugar"
        ]
    ).id("createdelight:mixing/radpop_fluid")
    e.recipes.create.filling(
        "cavedelight:radpop",
        [
            Fluid.of("createdelight:radpop_fluid", 250),
            "minecraft:glass_bottle"
        ]
    ).id("createdelight:filling/radpop")
})
ServerEvents.tags("item", e => {
    e.remove('cavedelight:slam', [
        'alexscaves:slam'
    ])
})