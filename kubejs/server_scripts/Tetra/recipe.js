ServerEvents.recipes(e => {
    //无暇宝石制作
    const {vintageimprovements, kubejs, create, createaddition, createmetallurgy} = e.recipes
    create.sequenced_assembly([Item.of("tetra:pristine_lapis").withChance(0.11), "minecraft:air"], "minecraft:lapis_lazuli", [
        vintageimprovements.laser_cutting("minecraft:lapis_lazuli", "minecraft:lapis_lazuli", 10000, 1000),
        // vintageimprovements.polishing("minecraft:lapis_lazuli", "minecraft:lapis_lazuli")
        createmetallurgy.grinding("minecraft:lapis_lazuli", "minecraft:lapis_lazuli")
    ])
    .loops(1)
    .transitionalItem("minecraft:lapis_lazuli")
    .id("createdelight:sequenced_assembly/pristine_lapis")

    create.sequenced_assembly([Item.of("tetra:pristine_emerald").withChance(0.11), "minecraft:air"], "minecraft:emerald", [
        vintageimprovements.laser_cutting("minecraft:emerald", "minecraft:emerald", 10000, 1000),
        // vintageimprovements.polishing("minecraft:emerald", "minecraft:emerald")
        createmetallurgy.grinding("minecraft:emerald", "minecraft:emerald")

    ])
    .loops(1)
    .transitionalItem("minecraft:emerald")
    .id("createdelight:sequenced_assembly/pristine_emerald")

    create.sequenced_assembly(["tetra:pristine_emerald", "minecraft:air"], "createoreexcavation:raw_emerald", [
        vintageimprovements.laser_cutting("createoreexcavation:raw_emerald", "createoreexcavation:raw_emerald", 10000, 1000),
        // vintageimprovements.polishing("createoreexcavation:raw_emerald", "createoreexcavation:raw_emerald")
        createmetallurgy.grinding("createoreexcavation:raw_emerald", "createoreexcavation:raw_emerald")
    ])
    .loops(1)
    .transitionalItem("createoreexcavation:raw_emerald")
    .id("createdelight:sequenced_assembly/pristine_emerald_2")

    create.sequenced_assembly([Item.of("tetra:pristine_diamond").withChance(0.11), "minecraft:air"], "minecraft:diamond", [
        vintageimprovements.laser_cutting("minecraft:diamond", "minecraft:diamond", 10000, 1000),
        // vintageimprovements.polishing("minecraft:diamond", "minecraft:diamond")
        createmetallurgy.grinding("minecraft:diamond", "minecraft:diamond")
    ])
    .loops(1)
    .transitionalItem("minecraft:diamond")
    .id("createdelight:sequenced_assembly/pristine_diamond")

    create.sequenced_assembly(["tetra:pristine_diamond", "minecraft:air"], "createoreexcavation:raw_diamond", [
        vintageimprovements.laser_cutting("createoreexcavation:raw_diamond", "createoreexcavation:raw_diamond", 10000, 1000),
        // vintageimprovements.polishing("createoreexcavation:raw_diamond", "createoreexcavation:raw_diamond")
        createmetallurgy.grinding("createoreexcavation:raw_diamond", "createoreexcavation:raw_diamond")
    ])
    .loops(1)
    .transitionalItem("createoreexcavation:raw_diamond")
    .id("createdelight:sequenced_assembly/pristine_diamond_2")

    create.sequenced_assembly([Item.of("tetra:pristine_amethyst").withChance(0.11), "minecraft:air"], "minecraft:amethyst_shard", [
        vintageimprovements.laser_cutting("minecraft:amethyst_shard", "minecraft:amethyst_shard", 10000, 1000),
        // vintageimprovements.polishing("minecraft:amethyst_shard", "minecraft:amethyst_shard")
        createmetallurgy.grinding("minecraft:amethyst_shard", "minecraft:amethyst_shard")
    ])
    .loops(1)
    .transitionalItem("minecraft:amethyst_shard")
    .id("createdelight:sequenced_assembly/pristine_amethyst")

    //晶洞制作
    create.sequenced_assembly([Item.of("tetra:geode").withChance(0.011), "minecraft:air"], "minecraft:deepslate", [
        vintageimprovements.laser_cutting("minecraft:deepslate", "minecraft:deepslate", 10000, 1000),
        // vintageimprovements.polishing("minecraft:deepslate", "minecraft:deepslate")
        createmetallurgy.grinding("minecraft:deepslate", "minecraft:deepslate")
    ])
    .loops(1)
    .transitionalItem("minecraft:deepslate")
    .id("createdelight:sequenced_assembly/geode")

    //无暇宝石产普通宝石
    create.cutting(
        ["3x minecraft:diamond",
        Item.of("2x minecraft:diamond").withChance(0.25),
        Item.of("minecraft:diamond").withChance(0.5)],
        "tetra:pristine_diamond")
        .id("createdelight:cutting/pristine_diamond")

    create.cutting(
        ["3x minecraft:emerald",
        Item.of("2x minecraft:emerald").withChance(0.25),
        Item.of("minecraft:emerald").withChance(0.5)],
        "tetra:pristine_emerald")
        .id("createdelight:cutting/pristine_emerald")

    create.cutting(
        ["4x minecraft:amethyst_shard",
        Item.of("3x minecraft:amethyst_shard").withChance(0.25),
        Item.of("2x minecraft:amethyst_shard").withChance(0.5)],
        "tetra:pristine_amethyst")
        .id("createdelight:cutting/pristine_amethyst")
        
    create.cutting(
        ["4x minecraft:lapis_lazuli",
        Item.of("3x minecraft:lapis_lazuli").withChance(0.25),
        Item.of("2x minecraft:lapis_lazuli").withChance(0.5)],
        "tetra:pristine_lapis")
        .id("createdelight:cutting/pristine_lapis")

    // 锻造网属于纯金属加工，不再绑定深渊探索物品
    vintageimprovements.hammering("tetra:forged_mesh", "createdelight:forged_steel_sheet")
    .id("createdelight:hammering/forged_mesh")
    createaddition.rolling("createdelight:forged_steel_ingot", "2x tetra:forged_beam")
    .id("createdelight:rolling/forged_beam")
    create.deploying("2x tetra:forged_bolt", ["tetra:forged_beam", "createdelight:forged_steel_sheet"])
    .id("createdelight:deploying/forged_bolt")
    // 降低原配方过高的回收率，同时保留锻造钢作为金属碎片再生来源
    create.crushing("2x tetra:metal_scrap", "createdelight:forged_steel_ingot")
    .id("createdelight:crushing/metal_scrap_from_forged_steel")

    // 参考 Art of Forging 原数据包，恢复 Tetra 锻造遗迹构成方块的制作途径
    kubejs.shaped("tetra:forged_container", [
        "AAA",
        "A A",
        "AAA"
    ], {
        A: "createdelight:forged_steel_ingot"
    }).id("createdelight:crafting/forged_container")

    kubejs.shaped("3x tetra:forged_pillar", [
        "A",
        "A",
        "A"
    ], {
        A: "createdelight:forged_steel_ingot"
    }).id("createdelight:crafting/forged_pillar")

    kubejs.shaped("2x tetra:forged_platform", [
        "AAA",
        "AAA"
    ], {
        A: "createdelight:forged_steel_ingot"
    }).id("createdelight:crafting/forged_platform")

    kubejs.shaped("3x tetra:forged_platform_slab", [
        "AAA"
    ], {
        A: "tetra:forged_platform"
    }).id("createdelight:crafting/forged_platform_slab")

    kubejs.shaped("4x tetra:forged_wall", [
        "AA",
        "AA"
    ], {
        A: "createdelight:forged_steel_ingot"
    }).id("createdelight:crafting/forged_wall")
})

// 禁用 more_mod_tetra 原版配方
// 原实现为 kubejs/data/more_mod_tetra/recipes/ 下 42 个 forge:false 桩文件（覆盖 mod 同名配方使其永不加载）
ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        // 基础金属锭
        "more_mod_tetra:blaze_ingot",
        "more_mod_tetra:blue_ice_ingot",
        "more_mod_tetra:bokuka_ingot",
        "more_mod_tetra:bone_ingot",
        "more_mod_tetra:dragon_breath_ingot",
        "more_mod_tetra:electro_charged_ingot",
        "more_mod_tetra:rennshi_ingot",
        "more_mod_tetra:rotten_flesh_ingot",
        "more_mod_tetra:tidal_ingot",
        "more_mod_tetra:wither_bone_ingot",
        "more_mod_tetra:wither_ingot",
        // Alex's Caves 兼容
        "more_mod_tetra:alexscaves/abyssal_ocean_ingot",
        // 明日方舟：attainment point
        "more_mod_tetra:arknights/attainment_point/attainment_point_1",
        "more_mod_tetra:arknights/attainment_point/attainment_point_2",
        "more_mod_tetra:arknights/attainment_point/attainment_point_3",
        "more_mod_tetra:arknights/attainment_point/attainment_point_4",
        "more_mod_tetra:arknights/attainment_point/attainment_point_5",
        "more_mod_tetra:arknights/attainment_point/attainment_point_6",
        "more_mod_tetra:arknights/attainment_point/attainment_point_7",
        "more_mod_tetra:arknights/attainment_point/attainment_point_8",
        // 明日方舟：proof of victory
        "more_mod_tetra:arknights/win/proof_of_victory_frost_nova_1",
        "more_mod_tetra:arknights/win/proof_of_victory_frost_nova_2",
        "more_mod_tetra:arknights/win/proof_of_victory_gun_knight_patriot_1",
        "more_mod_tetra:arknights/win/proof_of_victory_gun_knight_patriot_2",
        "more_mod_tetra:arknights/win/proof_of_victory_patriot_1",
        "more_mod_tetra:arknights/win/proof_of_victory_patriot_2",
        "more_mod_tetra:arknights/win/proof_of_victory_pursuer",
        "more_mod_tetra:arknights/win/proof_of_victory_rosmontis_1",
        "more_mod_tetra:arknights/win/proof_of_victory_rosmontis_2",
        // 灾变兼容（不含 abyssal_core / storm_core，二者为真实配方保留在数据包中）
        "more_mod_tetra:cataclysm/abyssal_ingot",
        "more_mod_tetra:cataclysm/monstrous_core",
        "more_mod_tetra:cataclysm/storm_ingot",
        // 伪匠魂材料
        "more_mod_tetra:fake_tconstruct/fake_alumite_ingot",
        "more_mod_tetra:fake_tconstruct/fake_hepatizon_ingot",
        "more_mod_tetra:fake_tconstruct/fake_manyullyn_ingot",
        "more_mod_tetra:fake_tconstruct/fake_pig_iron_ingot",
        "more_mod_tetra:fake_tconstruct/fake_rose_gold_ingot",
        "more_mod_tetra:fake_tconstruct/fake_rose_golden_silk",
        "more_mod_tetra:fake_tconstruct/fake_silky_cloth",
        // 其他兼容
        "more_mod_tetra:goety/tetra_dark_wand",
        "more_mod_tetra:iron/cloth/sound_magic_cloth",
        "more_mod_tetra:iron/ingot/sound_arcane_ingot"
    ])
})
