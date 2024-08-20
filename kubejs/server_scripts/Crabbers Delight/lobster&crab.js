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
    e.recipes.farmersdelight.cutting(
        "crabbersdelight:cooked_crab",
        "#forge:tools/knives",
        [
            "4x crabbersdelight:crab_legs",
            "2x quark:crab_shell",
            Item.of("crabbersdelight:crab_legs").withChance(0.3)
        ]
    ).id("farmersdelight:cutting/cooked_crab")

    e.recipes.farmersdelight.cutting(
        "crabbersdelight:clawster",
        "#forge:tools/knives",
        [
            "alexsmobs:lobster_tail",
            Item.of("alexsmobs:lobster_tail").withChance(0.3)
        ]
    ).id("alexmobs:cutting/lobster_tail")
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
