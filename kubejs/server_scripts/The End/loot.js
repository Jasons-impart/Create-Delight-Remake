LootJS.modifiers(e => {
    // 末影龙掉落龙肉
    e.addEntityLootModifier("minecraft:ender_dragon")
        .addWeightedLoot([1, 8], [
            Item.of("ends_delight:raw_dragon_meat")
                .withChance(30),
            Item.of("ends_delight:dragon_leg")
                .withChance(20),
            Item.of("ends_delight:dragon_tooth")
                .withChance(20)
        ])
})
