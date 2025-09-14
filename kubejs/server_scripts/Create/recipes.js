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
        "design_decor:stonecutting/industrial_plating",
        "create:splashing/iceandfire/crushed_raw_silver",
        "create:mixing/brass_ingot",
        "create:filling/compat/neapolitan/milk_bottle",
    ])
    // 闪长岩合成配方优化
    e.recipes.create.mixing(
        'minecraft:diorite',
        [
            '#forge:cobblestone/normal',
            'minecraft:quartz'
        ]
    ).id("create:mixing/diorite")
    // 黑曜石粉末粉碎
    e.recipes.create.milling(
        Item.of("create:powdered_obsidian").withChance(0.3),
        'minecraft:obsidian'
    ).id("create:milling/powdered_obsidian")
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

    e.recipes.minecraft.stonecutting(
        "4x design_decor:cast_iron_boiler",
        "createbigcannons:cast_iron_block"
    ).id("design_decor:stonecutting/cyllinder/cast_iron_cyllinder")
    e.recipes.minecraft.stonecutting(
        "design_decor:cast_iron_boiler_large",
        "createbigcannons:cast_iron_block"
    ).id("design_decor:stonecutting/cyllinder/cast_iron_cyllinder_large")
    // 玫瑰石英
    e.recipes.create.sandpaper_polishing(
        'create:polished_rose_quartz',
        'create:rose_quartz'
    ).id("create:sandpaper_polishing/rose_quartz")
    // 动力锯切割：平滑玫瑰石英
    e.recipes.create.cutting(
        "create:polished_rose_quartz",
        "create:rose_quartz"
    ).id("create:cutting/polished_rose_quartz")
    // 动力锯切割：磨制紫水晶
    e.recipes.create.cutting(
        'createutilities:polished_amethyst',
        'minecraft:amethyst_shard'
    ).id("create:cutting/polished_amethyst")
    e.recipes.kubejs.shapeless(
        "create:weighted_ejector",
        [
            "#forge:spring/between_500_2_1000",
            "create:depot",
            "create:cogwheel"
        ]
    ).id("create:crafting/kinetics/weighted_ejector")
    e.recipes.kubejs.shapeless(
        "3x create:portable_storage_interface",
        [
            "#forge:spring/below_500",
            "create:andesite_casing",
            "create:chute"
        ]
    ).id("create:crafting/kinetics/portable_storage_interface")
    e.recipes.kubejs.shapeless(
        "create:portable_fluid_interface",
        [
            "#forge:spring/below_500",
            "create:copper_casing",
            "create:chute"
        ]
    ).id("create:crafting/kinetics/portable_fluid_interface")
    e.recipes.kubejs.shaped(
        "create:spout", [
        "ABA",
        " C "
    ], {
        A: "#forge:spring/below_500",
        B: "create:copper_casing",
        C: "minecraft:dried_kelp"
    }
    ).id("create:crafting/kinetics/spout")
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
    ).id("create:crafting/kinetics/steam_engine")
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
    ).id("create:crafting/kinetics/steam_whistle")
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
    ).id("create:crafting/kinetics/mechanical_arm")

    e.recipes.create.mixing("2x create:brass_nugget", ["#forge:nuggets/copper", "#forge:nuggets/zinc"], 400)
        .heated().id("create:mixing/brass_nugget")

    let iner = "create:incomplete_precision_mechanism"
    e.recipes.create.sequenced_assembly("create:precision_mechanism", "create:golden_sheet", [
        e.recipes.create.deploying(iner, [iner, "create:cogwheel"]),
        e.recipes.create.deploying(iner, [iner, "create:large_cogwheel"]),
        e.recipes.create.deploying(iner, [iner, "#forge:spring/between_500_2_1000"])
    ])
        .transitionalItem(iner)
        .loops(3)
        .id("create:sequenced_assembly/precision_mechanism")

    let iner_2 = "createdelight:incomplete_electron_tube"
    e.recipes.create.sequenced_assembly("2x create:electron_tube", "create:iron_sheet", [
        e.recipes.create.deploying(iner_2, [iner_2, "#forge:wires/electric"]),
        e.recipes.create.filling(iner_2, [iner_2, Fluid.of("createmetallurgy:molten_tin", 10)]),
        e.recipes.create.deploying(iner_2, [iner_2, "create:polished_rose_quartz"]),
        e.recipes.create.cutting(iner_2, iner_2)
    ])
        .transitionalItem(iner_2)
        .loops(1)
        .id("create:crafting/materials/electron_tube")
    {
        let iner = "createdelight:incomplete_electron_tube"
        e.recipes.create.sequenced_assembly(["create:electron_tube", "create:iron_sheet"], "create:iron_sheet", [
            e.recipes.create.deploying(iner, [iner, "create:polished_rose_quartz"])
        ])
            .transitionalItem(iner_2)
            .loops(1)
            .id("create:crafting/materials/electron_tube_2")
    }
    e.recipes.create_new_age.energising("create:electron_tube", "createdelight:bleak_electron_tube", 10000)
        .id("create:energising/bleak_electron_tube")
    e.recipes.vintageimprovements.turning("8x create:chute", "#forge:storage_blocks/iron")
        .id("create:crafting/kinetics/chute_2")
    e.recipes.vintageimprovements.turning("3x create:item_vault", "#forge:storage_blocks/iron")
        .id("create:crafting/kinetics/item_vault_2")
    e.recipes.vintageimprovements.turning("3x create:fluid_tank", "minecraft:copper_block")
        .id("create:crafting/kinetics/fluid_tank_2")
    e.recipes.vintageimprovements.curving("create:fluid_pipe", "create:copper_sheet", 4)
        .id("create:crafting/kinetics/fluid_pipe_2")

    //青铜制作铜相关物品
    e.recipes.kubejs.shaped("12x create:fluid_pipe", [
        [
            "#forge:plates/bronze",
            "#forge:ingots/bronze",
            "#forge:plates/bronze"]
    ])
        .id("create:crafting/kinetics/fluid_pipe_from_bronze")
    e.recipes.kubejs.shaped("12x create:fluid_pipe", [
        ["#forge:plates/bronze"],
        ["#forge:ingots/bronze"],
        ["#forge:plates/bronze"]
    ])
        .id("create:crafting/kinetics/fluid_pipe_from_bronze_vertical")
    e.recipes.kubejs.shaped("3x create_connected:fluid_vessel", [
        [
            "#forge:plates/bronze",
            "minecraft:barrel",
            "#forge:plates/bronze"
        ]
    ])
        .id("create_connected:crafting/kinetics/fluid_vessel_from_bronze")
    e.recipes.kubejs.shaped("3x create:fluid_tank", [
        ["#forge:plates/bronze"],
        ["minecraft:barrel"],
        ["#forge:plates/bronze"]
    ])
        .id("create:crafting/kinetics/fluid_tank_from_bronze")
    e.recipes.vintageimprovements.turning("9x create:fluid_tank", "#forge:storage_blocks/bronze")
        .id("create:crafting/kinetics/fluid_tank_from_bronze_2")
    e.recipes.vintageimprovements.curving("3x create:fluid_pipe", "#forge:plates/bronze", 4)
        .id("create:crafting/kinetics/fluid_pipe_from_bronze_2")

    //钨制作铁相关物品
    e.recipes.kubejs.shaped("12x create:chute", [
        [
            ["#forge:plates/tungsten"],
            ["#forge:ingots/tungsten"],
            ["#forge:plates/tungsten"]
        ]
    ])
        .id("create:crafting/kinetics/chute_from_tungsten")
    e.recipes.kubejs.shaped("3x create_connected:item_silo", [
        [
            "#forge:plates/tungsten",
            "minecraft:barrel",
            "#forge:plates/tungsten"
        ]
    ])
        .id("create_connected:crafting/kinetics/item_silo_from_tungsten")
    e.recipes.kubejs.shaped("3x create:item_vault", [
        ["#forge:plates/tungsten"],
        ["minecraft:barrel"],
        ["#forge:plates/tungsten"]
    ])
        .id("create:crafting/kinetics/fluid_tank_from_tungsten")
    e.recipes.vintageimprovements.turning("9x create:item_vault", "#forge:storage_blocks/tungsten")
        .id("create:crafting/kinetics/item_vault_from_tungsten_2")

    //坚固板的另一个配方
    e.recipes.vintageimprovements.hammering("create:sturdy_sheet", "#forge:ingots/steel")
        .id("vintageimprovements:hammering/sturdy_sheet_from_steel")
    e.recipes.vintageimprovements.hammering("create:sturdy_sheet", "#forge:ingots/tungsten")
        .id("vintageimprovements:hammering/sturdy_sheet_from_tungsten")
    e.recipes.createmetallurgy.casting_in_basin(
        "create:railway_casing",
        ["create:brass_casing", Fluid.of("createmetallurgy:molten_steel", 90)], 70, true)
        .id("create:casting_in_basin/railway_casing")

    e.recipes.createmetallurgy.casting_in_basin(
        "create:andesite_casing",
        ["#forge:stripped_logs", Fluid.of("createdelightcore:molten_andesite", 90)], 70, true)
        .id("create:casting_in_basin/andesite_casing")
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
        .id("create:sequenced_assembly/milk_sac")
    // TNT
    let iner_4 = "minecraft:sand"
    e.recipes.create.sequenced_assembly('minecraft:tnt', "#forge:sand",
        [
            e.recipes.create.filling(iner_4, [iner_4, Fluid.of("supplementaries:lumisene", 100)]),
        ]
    )
        .transitionalItem(iner_4)
        .loops(4)
        .id("create:sequenced_assembly/tnt")
    // tinyTNT
    let iner_5 = "ae2:certus_quartz_dust"
    e.recipes.create.sequenced_assembly('ae2:tiny_tnt', "ae2:certus_quartz_dust",
        [
            e.recipes.create.filling(iner_5, [iner_5, Fluid.of("supplementaries:lumisene", 100)]),
        ]
    )
        .transitionalItem(iner_5)
        .loops(2)
        .id("create:sequenced_assembly/tiny_tnt")

    e.recipes.kubejs.shaped("2x create:empty_blaze_burner", [
        " A ",
        "ABA",
        " A "
    ], {
        A: "#forge:plates/cast_iron",
        B: "minecraft:netherrack"
    }).id("create:empty_blaze_burner_from_cast_iron")
    //deco和create的工业铁块互切
    e.recipes.minecraft.stonecutting("design_decor:industrial_plating_block", "create:industrial_iron_block")
        .id("industrial_plating_block_from_industrial_iron_block")
    e.recipes.minecraft.stonecutting("create:industrial_iron_block", "design_decor:industrial_plating_block")
        .id("industrial_iron_block_from_industrial_plating_block")
    e.recipes.minecraft.stonecutting("6x create:industrial_iron_block", "createmetallurgy:steel_ingot")
        .id("industrial_iron_block_from_steel_ingot")
    // 甜甜圈
    e.recipes.create.filling(
        "create:sweet_roll",
        [
            "create_deepfried:donut",
            FluidIngredients("forge:milk", 250)
        ]
    ).id("create:filling/sweet_roll")
    e.recipes.create.filling(
        "3x create:sweet_roll",
        [
            "alexscaves:gingerbread_crumbs",
            FluidIngredients("forge:milk", 250)
        ]
    ).id("create_oppenheimered:filling/gingerbread_sweet_roll")
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
    ).id("create_oppenheimered:deploying/precision_mechanism_from_telecore")
    e.recipes.kubejs.shaped("create:blaze_burner", [
        "AAA",
        "BCB",
        "BDB"
    ], {
        A: "minecraft:blaze_powder",
        B: "minecraft:blaze_rod",
        C: "create:empty_blaze_burner",
        D: "#mynethersdelight:bullet_pepper"
    }).id("create:shaped/blaze_burner")
    // 铁活板门可熔融回收铁
    e.recipes.createmetallurgy.melting(Fluid.of("createmetallurgy:molten_iron", 360), "minecraft:iron_trapdoor")
        .heatRequirement("heated").processingTime(180)
    let andesiteOutputList = [
        '4x create:andesite_funnel',
        '4x create:andesite_tunnel',
        '4x create:depot',
        '2x create:mechanical_plough',
        '2x create:mechanical_harvester',
        '4x create:portable_storage_interface',
        'create:mechanical_mixer', 
        'create:mechanical_press', 
        'create:mechanical_saw', 
        'create:mechanical_drill', 
        'create:encased_fan',
        'createaddition:rolling_mill',
        'vintageimprovements:spring_coiling_machine', 
        'vintageimprovements:vibrating_table', 
        'vintageimprovements:centrifuge',
        'vintageimprovements:curving_press',
        '8x create:gearbox'
    ].forEach(res => {
        e.recipes.vintageimprovements.pressurizing([
            res,
            'art_of_forging:nano_insectoid'],
            [
                Fluid.of("createdelightcore:molten_andesite", 450),
                "create_sa:heat_engine",
                "art_of_forging:nano_insectoid"
            ].concat(multi_item("createdieselgenerators:wood_chip", 9))
        )
            .secondaryFluidInput(0)
            .id(`createdelight:pressurizing/${res.split(":")[1]}_from_nano_insectoid`)
    })
    let brassOutputList = [
        '4x create:brass_tunnel', 
        'create:mechanical_crafter', 
        'create:rotation_speed_controller', 
        'create:mechanical_arm', 
        '4x create:brass_funnel',
        'create:deployer'
    ].forEach(res => {
        e.recipes.vintageimprovements.pressurizing([
            res,
            'art_of_forging:nano_insectoid'],
            [
                Fluid.of("createdelightcore:molten_brass", 450),
                "create:precision_mechanism",
                "art_of_forging:nano_insectoid",
                "create:electron_tube"
            ].concat(multi_item("createdieselgenerators:wood_chip", 9))
        )
            .secondaryFluidInput(0)
            .id(`createdelight:pressurizing/${res.split(":")[1]}_from_nano_insectoid`)
    })
    let copperOutputList = [
        '3x create:item_drain', 
        '3x create:spout', 
        '3x create:portable_fluid_interface'
    ].forEach(res => {
        e.recipes.vintageimprovements.pressurizing([
            res,
            'art_of_forging:nano_insectoid'],
            [
                Fluid.of("createdelightcore:molten_copper", 450),
                "create_sa:hydraulic_engine",
                "art_of_forging:nano_insectoid"
            ].concat(multi_item("createdieselgenerators:wood_chip", 9))
        )
            .secondaryFluidInput(0)
            .id(`createdelight:pressurizing/${res.split(":")[1]}_from_nano_insectoid`)
    })
})
