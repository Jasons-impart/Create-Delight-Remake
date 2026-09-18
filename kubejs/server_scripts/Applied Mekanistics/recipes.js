// Applied Mekanistics 化学品元件深绑：外壳走包内 AE2 压弯体系，元件按等级吃 Mek 电路
// 对齐 AE2 章 processor&cellcasing.js 的处理链风格（curving + cell_housing_curving_head）

ServerEvents.recipes(e => {
    // 化学品元件外壳：锇锭经 VI 压弯（复用 AE2 元件外壳压头）
    remove_recipes_id(e, ["appmek:chemical_cell_housing"])
    e.recipes.vintageimprovements.curving("2x appmek:chemical_cell_housing", "mekanism:ingot_osmium")
        .head("createdelight:cell_housing_curving_head")
        .id("createdelight:curving/chemical_cell_housing")

    // 化学品存储元件：外壳 + 赛特斯石英 + 对应等级 Mek 电路
    remove_recipes_id(e, [
        "appmek:chemical_storage_cell_1k",
        "appmek:chemical_storage_cell_4k",
        "appmek:chemical_storage_cell_16k",
        "appmek:chemical_storage_cell_64k",
        "appmek:chemical_storage_cell_256k"
    ])
    const CELL_TIERS = [
        ["1k", "mekanism:basic_control_circuit"],
        ["4k", "mekanism:basic_control_circuit"],
        ["16k", "mekanism:advanced_control_circuit"],
        ["64k", "mekanism:elite_control_circuit"],
        ["256k", "mekanism:ultimate_control_circuit"]
    ]
    CELL_TIERS.forEach(([tier, circuit]) => {
        e.recipes.kubejs.shaped(`appmek:chemical_storage_cell_${tier}`, [
            "QCQ",
            "CHC",
            "QCQ"
        ], {
            Q: "ae2:certus_quartz_dust",
            C: circuit,
            H: "appmek:chemical_cell_housing"
        }).id(`createdelight:crafting/mekanism/chemical_storage_cell_${tier}`)
    })

    // 便携化学品元件：对应元件 + HDPE + 能量平板
    remove_recipes_id(e, [
        "appmek:portable_chemical_storage_cell_1k",
        "appmek:portable_chemical_storage_cell_4k",
        "appmek:portable_chemical_storage_cell_16k",
        "appmek:portable_chemical_storage_cell_64k",
        "appmek:portable_chemical_storage_cell_256k"
    ])
    const PORTABLE_TIERS = ["1k", "4k", "16k", "64k", "256k"]
    PORTABLE_TIERS.forEach(tier => {
        e.recipes.kubejs.shaped(`appmek:portable_chemical_storage_cell_${tier}`, [
            " H ",
            "SCS",
            " E "
        ], {
            H: "appmek:chemical_cell_housing",
            S: `appmek:chemical_storage_cell_${tier}`,
            C: "mekanism:advanced_control_circuit",
            E: "mekanism:energy_tablet"
        }).id(`createdelight:crafting/mekanism/portable_chemical_storage_cell_${tier}`)
    })
})
