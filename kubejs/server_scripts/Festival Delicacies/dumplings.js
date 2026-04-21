ServerEvents.tags("item", e => {
    e.add("forge:vegetables/onion", [
        "festival_delicacies:greenonion",
        "dumplings_delight:greenonion"
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
        "festival_delicacies:wonton/pork_carrot_wonton_recipe_2",

        // Dumplings Delight: remove overlapping dumpling/wonton recipes, keep our unified versions below.
        "dumplings_delight:dumpling/chicken_mushroom_boiled_dumpling_recipe",
        "dumplings_delight:dumpling/cod_boiled_dumpling_recipe",
        "dumplings_delight:dumpling/dandelion_leaf_boiled_dumpling_recipe",
        "dumplings_delight:dumpling/eggplant_egg_boiled_dumpling_1",
        "dumplings_delight:dumpling/eggplant_egg_boiled_dumpling_2",
        "dumplings_delight:dumpling/fungus_boiled_dumpling_recipe",
        "dumplings_delight:dumpling/garlic_chive_egg_boiled_dumpling",
        "dumplings_delight:dumpling/mushroom_boiled_dumpling_recipe",
        "dumplings_delight:dumpling/mutton_boiled_dumpling_recipe",
        "dumplings_delight:dumpling/pork_cabbage_boiled_dumpling_recipe",
        "dumplings_delight:dumpling/pork_fennel_boiled_dumpling_recipe",
        "dumplings_delight:dumpling/pork_kelp_boiled_dumpling_recipe",
        "dumplings_delight:dumpling/pork_potato_boiled_dumpling_recipe",
        "dumplings_delight:dumpling/pufferfish_boiled_dumpling_recipe",
        "dumplings_delight:dumpling/rabbit_meat_boiled_dumpling_recipe",
        "dumplings_delight:dumpling/salmon_boiled_dumpling_recipe",
        "dumplings_delight:dumpling/beef_tomato_boiled_dumpling_recipe",
        "dumplings_delight:dumpling/calamari_boiled_dumpling_recipe_1",
        "dumplings_delight:dumpling/calamari_boiled_dumpling_recipe_2",
        "dumplings_delight:dumpling/calamari_boiled_dumpling_recipe_3",
        "dumplings_delight:dumpling/calamari_boiled_dumpling_recipe_4",
        "dumplings_delight:dumpling/pork_celery_boiled_dumpling_recipe",
        "dumplings_delight:dumpling/tomato_egg_boiled_dumpling_recipe",
        "dumplings_delight:wonton/pork_cabbage_wonton_recipe",
        "dumplings_delight:wonton/pork_carrot_wonton_recipe",
        "dumplings_delight:wonton/pork_mushroom_wonton_recipe",

        // Dumplings Delight: remove duplicated base produce/crafting routes.
        "dumplings_delight:chinese_cabbage_crate",
        "dumplings_delight:chinese_cabbage_from_crate",
        "dumplings_delight:chinese_cabbage_leaf",
        "dumplings_delight:eggplant_crate",
        "dumplings_delight:eggplant_from_crate",
        "dumplings_delight:eggplant_seeds",
        "dumplings_delight:fennel_crate",
        "dumplings_delight:fennel_from_crate",
        "dumplings_delight:garlic_chive_crate",
        "dumplings_delight:garlic_chive_from_crate",
        "dumplings_delight:garlic_clove",
        "dumplings_delight:garlic_crate",
        "dumplings_delight:garlic_from_crate",
        "dumplings_delight:greenonion_crate",
        "dumplings_delight:greenonion_from_crate",
        "dumplings_delight:vinegar"
    ])
    dumpling(e, [
        'create:dough',
        "butchercraft:pork_stewmeat",
        "#forge:vegetables/chinese_cabbage",
        "#forge:vegetables/onion"
    ], "2x dumplings_delight:pork_cabbage_boiled_dumpling", 1.0, 200)
    dumpling(e, [
        'create:dough',
        "butchercraft:pork_stewmeat",
        "minecraft:kelp",
        "#forge:vegetables/onion"
    ], "2x dumplings_delight:pork_kelp_boiled_dumpling", 1.0, 200)
    dumpling(e, [
        'create:dough',
        "minecraft:brown_mushroom",
        "butchercraft:pork_stewmeat",
        "#forge:vegetables/onion",
        "minecraft:potato"
    ], "2x dumplings_delight:pork_potato_boiled_dumpling", 1.0, 200)
    dumpling(e, [
        'create:dough',
        "butchercraft:pork_stewmeat",
        "festival_delicacies:fennel",
        "#forge:vegetables/onion"
    ], "dumplings_delight:pork_fennel_boiled_dumpling", 1.0, 200)
    dumpling(e, [
        'create:dough',
        "butchercraft:lamb_stewmeat",
        "#forge:vegetables/onion"
    ], "2x dumplings_delight:mutton_boiled_dumpling", 1.0, 200)
    dumpling(e, [
        'create:dough',
        "butchercraft:chicken_stewmeat",
        "minecraft:brown_mushroom",
        "#forge:vegetables/onion"
    ], "2x dumplings_delight:chicken_mushroom_boiled_dumpling", 1.0, 200)
    dumpling(e, [
        'create:dough',
        "farmersdelight:cod_slice",
        "minecraft:egg",
        "#forge:vegetables/onion"
    ], "2x dumplings_delight:cod_boiled_dumpling", 1.0, 200)
    dumpling(e, [
        'create:dough',
        "farmersdelight:salmon_slice",
        "minecraft:carrot"
    ], "2x dumplings_delight:salmon_boiled_dumpling", 1.0, 200)
    dumpling(e, [
        'create:dough',
        "minecraft:egg",
        "#forge:vegetables/onion",
        "#forge:vegetables/eggplant"
    ], "2x dumplings_delight:eggplant_egg_boiled_dumpling", 1.0, 200)
    dumpling(e, [
        'create:dough',
        "minecraft:brown_mushroom",
        "minecraft:red_mushroom",
        "#forge:vegetables/onion"
    ], "2x dumplings_delight:mushroom_boiled_dumpling", 1.0, 200)
    dumpling(e, [
        'create:dough',
        "minecraft:warped_fungus",
        "minecraft:crimson_fungus",
        "#forge:vegetables/onion"
    ], "2x dumplings_delight:fungus_boiled_dumpling", 1.0, 200)
    dumpling(e, [
        'create:dough',
        "festival_delicacies:garlic_chive",
        "minecraft:egg"
    ], "2x dumplings_delight:garlic_chive_egg_boiled_dumpling", 1.0, 200)
    dumpling(e, [
        'create:dough',
        "minecraft:dandelion",
        "minecraft:egg",
        "minecraft:brown_mushroom"
    ], "2x dumplings_delight:dandelion_leaf_boiled_dumpling", 1.0, 200)
    dumpling(e, [
        'create:dough',
        "butchercraft:rabbit_stewmeat",
        "#forge:vegetables/onion"
    ], "2x dumplings_delight:rabbit_meat_boiled_dumpling", 1.0, 200)
    dumpling(e, [
        "create:dough",
        "2x butchercraft:beef_stewmeat",
        "some_assembly_required:tomato_slices",
        "#forge:vegetables/onion"
    ], "2x dumplings_delight:beef_tomato_boiled_dumpling", 1.0, 200)
    dumpling(e, [
        "create:dough",
        "createdelight:raw_calamari",
        "minecraft:brown_mushroom",
        "#forge:vegetables/onion"
    ], "2x dumplings_delight:calamari_boiled_dumpling", 1.0, 200)
    dumpling(e, [
        "crabbersdelight:pufferfish_slice",
        "#forge:dough",
        "#forge:vegetables/onion"
    ], "2x dumplings_delight:pufferfish_boiled_dumpling", 1.0, 200)
    // dumpling(e, [
    //     "create:dough",
    //     "butchercraft:pork_stewmeat",
    //     "festival_delicacies:greenonion",
    //     "#forge:vegetables/onion"
    // ], "2x dumplings_delight:pork_celery_boiled_dumpling", 1.0, 200)
    dumpling(e, [
        "create:dough",
        "some_assembly_required:tomato_slices",
        "minecraft:egg",
        "#forge:vegetables/onion"
    ], "2x dumplings_delight:tomato_egg_boiled_dumpling", 1.0, 200)
    wonton(e, [
        'create:dough',
        "#forge:raw_pork",
        "#forge:vegetables/chinese_cabbage",
        "#forge:vegetables/onion",
        "minecraft:dried_kelp"
    ], "dumplings_delight:pork_cabbage_wonton", 1.0, 200)
    wonton(e, [
        'create:dough',
        "#forge:raw_pork",
        "minecraft:brown_mushroom",
        "#forge:vegetables/onion",
        "minecraft:dried_kelp"
    ], "dumplings_delight:pork_mushroom_wonton", 1.0, 200)
    wonton(e, [
        'create:dough',
        "#forge:raw_pork",
        "#forge:eggs",
        "#forge:vegetables/carrot",
        "minecraft:dried_kelp"
    ], "dumplings_delight:pork_carrot_wonton", 1.0, 200)
})
