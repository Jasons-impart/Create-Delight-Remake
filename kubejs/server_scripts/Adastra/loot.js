LootJS.modifiers(event => {
    // 移除adastra中锤子的生成
    event.addLootTableModifier("ad_astra:chests/village/moon/blacksmith")
        .removeLoot("ad_astra:hammer");
    event.addEntityLootModifier("ad_astra:corrupted_lunarian")
        .addLoot("minecraft:glow_ink_sac");
});
