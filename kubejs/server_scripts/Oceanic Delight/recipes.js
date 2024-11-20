ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "oceanic_delight:sea_pickle_slices",
        "oceanic_delight:sea_pickle_roll_slice",
        "oceanic_delight:shrimp_cutting",
        "oceanic_delight:fish_egg_roll_slice",
        "oceanic_delight:wild_sea_grape_cutting",
        "oceanic_delight:egg_roll",
        "oceanic_delight:fried_shrimp"
    ])
    remove_recipes_output(e, [
        "culturaldelights:cooked_calamari"
    ])
    // 炙烤河豚寿司
    e.shapeless(
        "2x createdelight:fugu_roll",
        [
            "createdelight:empty_riceball",
            "2x crabbersdelight:cooked_pufferfish_slice"
        ]
    )
        .id("createdelight:food/fugu_roll")
    // 河豚寿司
    e.shapeless(
        "2x culturaldelights:pufferfish_roll",
        [
            "2x crabbersdelight:pufferfish_slice",
            "createdelight:empty_riceball",
        ]
    )
        .id("culturaldelights:pufferfish_roll")
    // 河豚水饺
    dumpling(e, [
        "crabbersdelight:pufferfish_slice",
        "#forge:dough",
        "#forge:vegetables/onion"
    ], "2x festival_delicacies:pufferfish_boiled_dumpling", 1.0, 200)
    // 鱿鱼须相关
    cutting_3(e, "oceanic_delight:squid_tentacles", [["createdelight:raw_calamari", 3]])
    cutting_3(e, "oceanic_delight:glow_squid_tentacles", [["createdelight:raw_calamari", 3]])

    //Oceanic delight
    e.replaceInput({}, "oceanic_delight:shrimp", "oceanic_delight:shrimp_slices")
    e.replaceInput({}, "culturaldelights:raw_calamari", "#forge:tentacles")
    e.replaceInput({}, "culturaldelights:cooked_calamari", "oceanic_delight:grilled_squid_tentacles")
    e.replaceOutput({id: "culturaldelights:cutting/raw_calamari_from_glowsquid"}, "culturaldelights:raw_calamari", "oceanic_delight:glow_squid_tentacles")
    e.replaceOutput({id: "culturaldelights:cutting/raw_calamari"}, "culturaldelights:raw_calamari", "oceanic_delight:squid_tentacles")
    e.replaceInput({id: "crabbersdelight:sea_pickle_juice"}, "minecraft:sea_pickle", "#forge:sea_pickles")
    cutting_3(e, "minecraft:sea_pickle", [
        ['oceanic_delight:sea_pickle_slices', 2]
    ])
    cutting_3(e, 'crabbersdelight:cooked_shrimp', [
        ['oceanic_delight:shrimp_slices', 2]
    ])
    cutting_3(e, 'oceanic_delight:sea_pickle_roll', [
        ['oceanic_delight:sea_pickle_roll_slice', 3]
    ])
    cutting_3(e, 'oceanic_delight:fish_egg_roll', [
        ['oceanic_delight:fish_egg_roll_slice', 3]
    ])
    cutting_3(e, 'oceanic_delight:wild_sea_grape', [
        ['oceanic_delight:sea_grape'],
        ['minecraft:kelp', 3],
        ['minecraft:kelp', 2, 0.6]
    ])
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
        "createdelight:unfried_shrimp",
        [
            'oceanic_delight:shrimp_slices',
            "create:wheat_flour",
            Fluid.of("createdelight:egg_yolk", 100)
        ]
    ).id("createdelight:unfried_shrimp")
})

ServerEvents.tags("item", e => {
    e.remove("forge:raw_fishes", [
        "crabbersdelight:pufferfish_slice"
    ])
    e.removeAllTagsFrom("culturaldelights:raw_calamari")
    e.removeAllTagsFrom('oceanic_delight:shrimp')
})