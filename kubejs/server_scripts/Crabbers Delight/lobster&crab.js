ServerEvents.tags("item", e => {
    e.add("crabbersdelight:cooked_seafood", [
        "alexsmobs:cooked_lobster_tail"
    ])
    e.add("crabbersdelight:raw_seafood", [
        "alexsmobs:lobster_tail"
    ])
    e.add("crabbersdelight:lobster", [
        "alexsmobs:lobster_tail",
        "crabbersdelight:clawster"
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
        "crabbersdelight:clawster",
        "crabbersdelight:cooked_clawster"
    ])
    e.add("crabbersdelight:crab", [
        "crabbersdelight:crab",
        "crabbersdelight:cooked_crab",
        "crabbersdelight:crab_legs"
    ])
})
ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "farmersdelight:cooking/jar_of_pickles"
    ])
    e.replaceInput({ id: "farmersdelight:cooking/stuffed_nautilus_shell" }, "#forge:cooked_fishes", "#alexsmobs:shoebill_foodstuffs")
    e.replaceInput({ id: "farmersdelight:cooking/crab_cakes" }, "crabbersdelight:crab", "#crabbersdelight:crab")
    cutting(e, "crabbersdelight:cooked_crab", [
        ["crabbersdelight:crab_legs", 4],
        ["quark:crab_shell", 2],
        ["crabbersdelight:crab_legs", 1, 0.3]
    ])
    cutting(e, "crabbersdelight:clawster", [
        ["alexsmobs:lobster_tail"],
        ["alexsmobs:lobster_tail", 1, 0.3]
    ])
    e.recipes.farmersdelight.cooking(
        [
            "#crabbersdelight:lobster",
            "crabbersdelight:shrimp",
            "#forge:vegetables/onion",
            "farmersdelight:rice",
            "#forge:cooked_pork"
        ], "crabbersdelight:seafood_gumbo", 1.0, 200, "bowl"
    ).id("farmersdelight:cooking/seafood_gumbo")
})
