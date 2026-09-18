// Mekanism Generators + 高价值设备门控
// 原则：只门控"改变游戏节奏"的设备（燃气发电机/数字采矿机/QIO/核反应堆/SPS），常规发电机保持原版
// 所有重建配方吃 Create 高级零件，与伟大工程师线的进度咬合

ServerEvents.recipes(e => {
    // === 燃气发电机：乙烯链的发电核心 ===
    remove_recipes_id(e, ["mekanismgenerators:generator/gas_burning"])
    e.recipes.kubejs.shaped("mekanismgenerators:gas_burning_generator", [
        "SSS",
        "PCP",
        "IBI"
    ], {
        S: "createmetallurgy:steel_ingot",
        P: "#forge:plates/copper",
        C: "mekanism:advanced_control_circuit",
        I: "createaddition:capacitor",
        B: "create:brass_casing"
    }).id("createdelight:crafting/mekanism/gas_burning_generator")

    // === 数字采矿机：COE 提取器是它的原型机（叙事门控） ===
    remove_recipes_id(e, ["mekanism:digital_miner"])
    e.recipes.create.mechanical_crafting("mekanism:digital_miner", [
        "CHHHC",
        "HXXXH",
        "HXEXH",
        "HXXXH",
        "CHHHC"
    ], {
        C: "mekanism:elite_control_circuit",
        H: "mekanism:hdpe_sheet",
        X: "mekanism:steel_casing",
        E: "createoreexcavation:extractor"
    }).id("createdelight:mechanical_crafting/mekanism/digital_miner")

    // === QIO 数字存储：AE2 逻辑处理器跨体系绑定 ===
    remove_recipes_id(e, [
        "mekanism:qio_dashboard",
        "mekanism:qio_drive_array",
        "mekanism:qio_importer",
        "mekanism:qio_exporter",
        "mekanism:qio_redstone_adapter",
        "mekanism:portable_qio_dashboard"
    ])
    e.recipes.kubejs.shaped("mekanism:qio_dashboard", [
        "CHC",
        "HPH",
        "CHC"
    ], {
        C: "mekanism:basic_control_circuit",
        H: "mekanism:hdpe_sheet",
        P: "create:precision_mechanism"
    }).id("createdelight:crafting/mekanism/qio_dashboard")

    e.recipes.create.mechanical_crafting("mekanism:qio_drive_array", [
        "CHC",
        "LPL",
        "CHC"
    ], {
        C: "mekanism:advanced_control_circuit",
        H: "mekanism:hdpe_sheet",
        L: "ae2:logic_processor",
        P: "create:precision_mechanism"
    }).id("createdelight:mechanical_crafting/mekanism/qio_drive_array")

    // 【重建补全】以下 QIO 外围与核工业段原文件未留存，按上文模板模式补写，落地后按游戏内核对
    e.recipes.kubejs.shaped("mekanism:qio_importer", [
        "CHC",
        "HPH",
        "CHC"
    ], {
        C: "mekanism:basic_control_circuit",
        H: "mekanism:hdpe_sheet",
        P: "ae2:logic_processor"
    }).id("createdelight:crafting/mekanism/qio_importer")

    e.recipes.kubejs.shaped("mekanism:qio_exporter", [
        "CHC",
        "HPH",
        "CHC"
    ], {
        C: "mekanism:basic_control_circuit",
        H: "mekanism:hdpe_sheet",
        P: "ae2:logic_processor"
    }).id("createdelight:crafting/mekanism/qio_exporter")

    e.recipes.kubejs.shaped("mekanism:qio_redstone_adapter", [
        "CHC",
        "HPH",
        "CHC"
    ], {
        C: "mekanism:basic_control_circuit",
        H: "mekanism:hdpe_sheet",
        P: "minecraft:redstone"
    }).id("createdelight:crafting/mekanism/qio_redstone_adapter")

    // === 聚变反应堆：终局门槛（超导连接器 + 原子合金 + northstar 高级电路） ===
    // 【重建补全】
    remove_recipes_id(e, ["mekanismgenerators:fusion_reactor_controller"])
    e.recipes.create.mechanical_crafting("mekanismgenerators:fusion_reactor_controller", [
        "IAAAI",
        "AUUUA",
        "AUPUA",
        "AUUUA",
        "IAAAI"
    ], {
        I: "northstar:advanced_circuit",
        A: "mekanism:alloy_atomic",
        U: "createaddition:superconducting_connector",
        P: "create:precision_mechanism"
    }).id("createdelight:mechanical_crafting/mekanism/fusion_reactor_controller")

    // === 裂变堆端口与 SPS 端口：核体系分阶段门槛 ===
    // 【重建补全】
    remove_recipes_id(e, ["mekanismgenerators:fission_reactor_port", "mekanism:sps_port"])
    e.recipes.create.mechanical_crafting("mekanismgenerators:fission_reactor_port", [
        "CRRRC",
        "RSSSR",
        "RSSSR",
        "RSSSR",
        "CRRRC"
    ], {
        C: "mekanism:elite_control_circuit",
        R: "createmetallurgy:steel_ingot",
        S: "mekanism:ingot_lead"
    }).id("createdelight:mechanical_crafting/mekanism/fission_reactor_port")

    e.recipes.create.mechanical_crafting("mekanism:sps_port", [
        "CRRRC",
        "ROOOR",
        "ROUOR",
        "ROOOR",
        "CRRRC"
    ], {
        C: "mekanism:ultimate_control_circuit",
        R: "createmetallurgy:steel_ingot",
        O: "mekanism:ingot_refined_obsidian",
        U: "createaddition:superconducting_connector"
    }).id("createdelight:mechanical_crafting/mekanism/sps_port")
})
