ServerEvents.recipes(e => {
    const { create, farmersdelight, createdieselgenerators, youkaishomecoming } = e.recipes
    create.compacting('supplementaries:ash', 'create:limestone')
        .heated()
        .id("create:compacting/ash")
    remove_recipes_output(e, [
        'youkaishomecoming:green_tea_leaves',
        'youkaishomecoming:oolong_tea_leaves',
        'youkaishomecoming:black_tea_leaves',
        'youkaishomecoming:tofu',
        'youkaishomecoming:butter',
        'youkaishomecoming:bowl_of_cream',
        'youkaishomecoming:tea_leaf_bag',
        'youkaishomecoming:coffee_bean_bag',
        'youkaishomecoming:black_tea_bag',
        'youkaishomecoming:green_tea_bag',
        'youkaishomecoming:oolong_tea_bag',
        'youkaishomecoming:redbean_bag',
        'youkaishomecoming:green_coffee_bean',
        'youkaishomecoming:coffee_beans',
        'youkaishomecoming:coffee_powder',
        'youkaishomecoming:coffee_bean_bag',
        'youkaishomecoming:doughnut',
        'youkaishomecoming:ice_cube',
        "youkaishomecoming:kettle",
    ])
    remove_recipes_id(e, [
        'youkaishomecoming:oily_bean_curd_from_tofu_campfire',
        'youkaishomecoming:oily_bean_curd_from_tofu_smelting',
        'youkaishomecoming:oily_bean_curd_from_tofu_smoking',
        'youkaishomecoming:pods_cutting',
        'youkaishomecoming:red_velvet_cake',
        "youkaishomecoming:emptying/blood_bottle_emptying",
        'youkaishomecoming:mandrake_root_cutting',
        'youkaishomecoming:raw_lamprey_cutting',
        "youkaishomecoming:red_velvet_cake_slice",
        "youkaishomecoming:clay_saucer_from_clay_ball_stonecutting",
        "youkaishomecoming:redbean_from_redbean_bag",
        "youkaishomecoming:tea_leaves_from_tea_leaf_bag",
        "youkaishomecoming:copper_tank_from_copper_block_stonecutting",
        "youkaishomecoming:copper_faucet_from_copper_ingot_stonecutting"
    ])
    remove_recipes_type(e, [
        "youkaishomecoming:moka_pot",
        "youkaishomecoming:kettle"
    ]);
    e.replaceInput({}, 'youkaishomecoming:green_tea_leaves', 'farmersrespite:green_tea_leaves')
    e.replaceInput({}, 'youkaishomecoming:oolong_tea_leaves', 'farmersrespite:yellow_tea_leaves')
    e.replaceInput({}, 'youkaishomecoming:black_tea_leaves', 'farmersrespite:black_tea_leaves')
    e.replaceInput({}, 'youkaishomecoming:coffee_powder', 'createcafe:coffee_grounds')
    e.replaceInput({}, 'youkaishomecoming:bowl_of_cream', 'createdelight:whipped_cream_bowl')
    e.replaceInput({}, 'youkaishomecoming:butter', 'createdelight:butter')
    e.replaceInput({ mod: 'youkaishomecoming' }, 'minecraft:cocoa_beans', "create:bar_of_chocolate")
    e.replaceInput({}, "youkaishomecoming:blood_bottle", "butchercraft:blood_fluid_bottle")
    e.replaceInput({}, "youkaishomecoming:roe", "oceanic_delight:salmon_eggs")
    e.replaceInput({}, "youkaishomecoming:redbean", "createdelight:adzuki_beans_seed")
    e.replaceInput({ id: "youkaishomecoming:apaki" }, "minecraft:pink_petals", "neapolitan:dried_vanilla_pods")
    e.replaceInput({ id: "youkaishomecoming:avgolemono" }, "minecraft:glow_berries", "#forge:fruits/lemon")
    e.replaceInput({ output: [
        "youkaishomecoming:blazing_red_curry",
        "youkaishomecoming:mapo_tofu"
    ]}, "minecraft:blaze_powder", "#mynethersdelight:hot_spice")
    e.replaceInput({ output: [
        "youkaishomecoming:flesh_chocolate_mousse",
        "youkaishomecoming:scarlet_devil_cake"
    ]}, "minecraft:wheat", "create:dough")
    e.replaceInput({ output: [
        "youkaishomecoming:sakura_mochi",
        "youkaishomecoming:seven_colored_yokan"
    ]}, "minecraft:cherry_leaves", "trailandtales_delight:cherry_petal")
    e.replaceInput({}, "youkaishomecoming:tea_leaves", "#forge:tea_leaves/green")
    e.replaceInput({output: "youkaishomecoming:higi_doughnut"}, "youkaishomecoming:doughnut", "frycooks_delight:plain_donut")
    e.replaceInput({id: "youkaishomecoming:longevity_noodles"}, "#forge:pasta", 'createdelight:vermicelli')

    youkaishomecoming.drying_rack("trailandtales_delight:dried_cherry_petal", "trailandtales_delight:cherry_petal")
    .id("youkaishomecoming:dried_cherry_petal_drying")
    create.pressing("youkaishomecoming:clay_saucer", "minecraft:clay_ball")
        .id("youkaishomecoming:pressing/clay_saucer")

    create.sequenced_assembly("youkaishomecoming:red_velvet_cake", "ratatouille:cake_base", 
        [
            create.filling("ratatouille:cake_base", ["ratatouille:cake_base", Fluid.of("butchercraft:blood_fluid")]),
            create.deploying("ratatouille:cake_base", ["ratatouille:cake_base", "youkaishomecoming:flesh"])
        ]
    )
        .loops(1)
        .transitionalItem("ratatouille:cake_base")
        .id("youkaishomecoming:sequenced_assembly/red_velvet_cake")
    threshing(e, 'youkaishomecoming:pods', ['youkaishomecoming:soybean', Item.of('youkaishomecoming:soybean').withChance(0.5)], 200)
    farmersdelight.cooking(
        [
            'youkaishomecoming:soybean',
            'youkaishomecoming:soybean',
            '#forge:salt'],
        'youkaishomecoming:tofu',
        1.0, 200)
        .id('youkaishomecoming:tofu')
    create.compacting('youkaishomecoming:tofu', [
        '2x youkaishomecoming:soybean',
        '#forge:salt'
    ])
        .id('youkaishomecoming:compacting/tofu')
    cutting_2(e, "youkaishomecoming:mandrake_root", [["youkaishomecoming:stripped_mandrake_root", 1]])
    cutting_2(e, "youkaishomecoming:raw_lamprey", [["youkaishomecoming:raw_lamprey_fillet", 1]])
    cutting_2(e, "youkaishomecoming:red_velvet_cake", [["youkaishomecoming:red_velvet_cake_slice", 7]])

    e.custom({
        "type": "youkaishomecoming:simple_fermentation",
        "ingredients": [
            {
                tag: "forge:mushrooms"
            }
        ],
        "inputFluid": {
            "amount": 1000,
            "fluid": "youkaishomecoming:mio"
        },
        "outputFluid": {
            "amount": 1000,
            "fluid": "createdelight:vinegar"
        },
        "results": [
            {
                item: "vintagedelight:organic_mash"
            },
            {
                item: "vintagedelight:organic_mash"
            },
            {
                item: "vintagedelight:organic_mash"
            },
            {
                item: "vintagedelight:organic_mash"
            }
        ],
        "time": 2400
    })
        .id("createdelight:vinegar")
        
    e.custom({
        "type": "youkaishomecoming:simple_fermentation",
        "ingredients": [
            {
                tag: "forge:mushrooms"
            },
            {
                tag: "forge:flour"
            },
            {
                item: "minecraft:sugar"
            }
        ],
        "inputFluid": {
            "amount": 250,
            "fluid": "minecraft:water"
        },
        "outputFluid": {
            "amount": 250,
            "fluid": "createdelight:yeast"
        },
        "results": [],
        "time": 2400
    })
        .id("createdelight:simple_fermentation/yeast")
    fermenting(e,[
        "4x vintagedelight:organic_mash",
        Fluid.of("createdelight:vinegar", 1000)
    ], [
        "#forge:mushrooms",
        Fluid.of("youkaishomecoming:mio", 1000)
    ], 1800)
    create.milling("youkaishomecoming:matcha", "#forge:tea_leaves/green")
        .id("youkaishomecoming:milling/matcha")

    fermenting(e,
        Fluid.of("youkaishomecoming:mio", 1000),
        [
            "#forge:grain/rice",
            "#forge:grain/rice",
            "#forge:grain/rice",
            "#forge:grain/rice",
            Fluid.water(1000)
        ], 1800)

    fermenting(e,[
        Fluid.of("youkaishomecoming:soy_sauce", 1000)
    ], [
        "youkaishomecoming:soybean",
        "youkaishomecoming:soybean",
        "youkaishomecoming:soybean",
        "youkaishomecoming:soybean",
        Fluid.water(1000)
    ], 1800)

    //咖啡调配
    create.filling(
        "youkaishomecoming:americano",
        [
            "youkaishomecoming:espresso",
            Fluid.water(250)
        ]
    ).id("youkaishomecoming:filling/americano")

    create.deploying(
        "youkaishomecoming:ristretto",
        [
            "youkaishomecoming:espresso",
            "createcafe:coffee_grounds"
        ]
    ).id("youkaishomecoming:deploying/ristretto")

    e.custom({
        type: "create:filling",
        ingredients: [
            {
                item: "youkaishomecoming:espresso"
            },
            {
                amount: 250,
                fluidTag: "forge:milk"
            }
        ],
        results: [
            {
                item: "youkaishomecoming:latte",
                count: 1
            }
        ]
    }).id("youkaishomecoming:filling/latte")

    create.filling(
        "youkaishomecoming:con_panna",
        [
            "youkaishomecoming:ristretto",
            Fluid.of("createdelight:whipped_cream", 250)
        ]
    ).id("youkaishomecoming:filling/con_panna")
    create.filling(
        "youkaishomecoming:macchiato",
        [
            "youkaishomecoming:espresso",
            Fluid.of("createdelight:whipped_cream", 250)
        ]
    ).id("youkaishomecoming:filling/macchiato")
    create.filling(
        "youkaishomecoming:cappuccino",
        [
            "youkaishomecoming:latte",
            Fluid.of("createdelight:whipped_cream", 250)
        ]
    ).id("youkaishomecoming:filling/cappuccino")
    create.deploying(
        "youkaishomecoming:mocha",
        [
            "youkaishomecoming:latte",
            "ratatouille:cocoa_powder"
        ]
    ).id("youkaishomecoming:filling/mocha")

    let coffee_list = [
        'espresso',
        'americano',
        'ristretto',
        'latte',
        'affogato',
        'con_panna',
        'cappuccino',
        'macchiato',
        'mocha']
    coffee_list.forEach(coffee => {
        create.filling(`youkaishomecoming:${coffee}`, ["minecraft:glass_bottle", Fluid.of(`createdelight:${coffee}_fluid`, 250)])
            .id(`youkaishomecoming:filling/${coffee}_from_fluid`)
        create.emptying(["minecraft:glass_bottle", Fluid.of(`createdelight:${coffee}_fluid`, 250)], `youkaishomecoming:${coffee}`)
            .id(`youkaishomecoming:emptying/${coffee}_fluid_from_bottle`)
    })
    let tea_list = [
        "scarlet_tea",
        "lemon_black_tea",
        "tea_mocha",
        "saidi_tea",
        "white_tea",
        "cornflower_tea",
        "sakura_honey_tea",
        "genmai_tea",
        "green_water"
    ]
    tea_list.forEach(tea => {
        create.filling(`youkaishomecoming:${tea}`, ["minecraft:glass_bottle", Fluid.of(`createdelight:${tea}`, 250)])
            .id(`youkaishomecoming:filling/${tea}`)
        create.emptying(["minecraft:glass_bottle", Fluid.of(`createdelight:${tea}`, 250)], `youkaishomecoming:${tea}`)
            .id(`youkaishomecoming:emptying/${tea}`) 
    })

    pouring(e, Item.of('minecraft:potion', '{Potion:"minecraft:water"}').strongNBT(), "minecraft:water")
    brewing(e, "minecraft:water", ["createcafe:coffee_grounds", "createcafe:coffee_grounds"], "createdelight:espresso_fluid", "youkaishomecoming:espresso")
    brewing(e, "minecraft:water", ["createcafe:coffee_grounds"], "createdelight:americano_fluid", "youkaishomecoming:americano")
    brewing(e, "createdelight:espresso_fluid", ["createcafe:coffee_grounds"], "createdelight:ristretto_fluid", "youkaishomecoming:ristretto")
    brewing(e, "createdelight:espresso_fluid", ["#forge:milk/milk_bottle"], "createdelight:latte_fluid", "youkaishomecoming:latte")
    brewing(e, "createdelight:espresso_fluid", ["alexscaves:vanilla_ice_cream_scoop", "neapolitan:ice_cubes"], "createdelight:affogato_fluid", "youkaishomecoming:affogato")
    brewing(e, "createdelight:espresso_fluid", ["createdelight:whipped_cream_bowl", "createcafe:coffee_grounds"], "createdelight:con_panna_fluid", "youkaishomecoming:con_panna")
    brewing(e, "createdelight:espresso_fluid", ["ratatouille:cocoa_powder", "#forge:milk/milk_bottle"], "createdelight:mocha_fluid", "youkaishomecoming:mocha")
    brewing(e, "createdelight:espresso_fluid", ["createdelight:whipped_cream_bowl", "#forge:milk/milk_bottle"], "createdelight:cappuccino_fluid", "youkaishomecoming:cappuccino")
    brewing(e, "createdelight:espresso_fluid", ["createdelight:whipped_cream_bowl"], "createdelight:macchiato_fluid", "youkaishomecoming:macchiato")
    brewing(e, "butchercraft:blood_fluid", ["farmersrespite:black_tea_leaves"], "createdelight:scarlet_tea", "youkaishomecoming:scarlet_tea")
    brewing(e, "farmersrespite:black_tea", ["fruitsdelight:lemon_slice", "minecraft:sugar"], "createdelight:lemon_black_tea", "youkaishomecoming:lemon_black_tea")
    brewing(e, "farmersrespite:black_tea", ["ratatouille:cocoa_powder", "#forge:milk/milk_bottle"], "createdelight:tea_mocha", "youkaishomecoming:tea_mocha")
    brewing(e, "farmersrespite:black_tea", ["minecraft:sugar", "minecraft:sugar"], "createdelight:saidi_tea", "youkaishomecoming:saidi_tea")
    brewing(e, "minecraft:water", ["minecraft:cornflower", "minecraft:cornflower"], "createdelight:cornflower_tea", "youkaishomecoming:cornflower_tea")
    brewing(e, "minecraft:water", ["trailandtales_delight:dried_cherry_petal", "minecraft:honey_bottle"], "createdelight:sakura_honey_tea", "youkaishomecoming:sakura_honey_tea")
    brewing(e, "farmersrespite:green_tea", ["#forge:crops/rice", "#forge:crops/rice"], "createdelight:genmai_tea", "youkaishomecoming:genmai_tea")
    brewing(e, "minecraft:water", ["#forge:salad_ingredients/cabbage", "#forge:salad_ingredients/cabbage"], "createdelight:green_water", "youkaishomecoming:green_water")
    brewing(e, "minecraft:water", ["youkaishomecoming:white_tea_leaves", "youkaishomecoming:white_tea_leaves"], "createdelight:white_tea", "youkaishomecoming:white_tea")
    brewing_2(e, "minecraft:water", ["createdelight:whipped_cream_bowl", "createcafe:coffee_grounds"], "createdelight:macchiato_fluid", "youkaishomecoming:macchiato")

    // pouring(e, "youkaishomecoming:espresso", "createdelight:espresso_fluid")
    // pouring(e, "youkaishomecoming:americano", "createdelight:americano_fluid")
    // pouring(e, "youkaishomecoming:ristretto", "createdelight:ristretto_fluid")
    // brewing_2(e, "minecraft:water", ["#forge:milk/milk_bottle", "createcafe:coffee_grounds"], "createdelight:latte_fluid", "youkaishomecoming:latte")
    // pouring(e, "youkaishomecoming:latte", "createdelight:latte_fluid")
    // pouring(e, "youkaishomecoming:affogato", "createdelight:affogato_fluid")
    // pouring(e, "youkaishomecoming:con_panna", "createdelight:con_panna_fluid")
    // pouring(e, "youkaishomecoming:mocha", "createdelight:mocha_fluid")
    // pouring(e, "youkaishomecoming:cappuccino", "createdelight:cappuccino_fluid")
    // pouring(e, "youkaishomecoming:macchiato", "createdelight:macchiato_fluid")
    create.mixing(
        Fluid.of("createdelight:scarlet_tea", 1000),
        [
            Fluid.of("butchercraft:blood_fluid", 1000),
            "farmersrespite:black_tea_leaves"
        ]
    ).id("youkaishomecoming:mixing/scarlet_tea")
    create.mixing(
        Fluid.of("createdelight:lemon_black_tea", 1000),
        [
            Fluid.of("farmersrespite:black_tea", 1000),
            "fruitsdelight:lemon_slice",
            "minecraft:sugar"
        ]
    ).id("youkaishomecoming:mixing/lemon_black_tea")
    // e.custom({
    //     type: "create:mixing",
    //     heatRequirement: "heated",
    //     ingredients: [
    //         {
    //             item: "ratatouille:cocoa_powder"
    //         },
    //         {
    //             amount: 250,
    //             fluidTag: "forge:milk"
    //         },
    //         {
    //             amount: 1000,
    //             fluid: "farmersrespite:black_tea",
    //             nbt: {}
    //         }
    //     ],
    //     results: [
    //         {
    //             amount: 1000,
    //             fluid: "createdelight:tea_mocha"
    //         }
    //     ]
    // }).id("youkaishomecoming:mixing/tea_mocha")
    create.mixing(
        Fluid.of("createdelight:saidi_tea", 1000),
        [
            Fluid.of("farmersrespite:black_tea", 1000),
            "minecraft:sugar",
            "minecraft:sugar"
        ]
    ).id("youkaishomecoming:mixing/saidi_tea")
    create.mixing(
        Fluid.of("createdelight:cornflower_tea", 500),
        [
            Fluid.of("minecraft:water", 500),
            "minecraft:cornflower"
        ]
    ).id("youkaishomecoming:mixing/cornflower_tea")
    create.mixing(
        Fluid.of("createdelight:sakura_honey_tea", 500),
        [
            Fluid.of("minecraft:water", 500),
            Fluid.of("create:honey", 250),
            "trailandtales_delight:dried_cherry_petal"
        ] 
    ).id("youkaishomecoming:mixing/sakura_honey_tea")
    create.mixing(
        Fluid.of("createdelight:genmai_tea", 500),
        [
            Fluid.of("farmersrespite:green_tea", 500),
            "#forge:crops/rice",
        ] 
    ).id("youkaishomecoming:mixing/genmai_tea")
    create.mixing(
        Fluid.of("createdelight:green_water", 500),
        [
            Fluid.of("minecraft:water", 500),
            "#forge:salad_ingredients/cabbage",
        ]
    ).id("youkaishomecoming:mixing/green_water")
    create.mixing(
        Fluid.of("createdelight:white_tea", 500),
        [
            Fluid.of("minecraft:water", 500),
            "youkaishomecoming:white_tea_leaves",
        ]
    ).id("youkaishomecoming:mixing/white_tea")
})