JEIEvents.removeRecipes(e => {
    // 满瓶配方代表调料瓶排液用途，残瓶配方仍在服务端按实际剩余量处理。
    const hiddenDrainingRecipes = [
        // Create 根据瓶流体能力生成的 JEI 展示，不是服务器注册的配方；ID 为 empty_物品_of_流体。
        "create:empty_northeast_china_delight_vinegar_of_northeast_china_delight_vinegar",
        "create:empty_northeast_china_delight_cooking_oil_of_northeast_china_delight_vegetable_oil",
        "create:empty_youkaishomecoming_soy_sauce_bottle_of_youkaishomecoming_soy_sauce",
        "create:empty_youkaishomecoming_soy_sauce_flask_of_youkaishomecoming_soy_sauce"
    ]
    for (let usedMb = 1; usedMb < 250; usedMb++) {
        hiddenDrainingRecipes.push(`createdelight:emptying/northeast_china_delight/vinegar_bottle/damage_${usedMb}`)
        hiddenDrainingRecipes.push(`createdelight:emptying/northeast_china_delight/cooking_oil_bottle/damage_${usedMb}`)
    }
    e.remove("create:draining", hiddenDrainingRecipes)
})
