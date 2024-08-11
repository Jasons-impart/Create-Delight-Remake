ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "festival_delicacies:dumpling_fd/fd_pork_cabbage_boiled_dumpling_recipe",
        "festival_delicacies:dumpling/pork_cabbage_boiled_dumpling_recipe",
        "festival_delicacies:dumpling/pork_cabbage_boiled_dumpling_recipe_2",
        "festival_delicacies:dumpling_fd/fd_pork_kelp_boiled_dumpling_recipe",
        "festival_delicacies:dumpling_fd/fd_pork_potato_boiled_dumpling_recipe",
        "festival_delicacies:dumpling_fd/fd_mutton_boiled_dumpling_recipe",
        "festival_delicacies:dumpling_fd/fd_chicken_mushroom_boiled_dumpling_recipe",
        "festival_delicacies:dumpling_fd/fd_cod_boiled_dumpling_recipe",
        "festival_delicacies:dumpling_fd/fd_salmon_boiled_dumpling_recipe",
        "festival_delicacies:dumpling_fd/fd_eggplant_egg_boiled_dumpling",
        "festival_delicacies:dumpling_fd/fd_mushroom_boiled_dumpling_recipe",
        "festival_delicacies:dumpling_fd/fd_fungus_boiled_dumpling_recipe",
        "festival_delicacies:dumpling_fd/fd_garlic_chive_egg_boiled_dumpling",
        "festival_delicacies:dumpling_fd/fd_dandelion_leaf_boiled_dumpling_recipe",
        "festival_delicacies:dumpling_fd/fd_pufferfish_boiled_dumpling_recipe",
        "festival_delicacies:dumpling_fd/fd_rabbit_meat_boiled_dumpling_recipe"
        ])
    dumpling(e, [
        "#forge:dough",
        'butchercraft:pork_stewmeat',
        "#forge:vegetables/cabbage",
        "#forge:vegetables/greenonion"
    ], 'festival_delicacies:pork_cabbage_boiled_dumpling', 1.0, 200)
    dumpling(e,[
        "#forge:dough",
        'butchercraft:pork_stewmeat',
        'minecraft:kelp',
        '#forge:vegetables/greenonion'
    ], 'festival_delicacies:pork_kelp_boiled_dumpling', 1.0, 200)
    dumpling(e,[
        "#forge:dough",
        'minecraft:brown_mushroom',
        'butchercraft:pork_stewmeat',
        '#forge:vegetables/greenonion',
        'minecraft:potato'
    ], 'festival_delicacies:pork_potato_boiled_dumpling', 1.0, 200)
    dumpling(e,[
        "#forge:dough",
        'butchercraft:pork_stewmeat',
        'festival_delicacies:fennel',
        '#forge:vegetables/greenonion'
    ], 'festival_delicacies:pork_fennel_boiled_dumpling', 1.0, 200)
    dumpling(e,[
        "#forge:dough",
        'butchercraft:lamb_stewmeat',
        '#forge:vegetables/greenonion'
    ], 'festival_delicacies:mutton_boiled_dumpling', 1.0, 200)
    dumpling(e,[
        "#forge:dough",
        'butchercraft:chicken_stewmeat',
        'minecraft:brown_mushroom',
        '#forge:vegetables/greenonion'
    ], 'festival_delicacies:chicken_mushroom_boiled_dumpling', 1.0, 200)
    dumpling(e,[
        "#forge:dough",
        'farmersdelight:cod_slice',
        'minecraft:egg',
        '#forge:vegetables/greenonion'
    ], 'festival_delicacies:cod_boiled_dumpling', 1.0, 200)
    dumpling(e,[
        "#forge:dough",
        'farmersdelight:salmon_slice',
        'minecraft:carrot'
    ], 'festival_delicacies:salmon_boiled_dumpling', 1.0, 200)
    dumpling(e,[
        "#forge:dough",
        'minecraft:egg',
        '#forge:vegetables/greenonion',
        'culturaldelights:cut_eggplant'
    ], 'festival_delicacies:eggplant_egg_boiled_dumpling', 1.0, 200)
    dumpling(e,[
        "#forge:dough",
        'minecraft:brown_mushroom',
        'minecraft:red_mushroom',
        '#forge:vegetables/greenonion'
    ], 'festival_delicacies:mushroom_boiled_dumpling', 1.0, 200)
    dumpling(e,[
        "#forge:dough",
        'minecraft:warped_fungus',
        'minecraft:crimson_fungus',
        '#forge:vegetables/greenonion'
    ], 'festival_delicacies:fungus_boiled_dumpling', 1.0, 200)
    dumpling(e,[
        "#forge:dough",
        'festival_delicacies:garlic_chive',
        'minecraft:egg'
    ], 'festival_delicacies:garlic_chive_egg_boiled_dumpling', 1.0, 200)
    dumpling(e,[
        "#forge:dough",
        'minecraft:dandelion',
        'minecraft:egg',
        'minecraft:brown_mushroom'
    ], 'festival_delicacies:dandelion_leaf_boiled_dumpling', 1.0, 200)
    dumpling(e,[
        "#forge:dough",
        'butchercraft:rabbit_stewmeat',
        '#forge:vegetables/greenonion'
    ], 'festival_delicacies:rabbit_meat_boiled_dumpling', 1.0, 200)
})