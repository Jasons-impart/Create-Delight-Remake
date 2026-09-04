// 锇金属链：Mekanism 提供物品，Create 侧处理链 + 冶金热熔链
// owner：mekanism（raw_osmium / ingot_osmium / dust_osmium 等）

ServerEvents.recipes(e => {
    // 副产物：锇矿石伴生青金石
    byProductMap.set("mekanism:dust_osmium", ["minecraft:lapis_lazuli", 0.4])

    // Create 湿法洗练链：脏粉→粉→粉碎矿→粗矿→粒（粉碎矿用 Create 6 自带物品）
    metal_production_line_5(e, [
        "mekanism:dirty_dust_osmium",
        "mekanism:dust_osmium",
        "create:crushed_raw_osmium",
        "mekanism:raw_osmium",
        "mekanism:nugget_osmium"
    ])

    // 冶金热熔链：锇块/锭 ↔ 熔融锇（解锁 createmetallurgy:molten_osmium）
    metal_production_line_7(e, [
        "mekanism:block_osmium",
        "mekanism:ingot_osmium",
        "createmetallurgy:molten_osmium"
    ], "heated", 80)
})
