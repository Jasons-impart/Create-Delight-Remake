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
        .removeLoot("silentsdelight:warden_heart")
    e.addEntityLootModifier("deeperdarker:shattered")
        .addWeightedLoot([1, 2], [
            Item.of("silentsdelight:warden_ear")
                .withChance(30),
            Item.of("minecraft:echo_shard")
                .withChance(5)
        ])
    e.addEntityLootModifier("deeperdarker:shriek_worm")
        .addWeightedLoot([1, 5], [
            Item.of("minecraft:echo_shard")
                .withChance(20),
            Item.of("minecraft:sculk")
                .withChance(20),
            Item.of("deeperdarker:heart_of_the_deep")
                .withChance(10),
            Item.of("silentsdelight:sculk_sensor_tendril")
                .withChance(50)
        ])
    e.addEntityLootModifier("deeperdarker:sculk_centipede")
        .addWeightedLoot([1, 2], [
            Item.of("silentsdelight:sculk_sensor_tendril")
                .withChance(0.3)
        ])
    e.addEntityLootModifier("deeperdarker:sculk_leech")
        .addWeightedLoot([1, 2], [
            Item.of("silentsdelight:sculk_sensor_tendril")
                .withChance(0.2)
        ])
    e.addEntityLootModifier("deeperdarker:sculk_snapper")
        .addLoot("silentsdelight:sculk_sensor_tendril")
    e.addEntityLootModifier("deeperdarker:stalker")
        .addLoot("deeperdarker:ancient_vase")
        .addWeightedLoot([1, 5], [
            Item.of("minecraft:echo_shard")
                .withChance(20),
            Item.of("minecraft:sculk")
                .withChance(20),
            Item.of("deeperdarker:heart_of_the_deep")
                .withChance(10),
            Item.of("silentsdelight:sculk_sensor_tendril")
                .withChance(50)
        ])
})
