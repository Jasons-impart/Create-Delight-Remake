ItemEvents.modification(e => {
// 抗火
    /**
     * 
     * @param {Internal.Item} id 
     */
    let fire_resistance = function(id) {
        e.modify(id, item => {
            item.fireResistant = true
        })
    }
// 食物修改,参数分别为食物id，饥饿值，饱和度
    /**
     * 
     * @param {Internal.Item} food 
     * @param {number} [hunger] 饥饿值,默认为3
     * @param {number} [saturation] 饱和度,默认为0.5,固定递进为0.5
     */
    let food_hungers = function (food, hunger, saturation) {
        hunger = hunger || 3
        saturation = saturation || 0.5
        e.modify(food, item => {
            item.foodProperties = food => {
                food.hunger(hunger)
                food.saturation(saturation/hunger)
            }
        })
    }
// 食物效果修改,参数分别为食物id，效果id，持续时间（s），强度，获得效果的概率
    /**
     * 
     * @param {Internal.Ingredient_} food 
     * @param {Special.MobEffect} effect 
     * @param {number} [duration] 以s为单位,若不填则默认为10s
     * @param {number} [strength] 实际值为strength+1,若不填则默认为0
     * @param {number} [probability] 概率,若不填则默认为1
     */
    let food_effects = function(food, effect, duration, strength, probability) {
        duration = duration || 10
        strength = strength || 0
        probability = probability || 1
        e.modify(food, item => {
            item.foodProperties = food => {
                food.effect(effect, 20 * duration, strength, probability)
            }
        })
    }
// 最大耐久度修改,物品id,最大耐久度
    /**
     * 
     * @param {Internal.Item} item 
     * @param {number} maxDamage 
     */
    let maxDamage_change = function (item, maxDamage) {
        e.modify(item, item => {
            item.maxDamage = maxDamage
        }) 
    }

// 红茶效果修改,食物id,持续时间（s）,强度
    /**
     * 
     * @param {Internal.Ingredient_} food 
     * @param {number} polyphenols_duration 时间以s为单位
     * @param {number} polyphenols_strength
     * @param {number} [sober_duration] 以s为单位,若不填则不添加
     * @param {number} [thick_duration] 以s为单位,若不填则不添加
     */
    let red_tea_effect = function (food, polyphenols_duration, polyphenols_strength, sober_duration, thick_duration) {
        e.modify(food, item => {
            item.foodProperties = food => {
                food.removeEffect("farmersrespite:caffeinated")
                food.effect("youkaishomecoming:tea_polyphenols", 20 * polyphenols_duration, polyphenols_strength, 1)
                if (sober_duration !== undefined) {
                    food.effect("youkaishomecoming:sober", 20 * sober_duration, 0, 1)
                }
                if (thick_duration !== undefined) {
                    food.effect("youkaishomecoming:thick", 20 * thick_duration, 0, 1)
                }
            } 
        })
    }
// 黄茶效果修改,食物id,持续时间（s）,强度
    /**
     * 
     * @param {Internal.Ingredient_} food 
     * @param {number} polyphenols_duration 时间以s为单位
     * @param {number} polyphenols_strength
     * @param {number} [sober_duration] 以s为单位,若不填则不添加
     * @param {number} [smoothing_duration] 以s为单位,若不填则不添加
     */
    let yellow_tea_effect = function (food, polyphenols_duration, polyphenols_strength, sober_duration, smoothing_duration) {
        e.modify(food, item => {
            item.foodProperties = food => {
                food.removeEffect("minecraft:resistance")
                food.effect("youkaishomecoming:tea_polyphenols", 20 * polyphenols_duration, polyphenols_strength, 1)
                if (sober_duration !== undefined) {
                    food.effect("youkaishomecoming:sober", 20 * sober_duration, 0, 1)
                }
                if (smoothing_duration !== undefined) {
                    food.effect("youkaishomecoming:smoothing", 20 * smoothing_duration, 0, 1)
                }
            } 
        })
    }
// 绿茶效果修改,食物id,持续时间（s）,强度
    /**
     * 
     * @param {Internal.Ingredient_} food 
     * @param {number} polyphenols_duration 时间以s为单位
     * @param {number} polyphenols_strength
     * @param {number} [sober_duration] 以s为单位,若不填则不添加
     * @param {number} [haste_duration] 以s为单位,若不填则不添加
     */
    let green_tea_effect = function (food, polyphenols_duration, polyphenols_strength, sober_duration, haste_duration) {
        e.modify(food, item => {
            item.foodProperties = food => {
                food.removeEffect("minecraft:haste")
                food.effect("youkaishomecoming:tea_polyphenols", 20 * polyphenols_duration, polyphenols_strength, 1)
                if (sober_duration !== undefined) {
                    food.effect("youkaishomecoming:sober", 20 * sober_duration, 0, 1)
                }
                if (haste_duration !== undefined) {
                    food.effect("minecraft:haste", 20 * haste_duration, 0, 1)
                }
            } 
        })
    }

// 咖啡效果修改,食物id,持续时间（s）,强度
    /**
     * 
     * @param {Internal.Ingredient_} food 
     * @param {number} caffeinated_duration 以s为单位
     * @param {number} caffeinated_strength
     * @param {number} [sober_duration] 以s为单位,若不填则不添加
     */
    let coffee_effect = function (food, caffeinated_duration, caffeinated_strength, sober_duration) {
        e.modify(food, item => {
            item.foodProperties = food => {
                food.removeEffect("createcafe:caffeinated")
                food.removeEffect("youkaishomecoming:caffeinated")
                food.removeEffect("youkaishomecoming:sober")
                food.effect("farmersrespite:caffeinated", 20 * caffeinated_duration, caffeinated_strength, 1)
                if (sober_duration !== undefined) {
                    food.effect("youkaishomecoming:sober", 20 * sober_duration, 0, 1)
                }
            } 
        })
    }

    // 耐久修改
    maxDamage_change("butchercraft:apron", 240)
    maxDamage_change("butchercraft:gloves", 225)
    maxDamage_change("butchercraft:mask", 165)
    maxDamage_change("butchercraft:boots", 195)
    maxDamage_change("bakeries:bread_knife", 100)

    //抗火
    fire_resistance("createmetallurgy:raw_wolframite_block")
    fire_resistance("createmetallurgy:wolframite_ore")
    fire_resistance("createmetallurgy:raw_wolframite")
    fire_resistance("createmetallurgy:crushed_raw_wolframite")
    fire_resistance("createmetallurgy:dirty_wolframite_dust")
    fire_resistance("createmetallurgy:wolframite_dust")

    // 食物效果修改
    food_hungers("vintagedelight:cheese_pizza_slice", 5, 3.5)
    food_hungers("ratatouille:cake_base", 7, 4.5)
    food_hungers("casualness_delight:cooked_donkey_meat", 6, 4.5)
    food_hungers("casualness_delight:donkey_burger", 10, 6)
    food_hungers("casualness_delight:roast_gluten", 5, 3)
    food_hungers("casualness_delight:raw_fried_dumpling", 9, 4.5)
    food_hungers("casualness_delight:fried_dumpling", 10, 5)
    food_hungers("casualness_delight:phantom_dumplings", 6, 2.5)
    food_hungers("casualness_delight:bowl_of_paper_wrapped_fish", 6, 2.5)
    food_hungers("frycooks_delight:fried_potato", 6, 6)
    food_hungers("vintagedelight:oatmeal", 5, 2.5)
    food_hungers("casualness_delight:fish_and_chips", 12, 6)
    food_hungers("casualness_delight:fried_chicken_chip", 6, 4.5)
    food_hungers("casualness_delight:bowl_of_fried_dumpling", 2.5, 2)
    food_hungers("create_confectionery:gingerbread_man", 6, 3.5)
    food_hungers("create_confectionery:gingerbread", 6, 3.5)
    food_hungers("vintagedelight:chocolate_nut_granola_bar", 5, 4)
    food_hungers('vintagedelight:fruity_granola_bar', 3, 2)
    food_hungers('vintagedelight:deluxe_granola_bar', 6, 6)
    food_hungers("create:blaze_cake", 10, 7)
    food_hungers("oceanic_delight:shrimp_chips", 4, 5.5)
    food_hungers("create:sweet_roll", 8, 6)
    food_effects("vintagedelight:surstromming", "minecraft:nausea", 60, 2)
    food_effects("culturaldelights:squid", "minecraft:darkness", 6, 1)
    e.modify("culturaldelights:glow_squid", item => {
        item.foodProperties = food => {
            food.removeEffect("minecraft:glowing")
            food.effect("minecraft:glowing", 120, 1, 1)
        }
    })
    food_effects("mynethersdelight:ghast_dough", "minecraft:levitation", 6, 1)
    food_effects("culturaldelights:pickle", "farmersdelight:nourishment", 10, 1)
    food_effects("culturaldelights:cut_pickle", "farmersdelight:nourishment", 15, 1)
    food_effects("casualness_delight:raw_fried_dumpling", "minecraft:nausea", 30, 2)
    food_effects("create:blaze_cake", "supplementaries:flammable", 60, 2)
    food_effects("create:blaze_cake", "minecraft:strength", 30, 2)
    food_effects("create_central_kitchen:chocolate_cake_slice", "neapolitan:sugar_rush", 2, 1)
    food_effects('corn_delight:classic_corn_dog', "minecraft:resistance", 10, 1)
    food_effects('corn_delight:classic_corn_dog', "minecraft:fire_resistance", 10, 1)
    food_effects('create_confectionery:bar_of_caramel', "alexscaves:sugar_rush", 10, 0, 0.04)
    food_effects("alexscaves:frostmint", "neapolitan:berserking", 60)
    food_effects('alexscaves:peppermint_powder', "neapolitan:berserking", 60)
    food_effects("alexscaves:candy_cane", "neapolitan:berserking", 45)
    food_effects('createcafe:mint_iced_coffee', "neapolitan:berserking", 60)
    food_effects('abnormals_delight:mint_cake_slice', "neapolitan:berserking")
    food_effects("alexscaves:small_peppermint", "neapolitan:berserking", 45)
    food_effects("alexscaves:large_peppermint", "neapolitan:berserking", 120)
        //紫颂果食物传送效果'ends_delight:chorus_fruit_grain'
    food_effects("ends_delight:chorus_fruit_milk_tea", "fruitsdelight:chorus", 0.05)
    food_effects("ends_delight:bubble_tea", "fruitsdelight:chorus", 0.05)
    food_effects("ends_delight:chorus_cookie", "fruitsdelight:chorus", 0.05)
    food_effects("createdelight:chorus_cookie_dough", "fruitsdelight:chorus", 0.05)
    food_effects("ends_delight:chorus_fruit_grain", "fruitsdelight:chorus", 0.05)
    food_effects("ends_delight:chorus_flower_pie", "fruitsdelight:chorus", 0.05)
    food_effects("ends_delight:chorus_flower_tea", "fruitsdelight:chorus", 0.05)
    food_effects("ends_delight:chorus_fruit_pie_slice", "fruitsdelight:chorus", 0.05)
        
        //鱼籽效果
    food_effects('oceanic_delight:salmon_eggs', "minecraft:conduit_power", 10, 0, 0.3)
    e.modify('oceanic_delight:salmon_eggs', item => {
        item.foodProperties = food => {
            food.removeEffect("minecraft:conduit_power")
        }
    })
        //奥利奥效果
    e.modify('createcafe:oreo', item => {
        item.foodProperties = food => {
            food.effect("minecraft:speed", 400, 1, 1)
            food.effect("minecraft:regeneration", 400, 1, 1)
            food.effect("minecraft:resistance", 400, 1, 1)
            food.effect("minecraft:fire_resistance", 400, 1, 1)
            food.effect("minecraft:absorption", 400, 1, 1)
        }
    })
    //咖啡效果
    coffee_effect('createcafe:strawberry_iced_coffee', 600, 0, 600)
    coffee_effect('createcafe:vanilla_iced_coffee', 600, 0, 600)
    coffee_effect('createcafe:mint_iced_coffee', 600, 0, 600)
    coffee_effect('createcafe:caramel_iced_coffee', 600, 0, 600)
    coffee_effect('createcafe:banana_iced_coffee', 600, 0, 600)
    coffee_effect('createcafe:iced_coffee', 150, 2, 150)
    coffee_effect('createcafe:iced_coffee_milk', 300, 1, 300)
    coffee_effect('youkaishomecoming:coffee_mochi', 150, 0, 150)
    coffee_effect('trailandtales_delight:ancient_coffee', 300, 1, 300)
    coffee_effect('youkaishomecoming:americano', 150, 0, 150)
    coffee_effect('youkaishomecoming:espresso', 300, 2, 300)
    coffee_effect('youkaishomecoming:ristretto', 300, 3, 300)
    coffee_effect('youkaishomecoming:affogato', 300, 2, 300)
    coffee_effect('youkaishomecoming:con_panna', 300, 3, 300)
    coffee_effect('youkaishomecoming:macchiato', 300, 2, 300)
    coffee_effect('youkaishomecoming:cappuccino', 300, 2, 300)
    coffee_effect('youkaishomecoming:latte', 300, 2, 300)
    coffee_effect('youkaishomecoming:mocha', 300, 2, 300)
    coffee_effect('createcafe:coffee_fruit', 10, 0)
    coffee_effect('createcafe:coffee_beans', 10, 0)
    coffee_effect('createcafe:roasted_coffee_beans', 20, 0, 20)
    coffee_effect('createcafe:coffee_grounds', 30, 0, 30)
    coffee_effect('farmersrespite:coffee_cake_slice', 150, 0, 150)

    // 红茶效果
    red_tea_effect("farmersrespite:black_tea", 60, 0, 60, 30)
    red_tea_effect("farmersrespite:long_black_tea", 90, 0, 90, 45)
    red_tea_effect("farmersrespite:strong_black_tea", 30, 1, 30, 30)
    red_tea_effect("collectorsreap:pomegranate_black_tea", 60, 0, 60, 30)
    red_tea_effect("collectorsreap:black_tea_gummy", 20, 2, 20, 10)
    red_tea_effect('ends_delight:chorus_fruit_milk_tea', 45, 0, 45, 20)
    red_tea_effect('ends_delight:bubble_tea', 45, 0, 45, 20)
    red_tea_effect('fruitsdelight:mango_tea', 45, 0, 45, 20)
    red_tea_effect('createcafe:banana_milk_tea', 45, 0, 45, 20)
    red_tea_effect('createcafe:cherry_milk_tea', 45, 0, 45, 20)
    red_tea_effect('createcafe:strawberry_milk_tea', 45, 0, 45, 20)
    red_tea_effect('createcafe:mango_milk_tea', 45, 0, 45, 20)
    red_tea_effect('createcafe:peach_milk_tea', 45, 0, 45, 20)
    red_tea_effect('createcafe:blueberry_milk_tea', 45, 0, 45, 20)
    red_tea_effect('createcafe:sweetberry_milk_tea', 45, 0, 45, 20)
    red_tea_effect('createcafe:avocado_milk_tea', 45, 0, 45, 20)
    red_tea_effect('createcafe:vanilla_milk_tea', 45, 0, 45, 20)
    red_tea_effect('createcafe:oreo_milk_tea', 45, 0, 45, 20)
    red_tea_effect('createcafe:pomegranate_tea', 45, 0, 45, 20)
    e.modify("farmersrespite:black_cod", item => {
        item.foodProperties = food => {
            food.removeEffect("farmersrespite:caffeinated")
            food.effect("youkaishomecoming:thick", 600, 0, 1)
        }
    })

    // 乌龙茶效果
    yellow_tea_effect('farmersrespite:yellow_tea', 60, 0, 60, 30)
    yellow_tea_effect('farmersrespite:long_yellow_tea', 90, 0, 90, 45)
    yellow_tea_effect('farmersrespite:strong_yellow_tea', 30, 1, 30, 30)
    yellow_tea_effect('trailandtales_delight:torchflower_tea', 45, 0, 45, 20)
    yellow_tea_effect('trailandtales_delight:cherry_petal_tea', 45, 0, 45, 20)
    yellow_tea_effect('fruitsdelight:hawberry_tea', 45, 0, 45, 20)
    yellow_tea_effect('fruitsdelight:peach_tea', 45, 0, 45, 20)
    yellow_tea_effect('createcafe:lychee_milk_tea', 45, 0, 45, 20)
    yellow_tea_effect('createcafe:pumpkin_milk_tea', 45, 0, 45, 20)
    yellow_tea_effect('createcafe:kiwi_milk_tea', 45, 0, 45, 20)
    yellow_tea_effect('createcafe:orange_milk_tea', 45, 0, 45, 20)
    yellow_tea_effect('createcafe:persimmon_milk_tea', 45, 0, 45, 20)
    yellow_tea_effect('createcafe:durian_milk_tea', 45, 0, 45, 20)
    yellow_tea_effect("collectorsreap:yellow_tea_gummy", 20, 2, 20, 10)
    
    // 绿茶效果
    green_tea_effect('farmersrespite:green_tea', 60, 1, 60, 30)
    green_tea_effect('farmersrespite:long_green_tea', 90, 1, 90, 45)
    green_tea_effect('farmersrespite:strong_green_tea', 30, 2, 30, 30)
    green_tea_effect('collectorsreap:lime_green_tea', 45, 0, 45, 20)
    green_tea_effect('alexcaves_delight:tree_star_tea', 45, 0, 45, 20)
    green_tea_effect('fruitsdelight:mangosteen_tea', 45, 0, 45, 20)
    green_tea_effect('trailandtales_delight:pitcher_plant_tea', 45, 0, 45, 20)
    green_tea_effect('fruitsdelight:lychee_cherry_tea', 45, 0, 45, 20)
    green_tea_effect('createcafe:lemon_milk_tea', 45, 0, 45, 20)
    green_tea_effect('createcafe:fig_milk_tea', 45, 0, 45, 20)
    green_tea_effect('createcafe:grape_milk_tea', 45, 0, 45, 20)
    green_tea_effect('createcafe:pineapple_milk_tea', 45, 0, 45, 20)
    green_tea_effect('createcafe:apple_milk_tea', 45, 0, 45, 20)
    green_tea_effect('createcafe:blood_orange_milk_tea', 45, 0, 45, 20)
    green_tea_effect('createcafe:watermelon_milk_tea', 45, 0, 45, 20)
    green_tea_effect('createcafe:lime_tea', 45, 0, 45, 20)
    green_tea_effect('cavedelight:fiddlehead_tea', 45, 0, 45, 20)
    green_tea_effect('farmersrespite:green_tea_cookie', 20, 0, 20, 10)
    green_tea_effect('createdelight:green_tea_cookie_dough', 10, 0)
    e.modify("collectorsreap:green_tea_gummy", item => {
        item.foodProperties = food => {
            food.removeEffect("minecraft:haste")
            food.effect("youkaishomecoming:tea_polyphenols", 400, 2, 1)
            food.effect("youkaishomecoming:sober", 400, 0, 1)
            food.effect("minecraft:haste", 200, 2, 1)
        }
    })

    //合成后返还酒瓶
    e.modify([
    'nethervinery:blazewine_pinot',
    'nethervinery:netherite_nectar',
    'nethervinery:ghastly_grenache',
    'nethervinery:lava_fizz',
    'nethervinery:nether_fizz',
    'nethervinery:improved_lava_fizz',
    'nethervinery:improved_nether_fizz',
    'vinery:apple_juice',
    'vinery:mead',
    'vinery:apple_cider',
    'vinery:apple_wine',
    'vinery:mellohi_wine',
    'vinery:glowing_wine',
    'vinery:solaris_wine',
    'vinery:noir_wine',
    'vinery:red_wine',
    'vinery:strad_wine',
    'vinery:cherry_wine',
    'vinery:cristel_wine',
    'vinery:creepers_crush',
    'vinery:kelp_cider',
    'vinery:lilitu_wine',
    'vinery:jo_special_mixture',
    'vinery:eiswein',
    'vinery:aegis_wine',
    'vinery:bolvar_wine',
    'vinery:chorus_wine',
    'vinery:villagers_fright',
    'vinery:clark_wine',
    'vinery:magnetic_wine',
    'vinery:stal_wine',
    'vinery:chenet_wine',
    'vinery:bottle_mojang_noir',
    'vinery:jellie_wine'
    ], item => {
        item.setCraftingRemainingItem("vinery:wine_bottle")
    })
})