ServerEvents.recipes(e => {
    const {create, vintagedelight, kubejs, farmersdelight, ratatouille} = e.recipes
    remove_recipes_id(e, [
        "brewinandchewin:filling/create/unripe_flaxen_cheese_wheel",
        "brewinandchewin:cutting/flaxen_cheese_wheel",
        "brewinandchewin:fermenting/jerky",
        "brewinandchewin:emptying/create/honey_bottle",
        "brewinandchewin:filling/create/honey_bottle",
        "brewinandchewin:fermenting/kippers",
        "brewinandchewin:flaxen_cheese_wheel_from_wedges",
        "vintagedelight:cheese_wheel_from_slices",
        "culturaldelights:fermenting/pickle",
        "brewinandchewin:fermenting/kimchi",
        "brewinandchewin:pizza",
        "brewinandchewin:pizza_from_slices",
        "brewinandchewin:cutting/pizza",
        "brewinandchewin:quiche_from_slices",
        "brewinandchewin:quiche_from_mushroom",
        "brewinandchewin:quiche_from_bacon",
        "brewinandchewin:cutting/quiche",
        "brewinandchewin:cooking/sweet_berry_jam",
        "brewinandchewin:cooking/glow_berry_marmalade",
        "brewinandchewin:cooking/apple_jelly",
        "brewinandchewin:filling/create/milk_bucket",
        "brewinandchewin:emptying/create/milk_bottle",
        "brewinandchewin:emptying/create/milk_bucket",
        "brewinandchewin:filling/create/milk_bottle",
        "cosmopolitan:brewinandchewin/fermenting/root_beer",
        "brewinandchewin:fermenting/cocoa_fudge",
        "brewinandchewin:fermenting/pickled_pickles",
        "brewinandchewin:fermenting/beer_from_water",
        "brewinandchewin:fermenting/vodka_from_water",
        "brewinandchewin:fermenting/mead_from_honey",
        "brewinandchewin:fermenting/rice_wine_from_water",
        "brewinandchewin:fermenting/strongroot_ale_from_beer",
        "brewinandchewin:fermenting/steel_toe_stout_from_strongroot_ale",
        "brewinandchewin:fermenting/bloody_mary_from_vodka",
        "brewinandchewin:fermenting/dread_nog_from_egg_grog",
        "brewinandchewin:fermenting/egg_grog_from_milk",
        "brewinandchewin:fermenting/flaxen_cheese_from_milk",
        "brewinandchewin:fermenting/glittering_grenadine_from_water",
        "brewinandchewin:fermenting/kombucha",
        "brewinandchewin:fermenting/pale_jane_from_rice_wine",
        "brewinandchewin:fermenting/red_rum_from_bloody_mary",
        "brewinandchewin:fermenting/saccharine_rum_from_mead",
        "brewinandchewin:fermenting/salty_folly_from_vodka",
        "brewinandchewin:fermenting/scarlet_cheese_from_milk",
        "brewinandchewin:fermenting/withering_dross_from_salty_folly",
        "brewinandchewin:emptying/create/potion",
        "/brewinandchewin:emptying\/create\/farmersrespite\/.*/"
    ])
    create.filling("brewinandchewin:unripe_flaxen_cheese_wheel", [
        "minecraft:honeycomb",
        Fluid.of("create_bic_bit:curdled_milk", 1000)
    ])
    .id("createdelight:filling/create/unripe_flaxen_cheese_wheel")
    frementing_3(e, "brewinandchewin:egg_grog", [
        "minecraft:nether_wart",
        "minecraft:turtle_egg",
        "minecraft:fermented_spider_eye"
    ], "brewinandchewin:dread_nog", "brewinandchewin:dread_nog", 1, 2400)
    frementing_3(e, "minecraft:milk", [
        "#forge:eggs",
        "#forge:crops/cabbage",
        "minecraft:sugar"
    ], "brewinandchewin:egg_grog", "brewinandchewin:egg_grog", 3, 2400)
    frementing_3(e, "minecraft:milk", [
        "createdelight:dry_yeast",
        "vintagedelight:vinegar_bottle",
        "minecraft:sugar"
    ], "create_bic_bit:curdled_milk", "create_bic_bit:curdled_milk", 4, 2400, undefined, "meals")
    frementing_3(e, "minecraft:water", [
        "minecraft:glow_berries",
        "minecraft:glowstone_dust",
        "minecraft:glow_ink_sac"
    ], "brewinandchewin:glittering_grenadine", "brewinandchewin:glittering_grenadine", 2, 4800)
    frementing_3(e, "farmersrespite:green_tea", [
        "#forge:crops/carrot",
        "minecraft:sweet_berries",
        "farmersrespite:black_tea_leaves"
    ], "brewinandchewin:kombucha", "brewinandchewin:kombucha", 3, 4800, undefined, "drinks", 1.0, [
        { type: "forge:mod_loaded", modid: "farmersrespite" }
    ])
    frementing_3(e, "brewinandchewin:rice_wine", [
        "minecraft:honey_bottle",
        "farmersdelight:tree_bark",
        "minecraft:lily_of_the_valley",
        "minecraft:sugar"
    ], "brewinandchewin:pale_jane", "brewinandchewin:pale_jane", 4, 2400)
    frementing_3(e, "brewinandchewin:bloody_mary", [
        "minecraft:crimson_fungus",
        "minecraft:nether_wart",
        "minecraft:fermented_spider_eye",
        "minecraft:shroomlight"
    ], "brewinandchewin:red_rum", "brewinandchewin:red_rum", 5, 2400)
    frementing_3(e, "brewinandchewin:mead", [
        "minecraft:sweet_berries",
        "minecraft:sugar_cane",
        "minecraft:melon"
    ], "brewinandchewin:saccharine_rum", "brewinandchewin:saccharine_rum", 4, 2400)
    frementing_3(e, "brewinandchewin:vodka", [
        "minecraft:sea_pickle",
        "minecraft:dried_kelp",
        "minecraft:seagrass"
    ], "brewinandchewin:salty_folly", "brewinandchewin:salty_folly", 2, 2400)
    frementing_3(e, "minecraft:milk", [
        "minecraft:crimson_fungus",
        "minecraft:nether_wart",
        "minecraft:sugar"
    ], "brewinandchewin:scarlet_cheese", "brewinandchewin:scarlet_cheese", 5, 4800, undefined, "meals")
    frementing_3(e, "brewinandchewin:salty_folly", [
        "minecraft:wither_rose",
        "minecraft:ink_sac",
        "minecraft:nether_wart",
        "minecraft:bone"
    ], "brewinandchewin:withering_dross", "brewinandchewin:withering_dross", 5, 4800, undefined, "drinks", 2.0)
    vintagedelight.fermenting("2x brewinandchewin:pickled_pickles",[
        "#forge:sea_pickles",
        "#forge:sea_pickles",
        "minecraft:honey_bottle"
    ], 2500)
    .id("createdelight:fermenting/pickled_pickles")
    vintagedelight.fermenting("2x brewinandchewin:kippers", [
        "#forge:raw_fishes",
        "#forge:raw_fishes",
        "minecraft:dried_kelp",
        "#forge:salt"
    ]).id("createdelight:fermenting/kippers")
    frementing_3(e, "minecraft:water",
        [
            "ratatouille:wheat_kernels",
            "createdelight:dry_yeast"
        ], 
        "brewinandchewin:beer",
        "brewinandchewin:beer",
        3, 4800
    )
    frementing_3(e, "minecraft:water",
        [
            "#forge:crops/potato",
            "ratatouille:wheat_kernels",
            'culturaldelights:corn_kernels'
        ],
        "brewinandchewin:vodka",
        "brewinandchewin:vodka",
        3, 4800
    )
    frementing_3(e, "create:honey", 
        [
            "ratatouille:wheat_kernels",
            "minecraft:sweet_berries"
        ],
        "brewinandchewin:mead",
        "brewinandchewin:mead",
        3, 4800
    )
    frementing_3(e, "minecraft:water", 
        [
            "#forge:crops/rice",
            'createdelight:dry_yeast'
        ],
        'brewinandchewin:rice_wine',
        'brewinandchewin:rice_wine',
        3, 4800
    )
    frementing_3(e, "brewinandchewin:beer",
        [
            "#forge:vegetables/beetroot",
            "#forge:vegetables/potato",
            "minecraft:brown_mushroom",
            "brewinandchewin:jerky"
        ],
        "brewinandchewin:strongroot_ale",
        "brewinandchewin:strongroot_ale",
        3, 2400
    )
    frementing_3(e, "brewinandchewin:strongroot_ale", 
        [
            "minecraft:iron_ingot",
            "minecraft:crimson_fungus",
            "minecraft:nether_wart",
            "ratatouille:wheat_kernels"
        ], 
        "brewinandchewin:steel_toe_stout",
        "brewinandchewin:steel_toe_stout",
        1, 4800
    )
    frementing_3(e, "brewinandchewin:vodka", 
        [
            'butchercraft:blood_fluid_bottle'
        ],
        'brewinandchewin:bloody_mary',
        'brewinandchewin:bloody_mary',
        4, 4800
    )
    frementing_3(e, "cosmopolitan:birch_sap", 
        [
            "minecraft:hanging_roots",
            "farmersdelight:tree_bark",
            "ratatouille:wheat_kernels"
        ],
        "cosmopolitan:root_beer",
        'cosmopolitan:root_beer',
        3, 9600
    )
    farmersdelight.cooking(
        [
            "#forge:cream",
            "#festival_delicacies:onion",
            "#forge:vegetables",
            "#forge:bread"
        ],
        'brewinandchewin:creamy_onion_soup',
        1, 200, "minecraft:bowl"
    ).id("createdelight:cooking/creamy_onion_soup")
    ratatouille.baking(
        "brewinandchewin:jerky",
        "#forge:meat/cooked"
    ).processingTime(200).id("createdelight:baking/jerky")
})
