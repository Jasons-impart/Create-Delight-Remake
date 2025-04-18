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
        "#forge:salad_ingredients",
        "#forge:crops/tomato",
        "#forge:crops/beetroot",
        "alexsdelight:bison_patty"], "alexsdelight:bison_burger", 1)
    combination(e, [
        "some_assembly_required:burger_bun",
        "#culturaldelights:smoked_regular_eggplants",
        "#forge:salad_ingredients",
        "#forge:crops/tomato"
    ], "culturaldelights:eggplant_burger", 1)
    combination(e, [
        "some_assembly_required:burger_bun",
        "farmersdelight:beef_patty",
        "#forge:salad_ingredients",
        "#forge:crops/tomato",
        "#forge:crops/onion"
    ], "farmersdelight:hamburger", 1)
    combination(e, [
        "some_assembly_required:burger_bun",
        "silentsdelight:warden_heart_patty",
        "#forge:salad_ingredients",
        "#forge:crops/tomato",
        "#forge:crops/onion"
    ], "silentsdelight:heartburger", 1)
    combination(e, [
        "some_assembly_required:burger_bun",
        "farmersdelight:beef_patty",
        "#forge:salad_ingredients",
        "#forge:crops/tomato",
        "#forge:crops/onion",
        "ad_astra:cheese"
    ], "vintagedelight:cheese_burger", 1)
    combination(e, [
        "some_assembly_required:burger_bun",
        "farmersdelight:beef_patty",
        "#forge:salad_ingredients",
        "#forge:crops/tomato",
        "#forge:crops/onion",
        "ad_astra:cheese",
        "#forge:cooked_eggs",
        "#forge:cooked_bacon"
    ], "vintagedelight:deluxe_burger", 1)
    combination(e, [
        "some_assembly_required:burger_bun",
        "collectorsreap:baked_portobello_cap",
        "#forge:salad_ingredients",
        "#forge:crops/tomato",
        "#forge:crops/onion",
    ], "collectorsreap:portobello_burger", 1)
    combination(e, [
        "some_assembly_required:burger_bun",
        "collectorsreap:chieftain_claw",
        "farmersdelight:beef_patty",
        "#forge:salad_ingredients",
        "#forge:crops/tomato",
        "#forge:crops/onion",
    ], "collectorsreap:land_and_sea_burger", 1)
    //三明治
    combination(e, [
        "minecraft:bread",
        "#alexsdelight:cooked_kangaroo",
        "#alexsdelight:cooked_kangaroo",
        "#forge:salad_ingredients",
        "#forge:crops/carrot"
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
        "#forge:crops/beetroot"
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
        "#forge:crops/carrot"
    ], "farmersdelight:chicken_sandwich", 1)
    combination(e, [
        "minecraft:bread",
        "#forge:cooked_bacon",
        "#forge:salad_ingredients",
        "#forge:crops/tomato"
    ], "farmersdelight:bacon_sandwich", 1)
    combination(e, [
        "minecraft:bread",
        "#forge:shrimps",
        "#forge:eggs",
        "#forge:salad_ingredients",
        "#forge:crops/tomato",
        "#forge:crops/onion"
    ], "collectorsreap:prawn_po_boy", 1)
    combination(e, [
        "minecraft:bread",
        "#forge:salad_ingredients",
        "alexscaves:tectonic_shard",
        "#forge:ham"
    ], "cavedelight:lux_and_ham_sandwich", 1)
    combination(e, [
        "minecraft:bread",
        "alexscaves:pine_nuts",
        "alexscaves:pine_nuts",
        "alexscaves:pine_nuts",
        "alexscaves:pewen_sap"
    ], "cavedelight:pine_and_sap_sandwich", 1)
    

})