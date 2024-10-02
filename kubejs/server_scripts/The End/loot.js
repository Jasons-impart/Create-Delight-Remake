LootJS.modifiers(e => {
    // 末影龙掉落龙肉
    e.addEntityLootModifier("minecraft:ender_dragon")
        .addWeightedLoot([3, 8], [
            Item.of("ends_delight:raw_dragon_meat")
                .withChance(30),
            Item.of("ends_delight:dragon_leg")
                .withChance(20),
            Item.of("ends_delight:dragon_tooth")
                .withChance(20)
        ])
    //冰龙掉落龙肉 
    e.addBlockLootModifier("minecraft:ice_dragon")
    .addWeightedLoot([3, 8], [
        Item.of("ends_delight:raw_dragon_meat")
            .withChance(30),
        Item.of("ends_delight:dragon_leg")
            .withChance(20),
        Item.of("ends_delight:dragon_tooth")
            .withChance(20)
        ])
    //火龙掉落龙肉
        e.addBlockLootModifier("minecraft:fire_dragon")
        .addWeightedLoot([3, 8], [
            Item.of("ends_delight:raw_dragon_meat")
                .withChance(30),
            Item.of("ends_delight:dragon_leg")
                .withChance(20),
            Item.of("ends_delight:dragon_tooth")
                .withChance(20)
            ])
    //雷龙掉落龙肉
    e.addBlockLootModifier("minecraft:lightning_dragon")
    .addWeightedLoot([3, 8], [
        Item.of("ends_delight:raw_dragon_meat")
            .withChance(30),
        Item.of("ends_delight:dragon_leg")
            .withChance(20),
        Item.of("ends_delight:dragon_tooth")
            .withChance(20)
        ])
})
