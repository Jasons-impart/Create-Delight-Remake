ServerEvents.tags("item", e => {
    e.add("createdelight:sculk_food_root", [
        "minecraft:sculk_catalyst",
        "minecraft:sculk"
    ])
    e.add("createdelight:raw_pie", [
        'bakeries:cream_pumpkin_pie_dough'
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
        "minecraft:pumpkin_pie",
        "silentsdelight:cutting/sculk_catalyst_pie",
        "cavedelight:pinenut_pie",
        "collectorsreap:food/lime_pie_from_condensed_milk",
        "youkaishomecoming:tarte_lune",
        "farmersdelight:sweet_berry_cheesecake",
        "collectorsreap:food/sweet_berry_cheesecake_from_cream_cheese",
        "trailandtales_delight:cherry_cheese_pie",
        "dungeonsdelight:spider_pie",
        "dungeonsdelight:sculk_tart",
        "silentsdelight:sculk_catalyst_pie_from_slices",
        "farmersdelight:integration/create/filling/chocolate_pie",
        "cavedelight:tectonic_cheesecake",
        "cosmopolitan:farmersdelight/watet_pie"
    ])
    // baking(e, "createdelight:puff_pastry", "farmersdelight:pie_crust", 1, "food", 100)
    e.custom({
        type: "bakeries:dough_crafting_table",
        count: 1,
        ingredient:{item: "createdelight:puff_pastry"},
        result: "createdelight:raw_pie_crust"
    }).id("createdelight:dough_crafting_table/raw_pie_crust")
    e.recipes.vintageimprovements.curving(
        'createdelight:raw_pie_crust',
        "createdelight:puff_pastry",
        2
    ).id("createdelight:curving/raw_pie_crust")
    baking(e, 'createdelight:raw_pie_crust', "farmersdelight:pie_crust", 1, "food", 100)

    let pie_recipes = [
        ["#forge:chorus_fruits", "createdelight:unbake_chorus_fruit_pie", "ends_delight:chorus_fruit_pie"],
        ["seasonals:pumpkin_puree", "bakeries:cream_pumpkin_pie_dough", "minecraft:pumpkin_pie"],
        ["vinery:apple_mash", "createdelight:unbake_apple_pie", "farmersdelight:apple_pie"],
        ["farmersrespite:rose_hips", "createdelight:unbake_rose_hip_pie", "farmersrespite:rose_hip_pie"],
        ['collectorsreap:lime_slice','createdelight:unbake_lime_pie', 'collectorsreap:lime_pie'],
        ['alexscaves:pine_nuts', 'createdelight:unbake_pinenut_pie', 'cavedelight:pinenut_pie'],
    ]
    pie_recipes.forEach(pie_recipe => {
        let ingredient = pie_recipe[0]
        let unbake = pie_recipe[1]
        let pie = pie_recipe[2]
        let iner = "farmersdelight:pie_crust"
        e.recipes.create.sequenced_assembly(unbake, iner, [
            e.recipes.create.deploying(iner, [iner, ingredient]),
            e.recipes.create.filling(iner, [iner, Fluid.of("createdelight:egg_yolk", 250)]),
            e.recipes.create.deploying(iner, [iner, 'minecraft:sugar'])
        ])
            .loops(1)
            .transitionalItem(iner)
            .id("createdelight:sequenced_assembly/" + unbake.split(":")[1])
        e.recipes.kubejs.shapeless(
            unbake,
            [
                ingredient,
                ingredient,
                ingredient,
                "minecraft:sugar",
                "farmersdelight:pie_crust",
                "#forge:eggs",
            ]).id("createdelight:shapeless/" + unbake.split(":")[1] + "_manual_only")
        baking(e, unbake, pie, 1, "food", 200)
    });

    let sp_pie_recipes = [
        ['dungeonsdelight:spider_extract','minecraft:fermented_spider_eye','createdelight:unbake_spider_pie','dungeonsdelight:spider_pie'],
        ['dungeonsdelight:sculk_polyp', 'dungeonsdelight:ancient_egg', 'createdelight:unbake_sculk_tart', "dungeonsdelight:sculk_tart"]
    ]
    sp_pie_recipes.forEach(sp_pie_recipe => {
        let ingredient_0 = sp_pie_recipe[0]
        let ingredient_1 = sp_pie_recipe[1]
        let unbake = sp_pie_recipe[2]
        let pie = sp_pie_recipe[3]
        let iner = "farmersdelight:pie_crust"
        e.recipes.create.sequenced_assembly(unbake, iner, [
            e.recipes.create.deploying(iner, [iner, ingredient_0]),
            e.recipes.create.deploying(iner, [iner, ingredient_1]),
            e.recipes.create.filling(iner, [iner, Fluid.of("createdelight:egg_yolk", 250)]),
            e.recipes.create.deploying(iner, [iner, 'minecraft:sugar'])
        ])
            .loops(1)
            .transitionalItem(iner)
            .id("createdelight:sequenced_assembly/" + unbake.split(":")[1])
        e.recipes.kubejs.shapeless(
            unbake,
            [
                ingredient_0,
                ingredient_0,
                ingredient_0,
                ingredient_1,
                ingredient_1,
                ingredient_1,
                "minecraft:sugar",
                "farmersdelight:pie_crust",
                "#forge:eggs",
            ]).id("createdelight:shapeless/" + unbake.split(":")[1] + "_manual_only")
        baking(e, unbake, pie, 1, "food", 200)
    });

    let quiche_recipes = [
        ['collectorsreap:portobello', '#forge:vegetables/onion', 'createdelight:unbake_portobello_quiche', 'collectorsreap:portobello_quiche'],
        ["#forge:meat/raw", "#forge:seafood", 'createdelight:unbake_quiche_lorraine', 'casualness_delight:quiche_lorraine'],
        ['create_bic_bit:raw_herring', 'create_bic_bit:raw_herring', 'createdelight:unbake_stargazy_pie', 'casualness_delight:stargazy_pie']
    ]
    quiche_recipes.forEach(quiche_recipe => {
        let ingredient_0 = quiche_recipe[0]
        let ingredient_1 = quiche_recipe[1]
        let unbake = quiche_recipe[2]
        let pie = quiche_recipe[3]
        let iner = "farmersdelight:pie_crust"
        e.recipes.create.sequenced_assembly(unbake, iner, [
            e.recipes.create.deploying(iner, [iner, ingredient_0]),
            e.recipes.create.deploying(iner, [iner, 'trailandtales_delight:cheese_slice']),
            e.recipes.create.deploying(iner, [iner, ingredient_1]),
            e.recipes.create.filling(iner, [iner, Fluid.of("createdelight:egg_yolk", 250)]),
        ])
            .loops(1)
            .transitionalItem(iner)
            .id("createdelight:sequenced_assembly/" + unbake.split(":")[1])
        e.recipes.kubejs.shapeless(
            unbake,
            [
                ingredient_0,
                "trailandtales_delight:cheese_slice",
                ingredient_1,
                "#forge:eggs",
                "farmersdelight:pie_crust",
                "#forge:eggs",
            ]).id("createdelight:shapeless/" + unbake.split(":")[1] + "_manual_only")
        baking(e, unbake, pie, 1, "food", 200)
    });
    cutting_2(e, 'casualness_delight:stargazy_pie', [
        ['casualness_delight:stargazy_pie_slice', 4]
    ])
    cutting_2(e, 'casualness_delight:quiche_lorraine', [
        ['casualness_delight:quiche_lorraine_slice', 4]
    ])

    let chees_pie_recipes = [
        ["minecraft:sweet_berries", 'createdelight:unbake_sweet_berry_cheesecake', 'farmersdelight:sweet_berry_cheesecake'],
        ['alexscaves:tectonic_shard', 'createdelight:unbake_tectonic_cheesecake', 'cavedelight:tectonic_cheesecake']
    ]
    chees_pie_recipes.forEach(chees_pie_recipe => {
        let iner = "farmersdelight:pie_crust"
        let ingredient = chees_pie_recipe[0]
        let unbake = chees_pie_recipe[1]
        let pie = chees_pie_recipe[2]
        e.recipes.create.sequenced_assembly(unbake, iner, [
            e.recipes.create.deploying(iner, [iner, ingredient]),
            e.recipes.create.deploying(iner, [iner, 'trailandtales_delight:cheese_slice'])
        ])
            .loops(1)
            .transitionalItem(iner)
            .id("createdelight:sequenced_assembly/" + unbake.split(":")[1])
        e.recipes.kubejs.shapeless(
            unbake,
            [
                ingredient,
                ingredient,
                ingredient,
                "trailandtales_delight:cheese_slice",
                "farmersdelight:pie_crust",
                "trailandtales_delight:cheese_slice",
            ]).id("createdelight:shapeless/" + unbake.split(":")[1] + "_manual_only")
        baking(e, unbake, pie, 1, "food", 200)
    });

    {
        let iner = "farmersdelight:pie_crust"
        e.recipes.create.sequenced_assembly('createdelight:unbake_tarte_lune', iner, [
            e.recipes.create.deploying(iner, [iner, 'minecraft:allium']),
            e.recipes.create.deploying(iner, [iner, 'minecraft:cornflower']),
            e.recipes.create.deploying(iner, [iner, 'farmersdelight:rice']),
            e.recipes.create.deploying(iner, [iner, 'trailandtales_delight:cheese_slice'])
        ])
            .loops(1)
            .transitionalItem(iner)
            .id("createdelight:sequenced_assembly/unbake_tarte_lune")
        e.recipes.kubejs.shapeless(
            'createdelight:unbake_tarte_lune',
            [
                'minecraft:cornflower',
                'minecraft:allium',
                'minecraft:cornflower',
                "farmersdelight:rice",
                "farmersdelight:pie_crust",
                "trailandtales_delight:cheese_slice",
            ]).id("createdelight:shapeless/unbake_tarte_lune_manual_only")
        baking(e, 'createdelight:unbake_tarte_lune', 'youkaishomecoming:tarte_lune', 1, "food", 200)
    }

    {
        let iner = "farmersdelight:pie_crust"
        e.recipes.create.sequenced_assembly('createdelight:unbake_cherry_cheese_pie', iner, [
            e.recipes.create.deploying(iner, [iner, 'trailandtales_delight:cherry_petal']),
            e.recipes.create.deploying(iner, [iner, 'trailandtales_delight:cheese_slice'])
        ])
            .loops(1)
            .transitionalItem(iner)
            .id("createdelight:sequenced_assembly/unbake_cherry_cheese_pie_1")
        e.recipes.kubejs.shapeless(
            'createdelight:unbake_cherry_cheese_pie',
            [
                'trailandtales_delight:cherry_petal',
                'trailandtales_delight:cherry_petal',
                'trailandtales_delight:cherry_petal',
                "trailandtales_delight:cheese_slice",
                "farmersdelight:pie_crust",
                "trailandtales_delight:cheese_slice",
            ]).id("createdelight:shapeless/unbake_cherry_cheese_pie_1_manual_only")
        e.recipes.create.deploying(
            'createdelight:unbake_cherry_cheese_pie',
            [
                "farmersdelight:pie_crust",
                'trailandtales_delight:cherry_cheese_slice'
            ]
        ).id("createdelight:sequenced_assembly/unbake_cherry_cheese_pie_2")
        e.recipes.kubejs.shapeless(
            'createdelight:unbake_cherry_cheese_pie',
            [
                'trailandtales_delight:cherry_cheese_slice',
                'trailandtales_delight:cherry_cheese_slice',
                "farmersdelight:pie_crust"
            ]).id("createdelight:shapeless/unbake_cherry_cheese_pie_2_manual_only")
        baking(e, 'createdelight:unbake_cherry_cheese_pie', 'trailandtales_delight:cherry_cheese_pie', 1, "food", 200)
        e.recipes.kubejs.shapeless(
            "trailandtales_delight:cherry_cheese_pie",
            '4x trailandtales_delight:cherry_cheese_pie_slice'
        ).id("createdelight:shapeless/unbake_cherry_cheese_pie")
    }
    {
        let iner = "farmersdelight:pie_crust"
        e.recipes.create.sequenced_assembly('createdelight:unbake_chocolate_pie', iner, [
            e.recipes.create.filling(iner, [iner, Fluid.of("create:chocolate", 250)]),
            e.recipes.create.filling(iner, [iner, Fluid.of("cosmopolitan:cream", 250)])
        ])
            .loops(1)
            .transitionalItem(iner)
            .id("createdelight:sequenced_assembly/unbake_chocolate_pie_1")
        e.recipes.create.sequenced_assembly('createdelight:unbake_chocolate_pie', iner, [
            e.recipes.create.deploying(iner, [iner, "create:bar_of_chocolate"]),
            e.recipes.create.deploying(iner, [iner, '#forge:cream'])
        ])
            .loops(1)
            .transitionalItem(iner)
            .id("createdelight:sequenced_assembly/unbake_chocolate_pie_2")
        e.recipes.kubejs.shapeless(
            'createdelight:unbake_chocolate_pie',
            [
                "#forge:cream",
                "create:bar_of_chocolate",
                "farmersdelight:pie_crust"
            ]).id("createdelight:shapeless/unbake_chocolate_pie_manual_only")
        baking(e, 'createdelight:unbake_chocolate_pie', 'farmersdelight:chocolate_pie', 1, "food", 200)
    }
    {
        let iner = "farmersdelight:pie_crust"
        e.recipes.create.sequenced_assembly('createdelight:unbake_water_pie', iner, [
            e.recipes.create.deploying(iner, [iner, '#forge:flour']),
            e.recipes.create.deploying(iner, [iner, 'minecraft:sugar']),
            e.recipes.create.filling(iner, [iner, Fluid.water(250)])
        ])
            .loops(1)
            .transitionalItem(iner)
            .id("createdelight:sequenced_assembly/unbake_water_pie")
        e.recipes.kubejs.shapeless(
            'createdelight:unbake_water_pie',
            [
                '#forge:flour',
                "minecraft:water_bucket",
                '#forge:flour',
                'minecraft:sugar',
                "farmersdelight:pie_crust",
                'minecraft:sugar',
            ]).id("createdelight:shapeless/unbake_water_pie_manual_only")
        baking(e, 'createdelight:unbake_water_pie', 'cosmopolitan:water_pie', 1, "food", 200)
    }
    e.recipes.create.filling(
        'bakeries:cream_pumpkin_pie',
        [
            Fluid.of("cosmopolitan:cream", 250),
            'minecraft:pumpkin_pie'
        ]
    ).id("createdelight:filling/cream_pumpkin_pie")
    e.recipes.create.deploying(
        'bakeries:cream_pumpkin_pie',
        [
            'minecraft:pumpkin_pie',
            "#forge:cream"
        ]
    ).id("createdelight:deploying/cream_pumpkin_pie")
    let fruit_pie_recipes = [
        ['fruitsdelight:pineapple_slice', 'createdelight:unbake_pineapple_pie', 'fruitsdelight:pineapple_pie'],
        ['fruitsdelight:durian_flesh', 'createdelight:unbake_durian_pie', 'fruitsdelight:durian_pie']
    ]
    fruit_pie_recipes.forEach(fruit_pie_recipe => {
        let ingredient = fruit_pie_recipe[0]
        let unbake = fruit_pie_recipe[1]
        let pie = fruit_pie_recipe[2]
        let iner = 'createdelight:puff_pastry'
        e.recipes.create.sequenced_assembly("4x " + unbake, iner, [
            e.recipes.create.deploying(iner, [iner, ingredient]),
            e.recipes.create.deploying(iner, [iner, ingredient]),
            e.recipes.create.cutting(iner, iner)
        ])
            .loops(1)
            .transitionalItem(iner)
            .id("createdelight:sequenced_assembly/" + unbake.split(":")[1])
        e.recipes.kubejs.shapeless(
            "2x " + unbake,
            [
                ingredient,
                ingredient,
                iner
            ]
        ).id("createdelight:shapeless/" + unbake.split(":")[1])
        baking(e, unbake, pie, 1, "food", 200)
    })
})
