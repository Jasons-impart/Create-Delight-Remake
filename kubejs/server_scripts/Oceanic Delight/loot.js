LootJS.modifiers(e => {
    e.addEntityLootModifier("minecraft:glow_squid")
        .removeLoot("crabbersdelight:raw_glow_squid_tentacles")
        .removeLoot("oceanic_delight:glow_squid_tentacles")
        e.addEntityLootModifier("minecraft:squid")
        .removeLoot("crabbersdelight:raw_squid_tentacles")
        .removeLoot("oceanic_delight:squid_tentacles")
})