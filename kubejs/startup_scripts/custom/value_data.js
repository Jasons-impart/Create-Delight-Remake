// 基础食材列表
global.FoodIngredientList = [
    "minecraft:carrot",
    "minecraft:potato",
    "minecraft:beetroot",
    "minecraft:wheat",
    "minecraft:crimson_fungus",
    "minecraft:warped_fungus",
    "minecraft:brown_mushroom",
    "minecraft:red_mushroom",
    "minecraft:kelp",
    "minecraft:cocoa_beans",
    "minecraft:beef",
    "minecraft:cod",
    "minecraft:salmon",
    "minecraft:tropical_fish",
    "minecraft:chicken",
    "minecraft:mutton",
    "minecraft:rabbit",

    "createcafe:cassava_root",

    "farmersdelight:cabbage",
    "farmersdelight:tomato",
    "farmersdelight:onion",
    "farmersdelight:pie_crust",

    "culturaldelights:eggplant",
    "culturaldelights:avocado",
    "culturaldelights:corn_cob",
    "culturaldelights:squid",

    "festival_delicacies:chinese_cabbage",
    "festival_delicacies:greenonion",
    "festival_delicacies:eggplant",
    "festival_delicacies:garlic_chive",

    "vintagedelight:peanut",
    "vintagedelight:ghost_pepper",
    "vintagedelight:cucumber",
    "vintagedelight:gearo_berry",
    "vintagedelight:oats",
    "vintagedelight:salt_dust",

    "neapolitan:banana",
    "neapolitan:mint_leaves",
    "neapolitan:vanilla_pods",
    "neapolitan:strawberries",

    "mynethersdelight:bullet_pepper",
    "mynethersdelight:powder_cannon",
    "mynethersdelight:hoglin_loin",
    "mynethersdelight:ghasmati",

    "youkaishomecoming:udumbara_flower",
    "youkaishomecoming:pods",
    "youkaishomecoming:mandrake_root",
    "youkaishomecoming:mandrake_flower",
    "youkaishomecoming:raw_lamprey",

    "nethervinery:crimson_grape",
    "nethervinery:warped_grape",

    "vinery:cherry",
    "vinery:red_grape",
    "vinery:white_grape",
    "vinery:savanna_grapes_red",
    "vinery:savanna_grapes_white",
    "vinery:taiga_grapes_red",
    "vinery:taiga_grapes_white",
    "vinery:jungle_grapes_red",
    "vinery:jungle_grapes_white",

    "fruitsdelight:pear",
    "fruitsdelight:hawberry",
    "fruitsdelight:lychee",
    "fruitsdelight:mango",
    "fruitsdelight:persimmon",
    "fruitsdelight:peach",
    "fruitsdelight:orange",
    "fruitsdelight:mangosteen",
    "fruitsdelight:bayberry",
    "fruitsdelight:kiwi",
    "fruitsdelight:fig",
    "fruitsdelight:blueberry",
    "fruitsdelight:lemon",
    "fruitsdelight:cranberry",
    "fruitsdelight:pineapple",
    "fruitsdelight:durian",

    "oceanic_delight:sea_grape",

    "farmersrespite:green_tea_leaves",
    "farmersrespite:yellow_tea_leaves",
    "farmersrespite:black_tea_leaves",

    "frycooks_delight:canola",

    "collectorsreap:pomegranate",
    "collectorsreap:stygian_pomegranate",
    "collectorsreap:lime",
    "collectorsreap:portobello_colony",
    "collectorsreap:tiger_prawn",
    "collectorsreap:urchin",
    "collectorsreap:platinum_bass",
    "collectorsreap:clam",
    "collectorsreap:chieftain_crab_bucket",

    "alexsdelight:raw_bison",
    "alexsdelight:raw_bunfungus",

    "alexsmobs:kangaroo_meat",
    "alexsmobs:moose_ribs",
    "alexsmobs:emu_egg",
    "alexsmobs:kangaroo_meat",
    "alexsmobs:raw_catfish",

    "alexscaves:candy_cane",

    "butchercraft:tripe",
    "butchercraft:stomach",
    "butchercraft:lung",
    "butchercraft:liver",
    "butchercraft:kidney",
    "butchercraft:heart",
    "butchercraft:brain",
    "butchercraft:leather_scrap",
    "butchercraft:sinew",
    "butchercraft:fat",

    "crabbersdelight:clam",
    "crabbersdelight:crab",

    "ratatouille:cocoa_butter",
    "ratatouille:cocoa_solids",

    "bakeries:flour",

    "createdelight:dry_yeast",
    "createdelight:butter"
];
// 默认食材价值，如果希望是其他值，加入Dict
global.DefaultFoodIngredientValue = 1;
let FoodIngredientValueDict = {
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
    "alexsmobs:kangaroo_meat": 2,
    "alexsmobs:raw_catfish": 2,

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

    "alexscaves:candy_cane": 10,

    "createdelight:butter": 2

}
global.FoodIngredientValueDict = new Map(Object.entries(FoodIngredientValueDict));

// 默认配方价值倍率，如果希望是其他值，加入Dict
global.DefaultRecipeValueMultiplier = 2;
let RecipeValueMultiplierDict = {
    // "crafting": 10
}
global.RecipeValueMultiplierDict = new Map(Object.entries(RecipeValueMultiplierDict));