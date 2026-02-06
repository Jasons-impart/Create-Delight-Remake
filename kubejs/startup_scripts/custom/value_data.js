// 默认食材价值，如果希望是其他值，加入Dict
const DefaultFoodIngredientValue = 1;
let FoodIngredientValueDict = {
    // 其他价值的食材
    "minecraft:beef": 2,
    "minecraft:cod": 2,
    "minecraft:salmon": 2,
    "minecraft:tropical_fish": 2,
    "minecraft:chicken": 4,
    "minecraft:mutton": 4,
    "minecraft:rabbit": 4,

    "culturaldelights:squid": 2,

    "mynethersdelight:hoglin_loin": 5,

    "youkaishomecoming:udumbara_flower": 9,

    "collectorsreap:stygian_pomegranate": 2,
    "collectorsreap:tiger_prawn": 4,
    "collectorsreap:urchin": 4,
    "collectorsreap:platinum_bass": 4,
    "collectorsreap:clam": 4,
    "collectorsreap:chieftain_crab_bucket": 4,

    "alexsdelight:raw_bison": 4,
    "alexsdelight:raw_bunfungus": 4,

    "alexsmobs:kangaroo_meat": 2,
    "alexsmobs:moose_ribs": 2,
    "alexsmobs:emu_egg": 2,
    "alexsmobs:raw_catfish": 2,

    "alexscaves:candy_cane": 10,

    "butchercraft:tripe": 2,
    "butchercraft:stomach": 2,
    "butchercraft:lung": 2,
    "butchercraft:liver": 2,
    "butchercraft:kidney": 2,
    "butchercraft:heart": 2,
    "butchercraft:brain": 2,

    "crabbersdelight:clam": 2,
    "crabbersdelight:crab": 4,

    "ratatouille:cocoa_butter": 2,
    "ratatouille:cocoa_solids": 2,

    "createdelight:butter": 2,

    // 默认价值的食材
    "minecraft:carrot": DefaultFoodIngredientValue,
    "minecraft:potato": DefaultFoodIngredientValue,
    "minecraft:beetroot": DefaultFoodIngredientValue,
    "minecraft:wheat": DefaultFoodIngredientValue,
    "minecraft:crimson_fungus": DefaultFoodIngredientValue,
    "minecraft:warped_fungus": DefaultFoodIngredientValue,
    "minecraft:brown_mushroom": DefaultFoodIngredientValue,
    "minecraft:red_mushroom": DefaultFoodIngredientValue,
    "minecraft:kelp": DefaultFoodIngredientValue,
    "minecraft:cocoa_beans": DefaultFoodIngredientValue,

    "createcafe:cassava_root": DefaultFoodIngredientValue,

    "farmersdelight:cabbage": DefaultFoodIngredientValue,
    "farmersdelight:tomato": DefaultFoodIngredientValue,
    "farmersdelight:onion": DefaultFoodIngredientValue,
    "farmersdelight:pie_crust": DefaultFoodIngredientValue,

    "culturaldelights:eggplant": DefaultFoodIngredientValue,
    "culturaldelights:avocado": DefaultFoodIngredientValue,
    "culturaldelights:corn_cob": DefaultFoodIngredientValue,

    "festival_delicacies:chinese_cabbage": DefaultFoodIngredientValue,
    "festival_delicacies:greenonion": DefaultFoodIngredientValue,
    "festival_delicacies:eggplant": DefaultFoodIngredientValue,
    "festival_delicacies:garlic_chive": DefaultFoodIngredientValue,

    "vintagedelight:peanut": DefaultFoodIngredientValue,
    "vintagedelight:ghost_pepper": DefaultFoodIngredientValue,
    "vintagedelight:cucumber": DefaultFoodIngredientValue,
    "vintagedelight:gearo_berry": DefaultFoodIngredientValue,
    "vintagedelight:oats": DefaultFoodIngredientValue,
    "vintagedelight:salt_dust": DefaultFoodIngredientValue,

    "neapolitan:banana": DefaultFoodIngredientValue,
    "neapolitan:mint_leaves": DefaultFoodIngredientValue,
    "neapolitan:vanilla_pods": DefaultFoodIngredientValue,
    "neapolitan:strawberries": DefaultFoodIngredientValue,

    "mynethersdelight:bullet_pepper": DefaultFoodIngredientValue,
    "mynethersdelight:powder_cannon": DefaultFoodIngredientValue,
    "mynethersdelight:ghasmati": DefaultFoodIngredientValue,

    "youkaishomecoming:pods": DefaultFoodIngredientValue,
    "youkaishomecoming:mandrake_root": DefaultFoodIngredientValue,
    "youkaishomecoming:mandrake_flower": DefaultFoodIngredientValue,
    "youkaishomecoming:raw_lamprey": DefaultFoodIngredientValue,

    "nethervinery:crimson_grape": DefaultFoodIngredientValue,
    "nethervinery:warped_grape": DefaultFoodIngredientValue,

    "vinery:cherry": DefaultFoodIngredientValue,
    "vinery:red_grape": DefaultFoodIngredientValue,
    "vinery:white_grape": DefaultFoodIngredientValue,
    "vinery:savanna_grapes_red": DefaultFoodIngredientValue,
    "vinery:savanna_grapes_white": DefaultFoodIngredientValue,
    "vinery:taiga_grapes_red": DefaultFoodIngredientValue,
    "vinery:taiga_grapes_white": DefaultFoodIngredientValue,
    "vinery:jungle_grapes_red": DefaultFoodIngredientValue,
    "vinery:jungle_grapes_white": DefaultFoodIngredientValue,

    "fruitsdelight:pear": DefaultFoodIngredientValue,
    "fruitsdelight:hawberry": DefaultFoodIngredientValue,
    "fruitsdelight:lychee": DefaultFoodIngredientValue,
    "fruitsdelight:mango": DefaultFoodIngredientValue,
    "fruitsdelight:persimmon": DefaultFoodIngredientValue,
    "fruitsdelight:peach": DefaultFoodIngredientValue,
    "fruitsdelight:orange": DefaultFoodIngredientValue,
    "fruitsdelight:mangosteen": DefaultFoodIngredientValue,
    "fruitsdelight:bayberry": DefaultFoodIngredientValue,
    "fruitsdelight:kiwi": DefaultFoodIngredientValue,
    "fruitsdelight:fig": DefaultFoodIngredientValue,
    "fruitsdelight:blueberry": DefaultFoodIngredientValue,
    "fruitsdelight:lemon": DefaultFoodIngredientValue,
    "fruitsdelight:cranberry": DefaultFoodIngredientValue,
    "fruitsdelight:pineapple": DefaultFoodIngredientValue,
    "fruitsdelight:durian": DefaultFoodIngredientValue,

    "oceanic_delight:sea_grape": DefaultFoodIngredientValue,

    "farmersrespite:green_tea_leaves": DefaultFoodIngredientValue,
    "farmersrespite:yellow_tea_leaves": DefaultFoodIngredientValue,
    "farmersrespite:black_tea_leaves": DefaultFoodIngredientValue,

    "frycooks_delight:canola": DefaultFoodIngredientValue,

    "collectorsreap:pomegranate": DefaultFoodIngredientValue,
    "collectorsreap:lime": DefaultFoodIngredientValue,
    "collectorsreap:portobello_colony": DefaultFoodIngredientValue,

    "butchercraft:leather_scrap": DefaultFoodIngredientValue,
    "butchercraft:sinew": DefaultFoodIngredientValue,
    "butchercraft:fat": DefaultFoodIngredientValue,

    "bakeries:flour": DefaultFoodIngredientValue,

    "createdelight:dry_yeast": DefaultFoodIngredientValue,

}
// 从这一Dict获取价值
global.FoodIngredientValueDict = new Map(Object.entries(FoodIngredientValueDict));

// 默认配方价值倍率，如果希望是其他值，加入Dict。如果值过大可能会上溢导致kjs加载失败。
global.DefaultRecipeValueMultiplier = 4;
let RecipeValueMultiplierDict = {
    // "crafting": 10
}
global.RecipeValueMultiplierDict = new Map(Object.entries(RecipeValueMultiplierDict));