ServerEvents.tags("item", e => {
    e.add("forge:vegetables/onion", [
        "festival_delicacies:greenonion"
    ])
})
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
        "festival_delicacies:dumpling_fd/fd_rabbit_meat_boiled_dumpling_recipe",
        "festival_delicacies:dumpling/pork_potato_boiled_dumpling_recipe_2",
        "festival_delicacies:dumpling/pork_potato_boiled_dumpling_recipe",
        "festival_delicacies:dumpling/pork_kelp_boiled_dumpling_recipe",
        "festival_delicacies:dumpling/pork_kelp_boiled_dumpling_recipe_2",
        "festival_delicacies:dumpling/chicken_mushroom_boiled_dumpling_recipe",
        "festival_delicacies:dumpling/chicken_mushroom_boiled_dumpling_recipe_2",
        "festival_delicacies:dumpling_fd/fd_pork_fennel_boiled_dumpling_recipe",
        "festival_delicacies:dumpling/pork_fennel_boiled_dumpling_recipe_2",
        "festival_delicacies:dumpling/pork_fennel_boiled_dumpling_recipe",
        "festival_delicacies:dumpling/mutton_boiled_dumpling_recipe_2",
        "festival_delicacies:dumpling/mutton_boiled_dumpling_recipe",
        "festival_delicacies:dumpling/cod_boiled_dumpling_recipe_2",
        "festival_delicacies:dumpling/cod_boiled_dumpling_recipe",
        "festival_delicacies:dumpling/rabbit_meat_boiled_dumpling_recipe",
        "festival_delicacies:dumpling/rabbit_meat_boiled_dumpling_recipe_2",
        "festival_delicacies:dumpling/pufferfish_boiled_dumpling_recipe",
        "festival_delicacies:dumpling/pufferfish_boiled_dumpling_recipe_2",
        "festival_delicacies:dumpling/eggplant_egg_boiled_dumpling",
        "festival_delicacies:dumpling/eggplant_egg_boiled_dumpling_2",
        "festival_delicacies:dumpling/mushroom_boiled_dumpling_recipe",
        "festival_delicacies:dumpling/mushroom_boiled_dumpling_recipe_2",
        "festival_delicacies:dumpling/fungus_boiled_dumpling_recipe",
        "festival_delicacies:dumpling/fungus_boiled_dumpling_recipe_2",
        "festival_delicacies:dumpling/salmon_boiled_dumpling_recipe",
        "festival_delicacies:dumpling/salmon_boiled_dumpling_recipe_2",
        "festival_delicacies:dumpling/dandelion_leaf_boiled_dumpling_recipe",
        "festival_delicacies:dumpling/dandelion_leaf_boiled_dumpling_recipe_2",
        "festival_delicacies:dumpling/garlic_chive_egg_boiled_dumpling",
        "festival_delicacies:dumpling/garlic_chive_egg_boiled_dumpling_2",
        "festival_delicacies:wonton_fd/fd_pork_cabbage_wonton_recipe",
        "festival_delicacies:wonton/pork_cabbage_wonton_recipe",
        "festival_delicacies:wonton/pork_cabbage_wonton_recipe_2",
        "festival_delicacies:wonton_fd/fd_pork_mushroom_wonton_recipe",
        "festival_delicacies:wonton/pork_mushroom_wonton_recipe_2",
        "festival_delicacies:wonton/pork_mushroom_wonton_recipe",
        "festival_delicacies:wonton_fd/fd_pork_carrot_wonton_recipe",
        "festival_delicacies:wonton/pork_carrot_wonton_recipe",
        "festival_delicacies:wonton/pork_carrot_wonton_recipe_2"
    ])
    dumpling(e, [
        'create:dough',
        "butchercraft:pork_stewmeat",
        "#forge:vegetables/chinese_cabbage",
        "#forge:vegetables/onion"
    ], "2x festival_delicacies:pork_cabbage_boiled_dumpling", 1.0, 200)
    dumpling(e, [
        'create:dough',
        "butchercraft:pork_stewmeat",
        "minecraft:kelp",
        "#forge:vegetables/onion"
    ], "2x festival_delicacies:pork_kelp_boiled_dumpling", 1.0, 200)
    dumpling(e, [
        'create:dough',
        "minecraft:brown_mushroom",
        "butchercraft:pork_stewmeat",
        "#forge:vegetables/onion",
        "minecraft:potato"
    ], "2x festival_delicacies:pork_potato_boiled_dumpling", 1.0, 200)
    dumpling(e, [
        'create:dough',
        "butchercraft:pork_stewmeat",
        "festival_delicacies:fennel",
        "#forge:vegetables/onion"
    ], "festival_delicacies:pork_fennel_boiled_dumpling", 1.0, 200)
    dumpling(e, [
        'create:dough',
        "butchercraft:lamb_stewmeat",
        "#forge:vegetables/onion"
    ], "2x festival_delicacies:mutton_boiled_dumpling", 1.0, 200)
    dumpling(e, [
        'create:dough',
        "butchercraft:chicken_stewmeat",
        "minecraft:brown_mushroom",
        "#forge:vegetables/onion"
    ], "2x festival_delicacies:chicken_mushroom_boiled_dumpling", 1.0, 200)
    dumpling(e, [
        'create:dough',
        "farmersdelight:cod_slice",
        "minecraft:egg",
        "#forge:vegetables/onion"
    ], "2x festival_delicacies:cod_boiled_dumpling", 1.0, 200)
    dumpling(e, [
        'create:dough',
        "farmersdelight:salmon_slice",
        "minecraft:carrot"
    ], "2x festival_delicacies:salmon_boiled_dumpling", 1.0, 200)
    dumpling(e, [
        'create:dough',
        "minecraft:egg",
        "#forge:vegetables/onion",
        "#forge:vegetables/eggplant"
    ], "2x festival_delicacies:eggplant_egg_boiled_dumpling", 1.0, 200)
    dumpling(e, [
        'create:dough',
        "minecraft:brown_mushroom",
        "minecraft:red_mushroom",
        "#forge:vegetables/onion"
    ], "2x festival_delicacies:mushroom_boiled_dumpling", 1.0, 200)
    dumpling(e, [
        'create:dough',
        "minecraft:warped_fungus",
        "minecraft:crimson_fungus",
        "#forge:vegetables/onion"
    ], "2x festival_delicacies:fungus_boiled_dumpling", 1.0, 200)
    dumpling(e, [
        'create:dough',
        "festival_delicacies:garlic_chive",
        "minecraft:egg"
    ], "2x festival_delicacies:garlic_chive_egg_boiled_dumpling", 1.0, 200)
    dumpling(e, [
        'create:dough',
        "minecraft:dandelion",
        "minecraft:egg",
        "minecraft:brown_mushroom"
    ], "2x festival_delicacies:dandelion_leaf_boiled_dumpling", 1.0, 200)
    dumpling(e, [
        'create:dough',
        "butchercraft:rabbit_stewmeat",
        "#forge:vegetables/onion"
    ], "2x festival_delicacies:rabbit_meat_boiled_dumpling", 1.0, 200)
    wonton(e, [
        'create:dough',
        "#forge:raw_pork",
        "#forge:vegetables/chinese_cabbage",
        "#forge:vegetables/onion",
        "minecraft:dried_kelp"
    ], "festival_delicacies:pork_cabbage_wonton", 1.0, 200)
    wonton(e, [
        'create:dough',
        "#forge:raw_pork",
        "minecraft:brown_mushroom",
        "#forge:vegetables/onion",
        "minecraft:dried_kelp"
    ], "festival_delicacies:pork_mushroom_wonton", 1.0, 200)
    wonton(e, [
        'create:dough',
        "#forge:raw_pork",
        "#forge:eggs",
        "#forge:vegetables/carrot",
        "minecraft:dried_kelp"
    ], "festival_delicacies:pork_carrot_wonton", 1.0, 200)
})