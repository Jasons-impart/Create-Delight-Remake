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

ServerEvents.compostableRecipes(e => {
    let compostables = [
       ['createdelight:adzuki_beans_seed', 0.3],
       ['festival_delicacies:eggplant_seeds', 0.3],
       ['festival_delicacies:chinese_cabbage_seeds', 0.3],
       ['festival_delicacies:garlic_chive_seeds', 0.3],
       ['festival_delicacies:fennel_seeds', 0.3],
       ['createdelight:artemisia_argyi_seed', 0.3],
       ['festival_delicacies:chinese_cabbage', 0.65],
       ['festival_delicacies:garlic_chive', 0.65],
       ['festival_delicacies:fennel', 0.65],
       ['festival_delicacies:eggplant', 0.65],
       ['festival_delicacies:artemisia_argyi', 0.5],
       ['festival_delicacies:garlic', 0.5],
       ['festival_delicacies:greenonion', 0.5],
       ['festival_delicacies:chinese_cabbage_leaf', 0.5],
       ['festival_delicacies:jujube', 0.5],
    ]
    compostables.forEach(compostable => {
        e.add(compostable[0], compostable[1]) 
    })
})