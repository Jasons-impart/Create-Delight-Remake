ServerEvents.recipes(e => {
    //动力合成器添加：一级火箭
    e.recipes.create.mechanical_crafting("ad_astra:tier_1_rocket", [
        "  A  ",
        " BBB ",
        " B B ",
        " BFB ",
        " BBB ",
        "CDDDC",
        "CEEEC"
    ], {
        A: "ad_astra:rocket_nose_cone",
        B: "#forge:storage_blocks/steel",
        C: "ad_astra:rocket_fin",
        D: "ad_astra:steel_tank",
        E: "ad_astra:steel_engine",
        F: "createdelight:first_stage_rocket_core"
    })
    //动力合成器添加：二级火箭
    e.recipes.create.mechanical_crafting("ad_astra:tier_2_rocket", [
        "  A  ",
        " BBB ",
        " B B ",
        " BFB ",
        " BBB ",
        "CDDDC",
        "CEEEC"
    ], {
        A: "ad_astra:rocket_nose_cone",
        B: "#forge:storage_blocks/steel",
        C: "ad_astra:rocket_fin",
        D: "ad_astra:desh_tank",
        E: "ad_astra:desh_engine",
        F: "createdelight:second_stage_rocket_core"
    })
    //动力合成器添加：三级火箭
    e.recipes.create.mechanical_crafting("ad_astra:tier_3_rocket", [
        "  A  ",
        " BBB ",
        " B B ",
        " BFB ",
        " BBB ",
        "CDDDC",
        "CEEEC"
    ], {
        A: "ad_astra:rocket_nose_cone",
        B: "#forge:storage_blocks/steel",
        C: "ad_astra:rocket_fin",
        D: "ad_astra:ostrum_tank",
        E: "ad_astra:ostrum_engine",
        F: "createdelight:third_stage_rocket_core"
    })
    //动力合成器添加：四级火箭
    e.recipes.create.mechanical_crafting("ad_astra:tier_4_rocket", [
        "  A  ",
        " BBB ",
        " B B ",
        " BFB ",
        " BBB ",
        "CDDDC",
        "CEEEC"
    ], {
        A: "ad_astra:rocket_nose_cone",
        B: "#forge:storage_blocks/steel",
        C: "ad_astra:rocket_fin",
        D: "ad_astra:calorite_tank",
        E: "ad_astra:calorite_engine",
        F: "createdelight:fourth_stage_rocket_core"
    })
    //序列组装：一阶火箭核心
    let iner_1 = "createdelight:incomplete_first_stage_rocket_core"
    e.recipes.create.sequenced_assembly([
        Item.of("createdelight:first_stage_rocket_core").withChance(8),
        Item.of("minecraft:nether_star").withChance(0.5),
        Item.of("createbigcannons:nethersteel_block").withChance(1.5)
    ], "createbigcannons:nethersteel_block", [
        e.recipes.vintageimprovements.turning(iner_1, iner_1),
        e.recipes.create.deploying(iner_1, [iner_1, "immersive_aircraft:gyroscope"]),
        e.recipes.create.deploying(iner_1, [iner_1, "minecraft:nether_star"]),
        e.recipes.vintageimprovements.laser_cutting(iner_1, iner_1, 500)
    ])
        .transitionalItem(iner_1)
        .loops(1)
        .id("createdelight:first_stage_rocket_core")
    //序列组装：二阶火箭核心
    let iner_2 = "createdelight:incomplete_second_stage_rocket_core"
    e.recipes.create.sequenced_assembly([
        Item.of("createdelight:second_stage_rocket_core").withChance(8),
        Item.of("ad_astra:desh_block").withChance(2)
    ], "ad_astra:desh_block", [
        e.recipes.vintageimprovements.turning(iner_2, iner_2),
        e.recipes.create.deploying(iner_2, [iner_2, "ad_astra:ice_shard"]),
        e.recipes.create.deploying(iner_2, [iner_2, "iceandfire:cyclops_eye"]),
        e.recipes.create.deploying(iner_2, [iner_2, "iceandfire:cockatrice_eye"]),
        e.recipes.vintageimprovements.laser_cutting(iner_2, iner_2, 500)
    ])
        .transitionalItem(iner_2)
        .loops(1)
        .id("createdelight:second_stage_rocket_core")
    //序列组装：三阶火箭核心
    let iner_3 = "createdelight:incomplete_third_stage_rocket_core"
    e.recipes.create.sequenced_assembly([
        Item.of("createdelight:third_stage_rocket_core").withChance(8),
        Item.of("ae2:engineering_processor").withChance(1),
        Item.of("ad_astra:ostrum_block").withChance(1)
    ], "ad_astra:ostrum_block", [
        e.recipes.vintageimprovements.turning(iner_3, iner_3),
        e.recipes.create.deploying(iner_3, [iner_3, "ae2:engineering_processor"]),
        e.recipes.create.deploying(iner_3, [iner_3, "ae2:fluix_crystal"]),
        e.recipes.create.filling(iner_3, [iner_3, Fluid.of("createdelight:fire_dragon_blood", 500)]),
        e.recipes.vintageimprovements.laser_cutting(iner_3, iner_3, 500)
    ])
        .transitionalItem(iner_3)
        .loops(3)
        .id("createdelight:third_stage_rocket_core")
    //序列组装：四阶火箭核心
    let iner_4 = "createdelight:incomplete_fourth_stage_rocket_core"
    e.recipes.create.sequenced_assembly([
        Item.of("createdelight:fourth_stage_rocket_core").withChance(8),
        Item.of("ae2:engineering_processor").withChance(0.5),
        Item.of("ad_astra:calorite_block").withChance(1.5),
    ], "ad_astra:calorite_block", [
        e.recipes.vintageimprovements.turning(iner_4, iner_4),
        e.recipes.create.deploying(iner_3, [iner_3, "ae2:engineering_processor"]),
        e.recipes.create.deploying(iner_3, [iner_3, "ae2:fluix_crystal"]),
        e.recipes.create.filling(iner_3, [iner_3, Fluid.of("createdelight:fire_dragon_blood", 500)]),
        e.recipes.create.filling(iner_3, [iner_3, Fluid.of("createdelight:lightning_dragon_blood", 500)]),
        e.recipes.vintageimprovements.laser_cutting(iner_4, iner_4, 500)
    ])
        .transitionalItem(iner_4)
        .loops(4)
        .id("createdelight:fourth_stage_rocket_core")
})
