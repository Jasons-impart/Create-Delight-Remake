ServerEvents.tags("minecraft:item", e => {
    e.add("createdelight:order/burger", [
        'alexsdelight:bison_burger',
        'alexsmobs:kangaroo_burger',
        'culturaldelights:eggplant_burger',
        'farmersdelight:hamburger',
        'mynethersdelight:nether_burger',
        'silentsdelight:heartburger',
        'vintagedelight:cheese_burger',
        'vintagedelight:deluxe_burger',
        'collectorsreap:portobello_burger',
        'miners_delight:vegan_hamburger',
        'collectorsreap:land_and_sea_burger'])

    e.add("createdelight:order/fast_food",
        "#createdelight:order/burger",
        'create_bic_bit:wrapped_fries',
        'create_bic_bit:wrapped_ketchup_topped_fries',
        'create_bic_bit:wrapped_mayonnaise_topped_fries',
        'create_bic_bit:wrapped_mayonnaise_ketchup_topped_fries',
        'create_deepfried:yuca_fries',
        'casualness_delight:fried_chicken_chip',
        'frycooks_delight:fried_chicken_leg'
    )
    e.add("craetedelight:order/sandwich", [
        'cavedelight:pine_and_sap_sandwich',
        'alexsdelight:bunfungus_sandwich',
        'culturaldelights:mutton_sandwich',
        'farmersdelight:egg_sandwich',
        'farmersdelight:chicken_sandwich',
        'farmersdelight:bacon_sandwich',
        'luncheonmeatsdelight:luncheon_meat_sandwich',
        'vintagedelight:pb_j',
        'collectorsreap:prawn_po_boy',
        'cavedelight:lux_and_ham_sandwich',
        'miners_delight:insect_sandwich',
        'miners_delight:squid_sandwich',
        'dungeonsdelight:chicken_jockey_sandwich',
        'dungeonsdelight:malicious_sandwich',
        'brewinandchewin:ham_and_cheese_sandwich',
        'cosmopolitan:woodland_sub'])

    e.add("createdelight:order/cookie",
        "farmersrespite:green_tea_cookie",
        "farmersdelight:honey_cookie",
        "fruitsdelight:persimmon_cookie",
        "fruitsdelight:lemon_cookie",
        "fruitsdelight:cranberry_cookie",
        "fruitsdelight:bayberry_cookie",
        "minecraft:cookie",
        "vintagedelight:oatmeal_cookie",
        "collectorsreap:lime_cookie",
        "farmersdelight:sweet_berry_cookie")

    e.add("createdelight:order/milk_tea",
        '#createdelight:milk_tea',
    )
    e.add("createdelight:order/tea",
        "cavedelight:fiddlehead_tea",
        "trailandtales_delight:torchflower_tea",
        "trailandtales_delight:cherry_petal_tea",
        "trailandtales_delight:pitcher_plant_tea",
        "cosmopolitan:autumn_tea",
        "create:builders_tea",
        "ends_delight:chorus_flower_tea",
        "farmersrespite:green_tea",
        "farmersrespite:yellow_tea",
        "farmersrespite:black_tea",
        "farmersrespite:rose_hip_tea",
        "farmersrespite:dandelion_tea",
        "farmersrespite:purulent_tea",
        "farmersrespite:gamblers_tea",
        "farmersrespite:long_green_tea",
        "farmersrespite:long_yellow_tea",
        "farmersrespite:long_black_tea",
        "farmersrespite:long_rose_hip_tea",
        "farmersrespite:long_dandelion_tea",
        "farmersrespite:long_purulent_tea",
        "farmersrespite:long_gamblers_tea",
        "farmersrespite:strong_green_tea",
        "farmersrespite:strong_yellow_tea",
        "farmersrespite:strong_black_tea",
        "farmersrespite:strong_rose_hip_tea",
        "farmersrespite:strong_purulent_tea",
        "farmersrespite:strong_gamblers_tea",
        "fruitsdelight:hawberry_tea",
        "fruitsdelight:mango_tea",
        "fruitsdelight:peach_tea",
        "fruitsdelight:lychee_cherry_tea",
        "fruitsdelight:mangosteen_tea"
    )
    e.add("createdelight:order/western_wine",
        "vinery:mead",
        "vinery:apple_cider",
        "vinery:apple_wine",
        "vinery:mellohi_wine",
        "vinery:glowing_wine",
        "vinery:solaris_wine",
        "vinery:noir_wine",
        "vinery:red_wine",
        "vinery:strad_wine",
        "vinery:cherry_wine",
        "vinery:cristel_wine",
        "vinery:creepers_crush",
        "vinery:kelp_cider",
        "vinery:lilitu_wine",
        "vinery:jo_special_mixture",
        "vinery:eiswein",
        "vinery:aegis_wine",
        "vinery:bolvar_wine",
        "vinery:chorus_wine",
        "vinery:villagers_fright",
        "vinery:clark_wine",
        "vinery:magnetic_wine",
        "vinery:stal_wine",
        "vinery:chenet_wine",
        "vinery:bottle_mojang_noir",
        "vinery:jellie_wine",
        "vinery:blazewine_pinot",
        "vinery:netherite_nectar",
        "vinery:ghastly_grenache",
        "vinery:lava_fizz",
        "vinery:nether_fizz"
    )
    e.add("createdelight:order/drink", 
        "#createdelight:order/western_wine",
        "#createdelight:order/tea",
        "#createdelight:order/milk_tea"
    )
    e.add("createdelight:order/food",
        "#createdelight:order/fast_food",
        "#createdelight:order/cookie",
        "#craetedelight:order/sandwich"
    )
})

ServerEvents.tags("minecraft:item", e => {
})
Order.orderProperties = {
    food: {
        diversity: [1, 2, 3, 4],
        base_count: 32 //base_count最终会*4
    },
    burger: {
        diversity: [4, 4.25, 4.5, 5],
        base_count: 64
    },
    sandwich: {
        diversity: [3.5, 4, 4.5, 5],
        base_count: 64
    },
    fast_food: {
        diversity: [4, 4.25, 4.5, 5],
        base_count: 64
    },
    milk_tea: {
        diversity: [-1, 0, 99, 99],
        base_count: 32
    },
    cookie: {
        diversity: [-1, 0, 99, 99],
        base_count: 16
    },
    tea: {
        diversity: [-1, -1, 99, 99],
        base_count: 32
    },
    western_wine: {
        diversity: [-1, 0, 99, 99],
        base_count: 16
    },
    drink: {
        diversity: [-1, -1, 99, 99],
        base_count: 32
    },
}
//应当让概率从低到高牌序
Order.customerProperties = {
    food: {
        entries: {
            food: [1, 0]
        },
        max_count: 2,
        base_continue_rate: 0.25,
        rarity: "COMMON",
        chance: 1,
        loot_table: ""
    },
    fast_food: {
        entries: {
            fast_food: [1, 0],
            milk_tea: [1, 0]
        },
        max_count: 3,
        base_continue_rate: 0.3,
        rarity: "UNCOMMON",
        chance: 0.8,
        loot_table: ""
    },
}

Order.rankThreshold = [0, 10, 25, 50, 80, 120]