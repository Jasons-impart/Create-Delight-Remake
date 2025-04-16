ServerEvents.tags("item", e => {
    e.add("crabbersdelight:cooked_seafood", [
        "alexsmobs:cooked_lobster_tail",
        'oceanic_delight:shrimp_slices'
    ])
    e.add("crabbersdelight:raw_seafood", [
        "alexsmobs:lobster_tail"
    ])
    e.add("crabbersdelight:lobster", [
        "crabbersdelight:clawster",
        'crabbersdelight:cooked_clawster',
        "alexsmobs:lobster_tail",
        "alexsmobs:cooked_lobster_tail",
        'alexscaves:trilocaris_tail',
        'alexscaves:cooked_trilocaris_tail'
    ])
    e.add("alexsmobs:seal_foodstuffs", [
        "crabbersdelight:clawster",
        "crabbersdelight:cooked_crab",
        "crabbersdelight:crab",
        "crabbersdelight:crab_legs",
        "crabbersdelight:raw_clam_meat",
        "crabbersdelight:cooked_clam_meat",
        "crabbersdelight:shrimp",
        "crabbersdelight:cooked_shrimp",
        'oceanic_delight:shrimp_slices',
        "crabbersdelight:clawster",
        "crabbersdelight:cooked_clawster"
    ])
    e.add("crabbersdelight:crab", [
        "crabbersdelight:crab",
        "crabbersdelight:cooked_crab",
        "crabbersdelight:crab_legs"
    ])
    e.add("crabbersdelight:shrimps", [
        'crabbersdelight:shrimp',
        'crabbersdelight:cooked_shrimp',
        'oceanic_delight:shrimp_slices'
    ])
    e.add("forge:shrimps", [
        'crabbersdelight:shrimp',
        'crabbersdelight:cooked_shrimp',
        'oceanic_delight:shrimp_slices'
    ])
    e.add("forge:crab_meat", "crabbersdelight:crab_legs")

    e.add("forge:crab_leg", "crabbersdelight:crab_legs")
})
ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "alexsmobs:cooked_lobster_tail_campfire",
        "alexsmobs:cooked_lobster_tail_smoke"
    ])
    e.replaceInput({ id: "farmersdelight:cooking/stuffed_nautilus_shell" }, "#forge:cooked_fishes", "#alexsmobs:shoebill_foodstuffs")
    e.replaceInput({ id: "farmersdelight:cooking/crab_cakes" }, "crabbersdelight:crab", "#crabbersdelight:crab")
    cutting(e, "crabbersdelight:clawster", [
        ["alexsmobs:lobster_tail"],
        ["alexsmobs:lobster_tail", 1, 0.3]
    ])
    cutting(e, 'crabbersdelight:cooked_clawster', [
        ['alexsmobs:cooked_lobster_tail'],
        ['alexsmobs:cooked_lobster_tail', 1, 0.3]
    ])
    e.recipes.farmersdelight.cooking(
        [
            "#crabbersdelight:lobster",
            "#crabbersdelight:shrimps",
            "#forge:vegetables/onion",
            "farmersdelight:rice",
            "#forge:cooked_pork"
        ], "crabbersdelight:seafood_gumbo", 1.0, 200, "bowl"
    ).id("farmersdelight:cooking/seafood_gumbo")
    e.recipes.farmersdelight.cooking(
        "alexsmobs:lobster_tail",
        'alexsmobs:cooked_lobster_tail',
        1.0, 200
    ).id("alexsmobs:cooked_lobster_tail")
})
