ServerEvents.tags("minecraft:item", e => {
    e.add("createdelight:cafe", [
        'createcafe:iced_coffee',
        'createcafe:iced_coffee_milk',
        'createcafe:caramel_iced_coffee',
        'createcafe:banana_iced_coffee',
        'createcafe:strawberry_iced_coffee',
        'createcafe:vanilla_iced_coffee',
        'createcafe:mint_iced_coffee',
    ])
    e.add("createdelight:milk_tea", [
        'createcafe:pineapple_milk_tea',
        'createcafe:blueberry_milk_tea',
        'createcafe:lychee_milk_tea',
        'createcafe:grape_milk_tea',
        'createcafe:fig_milk_tea',
        'createcafe:durian_milk_tea',
        'createcafe:peach_milk_tea',
        'createcafe:mango_milk_tea',
        'createcafe:banana_milk_tea',
        'createcafe:watermelon_milk_tea',
        'createcafe:lemon_milk_tea',
        'createcafe:persimmon_milk_tea',
        'createcafe:orange_milk_tea',
        'createcafe:kiwi_milk_tea',
        'createcafe:sweetberry_milk_tea',
        'createcafe:pumpkin_milk_tea',
        'createcafe:apple_milk_tea',
        'createcafe:cherry_milk_tea',
        'createcafe:oreo_milk_tea',
        'createcafe:strawberry_milk_tea',
        'createcafe:avocado_milk_tea',
        'createcafe:vanilla_milk_tea',
        'createcafe:blood_orange_milk_tea',
        'createcafe:pomegranate_milk_tea',
        'createcafe:lime_milk_tea',
    ])

    e.add("create:upright_on_belt", [
        'createcafe:pineapple_milk_tea',
        'createcafe:blueberry_milk_tea',
        'createcafe:lychee_milk_tea',
        'createcafe:grape_milk_tea',
        'createcafe:fig_milk_tea',
        'createcafe:durian_milk_tea',
        'createcafe:peach_milk_tea',
        'createcafe:mango_milk_tea',
        'createcafe:banana_milk_tea',
        'createcafe:watermelon_milk_tea',
        'createcafe:lemon_milk_tea',
        'createcafe:persimmon_milk_tea',
        'createcafe:orange_milk_tea',
        'createcafe:kiwi_milk_tea',
        'createcafe:sweetberry_milk_tea',
        'createcafe:pumpkin_milk_tea',
        'createcafe:apple_milk_tea',
        'createcafe:cherry_milk_tea',
        'createcafe:oreo_milk_tea',
        'createcafe:iced_coffee',
        'createcafe:iced_coffee_milk',
        'createcafe:caramel_iced_coffee',
        'createcafe:banana_iced_coffee',
        'createcafe:iced_coffee_cup',
        'createcafe:iced_coffee_cup_ice',
        'createcafe:boba_cup',
        'createcafe:empty_boba_cup',
        'createcafe:strawberry_iced_coffee',
        'createcafe:vanilla_iced_coffee',
        'createcafe:mint_iced_coffee',
        'createcafe:strawberry_milk_tea',
        'createcafe:avocado_milk_tea',
        'createcafe:vanilla_milk_tea',
        'createcafe:blood_orange_milk_tea',
        'createcafe:pomegranate_milk_tea',
        'createcafe:lime_milk_tea',
    ])
    e.add("forge:coffee_grounds", "createcafe:coffee_grounds")
    e.add("forge:fruits/pomegranate", "collectorsreap:pomegranate_seeds")
    e.add("forge:syrup_block", [
        'createdelightcore:base_syrup',
        'createdelightcore:strawberry_syrup',
        'createdelightcore:vanilla_syrup',
        'createdelightcore:mint_syrup',
        'createdelightcore:banana_syrup',
        'cosmopolitan:berry_syrup_block'
    ])
})

ServerEvents.tags("minecraft:fluid", e => {
    e.add("forge:syrup", [
        'createdelight:base_syrup',
        'createdelight:strawberry_syrup',
        'createdelight:vanilla_syrup',
        'createdelight:mint_syrup',
        'createdelight:banana_syrup',
        'cosmopolitan:berry_syrup'
    ])
})

ServerEvents.tags("minecraft:block", e => {
    e.add("minecraft:crops", 
        "createcafe:cassava_crop",
        "createcafe:coffee_crop"
    )
})