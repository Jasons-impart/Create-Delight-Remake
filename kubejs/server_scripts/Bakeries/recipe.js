/**
 * 
 * @param {InputItem_} item 
 * @param {number} count 
 * @param {number} chance 
 * @returns 
 */
function multi_item(item, count) {
    let list = []
    for (let i = 0; i < count; i++) {
        list.push(Ingredient.of(item))
    }
    return list
}

ServerEvents.recipes(e => {
    const { create, createdieselgenerators, vintageimprovements, kubejs, createaddition } = e.recipes
    // remove_recipes_type(e, [
    //     "bakeries:oven",
    //     "bakeries:bread_knife",
    //     "bakeries:coffee",
    //     "bakeries:flour_sieve",
    //     "bakeries:blender"
    // ])
    remove_recipes_id(e, [
        "farmersdelight:wheat_dough_from_eggs",
        "create:crafting/appliances/dough",
        "create:splashing/wheat_flour",
        "create:mixing/dough_by_mixing",
        "bakeries:blender/bottle_cream",
        "bakeries:blender/butter_cube",
        "bakeries:bottle_milk",
        "bakeries:butter_cube",
        "bakeries:fermentation_tank",
        "bakeries:black_white_concrete",
        "bakeries:flour_sieve",
        "bakeries:blender/meat_floss",
        "bakeries:blender",
        "bakeries:oven",
        "bakeries:salt",
        "bakeries:pineapple_bun_dough",
        "bakeries:salt_croissant_dough",
        "bakeries:berry_bread_dough",
        "bakeries:mould_toast_dough",
        "bakeries:cheese_cocoa_toast_dough",
        "bakeries:brown_sugar_roll_dough",
        "bakeries:meat_floss_bread_roll",
        "bakeries:focaccia",
        "bakeries:drink_cup",
        "bakeries:soak_coffee_cut_cake_base",
        "bakeries:coffee_table",
        "bakeries:sofa",
        "bakeries:sofa_light_gray",
        "bakeries:sofa_red",
        "bakeries:integration/create/mixing/cheese_cream",
        "bakeries:bagel_filled_sauce",
        "bakeries:mould_cake_paste"
    ])
    remove_recipes_output(e, [
        "vintagedelight:oat_dough",
        "bakeries:sweet_dough",
        "bakeries:whole_wheat_dough",
        "bakeries:whole_wheat_flour",
        "bakeries:whole_wheat_flour_bag",
        "bakeries:salted_dough",
        "bakeries:pastry",
        "bakeries:cocoa_dough",
        "bakeries:cocoa_powder",
        "bakeries:olive_oil",
        "bakeries:ground_coffee",
        "bakeries:coffee_bean"
    ])


    //展示框
    e.replaceInput({ id: "bakeries:menu_blcok" }, "minecraft:gray_wool", "minecraft:item_frame")

    e.replaceInput({}, "bakeries:bottle_cream", "bakeries:foamed_cream")
    e.replaceInput({}, "bakeries:cake_paste_bucket", "createdelight:cake_batter_bucket")
    create.mixing("4x bakeries:honey_butter", [FluidIngredients("forge:honey", 250), "2x createdelight:butter"])
        .id("createdelight:mixing/honey_butter")
    // 模具
    vintageimprovements.curving(
        'bakeries:mould',
        'createdeco:industrial_iron_sheet'
    ).mode(4).id("createdelight:mould")
    // 粗盐块
    kubejs.shapeless(
        "vintagedelight:salt_dust",
        "bakeries:raw_salt_block"
    ).id("createdelight:shapeless/salt_dust")
    //面粉
    create.milling(
        Item.of("bakeries:flour").withChance(0.85),
        "create:wheat_flour"
    ).id("createdelight:integration/create/milling/whole_wheat_flour")
    //酵母
    fermenting(e,
        Fluid.of("createdelight:yeast", 250),
        [
            '#forge:mushrooms',
            'create:wheat_flour',
            'minecraft:sugar',
            Fluid.water(250)
        ], 300
    )
    fermenting(e,
        Fluid.of("createdelight:yeast", 500),
        [
            Fluid.of("createdelight:yeast", 250),
            'create:wheat_flour',
        ], 300
    )
    fermenting(e,
        Fluid.of("createdelight:yeast", 500),
        [
            "createdelight:dry_yeast",
            'create:wheat_flour',
            Fluid.water(500)
        ], 300
    )
    vintageimprovements.vacuumizing(
        [
            Fluid.water(200),
            "createdelight:dry_yeast"
        ],
        Fluid.of("createdelight:yeast", 250)
    )
        .secondaryFluidOutput(0)
        .id("createdelight:vacuumizing/dry_yeast")
    create.mixing(
        Fluid.of("createdelight:yeast", 250),
        [
            Fluid.water(200),
            "createdelight:dry_yeast"
        ]
    ).id("createdelight:mixing/yeast_fluid")
    create.filling(
        "bakeries:bottle_yeast",
        [
            "minecraft:glass_bottle",
            Fluid.of("createdelight:yeast", 250)
        ]
    ).id("createdelight:filling/bottle_yeast")
    create.emptying(
        [
            "minecraft:glass_bottle",
            Fluid.of("createdelight:yeast", 250)
        ],
        "bakeries:bottle_yeast"
    ).id("createdelight:emptying/bottle_yeast")


    //面团
    create.mixing("bakeries:whole_wheat_dough",
        [
            Fluid.of("minecraft:water", 50),
            "create:wheat_flour"
        ]
    ).id("createdelight:mixing/whole_wheat_dough")
    create.splashing("bakeries:whole_wheat_dough", "create:wheat_flour").id("createdelight:splashing/whole_wheat_dough")
    fermenting(e,
        "5x create:dough",
        ["createdelight:dry_yeast"]
            .concat(multi_item("bakeries:flour", 5))
            .concat(Fluid.water(250)),
        400
    )
    fermenting(e,
        "5x farmersdelight:wheat_dough",
        ["createdelight:dry_yeast"]
            .concat(multi_item("bakeries:flour", 5))
            .concat(Fluid.of("createdelight:egg_yolk", 250)),
        400
    )
    fermenting(e,
        "5x farmersdelight:wheat_dough",
        ["createdelight:dry_yeast"]
            .concat(multi_item("bakeries:flour", 5))
            .concat(Fluid.of("createdelight:artificial_egg_yolk", 250)),
        400
    )
    fermenting(e,
        "5x bakeries:sweet_dough",
        [
            "createdelight:dry_yeast",
            "minecraft:sugar"
        ]
            .concat(multi_item("bakeries:flour", 5))
            .concat(Fluid.of("createdelight:egg_yolk", 250)),
        400
    )
    fermenting(e,
        "5x bakeries:sweet_dough",
        [
            "createdelight:dry_yeast",
            "minecraft:sugar"
        ]
            .concat(multi_item("bakeries:flour", 5))
            .concat(Fluid.of("createdelight:artificial_egg_yolk", 250)),
        400
    )
    create.mixing(
        "bakeries:sweet_dough",
        [
            "farmersdelight:wheat_dough",
            "minecraft:sugar"
        ]
    ).id("createdelight:mixing/sweet_dough")
    create.mixing(
        "4x bakeries:meat_floss",
        [
            "minecraft:cooked_porkchop",
            "minecraft:sugar"
        ]
    )
        .processingTime(200)
        .id("createdelight:mixing/meat_floss")
    e.recipes.minecraft.smoking("minecraft:bread", "bakeries:whole_wheat_dough", 0.7, 100)
        .id("createdelight:bread_from_whole_wheat_dough")

    e.recipes.kubejs.shaped(
        'minecraft:bread',
        [
            "AAA"
        ], {
        A: "minecraft:wheat"
    }
    ).id("minecraft:shapeless/bread")
    //酥皮
    kubejs.shapeless(
        "createdelight:puff_pastry",
        [
            "#forge:animal_oil",
            "createdelight:oil_dough"
        ]
    ).id("createdelight:puff_pastry")

    //面胚
    {
        let iner = "bakeries:sweet_dough"
        create.sequenced_assembly("4x bakeries:round_bread_dough", iner, [
            vintageimprovements.curving(iner, iner).mode(2),
            create.cutting(iner, iner)
        ])
            .loops(1)
            .transitionalItem(iner)
            .id("createdelight:sequenced_assembly/round_bread_dough")
    }
    vintageimprovements.curving("2x bakeries:bagel_dough", "bakeries:sweet_dough").mode(1).id("createdelight:curving/bagel_dough")
    vintageimprovements.curving("2x bakeries:whole_wheat_bagel_dough", "bakeries:whole_wheat_dough").mode(1).id("createdelight:curving/whole_wheat_bagel_dough")
    {
        let iner = "ratatouille:salty_dough"
        create.sequenced_assembly("2x bakeries:ciabatta_dough", iner,
            [
                vintageimprovements.curving(iner, iner).mode(1),
                create.cutting(iner, iner)
            ]
        )
            .loops(1)
            .transitionalItem(iner)
            .id("createdelight:sequenced_assembly/ciabatta_dough")
    }
    vintageimprovements.curving("bakeries:country_bread_dough", "ratatouille:salty_dough").mode(2).id("createdelight:curving/country_bread_dough")
    createaddition.rolling("createdelight:puff_pastry", "bakeries:croissant_dough").id("createdelight:rolling/croissant_dough")
    createaddition.rolling("ratatouille:salty_dough", "bakeries:baguette_dough").id("createdelight:rolling/baguette_dough")
    kubejs.shapeless(
        "bakeries:berry_bread_dough",
        [
            "bakeries:round_bread_dough",
            "minecraft:sweet_berries"
        ]
    ).id("createdelight:berry_bread_dough_manual_only")
    create.deploying(
        "bakeries:berry_bread_dough",
        [
            "bakeries:round_bread_dough",
            "minecraft:sweet_berries"
        ]
    ).id("createdelight:deploying/berry_bread_dough")
    kubejs.shapeless(
        'bakeries:salt_croissant_dough',
        [
            'bakeries:croissant_dough',
            'vintagedelight:salt_dust'
        ]
    ).id("createdelight:salt_croissant_dough_manual_only")
    create.deploying(
        "bakeries:salt_croissant_dough",
        [
            "bakeries:croissant_dough",
            "vintagedelight:salt_dust"
        ]
    ).id("createdelight:deploying/salt_croissant_dough")
    kubejs.shapeless(
        "bakeries:meat_floss_bread_roll",
        [
            "bakeries:sliced_toast",
            "bakeries:meat_floss"
        ]
    ).id("createdelight:meat_floss_bread_roll_manual_only")
    create.deploying(
        "bakeries:meat_floss_bread_roll",
        [
            "bakeries:sliced_toast",
            "bakeries:meat_floss"
        ]
    ).id("createdelight:deploying/meat_floss_bread_roll")
    kubejs.shapeless(
        'bakeries:pineapple_bun_dough',
        [
            'bakeries:round_bread_dough',
            'createdelight:butter',
            "minecraft:sugar"
        ]
    ).id("createdelight:pineapple_bun_dough_manual_only")
    {
        let iner = "bakeries:round_bread_dough"
        create.sequenced_assembly('bakeries:pineapple_bun_dough', 'bakeries:round_bread_dough',
            [
                create.deploying(iner, [iner, 'createdelight:butter']),
                create.deploying(iner, [iner, "minecraft:sugar"])
            ]
        )
            .loops(1)
            .transitionalItem(iner)
            .id("createdelight:sequenced_assembly/pineapple_bun_dough")
    }
    kubejs.shapeless(
        'bakeries:brown_sugar_roll_dough',
        [
            'bakeries:round_bread_dough',
            'createdelight:butter',
            'bakeries:brown_sugar_cube'
        ]
    ).id("createdelight:brown_sugar_roll_dough_manual_only")
    {
        let iner = "bakeries:round_bread_dough"
        create.sequenced_assembly('bakeries:brown_sugar_roll_dough', iner,
            [
                create.deploying(iner, [iner, 'createdelight:butter']),
                create.deploying(iner, [iner, "bakeries:brown_sugar_cube"])
            ]
        )
            .loops(1)
            .transitionalItem(iner)
            .id("createdelight:sequenced_assembly/brown_sugar_roll_dough")
    }
    kubejs.shapeless(
        "bakeries:mould_toast_dough",
        [
            "3x bakeries:round_bread_dough",
            "bakeries:mould"
        ]
    ).id("createdelight:mould_toast_dough_manual_only")
    kubejs.shapeless(
        "bakeries:mould_cheese_cocoa_toast_dough",
        [
            "bakeries:mould_toast_dough",
            "3x trailandtales_delight:cheese_slice",
            "3x ratatouille:cocoa_powder"
        ]
    ).id("createdelight:cheese_cocoa_toast_dough_manual_only")
    {
        let iner = "bakeries:mould"
        create.sequenced_assembly("bakeries:mould_cheese_cocoa_toast_dough", iner,
            [
                create.deploying(iner, [iner, "bakeries:round_bread_dough"]),
                create.deploying(iner, [iner, "trailandtales_delight:cheese_slice"]),
                create.deploying(iner, [iner, "ratatouille:cocoa_powder"])
            ]
        )
            .loops(3)
            .transitionalItem(iner)
            .id("createdelight:sequenced_assembly/mould_cheese_cocoa_toast_dough")
    }
    {
        let iner = "bakeries:mould_toast_dough"
        create.sequenced_assembly("bakeries:mould_cheese_cocoa_toast_dough", iner,
            [
                create.deploying(iner, [iner, "trailandtales_delight:cheese_slice"]),
                create.deploying(iner, [iner, "ratatouille:cocoa_powder"])
            ]
        )
            .loops(3)
            .transitionalItem(iner)
            .id("createdelight:sequenced_assembly/mould_cheese_cocoa_toast_dough_2")

    }
    {
        let iner = "bakeries:baguette"
        create.sequenced_assembly("2x bakeries:baguette_with_filling", iner,
            [
                create.cutting(iner, iner),
                create.deploying(iner, [iner, "#forge:vegetables/tomato"]),
                create.deploying(iner, [iner, "#forge:cooked_pork"]),
                create.cutting(iner, iner)
            ]
        )
            .loops(1)
            .transitionalItem(iner)
            .id("createdelight:sequenced_assembly/baguette_with_filling")
    }
    {
        let iner = 'bakeries:croissant'
        create.sequenced_assembly('2x bakeries:tomato_cheese_croissant_sandwich', iner,
            [
                create.cutting(iner, iner),
                create.deploying(iner, [iner, '#forge:vegetables/tomato']),
                create.deploying(iner, [iner, '#forge:cheese']),
            ]
        )
            .loops(1)
            .transitionalItem(iner)
            .id("createdelight:sequenced_assembly/tomato_cheese_croissant_sandwich")
    }

    //烤面包
    let breads = [
        ['bakeries:bagel_dough', "bakeries:bagel", 200],
        ['bakeries:whole_wheat_bagel_dough', 'bakeries:whole_wheat_bagel', 300],
        ['bakeries:round_bread_dough', 'bakeries:round_bread', 100],
        ['bakeries:berry_bread_dough', 'bakeries:berry_bread', 100],
        ['bakeries:baguette_dough', 'bakeries:baguette', 200],
        ['bakeries:croissant_dough', 'bakeries:croissant', 200],
        ['bakeries:salt_croissant_dough', 'bakeries:salt_croissant', 220],
        ['bakeries:brown_sugar_roll_dough', 'bakeries:brown_sugar_roll', 200],
        ['bakeries:pineapple_bun_dough', 'bakeries:pineapple_bun', 200],
        ['bakeries:country_bread_dough', 'bakeries:country_bread', 300],
        ['bakeries:ciabatta_dough', 'bakeries:ciabatta', 160],
        ['bakeries:mould_toast_dough', 'bakeries:mould_toast', 400],
        ['bakeries:mould_cheese_cocoa_toast_dough', 'bakeries:mould_cheese_cocoa_toast', 400],
        ['bakeries:focaccia_dough', 'bakeries:focaccia', 200]
    ]
    breads.forEach(([dough, bread, time]) => {
        baking(e, dough, bread, 1, "food", time)
    })
    //吐司脱模(存在诡异的bug现象)
    // e.custom({
    //     "type": "ratatouille:demolding",
    //     "ingredients": [
    //         {
    //             "item": "bakeries:mould_toast"
    //         }
    //     ],
    //     "results": [
    //         {
    //             "item": "bakeries:toast"
    //         },
    //         {
    //             "item": "bakeries:mould"
    //         }
    //     ]
    // }).id("createdelight:demolding/mould_toast")
    // e.custom({
    //     "type": "ratatouille:demolding",
    //     "ingredients": [
    //         {
    //             "item": "bakeries:mould_cheese_cocoa_toast"
    //         }
    //     ],
    //     "results": [
    //         {
    //             "item": "bakeries:cheese_cocoa_toast"
    //         },
    //         {
    //             "item": "bakeries:mould"
    //         }
    //     ]
    // }).id("createdelight:demolding/mould_cheese_cocoa_toast")

    kubejs.shaped("bakeries:focaccia_dough", [
        "ABC",
        " D "
    ], {
        A: "#forge:vegetables/onion",
        B: "#forge:vegetables/tomato",
        C: "frycooks_delight:canola_oil",
        D: "ratatouille:salty_dough"
    })
        .id("createdelight:focaccia")
    create.mixing("bakeries:focaccia_dough", [
        Fluid.of("createdieselgenerators:plant_oil", 250),
        "#forge:vegetables/onion",
        "#forge:vegetables/tomato",
        "ratatouille:salty_dough"
    ])
        .id("createdelight:mixing/focaccia")
    //其他
    vintageimprovements.vacuumizing(
        [
            Fluid.water(150),
            "bakeries:brown_sugar_cube"
        ],
        Fluid.of("createdelight:unrefined_sugar", 200)
    )
        .secondaryFluidOutput(0)
        .heated()
        .id("createdelight:vacuumizing/brown_sugar_cube")
    //面包切割
    cutting_2(e, 'bakeries:toast', [['bakeries:sliced_toast', 4]])
    cutting_2(e, 'bakeries:cheese_cocoa_toast', [['bakeries:sliced_cheese_cocoa_toast', 4]])
    cutting_2(e, 'bakeries:country_bread', [['bakeries:country_bread_slice', 6]])
    create.cutting(
        '4x bakeries:sliced_toast',
        'bakeries:toast'
    ).id("createdelight:cutting/toast")
    create.cutting(
        '4x bakeries:sliced_cheese_cocoa_toast',
        'bakeries:cheese_cocoa_toast'
    ).id("createdelight:cutting/cheese_cocoa_toast")
    create.cutting(
        '6x bakeries:country_bread_slice',
        'bakeries:country_bread'
    ).id("createdelight:cutting/country_bread")

    create.filling("bakeries:paper_cup_cake_paste", ["bakeries:paper_cup", Fluid.of("createdelight:cake_batter", 250)])
        .id("createdelight:filling/paper_cup_cake_paste")

    baking(e, "bakeries:paper_cup_cake_paste", "bakeries:cup_cake", 1, "food", 100)

    cutting_1(e, "ratatouille:cake_base", [["bakeries:cut_cake_base", 2]])
    create.filling("bakeries:soak_coffee_cut_cake_base", ["bakeries:cut_cake_base", Fluid.of("createdelight:espresso_fluid", 250)])
        .id("createdelight:filling/soak_coffee_cut_cake_base")
    create.compacting("bakeries:foamed_cream", [Fluid.of("cosmopolitan:cream", 250)])
        .heated()
        .id("createdelight:compacting/foamed_cream")
    create.mixing("2x bakeries:cheese_cream", ["bakeries:foamed_cream", "#forge:cheese"])
        .id("createdelight:mixing/cheese_cream")
    // create.filling("bakeries:crispy_dough", ["createdelight:oil_dough", FluidIngredients("forge:milk", 250)])
    //     .id("createdelight:filling/crispy_dough")
    create.cutting("8x bakeries:scone_dough", 'createdelight:puff_pastry')
        .id("createdelight:cutting/scone_dough")
    kubejs.shapeless(
        "bakeries:cream_pumpkin_pie_dough",
        [
            "createdelight:puff_pastry",
            "farmersdelight:pumpkin_slice",
            "bakeries:foamed_cream"
        ]
    ).id("createdelight:cream_pumpkin_pie_dough")
    baking(e, 'bakeries:cream_pumpkin_pie_dough', 'bakeries:cream_pumpkin_pie', 1, "food", 100)
    cutting(e, 'bakeries:pound_cake', [['bakeries:sliced_pound_cake', 4]])
    e.custom({
        "type": "bakeries:dough_crafting_table",
        "count": 8,
        "ingredient":
        {
            "item": "createdelight:puff_pastry"
        },
        "result": "bakeries:scone_dough"
    }).id("createdelight:dough_crafting_table/scone_dough")
    {
        let iner = "bakeries:mould"
        create.sequenced_assembly("bakeries:mould_pound_cake_paste", "bakeries:mould", [
            create.filling(iner, [iner, Fluid.of("createdelight:cake_batter", 500)]),
            create.deploying(iner, [iner, "#forge:animal_oil"])
        ])
            .loops(1)
            .transitionalItem(iner)
            .id("createdelight:sequence_assembly/mould_pound_cake_paste")
    }

    baking(e, "bakeries:mould_pound_cake_paste", "bakeries:mould_pound_cake", 1, "food", 100)
    {
        let iner = 'bakeries:cut_cake_base'
        create.sequenced_assembly('bakeries:cream_cake', iner, [
            create.filling(iner, [iner, Fluid.of("cosmopolitan:cream", 250)]),
            create.deploying(iner, [iner, "bakeries:cut_cake_base"]),
            create.filling(iner, [iner, Fluid.of("cosmopolitan:cream", 250)]),
            create.deploying(iner, [iner, "#alexscaves:sweet_berries"])
        ])
            .loops(1)
            .transitionalItem(iner)
            .id("createdelight:sequence_assembly/cream_cake")
    }
    {
        let iner = 'bakeries:cut_cake_base'
        create.sequenced_assembly('bakeries:cream_cake', iner, [
            create.deploying(iner, [iner, '#forge:cream']),
            create.deploying(iner, [iner, "bakeries:cut_cake_base"]),
            create.deploying(iner, [iner, '#forge:cream']),
            create.deploying(iner, [iner, "#alexscaves:sweet_berries"])
        ])
            .loops(1)
            .transitionalItem(iner)
            .id("createdelight:sequence_assembly/cream_cake_2")
    }
    {
        let iner = 'bakeries:soak_coffee_cut_cake_base'
        create.sequenced_assembly('bakeries:tiramisu', iner, [
            create.deploying(iner, [iner, 'bakeries:cheese_cream']),
            create.deploying(iner, [iner, "bakeries:soak_coffee_cut_cake_base"]),
            create.deploying(iner, [iner, 'bakeries:cheese_cream']),
            create.deploying(iner, [iner, "ratatouille:cocoa_powder"])
        ])
            .loops(1)
            .transitionalItem(iner)
            .id("createdelight:sequence_assembly/tiramisu")
    }
    // {
    //     let iner = "bakeries:mould_two"
    //     create.sequenced_assembly("bakeries:mould_carrot_cake_paste", "bakeries:mould_two", [
    //         create.filling(iner, [iner, Fluid.of("createdelight:cake_batter", 500)]),
    //         create.deploying(iner, [iner, "bakeries:brown_sugar_cube"]),
    //         create.deploying(iner, [iner, "minecraft:carrots"])
    //     ])
    //     .loops(1)
    //     .transitionalItem(iner)
    //     .id("createdelight:sequence_assembly/mould_carrot_cake_paste")
    // }

    // baking(e, "bakeries:mould_carrot_cake_paste", "bakeries:mould_carrot_cake", 1, "food", 100)
    vintageimprovements.curving(
        [
            'bakeries:mould',
            'bakeries:toast'
        ],
        'bakeries:mould_toast'
    )
        .mode(2)
        .id("createdelight:curving/mould_toast")
    vintageimprovements.curving(
        [
            'bakeries:mould',
            'bakeries:cheese_cocoa_toast'
        ],
        'bakeries:mould_cheese_cocoa_toast'
    )
        .mode(2)
        .id("createdelight:curving/mould_cheese_cocoa_toast")
    vintageimprovements.curving(
        [
            'bakeries:mould',
            'bakeries:pound_cake'
        ],
        'bakeries:mould_pound_cake'
    )
        .mode(2)
        .id("createdelight:curving/mould_pound_cake")
    kubejs.shaped('4x bakeries:paper_cup', [
        "   ",
        "A A",
        " A "
    ], {
        A: "bakeries:silicone_paper"
    }).id("createdelight:paper_cup")
    
    create.filling("bakeries:bagel_filled_sauce", [
        Fluid.of("create_bic_bit:mayonnaise", 250),
        "bakeries:bagel"
    ]).id("createdelight:filling/bagel_filled_sauce")
    create.compacting("bakeries:flat_croissant", "bakeries:croissant")
        .id("createdelight:compacting/flat_croissant")
    create.sequenced_assembly("bakeries:mould_basque_cake_paste", "bakeries:mould_two", [
        create.filling("bakeries:mould_basque_cake_paste", ["bakeries:mould_two", Fluid.of("createdelight:cake_batter", 500)]),
        create.deploying("bakeries:mould_basque_cake_paste", ["bakeries:mould_two", "#forge:cheese"])
    ])
        .loops(1)
        .transitionalItem("bakeries:mould_two")
        .id("createdelight:sequence_assembly/mould_basque_cake_paste")
    baking(e, "bakeries:mould_basque_cake_paste", "bakeries:mould_basque_cake", 1, "food", 100)
    baking(e, "bakeries:raw_yuntui_mooncake", "bakeries:yuntui_mooncake", 1, "food", 100)
    baking(e, "bakeries:rice_bread_dough", "bakeries:rice_bread", 1, "food", 100)
    vintageimprovements.curving(
        [
            'bakeries:mould_two',
            'bakeries:basque_cake'
        ],
        'bakeries:mould_basque_cake'
    )
        .mode(2)
        .id("createdelight:curving/mould_basque_cake")
    vintageimprovements.curving("3x bakeries:egg_tart_shell", "createdelight:puff_pastry").mode(1).id("createdelight:curving/egg_tart_shell")


})
ServerEvents.tags("item", e => {
    e.removeAllTagsFrom('bakeries:cheese_cube')
})