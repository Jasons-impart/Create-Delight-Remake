ServerEvents.tags("minecraft:item", e => {
    e.add("createdelight:boiled_dumpling", [
        'festival_delicacies:pork_cabbage_boiled_dumpling',
        'festival_delicacies:pork_kelp_boiled_dumpling',
        'festival_delicacies:pork_potato_boiled_dumpling',
        'festival_delicacies:pork_fennel_boiled_dumpling',
        'festival_delicacies:mutton_boiled_dumpling',
        'festival_delicacies:chicken_mushroom_boiled_dumpling',
        'festival_delicacies:cod_boiled_dumpling',
        'festival_delicacies:salmon_boiled_dumpling',
        'festival_delicacies:eggplant_egg_boiled_dumpling',
        'festival_delicacies:mushroom_boiled_dumpling',
        'festival_delicacies:fungus_boiled_dumpling',
        'festival_delicacies:garlic_chive_egg_boiled_dumpling',
        'festival_delicacies:dandelion_leaf_boiled_dumpling',
        'festival_delicacies:pufferfish_boiled_dumpling',
        'festival_delicacies:rabbit_meat_boiled_dumpling'
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