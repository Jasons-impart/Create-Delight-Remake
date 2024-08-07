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
    // 凋零不掉落凋零之眼，增加未激活的凋零之眼掉落
    e.addEntityLootModifier("minecraft:wither")
        .replaceLoot("endrem:wither_eye", "createdelight:unactivated_wither_eye")
    // 删除唤魔者掉落的魔力之眼
    e.addEntityLootModifier("minecraft:evoker")
        .removeLoot("endrem:magical_eye")
        // 增加概率掉蒙尘的落魔力之眼
        .addWeightedLoot([1, 2], [
            Item.of("createdelight:dusty_magical_eye")
                .withChance(10),
            Item.of("emerald")
                .withChance(100)
        ])
    // 删除沙漠神殿掉落的远古之眼
    e.addLootTableModifier("minecraft:chests/desert_pyramid")
        .removeLoot("endrem:old_eye")
    // 替换林地府邸里的魔力之眼
    e.addLootTableModifier("minecraft:chests/woodland_mansion")
        .replaceLoot("endrem:magical_eye", "createdelight:dusty_magical_eye")
    // 删除掠夺者哨站掉落的腐化之眼
    e.addLootTableModifier("minecraft:chests/pillager_outpost")
        .removeLoot("endrem:corrupted_eye")
    // 删除远古守卫者掉落的守卫者之眼
    e.addEntityLootModifier("elder_guardian")
        .removeLoot("endrem:guardian_eye")
    // 增加下界堡垒中的下界之眼的掉落
    e.addLootTableModifier("betterfortresses:chests/keep")
        .addWeightedLoot([1, 2], [
            Item.of("endrem:nether_eye")
                .withChance(1),
            Item.of("nether_brick_wall")
                .withChance(20)
        ])
    // 移除原版下界堡垒中的下界之眼的掉落
    e.addLootTableModifier("minecraft:chests/nether_bridge")
        .removeLoot("endrem:nether_eye")
})
