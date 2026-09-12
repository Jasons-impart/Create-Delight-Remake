// Mekanism 冗余物品隐藏
// 1) Mekanism Tools 装备：本包工具体系归 Tetra，Mek 工具盔甲只会污染 JEI
// 2) Mekanism 钢系列：钢锭唯一 owner 为 createmetallurgy（生产配方已在 steel_retire.js 掐断）
// 材料物品（锇/青铜/精炼黑曜石/精炼萤石锭等）保留

JEIEvents.hideItems(e => {
    let hide = []

    // === Mekanism Tools 装备 ===
    const MATERIALS = ["bronze", "osmium", "steel", "refined_obsidian", "refined_glowstone", "lapis_lazuli"]
    const GEAR = ["sword", "pickaxe", "axe", "shovel", "hoe", "paxel", "shield",
        "helmet", "chestplate", "leggings", "boots"]
    MATERIALS.forEach(mat => GEAR.forEach(type => hide.push(`mekanismtools:${mat}_${type}`)))
    // 原版材质的多用镐也一并隐藏
    ;["wood", "stone", "iron", "gold", "diamond", "netherite"].forEach(mat =>
        hide.push(`mekanismtools:${mat}_paxel`))

    // === Mekanism 钢系列 + 富集铁中间体（已无获取途径） ===
    hide.push(
        "mekanism:ingot_steel",
        "mekanism:dust_steel",
        "mekanism:nugget_steel",
        "mekanism:block_steel",
        "mekanism:enriched_iron"
    )

    e.hide(hide)
})
