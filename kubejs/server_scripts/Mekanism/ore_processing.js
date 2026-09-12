// Mekanism 矿石处理：氟石 Create 链
// 锇/铅/铀/氟石并入数字矿机矿簇产物的部分已直接写入 Create Ore/recipes.js（保留原配方 id，避免重复注册）
// 锇/铅的完整湿法洗练链见 Custom/metal/osmium.js、lead.js

ServerEvents.recipes(e => {
    // 氟石：Create 破碎链（Mek 富集仓原生 5-6 宝石，Create 侧 5 + 概率副产）
    crushing_ore(e, "mekanism:fluorite_ore", "mekanism:fluorite_gem", 5, "minecraft:cobblestone")
})
