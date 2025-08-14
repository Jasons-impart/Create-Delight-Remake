LootJS.modifiers(e => {
    e.addBlockLootModifier("vintagedelight:oat_crop")
        .customCondition({
            condition: "minecraft:block_state_property",
            block: "vintagedelight:oat_crop",
            properties: {
                age: "7"
            }
        })
        .randomChance(0.75)
        .addLoot("vintagedelight:oat_seeds")
})
