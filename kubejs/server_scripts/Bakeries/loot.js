LootJS.modifiers(e => {
    e.addBlockLootModifier("bakeries:salt_ore")
        .replaceLoot("bakeries:salt", "vintagedelight:salt")
    e.addBlockLootModifier("bakeries:deepslate_salt_ore")
        .replaceLoot("bakeries:salt", "vintagedelight:salt")
})