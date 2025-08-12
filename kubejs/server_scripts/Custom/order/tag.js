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
    e.add("createdelight:order/food", 
        "#createdelight:order/fast_food",
        "#craetedelight:order/sandwich"
    )
    e.add("cratedelight:order/milk_tea",
        '#createdelight:milk_tea',
    )
})

Order.orderProperties = {
    food: {
        diversity: [1, 2, 3, 4],
        base_count: 64
    },
    burger: {
        diversity: [4, 4.25, 4.5, 5],
        base_count: 32
    },
    sandwich: {
        diversity: [3.5, 4, 4.5, 5],
        base_count: 32
    },
    fast_food: {
        diversity: [4, 4.25, 4.5, 5],
        base_count: 32
    },
    milk_tea: {
        diversity: [-1, 0, 99, 99],
        base_count: 16
    }
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