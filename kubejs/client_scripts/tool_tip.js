
ItemEvents.tooltip(e => {
    clearAddShiftTooltip(e, [
        'dreadsteel:kit_default',
        'dreadsteel:kit_white',
        'dreadsteel:kit_black',
        'dreadsteel:kit_bronze',
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
        'createdelight:dread_heart',
        'createdelight:prospector',
        'vintagedelight:cheese_curds',
    ])
    clearAddCtrlTooltip(e, [
        
    ])
    addCtrlTooltip(e, [
        "createdelight:sprinkler",
        'createdelight:sell_bin',
        'vintagedelight:cheese_mold',
    ])
    clearAddShiftCtrlTooltip(e, [

    ])
    addAir(e, [
        'create:netherite_backtank',
        'create:copper_backtank',
        'create_jetpack:jetpack',
        'create_jetpack:netherite_jetpack',
    ])
})
let tooltips = [
    ["createfluidstuffs:multi_fluid_tank", "§6来自海上机械师的神奇储罐", "§6From the Sea of Mechanical Engineers"],
    ['neapolitan:adzuki_beans', "§l§4该物品已无实际用处", "§l§4This item is no longer useful"],
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
    ['createdelight:debug_reload_tool', "蹲下右键重载server脚本， 站立右键重载client脚本", "EMM"],
    // ["createdelight:overworld_metal_ore_cluster", "512su/RPM", "512su/RPM"],
    // ["createdelight:overworld_noble_metal_ore_cluster", "1024su/RPM", "1024su/RPM"],
    // ["createdelight:nether_ore_cluster", "1536su/RPM", "1536su/RPM"],
    // ["createdelight:moon_ore_cluster", "1024su/RPM", "1024su/RPM"],
    // ["createdelight:mars_ore_cluster", "1024su/RPM", "1024su/RPM"],
    // ["createdelight:mars_gemstone_cluster", "1536su/RPM", "1536su/RPM"],
    // ["createdelight:mercury_ore_cluster", "1024su/RPM", "1024su/RPM"],
    // ["createdelight:venus_ore_cluster", "2048su/RPM", "2048su/RPM"],
    // ["createdelight:glacio_ore_cluster", "2048su/RPM", "2048su/RPM"],
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
    e.addAdvancedToAll((item, advanced, text) => {
        if (item.item instanceof $ModularItem && TetraUtil.itemHasEffect(item, "createdelight:charge")){
            let energy = item.nbt.getInt("energy")
            text.add(`${energy}FE/1000000FE`)
        }
    })
})
