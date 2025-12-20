ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "cosmopolitan:create/pressing/wafer_cone",
        "cosmopolitan:farmersdelight/frying/potato_pancakes_from_deep_frying",
        "cosmopolitan:farmersdelight/cutting/fern",
        "cosmopolitan:lush_confiture_bottle_from_glass_bottle"
    ])

    const { kubejs, create, create_new_age, farmersdelight } = e.recipes
    e.replaceInput({ mod: "cosmopolitan" }, "#forge:crops/wheat", "#forge:flour")
    e.replaceOutput({ mod: "cosmopolitan" }, "cosmopolitan:chorus_fruit_popsicle", "ends_delight:chorus_fruit_popsicle")
    e.remove({ type: "create:sequenced_assembly", output: ['cosmopolitan:classic_ice_cream', 'cosmopolitan:seasonal_ice_cream', 'neapolitan:neapolitan_ice_cream'] })
    {
        let iner = "minecraft:bowl"
        create.sequenced_assembly("cosmopolitan:classic_ice_cream", iner, [
            create.deploying(iner, [iner, 'youkaishomecoming:ice_cube']),
            create.filling(iner, [iner, Fluid.of("cosmopolitan:glow_berry_ice_cream", 250)]),
            create.filling(iner, [iner, Fluid.of("cosmopolitan:carrot_ice_cream", 250)]),
            create.filling(iner, [iner, Fluid.of("cosmopolitan:apple_ice_cream", 250)])
        ])
        .loops(1)
        .transitionalItem(iner)
        .id("cosmopolitan:create/sequenced_assembly/classic_ice_cream")
    }
    {
        let iner = "minecraft:bowl"
        create.sequenced_assembly("cosmopolitan:seasonal_ice_cream", iner, [
            create.deploying(iner, [iner, 'youkaishomecoming:ice_cube']),
            create.filling(iner, [iner, Fluid.of("cosmopolitan:sweet_berry_ice_cream", 250)]),
            create.filling(iner, [iner, Fluid.of("cosmopolitan:beetroot_ice_cream", 250)]),
            create.filling(iner, [iner, Fluid.of("cosmopolitan:pumpkin_ice_cream", 250)])
        ])
        .loops(1)
        .transitionalItem(iner)
        .id("cosmopolitan:create/sequenced_assembly/seasonal_ice_cream")
    }
    {
        let iner = "minecraft:bowl"
        create.sequenced_assembly("neapolitan:neapolitan_ice_cream", iner, [
            create.deploying(iner, [iner, 'youkaishomecoming:ice_cube']),
            create.filling(iner, [iner, Fluid.of("cosmopolitan:chocolate_ice_cream", 250)]),
            create.filling(iner, [iner, Fluid.of("cosmopolitan:strawberry_ice_cream", 250)]),
            create.filling(iner, [iner, Fluid.of("cosmopolitan:vanilla_ice_cream", 250)])
        ])
        .loops(1)
        .transitionalItem(iner)
        .id("cosmopolitan:create/sequenced_assembly/neapolitan_ice_cream")
    }

    create.filling("cosmopolitan:cream_bun", ["#forge:bread", Fluid.of("cosmopolitan:cream", 250)])
        .id("cosmopolitan:filling/cream_bun")
    create.deploying("cosmopolitan:cream_bun", ["#forge:bread", "#forge:cream"])
        .id("cosmopolitan:deploying/cream_bun")
    create.mixing("cosmopolitan:gulime", [
        Fluid.of("createdelightcore:slime", 270),
        "minecraft:carved_pumpkin"
    ]).id("cosmopolitan:mixing/gulime")
    kubejs.shapeless(
        "cosmopolitan:gulime",
        [
            "minecraft:carved_pumpkin",
            "minecraft:slime_block"
        ]
    ).id("cosmopolitan:general/gulime")
    create.filling("cosmopolitan:cream", ["minecraft:bowl", Fluid.of("cosmopolitan:cream", 250)]).id("cosmopolitan:filling/cream")
    create.filling("cosmopolitan:cream_bucket", ["minecraft:bucket", Fluid.of("cosmopolitan:cream", 1000)]).id("cosmopolitan:filling/cream_bucket")
    create.mixing(Fluid.of("cosmopolitan:berry_syrup", 250), [
        "4x #forge:berries",
        Fluid.of("createdelight:base_syrup", 500)
    ]).heated().id("cosmopolitan:mixing/cream_bucket")
    create.compacting([
        Fluid.of("cosmopolitan:birch_sap", 10),
        '4x createdieselgenerators:wood_chip',
        Item.of("farmersdelight:tree_bark").withChance(0.5)
    ], "minecraft:birch_log"
    ).heated().id("cosmopolitan:compacting/birch_sap")
    create.compacting(
        'cosmopolitan:berry_syrup_block',
        Fluid.of("cosmopolitan:berry_syrup", 1000)
    ).id("cosmopolitan:compacting/berry_syrup_block")
    create.mixing(
        Fluid.of("createdelight:lush_confiture_jelly", 125),
        [
            Fluid.of("water", 100),
            "minecraft:sugar",
            "minecraft:glow_berries",
            "minecraft:glow_berries",
            'cosmopolitan:arbutus_berries',
            'cosmopolitan:arbutus_berries'
        ]
    ).heated().id("cosmopolitan:mixing/lush_confiture")
    create.filling('createdelightcore:lush_confiture_jelly_bottle', [Fluid.of("createdelight:lush_confiture_jelly", 125), "minecraft:glass_bottle"]).id("cosmopolitan:filling/lush_confiture_jelly_bottle")
    create.emptying([Fluid.of("createdelight:lush_confiture_jelly", 125), "minecraft:glass_bottle"], 'createdelightcore:lush_confiture_jelly_bottle').id("cosmopolitan:emptying/lush_confiture_jelly_bottle")
    create.filling('createdelight:lush_confiture_jello_item', [Fluid.of("createdelight:lush_confiture_jello", 125), "minecraft:bowl"]).id("cosmopolitan:filling/lush_confiture_jello_item")
    farmersdelight.cooking(
        [
            "2x minecraft:glow_berries",
            '2x cosmopolitan:arbutus_berries',
            "minecraft:sugar"
        ], 'cosmopolitan:lush_confiture_bottle',
        0.5, 600, "minecraft:glass_bottle"
    ).id("cosmopolitan:farmersdelight/cooking/lush_confiture_bottle")
    kubejs.shapeless(
        'createdelightcore:lush_confiture_jelly',
        '8x createdelightcore:lush_confiture_jelly_bottle'
    ).replaceIngredient("createdelightcore:lush_confiture_jelly_bottle", "minecraft:glass_bottle").id("createdelightcore:lush_confiture_jelly_block_manual_only")
    kubejs.shapeless(
        '8x createdelightcore:lush_confiture_jelly_bottle',
        [
            'createdelightcore:lush_confiture_jelly',
            "8x minecraft:glass_bottle"
        ]
    ).id("createdelightcore:lush_confiture_jelly_manual_only")
    create.compacting(
        'createdelightcore:lush_confiture_jelly',
        Fluid.of("createdelight:lush_confiture_jelly", 1000)
    ).id("cosmopolitan:compacting/lush_confiture_jelly")
    kubejs.shapeless(
        'createdelightcore:lush_confiture_jello',
        '8x createdelight:lush_confiture_jello_item'
    ).replaceIngredient("createdelight:lush_confiture_jello_item", "minecraft:bowl").id("createdelightcore:lush_confiture_jello_block_manual_only")
    kubejs.shapeless(
        '8x createdelight:lush_confiture_jello_item',
        [
            'createdelightcore:lush_confiture_jello',
            "8x minecraft:bowl"
        ]
    ).id("createdelightcore:lush_confiture_jello_manual_only")
    create.compacting(
        'createdelightcore:lush_confiture_jello',
        Fluid.of("createdelight:lush_confiture_jello", 1000)
    ).id("cosmopolitan:compacting/lush_confiture_jello")
    create.mixing(
        Fluid.of("createdelight:lush_confiture_jello", 125),
        [
            '#forge:gelatin',
            Fluid.of("createdelight:lush_confiture_jelly", 125)
        ]
    ).heated().id("cosmopolitan:mixing/lush_confiture_jello")
    create.mixing(
        Fluid.of("createdelight:spring_soda", 250),
        [
            Fluid.of("cosmopolitan:birch_sap", 250),
            "2x cosmopolitan:wheatgrass",
            "minecraft:pink_petals"
        ]
    ).heated().id("cosmopolitan:mixing/spring_soda")
    create.filling("cosmopolitan:spring_soda", [Fluid.of("createdelight:spring_soda", 250), "minecraft:glass_bottle"]).id("cosmopolitan:filling/spring_soda")
    create.emptying([Fluid.of("createdelight:spring_soda", 250), "minecraft:glass_bottle"], 'cosmopolitan:spring_soda').id("cosmopolitan:emptying/spring_soda")
    create.mixing(
        Fluid.of("createdelight:summer_cordial", 250),
        [
            Fluid.of("create:honey", 250),
            "2x minecraft:melon_slice",
            "minecraft:flowering_azalea_leaves"
        ]
    ).heated().id("cosmopolitan:mixing/summer_cordial")
    create.filling("cosmopolitan:summer_cordial", [Fluid.of("createdelight:summer_cordial", 250), "minecraft:glass_bottle"]).id("cosmopolitan:filling/summer_cordial")
    create.emptying([Fluid.of("createdelight:summer_cordial", 250), "minecraft:glass_bottle"], 'cosmopolitan:summer_cordial').id("cosmopolitan:emptying/summer_cordial")
    create.mixing(
        Fluid.of("createdelight:autumn_tea", 250),
        [
            Fluid.of("create:honey", 250),
            "2x #forge:flour",
            "minecraft:cornflower"
        ]
    ).heated().id("cosmopolitan:mixing/autumn_tea")
    create.filling("cosmopolitan:autumn_tea", [Fluid.of("createdelight:autumn_tea", 250), "minecraft:glass_bottle"]).id("cosmopolitan:filling/autumn_tea")
    create.emptying([Fluid.of("createdelight:autumn_tea", 250), "minecraft:glass_bottle"], 'cosmopolitan:autumn_tea').id("cosmopolitan:emptying/autumn_tea")
    create.mixing(
        Fluid.of("createdelight:winter_glogg", 250),
        [
            Fluid.of("cosmopolitan:birch_sap", 250),
            "2x minecraft:sweet_berries",
            "farmersdelight:tree_bark"
        ]
    ).heated().id("cosmopolitan:mixing/winter_glogg")
    create.filling("cosmopolitan:winter_glogg", [Fluid.of("createdelight:winter_glogg", 250), "minecraft:glass_bottle"]).id("cosmopolitan:filling/winter_glogg")
    create.emptying([Fluid.of("createdelight:winter_glogg", 250), "minecraft:glass_bottle"], 'cosmopolitan:winter_glogg').id("cosmopolitan:emptying/winter_glogg")
    {
        let iner = 'cosmopolitan:arbutus_berries'
        create.sequenced_assembly("createdelight:enchanted_golden_arbutus_berries", 'cosmopolitan:arbutus_berries', [
            create.filling(iner, [iner, Fluid.of("create_enchantment_industry:experience", 120)]),
            create.deploying(iner, [iner, "minecraft:gold_block"]),
            create.deploying(iner, [iner, "minecraft:gold_block"]),
            create_new_age.energising(iner, iner, 2000000)
        ])
            .loops(4)
            .transitionalItem(iner)
            .id("createdelight:enchanted_golden_arbutus_berries")
    }
    create.filling(
        'cosmopolitan:golden_arbutus_berries',
        [
            'cosmopolitan:arbutus_berries',
            Fluid.of("createmetallurgy:molten_gold", 450)
        ]
    ).id("cosmopolitan:filling/golden_arbutus_berries")
    cutting(e, 'minecraft:fern',
        [
            ["minecraft:wheat_seeds"],
            ['alexscaves:fiddlehead', 1, 0.75],
            ['alexscaves:fiddlehead', 1, 0.25]
        ]
    )
    cutting(e, 'minecraft:large_fern',
        [
            ["minecraft:wheat_seeds"],
            ['alexscaves:fiddlehead'],
            ['alexscaves:fiddlehead', 1, 0.25]
        ]
    )
    cutting(e, 'alexscaves:curly_fern',
        [
            ["minecraft:wheat_seeds"],
            ['alexscaves:fiddlehead'],
            ['alexscaves:fiddlehead', 1, 0.25]
        ]
    )
    {
        let iner = "bakeries:cut_cake_base"
        create.sequenced_assembly('cosmopolitan:jelly_roll', iner, [
            create.pressing(iner, iner),
            create.filling(iner, [iner, Fluid.of("cosmopolitan:berry_syrup", 250)]),
        ])
            .loops(1)
            .transitionalItem(iner)
            .id("cosmopolitan:sequenced_assembly/jelly_roll")
    }
    kubejs.shapeless(
        "cosmopolitan:jelly_roll",
        [
            "bakeries:cut_cake_base",
            "cosmopolitan:berry_syrup_bottle"
        ]
    ).id("cosmopolitan:farmersdelight/jelly_roll").replaceIngredient("cosmopolitan:berry_syrup_bottle", "minecraft:glass_bottle")
    {
        let iner = "bakeries:cut_cake_base"
        create.sequenced_assembly('cosmopolitan:chocolate_roll', iner, [
            create.pressing(iner, iner),
            create.filling(iner, [iner, Fluid.of("create:chocolate", 250)]),
        ])
            .loops(1)
            .transitionalItem(iner)
            .id("cosmopolitan:sequenced_assembly/chocolate_roll_from_chocolate")
    }
    kubejs.shapeless(
        "cosmopolitan:chocolate_roll",
        [
            "bakeries:cut_cake_base",
            "create:bar_of_chocolate"
        ]
    ).id("cosmopolitan:farmersdelight/chocolate_roll_from_chocolate")
    {
        let iner = "bakeries:cut_cake_base"
        create.sequenced_assembly('cosmopolitan:ink_roll', iner, [
            create.deploying(iner, [iner, "minecraft:glow_ink_sac"]),
            create.pressing(iner, iner),
            create.filling(iner, [iner, Fluid.of("create_enchantment_industry:ink", 250)]),
        ])
            .loops(1)
            .transitionalItem(iner)
            .id("cosmopolitan:sequenced_assembly/ink_roll")
    }
    kubejs.shapeless(
        "cosmopolitan:ink_roll",
        [
            "bakeries:cut_cake_base",
            'minecraft:ink_sac',
            'minecraft:glow_ink_sac'
        ]
    ).id("cosmopolitan:farmersdelight/ink_roll")
    create.filling(
        'cosmopolitan:tuber_puree_with_confiture',
        [
            'cosmopolitan:tuber_puree',
            Fluid.of("createdelight:lush_confiture_jelly", 125)
        ]
    ).id("cosmopolitan:filling/tuber_puree_with_confiture")
    create.filling(
        'cosmopolitan:tuber_puree_cone_with_confiture',
        [
            'cosmopolitan:tuber_puree_cone',
            Fluid.of("createdelight:lush_confiture_jelly", 50)
        ]
    ).id("cosmopolitan:filling/tuber_puree_cone_with_confiture")
    kubejs.shaped(
        'alexscaves:wafer_cookie_block',
        [
            "AA",
            "AA"
        ], {
        A: 'cosmopolitan:wafer'
    }
    ).id("alexscaves:wafer_cookie_block")
    create.pressing(
        'createdelight:raw_potato_pancake',
        'minecraft:potato'
    ).id("createdelight:pressing/raw_potato_pancake")
    kubejs.shapeless(
        'createdelight:wafer_dough',
        [
            "farmersdelight:wheat_dough",
            "ratatouille:cocoa_powder"
        ]
    ).id("cosmopolitan:general/wafer")
    baking(e, 'createdelight:wafer_dough', 'cosmopolitan:wafer', 1.0, "food", 100)
    farmersdelight.cooking(
        [
            '#fruitsdelight:jello',
            "minecraft:sugar",
            "#forge:salad_ingredients"
        ], 'cosmopolitan:jello_salad',
        1.0, 200, "minecraft:bowl"
    ).id("cosmopolitan:farmersdelight/cooking/jello_salad")
})