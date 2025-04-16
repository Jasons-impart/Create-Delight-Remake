LootJS.modifiers(e => {
    let villagechestlist = [
        "minecraft:chests/village/village_snowy_house",
        "minecraft:chests/village/village_taiga_house",
        "minecraft:chests/village/village_desert_house",
        "minecraft:chests/village/village_plains_house",
        "minecraft:chests/village/village_savanna_house"
    ]
    e.addLootTableModifier(villagechestlist)
    .removeLoot("festival_delicacies:red_bean")
    .replaceLoot("festival_delicacies:rice", "farmersdelight:rice")
})