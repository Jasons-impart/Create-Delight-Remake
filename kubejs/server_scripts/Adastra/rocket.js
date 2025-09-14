ServerEvents.recipes(e => {
    const { kubejs, create, create_new_age, vintageimprovements } = e.recipes
    //航空纤维板
    create.mixing(
        'createdelight:aviation_fibers_sheet',
        [
            "createdelight:carbon_dust",
            "ad_astra:steel_plate",
            "protection_pixel:reinforcedfiber",
            Fluid.of("createdelight:ethylene_fluid", 100)
        ]
    )
        .heated()
        .id("createdelight:mixing/aviation_fibers_sheet")
    //舱体板
{
    let iner = 'createdelight:incomplete_basic_panel'
    create.sequenced_assembly('createdelight:basic_panel', 'createdelight:aviation_fibers_sheet',
        [
            create.deploying(iner, [iner, 'protection_pixel:heatresistantceramicsheet']),
            create.deploying(iner, [iner, 'tetra:forged_bolt']),
            create.deploying(iner, [iner, 'tetra:forged_mesh']),
            create.pressing(iner, iner)
        ]
    )
        .loops(1)
        .transitionalItem(iner)
        .id("createdelight:sequenced_assembly/basic_panel")
}
{
    let iner = 'createdelight:incomplete_advanced_panel'
    create.sequenced_assembly('createdelight:advanced_panel', 'createdelight:basic_panel',
        [
            create.filling(iner, [iner, Fluid.of("createdelightcore:molten_desh", 90)]),
            create.pressing(iner, iner)
        ]
    )
       .loops(1)
       .transitionalItem(iner)
       .id("createdelight:sequenced_assembly/advanced_panel")
}
{
    let iner = "createdelight:incomplete_explorer_panel"
    create.sequenced_assembly('createdelight:explorer_panel', 'createdelight:advanced_panel', 
        [
            create.filling(iner, [iner, Fluid.of("createdelightcore:molten_ostrum", 90)]),
            create.deploying(iner, [iner, 'create_new_age:overcharged_iron_sheet']),
            create.pressing(iner, iner),
            create_new_age.energising(iner, iner, 4000)
        ]
    )
        .loops(1)
        .transitionalItem(iner)
        .id("createdelight:sequenced_assembly/explorer_panel")
}
{
    let iner = "createdelight:incomplete_flare_panel"
    create.sequenced_assembly('createdelight:flare_panel', 'createdelight:explorer_panel', 
        [
            create.filling(iner, [iner, Fluid.of("createdelightcore:molten_calorite", 90)]),
            create.deploying(iner, [iner, 'create_new_age:overcharged_golden_sheet']),
            create.pressing(iner, iner),
            create_new_age.energising(iner, iner, 8000)
        ]
    )
        .loops(1)
        .transitionalItem(iner)
        .id("createdelight:sequenced_assembly/flare_panel")
}
    //舱体
    create.mechanical_crafting(
        'createdelight:basic_cabin',
        [
            "ABA",
            "ACA",
            "ADA",
            "AEA"
        ], {
            A: 'createdelight:basic_panel',
            B: '#forge:glass_panes',
            C: 'createdelight:basic_crystal_panel',
            D: '#create:seats',
            E: 'ad_astra:steel_engine'
        }
    ).id("createdelight:mechanical_crafting/basic_cabin")
    create.mechanical_crafting(
        'createdelight:advanced_cabin',
        [
            "ABA",
            "ACA",
            "ADA",
            "AEA"
        ], {
            A: 'createdelight:advanced_panel',
            B: '#forge:glass_panes',
            C: 'createdelight:advanced_crystal_panel',
            D: '#create:seats',
            E: 'ad_astra:desh_engine'
        }
    ).id("createdelight:mechanical_crafting/advanced_cabin")
    create.mechanical_crafting(
        'createdelight:explorer_cabin',
        [
            "ABA",
            "ACA",
            "ADA",
            "AEA"
        ], {
            A: 'createdelight:explorer_panel',
            B: '#forge:glass_panes',
            C: 'createdelight:holographic_interface_panel',
            D: '#create:seats',
            E: 'ad_astra:ostrum_engine'
        }
    ).id("createdelight:mechanical_crafting/explorer_cabin")
    create.mechanical_crafting(
        'createdelight:flare_cabin',
        [
            "ABA",
            "ACA",
            "ADA",
            "AEA"
        ], {
            A: 'createdelight:flare_panel',
            B: '#forge:glass_panes',
            C: 'createdelight:quantum_field_panel',
            D: '#create:seats',
            E: 'ad_astra:calorite_engine'
        }
    ).id("createdelight:mechanical_crafting/flare_cabin")
    //面板合成
    create.mechanical_crafting(
        'createdelight:basic_crystal_panel',
        [
            "AAA",
            "ABA",
            "ACA",
            "AAA"
        ], {
            A: "ad_astra:steel_plate",
            B: "immersive_aircraft:gyroscope",
            C: "minecraft:nether_star"
        }
    ).id("createdelight:mechanical_crafting/basic_crystal_panel")
    create.mechanical_crafting(
        'createdelight:advanced_crystal_panel',
        [
            "AAA",
            "ABA",
            "ACA",
            "AAA"
        ], {
            A: 'ad_astra:desh_plate',
            B: "immersive_aircraft:gyroscope",
            C: 'iceandfire:cyclops_eye'
        }
    ).id("createdelight:mechanical_crafting/advanced_crystal_panel")
    create.mechanical_crafting(
        'createdelight:holographic_interface_panel',
        [
            " A ",
            "BBB",
            "CDC"
        ], {
            A: "minecraft:light_blue_stained_glass_pane",
            B: 'createutilities:polished_amethyst',
            C: "ad_astra:ostrum_plate",
            D: 'ae2:calculation_processor'
        }
    ).id("createdelight:mechanical_crafting/holographic_interface_panel")
    create.mechanical_crafting(
        'createdelight:quantum_field_panel',
        [
            "  A  ",
            "BBCBB",
            "BDEFB",
            "BBBBB"
        ], {
            A: 'ae2:quantum_entangled_singularity',
            B: 'ad_astra:calorite_plate',
            C: "ae2:quantum_link",
            D: 'ae2:calculation_processor',
            E: 'ae2:logic_processor',
            F: 'ae2:engineering_processor'
        }
    ).id("createdelight:mechanical_crafting/quantum_field_panel")
    //火箭合成
    create.mechanical_crafting(
        'ad_astra:tier_1_rocket',
        [
            " A ",
            "BCB",
            "D D"
        ], {
            A: 'ad_astra:rocket_nose_cone',
            B: 'ad_astra:steel_tank',
            C: 'createdelight:basic_cabin',
            D: 'ad_astra:steel_engine'
        }
    ).id("createdelight:mechanical_crafting/tier_1_rocket")
    create.mechanical_crafting(
        'ad_astra:tier_2_rocket',
        [
            "  A  ",
            " BCB ",
            " DED ",
            "FG GF"
        ], {
            A: 'ad_astra:rocket_nose_cone',
            B: 'ad_astra:steel_plate',
            C: 'createdelight:advanced_panel',
            D: 'ad_astra:desh_tank',
            E: 'createdelight:advanced_cabin',
            F: 'ad_astra:rocket_fin',
            G: 'ad_astra:desh_engine'
        }
    ).id("createdelight:mechanical_crafting/tier_2_rocket")
    create.mechanical_crafting(
        'ad_astra:tier_3_rocket',
        [
            "  A  ",
            " BCB ",
            " CEC ",
            "FDDDF",
            "FGGGF"
        ], {
            A: 'ad_astra:rocket_nose_cone',
            B: 'ad_astra:steel_plate',
            C: 'createdelight:explorer_panel',
            D: 'ad_astra:ostrum_tank',
            E: 'createdelight:explorer_cabin',
            F: 'ad_astra:rocket_fin',
            G: 'ad_astra:ostrum_engine'
        }
    ).id("createdelight:mechanical_crafting/tier_3_rocket")
    create.mechanical_crafting(
        'ad_astra:tier_4_rocket',
        [
            "  A  ",
            " BCB ",
            " CEC ",
            " CDC ",
            "FDGDF",
            "DG GD",
            "G   G"
        ], {
            A: 'ad_astra:rocket_nose_cone',
            B: 'ad_astra:steel_plate',
            C: 'createdelight:flare_panel',
            D: 'ad_astra:calorite_tank',
            E: 'createdelight:flare_cabin',
            F: 'ad_astra:rocket_fin',
            G: 'ad_astra:calorite_engine'
        }
    ).id("createdelight:mechanical_crafting/tier_4_rocket")
})
