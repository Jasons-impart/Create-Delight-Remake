LootJS.modifiers(e => {
    e.addBlockLootModifier("casualness_delight:spring_roll_medley")
        .replaceLoot("casualness_delight:sweet_rice", "casualness_delight:spring_roll_medley")
        .removeLoot("minecraft:bowl")
})