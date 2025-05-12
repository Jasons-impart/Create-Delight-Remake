ServerEvents.tags("item", e => {
    e.add("createdelight:sculk_food_root", [
        "minecraft:sculk_catalyst",
        "minecraft:sculk"
    ])
})

ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "farmersdelight:pie_crust",
        "farmersdelight:integration/create/mixing/pie_crust_from_mixing",
        "silentsdelight:sculk_catalyst_pie_crust",
        "silentsdelight:sculk_catalyst_pie",
        "create_central_kitchen:crafting/pumpkin_pie",
        "farmersdelight:chocolate_pie",
        "farmersdelight:apple_pie",
        "farmersrespite:rose_hip_pie",
        "farmersdelight:cooking/pineapple_pie",
        "casualness_delight:crafting_shaped/stargazy_pie",
        "casualness_delight:crafting_shaped/quiche_lorraine",
        "farmersdelight:cooking/durian_pie",
        "farmersdelight:cooking/fig_tart",
        "farmersdelight:cooking/lemon_tart",
        "ends_delight:food/chorus_fruit_pie",
        "minecraft:pumpkin_pie"
    ])
    baking(e, "createdelight:puff_pastry", "farmersdelight:pie_crust", 1, "food", 100)
    e.recipes.kubejs.shapeless(
        "silentsdelight:sculk_catalyst_pie_crust",
        [
            "farmersdelight:pie_crust",
            "#createdelight:sculk_food_root"
        ]
    ).id("createdelight:crafting/sculk_catalyst_pie_crust")
    e.recipes.create.deploying(
        "silentsdelight:sculk_catalyst_pie",
        [
            "silentsdelight:sculk_catalyst_pie_crust",
            "#createdelight:sculk_food_root"
        ]
    ).id("createdelight:deploying/sculk_catalyst_pie")
    let pie_recipes = [
        ["farmersdelight:pumpkin_slice", "minecraft:pumpkin_pie"],
        ["minecraft:apple", "farmersdelight:apple_pie"],
        ["farmersrespite:rose_hips", "farmersrespite:rose_hip_pie"],
        ["fruitsdelight:pineapple_slice", "3x fruitsdelight:pineapple_pie"],
        ["fruitsdelight:durian_flesh", "3x fruitsdelight:durian_pie"]
    ]
    pie_recipes.forEach(([input, output]) => {
        e.recipes.farmersdelight.cooking(
            [
                input,
                input,
                input,
                "minecraft:sugar",
                "farmersdelight:pie_crust",
                "#forge:eggs",
            ],
            output, 1.0, 200
        ).id(`createdelight:cooking/${output.split(":")[1]}`)
    });
    e.recipes.farmersdelight.cooking(
        [
            "#minecraft:flowers",
            "#forge:chorus_fruits",
            "ends_delight:dried_chorus_flower",
            "#forge:eggs",
            "farmersdelight:pie_crust",
            "#forge:vegetables/potato"
        ],
        "ends_delight:chorus_fruit_pie", 10.0, 200
    ).id("createdelight:cooking/chorus_fruit_pie")
    e.recipes.farmersdelight.cooking(
        [
            "#alexsmobs:shoebill_foodstuffs",
            "#alexsmobs:shoebill_foodstuffs",
            "#alexsmobs:shoebill_foodstuffs",
            "#forge:eggs",
            "farmersdelight:pie_crust",
            "#forge:vegetables/potato"
        ],
        "casualness_delight:stargazy_pie", 10.0, 200
    ).id("createdelight:cooking/stargazy_pie")
    e.recipes.farmersdelight.cooking(
        [
            "#forge:seafood",
            "#forge:cheese",
            "#forge:meat/raw",
            "#forge:eggs",
            "farmersdelight:pie_crust",
            "#forge:eggs"
        ],
        "casualness_delight:quiche_lorraine", 1.0, 200
    ).id("createdelight:cooking/quiche_lorraine")
    e.recipes.farmersdelight.cooking(
        [
            "#forge:eggs",
            "minecraft:sugar",
            "#forge:milk",
            "fruitsdelight:fig",
            "farmersdelight:pie_crust",
            "fruitsdelight:fig"
        ],
        "4x fruitsdelight:fig_tart", 4.0, 200
    ).id("createdelight:cooking/fig_tart")
    e.recipes.farmersdelight.cooking(
        [
            "#forge:eggs",
            "minecraft:sugar",
            "#forge:milk",
            "fruitsdelight:lemon_slice",
            "farmersdelight:pie_crust",
            "fruitsdelight:lemon_slice"
        ],
        "4x fruitsdelight:lemon_tart", 4.0, 200
    ).id("createdelight:cooking/lemon_tart")
    e.recipes.farmersdelight.cooking(
       [
            "alexscaves:tectonic_shard",
            "alexscaves:tectonic_shard",
            "alexscaves:tectonic_shard",
            "#forge:cheese",
            "farmersdelight:pie_crust",
            "#forge:cheese"
       ],
       'cavedelight:tectonic_cheesecake', 4.0, 200
    ).id("cavedelight:tectonic_cheesecake")
    e.recipes.farmersdelight.cooking(
        [
            "trailandtales_delight:cherry_petal",
            "trailandtales_delight:cherry_petal",
            "trailandtales_delight:cherry_petal",
            "#forge:cheese",
            "farmersdelight:pie_crust",
            "#forge:cheese"
       ],
       'trailandtales_delight:cherry_cheese_pie', 4.0, 200
    ).id("trailandtales_delight:cherry_cheese_pie")
    e.recipes.farmersdelight.cooking(
        [
            'trailandtales_delight:cherry_cheese_slice',
            "farmersdelight:pie_crust",
            'trailandtales_delight:cherry_cheese_slice'
        ],
        'trailandtales_delight:cherry_cheese_pie', 1.0, 200
    ).id("trailandtales_delight:cherry_cheese_pie_2")
    e.recipes.farmersdelight.cooking(
        [
            'alexscaves:pine_nuts',
            'alexscaves:pewen_sap',
            'alexscaves:pine_nuts',
            "#forge:cheese",
            "farmersdelight:pie_crust",
            "#forge:cheese"
       ],
       'cavedelight:pinenut_pie', 4.0, 200
    ).id("cavedelight:pinenut_pie")
    e.recipes.farmersdelight.cooking(
        [
            'minecraft:cornflower',
            'minecraft:allium',
            'minecraft:cornflower',
            'minecraft:sugar',
            "farmersdelight:pie_crust",
            '#forge:eggs'
       ],
       'youkaishomecoming:tarte_lune', 4.0, 200
    ).id("youkaishomecoming:tarte_lune")
})
