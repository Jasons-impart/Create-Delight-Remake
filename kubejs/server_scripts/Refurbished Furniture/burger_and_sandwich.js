ServerEvents.recipes(e => {
    e.replaceInput({
        output: [
            "vintagedelight:deluxe_burger",
            "alexsdelight:bison_burger",
            "vintagedelight:cheese_burger",
            "farmersdelight:hamburger",
            "silentsdelight:heartburger",
            "culturaldelights:eggplant_burger",
        ]
    }, "#forge:bread", "some_assembly_required:burger_bun")
    //汉堡
    combination(e, [
        "some_assembly_required:burger_bun",
        "alexsdelight:bison_patty",
        "#forge:salad_ingredients",
        "#forge:vegetables/tomato",
        "#forge:vegetables/beetroot"
    ], "alexsdelight:bison_burger", 1)
    combination(e, [
        "some_assembly_required:burger_bun",
        "#culturaldelights:smoked_regular_eggplants",
        "#forge:salad_ingredients",
        "#forge:vegetables/tomato"
    ], "culturaldelights:eggplant_burger", 1)
    combination(e, [
        "some_assembly_required:burger_bun",
        "farmersdelight:beef_patty",
        "#forge:salad_ingredients",
        "#forge:vegetables/tomato",
        "#forge:vegetables/onion"
    ], "farmersdelight:hamburger", 1)
    combination(e, [
        "some_assembly_required:burger_bun",
        "silentsdelight:warden_heart_patty",
        "#forge:salad_ingredients",
        "#forge:vegetables/tomato",
        "#forge:vegetables/onion"
    ], "silentsdelight:heartburger", 1)
    combination(e, [
        "some_assembly_required:burger_bun",
        "ad_astra:cheese",
        "farmersdelight:beef_patty",
        "#forge:salad_ingredients",
        "#forge:vegetables/tomato",
        "#forge:vegetables/onion"
    ], "vintagedelight:cheese_burger", 1)
    combination(e, [
        "some_assembly_required:burger_bun",
        "#forge:cooked_bacon",
        "farmersdelight:beef_patty",
        "#forge:salad_ingredients",
        "#forge:vegetables/tomato",
        "#forge:vegetables/onion",
        "ad_astra:cheese",
        "#forge:cooked_eggs"
    ], "vintagedelight:deluxe_burger", 1)
    combination(e, [
        "some_assembly_required:burger_bun",
        "collectorsreap:baked_portobello_cap",
        "#forge:salad_ingredients",
        "#forge:vegetables/tomato",
        "#forge:vegetables/onion",
    ], "collectorsreap:portobello_burger", 1)
    combination(e, [
        "some_assembly_required:burger_bun",
        "collectorsreap:chieftain_claw",
        "farmersdelight:beef_patty",
        "#forge:salad_ingredients",
        "#forge:vegetables/tomato",
        "#forge:vegetables/onion",
    ], "collectorsreap:land_and_sea_burger", 1)
    //三明治
    combination(e, [
        "minecraft:bread",
        "#alexsdelight:cooked_kangaroo",
        "#alexsdelight:cooked_kangaroo",
        "#forge:salad_ingredients",
        "#forge:vegetables/carrot"
    ], "alexsmobs:kangaroo_burger", 1)
    combination(e, [
        "minecraft:bread",
        "farmersdelight:red_mushroom_colony",
        "farmersdelight:red_mushroom_colony",
        "#alexsdelight:cooked_bunfungus"
    ], "alexsdelight:bunfungus_sandwich", 1)
    combination(e, [
        "minecraft:bread",
        "#forge:cooked_mutton",
        "#forge:cooked_eggs",
        "#forge:vegetables/beetroot"
    ], "culturaldelights:mutton_sandwich", 1)
    combination(e, [
        "minecraft:bread",
        "#forge:cooked_eggs",
        "#forge:cooked_eggs"
    ], "farmersdelight:egg_sandwich", 1)
    combination(e, [
        "minecraft:bread",
        "#forge:cooked_chicken",
        "#forge:salad_ingredients",
        "#forge:vegetables/carrot"
    ], "farmersdelight:chicken_sandwich", 1)
    combination(e, [
        "minecraft:bread",
        "#forge:cooked_bacon",
        "#forge:salad_ingredients",
        "#forge:vegetables/tomato"
    ], "farmersdelight:bacon_sandwich", 1)
    combination(e, [
        "minecraft:bread",
        "#forge:shrimps",
        "#forge:eggs",
        "#forge:salad_ingredients",
        "#forge:vegetables/tomato",
        "#forge:vegetables/onion"
    ], "collectorsreap:prawn_po_boy", 1)
    combination(e, [
        "minecraft:bread",
        "alexscaves:tectonic_shard",
        "#forge:salad_ingredients",
        "#forge:ham"
    ], "cavedelight:lux_and_ham_sandwich", 1)
    combination(e, [
        "minecraft:bread",
        "alexscaves:pine_nuts",
        "alexscaves:pine_nuts",
        "alexscaves:pine_nuts",
        "alexscaves:pewen_sap"
    ], "cavedelight:pine_and_sap_sandwich", 1)
    combination(e, [
        "minecraft:bread",
        "miners_delight:vegan_patty",
        "#forge:vegetables/cabbage",
        "#forge:vegetables/tomato",
        "#forge:vegetables/onion"
    ], "miners_delight:vegan_hamburger", 1)
    combination(e, [
        "minecraft:bread",
        "culturaldelights:cooked_squid"
    ], "miners_delight:squid_sandwich", 1)
    combination(e, [
        "minecraft:bread",
        "miners_delight:cooked_arthropod",
        "miners_delight:cooked_arthropod"
    ], "miners_delight:insect_sandwich", 1)

})