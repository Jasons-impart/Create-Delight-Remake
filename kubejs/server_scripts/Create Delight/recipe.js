ServerEvents.recipes(e => {
    const {vintageimprovements, kubejs, create, createmetallurgy} = e.recipes

    kubejs.shaped("createdelight:copper_coil", [
        "ABA",
        "BCB",
        "ABA"
    ],
    {
        A: "createaddition:copper_wire",
        B: "create:copper_sheet",
        C: "createdelightcore:steel_casing"
    })
    .id("createdelight:copper_coil")

    {
        let iner = "createdelightcore:steel_casing"
        create.sequenced_assembly("createdelight:copper_coil", iner, [
            create.deploying(iner, [iner, "createaddition:copper_wire"]),
            create.deploying(iner, [iner, "create:copper_sheet"])
        ])
            .loops(2)
            .transitionalItem(iner)
            .id("createdelight:sequenced_assembly/copper_coil_casing")
    }

    //深层锡矿石因未知原因没有粉碎轮配方，补充粉碎配方
    create.crushing(["create:crushed_raw_tin",
        Item.of("create:crushed_raw_tin").withChance(0.75),
        Item.of("create:experience_nugget").withChance(0.75)
    ],
        "createdelightcore:deepslate_tin_ore")
        .id("createdelight:crushing/crushed_deepslate_tin_ore")
        
    kubejs.shapeless("createdelightcore:phantom_compost", [
        "2x vintagedelight:organic_mash",
        "northstar:moon_sand",
        "northstar:raw_glowstone_ore",
        ["northstar:raw_glowstone_ore", "farmersdelight:straw"],
        "4x minecraft:bone_meal"
    ])
    .id("createdelightcore:phantom_compost_from_organic_mash")
    kubejs.shapeless("createdelightcore:phantom_compost", [
        "northstar:moon_sand",
        "2x minecraft:rotten_flesh",
        "2x northstar:raw_glowstone_ore",
        "4x minecraft:bone_meal"
    ])
    .id("createdelightcore:phantom_compost")
    fermenting(e, "createdelightcore:luna_soil", [
        "createdelightcore:phantom_compost", 
        "northstar:enriched_glowstone_ore", 
        Fluid.of("netherexp:ectoplasm", 100)], 600)
    kubejs.shaped("createdelight:quality_absorber", [
        "ABA",
        "ACA",
        "AAA"
    ], {
        A: "#forge:plates/bronze",
        B: "lightmanscurrency:trading_core",
        C: "create:rose_quartz"
    })
    .id("createdelight:quality_absorber")

    kubejs.shaped("createdelight:quality_harvest_calibrator_tier_1", [
        "ABA",
        "CDC",
        "AEA"
    ], {
        A: "create:brass_sheet",
        B: "eclipticseasons:growth_detector",
        C: "#createdelightcore:life_matter",
        D: "createdelight:quality_absorber",
        E: "create:precision_mechanism"
    })
    .id("createdelight:quality_harvest_calibrator_tier_1")

    {
        let iner = "createdelight:quality_harvest_calibrator_tier_1"
        create.sequenced_assembly("createdelight:quality_harvest_calibrator_tier_2", iner, [
            create.deploying(iner, [iner, "create:precision_mechanism"]),
            create.deploying(iner, [iner, "createdelight:normal_genetic_seed"]),
            create.filling(iner, [iner, Fluid.of("netherexp:ectoplasm", 250)]),
            create.deploying(iner, [iner, "#createdelightcore:life_matter"]),
            create.pressing(iner, iner)
        ])
        .transitionalItem(iner)
        .loops(2)
        .id("createdelight:sequenced_assembly/quality_harvest_calibrator_tier_2")
    }

    create.mechanical_crafting("createdelight:quality_harvest_calibrator_tier_3", [
        " A A ",
        "BCDCB",
        " EFE ",
        "BCGCB",
        " A A "
    ], {
        A: "create_new_age:overcharged_diamond",
        B: "#createdelightcore:life_matter",
        C: "createdelight:pure_genetic_seed",
        D: "create:experience_block",
        E: "create:precision_mechanism",
        F: "createdelight:quality_harvest_calibrator_tier_2",
        G: "createdelight:flawless_genetic_seed"
    })
    .id("createdelight:mechanical_crafting/quality_harvest_calibrator_tier_3")

    kubejs.shaped("createdelightcore:quality_harvest_controller", [
        "ABA",
        "CDC",
        "AEA"
    ], {
        A: "create:brass_sheet",
        B: "create:mechanical_harvester",
        C: "#createdelightcore:life_matter",
        D: "create:precision_mechanism",
        E: "create:brass_casing"
    })
    .id("createdelight:quality_harvest_controller")

    kubejs.shaped("createdelightcore:life_matter_injector", [
        "ABA",
        "CDC",
        "AEA"
    ], {
        A: "create:brass_sheet",
        B: "create:portable_storage_interface",
        C: "create:smart_chute",
        D: "create:precision_mechanism",
        E: "create:brass_casing"
    })
    .id("createdelight:life_matter_injector")

    cutting(e, "createdelightcore:fire_lily_cluster", "4x iceandfire:fire_lily")
    cutting(e, "createdelightcore:frost_lily_cluster", "4x iceandfire:frost_lily")
    cutting(e, "createdelightcore:lightning_lily_cluster", "4x iceandfire:lightning_lily")

    vintageimprovements.pressurizing(Fluid.of("createdelight:cryo_fuel", 100), [Fluid.of("northstar:hydrogen", 250), Fluid.of("netherexp:ectoplasm", 250)])
    .secondaryFluidInput(0)
    .id("createdelight:pressurizing/cryo_fuel")

    createmetallurgy.alloying(Fluid.of("createdelightcore:molten_forged_steel", 360),
        [
            Fluid.of("createmetallurgy:molten_netherite", 30),
            Fluid.of("createdelight:spent_liquor", 250),
            "4x tetra:metal_scrap"
        ])
        .heatRequirement("superheated")
        .id("createdelight:alloying/forged_steel")
    
     metal_production_line_3(e, [
        "createdelightcore:forged_steel_block",
        "createdelight:forged_steel_ingot",
        "createdelight:forged_steel_sheet",
        "createdelightcore:molten_forged_steel"
    ], "superheated", 80)

    kubejs.shaped("createdelightcore:forged_steel_block", [
        "AAA",
        "AAA",
        "AAA"
    ], {
        A: "createdelight:forged_steel_ingot"
    })
    .id("createdelight:crafting/forged_steel_ingot_2_forged_steel_block")
    
    kubejs.shapeless("9x createdelight:forged_steel_ingot", "createdelightcore:forged_steel_block")
    .id("createdelight:crafting/forged_steel_block_2_forged_steel_ingot")
    
    create.pressing("createdelight:forged_steel_sheet", "createdelight:forged_steel_ingot")
    .id("createdelight:pressing/forged_steel_sheet")
})
