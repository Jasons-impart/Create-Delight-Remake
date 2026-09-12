// Mekanism 工厂方块重建：全部走 Create 序列装配（机械手流水线）
// 叙事：单机上装配线，机械手逐步加装机器/机构/塑料，最终组装成工厂
// 9 种工厂类型 x 4 等级，低阶工厂是高阶的装配基底

ServerEvents.recipes(e => {
    // 工厂类型 -> 对应单机
    const FACTORY_MACHINES = {
        smelting: "mekanism:energized_smelter",
        enriching: "mekanism:enrichment_chamber",
        crushing: "mekanism:crusher",
        sawing: "mekanism:precision_sawmill",
        compressing: "mekanism:osmium_compressor",
        combining: "mekanism:combiner",
        infusing: "mekanism:metallurgic_infuser",
        purifying: "mekanism:purification_chamber",
        injecting: "mekanism:chemical_injection_chamber"
    }
    const TIERS = ["basic", "advanced", "elite", "ultimate"]

    // 移除全部原版工厂配方（mek_data 类型按精确 id 删除；Rhino 无 flatMap，用双循环）
    let factoryIds = []
    TIERS.forEach(t => Object.keys(FACTORY_MACHINES).forEach(type =>
        factoryIds.push(`mekanism:factory/${t}/${type}`)))
    remove_recipes_id(e, factoryIds)

    let iner = "createdelight:incomplete_factory"

    Object.keys(FACTORY_MACHINES).forEach(type => {
        let machine = FACTORY_MACHINES[type]

        // 基础工厂：单机为基底，加装 2 单机 + 2 精密机构 + 2 HDPE 板
        e.recipes.create.sequenced_assembly(`mekanism:basic_${type}_factory`, machine, [
            e.recipes.create.deploying(iner, [iner, machine]),
            e.recipes.create.deploying(iner, [iner, machine]),
            e.recipes.create.deploying(iner, [iner, "create:precision_mechanism"]),
            e.recipes.create.deploying(iner, [iner, "create:precision_mechanism"]),
            e.recipes.create.deploying(iner, [iner, "mekanism:hdpe_sheet"]),
            e.recipes.create.deploying(iner, [iner, "mekanism:hdpe_sheet"])
        ])
            .transitionalItem(iner)
            .loops(1)
            .id(`createdelight:sequenced_assembly/basic_${type}_factory`)

        // 进阶工厂：基础工厂为基底，加装 2 进阶电路 + 黄铜机壳 + HDPE 板
        e.recipes.create.sequenced_assembly(`mekanism:advanced_${type}_factory`, `mekanism:basic_${type}_factory`, [
            e.recipes.create.deploying(iner, [iner, "mekanism:advanced_control_circuit"]),
            e.recipes.create.deploying(iner, [iner, "mekanism:advanced_control_circuit"]),
            e.recipes.create.deploying(iner, [iner, "create:brass_casing"]),
            e.recipes.create.deploying(iner, [iner, "mekanism:hdpe_sheet"])
        ])
            .transitionalItem(iner)
            .loops(1)
            .id(`createdelight:sequenced_assembly/advanced_${type}_factory`)

        // 精英工厂：进阶工厂为基底，加装 2 精英电路 + 2 冶金钢 + HDPE 板
        // 【重建补全】原文件此段未留存，按基础/进阶模板模式补写
        e.recipes.create.sequenced_assembly(`mekanism:elite_${type}_factory`, `mekanism:advanced_${type}_factory`, [
            e.recipes.create.deploying(iner, [iner, "mekanism:elite_control_circuit"]),
            e.recipes.create.deploying(iner, [iner, "mekanism:elite_control_circuit"]),
            e.recipes.create.deploying(iner, [iner, "createmetallurgy:steel_ingot"]),
            e.recipes.create.deploying(iner, [iner, "createmetallurgy:steel_ingot"]),
            e.recipes.create.deploying(iner, [iner, "mekanism:hdpe_sheet"])
        ])
            .transitionalItem(iner)
            .loops(1)
            .id(`createdelight:sequenced_assembly/elite_${type}_factory`)

        // 终极工厂：精英工厂为基底，加装 2 终极电路 + 2 钨锭 + 2 HDPE 板
        // 【重建补全】同上
        e.recipes.create.sequenced_assembly(`mekanism:ultimate_${type}_factory`, `mekanism:elite_${type}_factory`, [
            e.recipes.create.deploying(iner, [iner, "mekanism:ultimate_control_circuit"]),
            e.recipes.create.deploying(iner, [iner, "mekanism:ultimate_control_circuit"]),
            e.recipes.create.deploying(iner, [iner, "createmetallurgy:tungsten_ingot"]),
            e.recipes.create.deploying(iner, [iner, "createmetallurgy:tungsten_ingot"]),
            e.recipes.create.deploying(iner, [iner, "mekanism:hdpe_sheet"]),
            e.recipes.create.deploying(iner, [iner, "mekanism:hdpe_sheet"])
        ])
            .transitionalItem(iner)
            .loops(1)
            .id(`createdelight:sequenced_assembly/ultimate_${type}_factory`)
    })
})
