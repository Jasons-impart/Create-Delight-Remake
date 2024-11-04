ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "culturaldelights:cutting/raw_calamari",
        "culturaldelights:cutting/raw_calamari_from_glowsquid"
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
    cutting_3(e, 'culturaldelights:glow_squid', [
        ['oceanic_delight:glow_squid_tentacles', 2],
        ['minecraft:glow_ink_sac', 3, 0.5]
    ])
    cutting_3(e, 'culturaldelights:squid', [
        ['oceanic_delight:squid_tentacles', 2],
        ['minecraft:ink_sac', 3, 0.5]
    ])    
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