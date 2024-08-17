LootJS.modifiers(e => {
    e.addEntityLootModifier("minecraft:wither_skeleton")
        .removeLoot("art_of_forging:shards_of_malice")
    e.addEntityLootModifier("minecraft:wither")
        .removeLoot("art_of_forging:fragment_of_eden")
    e.addEntityLootModifier("minecraft:blaze")
        .removeLoot("art_of_forging:soul_ember")
})