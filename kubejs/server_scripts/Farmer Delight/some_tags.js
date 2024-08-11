ServerEvents.tags("item", e => {
    // 西蓝花兼容沙拉
    e.add("forge:salad_ingredients", [
        "candlelight:broccoli"
    ])
    e.add("forge:salad_ingredients/cabbage", [
        "candlelight:broccoli"
    ])
    // 肉类标签
    e.add("forge:meat/raw", [
        'farmersdelight:chicken_cuts',
        'farmersdelight:mutton_chops',
        'farmersdelight:bacon',
        'mynethersdelight:hoglin_loin',
        'minecraft:beef',
        'minecraft:mutton',
        'minecraft:chicken',
        'minecraft:rabbit',
        'alexsdelight:bison_mince',
        'alexsdelight:bison_mince',
        'alexsdelight:bison_mince',
        'farmersdelight:minced_beef',
        'silentsdelight:warden_heart',
        'silentsdelight:minced_warden_heart',
        'silentsdelight:minced_warden_heart',
        'casualness_delight:raw_donkey_meat'        
    ])
    e.add('mynethersdelight:curry_meats', [
        'ratatouille:raw_sausage'
    ])
    e.add("forge:cheese", [
        'ad_astra:cheese',
        'casualness_delight:cheese_wheel_slice'
    ])
    e.removeAllTagsFrom([
        'mynethersdelight:hoglin_sausage',
        'butchercraft:sausage',
        'butchercraft:cooked_sausage',
        'festival_delicacies:rice'
    ])
})
