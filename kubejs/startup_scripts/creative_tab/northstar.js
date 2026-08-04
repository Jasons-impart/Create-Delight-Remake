StartupEvents.modifyCreativeTab("northstar:northstar_items", e => {
    e.remove([
        'northstar:vanilla_ice_cream', 
        'northstar:chocolate_ice_cream', 
        'northstar:strawberry_ice_cream', 
        'northstar:raw_ice_cream_cone', 
        'northstar:ice_cream_cone', 
        'northstar:hydrocarbon_bucket',
        'northstar:solar_panel', 
        'northstar:circuit_engraver', 
        'northstar:electrolysis_machine',
        // 月球钛矿生成已禁用，避免创造标签和物品列表继续展示。
        'northstar:moon_titanium_ore',
        'northstar:moon_deep_titanium_ore'
    ])
    e.add([
        'createdelight:oxygen_tank',
        'createdelight:sturdy_oxygen_tank',
        'createdelight:folded_mapping_satellite',
        'createdelight:satellite_navigation_data_card',
    ])
})
