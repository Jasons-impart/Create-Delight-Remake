ServerEvents.tags("minecraft:item", e => {
    e.add("createdelight:boiled_dumpling", [
        'dumplings_delight:pork_cabbage_boiled_dumpling',
        'dumplings_delight:pork_kelp_boiled_dumpling',
        'dumplings_delight:pork_potato_boiled_dumpling',
        'dumplings_delight:pork_fennel_boiled_dumpling',
        'dumplings_delight:mutton_boiled_dumpling',
        'dumplings_delight:chicken_mushroom_boiled_dumpling',
        'dumplings_delight:cod_boiled_dumpling',
        'dumplings_delight:salmon_boiled_dumpling',
        'dumplings_delight:eggplant_egg_boiled_dumpling',
        'dumplings_delight:mushroom_boiled_dumpling',
        'dumplings_delight:fungus_boiled_dumpling',
        'dumplings_delight:garlic_chive_egg_boiled_dumpling',
        'dumplings_delight:dandelion_leaf_boiled_dumpling',
        'dumplings_delight:pufferfish_boiled_dumpling',
        'dumplings_delight:rabbit_meat_boiled_dumpling'
    ])
    e.add("forge:seeds", 
        [
            'festival_delicacies:chinese_cabbage_seeds',
            'festival_delicacies:eggplant_seeds',
            'festival_delicacies:garlic_chive_seeds',
            'festival_delicacies:fennel_seeds',
            'festival_delicacies:garlic'
        ]
    )
})

ServerEvents.tags("minecraft:block", e => {
    e.add("minecraft:crops", [
        "festival_delicacies:fennel",
        "festival_delicacies:chinese_cabbage",
        "festival_delicacies:eggplant",
        "festival_delicacies:garlic_chive",
        "festival_delicacies:garlic",
        "festival_delicacies:greenonion"
    ])
})
