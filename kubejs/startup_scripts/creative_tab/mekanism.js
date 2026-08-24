// 通用机械页签整理（P1）
// - 移除已统一到包内材料的 Mek 锭/粉（产出已被 replaceOutput 接管，存量物品仍可用）
// - 移除数字矿机与地震仪（配方已在 remove.js 删除，此处收尾页签展示）
// 若首启发现页签 id 不是 mekanism:main，在此修正后再考虑 JEIEvents.hideItems 兜底
StartupEvents.modifyCreativeTab("mekanism:main", e => {
    e.remove([
        "mekanism:ingot_bronze",
        "mekanism:ingot_steel",
        "mekanism:ingot_tin",
        "mekanism:dust_bronze",
        "mekanism:dust_steel",
        "mekanism:dust_tin",
        "mekanism:digital_miner",
        "mekanism:seismic_vibrator"
    ])
})
