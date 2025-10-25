ServerEvents.recipes(e => {
    const {create, vintagedelight, kubejs, farmersdelight} = e.recipes
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
        "brewinandchewin:fermenting/cocoa_fudge"
    ])
    create.filling("brewinandchewin:unripe_flaxen_cheese_wheel", [
        "minecraft:honeycomb",
        Fluid.of("create_bic_bit:curdled_milk", 1000)
    ])
    .id("brewinandchewin:filling/create/unripe_flaxen_cheese_wheel")
    vintagedelight.fermenting("2x brewinandchewin:pickled_pickles",[
        "#forge:sea_pickles",
        "#forge:sea_pickles",
        "minecraft:honey_bottle"
    ], 2500)
    .id("brewinandchewin:fermenting/pickled_pickles")
    vintagedelight.fermenting("2x brewinandchewin:kippers", [
        "#forge:raw_fishes",
        "#forge:raw_fishes",
        "minecraft:dried_kelp",
        "#forge:salt"
    ]).id("brewinandchewin:fermenting/kippers")
    kubejs.shapeless(
        'brewinandchewin:scarlet_cheese_wheel',
        '4x brewinandchewin:scarlet_cheese_wedge'
    ).id("brewinandchewin:scarlet_cheese_wheel_from_wedges")
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
    ).id("brewinandchewin:cooking/creamy_onion_soup")
})