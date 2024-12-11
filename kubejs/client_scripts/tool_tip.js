ItemEvents.tooltip(e => {
    clearAddShiftTooltip(e, [
        'create_sa:brass_exoskeleton_chestplate',
        'create_sa:andesite_exoskeleton_chestplate',
        'create_sa:copper_exoskeleton_chestplate',
        'create_sa:grapplin_whisk',
        'create_sa:portable_drill',
        'create_sa:flamethrower',
        'create_sa:block_picker',
        'create_sa:creative_filling_tank',
        'create_sa:copper_magnet',
        'create_sa:slime_helmet',
        'create_sa:slime_boots',
        'create_sa:small_filling_tank',
        'create_sa:medium_filling_tank',
        'create_sa:large_filling_tank',
        'create_sa:small_fueling_tank',
        'create_sa:medium_fueling_tank',
        'create_sa:large_fueling_tank',
    ])
    addShiftTooltip(e, [
        "ratatouille:frozen_block",
        "ratatouille:mechanical_demolder",
        "createdieselgenerators:distillation_controller",
        "createmetallurgy:wolframite_ore",
        "vintageimprovements:belt_grinder",
        "createdelight:emergency_industrial_platform",
        "art_of_forging:devils_soul_gem",
        "art_of_forging:eerie_shard",
        "art_of_forging:heart_of_ender",
        "art_of_forging:potent_mixture",
        "art_of_forging:shards_of_malice",
        "art_of_forging:fragment_of_eden",
        "art_of_forging:dragon_soul",
        "art_of_forging:soul_ember",
        "art_of_forging:nano_insectoid",
        'createdelight:prospector',
        'vintageimprovements:vacuum_chamber',
        "vintageimprovements:vibrating_table",
        'vintageimprovements:lathe',
    ])
    clearAddCtrlTooltip(e, [
        
    ])
    clearAddShiftCtrlTooltip(e, [
        'create_sa:brass_jetpack_chestplate',
        'create_sa:andesite_jetpack_chestplate',
        'create_sa:copper_jetpack_chestplate'
    ])
    addFuelAndWater(e, [
        'create_sa:brass_jetpack_chestplate',
        'create_sa:brass_exoskeleton_chestplate',
        'create_sa:portable_drill',
    ])
    addFuel(e, [
        'create_sa:andesite_jetpack_chestplate',
        'create_sa:andesite_exoskeleton_chestplate',
        'create_sa:grapplin_whisk',
        'create_sa:flamethrower',
    ])
    addWater(e, [
        'create_sa:copper_jetpack_chestplate',
        'create_sa:copper_exoskeleton_chestplate',
        'create_sa:block_picker',
    ])
    addStock1(e, [
        'create_sa:small_filling_tank',
        'create_sa:small_fueling_tank',
    ])
    addStock2(e, [
        'create_sa:medium_filling_tank',
        'create_sa:medium_fueling_tank',
    ])
    addStock3(e, [
        'create_sa:large_filling_tank',
        'create_sa:large_fueling_tank',
    ])
    addAir(e, [
        'create:netherite_backtank',
        'create:copper_backtank',
        'create_jetpack:jetpack',
        'create_jetpack:netherite_jetpack',
    ])
})
let tooltips = [
    ["ad_astra:nasa_workbench", "§l§4请不要拿出来, 会崩溃!!!", "§l§4Please don't take it out, it will collapse!!!"],
    ['alexscaves:cave_map', "§l§4该物品已无实际用处，且不可按照显示的配方合成", "§l§4This item is no longer useful and cannot be crafted using the displayed recipe"],
    ['createdieselgenerators:diesel_engine', "§4下面有错误, 最多应为24576su", "§4-> the following contains an error, should be up to 24576su"],
    ['createdieselgenerators:large_diesel_engine', "§4下面有错误, 最多应为32768su", "§4-> the following contains an error, should be up to 32768su"],
    ['createdieselgenerators:huge_diesel_engine', "§4下面有错误, 最多应为40960su", "§4-> the following contains an error, should be up to 40960su"],
    ['alexsmobs:shattered_dimensional_carver', "§4边界存在崩溃问题， 查看§4边境碎块§rJEI了解如何召唤瞻远者", "zzz"],
    ["createdelight:oat_bread", "§9生命恢复（00:03）", "§9Regeneration(00:03)"],
    ["culturaldelights:pickle", "§9滋养（00:30）", "§9Nourishment(00:30)"],
    ["culturaldelights:cut_pickle", "§9滋养（00:15）", "§9Nourishment(00:15)"],
    ['create_central_kitchen:chocolate_cake_slice', "§9甜蜜冲刺（00:10）", "§9Sugar Rush(00:10)"],
    ['create_central_kitchen:chocolate_cake_slice', "§9能量冲击（00:10）", "§9Sugar Rush(00:10)"],
    ["createdelight:overworld_metal_ore_cluster", "512su/RPM", "512su/RPM"],
    ["createdelight:overworld_noble_metal_ore_cluster", "1024su/RPM", "1024su/RPM"],
    ["createdelight:nether_ore_cluster", "1536su/RPM", "1536su/RPM"],
    ["createdelight:moon_ore_cluster", "1024su/RPM", "1024su/RPM"],
    ["createdelight:mars_ore_cluster", "1024su/RPM", "1024su/RPM"],
    ["createdelight:mars_gemstone_cluster", "1536su/RPM", "1536su/RPM"],
    ["createdelight:mercury_ore_cluster", "1024su/RPM", "1024su/RPM"],
    ["createdelight:venus_ore_cluster", "2048su/RPM", "2048su/RPM"],
    ["createdelight:glacio_ore_cluster", "2048su/RPM", "2048su/RPM"],
    ['createdelight:debug_reload_tool', "蹲下右键重载server脚本， 站立右键重载client脚本", "EMM"],
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
ItemEvents.tooltip(e => {
    // 磁铁
    e.add("alexscaves:block_of_azure_neodymium", Text.translate("tooltip.createdelight.magnetic_flux_density"))
    e.add("alexscaves:block_of_scarlet_neodymium", Text.translate("tooltip.createdelight.magnetic_flux_density"))
    e.add("alexscaves:block_of_azure_neodymium", "§b 16")
    e.add("alexscaves:block_of_scarlet_neodymium", "§b 16")
    // ATM卡
    e.addAdvanced('lightmanscurrency:atm_card', (item, advanced, text) => {
        text.remove(1)
    })
})
