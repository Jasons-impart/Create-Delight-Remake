LootJS.modifiers(e => {
    e.addBlockLootModifier("culturaldelights:wild_cucumbers")
        .replaceLoot("culturaldelights:cucumber_seeds", "vintagedelight:cucumber_seeds")
        .replaceLoot("culturaldelights:cucumber", "vintagedelight:cucumber")
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
