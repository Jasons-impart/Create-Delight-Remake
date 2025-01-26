LootJS.modifiers(e => {
    e.addBlockLootModifier("neapolitan:adzuki_soil")
    .replaceLoot("neapolitan:adzuki_beans", "createdelight:adzuki_beans_seed")
    e.addBlockLootModifier("neapolitan:adzuki_sprouts")
    .replaceLoot("neapolitan:adzuki_beans", "createdelight:adzuki_beans_seed")
})