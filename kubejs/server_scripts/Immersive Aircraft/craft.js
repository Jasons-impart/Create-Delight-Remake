ServerEvents.recipes(e => {
    // 移除配方：沉浸式飞机原本配方
    remove_recipes_id(e, [
        "immersive_aircraft:airship",
        "immersive_aircraft:quadrocopter",
        "immersive_aircraft:gyrodyne",
        "immersive_aircraft:biplane",
        "immersive_aircraft:boiler",
        "immersive_aircraft:steel_boiler",
        "immersive_aircraft:engine",
        "immersive_aircraft:propeller",
        "immersive_aircraft:industrial_gears",
        "immersive_aircraft:improved_landing_gear",
    ])
    // 旋转炮
    e.shaped(
        "immersive_aircraft:rotary_cannon", [
        " A ",
        " B ",
        " C "
    ], {
        A: "minecraft:dispenser",
        B: "immersive_aircraft:industrial_gears",
        C: "alloyed:steel_ingot"
    }
    )
        .id("immersive_aircraft:rotary_cannon_shaped")

    // 动力合成器添加：四轴飞行器
    e.recipes.create.mechanical_crafting("immersive_aircraft:quadrocopter", [
        "ABA",
        "BCB",
        "ADA"
    ], {
        A: "immersive_aircraft:propeller",
        B: "quark:bamboo_planks",
        C: "minecraft:scaffolding",
        D: "immersive_aircraft:engine"
    })
    .id("immersive_aircraft:mechanical_crafting/quadrocopter")
    // 工作台添加：固定旋翼机
    e.shaped("immersive_aircraft:gyrodyne", [
        " A ",
        "BCB",
        " D "
    ], {
        A: "immersive_aircraft:propeller",
        B: "immersive_aircraft:sail",
        C: "immersive_aircraft:hull",
        D: "minecraft:grindstone"
    })
    .id("immersive_aircraft:gyrodyne")
    // 动力合成器添加：双翼机
    e.recipes.create.mechanical_crafting("immersive_aircraft:biplane", [
        "  A  ",
        "  B  ",
        "CCDCC",
        "  E  ",
        " CEC "
    ], {
        A: "immersive_aircraft:propeller",
        B: "immersive_aircraft:engine",
        C: "immersive_aircraft:hull",
        D: "#minecraft:wooden_trapdoors",
        E: "#minecraft:logs"
    })
    .id("immersive_aircraft:mechanical_crafting/biplane")
    // 动力合成器添加：锅炉
    e.recipes.create.mechanical_crafting("immersive_aircraft:boiler", [
        "AAA",
        "ABA",
        "ACA",
        "ADA",
        "AAA"
    ], {
        A: "minecraft:copper_ingot",
        B: "create_sa:small_filling_tank",
        C: "create_sa:heat_engine",
        D: "create_sa:small_fueling_tank"
    })
    .id("immersive_aircraft:mechanical_crafting/boiler")
    // 添加配方：飞艇
    e.shaped("immersive_aircraft:airship", [
        "AAA",
        "BBA",
        "BCD"
    ], {
        A: "immersive_aircraft:sail",
        B: "immersive_aircraft:hull",
        C: "immersive_aircraft:engine",
        D: "immersive_aircraft:propeller"
    })
    .id("immersive_aircraft:airship_shaped")
    // 增加配方：引擎
    e.shaped("immersive_aircraft:engine", [
        "AAA",
        "BCB",
        "ADA"
    ], {
        A: "minecraft:iron_ingot",
        B: "create:mechanical_piston",
        C: "create_sa:steam_engine",
        D: "immersive_aircraft:boiler"
    })
    .id("immersive_aircraft:engine_shaped")
    // 增加配方：螺旋桨
    e.shaped("immersive_aircraft:propeller", [
        "AA ",
        " B ",
        " AA"
    ], {
        A: "minecraft:iron_ingot",
        B: "create:andesite_alloy"
    })
    .id("immersive_aircraft:propeller_shaped")
    // 增加配方：钢制锅炉
    e.shaped("immersive_aircraft:steel_boiler", [
        "AAA",
        "ABA",
        "ACA"
    ], {
        A: "alloyed:steel_ingot",
        B: "immersive_aircraft:boiler",
        C: "create_sa:steam_engine"
    })
    .id("immersive_aircraft:steel_boiler_shaped")
    // 增加配方：工业齿轮
    e.shaped("immersive_aircraft:industrial_gears", [
        " AA",
        "BCA",
        "BB "
    ], {
        A: "create:large_cogwheel",
        B: "create:cogwheel",
        C: "63x create:shaft"
    })
    .id("immersive_aircraft:industrial_gears_shaped")
    // 新增配方：改良起落架
    e.shaped("immersive_aircraft:improved_landing_gear", [
        " AB",
        "CCA",
        "CC "
    ], {
        A: "minecraft:iron_ingot",
        B: "create:andesite_alloy",
        C: "minecraft:dried_kelp"
    })
    .id("immersive_aircraft:improved_landing_gear_shaped")
    // 新增配方：猩红双翼机
    e.recipes.create.mechanical_crafting(
        'man_of_many_planes:scarlet_biplane',
        [
            " ABA ",
            "CCDCC",
            " CEC ",
            "  E  ",
            " CAC "
        ], {
            A: "immersive_aircraft:improved_landing_gear",
            B: "immersive_aircraft:enhanced_propeller",
            C: "immersive_aircraft:hull_reinforcement",
            D: "immersive_aircraft:biplane",
            E: "create:railway_casing"
        })
        .id("man_of_many_planes:scarlet_biplane")
    // 新增配方：经济双翼机
    e.recipes.create.mechanical_crafting(
        'man_of_many_planes:economy_plane',
        [
            "ABC",
            "DEB",
            "ABC"
        ], {
            A: "immersive_aircraft:improved_landing_gear",
            B: "immersive_aircraft:hull_reinforcement",
            C: "immersive_aircraft:sail",
            D: "immersive_aircraft:enhanced_propeller",
            E: "immersive_aircraft:biplane"
        }
    ).id("man_of_many_planes:economy_plane")
    // 调整风帆配方可用所有地毯
    e.replaceInput(
        { output: "immersive_aircraft:sail" },
        "minecraft:white_carpet",
        "#minecraft:wool_carpets"
    )
})
