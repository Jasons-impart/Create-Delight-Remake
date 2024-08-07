ServerEvents.recipes(e => {
    remove_recipes_output(e, [
        "candlelight:butter"
    ])

    // 搅拌合成：番茄酱（液体）
    e.recipes.create.mixing(
        [Fluid.of("create_central_kitchen:tomato_sauce", 250)],
        ["2x #forge:crops/tomato"]
    )
        .id("create_central_kitchen:mixing/tomato_sauce")
})
LootJS.modifiers(e => {
    e.addLootTableModifier("minecraft:chests/village/village_plains_house")
        .replaceLoot('festival_delicacies:rice', 'farmersdelight:rice')
    e.addLootTableModifier("minecraft:chests/village/village_taiga_house")
        .replaceLoot('festival_delicacies:rice', 'farmersdelight:rice')
    e.addLootTableModifier("minecraft:chests/village/village_butcher")
        .replaceLoot('extradelight:flour', "create:wheat_flour")
})