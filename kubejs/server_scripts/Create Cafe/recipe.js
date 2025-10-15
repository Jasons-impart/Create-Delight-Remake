ServerEvents.recipes(e => {
    const {create, vintageimprovements} = e.recipes
    remove_recipes_id(e , [
        "createcafe:mixing/sugar_melting",
        "createcafe:filling/tamarind_tea_filling",
        "createcafe:filling/lavender_tea_filling",
        "createcafe:filling/aloe_tea_filling",
        "createcafe:filling/blackberry_tea_filling",
        "createcafe:filling/guava_tea_filling",
        "createcafe:filling/passionfruit_tea_filling",
        "createcafe:filling/redlove_tea_filling",
        "createcafe:filling/apricot_tea_filling",
        "createcafe:filling/barberry_tea_filling",
        "createcafe:filling/jackfruit_tea_filling",
        "createcafe:filling/gooseberry_tea_filling",
        "createcafe:filling/mandarin_tea_filling",
        "createcafe:filling/starfruit_tea_filling",
        "createcafe:filling/dragonfruit_tea_filling",
        "createcafe:filling/papaya_tea_filling",
        "createcafe:filling/coconut_tea_filling",
        "createcafe:filling/grapefruit_tea_filling",
        "createcafe:filling/mana_tea_filling",
        "createcafe:filling/pomelo_tea_filling",
        "createcafe:filling/citron_tea_filling",
        "createcafe:filling/raspberry_tea_filling",
        "createcafe:filling/yucca_tea_filling",
        "createcafe:filling/plum_tea_filling",
    ])
    create.mixing(Fluid.of("createdelight:base_syrup", 125), "minecraft:sugar")
    .heated()
    .id("createcafe:mixing/sugar_melting")
    vintageimprovements.vacuumizing("minecraft:sugar", Fluid.of("createdelight:base_syrup", 125)).id("createcafe:vacuumizing/melted_sugar_vacuumizing")
    create.compacting("createdelightcore:base_syrup", Fluid.of("createdelight:base_syrup", 1000)).id("createcafe:compacting/base_syrup")
    create.compacting("createdelightcore:strawberry_syrup", Fluid.of("createdelight:strawberry_syrup", 1000)).id("createcafe:compacting/strawberry_syrup")
    create.compacting("createdelightcore:banana_syrup", Fluid.of("createdelight:banana_syrup", 1000)).id("createcafe:compacting/banana_syrup")
    create.compacting("createdelightcore:vanilla_syrup", Fluid.of("createdelight:vanilla_syrup", 1000)).id("createcafe:compacting/vanilla_syrup")
    create.compacting("createdelightcore:mint_syrup", Fluid.of("createdelight:mint_syrup", 1000)).id("createcafe:compacting/mint_syrup")
    create.mixing(
        Fluid.of("createdelight:vanilla_syrup", 250),
        [
            Fluid.of("createdelight:base_syrup", 250),
            "#neapolitan:vanilla"
        ]
    ).heated().id("createcafe:mixing/syrups/vanilla_syrup_mixing2")
    create.mixing(
        Fluid.of("createdelight:banana_syrup", 250),
        [
            Fluid.of("createdelight:base_syrup", 250),
            '#forge:fruits/banana'
        ]
    ).heated().id("createcafe:mixing/syrups/banana_syrup_mixing")
    create.mixing(
        Fluid.of("createdelight:strawberry_syrup", 250),
        [
            Fluid.of("createdelight:base_syrup", 250),
            "#forge:fruits/strawberry"
        ]
    ).heated().id("createcafe:mixing/syrups/strawberry_syrup_mixing")
    create.mixing(
        Fluid.of("createdelight:mint_syrup", 250),
        [
            Fluid.of("createdelight:base_syrup", 250),
            '#neapolitan:mint_leaves'
        ]
    ).heated().id("createcafe:mixing/syrups/mint_syrup_mixing")
    create.mixing(
        "createcafe:boba",
        [
            "createcafe:raw_boba",
            Fluid.of("createdelight:base_syrup", 250)
        ]
    ).heated().id("createcafe:mixing/raw_boba_to_boba_mixing")
    create.mixing(
        Fluid.of("createdelight:filling", 1000),
        [
            Fluid.of("createdelight:base_syrup", 1000),
            'bakeries:foamed_cream'
        ]
    ).heated().id("createcafe:mixing/oreo_filling_mixing")
    create.mixing(
        Fluid.of("createdelight:filling", 1000),
        [
            Fluid.of("createdelight:base_syrup", 1000),
            Fluid.of('cosmopolitan:cream', 250)
        ]
    ).heated().id("createcafe:mixing/oreo_filling_mixing_2")
    create.filling(
        'createcafe:vanilla_iced_coffee',
        [
            'createcafe:iced_coffee',
            Fluid.of("createdelight:vanilla_syrup", 250)
        ]
    ).id("createcafe:filling/coffee/vanilla_iced_coffee_filling")
    create.filling(
        'createcafe:strawberry_iced_coffee',
        [
            'createcafe:iced_coffee',
            Fluid.of("createdelight:strawberry_syrup", 250)
        ]
    ).id("createcafe:filling/coffee/strawberry_iced_coffee_filling")
    create.filling(
        'createcafe:mint_iced_coffee',
        [
            'createcafe:iced_coffee',
            Fluid.of("createdelight:mint_syrup", 250)
        ]
    ).id("createcafe:filling/coffee/mint_iced_coffee_filling")
    create.filling(
        'createcafe:banana_iced_coffee',
        [
            'createcafe:iced_coffee',
            Fluid.of("createdelight:banana_syrup", 250)
        ]
    ).id("createcafe:filling/coffee/banana_iced_coffee_filling")
    {
        let iner = 'createcafe:oreo_incomplete'
        create.sequenced_assembly('createcafe:oreo', 'createcafe:oreo_half', 
            [
                create.filling(iner, [iner, Fluid.of("createdelight:filling", 250)]),
                create.deploying(iner, [iner, "createcafe:oreo_half"])
            ]
        )
            .loops(1)
            .transitionalItem(iner)
            .id("createcafe:sequenced_assembly/oreo_assembling")
    }
    create.milling(
        [
            '2x createcafe:oreo_crushed',
            Item.of("createcafe:oreo_crushed").withChance(0.25)
        ],
        'createcafe:oreo'
    ).id("createcafe:milling/oreo_milling")
    create.crushing(
        [
            '2x createcafe:oreo_crushed',
            Item.of("createcafe:oreo_crushed").withChance(0.25)
        ],
        'createcafe:oreo'
    ).id("createcafe:crushing/oreo_crushing")
    create.milling(
        "createcafe:oreo_crushed",
        "createcafe:oreo_half"
    ).id("createcafe:crushing/oreo_half_crushing")
})