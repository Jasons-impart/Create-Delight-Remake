// Mekanism 钢退役：钢锭唯一 owner 为 createmetallurgy
// 冶金钢已挂 forge:ingots/steel 标签，Mek 的钢机壳等消费方直接吃冶金钢
// 这里掐断 Mek 钢的全部生产配方（灌注链：铁+碳->富集铁->钢粉->钢锭）

ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        // 富集铁 -> 钢粉（钢的诞生点）
        "mekanism:processing/steel/enriched_iron_to_dust",
        // 钢锭 <-> 粉/粒/块互转
        "mekanism:processing/steel/ingot/from_block",
        "mekanism:processing/steel/ingot/from_dust_blasting",
        "mekanism:processing/steel/ingot/from_dust_smelting",
        "mekanism:processing/steel/ingot/from_nuggets",
        "mekanism:processing/steel/ingot_to_dust"
    ])
})
