ServerEvents.tags("item", e => {
    e.add("forge:fruits/durian", [
        "fruitsdelight:durian_flesh"
    ]),
    e.add("forge:fruits/apple", [
        "minecraft:apple"
    ]),
    e.add("forge:fruits/pumpkin_slice", [
        "farmersdelight:pumpkin_slice"
    ])
    e.add("forge:fruits/sweet_berries", [
        "minecraft:sweet_berries"
    ])
    e.add("forge:fruits/melon_slice", [
        "minecraft:melon_slice"
    ]),
    e.add("forge:cafe/oreo_crushed", [
        "createcafe:oreo_crushed"
    ])
})
ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "createcafe:mixing/vanilla_tea_mixing2",
        "createcafe:mixing/avocado_tea_mixing3"
    ])
    let milk_teas = [
        ["#forge:fruits/fig", "farmersrespite:green_tea", "createcafe:fig_tea"],
        ["#forge:fruits/grape", "farmersrespite:green_tea", "createcafe:grape_tea"],
        ["#forge:fruits/blood_orange", "farmersrespite:green_tea", "createcafe:blood_tea"],
        ["#forge:fruits/pineapple", "farmersrespite:green_tea", "createcafe:pineapple_tea"],
        ["#forge:fruits/apple", "farmersrespite:green_tea", "createcafe:apple_tea"],
        ["#forge:fruits/lemon", "farmersrespite:green_tea", "createcafe:lemon_tea"],
        ["#forge:fruits/melon_slice", "farmersrespite:green_tea", "createcafe:watermelon_tea"],
        ["#forge:fruits/lime", "farmersrespite:green_tea", "createcafe:lime_tea"],
        ["#forge:fruits/pumpkin_slice", "farmersrespite:yellow_tea", "createcafe:pumpkin_tea"],
        ["#forge:fruits/kiwi", "farmersrespite:yellow_tea", "createcafe:kiwi_tea"],
        ["#forge:fruits/orange", "farmersrespite:yellow_tea", "createcafe:orange_tea"],
        ["#forge:fruits/persimmon", "farmersrespite:yellow_tea", "createcafe:persimmon_tea"],
        ["#forge:fruits/lychee", "farmersrespite:yellow_tea", "createcafe:lychee_tea"],
        ['#forge:fruits/durian', "farmersrespite:yellow_tea", "createcafe:durian_tea"],
        ["#neapolitan:vanilla", "farmersrespite:black_tea", "createcafe:vanilla_tea"],
        ['#culturaldelights:avocados', "farmersrespite:black_tea", "createcafe:avocado_tea"],
        ["#forge:fruits/mango", "farmersrespite:black_tea", "createcafe:mango_tea"],
        ['#forge:fruits/peach', "farmersrespite:black_tea", "createcafe:peach_tea"],
        ["#forge:fruits/blueberry", "farmersrespite:black_tea", "createcafe:blueberry_tea"],
        ["#forge:fruits/sweet_berries", "farmersrespite:black_tea", "createcafe:sweetberry_tea"],
        ["#forge:fruits/banana", "farmersrespite:black_tea", "createcafe:banana_tea"],
        ["#forge:fruits/cherry", "farmersrespite:black_tea", "createcafe:cherry_tea"],
        ["#forge:cafe/oreo_crushed", "farmersrespite:black_tea", "createcafe:oreo_tea"],
        ["#forge:chorus_fruits", "farmersrespite:black_tea", "create_central_kitchen:chorus_fruit_milk_tea"],
        ["#forge:fruits/strawberry", "farmersrespite:black_tea", "createcafe:strawberry_tea"],
        ["#forge:fruits/pomegranate", "farmersrespite:black_tea", "createcafe:pomegranate_tea"],
    ]
    milk_teas.forEach(milk_tea => {
        e.recipes.create.mixing(
            Fluid.of(milk_tea[2], 500),
            [
                milk_tea[0],
                "minecraft:sugar",
                FluidIngredients("forge:milk", 200),
                Fluid.of(milk_tea[1], 100)
            ]
        ).id(`createcafe:mixing/${milk_tea[2].split(":")[1]}_mixing`)
    });
})