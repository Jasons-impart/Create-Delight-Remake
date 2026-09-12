// Mekanism 接入：跨模组材料统一（1:1 互转）
// 原则：标签保证配方互通，互转配方保证玩家存量物品不废

ServerEvents.recipes(e => {
    // 青铜：Mek 青铜锭 ↔ 包内青铜锭（owner: createdelightcore）
    e.recipes.kubejs.shapeless("createdelightcore:bronze_ingot", "mekanism:ingot_bronze")
        .id("createdelight:crafting/mekanism/mek_bronze_2_bronze")
    e.recipes.kubejs.shapeless("mekanism:ingot_bronze", "createdelightcore:bronze_ingot")
        .id("createdelight:crafting/mekanism/bronze_2_mek_bronze")

    // 钢：不设互转——Mek 钢已退役（steel_retire.js），钢锭唯一 owner 为 createmetallurgy
    // Mek 侧钢机壳等消费方走 forge:ingots/steel 标签直接吃冶金钢

    // 锡：Mek 锡锭 ↔ 包内锡（owner: createdelightcore）
    // Mek 锡无生成来源，仅作为其机器加工包内锡矿时的产物形态回收
    // 注：本版未注册 createdelight:tin_dust，锡粉互转暂缺
    e.recipes.kubejs.shapeless("createdelightcore:tin_ingot", "mekanism:ingot_tin")
        .id("createdelight:crafting/mekanism/mek_tin_2_tin")

    // 铀：alexscaves 铀 → Mek 铀（owner: alexscaves，Mek 侧供裂变燃料链取料）
    e.recipes.kubejs.shapeless("mekanism:ingot_uranium", "alexscaves:uranium")
        .id("createdelight:crafting/mekanism/uranium_2_mek_uranium")
})
