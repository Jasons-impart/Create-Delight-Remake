ServerEvents.tags("item", e => {
    e.add("c:hidden_from_recipe_viewers", "northeast_china_delight:sea_water_bucket")
    e.remove("createdelight:order/sauce", "youkaishomecoming:soy_sauce_bottle")
    e.add("createdelight:order/sauce", "northeast_china_delight:soy_sauce")
    e.remove("forge:foods/seasonings/soy_sauce", "youkaishomecoming:soy_sauce_flask")
})

ServerEvents.tags("fluid", e => {
    e.add("c:hidden_from_recipe_viewers", [
        "northeast_china_delight:vinegar",
        "northeast_china_delight:flowing_vinegar",
        "northeast_china_delight:vegetable_oil",
        "northeast_china_delight:flowing_vegetable_oil",
        "northeast_china_delight:soy_milk",
        "northeast_china_delight:flowing_soy_milk",
        "youkaishomecoming:soy_sauce"
    ])
    e.remove("c:hidden_from_recipe_viewers", "northeast_china_delight:soy_sauce")
    e.remove("c:hidden_from_recipe_viewers", "northeast_china_delight:flowing_soy_sauce")
    e.remove("quality_food_fluids:quality_fluids", "youkaishomecoming:soy_sauce")
    e.add("quality_food_fluids:quality_fluids", "northeast_china_delight:soy_sauce")
})
