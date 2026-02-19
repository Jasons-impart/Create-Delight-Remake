// 默认食材价值，如果希望是其他值，加入Dict
const DefaultFoodIngredientValue = 1;

// 默认价值列表
// 如果是食材，建议考虑统一添加#quality_food:material_whitelist标签，而不是加入这个列表
let DefaultFoodIngredientList = [
    "#quality_food:material_whitelist",

    "createcafe:cassava_root",

    "farmersdelight:cabbage",
    "farmersdelight:tomato",
    "farmersdelight:onion",
    "farmersdelight:pie_crust",

    "culturaldelights:eggplant",
    "culturaldelights:avocado",
    "culturaldelights:corn_cob",

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
    "mynethersdelight:ghasmati",

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

    "collectorsreap:lime",

    "butchercraft:leather_scrap",
    "butchercraft:sinew",
    "butchercraft:fat",

    "bakeries:flour",

    "createdelight:dry_yeast",
]

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
}

// 价值黑名单，加入黑名单的物品在计算价值时会被忽略
let ValueBlackList = [
    "fruitsdelight:durian_shell",
    "fruitsdelight:durian_helmet",
]

// 保证默认价值的物品在Map中先出现，这样特殊价值的设定就可以覆盖默认价值设定
// 最后放入黑名单物品（价值为0），优先级最高
global.FoodIngredientValueDict = new Map(
    DefaultFoodIngredientList.map(item => [item, DefaultFoodIngredientValue])
        .concat(Object.entries(FoodIngredientValueDict))
        .concat(ValueBlackList.map(item => [item, 0]))
);

// 默认配方价值倍率，如果希望是其他值，加入Dict。如果值过大可能会上溢导致kjs加载失败。
global.DefaultRecipeValueMultiplier = 4;
let RecipeValueMultiplierDict = {
    // "crafting": 10
}
global.RecipeValueMultiplierDict = new Map(Object.entries(RecipeValueMultiplierDict));