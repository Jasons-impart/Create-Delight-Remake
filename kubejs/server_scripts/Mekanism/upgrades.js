// 升级模块链（P1-c，plan §四）
// 低价通用基片（硅晶圆 + 部署基础电路）+ 终步材料分化；单价刻意低（单机可叠 8 个）
// 注：升级行为是 Mek Java 侧实现，KubeJS 无法新增"高阶模块"等级——原 plan 的高阶组合移入 P4 CDC 评估

ServerEvents.recipes(e => {
    const chip = "createdelight:upgrade_chip_base"
    const trans = "createdelight:incomplete_upgrade_chip_base"

    e.recipes.create.sequenced_assembly(chip, "ae2:silicon")
        .transitionalItem(trans)
        .sequence(
            e.recipes.createDeploying(trans, [trans, "mekanism:basic_control_circuit"])
        )
        .loops(1)
        .id("createdelight:sequenced_assembly/upgrade_chip_base")

    // 七类模块终步分化
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
        e.shapeless(`mekanism:upgrade_${name}`, [chip, material]).id(`createdelight:upgrade/${name}`)
    }
})
