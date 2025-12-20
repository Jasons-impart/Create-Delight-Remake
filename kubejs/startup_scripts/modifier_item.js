ItemEvents.modification(e => {
    // 抗火
    /**
     * 
     * @param {Internal.Item} id 
     */
    let fire_resistance = function (id) {
        e.modify(id, item => {
            item.fireResistant = true
        })
    }
    // 食物修改为快速食用
    /**
     * 
     * @param {Internal.Item} food 
     */
    let food_fastToEat = function (food) {
        e.modify(food, item => {
            item.foodProperties = food => {
                food.fastToEat()
            }
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
                food.saturation(saturation / hunger)
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
    let food_effects = function (food, effect, duration, strength, probability) {
        duration = duration || 10
        strength = strength || 0
        probability = probability || 1
        e.modify(food, item => {
            item.foodProperties = food => {
                food.effect(effect, 20 * duration, strength, probability)
            }
        })
    }
    // 食物效果移除
    /**
     * 
     * @param {Internal.Ingredient_} food 
     * @param {Special.MobEffect} effect 
     */
    let remove_effects = function (food, effect) {
        e.modify(food, item => {
            item.foodProperties = food => {
                food.removeEffect(effect)
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
    // 最大堆叠修改,物品id,最大堆叠数
    /**
     * 
     * @param {Internal.Ingredient_} item 
     * @param {number} maxStackSize 最大堆叠数,默认为64
     */
    let maxStackSize_change = function (item, maxStackSize) {
        e.modify(item, item => {
            item.maxStackSize = maxStackSize
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

    // 最大堆叠修改
    maxStackSize_change('ends_delight:chorus_fruit_popsicle', 64)
    maxStackSize_change('youkaishomecoming:milk_popsicle', 64)
    maxStackSize_change('youkaishomecoming:big_popsicle', 64)
    maxStackSize_change('createdelightcore:lush_confiture_jelly_bottle', 16)
    const iceCreamItems = [
        "cosmopolitan:tricolored_ice_cream_sandwich",
        "cosmopolitan:enchanted_fruit_ice_cream",
        "cosmopolitan:classic_ice_cream",
        "cosmopolitan:peculiar_ice_cream",
        "neapolitan:mint_ice_cream",
        "cosmopolitan:carrot_ice_cream",
        "neapolitan:neapolitan_ice_cream",
        "collectorsreap:lime_ice_cream",
        "neapolitan:adzuki_ice_cream",
        "seasonals:pumpkin_ice_cream",
        "neapolitan:chocolate_ice_cream",
        "seasonals:beetroot_ice_cream",
        "neapolitan:strawberry_ice_cream",
        "seasonals:sweet_berry_ice_cream",
        "cosmopolitan:apple_ice_cream",
        "cosmopolitan:kabloom_ice_cream",
        "cosmopolitan:source_berry_ice_cream",
        "cosmopolitan:seasonal_ice_cream",
        "cosmopolitan:glow_berry_ice_cream",
        "neapolitan:banana_ice_cream",
        "neapolitan:vanilla_ice_cream",
        "collectorsreap:pomegranate_ice_cream"
    ].forEach(item => {
        maxStackSize_change(item, 16)
    })

    //抗火
    fire_resistance("createmetallurgy:raw_wolframite_block")
    fire_resistance("createmetallurgy:wolframite_ore")
    fire_resistance("createmetallurgy:raw_wolframite")
    fire_resistance("createmetallurgy:crushed_raw_wolframite")
    fire_resistance("createmetallurgy:dirty_wolframite_dust")
    fire_resistance("createmetallurgy:wolframite_dust")

    // 食物修改为快速食用
    food_fastToEat("ends_delight:chorus_fruit_popsicle")
    food_fastToEat('fruitsdelight:blueberry_muffin')
    food_fastToEat('fruitsdelight:cranberry_muffin')
    food_fastToEat('bakeries:cup_cake')

    // 食物饱食度修改
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
    food_hungers("cmr:frozen_cake", 10, 7)
    food_hungers("oceanic_delight:shrimp_chips", 4, 5.5)
    food_hungers("create:sweet_roll", 8, 6)
    food_hungers("alexscaves:fiddlehead", 1, 0.5)
    food_hungers("createcafe:oreo_half", 5, 5)
    food_hungers("createcafe:oreo_crashed", 5, 2.5)
    food_hungers("createcafe:oreo", 12, 18)
    food_hungers("createdelightcore:lush_confiture_jelly_bottle", 4, 3)
    food_hungers('createdelight:fugu_roll', 10, 10)
    food_hungers('silentsdelight:sculk_sensor_tendril_roll', 12, 9.8)
    food_hungers('farmersdelight:kelp_roll', 12, 9.8)
    food_hungers('silentsdelight:sculk_sensor_tendril_roll_slice', 6, 4.8)
    food_hungers('farmersdelight:kelp_roll_slice', 6, 4.8)
    food_hungers('culturaldelights:chicken_roll', 12, 23)
    food_hungers('culturaldelights:chicken_roll_slice', 4, 8)
    food_hungers('culturaldelights:midori_roll', 7, 10)
    food_hungers('culturaldelights:midori_roll_slice', 2.5, 3)
    food_hungers('oceanic_delight:sea_pickle_roll', 10, 20)
    food_hungers('oceanic_delight:sea_pickle_roll_slice', 2.5, 5)
    food_hungers('alexscaves:deep_sea_sushi_roll', 14, 26)
    food_hungers('youkaishomecoming:california_roll_slice', 7, 7)
    food_hungers('youkaishomecoming:rainbow_roll_slice', 10, 13)

    // 食物效果修改
    food_effects('culturaldelights:pufferfish_roll', "minecraft:poison", 10)
    food_effects('culturaldelights:chicken_roll', "farmersdelight:nourishment", 30)
    food_effects('culturaldelights:midori_roll', "farmersdelight:nourishment", 30)
    food_effects('oceanic_delight:sea_pickle_roll', "farmersdelight:nourishment", 30)
    food_effects('oceanic_delight:sea_pickle_roll', "minecraft:water_breathing", 60)
    food_effects('oceanic_delight:sea_pickle_roll_slice', "minecraft:water_breathing", 60)
    food_effects('alexscaves:deep_sea_sushi_roll', "farmersdelight:nourishment", 30)
    food_effects('alexscaves:deep_sea_sushi_roll', "alexscaves:deepsight", 60)
    food_effects('silentsdelight:sculk_sensor_tendril_roll', "farmersdelight:nourishment", 30)
    food_effects('silentsdelight:sculk_sensor_tendril_roll', "silentsdelight:warden_sense", 10)
    food_effects('silentsdelight:sculk_sensor_tendril_roll_slice', "silentsdelight:warden_sense", 10)
    food_effects('farmersdelight:kelp_roll', "farmersdelight:nourishment", 30)
    food_effects('createdelight:fugu_roll', "farmersdelight:nourishment", 60)
    food_effects("corn_delight:classic_corn_dog", "minecraft:resistance", 10)
    food_effects("corn_delight:classic_corn_dog", "minecraft:fire_resistance", 10)
    food_effects("vintagedelight:surstromming", "minecraft:nausea", 60, 2)
    food_effects("culturaldelights:squid", "minecraft:darkness", 6, 1)
    food_effects("mynethersdelight:ghast_dough", "minecraft:levitation", 6, 1)
    food_effects("culturaldelights:pickle", "farmersdelight:nourishment", 10, 1)
    food_effects("culturaldelights:cut_pickle", "farmersdelight:nourishment", 15, 1)
    food_effects("casualness_delight:raw_fried_dumpling", "minecraft:nausea", 30, 2)
    food_effects("create:blaze_cake", "supplementaries:flammable", 60, 2)
    food_effects("create:blaze_cake", "minecraft:strength", 30, 2)
    food_effects("cmr:frozen_cake", "minecraft:slowness", 30, 2)
    food_effects("cmr:frozen_cake", "minecraft:strength", 30, 2)
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
    food_effects("alexscaves:fiddlehead", "minecraft:poison", 5, 0, 0.2)
    food_effects("createdelightcore:lush_confiture_jelly_bottle", "cosmopolitan:tracer", 30)
    food_effects("createdelightcore:lush_confiture_jelly_bottle", "cosmopolitan:phototaxis", 30)
    //紫颂果食物传送效果
    food_effects("ends_delight:chorus_fruit_milk_tea", "fruitsdelight:chorus", 0.05)
    food_effects("ends_delight:bubble_tea", "fruitsdelight:chorus", 0.05)
    food_effects("ends_delight:chorus_cookie", "fruitsdelight:chorus", 0.05)
    food_effects("createdelight:chorus_cookie_dough", "fruitsdelight:chorus", 0.05)
    food_effects("ends_delight:chorus_fruit_grain", "fruitsdelight:chorus", 0.05)
    food_effects("ends_delight:chorus_flower_pie", "fruitsdelight:chorus", 0.05)
    food_effects("ends_delight:chorus_flower_tea", "fruitsdelight:chorus", 0.05)
    food_effects("ends_delight:chorus_fruit_pie_slice", "fruitsdelight:chorus", 0.05)
    food_effects("cosmopolitan:chorus_fruit_popsicle_double", "fruitsdelight:chorus", 0.05)
    //冰棍抗火效果
    food_effects('youkaishomecoming:milk_popsicle', "minecraft:fire_resistance", 10)
    food_effects('fruitsdelight:hamimelon_popsicle', "minecraft:fire_resistance", 10)
    food_effects('fruitsdelight:kiwi_popsicle', "minecraft:fire_resistance", 10)
    food_effects('youkaishomecoming:big_popsicle', "minecraft:fire_resistance", 10)
    food_effects('mynethersdelight:tear_popsicle', "minecraft:fire_resistance", 10)
    food_effects('farmersdelight:melon_popsicle', "minecraft:fire_resistance", 10)
    food_effects('ends_delight:chorus_fruit_popsicle', "minecraft:fire_resistance", 10)
    food_effects('casualness_delight:green_tongue', "minecraft:fire_resistance", 10)
    food_effects('collectorsreap:lime_popsicle', "minecraft:fire_resistance", 10)
    food_effects('cosmopolitan:berry_popsicle', "minecraft:fire_resistance", 10)
    food_effects('createdelight:empty_popsicle', "minecraft:fire_resistance", 10)
    food_effects('cosmopolitan:berry_popsicle_double', "minecraft:fire_resistance", 20)
    food_effects('cosmopolitan:chorus_fruit_popsicle_double', "minecraft:fire_resistance", 20)
    food_effects('cosmopolitan:lime_popsicle_double', "minecraft:fire_resistance", 20)
    // 发光鱿鱼效果修改
    remove_effects("culturaldelights:glow_squid", "minecraft:glowing")
    food_effects("culturaldelights:glow_squid", "minecraft:glowing", 6, 1, 1)
    //软糖效果
    remove_effects("collectorsreap:lime_gummy", "collectorsreap:corrosion")
    food_effects('collectorsreap:lime_gummy', "collectorsreap:corrosion", 10, 2, 1)
    remove_effects("collectorsreap:pomegranate_gummy", "collectorsreap:volatility")
    food_effects("collectorsreap:pomegranate_gummy", "collectorsreap:volatility", 10, 2, 1)
    remove_effects("collectorsreap:apple_gummy", "farmersdelight:comfort")
    food_effects("collectorsreap:apple_gummy", "cosmopolitan:exuberant", 10, 2, 1)
    remove_effects("collectorsreap:glow_berry_gummy", "minecraft:glowing")
    food_effects("collectorsreap:glow_berry_gummy", "cosmopolitan:tracer", 10, 2, 1)
    remove_effects("collectorsreap:melon_gummy", "minecraft:absorption")
    food_effects("collectorsreap:melon_gummy", "minecraft:regeneration", 10, 2, 1)
    remove_effects("collectorsreap:vanilla_gummy", "neapolitan:vanilla_scent")
    food_effects("collectorsreap:vanilla_gummy", "neapolitan:vanilla_scent", 10, 2, 1)
    remove_effects("collectorsreap:adzuki_gummy", "neapolitan:harmony")
    food_effects("collectorsreap:adzuki_gummy", "neapolitan:harmony", 10, 2, 1)
    remove_effects("collectorsreap:pumpkin_gummy", "minecraft:saturation")
    //鱼籽效果
    remove_effects('oceanic_delight:salmon_eggs', "minecraft:conduit_power")
    food_effects('oceanic_delight:salmon_eggs', "minecraft:conduit_power", 10, 0, 0.3)
    //奥利奥效果
    food_effects("createcafe:oreo", "minecraft:speed", 20, 1, 1)
    food_effects("createcafe:oreo", "minecraft:regeneration", 20, 1, 1)
    food_effects("createcafe:oreo", "minecraft:resistance", 20, 1, 1)
    food_effects("createcafe:oreo", "minecraft:fire_resistance", 20, 1, 1)
    food_effects("createcafe:oreo", "minecraft:absorption", 20, 1, 1)
    //逆天饱和效果修改
    remove_effects("bakeries:whole_wheat_bagel", "minecraft:saturation")
    remove_effects("cosmopolitan:mashed_potato", "minecraft:saturation")
    food_effects('cosmopolitan:mashed_potato', "farmersdelight:nourishment", 30, 0, 1)
    remove_effects('cosmopolitan:mashed_potato_cone', "minecraft:saturation")
    food_effects('cosmopolitan:mashed_potato_cone', "farmersdelight:nourishment", 30, 0, 1)
    remove_effects('youkaishomecoming:shinnko_maki', "minecraft:saturation")
    food_effects('youkaishomecoming:shinnko_maki', "farmersdelight:nourishment", 30, 0, 1)
    remove_effects('youkaishomecoming:kappa_maki', "minecraft:saturation")
    food_effects('youkaishomecoming:kappa_maki', "farmersdelight:nourishment", 30, 0, 1)
    remove_effects('youkaishomecoming:tekka_maki', "minecraft:saturation")
    food_effects('youkaishomecoming:tekka_maki', "farmersdelight:nourishment", 30, 0, 1)
    remove_effects('youkaishomecoming:egg_futomaki', "minecraft:saturation")
    food_effects('youkaishomecoming:egg_futomaki', "farmersdelight:nourishment", 30, 0, 1)
    remove_effects('youkaishomecoming:salmon_futomaki', "minecraft:saturation")
    food_effects('youkaishomecoming:salmon_futomaki', "farmersdelight:nourishment", 30, 0, 1)
    remove_effects('youkaishomecoming:rainbow_futomaki', "minecraft:saturation")
    food_effects('youkaishomecoming:rainbow_futomaki', "farmersdelight:nourishment", 30, 0, 1)

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