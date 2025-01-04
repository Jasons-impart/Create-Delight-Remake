LootJS.modifiers(e => {
    e.addEntityLootModifier("netherexp:banshee", "netherexp:apparition", "netherexp:vessel")
        .addLoot("art_of_forging:soul_ember").randomChance(0.5)
    e.addEntityLootModifier("minecraft:hoglin")
        .removeLoot("netherexp:hogham")
        .replaceLoot("farmersdelight:ham", "netherexp:hogham")
        .replaceLoot("farmersdelight:smoked_ham", "netherexp:cooked_hogham")
})