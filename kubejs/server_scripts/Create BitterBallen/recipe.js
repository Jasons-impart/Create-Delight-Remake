ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "create_bic_bit:mixing/mayonnaise_recipe",
        "create_bic_bit:mixing/sunflower_seeds_recipe",
        "create_bic_bit:mixing/frying_oil_recipe",
        "create_bic_bit:mixing/ketchup_recipe",
        "create_bic_bit:deep_frying/ice_recipe"
        
    ])
    remove_recipes_output(e, [
        'create_bic_bit:cheese_souffle', 
        'create_bic_bit:kroket', 
        // 'create_bic_bit:bitterballen', 
        'create_bic_bit:eggball', 
        'create_bic_bit:frikandel', 
        'create_bic_bit:churros',
        'create_deepfried:yuca', 
        'create_deepfried:raw_onion_rings', 
        'create_deepfried:onion_rings', 
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
        'create_deepfried:raw_corn_dog', 
        'create_deepfried:corn_dog', 
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
    e.replaceOutput({}, "create_bic_bit:unripe_cheese", "casualness_delight:raw_cheese_wheel")
    e.replaceInput({id: "create_bic_bit:compat/farmersdelight/raw_churros_recipe2"}, "farmersdelight:wheat_dough", "create:dough")
    e.recipes.create.mixing(Fluid.of("create_bic_bit:ketchup", 250), [
        Fluid.of("create_central_kitchen:tomato_sauce", 250),
        "create_bic_bit:crushed_nether_wart",
        "minecraft:sugar"
    ]).id("create:mixing/ketchup_from_tomato_sauce")
    e.recipes.create.mixing(Fluid.of("create_bic_bit:mayonnaise", 250), [
        Fluid.of("createdelight:egg_yolk", 100),
        Fluid.of("createdieselgenerators:plant_oil", 250)
    ]).id("create_bic_bit:mixing/mayonnaise_recipe")
    threshing(e, "minecraft:sunflower", [
        "create_bic_bit:sunflower_seeds",
        Item.of("2x create_bic_bit:sunflower_seeds").withChance(0.5)
    ], 200)
    e.recipes.create.compacting(Fluid.of("createdieselgenerators:plant_oil", 500), "2x create_bic_bit:crushed_sunflower_seeds")
    .id("create_bic_bit:compacting/plant_oil_from_crushed_sunflower_seeds")

    //deepfried
})

ServerEvents.tags("minecraft:item", e => {
    e.removeAllTagsFrom([
        'create_bic_bit:unripe_cheese_wedge', 
        'create_bic_bit:young_cheese_wedge', 
        'create_bic_bit:aged_cheese_wedge',
        'create_deepfried:yuca', 
        'create_deepfried:raw_onion_rings', 
        'create_deepfried:onion_rings', 
        'create_deepfried:apple_slices'])
})