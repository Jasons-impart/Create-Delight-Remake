ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "oceanic_delight:egg_roll",
        "oceanic_delight:fried_shrimp",
        "tetracelium:shrimp_cutting",
        "oceanic_delight:shrimp_cutting",
        "oceanic_delight:fish_egg_roll",
        "oceanic_delight:fish_egg_roll_slice",
        "oceanic_delight:shrimp_roll",
        "oceanic_delight:sea_pickle_roll"
    ])
    e.replaceInput({id: "oceanic_delight:fish_egg_noodle_soup"}, "#forge:pasta", 'createdelight:vermicelli')
    // 河豚水饺
    dumpling(e, [
        "crabbersdelight:pufferfish_slice",
        "#forge:dough",
        "#forge:vegetables/onion"
    ], "2x festival_delicacies:pufferfish_boiled_dumpling", 1.0, 200)
    // 鱿鱼须相关
    cutting_2(e, "oceanic_delight:squid_tentacles", [["createdelight:raw_calamari", 3]])
    cutting_2(e, "oceanic_delight:glow_squid_tentacles", [["createdelight:raw_calamari", 3]])

    //Oceanic delight
    e.replaceInput({}, "oceanic_delight:shrimp", "oceanic_delight:shrimp_slices")
    e.replaceInput({id: "crabbersdelight:sea_pickle_juice"}, "minecraft:sea_pickle", "#forge:sea_pickles")
    cutting_2(e, "crabbersdelight:cooked_shrimp", [["oceanic_delight:shrimp_slices", 1]])
    // 虾仁薯片
    e.recipes.create.mixing(
        'oceanic_delight:shrimp_chips',
        [
            '#crabbersdelight:shrimps',
            'casualness_delight:potato_chip'
        ]
    ).heated().id("oceanic_delight:shrimp_chips")
    // 炸虾仁系列
    e.recipes.create.mixing(
        "createdelightcore:unfried_shrimp",
        [
            'oceanic_delight:shrimp_slices',
            'bakeries:flour',
            FluidIngredients("forge:egg_yolk", 100)
        ]
    ).id("createdelightcore:unfried_shrimp")
    // 鲑鱼搅拌得到鲑鱼籽
    e.recipes.create.mixing(
        'oceanic_delight:salmon_eggs',
        [
            'minecraft:salmon'
        ]
    ).id("createdelight:mixing/salmon_eggs")
})

ServerEvents.tags("item", e => {
    e.remove("forge:raw_fishes", [
        "crabbersdelight:pufferfish_slice"
    ])
    e.removeAllTagsFrom('oceanic_delight:shrimp')
})
