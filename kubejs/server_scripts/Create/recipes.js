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
        "create:splashing/iceandfire/crushed_raw_silver"
    ])
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
    // 动力锯切割：平滑玫瑰石英
    e.recipes.create.cutting(
        ["create:polished_rose_quartz", Item.of("create:polished_rose_quartz").withChance(0.1)],
        "create:rose_quartz"
    ).id("create.kjs:polished_rose_quartz")
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
    e.recipes.createaddition.charging("create:electron_tube", "createdelight:bleak_electron_tube", 10000, 40000)
        .id("create:charging/bleak_electron_tube")
    e.recipes.create_new_age.energising("create:electron_tube", "createdelight:bleak_electron_tube", 10000)
        .id("create:energising/bleak_electron_tube")
    e.recipes.vintageimprovements.turning("6x create:chute", "createbigcannons:cast_iron_block")
        .id("create:crafting/kinetics/chute_2")
    e.recipes.vintageimprovements.turning("3x create:item_vault", "createbigcannons:cast_iron_block")
        .id("create:crafting/kinetics/item_vault_2")
    e.recipes.vintageimprovements.turning("3x create:fluid_tank", "minecraft:copper_block")
        .id("create:crafting/kinetics/fluid_tank_2")
    //坚固板的另一个配方
    e.recipes.vintageimprovements.hammering("create:sturdy_sheet", "createmetallurgy:steel_ingot")
        .id("vintageimprovements:hammering/sturdy_sheet")
    //deco和create的工业铁块互切
    e.recipes.minecraft.stonecutting("design_decor:industrial_plating_block", "create:industrial_iron_block")
        .id("industrial_plating_block_from_industrial_iron_block")
    e.recipes.minecraft.stonecutting("create:industrial_iron_block", "design_decor:industrial_plating_block")
        .id("industrial_iron_block_from_industrial_plating_block")
})
