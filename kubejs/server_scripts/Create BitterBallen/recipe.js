ServerEvents.recipes(e => {
    const { kubejs, create } = e.recipes
    remove_recipes_id(e, [
        "create_bic_bit:mixing/mayonnaise_recipe",
        "create_bic_bit:mixing/sunflower_seeds_recipe",
        "create_bic_bit:mixing/frying_oil_recipe",
        "create_bic_bit:mixing/ketchup_recipe",
        "create_bic_bit:deep_frying/ice_recipe",
        "create_bic_bit:mixing/curdled_milk",
        "create_bic_bit:compacting/unripe_cheese",
        "create_deepfried:mixing/raw_springroll",
        "create_deepfried:compat/farmersdelight/mixing/raw_springroll",
        "create_deepfried:deep_frying/springroll",
        "create_deepfried:compat/farmersdelight/mixing/raw_onion_rings",
        "create_deepfried:compat/farmersdelight/deep_frying/onion_rings",
        "create_bic_bit:compat/farmersdelight/frikandel_recipe2",
        "create_bic_bit:compat/farmersdelight/kroket_recipe2",
        "create_bic_bit:compat/farmersdelight/bitterballen_recipe2",
        "create_bic_bit:deep_frying/bitterballen_recipe_2",
        "create_bic_bit:deep_frying/enderball_recipe",
        "create_deepfried:deep_frying/corn_dog",
        "create_bic_bit:deep_frying/froglightverdant",
        "create_bic_bit:deep_frying/froglightpearlescent",
        "create_bic_bit:deep_frying/froglightochre",
        "createdieselgenerators:basin_fermenting/golden_carrot",
        "createdieselgenerators:basin_fermenting/golden_apple",
        "create_bic_bit:mixing/ketchup",
        "create_bic_bit:compat/farmersdelight/raw_churros",
        "create_bic_bit:mixing/mayonnaise",
        "create:empty_youkaishomecoming_mayonnaise_bottle_of_youkaishomecoming_flowing_mayonnaise",
        "create_deepfried:deep_frying/donut",
        "create_deepfried:compat/farmersdelight/deep_frying/arancini",
        "create_bic_bit:compat/farmersdelight/ketchup",
        "create_bic_bit:mixing/frying_oil"
    ])
    remove_recipes_output(e, [
        'create_bic_bit:cheese_souffle', 
        'create_bic_bit:kroket', 
        'create_bic_bit:eggball', 
        'create_bic_bit:frikandel', 
        'create_bic_bit:churros',
        'create_deepfried:yuca', 
        'create_deepfried:apple_slices',
        'create_bic_bit:unripe_cheese_wedge', 
        'create_bic_bit:young_cheese_wedge', 
        'create_bic_bit:aged_cheese_wedge',
        'create_deepfried:yuca_fries', 
        'create_deepfried:apfelkuchle', 
        'create_deepfried:panzerotto', 
        'create_deepfried:blooming_onion', 
        'create_deepfried:fried_chicken', 
        'create_deepfried:fish_and_chips', 
        'create_deepfried:chicken_nuggets',
        'create_deepfried:tempura', 
        'create_deepfried:berliner', 
        'create_deepfried:deepfried_chocolate_bar',
        'create_bic_bit:raw_fries',
        'create_bic_bit:fries',
        'create_bic_bit:oliebollen',
        'create_bic_bit:crystallised_oil',
        'create_deepfried:calamari'
    ]
    
    )
    e.replaceInput({}, Fluid.of("create_bic_bit:frying_oil"), Fluid.of("createdieselgenerators:plant_oil"))
    create.mixing(
        'create_bic_bit:raw_churros',
        [
            "bakeries:flour",
            "minecraft:sugar",
            Fluid.water(100)
        ]
    ).id("create_bic_bit:mixing/raw_churros")
    create.filling(
        'create_bic_bit:ketchup_bottle',
        [
            Fluid.of("create_central_kitchen:tomato_sauce", 250),
            "minecraft:glass_bottle"
        ]
    ).id("create_bic_bit:filling/ketchup_bottle")
    create.emptying(
        [
            Fluid.of("create_central_kitchen:tomato_sauce", 250),
            "minecraft:glass_bottle"
        ],
        'create_bic_bit:ketchup_bottle'
    ).id("create_bic_bit:emptying/ketchup")
    create.mixing(Fluid.of("create_bic_bit:mayonnaise", 250), [
            FluidIngredients("forge:egg_yolk", 100),
        Fluid.of("createdieselgenerators:plant_oil", 250)
    ]).id("create_bic_bit:mixing/mayonnaise_recipe")
    create.mixing(Fluid.of("create_bic_bit:curdled_milk", 1000), [
        Fluid.of("createdelight:vinegar", 250),
        Fluid.of("minecraft:milk", 1000),
        "createdelight:dry_yeast"
    ]).heated()
    .id("create_bic_bit:mixing/curdled_milk")
    create.compacting(
        "vintagedelight:cheese_curds",
        Fluid.of("create_bic_bit:curdled_milk", 250)
    ).id("create_bic_bit:compacting/cheese_curds")
    threshing(e, "minecraft:sunflower", [
        "create_bic_bit:sunflower_seeds",
        Item.of("2x create_bic_bit:sunflower_seeds").withChance(0.5)
    ], 200)
    create.compacting(Fluid.of("createdieselgenerators:plant_oil", 500), "2x create_bic_bit:crushed_sunflower_seeds")
    .id("create_bic_bit:compacting/plant_oil_from_crushed_sunflower_seeds")
    create.mixing(
        Fluid.of("create_bic_bit:stamppot", 250),
        [
            '4x minecraft:baked_potato',
            '2x some_assembly_required:chopped_carrot',
            'some_assembly_required:sliced_onion'
        ]
    ).id("create_bic_bit:compat/farmersdelight/stamppot_recipe2")
    create.mixing(
        'create_bic_bit:raw_cheese_souffle',
        [
            "#forge:cheese",
            'bakeries:flour',
            FluidIngredients("forge:egg_yolk", 100)
        ]
    ).id("create_bic_bit:mixing/raw_cheese_souffle")
    create.mixing(
        "create_bic_bit:sweet_dough",
        [
            Fluid.of("create:honey", 100),
            "farmersdelight:wheat_dough"
        ]
    ).id("create_bic_bit:compat/farmersdelight/sweet_dough_recipe2")
    create.mixing(
        'create_bic_bit:raw_frikandel',
        [
            '#forge:meat/processed/raw',
            'bakeries:flour',
            FluidIngredients("forge:egg_yolk", 100)
        ]
    ).id("create_bic_bit:mixing/frikandel_recipe")
    create.mixing(
        'create_bic_bit:raw_kroket',
        [
            '#forge:meat/processed/raw',
            "2x bakeries:flour",
            'createdelight:butter',
            FluidIngredients("forge:egg_yolk", 100)
        ]
    ).id("create_bic_bit:mixing/kroket_recipe")
    create.mixing(
        '2x create_bic_bit:raw_bitterballen',
        [
            '#forge:meat/processed/raw',
            'bakeries:flour',
            'createdelight:butter',
            FluidIngredients("forge:egg_yolk", 100)
        ]
    ).id("create_bic_bit:mixing/bitterballen_recipe")
    create.mixing(
        'create_bic_bit:raw_eggball',
        [
            'mynethersdelight:boiled_egg',
            'bakeries:flour',
            Fluid.of("minecraft:water", 50)
        ]
    ).id("create_bic_bit:mixing/raw_eggball")

    //deepfried
    create.mixing(
        "create_deepfried:raw_tempura",
        [
            'bakeries:flour',
            "#forge:seafood",
            Fluid.of("minecraft:water", 50)
        ]
    ).id("create_deepfried:compat/farmersdelight/mixing/raw_tempura")
    create.mixing(
        "createdelightcore:unfried_calamari",
        [
            'bakeries:flour',
            "createdelight:raw_calamari",
            Fluid.of("minecraft:water", 50)
        ]
    ).id("create_deepfried:mixing/unfried_calamari")
    create.mixing(
        "create_deepfried:raw_tempura",
        [
            'bakeries:flour',
            '3x #forge:vegetables',
            Fluid.of("minecraft:water", 50)
        ]
    ).id("create_deepfried:mixing/raw_tempura")
    create.mixing(
        'create_deepfried:raw_onion_rings',
        [
            'some_assembly_required:sliced_onion',
            'bakeries:flour',
            Fluid.of("minecraft:water", 50)
        ]
    ).id("create_deepfried:compat/farmersdelight/mixing/raw_onion_rings2")
    create.filling(
        'createdelight:ketchup_corn_dog',
        [
            'create_deepfried:corn_dog',
            Fluid.of("create_central_kitchen:tomato_sauce", 250)
        ]
    ).id("create_deepfried:filling/ketchup_corn_dog")
    create.filling(
        'createdelight:mayo_corn_dog',
        [
            'create_deepfried:corn_dog',
            Fluid.of("create_bic_bit:mayonnaise", 250)
        ]
    ).id("create_deepfried:filling/mayo_corn_dog")
    create.filling(
        'corn_delight:classic_corn_dog',
        [
            "createdelight:ketchup_corn_dog",
            Fluid.of("create_bic_bit:mayonnaise", 250)
        ]
    ).id("create_deepfried:filling/classic_corn_dog_from_ketchup_corn_dog")
    create.filling(
        'corn_delight:classic_corn_dog',
        [
            "createdelight:mayo_corn_dog",
            Fluid.of("create_central_kitchen:tomato_sauce", 250)
        ]
    ).id("create_deepfried:filling/classic_corn_dog_from_mayo_corn_dog")
    create.filling(
        'create_bic_bit:ketchup_topped_kroket_sandwich',
        [
            'create_bic_bit:kroket_sandwich',
            Fluid.of("create_central_kitchen:tomato_sauce", 250)
        ]
    ).id("create_bic_bit:filling/ketchup_kroket_sandwich")
    create.filling(
        'create_bic_bit:mayonnaise_ketchup_topped_kroket_sandwich',
        [
            'create_bic_bit:mayonnaise_topped_kroket_sandwich',
            Fluid.of("create_central_kitchen:tomato_sauce", 250)
        ]
    ).id("create_bic_bit:filling/mayonnaise_ketchup_kroket_sandwich")
    create.filling(
        'create_bic_bit:ketchup_topped_frikandel_sandwich',
        [
            'create_bic_bit:frikandel_sandwich',
            Fluid.of("create_central_kitchen:tomato_sauce", 250)
        ]
    ).id("create_bic_bit:filling/ketchup_frikandel_sandwich")
    create.filling(
        'create_bic_bit:mayonnaise_ketchup_topped_frikandel_sandwich',
        [
            'create_bic_bit:mayonnaise_topped_frikandel_sandwich',
            Fluid.of("create_central_kitchen:tomato_sauce", 250)
        ]
    ).id("create_bic_bit:filling/mayonnaise_ketchup_frikandel_sandwich")
    create.filling(
        'create_bic_bit:wrapped_ketchup_topped_fries',
        [
            'create_bic_bit:wrapped_fries',
            Fluid.of("create_central_kitchen:tomato_sauce", 250)
        ]
    ).id("create_bic_bit:filling/wrapped_ketchup_fries")
    create.filling(
        'create_bic_bit:wrapped_mayonnaise_ketchup_topped_fries',
        [
            'create_bic_bit:wrapped_mayonnaise_topped_fries',
            Fluid.of("create_central_kitchen:tomato_sauce", 250)
        ]
    ).id("create_bic_bit:filling/wrapped_mayonnaise_ketchup_fries")

    kubejs.shaped("create_bic_bit:wrapped_coated_churros",
        [["minecraft:air", "create_bic_bit:coated_churros"],
        ["minecraft:air", "minecraft:paper"]])
        .id("create_bic_bit:crafting/wrapped_coated_churros")
    create.deploying("create_bic_bit:wrapped_coated_churros",
        ["create_bic_bit:coated_churros", "minecraft:paper"])
        .id("create_bic_bit:deploying/wrapped_coated_churros")
    create.deploying(
        'create_deepfried:raw_donut',
        [
            'farmersdelight:wheat_dough',
            "minecraft:stick"
        ]
    ).keepHeldItem().id("create_deepfried:deploying/raw_donut")
})

ServerEvents.tags("minecraft:item", e => {
    e.removeAllTagsFrom([
        'create_bic_bit:unripe_cheese_wedge', 
        'create_bic_bit:young_cheese_wedge', 
        'create_bic_bit:aged_cheese_wedge',
        'create_deepfried:yuca', 
        'create_deepfried:apple_slices'
    ])
    e.add("forge:seafood", [
        "#minecraft:fishes",
        "#crabbersdelight:lobster",
        "#crabbersdelight:crab",
        "#crabbersdelight:shrimps"
    ])
})
LootJS.modifiers(e => {
    e.addBlockLootModifier("minecraft:dead_bush")
        .removeLoot('create_deepfried:yuca')
    e.addBlockLootModifier("minecraft:sunflower")
        .removeLoot("create_bic_bit:sunflower_seeds")
})
ServerEvents.tags("minecraft:item", e => {
    e.add("forge:mayonnaise", [
        'create_bic_bit:mayonnaise_bottle'
    ])
    e.removeAllTagsFrom([
    'create_bic_bit:unripe_cheese',
    'create_bic_bit:waxed_unripe_cheese',
    'create_bic_bit:young_cheese',
    'create_bic_bit:waxed_young_cheese',
    'create_bic_bit:aged_cheese',
    'create_bic_bit:waxed_aged_cheese',
    'create_bic_bit:unripe_cheese_wedge',
    'create_bic_bit:young_cheese_wedge',
    'create_bic_bit:aged_cheese_wedge'
    ])
})