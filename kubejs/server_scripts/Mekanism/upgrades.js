// 升级模块（P1-c，plan §四）：七类模块各自独立的短序列组装
// 起手锇锭 + 部署基础电路 + 终步材料分化；单价刻意低（单机可叠 8 个）
// 注：升级行为是 Mek Java 侧实现，KubeJS 无法新增"高阶模块"等级——原 plan 的高阶组合移入 P4 CDC 评估

ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "mekanism:upgrade/speed",
        "mekanism:upgrade/energy",
        "mekanism:upgrade/gas",
        "mekanism:upgrade/filter",
        "mekanism:upgrade/muffling",
        "mekanism:upgrade/anchor",
        "mekanism:upgrade/stone_generator"
    ])

    const upgrades = {
        speed: "minecraft:redstone",
        energy: "minecraft:gold_ingot",
        gas: "mekanism:hdpe_sheet",
        filter: "minecraft:paper",
        muffling: "minecraft:white_wool",
        anchor: "minecraft:chain",
        stone_generator: "mekanism:dust_obsidian"
    }

    for (const [name, material] of Object.entries(upgrades)) {
        const trans = `createdelight:incomplete_upgrade_${name}`
        e.recipes.create.sequenced_assembly(`mekanism:upgrade_${name}`, "mekanism:ingot_osmium", [
            e.recipes.create.deploying(trans, [trans, "mekanism:basic_control_circuit"]),
            e.recipes.create.deploying(trans, [trans, material])
        ])
            .transitionalItem(trans)
            .loops(1)
            .id(`createdelight:sequenced_assembly/upgrade_${name}`)
    }
})
