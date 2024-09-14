LootJS.modifiers(e => {
    // 移除adastra中锤子的生成
    e.addLootTableModifier("ad_astra:chests/village/moon/blacksmith")
        .removeLoot("ad_astra:hammer")
})
