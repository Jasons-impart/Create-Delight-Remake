ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "oceansdelight:cutting/pufferfish",
        "oceansdelight:cutting/tentacles",
        "oceanic_delight:sea_pickle_slices",
        "oceanic_delight:sea_pickle_roll_slice",
        "oceanic_delight:shrimp_cutting",
        "oceanic_delight:fish_egg_roll_slice",
        "oceanic_delight:wild_sea_grape_cutting",
        "oceansdelight:cooking/squid_rings"
    ])
    remove_recipes_output(e, [
        "culturaldelights:cooked_calamari"
    ])
    // 炙烤河豚寿司
    e.shapeless(
        "2x oceansdelight:fugu_roll",
        [
            "farmersdelight:cooked_rice",
            "2x crabbersdelight:cooked_pufferfish_slice"
        ]
    )
        .id("oceansdelight:food/fugu_roll")
    // 河豚寿司
    e.shapeless(
        "2x culturaldelights:pufferfish_roll",
        [
            "2x crabbersdelight:pufferfish_slice",
            "farmersdelight:cooked_rice",
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
    cutting_3(e, "oceanic_delight:squid_tentacles", [["oceansdelight:cut_tentacles", 3]])
    cutting_3(e, "oceanic_delight:glow_squid_tentacles", [["oceansdelight:cut_tentacles", 3]])
    e.recipes.create.mixing(
        "oceansdelight:squid_rings",
        [
            "extradelight:cooking_oil",
            "oceansdelight:cut_tentacles"
        ]
    ).heated().id("oceansdelight:cooking/squid_rings2")
    e.shapeless(
        "oceansdelight:tentacle_on_a_stick",
        [
            "minecraft:stick",
            "#forge:squid_tentacles"
        ]
    ).id("oceansdelight:tentacle_on_a_stick")
    cutting_3(e, 'oceansdelight:elder_guardian_slab', [
        ['oceansdelight:elder_guardian_slice', 9],
        ["minecraft:bone_meal"]
    ])
    cutting_3(e, 'oceansdelight:guardian', [
        ['oceansdelight:guardian_tail'],
        ["minecraft:bone_meal"]
    ])

    //Oceanic delight
    e.replaceInput({}, "oceanic_delight:shrimp", "crabbersdelight:shrimp")
    e.replaceInput({}, "culturaldelights:raw_calamari", "#forge:squid_tentacles")
    e.replaceInput({}, "culturaldelights:cooked_calamari", "oceanic_delight:grilled_squid_tentacles")
    e.replaceOutput({id: "culturaldelights:cutting/raw_calamari_from_glowsquid"}, "culturaldelights:raw_calamari", "oceanic_delight:glow_squid_tentacles")
    e.replaceOutput({id: "culturaldelights:cutting/raw_calamari"}, "culturaldelights:raw_calamari", "oceanic_delight:squid_tentacles")
    e.replaceInput({id: "crabbersdelight:sea_pickle_juice"}, "minecraft:sea_pickle", "#forge:sea_pickles")
    cutting_3(e, "minecraft:sea_pickle", [
        ['oceanic_delight:sea_pickle_slices', 2]
    ])
    cutting_3(e, "crabbersdelight:shrimp", [
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

    
})

ServerEvents.tags("item", e => {
    e.remove("forge:raw_fishes", [
        "crabbersdelight:pufferfish_slice"
    ])
    e.removeAllTagsFrom("culturaldelights:raw_calamari")
    e.add('forge:shrimps', 'crabbersdelight:shrimp')
    e.removeAllTagsFrom('oceanic_delight:shrimp')
})
