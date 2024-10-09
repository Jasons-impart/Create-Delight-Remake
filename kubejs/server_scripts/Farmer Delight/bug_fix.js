ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "farmersdelight:cutting/sugar_cane_alt"
    ])
    cutting(e, 'minecraft:sugar_cane', 
        [
            ['minecraft:sugar'],
            ['minecraft:sugar', 1, 0.25]
        ]
    )
})

LootJS.modifiers(e => {
    e.addLootTableModifier("minecraft:chests/village/village_plains_house")
        .replaceLoot("festival_delicacies:rice", "farmersdelight:rice")
    e.addLootTableModifier("minecraft:chests/village/village_taiga_house")
        .replaceLoot("festival_delicacies:rice", "farmersdelight:rice")
    e.addLootTableModifier("minecraft:chests/village/village_butcher")
        .replaceLoot("extradelight:flour", "create:wheat_flour")
})

ServerEvents.tags("block", e => {
    e.removeAllTagsFrom([
        "design_decor:industrial_plating_block"
    ])
})
ServerEvents.tags("item", e => {
    e.removeAllTagsFrom([
        "design_decor:industrial_plating_block"
    ])
})