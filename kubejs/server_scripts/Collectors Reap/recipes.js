ServerEvents.recipes(e => {
    const { create, kubejs, farmersdelight} = e.recipes
    remove_recipes_output(e, [
        "collectorsreap:lime_cake",
        "collectorsreap:pomegranate_cake",
        "collectorsreap:lime_cookie"
    ])
    remove_recipes_id(e, [
        "collectorsreap:cutting/clam", 
    ])
    e.replaceInput({id: "collectorsreap:food/buttered_legs"}, "collectorsreap:chieftain_leg", "#forge:crab_leg")
    e.replaceInput({id: "collectorsreap:food/buttered_legs"}, "#forge:milk", "createdelight:butter")
    e.replaceInput({}, "collectorsreap:cooked_tiger_prawn", "#forge:shrimps")
    e.replaceInput({id: "collectorsreap:food/prawn_noodles"}, "#forge:pasta", 'createdelight:vermicelli')
    make_cake(e, "collectorsreap:lime", "collectorsreap:lime_cake")
    make_cake(e, "collectorsreap:pomegranate", "collectorsreap:pomegranate_cake")
    //虎虾剥壳
    cutting(e, 'collectorsreap:cooked_tiger_prawn', [['oceanic_delight:shrimp_slices']])
    //大饭团
    kubejs.shapeless(
        'collectorsreap:big_rice_ball',
        [
            "minecraft:dried_kelp",
            "createdelight:empty_riceball",
            "createdelight:empty_riceball",
            "createdelight:empty_riceball"
        ]
    ).id("collectorsreap:food/big_rice_ball")
    //蛤蜊肉
    farmersdelight.cutting(
        'collectorsreap:clam',
        "#forge:tools/knives",
        [
            'collectorsreap:clam_meat',
            Item.of("collectorsreap:lunar_pearl").withChance(0.1)
        ]
    ).id("collectorsreap:cutting/clam_1")
    e.custom({
        type: "farmersdelight:cutting",
        ingredients: [{ item: "collectorsreap:clam" }],
        result: [{ item: "collectorsreap:clam_meat" }, { item: "collectorsreap:lunar_pearl", chance: 0.1 }],
        tool: { type: "farmersdelight:tool_action", action: "blade_cut" }
    }).id("collectorsreap:cutting/clam_2")
    //蜜饯
    create.filling(
        'collectorsreap:candied_lime',
        [
            Fluid.of("create:honey", 250),
            'collectorsreap:lime_slice'
        ]
    ).id("collectorsreap:filling/candied_lime")
    farmersdelight.cooking(
        [
            "minecraft:honey_bottle",
            "collectorsreap:lime_slice"
        ], "collectorsreap:candied_lime", 1.0, 200
    ).id("collectorsreap:food/candied_lime")
    //派
    farmersdelight.cooking(
        [
            "#forge:fruits/lime",
            "#forge:fruits/lime",
            "#forge:fruits/lime",
            "minecraft:sugar",
            "farmersdelight:pie_crust",
            "#forge:eggs"
        ], "collectorsreap:lime_pie", 1.0, 200
    ).id("collectorsreap:food/lime_pie")
    farmersdelight.cooking(
        [
            "collectorsreap:portobello",
            "#forge:cheese",
            "#forge:vegetables/onion",
            "#forge:eggs",
            "farmersdelight:pie_crust",
            "#forge:eggs"
        ], "collectorsreap:portobello_quiche", 1.0, 200
    ).id("collectorsreap:food/portobello_quiche")
    //软糖
    create.mixing(
       '9x collectorsreap:glow_berry_gummy',
       [
            "minecraft:kelp",
            "minecraft:glow_berries",
            "minecraft:sugar",
            "minecraft:honey_block"
       ] 
    ).id("collectorsreap:integration/create/mixing/gummy/glow_berries")
    e.replaceInput({id: "collectorsreap:integration/create/mixing/gummy/coffee"}, "farmersrespite:coffee_beans", "createcafe:coffee_grounds")
    e.replaceInput({id: "collectorsreap:gummy/coffee"}, "farmersrespite:coffee_beans", "createcafe:coffee_grounds")

    //果饮
    kubejs.shapeless(
        "collectorsreap:limeade",
        [
            "#forge:fruits/lime",
            "minecraft:sugar",
            "minecraft:glass_bottle"
        ]
    ).id("collectorsreap:food/limeade")
    create.mixing(
        Fluid.of("createdelight:limeade", 500),
        [
            "#forge:fruits/lime",
            "minecraft:sugar"
        ]
    )
        .id("createdelight:mixing/limeade")
    create.emptying(
        [
            Fluid.of("createdelight:limeade", 250),
            "minecraft:glass_bottle"
        ],
        "collectorsreap:limeade"
    )
        .id("createdelight:emptying/limeade")
    create.filling(
        "collectorsreap:limeade",
        [
            Fluid.of("createdelight:limeade", 250),
            "minecraft:glass_bottle"
        ]
    )
        .id("collectorsreap:filling/limeade")
    brewing(e, "minecraft:water",
        [
            "#forge:fruits/lime",
            "minecraft:sugar"
        ], "createdelight:limeade", "collectorsreap:limeade"
    )

    kubejs.shapeless(
        'collectorsreap:berry_limeade',
        [
            "collectorsreap:limeade",
            "#forge:berries",
        ]
    )
        .id("collectorsreap:food/berry_limeade_from_limeade"),
    kubejs.shapeless(
        'collectorsreap:berry_limeade',
        [
            "#forge:fruits/lime",
            "#forge:berries",
            "minecraft:sugar",
            "minecraft:glass_bottle"
        ] 
    )
        .id("collectorsreap:food/berry_limeade")
    create.mixing(
        Fluid.of("createdelight:berry_limeade", 500),
        [
            "#forge:fruits/lime",
            "#forge:berries",
            "minecraft:sugar"
        ]
    )
        .id("createdelight:mixing/berry_limeade")
    create.mixing(
        Fluid.of("createdelight:berry_limeade", 500),
        [
            "#forge:berries", 
            Fluid.of("createdelight:limeade", 500)
        ]
    )
        .id("createdelight:mixing/berry_limeade_2")
    create.emptying(
        [
            Fluid.of("createdelight:berry_limeade", 250),
            "minecraft:glass_bottle"
        ],
        "collectorsreap:berry_limeade"
    )
        .id("createdelight:emptying/berry_limeade")
    create.filling(
        "collectorsreap:berry_limeade", 
        [
            Fluid.of("createdelight:berry_limeade", 250),
            "minecraft:glass_bottle"
        ]
    )
        .id("collectorsreap:filling/berry_limeade")
    brewing(e, "createdelight:limeade", 
        [
            '#forge:berries',
            '#forge:berries'
        ], "createdelight:berry_limeade", "collectorsreap:berry_limeade"
    )

    kubejs.shapeless(
        'collectorsreap:pink_limeade',
        [
            "collectorsreap:limeade",
            "#forge:fruits/pomegranate"
        ] 
    )
        .id("collectorsreap:food/pink_limeade_from_limeade")
    kubejs.shapeless(
        'collectorsreap:pink_limeade',
        [
            "#forge:fruits/lime",
            "#forge:fruits/pomegranate",
            "minecraft:sugar",
            "minecraft:glass_bottle"
        ] 
    )
        .id("collectorsreap:food/pink_limeade")
    create.mixing(
        Fluid.of("createdelight:pink_limeade", 500),
        [
            "#forge:fruits/lime",
            "#forge:fruits/pomegranate",
            "minecraft:sugar"
        ]
    )
        .id("createdelight:mixing/pink_limeade")
    create.mixing(
        Fluid.of("createdelight:pink_limeade", 500),
        [
            "#forge:fruits/pomegranate",
            Fluid.of("createdelight:limeade", 500)
        ]
    )
        .id("createdelight:mixing/pink_limeade_2")
    create.emptying(
        [
            Fluid.of("createdelight:pink_limeade", 250),
            "minecraft:glass_bottle"
        ],
        "collectorsreap:pink_limeade"
    )
        .id("createdelight:emptying/pink_limeade")
    create.filling(
        "collectorsreap:pink_limeade",
        [
            Fluid.of("createdelight:pink_limeade", 250),
            "minecraft:glass_bottle"
        ]
    )
        .id("collectorsreap:filling/pink_limeade")
    brewing(e, "createdelight:limeade", 
        [
            '#forge:fruits/pomegranate',
            '#forge:fruits/pomegranate'
        ], "createdelight:pink_limeade", "collectorsreap:pink_limeade"
    )

    kubejs.shapeless(
        'collectorsreap:mint_limeade',
        [
            "collectorsreap:limeade",
            "#neapolitan:mint_leaves"
        ] 
    )
        .id("collectorsreap:food/mint_limeade_from_limeade")
    kubejs.shapeless(
        'collectorsreap:mint_limeade',
        [
            "#forge:fruits/lime",
            "#neapolitan:mint_leaves",
            "minecraft:sugar",
            "minecraft:glass_bottle"
        ] 
    )
        .id("collectorsreap:food/mint_limeade")
    create.mixing(
        Fluid.of("createdelight:mint_limeade", 500),
        [
            "#forge:fruits/lime",
            "#neapolitan:mint_leaves",
            "minecraft:sugar"
        ]
    )
        .id("createdelight:mixing/mint_limeade")
    create.mixing(
        Fluid.of("createdelight:mint_limeade", 500),
        [
            "#neapolitan:mint_leaves",
            Fluid.of("createdelight:limeade", 500)
        ]
    )
        .id("createdelight:mixing/mint_limeade_2")
    create.emptying(
        [
            Fluid.of("createdelight:mint_limeade", 250),
            "minecraft:glass_bottle"
        ],
        "collectorsreap:mint_limeade"
    )
        .id("createdelight:emptying/mint_limeade")
    create.filling(
        "collectorsreap:mint_limeade",
        [
            Fluid.of("createdelight:mint_limeade", 250),
            "minecraft:glass_bottle"
        ]
    )
        .id("collectorsreap:filling/mint_limeade")
    brewing(e, "createdelight:limeade",
        [
            "#neapolitan:mint_leaves",
            "#neapolitan:mint_leaves"
        ], "createdelight:mint_limeade", "collectorsreap:mint_limeade"
    )
})