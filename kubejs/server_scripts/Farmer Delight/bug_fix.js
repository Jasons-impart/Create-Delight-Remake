ServerEvents.recipes(e => {
})

LootJS.modifiers(e => {
    e.addLootTableModifier("minecraft:chests/village/village_plains_house")
        .replaceLoot("festival_delicacies:rice", "farmersdelight:rice")
    e.addLootTableModifier("minecraft:chests/village/village_taiga_house")
        .replaceLoot("festival_delicacies:rice", "farmersdelight:rice")
    e.addLootTableModifier("minecraft:chests/village/village_butcher")
        .replaceLoot("extradelight:flour", "create:wheat_flour")
})
