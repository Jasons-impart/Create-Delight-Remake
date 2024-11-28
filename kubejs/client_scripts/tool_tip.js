let tooltips = [
    ["vinery:cherry_boat", "§l§4请不要拿出来, 会崩溃!!!", "§l§4Please don't take it out, it will collapse!!!"],
    ["vinery:cherry_chest_boat", "§l§4请不要拿出来, 会崩溃!!!", "§l§4Please don't take it out, it will collapse!!!"],
    ["ad_astra:nasa_workbench", "§l§4请不要拿出来, 会崩溃!!!", "§l§4Please don't take it out, it will collapse!!!"],
    ["createdieselgenerators:oil_barrel", "§6可以防止燃料爆炸", "§6Can prevent fuel explosion"],
    ["ratatouille:frozen_block", "§b可冷却周围一格以内的物品", "§bCools down items within one block of the area"],
    ["createdieselgenerators:distillation_controller", "§a每个储罐都需要一个", "§aOne is needed for each tank"],
    // ["farmersdelight:ham", "§4目前只能通过用刀杀死疣猪兽来获得,或人工制作一个", "§4Currently it can only be obtained by killing a hoglin with a knife, or crafting one"],
    ["vintageimprovements:belt_grinder", "§aRPM≤16为低转速,§616≤RPM≤64为中转速,§4RPM≥64为高转速", "§aRPM≤16 is low rotational speed,§616≤ RPM≤64 is medium rotational speed and §4RPM≥64 is high rotational speed"],
    ["createdelight:oat_bread", "§9生命恢复（00:03）", "§9Regeneration(00:03)"],
    ["createmetallurgy:wolframite_ore", "§6常见于地狱30-36层", "§6Commonly found in nether 30-36 floors"],
    ["culturaldelights:pickle", "§9滋养（00:30）", "§9Nourishment(00:30)"],
    ["culturaldelights:cut_pickle", "§9滋养（00:15）", "§9Nourishment(00:15)"],
    ["createdelight:sigma_man_sword", "§o西格玛男人专用", "§oFor sigma men only"],
    ["createdelight:braised_intestines_in_brown_sauce","§o你真是饿了...","§oYou are so hunger..."],
    ["lightmanscurrency:coinmint", "§l§4已停用!!", "§l§4STOP USING NOW!!"],
    ['createdieselgenerators:diesel_engine', "§4下面有错误, 最多应为24576su", "§4-> the following contains an error, should be up to 24576su"],
    ['createdieselgenerators:large_diesel_engine', "§4下面有错误, 最多应为32768su", "§4-> the following contains an error, should be up to 32768su"],
    ['createdieselgenerators:huge_diesel_engine', "§4下面有错误, 最多应为40960su", "§4-> the following contains an error, should be up to 40960su"],
    ["createdelight:emergency_industrial_platform", "§a放入泥土以显示平台范围，放入石头以产生平台", "§aInsert dirt to display platform range, insert stone to generate platform."],
    ["createdelight:overworld_metal_ore_cluster", "512su/RPM", "512su/RPM"],
    ["createdelight:overworld_noble_metal_ore_cluster", "1024su/RPM", "1024su/RPM"],
    ["createdelight:nether_ore_cluster", "1536su/RPM", "1536su/RPM"],
    ["createdelight:moon_ore_cluster", "1024su/RPM", "1024su/RPM"],
    ["createdelight:mars_ore_cluster", "1024su/RPM", "1024su/RPM"],
    ["createdelight:mars_gemstone_cluster", "1536su/RPM", "1536su/RPM"],
    ["createdelight:mercury_ore_cluster", "1024su/RPM", "1024su/RPM"],
    ["createdelight:venus_ore_cluster", "2048su/RPM", "2048su/RPM"],
    ["createdelight:glacio_ore_cluster", "2048su/RPM", "2048su/RPM"],
    ["art_of_forging:devils_soul_gem", "使用带有纳米融合的武器击杀凋零可获得", "Killing the Wither with a weapon that has nano fusion can grant"],
    ["art_of_forging:eerie_shard", "使用带有纳米融合的武器击杀监守者可获得", "Killing the Guardian with a weapon that has nano fusion can grant"],
    ["art_of_forging:heart_of_ender", "使用带有纳米融合的武器击杀末影人可获得", "Killing the Enderman with a weapon that has nano fused can grant"],
    ["art_of_forging:potent_mixture", "使用带有纳米融合的武器击杀苦力怕可获得", "Killing the Creeper with a weapon that has nano fusion can grant"],
    ['createdelight:debug_reload_tool', "蹲下右键重载server脚本， 站立右键重载client脚本", "EMM"],
    ['alexsmobs:shattered_dimensional_carver', "§4边界存在崩溃问题， 查看§4边境碎块§rJEI了解如何召唤瞻远者", "zzz"],
    ['create_central_kitchen:chocolate_cake_slice', "§9甜蜜冲刺（00:10）", "§9Sugar Rush(00:10)"],
    ['alexscaves:cave_map', "该物品已无实际用处，且不可按照显示的配方合成", "This item is no longer useful and cannot be crafted using the displayed recipe"],
    ['create_central_kitchen:chocolate_cake_slice', "§9能量冲击（00:10）", "§9Sugar Rush(00:10)"],
    ["alexscaves:block_of_azure_neodymium", "§7磁感应强度：", "§7Magnetic Force: "],
    ["alexscaves:block_of_scarlet_neodymium", "§7磁感应强度：", "§7Magnetic Force: "]
]
tooltips.forEach(([key, zh_cn, en_us]) => {
    // 添加 key
    ItemEvents.tooltip(e => {
        e.add(key, Text.translate(key))
    })

    // 添加简体中文本地化
    ClientEvents.lang("zh_cn", e => {
        e.add(key, zh_cn)
    })

    // 添加英文本地化
    ClientEvents.lang("en_us", e => {
        e.add(key, en_us)
    })
})
// 磁铁特例
ItemEvents.tooltip(e => {
    e.add("alexscaves:block_of_azure_neodymium", "§b 8")
    e.add("alexscaves:block_of_scarlet_neodymium", "§b 8")
})