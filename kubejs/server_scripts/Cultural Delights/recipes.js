ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "culturaldelights:cutting/raw_calamari",
        "culturaldelights:cutting/raw_calamari_from_glowsquid",
        "culturaldelights:cutting/wild_cucumbers"
    ])
    e.recipes.kubejs.shapeless(
        "createdelight:raw_empanada",
        [
            "2x culturaldelights:corn_dough",
            "#culturaldelights:avocados",
            "#forge:vegetables/tomato",
            "#forge:vegetables/onion"
        ]
    ).id("culturaldelights:cooking/empanada")
    e.recipes.kubejs.shapeless(
        "2x culturaldelights:egg_roll",
        [
            '2x #forge:cooked_eggs',
            'createdelight:empty_riceball',
            "minecraft:dried_kelp"
        ]
    ).id("culturaldelights:egg_roll")
    cutting_2(e, 'culturaldelights:glow_squid', [
        ['oceanic_delight:glow_squid_tentacles', 2],
        ['minecraft:glow_ink_sac', 3, 0.5]
    ])
    cutting_2(e, 'culturaldelights:squid', [
        ['oceanic_delight:squid_tentacles', 2],
        ['minecraft:ink_sac', 3, 0.5]
    ])
    e.custom({
        type: "farmersdelight:cutting",
        ingredients: [{ item: "culturaldelights:wild_cucumbers" }],
        result: [{item: "vintagedelight:cucumber_seeds"}, {item: "minecraft:green_dye"}],
        tool: { type: "farmersdelight:tool_action", action: "blade_cut" } 
    }).id("culturaldelights:cutting/wild_cucumbers")
    e.recipes.farmersdelight.cutting(
        "culturaldelights:wild_cucumbers",
        "#forge:tools/knives",
        [
            "vintagedelight:cucumber_seeds",
            "minecraft:green_dye"
        ]
    ).id("culturaldelights:cutting/wild_cucumbers_2")
    // 热带鱼寿司
    e.shapeless(
        "2x culturaldelights:tropical_roll",
        [
            "minecraft:dried_kelp",
            "createdelight:empty_riceball",
            "2x crabbersdelight:tropical_fish_slice"
        ]
    )
        .id("culturaldelights:tropical_roll")
})