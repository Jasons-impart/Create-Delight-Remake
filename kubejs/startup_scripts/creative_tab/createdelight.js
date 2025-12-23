// 物品栏分类
StartupEvents.modifyCreativeTab("createdelightcore:food", e => {
  //食物
  e.add([
    // 压缩包（bushi）
    'createdelight:cow_zip',
    'createdelight:sheep_zip',
    'createdelight:chicken_zip',
    'createdelight:pig_zip',
    'createdelight:goat_zip',
    'createdelight:white_rabbit_zip',
    'createdelight:black_rabbit_zip',
    'createdelight:brown_rabbit_zip',
    'createdelight:splotched_rabbit_zip',
    'createdelight:gold_rabbit_zip',
    // 原材料
    'createdelight:corn_flour',
    'createdelight:butter',
    // 面团及其直接产物
    'createdelight:dry_yeast',
    'createdelight:oil_dough',
    'createdelight:wafer_dough',
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
    'createdelight:lime_cookie_dough',
    'createdelight:chorus_cookie_dough',
    'createdelight:bat_cookie_dough',
    'createdelight:paw_cookie_dough',
    // 未烤制玛芬
    'createdelight:unbaked_red_velvet_cupcake',
    'createdelight:unbaked_mixed_berry_muffin',
    'createdelight:unbaked_chocolate_pumpkin_muffin',
    'createdelight:unbaked_blueberry_muffin',
    'createdelight:unbaked_cranberry_muffin',
    'createdelight:unbaked_monster_muffin',
    // 生食物
    'createdelight:raw_empanada',
    'createdelight:raw_calamari',
    'createdelight:raw_ghast_calamari',
    'createdelight:raw_cheese_pizza',
    'createdelight:raw_potato_pancake',
    // 食物
    'createdelight:wrapped_fries_ghasta',
    'createdelight:oat_bread',
    'createdelight:ketchup_corn_dog',
    'createdelight:mayo_corn_dog',
    'createdelight:salami',
    'createdelight:deep_sea_sushi_roll_slice',
    'createdelight:fugu_roll',
    "createdelight:radgill_sushi",
    'createdelight:empty_riceball',
    'createdelight:yorkshire_pudding_and_beef',
    'createdelight:boiling_water_cabbage',
    'createdelight:braised_intestines_in_brown_sauce',
    'createdelight:empty_popsicle',
    'createdelight:enchanted_golden_lantern_fruit',
    'createdelight:enchanted_golden_carrot',
    'createdelight:enchanted_golden_arbutus_berries',
  ])
})
StartupEvents.modifyCreativeTab("createdelightcore:misc", e => {
  e.add(
    [
      // 矿物
      'createdelight:enriched_sky_stone_block',
      // 金属锭
      'createdelight:sky_copper_ingot',
      // 金属板
      'createdelight:forged_steel_sheet',
      'createdelight:andesite_alloy_nugget',
      // 板材
      'createdelight:carbon_plate',
      'createdelight:aviation_fibers_sheet',
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
      // 铀
      "createdelight:uranium_dust",
      "createdelight:enriched_uraniumdust",
      "createdelight:depleted_uranium_dust",
      //石墨粉
      'createdelight:carbon_dust',
      // 杂项
      'createdelight:mmd_diamond',
      'createdelight:phase_transition_iron',
      'createdelight:fuel_hotcream',
      'createdelight:blood_collection_device',
      'createdelight:needle',
      'createdelight:dread_upgrade_smithing_template',
      "createdelight:guncotton",
      // 构件
      'createdelight:magnetic_mechanism',
      //火箭部件
      'createdelight:basic_panel',
      'createdelight:advanced_panel',
      'createdelight:explorer_panel',
      'createdelight:flare_panel',
      'createdelight:basic_cabin',
      'createdelight:advanced_cabin',
      'createdelight:explorer_cabin',
      'createdelight:flare_cabin',
      'createdelight:basic_crystal_panel',
      'createdelight:advanced_crystal_panel',
      'createdelight:holographic_interface_panel',
      'createdelight:quantum_field_panel',
      //外壳
      'createdelight:iron_casing',
      'createdelight:space_casing',
      'createdelight:sky_steel_casing',
      // 杂项
      'createdelight:incomplete_paper',
      'createdelight:waste_paper',
      // 基因种子
      'createdelight:unfinished_leather',
      'createdelight:inferior_genetic_seed',
      'createdelight:normal_genetic_seed',
      'createdelight:refined_genetic_seed',
      'createdelight:pure_genetic_seed',
      'createdelight:flawless_genetic_seed',
      // 盔甲
      'createdelight:air_helmet',
      'createdelight:air_chestplate',
      'createdelight:air_leggings',
      'createdelight:air_boots',

    ]
  )
})
StartupEvents.modifyCreativeTab("createdelightcore:fluid", e => {
  e.add([
    // 熔融液体
    'createdelight:fire_dragon_blood_bucket',
    'createdelight:ice_dragon_blood_bucket',
    'createdelight:lightning_dragon_blood_bucket',
    // 工业大生产液体
    'createdelight:fuel_mixtures_bucket',
    'createdelight:sky_solution_bucket',
    'createdelight:spent_liquor_bucket',
    'createdelight:unrefined_sugar_bucket',
    'createdelight:unfermented_paper_pulp_bucket',
    'createdelight:paper_pulp_bucket',
    'createdelight:light_crude_oil_bucket',
    'createdelight:ethylene_fluid_bucket',
    'createdelight:lubricating_oil_bucket',
    // 气体桶
    'createdelight:radon_bucket',
    // 食物相关流体
    'createdelight:cake_batter_bucket',
    'createdelight:egg_yolk_bucket',
    'createdelight:artificial_egg_yolk_bucket',
    'createdelight:soya_milk_bucket',
    'createdelight:nut_milk_bucket',
    'createdelight:vinegar_bucket',
    'createdelight:yeast_bucket',
    // 特殊流体
    'createdelight:malice_solution_bucket',
  ])
})
StartupEvents.registry("creative_mode_tab", e => {
  e.create("createdelight:machine")
    .translationKey("itemGroup.createdelight.machine")
    .icon(() => Item.of("createdelight:centrifuge_rotor"))
    .content(() => [
      'mbd2:mbd_gadgets',
      'createdelight:order_deliverer_item'
    ])
})