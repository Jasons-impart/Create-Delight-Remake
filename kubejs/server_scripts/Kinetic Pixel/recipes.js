ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "kinetic_pixel:enderalloyingotloot",
        "kinetic_pixel:endercsloot",
        "kinetic_pixel:tableloot",
        "kinetic_pixel:shellloot",
    ])
    remove_recipes_output(e,
        [
            'kinetic_pixel:brasscompressionsheet',
            'kinetic_pixel:andesitealloycompressionsheet',
            'kinetic_pixel:specialsteelcompressionsheet',
            'kinetic_pixel:specialsteelingot',
            'kinetic_pixel:nitropropellant'
        ]
    )
    e.replaceInput({ mod: "kinetic_pixel" }, "create:iron_sheet", "ad_astra:steel_plate")
    e.replaceInput({ mod: "kinetic_pixel" }, "minecraft:iron_nugget", "ad_astra:steel_nugget")
    e.replaceInput({ mod: "kinetic_pixel" }, "kinetic_pixel:specialsteelingot", "createmetallurgy:steel_ingot")
    e.replaceInput({ mod: "kinetic_pixel" }, "create:precision_mechanism", "vintageimprovements:steel_spring")
    e.replaceInput({ mod: "kinetic_pixel" }, "minecraft:redstone", "vintageimprovements:redstone_module")

    const { create, vintageimprovements, kubejs, minecraft, createmetallurgy } = e.recipes

    create.mixing(
        "4x createdelight:guncotton",
        [
            FluidIngredients("forge:acid", 100),
            "minecraft:gunpowder",
            "minecraft:paper"
        ]
    ).id("createdelight:mixing/guncotton_paper_gunpowder")
    create.mixing(
        "4x createdelight:guncotton",
        [
            FluidIngredients("forge:acid", 100),
            Fluid.of("supplementaries:lumisene", 100),
            "minecraft:paper"
        ]
    ).id("createdelight:mixing/guncotton_paper_lumisene")

    create.mixing(
        "16x createdelight:guncotton",
        [
            FluidIngredients("forge:acid", 100),
            "minecraft:gunpowder",
            "kinetic_pixel:graycotton"
        ]
    ).id("createdelight:mixing/guncotton_graycotton_gunpowder")
    create.mixing(
        "16x createdelight:guncotton",
        [
            FluidIngredients("forge:acid", 100),
            Fluid.of("supplementaries:lumisene", 100),
            "kinetic_pixel:graycotton"
        ]
    ).id("createdelight:mixing/guncotton_graycotton_lumisene")

    vintageimprovements.turning(
        'kinetic_pixel:barrel',
        'createmetallurgy:steel_ingot'
    ).id("kinetic_pixel:barrelloot")
    create.mechanical_crafting(
        Item.of('tacz:modern_kinetic_gun', '{GunCurrentAmmoCount:0,GunFireMode:"SEMI",GunId:"create_armorer:pistol_revolver_torque",HasBulletInBarrel:1b}'),
        [
            "AAAA",
            "BBCD",
            " EFD",
            "   D"
        ],
        {
            A: "create:brass_sheet",
            B: "kinetic_pixel:barrel",
            C: "create_sa:steam_engine",
            D: "#minecraft:logs",
            E: "kinetic_pixel:ammunitionbox",
            F: "kinetic_pixel:pistonexciter"
        })
        .id("create_armorer:pistol_revolver_torque")
    create.mechanical_crafting(
        Item.of('tacz:modern_kinetic_gun', '{GunCurrentAmmoCount:0,GunFireMode:"SEMI",GunId:"create_armorer:pistol_auto_stress",HasBulletInBarrel:1b}'),
        [
            "AAAA",
            "BBCD",
            "EFGD",
            "   D"
        ],
        {
            A: "create:brass_sheet",
            B: "kinetic_pixel:barrel",
            C: "create_sa:heat_engine",
            D: "#minecraft:logs",
            E: "vintageimprovements:andesite_sheet",
            F: "kinetic_pixel:ammunitionbox",
            G: "kinetic_pixel:pistonexciter"
        })
        .id("create_armorer:pistol_auto_stress")
    create.mechanical_crafting(
        Item.of('tacz:modern_kinetic_gun', '{GunCurrentAmmoCount:0,GunFireMode:"SEMI",GunId:"create_armorer:sniper_semi_clockwork",HasBulletInBarrel:1b}'),
        [
            "AAAABB ",
            "CCCDEFB",
            "GGGGHI ",
            "      I"
        ],
        {
            A: "create:brass_sheet",
            B: "ad_astra:steel_plate",
            C: "kinetic_pixel:barrel",
            D: "kinetic_pixel:ammunitionbox",
            E: "create_sa:steam_engine",
            F: "vintageimprovements:steel_rod",
            G: "create:copper_sheet",
            H: "kinetic_pixel:strikerexciter",
            I: "#minecraft:logs"
        })
        .id("create_armorer:sniper_semi_clockwork")
    create.mechanical_crafting(
        Item.of('tacz:modern_kinetic_gun', '{GunCurrentAmmoCount:0,GunFireMode:"AUTO",GunId:"create_armorer:rifle_assult_crane",HasBulletInBarrel:1b}'),
        [
            "AAAAB  ",
            "CCCDEFB",
            " AAAGH ",
            "      H"
        ],
        {
            A: "create:brass_sheet",
            B: "ad_astra:steel_plate",
            C: "kinetic_pixel:barrel",
            D: "kinetic_pixel:ammunitionbox",
            E: "create_sa:steam_engine",
            F: "vintageimprovements:steel_rod",
            G: "kinetic_pixel:strikerexciter",
            H: "#minecraft:logs"
        })
        .id("create_armorer:rifle_assult_crane")
    create.mechanical_crafting(
        Item.of('tacz:modern_kinetic_gun', '{GunCurrentAmmoCount:0,GunFireMode:"SEMI",GunId:"create_armorer:shotgun_db_stone",HasBulletInBarrel:1b}'),
        [
            "AAAB  ",
            "CCDE  ",
            "CCAFG ",
            "     G"
        ],
        {
            A: "ad_astra:steel_plate",
            B: "create:brass_sheet",
            C: "kinetic_pixel:barrel",
            D: "kinetic_pixel:ammunitionbox",
            E: "create_sa:steam_engine",
            F: "kinetic_pixel:strikerexciter",
            G: "#minecraft:logs"
        })
        .id("create_armorer:shotgun_db_stone")
    create.mechanical_crafting(
        Item.of('tacz:modern_kinetic_gun', '{GunCurrentAmmoCount:0,GunFireMode:"AUTO",GunId:"create_armorer:mg_platemag_flywheel",HasBulletInBarrel:1b}'),
        [
            " ABBA  ",
            "CDDDEFC",
            "C  GH  ",
            "     H "
        ],
        {
            A: "create:brass_sheet",
            B: "kinetic_pixel:ammunitionbox",
            C: "ad_astra:steel_plate",
            D: "kinetic_pixel:barrel",
            E: "create_sa:steam_engine",
            F: "vintageimprovements:steel_rod",
            G: "kinetic_pixel:strikerexciter",
            H: "#minecraft:logs"
        })
        .id("create_armorer:mg_platemag_flywheel")
    create.mechanical_crafting(
        Item.of('tacz:modern_kinetic_gun', '{GunCurrentAmmoCount:0,GunFireMode:"SEMI",GunId:"create_armorer:shotgun_pump_bearing",HasBulletInBarrel:0b}'),
        [
            "   AAA  ",
            "BBBBCA  ",
            "  BBDEFF"
        ],
        {
            A: "create:brass_sheet",
            B: "kinetic_pixel:barrel",
            C: "create_sa:steam_engine",
            D: "kinetic_pixel:ammunitionbox",
            E: "kinetic_pixel:strikerexciter",
            F: "#minecraft:logs"
        })
        .id("create_armorer:shotgun_pump_bearing")
    create.mechanical_crafting(
        Item.of('tacz:modern_kinetic_gun', '{GunCurrentAmmoCount:0,GunFireMode:"AUTO",GunId:"create_armorer:smg_auto_crank",HasBulletInBarrel:0b}'),
        [
            "AAAB  ",
            "CCCDEB",
            "FAGH  ",
            "    H "
        ],
        {
            A: "create:brass_sheet",
            B: "create:brass_sheet",
            C: "kinetic_pixel:barrel",
            D: "create_sa:steam_engine",
            E: "vintageimprovements:steel_rod",
            F: "kinetic_pixel:ammunitionbox",
            G: "kinetic_pixel:strikerexciter",
            H: "#minecraft:logs"
        })
        .id("create_armorer:smg_auto_crank")
    kubejs.shaped(
        Item.of('tacz:attachment', '{AttachmentId:"create_armorer:sight_standard"}'),
        [
            " A ",
            "BCB",
            " A "
        ],
        {
            A: "create:brass_sheet",
            B: "createprism:brass_glass_casing",
            C: "create:precision_mechanism"
        }
    )
    .id("create_armorer:sight_standard")
    kubejs.shaped(
        Item.of('tacz:attachment', '{AttachmentId:"create_armorer:sight_medium_distance"}'),
        [
            "AAA",
            "BCB",
            "AAA"
        ],
        {
            A: "create:brass_sheet",
            B: "createprism:brass_glass_casing",
            C: Item.of('tacz:attachment', '{AttachmentId:"create_armorer:sight_standard"}').strongNBT()
        }
    )
    .id("create_armorer:sight_medium_distance")
    kubejs.shaped(
        Item.of('tacz:attachment', '{AttachmentId:"create_armorer:scope_telephoto"}'),
        [
            "AAA",
            "BCB",
            "AAA"
        ],
        {
            A: "create:brass_sheet",
            B: "createprism:brass_glass_casing",
            C: Item.of('tacz:attachment', '{AttachmentId:"create_armorer:sight_medium_distance"}').strongNBT()
        }
    ).id("create_armorer:scope_telephoto")
    kubejs.shaped(
        Item.of('tacz:attachment', '{AttachmentId:"create_armorer:grip_gantry_shaft"}'),
        [
            "A",
            "A"
        ],
        {
            A: "create:gantry_shaft"
        }
    ).id("create_armorer:grip_gantry_shaft")
    kubejs.shaped(
        Item.of('tacz:attachment', '{AttachmentId:"create_armorer:grip_wooden"}'),
        [
            " A ",
            " B ",
            " A "
        ], {
            A: "create:andesite_alloy",
            B: '#minecraft:logs'
        }
    ).id("create_armorer:grip_wooden")
    kubejs.shaped(
        Item.of('tacz:attachment', '{AttachmentId:"create_armorer:muzzle_refit_brass_retractor"}'),
        [
            "AAA",
            "   ",
            "AAA"
        ],
        {
            A: "createaddition:brass_rod"
        }
    ).id("create_armorer:muzzle_refit_brass_retractor")
    let iner_2 = 'ad_astra:steel_tank'
    create.sequenced_assembly(
        Item.of('tacz:attachment', '{AttachmentId:"create_armorer:muzzle_refit_lava_perfusion_bottle"}'),
        iner_2,
        [
            create.deploying(iner_2, [iner_2, 'create_sa:small_fueling_tank'])
        ]
    )
        .loops(2)
        .transitionalItem(iner_2)
        .id("create_armorer:muzzle_refit_lava_perfusion_bottle")
    kubejs.shaped(
        Item.of('tacz:attachment', '{AttachmentId:"create_armorer:extended_mag_ca_1"}'),
        [
            "ABA",
            "ACA",
            "ADA"
        ],
        {
            A: "vintageimprovements:andesite_sheet",
            B: "create_sa:heat_engine",
            C: "create:andesite_alloy",
            D: "kinetic_pixel:ammunitionbox"
        }
    ).id("create_armorer:extended_mag_ca_1")
    kubejs.shaped(
        Item.of('tacz:attachment', '{AttachmentId:"create_armorer:extended_mag_ca_2"}'),
        [
            "ABA",
            "ACA",
            "ADA"
        ],
        {
            A: "create:copper_sheet",
            B: "create_sa:hydraulic_engine",
            C: Item.of('tacz:attachment', '{AttachmentId:"create_armorer:extended_mag_ca_1"}').strongNBT(),
            D: "kinetic_pixel:ammunitionbox"
        }
    ).id("create_armorer:extended_mag_ca_2")
    kubejs.shaped(
        Item.of('tacz:attachment', '{AttachmentId:"create_armorer:extended_mag_ca_3"}'),
        [
            "ABA",
            "ACA",
            "ADA"
        ],
        {
            A: "create:brass_sheet",
            B: "create_sa:steam_engine",
            C: Item.of('tacz:attachment', '{AttachmentId:"create_armorer:extended_mag_ca_2"}').strongNBT(),
            D: "kinetic_pixel:ammunitionbox"
        }
    ).id("create_armorer:extended_mag_ca_3")

    let iner = 'createdelight:incomplete_slap'
    create.sequenced_assembly(Item.of('tacz:ammo', '{AmmoId:"create_armorer:slap"}').withCount(2), 'create:brass_sheet',
        [
            create.cutting(iner, iner),
            create.pressing(iner, iner),
            create.deploying(iner, [iner, 'createdelight:guncotton']),
            create.deploying(iner, [iner, 'createmetallurgy:tungsten_nugget'])
        ]
    )
        .loops(1)
        .transitionalItem(iner)
        .id("create_armorer:slap")

    let iner_1 = 'createdelight:incomplete_rbapb'
    create.sequenced_assembly(Item.of('tacz:ammo', '{AmmoId:"create_armorer:rbapb"}'), 'create:brass_sheet',
        [
            // vintageimprovements.polishing(iner_1, iner_1, 50, 2, true),
            createmetallurgy.grinding(iner_1, iner_1),
            create.deploying(iner_1, [iner_1, 'createdelight:guncotton']),
            create.deploying(iner_1, [iner_1, 'createmetallurgy:tungsten_nugget']),
            create.pressing(iner, iner)
        ]
    )
        .loops(1)
        .transitionalItem(iner_1)
        .id("create_armorer:rbapb")
    
    let iner_3 = 'createdelight:incomplete_gas_pistol_ammo'
    create.sequenced_assembly(Item.of('tacz:ammo', '{AmmoId:"create_armorer:gas_pistol_ammo"}'), 'create:copper_sheet',
        [
            create.cutting(iner, iner),
            create.pressing(iner, iner),
            create.deploying(iner_3, [iner_3, 'createdelight:guncotton']),
            create.deploying(iner_3, [iner_3, '#forge:nuggets/bronze'])
        ]
    )
        .loops(1)
        .transitionalItem(iner_3)
        .id("create_armorer:gas_pistol_ammo")

    let iner_4 = 'createdelight:incomplete_12g'
    create.sequenced_assembly(Item.of('tacz:ammo', '{AmmoId:"tacz:12g"}'), 'alexscaves:polymer_plate', 
        [
            create.cutting(iner, iner),
            create.pressing(iner, iner),
            create.deploying(iner_4, [iner_4, 'createdelight:guncotton']),
            create.deploying(iner_4, [iner_4, '#forge:nuggets']),
            create.deploying(iner_4, [iner_4, '#forge:nuggets']),
            create.pressing(iner_4, iner_4)
        ]
    )
        .loops(1)
        .transitionalItem(iner_4)
        .id("tacz:12g")
    
    create.sequenced_assembly(Item.of('tacz:attachment', '{AttachmentId:"create_armorer:muzzle_refit_bigger_cylinder"}'), "create:fluid_pipe",
        create.deploying("create:fluid_pipe", ["create:fluid_pipe", "ad_astra:gas_tank"])
    )
    .loops(2)
    .transitionalItem("create:fluid_pipe")
    .id("create_armorer:muzzle_refit_bigger_cylinder")
    
    create.filling(Item.of('tacz:modern_kinetic_gun', '{GunId:"create_armorer:special_melee_wrench"}'), [
        "create:wrench",
        Fluid.of("createdelight:malice_solution", 1000)
    ]).id("create_armorer:special_melee_wrench")

    kubejs.shaped(Item.of('tacz:attachment', '{AttachmentId:"create_armorer:muzzle_refit_iron_spike"}'), [
        "AAA",
        "B  "
    ], {
        A: "#forge:plates/steel",
        B: "#forge:nuggets/steel"
    })
    .id("create_armorer:muzzle_refit_iron_spike")
    threshing(e,  'kinetic_pixel:graycotton', [
        '2x minecraft:string',
        Item.of('2x minecraft:string').withChance(0.5),
        'kinetic_pixel:graycottonseed'
    ], 200)
})
