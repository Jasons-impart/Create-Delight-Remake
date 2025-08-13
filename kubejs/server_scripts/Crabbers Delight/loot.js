LootJS.modifiers(e => {
    e.addEntityLootModifier("alexsmobs:lobster")
        .replaceLoot("alexsmobs:lobster_tail", "crabbersdelight:clawster")
    e.addEntityLootModifier("quark:crab")
        .removeLoot("quark:crab_shell")
    e.addEntityLootModifier("minecraft:frog")
        .addWeightedLoot([1, 2], [
            Item.of("crabbersdelight:raw_frog_leg").withChance(0.2)
        ])
    e.addEntityLootModifier("alexsmobs:rain_frog")
        .addWeightedLoot([1, 1], [
            Item.of("crabbersdelight:raw_frog_leg").withChance(0.1)
        ])

})