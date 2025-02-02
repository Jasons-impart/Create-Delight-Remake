ItemEvents.modification(e => {
    e.modify("deeperdarker:heart_of_the_deep", item => {
        item.maxStackSize = 64
    })
    // 饱和度计算公式为hunger*saturation*2
    let hungers = [
        ["vintagedelight:cheese_pizza_slice", 5, 0.7],
        ["ratatouille:cake_base", 7, 0.5],
        ['aetherdelight:bowl_of_blue_berries', 6, 0.3],
        ['aetherdelight:sweet_and_sour_soup', 6, 0.5],
        ['aetherdelight:swet_pudding', 6.5, 0.7],
        ['aetherdelight:bowl_of_ginger_cookies', 6, 0.8],
        ['aetherdelight:festive_sweets', 6, 0.6],
        ['aether:enchanted_berry', 3, 1],
        ['aetherdelight:bowl_of_enchanted_berries', 9, 0.5],
        ['casualness_delight:cooked_donkey_meat', 6, 0.8],
        ['casualness_delight:donkey_burger', 10, 0.6],
        ['casualness_delight:roast_gluten', 7, 0.8],
        ['casualness_delight:roast_gluten', 5, 0.6],
        ['casualness_delight:raw_fried_dumpling', 9, 0.5],
        ['casualness_delight:fried_dumpling', 10, 1],
        ['casualness_delight:phantom_dumplings', 6, 0.4],
        ['casualness_delight:bowl_of_paper_wrapped_fish', 6, 1],
        ['frycooks_delight:fried_potato', 6, 1],
        ['vintagedelight:oatmeal', 5, 1],
        ['casualness_delight:fish_and_chips', 12, 0.5],
        ['casualness_delight:fried_chicken_chip', 6, 0.8],
        ['casualness_delight:bowl_of_fried_dumpling', 6, 0.8],
        ['create_confectionery:gingerbread_man', 6, 0.7],
        ['create_confectionery:gingerbread', 6, 0.7],
        ['vintagedelight:chocolate_nut_granola_bar', 5, 1.2],
        ['create:blaze_cake', 10, 0.75],
        ['oceanic_delight:shrimp_chips', 4, 1.5],
        ['create:sweet_roll', 8, 1.5]
    ]
    hungers.forEach(hunger => {
        e.modify(hunger[0], item => {
            item.foodProperties = food => {
                food.hunger(hunger[1])
                food.saturation(hunger[2])
            }
        })
    })
    // 参数含义分别为，食物id，effectid，持续时间（tick），强度，获得效果的概率
    let effects = [
        ["vintagedelight:surstromming", "minecraft:nausea", 1200, 2, 1.0],
        ["culturaldelights:squid", "minecraft:darkness", 120, 1, 1.0],
        ["culturaldelights:glow_squid", "minecraft:glowing", 120, 1, 1.0],
        ["mynethersdelight:ghast_dough", "minecraft:levitation", 120, 1, 1.0],
        ["culturaldelights:pickle", "farmersdelight:nourishment", 600, 1, 1.0],
        ["culturaldelights:cut_pickle", "farmersdelight:nourishment", 300, 1, 1],
        ["casualness_delight:raw_fried_dumpling", "minecraft:nausea", 600, 2, 1],
        ["create:blaze_cake", "mynethersdelight:b_pungent", 1200, 2, 1],
        ["create:blaze_cake", "supplementaries:flammable", 1200, 2, 1],
        ["create:blaze_cake", "minecraft:strength", 600, 2, 1],
        ["create_central_kitchen:chocolate_cake_slice", "neapolitan:sugar_rush", 10, 1, 1],
        ['corn_delight:classic_corn_dog', "minecraft:resistance", 200, 1, 1],
        ['corn_delight:classic_corn_dog', "minecraft:fire_resistance", 200, 1, 1]
    ]
    effects.forEach(effect => {
        e.modify(effect[0], item => {
            item.foodProperties = food => {
                food.effect(effect[1], effect[2], effect[3], effect[4])
            }
        })
    })

    e.modify("butchercraft:apron", item => {
        item.maxDamage = 240
    })
    e.modify("butchercraft:gloves", item => {
        item.maxDamage = 225
    })
    e.modify("butchercraft:mask", item => {
        item.maxDamage = 165
    })
    e.modify("butchercraft:boots", item => {
        item.maxDamage = 195
    })
})