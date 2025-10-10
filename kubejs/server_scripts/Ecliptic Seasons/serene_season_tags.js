ServerEvents.tags("item", e => {
    e.remove("sereneseasons:spring_crops", [
        "fruitsdelight:pear_sapling",
        "fruitsdelight:peach_sapling",  
    ])
    e.remove("sereneseasons:summer_crops", [
        "fruitsdelight:lychee_sapling",
        "fruitsdelight:mango_sapling",
        "fruitsdelight:mangosteen_sapling",
        "fruitsdelight:bayberry_sapling",
        "fruitsdelight:durian_sapling",
    ])
    e.remove("sereneseasons:autumn_crops", [
        "fruitsdelight:orange_sapling",
        "fruitsdelight:apple_sapling",
        "fruitsdelight:fig_sapling",
    ])
    e.remove("sereneseasons:winter_crops", [
        "fruitsdelight:hawberry_sapling",
        "fruitsdelight:persimmon_sapling",
        "fruitsdelight:kiwi_sapling",
    ])
    e.add("eclipticseasons:crops/all_seasons",
        "neapolitan:vanilla_pods",
        "miners_delight:cave_carrot",
        'alexscaves:fiddlehead'
    )
    e.add("eclipticseasons:crops/spring_autumn",
        "frycooks_delight:canola_seeds",
        "vintagedelight:cucumber_seeds",
        "festival_delicacies:eggplant_seeds",
        "culturaldelights:eggplant_seeds",
        "neapolitan:strawberry_pips",
        "createdelight:adzuki_beans_seed",
    )
    e.add("eclipticseasons:crops/spring_autumn_winter",
        "festival_delicacies:chinese_cabbage_seeds",
    )

    e.add("eclipticseasons:crops/spring_summer_autumn",
        "festival_delicacies:garlic_chive_seeds",
        "createdelight:artemisia_argyi_seed"
    )

    e.add("eclipticseasons:crops/spring_summer",
        "vinery:savanna_grape_seeds_red",
        "vinery:savanna_grape_seeds_white",
        "neapolitan:mint_sprout",
    )

    e.add("eclipticseasons:crops/spring",
        "vinery:jungle_grape_seeds_red",
        "vinery:jungle_grape_seeds_white",
    )

    e.add("eclipticseasons:crops/summer_autumn",
        "vintagedelight:oat_seeds",
        "vintagedelight:ghost_pepper_seeds",
        "culturaldelights:avocado_pit",
        "vintagedelight:gearo_berry",
        "vinery:red_grape_seeds",
        "vinery:white_grape_seeds",
        "oceanic_delight:sea_grape",
    )

    e.add("eclipticseasons:crops/summer",
        "festival_delicacies:fennel_seeds",
        "youkaishomecoming:mandrake_root"
    )

    e.add("eclipticseasons:crops/summer_autumn_winter",
        "festival_delicacies:greenonion",)

    e.add("eclipticseasons:crops/autumn",
        "vintagedelight:peanut",
        "culturaldelights:corn_kernels",
        "vinery:taiga_grape_seeds_red",
        "vinery:taiga_grape_seeds_white",
        "neapolitan:banana_frond",
        "trailandtales_delight:lantern_fruit_seeds"
    )

    e.add("eclipticseasons:crops/autumn_winter",
        "createcafe:cassava_seeds",
    )

    e.add("eclipticseasons:crops/winter",
        "createcafe:coffee_beans")
})

ServerEvents.tags("block", e => {
    e.remove("sereneseasons:spring_crops", [
        "fruitsdelight:pear_sapling",
        "fruitsdelight:peach_sapling",  
    ])
    e.remove("sereneseasons:summer_crops", [
        "fruitsdelight:lychee_sapling",
        "fruitsdelight:mango_sapling",
        "fruitsdelight:mangosteen_sapling",
        "fruitsdelight:bayberry_sapling",
        "fruitsdelight:durian_sapling",
    ])
    e.remove("sereneseasons:autumn_crops", [
        "fruitsdelight:orange_sapling",
        "fruitsdelight:apple_sapling",
        "fruitsdelight:fig_sapling",
    ])
    e.remove("sereneseasons:winter_crops", [
        "fruitsdelight:hawberry_sapling",
        "fruitsdelight:persimmon_sapling",
        "fruitsdelight:kiwi_sapling",
    ])
})