ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "create_connected:item_application/freezing_catalyst_from_empty",
        "create_connected:item_application/sanding_catalyst_from_empty",
        "create_connected:item_application/seething_catalyst_from_empty",
        "create_connected:crafting/kinetics/empty_fan_catalyst_from_freezing",
        "create_connected:crafting/kinetics/empty_fan_catalyst_from_sanding",
        "create_connected:crafting/kinetics/empty_fan_catalyst_from_seething",
        "quark:tweaks/crafting/utility/bent/paper",
        "create:pressing/sugar_cane",
        "create:splashing/iceandfire/crushed_raw_silver",
        "create:mixing/brass_ingot",
        "create:filling/compat/neapolitan/milk_bottle",
        "create:crafting/kinetics/empty_blaze_burner",
        "create:crafting/schematics/schematicannon",
        "create:crafting/logistics/andesite_tunnel",
        "create:crafting/logistics/andesite_funnel",
        "create:crafting/logistics/packager",
        "create:crafting/kinetics/mechanical_harvester",
        "minecraft:chain",
        "create:crafting/appliances/chain_from_zinc",
        "create:crafting/logistics/package_frogport",
        "create:crafting/materials/transmitter",
        "create:crafting/logistics/stock_link",
        "create:sequenced_assembly/precision_mechanism",
        "create_new_age:cutting/copper_wire",
        "/^create:crushing\/raw_[A-Za-z0-9]+$/",
        "create:compacting/blaze_cake",
        "createutilities:sandpaper_polishing/polished_amethyst",
        "create_new_age:mixing/thorium",
        "createaddition:crafting/large_connector_electrum"
    ])
    remove_recipes_output(e, [
        "create:pulp",
        "create:spout",
        "create:portable_fluid_interface",
        "create:portable_storage_interface",
        "createaddition:portable_energy_interface",
        "create:mechanical_arm",
        "create:steam_engine",
        "create:steam_whistle",
        "create:weighted_ejector"
    ])
    e.recipes.create.milling(
        [
            'createdelight:carbon_dust'
        ],
        'createmetallurgy:graphite',
    ).id("createdelight:milling/carbon_dust")
    e.recipes.vintageimprovements.pressurizing(
        "createdelight:carbon_plate",
        [
            "createdelight:carbon_dust"
        ], 200
    )
        .heated()
        .id("createdelight:pressurizing/carbon_plate")
    e.shaped("create:stock_link",
        [
            "A",
            "B",
            "C"
        ], {
            A: "create:transmitter",
            B: "create:item_vault",
            C: "create:brass_casing",
        }
    )
    .id("createdelight:crafting/logistics/stock_link")
    e.shaped("create:transmitter",
        [
            "A",
            "B",
            "C"
        ], {
            A: "minecraft:lightning_rod",
            B: "createaddition:copper_spool",
            C: "minecraft:redstone",
        }
    )
    .id("createdelight:crafting/materials/transmitter")
    e.shaped("create:package_frogport",
        [
            "A",
            "B",
            "C"
        ], {
            A: "iceandfire:chain_sticky",
            B: "create:item_vault",
            C: "create:andesite_casing",
        }
    )
    .id("createdelight:crafting/logistics/package_frogport")
    e.shaped("minecraft:chain",
        [
            "B",
            "A",
            "B"
        ], {
            A: "createaddition:iron_rod",
            B: "minecraft:iron_nugget"
        }
    )
    .id("minecraft:chain")
    e.shaped("minecraft:chain",
        [
            "B",
            "A",
            "B"
        ], {
            A: "vintageimprovements:zinc_rod",
            B: "create:zinc_nugget"
        }
    )
    .id("createdelight:crafting/appliances/chain_from_zinc")
    e.shaped("create:mechanical_harvester",
        [
            "ABA",
            "ABA",
            " C "
        ], {
            A: "create:iron_sheet",
            B: "createaddition:iron_rod",
            C: "create:andesite_casing",
        }
    )
    .id("createdelight:crafting/kinetics/mechanical_harvester")
    e.shaped("create:packager",
        [
            " A ",
            "ABA",
            "CAC",
        ], {
            A: "create:iron_sheet",
            B: "create:cardboard_block",
            C: "minecraft:redstone",
        }
    ).id("createdelight:crafting/logistics/packager")
    e.shaped("create:andesite_tunnel",
        [
            "AA",
            "BB"
        ], {
            A: "createdeco:andesite_sheet",
            B: "minecraft:dried_kelp",
        }
    ).id("createdelight:crafting/logistics/andesite_tunnel")
    e.shaped("create:andesite_funnel",
        [
            "A",
            "B"
        ], {
            A: "createdeco:andesite_sheet",
            B: "minecraft:dried_kelp",
        }
    ).id("createdelight:crafting/logistics/andesite_funnel")
    // 闪长岩合成配方优化
    e.recipes.create.mixing(
        'minecraft:diorite',
        [
            '#forge:cobblestone/normal',
            'minecraft:quartz'
        ]
    ).id("createdelight:mixing/diorite")
    // 方解石压块塑形配方
    e.recipes.create.compacting(
        'minecraft:calcite',
        [
            'minecraft:flint', 
            'minecraft:bone_block', 
            Fluid.of('minecraft:lava', 100)
        ]
    ).id("createdelight:compacting/calcite")
    // 早期 纸板低效率合成配方
    e.recipes.create.compacting(
        'create:cardboard',
        [
            '3x minecraft:paper',
        ]
    ).id("createdelight:compacting/cardboard")
    // 新增配方：粗锌块烧成锌块
    e.recipes.minecraft.blasting("create:zinc_block", "create:raw_zinc_block")
    e.recipes.minecraft.smelting("create:zinc_block", "create:raw_zinc_block")
    // 黄铜机械手
    e.replaceInput({ id: "create:crafting/kinetics/deployer" }, "create:electron_tube", "#forge:spring/between_500_2_1000")
    // 新增配方：玫瑰石英
    e.shapeless("create:rose_quartz", [
        "4x redstone",
        "quartz"
    ])
    // 玫瑰石英
    e.recipes.create.sandpaper_polishing(
        'create:polished_rose_quartz',
        'create:rose_quartz'
    ).id("createdelight:sandpaper_polishing/rose_quartz")
    // 动力锯切割：平滑玫瑰石英
    e.recipes.create.cutting(
        "create:polished_rose_quartz",
        "create:rose_quartz"
    ).id("createdelight:cutting/polished_rose_quartz")
    // 解决玫瑰石英配方冲突
    e.remove({ type: 'minecraft:stonecutting', output: 'create:rose_quartz_block', input: 'create:rose_quartz' })
    e.remove({ type: 'minecraft:stonecutting', output: 'create:rose_quartz_tiles', input: 'create:polished_rose_quartz' })
    e.remove({ type: 'minecraft:stonecutting', output: 'create:small_rose_quartz_tiles', input: 'create:polished_rose_quartz' })
    // 玫瑰石英块/砖
    e.shaped('8x create:rose_quartz_block', [
        'AA',
        'AA'
    ], {
        A: 'create:rose_quartz'
    }).id('createdelight:crafting/rose_quartz_block')
    
    e.shaped('8x create:rose_quartz_tiles', [
        'AA',
        'AA'
    ], {
        A: 'create:polished_rose_quartz'
    }).id('createdelight:crafting/rose_quartz_tiles')
    // 动力锯切割：磨制紫水晶
    e.recipes.create.cutting(
        'createutilities:polished_amethyst',
        'minecraft:amethyst_shard'
    ).id("createdelight:cutting/polished_amethyst")
    e.recipes.kubejs.shapeless(
        "create:weighted_ejector",
        [
            "#forge:spring/between_500_2_1000",
            "create:depot",
            "create:cogwheel"
        ]
    ).id("createdelight:crafting/kinetics/weighted_ejector")
    e.recipes.kubejs.shapeless(
        "3x create:portable_storage_interface",
        [
            "#forge:spring/below_500",
            "create:andesite_casing",
            "create:chute"
        ]
    ).id("createdelight:crafting/kinetics/portable_storage_interface")
    e.recipes.kubejs.shapeless(
        "create:portable_fluid_interface",
        [
            "#forge:spring/below_500",
            "create:copper_casing",
            "create:chute"
        ]
    ).id("createdelight:crafting/kinetics/portable_fluid_interface")
    e.recipes.kubejs.shaped(
        "create:spout", [
        "ABA",
        " C "
    ], {
        A: "create:copper_sheet",
        B: "create:copper_casing",
        C: "minecraft:dried_kelp"
    }
    ).id("createdelight:crafting/kinetics/spout")

    e.recipes.kubejs.shaped( "create:schematicannon",
    [
        "D D",
        "CAC",
        "BBB"
    ], {
        A: "minecraft:dispenser",
        B: "minecraft:smooth_stone",
        C: "#minecraft:logs",
        D: "create:iron_sheet"
    }
    ).id("createdelight:crafting/schematics/schematicannon")
    e.recipes.kubejs.shaped(
        "2x create:steam_engine", [
        " A ",
        " B ",
        " C "
    ], {
        A: "create:shaft",
        B: "#forge:spring/between_500_2_1000",
        C: "minecraft:copper_block"
    }
    ).id("createdelight:crafting/kinetics/steam_engine")
    e.recipes.kubejs.shaped(
        "create:steam_whistle", [
        " A ",
        " B ",
        " C "
    ], {
        A: "create:golden_sheet",
        B: "#forge:spring/below_500",
        C: "minecraft:copper_ingot"
    }
    ).id("createdelight:crafting/kinetics/steam_whistle")
    e.recipes.kubejs.shaped(
        "create:mechanical_arm", [
        "AAB",
        "AC ",
        "DE "
    ], {
        A: "create:brass_sheet",
        B: "create:andesite_alloy",
        C: "#forge:spring/between_500_2_1000",
        D: "create:precision_mechanism",
        E: "create:brass_casing"
    }
    ).id("createdelight:crafting/kinetics/mechanical_arm")

    e.recipes.create.mixing("2x create:brass_nugget", ["#forge:nuggets/copper", "#forge:nuggets/zinc"], 400)
        .heated().id("createdelight:mixing/brass_nugget")

    let iner = "create:incomplete_precision_mechanism"
    e.recipes.create.sequenced_assembly("create:precision_mechanism", "create:golden_sheet", [
        e.recipes.create.deploying(iner, [iner, "create:cogwheel"]),
        e.recipes.create.deploying(iner, [iner, "create:large_cogwheel"]),
        e.recipes.create.deploying(iner, [iner, "#forge:spring/between_500_2_1000"])
    ])
        .transitionalItem(iner)
        .loops(3)
        .id("createdelight:sequenced_assembly/precision_mechanism")

    let iner_2 = "createdelight:incomplete_electron_tube"
    e.recipes.create.sequenced_assembly("2x create:electron_tube", "create:iron_sheet", [
        e.recipes.create.deploying(iner_2, [iner_2, "#forge:wires/electric"]),
        e.recipes.create.filling(iner_2, [iner_2, Fluid.of("createmetallurgy:molten_tin", 10)]),
        e.recipes.create.deploying(iner_2, [iner_2, "create:polished_rose_quartz"]),
        e.recipes.create.cutting(iner_2, iner_2)
    ])
        .transitionalItem(iner_2)
        .loops(1)
        .id("createdelight:crafting/materials/electron_tube")
    {
        let iner = "createdelight:incomplete_electron_tube"
        e.recipes.create.sequenced_assembly(["create:electron_tube", "create:iron_sheet"], "create:iron_sheet", [
            e.recipes.create.deploying(iner, [iner, "create:polished_rose_quartz"])
        ])
            .transitionalItem(iner_2)
            .loops(1)
            .id("createdelight:crafting/materials/electron_tube_2")
    }
    e.recipes.create_new_age.energising("create:electron_tube", "createdelight:bleak_electron_tube", 10000)
        .id("createdelight:energising/bleak_electron_tube")
    e.recipes.vintageimprovements.turning("8x create:chute", "#forge:storage_blocks/iron")
        .id("createdelight:crafting/kinetics/chute_2")
    e.recipes.vintageimprovements.turning("3x create:item_vault", "#forge:storage_blocks/iron")
        .id("createdelight:crafting/kinetics/item_vault_2")
    e.recipes.vintageimprovements.turning("3x create:fluid_tank", "minecraft:copper_block")
        .id("createdelight:crafting/kinetics/fluid_tank_2")
    e.recipes.vintageimprovements.curving("create:fluid_pipe", "create:copper_sheet", 4)
        .id("createdelight:crafting/kinetics/fluid_pipe_2")

    //青铜制作铜相关物品
    e.recipes.kubejs.shaped("12x create:fluid_pipe", [
        [
            "#forge:plates/bronze",
            "#forge:ingots/bronze",
            "#forge:plates/bronze"]
    ])
        .id("createdelight:crafting/kinetics/fluid_pipe_from_bronze")
    e.recipes.kubejs.shaped("12x create:fluid_pipe", [
        ["#forge:plates/bronze"],
        ["#forge:ingots/bronze"],
        ["#forge:plates/bronze"]
    ])
        .id("createdelight:crafting/kinetics/fluid_pipe_from_bronze_vertical")
    e.recipes.kubejs.shaped("3x create_connected:fluid_vessel", [
        [
            "#forge:plates/bronze",
            "minecraft:barrel",
            "#forge:plates/bronze"
        ]
    ])
        .id("createdelight:crafting/kinetics/fluid_vessel_from_bronze")
    e.recipes.kubejs.shaped("3x create:fluid_tank", [
        ["#forge:plates/bronze"],
        ["minecraft:barrel"],
        ["#forge:plates/bronze"]
    ])
        .id("createdelight:crafting/kinetics/fluid_tank_from_bronze")
    e.recipes.vintageimprovements.turning("9x create:fluid_tank", "#forge:storage_blocks/bronze")
        .id("createdelight:crafting/kinetics/fluid_tank_from_bronze_2")
    e.recipes.vintageimprovements.curving("3x create:fluid_pipe", "#forge:plates/bronze", 4)
        .id("createdelight:crafting/kinetics/fluid_pipe_from_bronze_2")

    //钨制作铁相关物品
    e.recipes.kubejs.shaped("12x create:chute", [
        [
            ["#forge:plates/tungsten"],
            ["#forge:ingots/tungsten"],
            ["#forge:plates/tungsten"]
        ]
    ])
        .id("createdelight:crafting/kinetics/chute_from_tungsten")
    e.recipes.kubejs.shaped("3x create_connected:item_silo", [
        [
            "#forge:plates/tungsten",
            "minecraft:barrel",
            "#forge:plates/tungsten"
        ]
    ])
        .id("createdelight:crafting/kinetics/item_silo_from_tungsten")
    e.recipes.kubejs.shaped("3x create:item_vault", [
        ["#forge:plates/tungsten"],
        ["minecraft:barrel"],
        ["#forge:plates/tungsten"]
    ])
        .id("createdelight:crafting/kinetics/fluid_tank_from_tungsten")
    e.recipes.vintageimprovements.turning("9x create:item_vault", "#forge:storage_blocks/tungsten")
        .id("createdelight:crafting/kinetics/item_vault_from_tungsten_2")

    //坚固板的另一个配方
    e.recipes.vintageimprovements.hammering("create:sturdy_sheet", "#forge:ingots/steel")
        .id("createdelight:hammering/sturdy_sheet_from_steel")
    e.recipes.vintageimprovements.hammering("create:sturdy_sheet", "#forge:ingots/tungsten")
        .id("createdelight:hammering/sturdy_sheet_from_tungsten")
    e.recipes.createmetallurgy.casting_in_basin(
        "create:railway_casing",
        ["create:brass_casing", Fluid.of("createmetallurgy:molten_steel", 90)], 70, true)
        .id("createdelight:casting_in_basin/railway_casing")

    e.recipes.createmetallurgy.casting_in_basin(
        "create:andesite_casing",
        ["#forge:stripped_logs", Fluid.of("createdelightcore:molten_andesite", 90)], 70, true)
        .id("createdelight:casting_in_basin/andesite_casing")
    // 墨囊配方
    let iner_3 = "ratatouille:sausage_casing"
    e.recipes.create.sequenced_assembly('minecraft:ink_sac', 'ratatouille:sausage_casing',
        [
            e.recipes.create.filling(iner_3, [iner_3, Fluid.of("create_enchantment_industry:ink", 500)]),
            e.recipes.create.deploying(iner_3, [iner_3, "#forge:slimeballs"]),
        ]
    )
        .transitionalItem(iner_3)
        .loops(1)
        .id("createdelight:sequenced_assembly/milk_sac")
    // TNT
    let iner_4 = "minecraft:sand"
    e.recipes.create.sequenced_assembly('minecraft:tnt', "#forge:sand",
        [
            e.recipes.create.filling(iner_4, [iner_4, Fluid.of("supplementaries:lumisene", 100)]),
        ]
    )
        .transitionalItem(iner_4)
        .loops(4)
        .id("createdelight:sequenced_assembly/tnt")
    // tinyTNT
    let iner_5 = "ae2:certus_quartz_dust"
    e.recipes.create.sequenced_assembly('ae2:tiny_tnt', "ae2:certus_quartz_dust",
        [
            e.recipes.create.filling(iner_5, [iner_5, Fluid.of("supplementaries:lumisene", 100)]),
        ]
    )
        .transitionalItem(iner_5)
        .loops(2)
        .id("createdelight:sequenced_assembly/tiny_tnt")

    e.recipes.kubejs.shaped("create:empty_blaze_burner", [
        " A ",
        "ABA",
        " A "
    ], {
        A: "createaddition:iron_rod",
        B: "minecraft:netherrack"
    }).id("createdelight:empty_blaze_burner_from_iron_rods")
    
    e.recipes.minecraft.stonecutting("6x create:industrial_iron_block", "createmetallurgy:steel_ingot")
        .id("createdelight:industrial_iron_block_from_steel_ingot")
    e.recipes.minecraft.stonecutting("6x create:industrial_iron_block", "createmetallurgy:steel_ingot")
        .id("createdelight:weathered_iron_block_from_steel_ingot")
    // 甜甜圈
    e.recipes.create.filling(
        "create:sweet_roll",
        [
            "create_deepfried:donut",
            FluidIngredients("forge:milk", 250)
        ]
    ).id("createdelight:filling/sweet_roll")
    e.recipes.create.filling(
        "3x create:sweet_roll",
        [
            "alexscaves:gingerbread_crumbs",
            FluidIngredients("forge:milk", 250)
        ]
    ).id("createdelight_oppenheimered:filling/gingerbread_sweet_roll")
    // 移动燃料接口
    // e.recipes.kubejs.shapeless(
    //     'railways:portable_fuel_interface',
    //     [
    //         "#forge:spring/between_500_2_1000",
    //         "create:railway_casing",
    //         "create:chute"
    //     ]
    // ).id("railways:crafting/portable_fuel_interface")
    // 精密构件
    e.recipes.create.deploying(
        "2x create:precision_mechanism",
        [
            "create:brass_sheet",
            "alexscaves:telecore"
        ]
    ).id("createdelight_oppenheimered:deploying/precision_mechanism_from_telecore")
    e.recipes.kubejs.shaped("create:blaze_burner", [
        "AAA",
        "BCB",
        "BDB"
    ], {
        A: "minecraft:blaze_powder",
        B: "minecraft:blaze_rod",
        C: "create:empty_blaze_burner",
        D: "#mynethersdelight:bullet_pepper"
    }).id("createdelight:shaped/blaze_burner")
    // 铁活板门可熔融回收铁
    e.recipes.createmetallurgy.melting(Fluid.of("createmetallurgy:molten_iron", 360), "minecraft:iron_trapdoor")
        .heatRequirement("heated").processingTime(180)
    let andesiteOutputList = [
        '5x create:andesite_funnel',
        '5x create:andesite_tunnel',
        '5x create:depot',
        '3x create:mechanical_plough',
        '3x create:mechanical_harvester',
        '5x create:portable_storage_interface',
        '2x create:mechanical_mixer', 
        '2x create:mechanical_press', 
        '2x create:mechanical_saw', 
        '2x create:mechanical_drill', 
        '2x create:encased_fan',
        '2x createaddition:rolling_mill',
        '2x vintageimprovements:spring_coiling_machine', 
        '2x vintageimprovements:vibrating_table', 
        '2x vintageimprovements:centrifuge',
        '2x vintageimprovements:curving_press',
        '8x create:gearbox',
    ].forEach(res => {
        e.recipes.vintageimprovements.pressurizing([
            res,
            'art_of_forging:nano_insectoid'],
            [
                Fluid.of("createdelightcore:molten_andesite", 450),
                "create_sa:heat_engine",
                "art_of_forging:nano_insectoid",
                Item.of(res, 1)
            ].concat(multi_item("createdieselgenerators:wood_chip", 9))
        )
            .secondaryFluidInput(0)
            .id(`createdelight:pressurizing/${res.split(":")[1]}_from_nano_insectoid`)
    })
    let brassOutputList = [
        '5x create:brass_tunnel', 
        '2x create:mechanical_crafter', 
        '2x create:rotation_speed_controller', 
        '2x create:mechanical_arm', 
        '5x create:brass_funnel',
        '2x create:deployer',
        '2x fluid:pipette',
        '3x create_fantasizing:transporter',
        '3x fluid:smart_fluid_interface',
        '5x createaddition:portable_energy_interface',
        '2x create_bic_bit:mechanical_fryer'
    ].forEach(res => {
        e.recipes.vintageimprovements.pressurizing([
            res,
            'art_of_forging:nano_insectoid'],
            [
                Fluid.of("createmetallurgy:molten_brass", 450),
                "create_sa:steam_engine",
                "art_of_forging:nano_insectoid",
                Item.of(res, 1)
            ].concat(multi_item("createdieselgenerators:wood_chip", 9))
        )
            .secondaryFluidInput(0)
            .id(`createdelight:pressurizing/${res.split(":")[1]}_from_nano_insectoid`)
    })
    let copperOutputList = [
        '3x create:item_drain', 
        '3x create:spout', 
        '3x create:portable_fluid_interface',
        '2x fluid:centrifugal_pump', 
        '3x fluid:copper_tap', 
        '3x fluid:fluid_interface'
    ].forEach(res => {
        e.recipes.vintageimprovements.pressurizing([
            res,
            'art_of_forging:nano_insectoid'],
            [
                Fluid.of("createmetallurgy:molten_copper", 450),
                "create_sa:hydraulic_engine",
                "art_of_forging:nano_insectoid",
                Item.of(res, 1)
            ].concat(multi_item("createdieselgenerators:wood_chip", 9))
        )
            .secondaryFluidInput(0)
            .id(`createdelight:pressurizing/${res.split(":")[1]}_from_nano_insectoid`)
    })
    e.recipes.create.mixing(
        "create:pulp", 
        Fluid.of("createdelight:paper_pulp", 50))
        .heated()
        .id("createdelight:mixing/pulp")
    let stone_milling = [
        ['minecraft:cobbled_deepslate', 'minecraft:deepslate'],
        ['minecraft:cobblestone', 'minecraft:stone'],
    ]
    stone_milling.forEach(stone => {
        e.recipes.create.milling(
            stone[0],
            stone[1]
        ).id(`createdelight:milling/${stone[1].split(":")[1]}_to_${stone[0].split(":")[1]}`)
    })
    e.recipes.create.cutting(
        "2x ratatouille:sausage_casing",
        "minecraft:slime_ball"
    ).id("createdelight:cutting/sausage")

    // 海绵压块塑形配方
    e.recipes.create.compacting(
        '2x minecraft:sponge',
        [
            'minecraft:sponge',
            '4x alexscaves:ping_pong_sponge',
            Fluid.of("minecraft:water",50),
        ]
    )
    .heated()
    .id("createdelight:compacting/sponge")
})
