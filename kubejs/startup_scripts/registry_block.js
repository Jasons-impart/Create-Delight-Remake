StartupEvents.registry("block", e => {
    // 大块陨石
    e.create("createdelight:enriched_sky_stone_block")
        .translationKey("block.createdelight.enriched_sky_stone_block")
        .soundType("stone")
        .hardness(10)
        .resistance(10)
        .tag(`minecraft:mineable/pickaxe`)
        .tag(`minecraft:needs_iron_tool`)
        .requiresTool(true)
})
