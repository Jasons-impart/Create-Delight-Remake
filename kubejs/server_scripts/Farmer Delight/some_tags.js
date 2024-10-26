ServerEvents.tags("item", e => {
    // 油菜籽移除种子标签
    e.remove("forge:seeds/canola", [
        'frycooks_delight:canola_seeds'
    ])
    // 白菜兼容
    e.add("forge:salad_ingredients/cabbage", [
        "festival_delicacies:chinese_cabbage",
        "festival_delicacies:chinese_cabbage_leaf"
    ])
    e.add("forge:vegetables/cabbage", [
        "festival_delicacies:chinese_cabbage",
        "festival_delicacies:chinese_cabbage_leaf"
    ])
    e.add("forge:crops/cabbage", [
        "festival_delicacies:chinese_cabbage",
        "festival_delicacies:chinese_cabbage_leaf"
    ])
    e.add("createdelight:cabbage_leaves", [
        'festival_delicacies:chinese_cabbage_leaf',
        'farmersdelight:cabbage_leaf'
    ])
    // 茄子兼容
    e.add("culturaldelights:all_eggplants", [
        "festival_delicacies:eggplant"
    ])
    e.add("culturaldelights:regular_eggplants", [
        "festival_delicacies:eggplant"
    ])
    e.add("forge:vegetables/eggplant", [
        "culturaldelights:eggplant",
        "culturaldelights:cut_eggplant"
    ])
    e.add("forge:crops/eggplant", [
        "culturaldelights:eggplant",
        "culturaldelights:cut_eggplant"
    ])
    // 肉类标签
    e.add("forge:meat/raw", [
        "farmersdelight:chicken_cuts",
        "farmersdelight:mutton_chops",
        "farmersdelight:bacon",
        "mynethersdelight:hoglin_loin",
        "minecraft:beef",
        "minecraft:mutton",
        "minecraft:chicken",
        "minecraft:rabbit",
        "alexsdelight:bison_mince",
        "alexsmobs:kangaroo_meat",
        "alexsdelight:kangaroo_shank",
        "alexsdelight:loose_moose_rib",
        "alexsdelight:raw_bunfungus_drumstick",
        "alexsdelight:raw_bison",
        "alexsdelight:raw_bunfungus",
        "farmersdelight:minced_beef",
        "silentsdelight:warden_heart",
        "silentsdelight:minced_warden_heart",
        "silentsdelight:minced_warden_heart",
        "casualness_delight:raw_donkey_meat"        
    ])
    e.add("mynethersdelight:curry_meats", [
        "ratatouille:raw_sausage",
        'hotdog_delight:cod_sausage',
        'hotdog_delight:salmon_sausage',
        'hotdog_delight:pork_sausage',
        'hotdog_delight:squid_ink_sausage',
        'hotdog_delight:glow_squid_ink_sausage',
        'hotdog_delight:pumpkin_sausage'
    ])
    // 奶酪
    e.add("forge:cheese", [
        "ad_astra:cheese",
        "casualness_delight:cheese_wheel_slice"
    ])
    // 黄瓜
    e.add("culturaldelights:cucumbers", [
        "vintagedelight:cucumber"
    ])
    e.add("forge:crops", [
        "vintagedelight:cucumber"
    ])
    e.add("forge:vegetables/cucumber", [
        "culturaldelights:cut_cucumber"
    ])
    e.add("forge:cucumber", [
        "culturaldelights:cut_cucumber"
    ])
    e.add("forge:pickle", [
        "culturaldelights:pickle",
        "culturaldelights:cut_pickle"
    ])
    e.add("forge:seeds/corn", [
        "culturaldelights:corn_kernels"
    ])
    // 香肠
    e.add("forge:sausage/cooked", [
        "ratatouille:sausage",
        "createdelight:salami",
        'hotdog_delight:cooked_pork_sausage',
        'hotdog_delight:cooked_salmon_sausage',
        'hotdog_delight:cooked_cod_sausage',
        'hotdog_delight:squid_ink_sausage',
        'hotdog_delight:glow_squid_ink_sausage',
        'hotdog_delight:pumpkin_sausage'
    ])
    e.add("forge:sausage/raw", [
        "ratatouille:raw_sausage",
        'hotdog_delight:cod_sausage',
        'hotdog_delight:salmon_sausage',
        'hotdog_delight:pork_sausage',
        'hotdog_delight:squid_ink_sausage',
        'hotdog_delight:glow_squid_ink_sausage',
        'hotdog_delight:pumpkin_sausage'
    ])
    e.remove("forge:vegetables/ghost_pepper", [
        "vintagedelight:ghost_pepper"
    ])
    e.add("mynethersdelight:hot_spice", [
        "vintagedelight:ghost_pepper"
    ])
    e.removeAllTagsFrom([
        "mynethersdelight:hoglin_sausage",
        "butchercraft:sausage",
        "butchercraft:cooked_sausage",
        "festival_delicacies:rice",
        "culturaldelights:cucumber",
        "culturaldelights:cucumber_seeds",
        "corn_delight:corn_seeds",
        "corn_delight:corn",
        "corn_delight:tortilla",
        "refurbished_furniture:knife",
    ])
})
