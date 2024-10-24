LootJS.modifiers(e => {
    // 监守者回响碎片掉落
    e.addEntityLootModifier("minecraft:warden")
        .addWeightedLoot([1, 3], [
            Item.of("minecraft:echo_shard")
                .withChance(30),
            Item.of("minecraft:sculk")
                .withChance(50),
            Item.of("silentsdelight:warden_ear")
                .withChance(30)
        ])
})