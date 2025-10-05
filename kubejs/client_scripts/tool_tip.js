
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
        'bakeries:cream_cake',
        'bakeries:tiramisu',
        'bakeries:cake_roll'
    ])
    clearAddCtrlTooltip(e, [
        
    ])
    addCtrlTooltip(e, [
        "createdelight:sprinkler",
        'createdelight:dryer',
        'createdelight:sell_bin',
        'vintagedelight:cheese_mold',
        'createdelight:fuel_hotcream',
        'createdelight:blood_collection_device',
        'luncheonmeatsdelight:luncheon_meat_can',
        'luncheonmeatsdelight:can_shell_small_toast',
        'bakeries:mould_toast',
        'bakeries:mould_cheese_cocoa_toast',
        'bakeries:mould_pound_cake',
        'eclipticseasons:spring_greenhouse_core',
        'eclipticseasons:summer_greenhouse_core',
        'eclipticseasons:autumn_greenhouse_core',
        'eclipticseasons:winter_greenhouse_core',
        'kinetic_pixel:graycottonseed',
    ])
    clearAddShiftCtrlTooltip(e, [
        'brewinandchewin:keg',
        "createdelight:emergency_industrial_platform",
        "createdelight:emergency_industrial_platform_block",
        "createdelight:emergency_industrial_platform_dark",
        "createdelight:emergency_industrial_platform_dark_block",
        "createdelight:emergency_industrial_platform_lime",
        "createdelight:emergency_industrial_platform_lime_block",
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
    ['alexscaves:cave_map', "§l§4该物品已无实际用处，且不可按照显示的配方合成", "§l§4This item is no longer useful and cannot be crafted using the displayed recipe"],
    ['alexsmobs:shattered_dimensional_carver', "§4边界存在崩溃问题， 查看§4边境碎块§rJEI了解如何召唤瞻远者", "zzz"],
    ['createdelight:debug_reload_tool', "蹲下右键重载server脚本， 站立右键重载client脚本", "EMM"],
    ['cosmopolitan:birch_cookie', "§9清除挖掘疲劳", "§9Clear Mining Fatigue"],
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
    // e.addAdvancedToAll((item, advanced, text) => {
    //     if (item.item instanceof $ModularItem && TetraUtil.itemHasEffect(item, "createdelight:charge")){
    //         let energy = item.nbt.getInt("energy")
    //         let maxEnergy = item.nbt.getInt("maxEnergy")
    //         text.add(`${energy}FE/${maxEnergy}FE`)
    //     }
    // })
})
