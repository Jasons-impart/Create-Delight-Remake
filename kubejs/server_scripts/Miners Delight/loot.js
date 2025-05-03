LootJS.modifiers(e => {
    e.addEntityLootModifier("squid", "glow_squid")
    .replaceLoot("miners_delight:squid", "culturaldelights:squid")
    .replaceLoot("miners_delight:glow_squid", "culturaldelights:glow_squid")
    e.addLootTypeModifier("fishing")
    .replaceLoot("miners_delight:squid", "culturaldelights:squid")
    .replaceLoot("miners_delight:glow_squid", "culturaldelights:glow_squid")
})