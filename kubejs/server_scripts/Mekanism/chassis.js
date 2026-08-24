// 通用机械基座与机器装配（P1-b，plan §三）
// 7 步序列组装：锻造钢×2（起手+部署）、青铜、熔融玻璃灌注、基础电路、电子管、润滑油、弹簧
// 机器 = 基座 + 特征件一步合成；大机器（裂变/聚变/SPS/涡轮）走 P2 的 MBD2 装配线，本阶段保留原版配方

ServerEvents.recipes(e => {
    const chassis = "createdelight:mek_chassis"
    const trans = "createdelight:incomplete_mek_chassis"

    e.recipes.create.sequenced_assembly(chassis, "createdelight:forged_steel_ingot")
        .transitionalItem(trans)
        .sequence(
            e.recipes.createDeploying(trans, [trans, "createdelight:forged_steel_ingot"]),
            e.recipes.createDeploying(trans, [trans, "createdelightcore:bronze_ingot"]),
            e.recipes.createFilling(trans, [trans, Fluid.of("createdelightcore:molten_glass", 100)]),
            e.recipes.createDeploying(trans, [trans, "mekanism:basic_control_circuit"]),
            e.recipes.createDeploying(trans, [trans, "create:electron_tube"]),
            e.recipes.createFilling(trans, [trans, Fluid.of("createdelight:lubricating_oil", 50)]),
            e.recipes.createDeploying(trans, [trans, "#forge:spring/between_500_2_1000"])
        )
        .loops(1)
        .id("createdelight:sequenced_assembly/mek_chassis")

    // 基座机器清单：机器 → 特征件（语义见 plan §三 机器分组表）
    const machines = {
        // 粉碎系
        "mekanism:crusher": "createmetallurgy:tungsten_ingot",               // 钨磨头
        "mekanism:enrichment_chamber": "mekanism:ingot_osmium",
        "mekanism:energized_smelter": "minecraft:redstone_lamp",
        // 化学初级
        "mekanism:purification_chamber": "create:copper_sheet",
        "mekanism:chemical_injection_chamber": "mekanism:hdpe_sheet",
        // 灌注系
        "mekanism:metallurgic_infuser": "createdelight:carbon_plate",
        // 电化学
        "mekanism:electrolytic_separator": "mekanism:ingot_lead",
        // 溶解链（5x 线，锻造钢门槛）
        "mekanism:chemical_dissolution_chamber": "createdelightcore:forge_steel_casing",
        "mekanism:chemical_washer": "minecraft:paper",                        // 滤纸
        "mekanism:chemical_crystallizer": "mekanism:ingot_refined_obsidian",
        // 氧化/反应
        "mekanism:chemical_oxidizer": "create:propeller",
        "mekanism:pressurized_reaction_chamber": "createdelightcore:forge_steel_casing",
        "mekanism:isotopic_centrifuge": "createaddition:superconducting_connector",
        // 自动化
        "mekanism:formulaic_assemblicator": "createdelight:universal_press",
        "mekanism:configurator": "createaddition:superconducting_wire",
        "mekanism:robit": "create:precision_mechanism"
    }

    remove_recipes_output(e, Object.keys(machines))

    for (const [machine, part] of Object.entries(machines)) {
        e.shapeless(machine, [chassis, part]).id(`createdelight:machine_assembly/${machine.split(":")[1]}`)
    }
})
