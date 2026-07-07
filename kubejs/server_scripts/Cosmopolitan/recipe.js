ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "cosmopolitan:create/pressing/wafer_cone",
        "cosmopolitan:farmersdelight/frying/potato_pancakes_from_deep_frying",
        "cosmopolitan:farmersdelight/cutting/fern",
        "cosmopolitan:lush_confiture_bottle_from_glass_bottle",
        "cosmopolitan:general/gulime",
        "cosmopolitan:farmersdelight/jelly_roll",
        "cosmopolitan:farmersdelight/chocolate_roll_from_chocolate",
        "cosmopolitan:farmersdelight/ink_roll",
        "cosmopolitan:neapolitan/classic_ice_cream_from_apple",
        "cosmopolitan:neapolitan/classic_ice_cream",
        "neapolitan:mixed/neapolitan_ice_cream",
        "neapolitan:mixed/neapolitan_ice_cream_from_vanilla",
        "collectorsreap:food/sunny_ice_cream_from_vanilla",
        "collectorsreap:food/sunny_ice_cream",
        "cosmopolitan:neapolitan/seasonals/seasonal_ice_cream",
        "cosmopolitan:neapolitan/seasonals/seasonal_ice_cream_from_pumpkin",
        "cosmopolitan:neapolitan/neapolitan_ice_cream_sandwich",
        "cosmopolitan:neapolitan/classic_ice_cream_sandwich",
        "cosmopolitan:neapolitan/seasonals/seasonal_ice_cream_sandwich",
        "cosmopolitan:general/wafer",
        "cosmopolitan:neapolitan/xfarmersdelight/ice_cream_float",
        "cosmopolitan:filling/create/ice_cream_float",
        "cosmopolitan:general/snow_cone",
        "cosmopolitan:farmersdelight/cooking/lush_confiture_bottle",
        "createdelightcore:mixing/flowing_lush_confiture_jello",
        "cosmopolitan:farmersdelight/chocolate_roll",
    ])

    const { kubejs, create, create_new_age, farmersdelight } = e.recipes
    e.replaceInput({ mod: "cosmopolitan" }, "#forge:crops/wheat", "#forge:flour")
    e.replaceOutput({ mod: "cosmopolitan" }, "cosmopolitan:chorus_fruit_popsicle", "ends_delight:chorus_fruit_popsicle"),
    e.remove({ type: "create:sequenced_assembly", output: ['cosmopolitan:classic_ice_cream', 'cosmopolitan:seasonal_ice_cream', 'neapolitan:neapolitan_ice_cream'] })
    e.remove({ output: [
        'cosmopolitan:bagel',
        'createdelightcore:lucuma_ice_cream_cone',
        'createdelightcore:pink_dragon_fruit_ice_cream_cone',
        'createdelightcore:sunny_ice_cream_sandwich',
        'cosmopolitan:collective_ice_cream',
        'cosmopolitan:collective_ice_cream_sandwich',
        'cosmopolitan:delightful_ice_cream',
        'cosmopolitan:delightful_ice_cream_sandwich',
        'cosmopolitan:exquisite_ice_cream',
        'cosmopolitan:exquisite_ice_cream_sandwich',
        'cosmopolitan:lucuma_ice_cream_cone',
        'cosmopolitan:pink_dragon_fruit_ice_cream_cone',
        'cosmopolitan:sunny_ice_cream_sandwich',
        'cosmopolitan:neapolitan_ice_cream_bagel'
    ] })
    /**
     *
     * @param {Internal.RecipesEventJS} e
     * @param {Internal.ItemStack_} ice_cream_bowl
     * @param {Internal.ItemStack_} ice_cream_sandwich
     * @param {Internal.ItemStack_} scoop_1
     * @param {Internal.ItemStack_} scoop_2
     * @param {Internal.ItemStack_} scoop_3
     */
    function make_mixed_ice_cream(e, ice_cream_bowl, ice_cream_sandwich, scoop_1, scoop_2, scoop_3) {
        let iner = "minecraft:bowl"
        e.recipes.create.sequenced_assembly(ice_cream_bowl, iner, [
            e.recipes.create.deploying(iner, [iner, scoop_1]),
            e.recipes.create.deploying(iner, [iner, scoop_2]),
            e.recipes.create.deploying(iner, [iner, scoop_3])
        ])
            .loops(1)
            .transitionalItem(iner)
            .id(`createdelight:create/sequenced_assembly/${ice_cream_bowl.split(":")[1]}`)
        e.recipes.kubejs.shapeless(
            ice_cream_bowl,
            [
                "minecraft:bowl",
                scoop_1,
                scoop_2,
                scoop_3,
            ]
        ).id(`createdelight:shapeless/${ice_cream_bowl.split(":")[1]}`)
        let iner_1 = "cosmopolitan:wafer"
            e.recipes.create.sequenced_assembly(`2x ${ice_cream_sandwich}`, iner_1, [
                e.recipes.create.deploying(iner_1, [iner_1, scoop_1]),
                e.recipes.create.deploying(iner_1, [iner_1, scoop_2]),
                e.recipes.create.deploying(iner_1, [iner_1, scoop_3]),
                e.recipes.create.deploying(iner_1, [iner_1, iner_1]),
                e.recipes.create.cutting(iner_1, iner_1)
            ])
                .loops(1)
                .transitionalItem(iner_1)
                .id(`createdelight:create/sequenced_assembly/${ice_cream_sandwich.split(":")[1]}`)
            e.recipes.kubejs.shaped(
                ice_cream_sandwich,
                [
                    " A ",
                    "BCD",
                    " A "
                ], {
                    A: iner_1,
                    B: scoop_1,
                    C: scoop_2,
                    D: scoop_3,
                }
            ).id(`createdelight:shapeless/${ice_cream_sandwich.split(":")[1]}`)
            e.recipes.kubejs.shapeless(
                ice_cream_sandwich,
                [
                    ice_cream_bowl,
                    "cosmopolitan:wafer",
                    "cosmopolitan:wafer"
                ]
            ).id(`createdelight:shapeless/${ice_cream_sandwich.split(":")[1]}_from_bowl`).replaceIngredient(ice_cream_bowl, "minecraft:bowl")
    }

    make_mixed_ice_cream(e, "cosmopolitan:classic_ice_cream", "cosmopolitan:classic_ice_cream_sandwich",
        "createdelightcore:glow_berry_ice_cream_scoop", "createdelightcore:apple_ice_cream_scoop", "createdelightcore:carrot_ice_cream_scoop")
    make_mixed_ice_cream(e, "cosmopolitan:seasonal_ice_cream", 'cosmopolitan:seasonal_ice_cream_sandwich',
        "alexscaves:sweetberry_ice_cream_scoop", "createdelightcore:pumpkin_ice_cream_scoop", "createdelightcore:beetroot_ice_cream_scoop")
    make_mixed_ice_cream(e, "neapolitan:neapolitan_ice_cream", 'cosmopolitan:neapolitan_ice_cream_sandwich',
        "alexscaves:vanilla_ice_cream_scoop", "createdelightcore:strawberry_ice_cream_scoop", "alexscaves:chocolate_ice_cream_scoop")
    make_mixed_ice_cream(e, "collectorsreap:sunny_ice_cream", 'cosmopolitan:sunny_ice_cream_sandwich',
        "createdelightcore:strawberry_ice_cream_scoop", "alexscaves:vanilla_ice_cream_scoop", "createdelightcore:lucuma_ice_cream_scoop")
    make_mixed_ice_cream(e, "cosmopolitan:collective_ice_cream", 'cosmopolitan:collective_ice_cream_sandwich',
        "createdelightcore:lime_ice_cream_scoop", "createdelightcore:pomegranate_ice_cream_scoop", "createdelightcore:pink_dragon_fruit_ice_cream_scoop")
    make_mixed_ice_cream(e, "cosmopolitan:delightful_ice_cream", 'cosmopolitan:delightful_ice_cream_sandwich',
        "cosmopolitan:source_berry_pips", "cosmopolitan:kabloom_pips", "youkaishomecoming:matcha")
    make_mixed_ice_cream(e, "cosmopolitan:exquisite_ice_cream", 'cosmopolitan:exquisite_ice_cream_sandwich',
        "#forge:chorus_fruits", "cosmopolitan:aurora_kohakutou", "cosmopolitan:slabfish_jelly_popsicle")

    let berrySyrupFlavors = [
        ["sweet", "cosmopolitan:berry_syrup"],
        ["spicy", "cosmopolitan:berry_syrup_spicy"],
        ["sour", "cosmopolitan:berry_syrup_sour"],
        ["bitter", "cosmopolitan:berry_syrup_bitter"],
        ["strange", "cosmopolitan:berry_syrup_strange"]
    ]
    berrySyrupFlavors.forEach(entry => {
        let flavor = entry[0]
        let syrup = entry[1]
        {
            let iner = "bakeries:cut_cake_base"
            create.sequenced_assembly(Item.of("cosmopolitan:jelly_roll", { berrySyrupFlavor: flavor }), iner, [
                create.filling(iner, [iner, Fluid.of(syrup, 250)]),
                create.pressing(iner, iner)
            ])
                .loops(1)
                .transitionalItem(iner)
                .id(`createdelight:sequenced_assembly/jelly_roll_${flavor}`)
        }
        {
            let iner = "minecraft:apple"
            create.sequenced_assembly(Item.of("cosmopolitan:toffee_apple", { berrySyrupFlavor: flavor }), iner, [
                create.deploying(iner, [iner, "minecraft:stick"]),
                create.filling(iner, [iner, Fluid.of(syrup, 250)])
            ])
                .loops(1)
                .transitionalItem(iner)
                .id(`createdelight:sequenced_assembly/toffee_apple_${flavor}`)
        }
        {
            let iner = "minecraft:golden_apple"
            create.sequenced_assembly(Item.of("cosmopolitan:toffee_golden_apple", { berrySyrupFlavor: flavor }), iner, [
                create.deploying(iner, [iner, "minecraft:stick"]),
                create.filling(iner, [iner, Fluid.of(syrup, 250)])
            ])
                .loops(1)
                .transitionalItem(iner)
                .id(`createdelight:sequenced_assembly/toffee_golden_apple_${flavor}`)
        }
        {
            let iner = "#forge:cookies"
            create.sequenced_assembly(Item.of("2x cosmopolitan:berry_cheesecake_bar", { berrySyrupFlavor: flavor }), iner, [
                create.filling(iner, [iner, Fluid.of(syrup, 250)]),
                create.deploying(iner, [iner, "bakeries:foamed_cream"]),
                create.cutting(iner, iner)
            ])
                .loops(1)
                .transitionalItem(iner)
                .id(`createdelight:sequenced_assembly/berry_cheesecake_bar_${flavor}`)
        }
    })

    create.sequenced_assembly('cosmopolitan:neapolitan_ice_cream_bagel', 'bakeries:bagel', [
        create.deploying('bakeries:bagel', ['bakeries:bagel', 'alexscaves:vanilla_ice_cream_scoop']),
        create.deploying('bakeries:bagel', ['bakeries:bagel', 'createdelightcore:strawberry_ice_cream_scoop']),
        create.deploying('bakeries:bagel', ['bakeries:bagel', 'alexscaves:chocolate_ice_cream_scoop']),
        create.deploying('bakeries:bagel', ['bakeries:bagel', 'bakeries:bagel'])
    ])
        .loops(1)
        .transitionalItem('bakeries:bagel')
        .id('createdelight:create/sequenced_assembly/neapolitan_ice_cream_bagel')
    kubejs.shapeless(
        'cosmopolitan:neapolitan_ice_cream_bagel',
        [
            'bakeries:bagel',
            'bakeries:bagel',
            'alexscaves:vanilla_ice_cream_scoop',
            'createdelightcore:strawberry_ice_cream_scoop',
            'alexscaves:chocolate_ice_cream_scoop'
        ]
    ).id('createdelight:shapeless/neapolitan_ice_cream_bagel')

    create.filling("cosmopolitan:cream_bun",
        [
            "#forge:bread",
            Fluid.of("cosmopolitan:cream", 250)
        ]
    ).id("createdelight:filling/cream_bun")
    create.deploying(
        "cosmopolitan:cream_bun",
        [
            "#forge:bread",
            "#forge:cream"
        ]
    ).id("createdelight:deploying/cream_bun")
    create.mixing(
        "cosmopolitan:gulime",
        [
            Fluid.of("createdelightcore:slime", 270),
            "minecraft:carved_pumpkin"
        ]
    ).id("createdelight:mixing/gulime")
    kubejs.shapeless(
        "cosmopolitan:gulime",
        [
            "minecraft:carved_pumpkin",
            "minecraft:slime_block"
        ]
    ).id("createdelight:general/gulime")
    create.filling("cosmopolitan:cream", ["minecraft:bowl", Fluid.of("cosmopolitan:cream", 250)]).id("createdelight:filling/cream")
    create.filling("cosmopolitan:cream_bucket", ["minecraft:bucket", Fluid.of("cosmopolitan:cream", 1000)]).id("createdelight:filling/cream_bucket")
    create.compacting([
        Fluid.of("cosmopolitan:birch_sap", 10),
        '4x createdieselgenerators:wood_chip',
        Item.of("farmersdelight:tree_bark").withChance(0.5)
    ], "minecraft:birch_log"
    ).heated().id("createdelight:compacting/birch_sap")
    create.compacting(
        'cosmopolitan:spicy_berry_syrup_block',
        Fluid.of("cosmopolitan:berry_syrup_spicy", 1000)
    ).id("createdelight:compacting/spicy_berry_syrup_block")
    create.compacting(
        'cosmopolitan:sour_berry_syrup_block',
        Fluid.of("cosmopolitan:berry_syrup_sour", 1000)
    ).id("createdelight:compacting/sour_berry_syrup_block")
    create.compacting(
        'cosmopolitan:bitter_berry_syrup_block',
        Fluid.of("cosmopolitan:berry_syrup_bitter", 1000)
    ).id("createdelight:compacting/bitter_berry_syrup_block")
    create.compacting(
        'cosmopolitan:strange_berry_syrup_block',
        Fluid.of("cosmopolitan:berry_syrup_strange", 1000)
    ).id("createdelight:compacting/strange_berry_syrup_block")
    create.compacting(
        'cosmopolitan:berry_syrup_block',
        Fluid.of("cosmopolitan:berry_syrup", 1000)
    ).id("createdelight:compacting/berry_syrup_block")
    create.mixing(
        Fluid.of("createdelightcore:lush_confiture_jello", 125),
        [
            "#forge:gelatin",
            Fluid.of("createdelightcore:lush_confiture_jelly", 125)
        ]
    ).heated().id("createdelight:mixing/lush_confiture_jello")
    farmersdelight.cooking(
        [
            "2x minecraft:glow_berries",
            '2x cosmopolitan:arbutus_berries',
            "minecraft:sugar"
        ], 'createdelightcore:lush_confiture_jelly_bottle',
        0.5, 600, "minecraft:glass_bottle"
    ).id("createdelight:farmersdelight/cooking/lush_confiture_bottle")
    create.compacting(
        'createdelightcore:lush_confiture_jelly',
        Fluid.of("createdelightcore:lush_confiture_jelly", 1000)
    ).id("createdelight:compacting/lush_confiture_jelly")
    create.compacting(
        'createdelightcore:lush_confiture_jello_block',
        Fluid.of("createdelightcore:lush_confiture_jello", 1000)
    ).id("createdelight:compacting/lush_confiture_jello")
    create.mixing(
        Fluid.of("createdelight:spring_soda", 250),
        [
            Fluid.of("cosmopolitan:birch_sap", 250),
            "2x cosmopolitan:wheatgrass",
            "minecraft:pink_petals"
        ]
    ).heated().id("createdelight:mixing/spring_soda")
    create.filling("cosmopolitan:spring_soda", [Fluid.of("createdelight:spring_soda", 250), "minecraft:glass_bottle"]).id("createdelight:filling/spring_soda")
    create.emptying([Fluid.of("createdelight:spring_soda", 250), "minecraft:glass_bottle"], 'cosmopolitan:spring_soda').id("createdelight:emptying/spring_soda")
    create.mixing(
        Fluid.of("createdelight:summer_cordial", 250),
        [
            Fluid.of("create:honey", 250),
            "2x minecraft:melon_slice",
            "minecraft:flowering_azalea_leaves"
        ]
    ).heated().id("createdelight:mixing/summer_cordial")
    create.filling("cosmopolitan:summer_cordial", [Fluid.of("createdelight:summer_cordial", 250), "minecraft:glass_bottle"]).id("createdelight:filling/summer_cordial")
    create.emptying([Fluid.of("createdelight:summer_cordial", 250), "minecraft:glass_bottle"], 'cosmopolitan:summer_cordial').id("createdelight:emptying/summer_cordial")
    create.mixing(
        Fluid.of("createdelight:autumn_tea", 250),
        [
            Fluid.of("create:honey", 250),
            "2x #forge:flour",
            "minecraft:cornflower"
        ]
    ).heated().id("createdelight:mixing/autumn_tea")
    create.filling("cosmopolitan:autumn_tea", [Fluid.of("createdelight:autumn_tea", 250), "minecraft:glass_bottle"]).id("createdelight:filling/autumn_tea")
    create.emptying([Fluid.of("createdelight:autumn_tea", 250), "minecraft:glass_bottle"], 'cosmopolitan:autumn_tea').id("createdelight:emptying/autumn_tea")
    create.mixing(
        Fluid.of("createdelight:winter_glogg", 250),
        [
            Fluid.of("cosmopolitan:birch_sap", 250),
            "2x minecraft:sweet_berries",
            "farmersdelight:tree_bark"
        ]
    ).heated().id("createdelight:mixing/winter_glogg")
    create.filling("cosmopolitan:winter_glogg", [Fluid.of("createdelight:winter_glogg", 250), "minecraft:glass_bottle"]).id("createdelight:filling/winter_glogg")
    create.emptying([Fluid.of("createdelight:winter_glogg", 250), "minecraft:glass_bottle"], 'cosmopolitan:winter_glogg').id("createdelight:emptying/winter_glogg")
    {
        let iner = 'cosmopolitan:arbutus_berries'
        create.sequenced_assembly("cosmopolitan:enchanted_golden_arbutus_berries", 'cosmopolitan:arbutus_berries', [
            create.filling(iner, [iner, Fluid.of("create_enchantment_industry:experience", 120)]),
            create.deploying(iner, [iner, "minecraft:gold_block"]),
            create.deploying(iner, [iner, "minecraft:gold_block"]),
            create_new_age.energising(iner, iner, 2000000)
        ])
            .loops(4)
            .transitionalItem(iner)
            .id("createdelight:sequenced_assembly/enchanted_golden_arbutus_berries")
    }
    create.filling(
        'cosmopolitan:golden_arbutus_berries',
        [
            'cosmopolitan:arbutus_berries',
            Fluid.of("createmetallurgy:molten_gold", 450)
        ]
    ).id("createdelight:filling/golden_arbutus_berries")
    cutting(e, 'minecraft:fern',[
        "minecraft:wheat_seeds",
        Item.of('alexscaves:fiddlehead').withChance(0.75),
        Item.of('alexscaves:fiddlehead').withChance(0.25)
    ])
    cutting(e, 'minecraft:large_fern', [
        "minecraft:wheat_seeds",
        'alexscaves:fiddlehead',
        Item.of('alexscaves:fiddlehead').withChance(0.25)
    ])
    cutting(e, 'alexscaves:curly_fern', [
        "minecraft:wheat_seeds",
        'alexscaves:fiddlehead',
        Item.of('alexscaves:fiddlehead').withChance(0.25)
    ])

    e.recipes.minecraft.crafting_shapeless(
        'cosmopolitan:jelly_roll',
        [
            "bakeries:cut_cake_base",
            'cosmopolitan:berry_syrup_bottle'
        ]
    ).id("createdelight:farmersdelight/jelly_roll")
    {
        let chocolateFluids = [
            ["create:chocolate", "chocolate_roll_from_chocolate"],
            ["create_confectionery:black_chocolate", "chocolate_roll_from_black_chocolate"],
            ["create_confectionery:white_chocolate", "chocolate_roll_from_white_chocolate"],
            ["create_confectionery:ruby_chocolate", "chocolate_roll_from_ruby_chocolate"]
        ]
        chocolateFluids.forEach(entry => {
            let fluid = entry[0]
            let id = entry[1]
            let iner = "bakeries:cut_cake_base"
            create.sequenced_assembly('cosmopolitan:chocolate_roll', iner, [
                create.filling(iner, [iner, Fluid.of(fluid, 250)]),
                create.pressing(iner, iner)
            ])
                .loops(1)
                .transitionalItem(iner)
                .id(`createdelight:sequenced_assembly/${id}`)
        })
    }
    kubejs.shapeless(
        "cosmopolitan:chocolate_roll",
        [
            "bakeries:cut_cake_base",
            "create:bar_of_chocolate"
        ]
    ).id("createdelight:farmersdelight/chocolate_roll_from_chocolate_manual_only")
    {
        let iner = "bakeries:cut_cake_base"
        create.sequenced_assembly('cosmopolitan:ink_roll', iner, [
            create.filling(iner, [iner, Fluid.of("create_enchantment_industry:ink", 250)]),
            create.deploying(iner, [iner, "minecraft:glow_ink_sac"]),
            create.pressing(iner, iner),
        ])
            .loops(1)
            .transitionalItem(iner)
            .id("createdelight:sequenced_assembly/ink_roll")
    }
    kubejs.shapeless(
        "cosmopolitan:ink_roll",
        [
            "bakeries:cut_cake_base",
            'minecraft:ink_sac',
            'minecraft:glow_ink_sac'
        ]
    ).id("createdelight:farmersdelight/ink_roll_manual_only")
    create.filling(
        'cosmopolitan:tuber_puree_with_confiture',
        [
            'cosmopolitan:tuber_puree',
            Fluid.of("createdelightcore:lush_confiture_jelly", 125)
        ]
    ).id("createdelight:filling/tuber_puree_with_confiture")
    create.filling(
        'cosmopolitan:tuber_puree_cone_with_confiture',
        [
            'cosmopolitan:tuber_puree_cone',
            Fluid.of("createdelightcore:lush_confiture_jelly", 50)
        ]
    ).id("createdelight:filling/tuber_puree_cone_with_confiture")
    kubejs.shaped(
        'alexscaves:wafer_cookie_block',
        [
            "AA",
            "AA"
        ], {
        A: 'cosmopolitan:wafer'
    }
    ).id("createdelight:wafer_cookie_block")
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
    ).id("createdelight:general/wafer")
    baking(e, 'createdelight:wafer_dough', 'cosmopolitan:wafer', 1.0, "food", 100)
    farmersdelight.cooking(
        [
            '#fruitsdelight:jello',
            "minecraft:sugar",
            "#forge:salad_ingredients"
        ], 'cosmopolitan:jello_salad',
        1.0, 200, "minecraft:bowl"
    ).id("createdelight:farmersdelight/cooking/jello_salad")
    kubejs.shapeless(
        'cosmopolitan:ice_cream_float',
        [
            "neapolitan:vanilla_ice_cream",
            "cosmopolitan:spring_soda",
            "minecraft:glass_bottle"
        ]
    ).id("createdelight:shapeless/ice_cream_float")
    create.deploying(
        'cosmopolitan:ice_cream_float',
        [
            "cosmopolitan:spring_soda",
            "alexscaves:vanilla_ice_cream_scoop"
        ]
    ).id("createdelight:filling/ice_cream_float")
    kubejs.shapeless(
        'cosmopolitan:snow_cone',
        [
            "cosmopolitan:wafer_cone",
            "minecraft:snowball",
            "minecraft:honey_bottle",
            "#forge:dyes",
            "#forge:dyes"
        ]
    ).id("createdelight:shapeless/snow_cone")
    {
        let iner = "cosmopolitan:wafer_cone"
        create.sequenced_assembly("cosmopolitan:snow_cone", iner, [
            create.deploying(iner, [iner, "minecraft:snowball"]),
            create.filling(iner, [iner, Fluid.of("create:honey", 250)]),
            create.deploying(iner, [iner, "#forge:dyes"]),
            create.deploying(iner, [iner, "#forge:dyes"]),
        ])
            .loops(1)
            .transitionalItem(iner)
            .id("createdelight:sequenced_assembly/snow_cone")
    }
})
