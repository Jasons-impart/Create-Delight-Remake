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
    e.recipes.create.filling(
        'farmersdelight:milk_bottle',
        [
            Fluid.of("minecraft:milk", 250),
            "glass_bottle"
        ]
    ).id("create:filling/compat/farmersdelight/milk_bottle")
})

LootJS.modifiers(e => {
    e.addLootTableModifier("minecraft:chests/village/village_plains_house")
        .replaceLoot("festival_delicacies:rice", "farmersdelight:rice")
    e.addLootTableModifier("minecraft:chests/village/village_taiga_house")
        .replaceLoot("festival_delicacies:rice", "farmersdelight:rice")
})