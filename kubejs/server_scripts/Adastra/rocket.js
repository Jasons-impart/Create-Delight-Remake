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
        Item.of("createdelight:first_stage_rocket_core").withChance(6),
        Item.of("minecraft:nether_star").withChance(4),
        Item.of("createbigcannons:nethersteel_block").withChance(4)
    ],"createbigcannons:nethersteel_block", [
        e.recipes.vintageimprovements.turning(iner_1, iner_1),
        e.recipes.create.deploying(iner_1, [iner_1, 'immersive_aircraft:gyroscope']),
        e.recipes.create.deploying(iner_1, [iner_1, "minecraft:nether_star"]),
        e.recipes.vintageimprovements.laser_cutting(iner_1, iner_1, 5000)
    ])
        .transitionalItem(iner_1)
        .loops(1)
        .id("createdelight:first_stage_rocket_core")
    //序列组装：二阶火箭核心
    let inss2 = "createdelight:second_stage_rocket_core"
    e.recipes.create.sequenced_assembly([
        Item.of(inss2).withChance(6),
        Item.of("ad_astra:ice_shard").withChance(1.5),
        Item.of("ad_astra:desh_block").withChance(1),
        Item.of("create_sa:steam_engine").withChance(1.5)
    ],
        "ad_astra:desh_plate", [
        e.recipes.create.deploying(inss2, [inss2, "create_sa:steam_engine"]),
        e.recipes.create.deploying(inss2, [inss2, "ad_astra:desh_block"]),
        e.recipes.create.deploying(inss2, [inss2, "ad_astra:ice_shard"]),
        e.recipes.create.deploying(inss2, [inss2, "iceandfire:cyclops_eye"]).keepHeldItem(),
        e.recipes.create.deploying(inss2, [inss2, "iceandfire:gorgon_head"]).keepHeldItem(),
        e.recipes.vintageimprovements.curving(inss2, inss2, 2),
        e.recipes.vintageimprovements.laser_cutting(inss2, inss2, 5000)
    ]
    ).transitionalItem("ad_astra:desh_plate")
        .loops(8)
    //序列组装：三阶火箭核心
    let inss3 = "createdelight:third_stage_rocket_core"
    e.recipes.create.sequenced_assembly([
        Item.of(inss3).withChance(6),
        Item.of("iceandfire:dragonsteel_fire_ingot").withChance(1.5),
        Item.of("ad_astra:ostrum_plate").withChance(1),
        Item.of("ad_astra:ostrum_block").withChance(1.5)
    ],
        "ad_astra:ostrum_plate", [
        e.recipes.create.deploying(inss3, [inss3, "create_sa:steam_engine"]),
        e.recipes.create.deploying(inss3, [inss3, "iceandfire:dragonsteel_fire_ingot"]),
        e.recipes.create.deploying(inss3, [inss3, "ad_astra:ostrum_block"]),
        e.recipes.create.filling(inss3, [inss3, Fluid.of("ad_astra:cryo_fuel", 100)]),
        e.recipes.vintageimprovements.curving(inss3, inss3, 2),
        e.recipes.vintageimprovements.laser_cutting(inss3, inss3, 5000)
    ]
    ).transitionalItem("ad_astra:ostrum_plate")
        .loops(8)
    //序列组装：四阶火箭核心
    let inss4 = "createdelight:fourth_stage_rocket_core"
    e.recipes.create.sequenced_assembly([
        Item.of(inss4).withChance(6),
        Item.of("iceandfire:dragonsteel_fire_ingot").withChance(1.5),
        Item.of("ad_astra:calorite_block").withChance(1),
        Item.of("iceandfire:dragonsteel_lightning_ingot").withChance(1.5)
    ],
        "ad_astra:calorite_plate", [
        e.recipes.create.deploying(inss4, [inss4, "create_sa:steam_engine"]),
        e.recipes.create.deploying(inss4, [inss4, "iceandfire:dragonsteel_fire_ingot"]),
        e.recipes.create.deploying(inss4, [inss4, "iceandfire:dragonsteel_lightning_ingot"]),
        e.recipes.create.deploying(inss4, [inss4, "ad_astra:calorite_block"]),
        e.recipes.vintageimprovements.curving(inss4, inss4, 2),
        e.recipes.vintageimprovements.laser_cutting(inss4, inss4, 5000)
    ]
    ).transitionalItem("ad_astra:calorite_plate")
        .loops(8)
})
