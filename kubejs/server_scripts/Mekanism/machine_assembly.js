// 基础机器装配（P1-b，plan §三）：每台机器独立的机械手序列组装
// 起手件沿用 Mek 原版语义（钢制机壳/熔炉/电解芯/能量板），序列步骤注入电路与包内门槛材料
// 大机器（裂变/聚变/SPS/涡轮）走 P2 的 MBD2 装配线，本阶段保留原版配方

ServerEvents.recipes(e => {
    // 机器 → [起手件, 部署步骤...]
    const machines = {
        // 粉碎系
        "mekanism:crusher": ["mekanism:steel_casing", "mekanism:basic_control_circuit", "createmetallurgy:tungsten_ingot", "minecraft:redstone"],
        "mekanism:enrichment_chamber": ["mekanism:steel_casing", "mekanism:basic_control_circuit", "mekanism:ingot_osmium", "minecraft:iron_ingot"],
        "mekanism:energized_smelter": ["mekanism:steel_casing", "mekanism:basic_control_circuit", "minecraft:glass"],
        // 化学初级
        "mekanism:purification_chamber": ["mekanism:steel_casing", "mekanism:basic_control_circuit", "create:copper_sheet", "mekanism:hdpe_sheet"],
        "mekanism:chemical_injection_chamber": ["mekanism:steel_casing", "mekanism:advanced_control_circuit", "mekanism:hdpe_sheet", "createdelight:forged_steel_ingot"],
        // 灌注系
        "mekanism:metallurgic_infuser": ["minecraft:furnace", "mekanism:ingot_osmium", "minecraft:redstone", "createdelight:carbon_plate"],
        // 电化学
        "mekanism:electrolytic_separator": ["mekanism:electrolytic_core", "mekanism:ingot_lead", "minecraft:iron_ingot", "minecraft:redstone"],
        // 溶解链（5x 线，锻造钢门槛）
        "mekanism:chemical_dissolution_chamber": ["mekanism:steel_casing", "createdelightcore:forge_steel_casing", "mekanism:elite_control_circuit", "mekanism:basic_chemical_tank", "mekanism:ingot_refined_obsidian"],
        "mekanism:chemical_washer": ["mekanism:steel_casing", "mekanism:elite_control_circuit", "minecraft:paper", "mekanism:hdpe_sheet"],
        "mekanism:chemical_crystallizer": ["mekanism:steel_casing", "mekanism:elite_control_circuit", "mekanism:ingot_refined_obsidian", "mekanism:basic_chemical_tank"],
        // 氧化/反应
        "mekanism:chemical_oxidizer": ["mekanism:steel_casing", "mekanism:advanced_control_circuit", "create:propeller", "minecraft:redstone"],
        "mekanism:pressurized_reaction_chamber": ["mekanism:steel_casing", "mekanism:elite_control_circuit", "createdelightcore:forge_steel_casing", "mekanism:hdpe_sheet"],
        "mekanism:isotopic_centrifuge": ["mekanism:basic_chemical_tank", "mekanism:ultimate_control_circuit", "mekanism:ingot_lead", "createaddition:superconducting_connector"],
        // 自动化
        "mekanism:formulaic_assemblicator": ["mekanism:steel_casing", "mekanism:advanced_control_circuit", "createdelight:universal_press", "create:electron_tube"],
        "mekanism:configurator": ["mekanism:energy_tablet", "createaddition:superconducting_wire", "mekanism:basic_control_circuit"],
        "mekanism:robit": ["mekanism:energy_tablet", "create:precision_mechanism", "mekanism:ingot_refined_obsidian", "mekanism:advanced_control_circuit"]
    }

    remove_recipes_output(e, Object.keys(machines))

    for (const [machine, steps] of Object.entries(machines)) {
        const name = machine.split(":")[1]
        const trans = `createdelight:incomplete_${name}`
        const sequence = []
        for (let i = 1; i < steps.length; i++) {
            sequence.push(e.recipes.create.deploying(trans, [trans, steps[i]]))
        }
        e.recipes.create.sequenced_assembly(machine, steps[0], sequence)
            .transitionalItem(trans)
            .loops(1)
            .id(`createdelight:sequenced_assembly/${name}`)
    }
})
