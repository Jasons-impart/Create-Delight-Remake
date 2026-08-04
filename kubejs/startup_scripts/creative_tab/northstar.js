StartupEvents.modifyCreativeTab("northstar:northstar_items", e => {
    e.remove([
        'northstar:vanilla_ice_cream', 
        'northstar:chocolate_ice_cream', 
        'northstar:strawberry_ice_cream', 
        'northstar:raw_ice_cream_cone', 
        'northstar:ice_cream_cone', 
        'northstar:solar_panel', 
        'northstar:circuit_engraver', 
        'northstar:electrolysis_machine'])
})

StartupEvents.modifyCreativeTab("northstar:northstar_blocks", e => {
    e.remove([
        // 月球钛矿的世界生成已被移除，避免其在 JEI 中误导玩家。
        'northstar:moon_titanium_ore',
        'northstar:moon_deep_titanium_ore',
    ])
})
