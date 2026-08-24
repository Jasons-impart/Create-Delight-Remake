// 铅金属链：Mekanism 提供物品，Create 侧处理链 + 冶金热熔链
// owner：mekanism（raw_lead / ingot_lead / dust_lead 等）

ServerEvents.recipes(e => {
    // 副产物：方铅矿伴生硫
    byProductMap.set("mekanism:dust_lead", ["mekanism:dust_sulfur", 0.5])

    // Create 湿法洗练链（粉碎矿用 Create 6 自带物品）
    metal_production_line_5(e, [
        "mekanism:dirty_dust_lead",
        "mekanism:dust_lead",
        "create:crushed_raw_lead",
        "mekanism:raw_lead",
        "mekanism:nugget_lead"
    ])

    // 冶金热熔链：铅块/锭 ↔ 熔融铅（解锁 createmetallurgy:molten_lead）
    metal_production_line_7(e, [
        "mekanism:block_lead",
        "mekanism:ingot_lead",
        "createmetallurgy:molten_lead"
    ], "heated", 80)
})
