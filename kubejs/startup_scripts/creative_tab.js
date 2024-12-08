// 玉米乐事
StartupEvents.modifyCreativeTab("corn_delight:corn_delight", e => {
  e.remove([
    "corn_delight:cob_pipe",
    "corn_delight:corn",
    "corn_delight:corn_crate",
    "corn_delight:corn_dog",
    "corn_delight:corn_seeds",
    "corn_delight:cornbread_batter",
    "corn_delight:corncob",
    "corn_delight:creamed_corn",
    "corn_delight:grilled_corn",
    "corn_delight:nachos_bowl",
    "corn_delight:popcorn",
    "corn_delight:taco",
    "corn_delight:tortilla",
    "corn_delight:tortilla_chip",
  ])
})
// 机械动力
StartupEvents.modifyCreativeTab("create:base", e => {
  e.add([
    "create:chocolate_bucket",
    "create:honey_bucket"
  ])
})
// 机械动力：实用物品
StartupEvents.modifyCreativeTab("createutilities:base", e => {
  e.remove([
    'createutilities:void_chest',
    'createutilities:gearcube'
  ])
})
// 齿轮与麦穗
StartupEvents.modifyCreativeTab("ratatouille:base", e => {
  e.remove([
    'ratatouille:salt'
  ])
})
// 机械动力：甜食
StartupEvents.modifyCreativeTab("create_confectionery:create_confectionery_tab", e => {
  e.remove([
    'create_confectionery:crushed_cocoa',
    'create_confectionery:cocoa_powder',
    'create_confectionery:cocoa_butter',
    'create_confectionery:candy_cane_block'
  ])
})

// 柴油动力
StartupEvents.modifyCreativeTab("createdieselgenerators:cdg_creative_tab", e => {
  e.remove([
    'createdieselgenerators:kelp_handle',
    'createdieselgenerators:chemical_sprayer',
    'createdieselgenerators:chemical_sprayer_lighter'
  ])
})
// 机械动力：新世代
StartupEvents.modifyCreativeTab("create_new_age:create_new_age_tab", e => {
  e.remove([
    'create_new_age:copper_wire',
    'create_new_age:overcharged_diamond_wire',
    'create_new_age:overcharged_iron_wire',
    'create_new_age:overcharged_golden_wire',
    'create_new_age:blank_circuit',
    'create_new_age:electrical_connector'
  ])
})
// 创意传动
StartupEvents.modifyCreativeTab("create_connected:main", e => {
  e.add([
    'create_connected:fan_freezing_catalyst'
  ])
})
// create_sa
StartupEvents.modifyCreativeTab("create_sa:create_stuff_additions_tab", e => {
  e.remove([
    'create_sa:brass_drone_item',
    'create_sa:drone_controller',
    'create_sa:fan_component',
    'create_sa:vault_component',
    'create_sa:blazing_pickaxe',
    'create_sa:blazing_shovel',
    'create_sa:blazing_axe',
    'create_sa:blazing_cleaver',
    'create_sa:brass_cube',
    'create_sa:heap_of_experience',
    'create_sa:experience_pickaxe',
    'create_sa:experience_pickaxe',
    'create_sa:experience_axe',
    'create_sa:experience_sword',
    'create_sa:experience_shovel',
    'create_sa:zinc_handle'
  ])
})
// 油炸
StartupEvents.modifyCreativeTab("create_bic_bit:bicycles_bitterballen", e => {
  e.remove([
    'create_bic_bit:unripe_cheese',
    'create_bic_bit:waxed_unripe_cheese',
    'create_bic_bit:young_cheese',
    'create_bic_bit:waxed_young_cheese',
    'create_bic_bit:aged_cheese',
    'create_bic_bit:waxed_aged_cheese',
    'create_bic_bit:unripe_cheese_wedge',
    'create_bic_bit:young_cheese_wedge',
    'create_bic_bit:aged_cheese_wedge',
    'create_bic_bit:crystallised_oil',
    'create_bic_bit:frying_oil_bottle',
    'create_bic_bit:frying_oil_bucket'
  ])
})
StartupEvents.modifyCreativeTab("frycooks_delight:frycooks_delight_tab", e => {
  e.remove([
    "frycooks_delight:burnt_morsel",
    "frycooks_delight:canola_oil",
    "frycooks_delight:fried_fish_slice",
    "frycooks_delight:fried_onion_ring",
    "frycooks_delight:hot_grease_bucket",
    "frycooks_delight:lard",
    "frycooks_delight:lard_block",
  ])
})
// 货币系统
StartupEvents.modifyCreativeTab("lightmanscurrency:machines", e => {
  e.remove([
    'lightmanscurrency:coinmint',
  ])
})
StartupEvents.modifyCreativeTab("lightmanscurrency:coins", e => {
  e.remove([
    'lightmanscurrency:coin_copper',
    'lightmanscurrency:coin_iron',
    'lightmanscurrency:coin_gold',
    'lightmanscurrency:coin_emerald',
    'lightmanscurrency:coin_diamond',
    'lightmanscurrency:coin_netherite',
    "lightmanscurrency:coinpile_copper",
    "lightmanscurrency:coinpile_iron",
    "lightmanscurrency:coinpile_gold",
    "lightmanscurrency:coinpile_emerald",
    "lightmanscurrency:coinpile_diamond",
    "lightmanscurrency:coinpile_netherite",
    'lightmanscurrency:coinblock_copper',
    'lightmanscurrency:coinblock_iron',
    'lightmanscurrency:coinblock_gold',
    'lightmanscurrency:coinblock_emerald',
    'lightmanscurrency:coinblock_diamond',
    'lightmanscurrency:coinblock_netherite',
    'lightmanscurrency:coin_chocolate_copper',
    'lightmanscurrency:coinpile_chocolate_copper',
    'lightmanscurrency:coinblock_chocolate_copper',
    'lightmanscurrency:coin_chocolate_iron',
    'lightmanscurrency:coinpile_chocolate_iron',
    'lightmanscurrency:coinblock_chocolate_iron',
    'lightmanscurrency:coin_chocolate_gold',
    'lightmanscurrency:coinpile_chocolate_gold',
    'lightmanscurrency:coinblock_chocolate_gold',
    'lightmanscurrency:coin_chocolate_emerald',
    'lightmanscurrency:coinpile_chocolate_emerald',
    'lightmanscurrency:coinblock_chocolate_emerald',
    'lightmanscurrency:coin_chocolate_diamond',
    'lightmanscurrency:coinpile_chocolate_diamond',
    'lightmanscurrency:coinblock_chocolate_diamond',
    'lightmanscurrency:coin_chocolate_netherite',
    'lightmanscurrency:coinpile_chocolate_netherite',
    'lightmanscurrency:coinblock_chocolate_netherite',
  ])
  e.add([
    'lightmanscurrency:offer_upgrade_1',
    'lightmanscurrency:offer_upgrade_2',
    'lightmanscurrency:offer_upgrade_3',
    'lightmanscurrency:offer_upgrade_4',
    'lightmanscurrency:offer_upgrade_5',
    'lightmanscurrency:offer_upgrade_6',
  ])
})
StartupEvents.modifyCreativeTab("createdeco:props_tab", e => {
  e.remove([
    'createdeco:iron_coin',
    'createdeco:copper_coin',
    'createdeco:industrial_iron_coin',
    'createdeco:zinc_coin',
    'createdeco:gold_coin',
    'createdeco:netherite_coin',
    'createdeco:brass_coin',
    'createdeco:iron_coinstack',
    'createdeco:copper_coinstack',
    'createdeco:industrial_iron_coinstack',
    'createdeco:zinc_coinstack',
    'createdeco:gold_coinstack',
    'createdeco:netherite_coinstack',
    'createdeco:brass_coinstack',
    'createdeco:andesite_sheet',
    'createdeco:zinc_sheet',
    'createdeco:netherite_sheet',
    'createdeco:netherite_nugget',
    "createdeco:andesite_hull",
    'createdeco:brass_hull',
    'createdeco:iron_hull',
    'createdeco:copper_hull',
    'createdeco:industrial_iron_hull',
    'createdeco:zinc_hull'
  ])
})
// 机械动力：矿石开掘
StartupEvents.modifyCreativeTab("createoreexcavation:create_ore_excavation", e => {
  e.add([
    'createdelight:prospector',
    'createdelight:prospector_core',
    'createdelight:overworld_metal_ore_cluster',
    'createdelight:overworld_noble_metal_ore_cluster',
    'createdelight:nether_ore_cluster',
    'createdelight:moon_ore_cluster',
    'createdelight:mars_ore_cluster',
    'createdelight:mars_gemstone_cluster',
    'createdelight:mercury_ore_cluster',
    'createdelight:venus_ore_cluster',
    'createdelight:glacio_ore_cluster',
  ])
  e.remove([
    'createoreexcavation:vein_finder',
  ])
})
// 机素防护
StartupEvents.modifyCreativeTab("protection_pixel:pp", e => {
  e.add([
    Item.of('createdelight:fire_dragonsteel_armorplate', '{Damage:0,armor:2.5d,toughness:1.5d,weight:1.5d}'), 
    Item.of('createdelight:ice_dragonsteel_armorplate', '{Damage:0,armor:2.5d,toughness:1.5d,weight:1.5d}'), 
    Item.of('createdelight:lightning_dragonsteel_armorplate', '{Damage:0,armor:2.5d,toughness:1.5d,weight:1.5d}')
  ])
})
// tetra
StartupEvents.modifyCreativeTab("tetra:default", e => {
  e.add([
    custom_scroll([1, 1, 4, 5],1,"bow/stave/remembrance_stave",1,["tetra:bow/stave/remembrance_stave"],"c10000"),
  ])
})
// epp
StartupEvents.modifyCreativeTab("expatternprovider:tab_main", e => {
  e.add([
    Item.of("expatternprovider:infinity_cell",'{record:{"#c":"ae2:f",id:"minecraft:lava"}}'),
  ])
})
StartupEvents.modifyCreativeTab("kubejs:tab", e => {
  e.remove([
    'createdelight:fire_dragonsteel_armorplate',
    'createdelight:ice_dragonsteel_armorplate',
    'createdelight:lightning_dragonsteel_armorplate',
    'createdelight:incomplete_fire_dragonsteel_armorplate',
    'createdelight:incomplete_ice_dragonsteel_armorplate',
    'createdelight:incomplete_lightning_dragonsteel_armorplate',
    'createdelight:molten_andesite_bucket',
    'createdelight:molten_desh_bucket',
    'createdelight:molten_ostrum_bucket',
    'createdelight:molten_calorite_bucket',
    'createdelight:molten_scarlet_neodymium_bucket',
    'createdelight:molten_azure_neodymium_bucket',
    'createdelight:fire_dragon_blood_bucket',
    'createdelight:molten_fire_steel_bucket',
    'createdelight:ice_dragon_blood_bucket',
    'createdelight:molten_ice_steel_bucket',
    'createdelight:lightning_dragon_blood_bucket',
    'createdelight:molten_lightning_steel_bucket',
    'createdelight:fuel_mixtures_bucket',
    'createdelight:sky_solution_bucket',
    'createdelight:spent_liquor_bucket',
    'createdelight:unrefined_sugar_bucket',
    'createdelight:unfermented_paper_pulp_bucket',
    'createdelight:paper_pulp_bucket',
    'createdelight:radon_bucket',
    'createdelight:cake_batter_bucket',
    'createdelight:egg_yolk_bucket',
    'createdelight:nut_milk_bucket',
    'createdelight:whipped_cream_bucket',
    'createdelight:vinegar_bucket',
    'createdelight:slime_bucket',
    'createdelight:vanilla_ice_cream_bucket',
    'createdelight:vanilla_milkshake_bucket',
    'createdelight:chocolate_ice_cream_bucket',
    'createdelight:chocolate_milkshake_bucket',
    'createdelight:strawberry_ice_cream_bucket',
    'createdelight:strawberry_milkshake_bucket',
    'createdelight:banana_ice_cream_bucket',
    'createdelight:banana_milkshake_bucket',
    'createdelight:mint_ice_cream_bucket',
    'createdelight:mint_milkshake_bucket',
    'createdelight:adzuki_ice_cream_bucket',
    'createdelight:adzuki_milkshake_bucket',
    'createdelight:corn_flour',
    'createdelight:whipped_cream_bowl',
    'createdelight:butter',
    'createdelight:oil_dough',
    'createdelight:oil_dough_with_butter',
    'createdelight:puff_pastry',
    'createdelight:board_noodles',
    'createdelight:vermicelli',
    'createdelight:persimmon_cookie_dough',
    'createdelight:lemon_cookie_dough',
    'createdelight:oatmeal_cookie_dough',
    'createdelight:green_tea_cookie_dough',
    'createdelight:cranberry_cookie_dough',
    'createdelight:bayberry_cookie_dough',
    'createdelight:chocolate_cookie_dough',
    'createdelight:honey_cookie_dough',
    'createdelight:sweet_berry_cookie_dough',
    'createdelight:unfried_shrimp',
    'createdelight:raw_chicken_chip',
    'createdelight:raw_tonkatsu',
    'createdelight:raw_fish',
    'createdelight:unfried_potato',
    'createdelight:unfried_chicken_leg',
    'createdelight:raw_empanada',
    'createdelight:raw_calamari',
    'createdelight:raw_cheese_pizza',
    'createdelight:oat_bread',
    'createdelight:ketchup_corn_dog',
    'createdelight:mayo_corn_dog',
    'createdelight:salami',
    'createdelight:potato_stew_beef',
    'createdelight:sushi_unrolledroll',
    'createdelight:fugu_roll',
    'createdelight:empty_riceball',
    'createdelight:yorkshire_pudding_and_beef',
    'createdelight:boiling_water_cabbage',
    'createdelight:braised_intestines_in_brown_sauce',
    'createdelight:empty_popsicle',
    'createdelight:potato_stew_beef',
    'createdelight:sushi_unrolledroll',
    'createdelight:tin_block',
    'createdelight:bronze_block',
    'createdelight:tin_ingot',
    'createdelight:bronze_ingot',
    'createdelight:tin_nugget',
    'createdelight:andesite_alloy_nugget',
    'createdelight:bronze_nugget',
    "createdelight:raw_tin_block",
    'createdelight:raw_tin',
    'createdelight:crushed_raw_desh',
    'createdelight:crushed_raw_ostrum',
    'createdelight:crushed_raw_calorite',
    'createdelight:dirty_tin_dust',
    'createdelight:dirty_silver_dust',
    'createdelight:dirty_desh_dust',
    'createdelight:dirty_ostrum_dust',
    'createdelight:dirty_calorite_dust',
    'createdelight:tin_dust',
    'createdelight:silver_dust',
    'createdelight:desh_dust',
    'createdelight:ostrum_dust',
    'createdelight:calorite_dust',
    'createdelight:incomplete_layered_magnet',
    'createdelight:incomplete_tesla_coil',
    'createdelight:incomplete_alternator',
    'createdelight:incomplete_diesel_engine',
    'createdelight:incomplete_electric_motor',
    'createdelight:incomplete_huge_diesel_engine',
    'createdelight:incomplete_large_diesel_engine',
    'createdelight:incompleted_modular_accumulator',
    'createdelight:incomplete_electron_tube',
    'createdelight:incomplete_fs_upgrade',
    'createdelight:incomplete_graviton_tube',
    'createdelight:incomplete_first_stage_rocket_core',
    'createdelight:incomplete_second_stage_rocket_core',
    'createdelight:incomplete_third_stage_rocket_core',
    'createdelight:incomplete_fourth_stage_rocket_core',
    'createdelight:incomplete_cell_component_1k',
    'createdelight:incomplete_cell_component_4k',
    'createdelight:incomplete_cell_component_16k',
    'createdelight:incomplete_cell_component_64k',
    'createdelight:incomplete_cell_component_256k',
    'createdelight:incomplete_basic_card',
    'createdelight:incomplete_advanced_card',
    'createdelight:incomplete_formation_core',
    'createdelight:incomplete_annihilation_core',
    'createdelight:incomplete_me_p2p_tunnel',
    'createdelight:incomplete_charged_staff',
    'createdelight:incomplete_entropy_manipulator',
    'createdelight:incomplete_blank_pattern',
    'createdelight:incomplete_wireless_terminal',
    'createdelight:incomplete_wireless_crafting_terminal',
    'createdelight:incomplete_quantum_bridge_card',
    'createdelight:incomplete_wireless_pattern_access_terminal',
    'createdelight:incomplete_wireless_pattern_encoding_terminal',
    'createdelight:incomplete_cell_component_1m',
    'createdelight:incomplete_cell_component_4m',
    'createdelight:incomplete_cell_component_16m',
    'createdelight:incomplete_cell_component_64m',
    'createdelight:incomplete_cell_component_256m',
    'createdelight:incomplete_wireless_ex_pat',
    'createdelight:incomplete_pattern_modifier',
    'createdelight:incomplete_infinity_cell',
    'createdelight:incomplete_mega_energy_cell',
    'createdelight:incomplete_mega_crafting_unit',
    'createdelight:incomplete_decompression_module',
    'createdelight:incomplete_drive',
    'createdelight:incomplete_interface',
    'createdelight:incomplete_energy_cell',
    'createdelight:incomplete_dense_energy_cell',
    'createdelight:incomplete_crafting_unit',
    'createdelight:incomplete_pattern_provider',
    'createdelight:incomplete_molecular_assembler',
    'createdelight:incomplete_controller',
    'createdelight:incomplete_crystal_fixer',
    'createdelight:prospector',
    'createdelight:prospector_core',
    'createdelight:overworld_metal_ore_cluster',
    'createdelight:overworld_noble_metal_ore_cluster',
    'createdelight:nether_ore_cluster',
    'createdelight:moon_ore_cluster',
    'createdelight:mars_ore_cluster',
    'createdelight:mars_gemstone_cluster',
    'createdelight:mercury_ore_cluster',
    'createdelight:venus_ore_cluster',
    'createdelight:glacio_ore_cluster',
  ])
});
// 物品栏分类
StartupEvents.registry("creative_mode_tab", e => {
  //食物
  e.create("createdelight:food")
    .translationKey("itemGroup.createdelight.food")
    .icon(() => Item.of("createdelight:unfried_shrimp"))
    .content(() => [
      // 原材料
      'createdelight:corn_flour',
      'createdelight:whipped_cream_bowl',
      'createdelight:butter',
      // 面团及其直接产物
      'createdelight:oil_dough',
      'createdelight:puff_pastry',
      'createdelight:board_noodles',
      'createdelight:vermicelli',
      // 曲奇面团
      'createdelight:persimmon_cookie_dough',
      'createdelight:lemon_cookie_dough',
      'createdelight:oatmeal_cookie_dough',
      'createdelight:green_tea_cookie_dough',
      'createdelight:cranberry_cookie_dough',
      'createdelight:bayberry_cookie_dough',
      'createdelight:chocolate_cookie_dough',
      'createdelight:honey_cookie_dough',
      'createdelight:sweet_berry_cookie_dough',
      // 生食物
      'createdelight:unfried_shrimp',
      'createdelight:raw_chicken_chip',
      'createdelight:raw_tonkatsu',
      'createdelight:raw_fish',
      'createdelight:unfried_potato',
      'createdelight:unfried_chicken_leg',
      'createdelight:raw_empanada',
      'createdelight:raw_calamari',
      'createdelight:raw_cheese_pizza',
      // 食物
      'createdelight:oat_bread',
      'createdelight:ketchup_corn_dog',
      'createdelight:mayo_corn_dog',
      'createdelight:salami',
      'createdelight:fugu_roll',
      'createdelight:empty_riceball',
      'createdelight:yorkshire_pudding_and_beef',
      'createdelight:boiling_water_cabbage',
      'createdelight:braised_intestines_in_brown_sauce',
      'createdelight:empty_popsicle',
    ])
  // 流体
  e.create("createdelight:fluid")
    .translationKey("itemGroup.createdelight.fluid")
    .icon(() => Item.of("createdelight:fuel_mixtures_bucket"))
    .content(() => [
      // 熔融液体
      'createdelight:molten_andesite_bucket',
      'createdelight:molten_desh_bucket',
      'createdelight:molten_ostrum_bucket',
      'createdelight:molten_calorite_bucket',
      'createdelight:molten_scarlet_neodymium_bucket',
      'createdelight:molten_azure_neodymium_bucket',
      'createdelight:fire_dragon_blood_bucket',
      'createdelight:molten_fire_steel_bucket',
      'createdelight:ice_dragon_blood_bucket',
      'createdelight:molten_ice_steel_bucket',
      'createdelight:lightning_dragon_blood_bucket',
      'createdelight:molten_lightning_steel_bucket',
      // 工业大生产液体
      'createdelight:fuel_mixtures_bucket',
      'createdelight:sky_solution_bucket',
      'createdelight:spent_liquor_bucket',
      'createdelight:unrefined_sugar_bucket',
      'createdelight:unfermented_paper_pulp_bucket',
      'createdelight:paper_pulp_bucket',
      // 气体桶
      'createdelight:radon_bucket',
      // 食物相关流体
      'createdelight:cake_batter_bucket',
      'createdelight:egg_yolk_bucket',
      'createdelight:nut_milk_bucket',
      'createdelight:whipped_cream_bucket',
      'createdelight:vinegar_bucket',
      'createdelight:slime_bucket',
      // 奶昔及对应冰激凌
      'createdelight:vanilla_ice_cream_bucket',
      'createdelight:vanilla_milkshake_bucket',
      'createdelight:chocolate_ice_cream_bucket',
      'createdelight:chocolate_milkshake_bucket',
      'createdelight:strawberry_ice_cream_bucket',
      'createdelight:strawberry_milkshake_bucket',
      'createdelight:banana_ice_cream_bucket',
      'createdelight:banana_milkshake_bucket',
      'createdelight:mint_ice_cream_bucket',
      'createdelight:mint_milkshake_bucket',
      'createdelight:adzuki_ice_cream_bucket',
      'createdelight:adzuki_milkshake_bucket',
    ])
  e.create("createdelight:metal")
    .translationKey("itemGroup.createdelight.metal")
    .icon(() => Item.of("createdelight:raw_tin"))
    .content(() => [
      // 金属块
      'createdelight:tin_block',
      'createdelight:bronze_block',
      // 粗金属块
      "createdelight:raw_tin_block",
      // 金属锭
      'createdelight:tin_ingot',
      'createdelight:bronze_ingot',
      // 金属粒
      'createdelight:tin_nugget',
      'createdelight:andesite_alloy_nugget',
      'createdelight:bronze_nugget',
      // 粗金属
      'createdelight:raw_tin',
      // 粉碎粗金属
      'createdelight:crushed_raw_desh',
      'createdelight:crushed_raw_ostrum',
      'createdelight:crushed_raw_calorite',
      // 污浊粉末
      'createdelight:dirty_tin_dust',
      'createdelight:dirty_silver_dust',
      'createdelight:dirty_desh_dust',
      'createdelight:dirty_ostrum_dust',
      'createdelight:dirty_calorite_dust',
      // 洁净粉末
      'createdelight:tin_dust',
      'createdelight:silver_dust',
      'createdelight:desh_dust',
      'createdelight:ostrum_dust',
      'createdelight:calorite_dust',
    ])
    
  e.create("createdelight:machine")
  .translationKey("itemGroup.createdelight.machine")
  .icon(() => Item.of("createdelight:electrolyzer"))
  e.create("createdelight:misc")
  .translationKey("itemGroup.createdelight.misc")
  .icon(() => Item.of("createdelight:fragment_of_border"))
})
