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
      // 杂项
      'createdelight:mmd_diamond',
      'createdelight:phase_transition_iron',
      // 构件
      'createdelight:magnetic_mechanism',
      // 火箭核心
      'createdelight:first_stage_rocket_core',
      'createdelight:second_stage_rocket_core',
      'createdelight:third_stage_rocket_core',
      'createdelight:fourth_stage_rocket_core',
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
    // 气体桶
    'createdelight:radon_bucket',
    // 食物相关流体
    'createdelight:cake_batter_bucket',
    'createdelight:egg_yolk_bucket',
    'createdelight:nut_milk_bucket',
    'createdelight:whipped_cream_bucket',
    'createdelight:vinegar_bucket',
    // 奶昔及对应冰激凌
    'createdelight:vanilla_milkshake_bucket',
    'createdelight:chocolate_milkshake_bucket',
    'createdelight:strawberry_milkshake_bucket',
    'createdelight:banana_milkshake_bucket',
    'createdelight:mint_milkshake_bucket',
    'createdelight:adzuki_milkshake_bucket',
    // 特殊流体
    'createdelight:malice_solution_bucket',
  ])
})
StartupEvents.registry("creative_mode_tab", e => {
  e.create("createdelight:machine")
    .translationKey("itemGroup.createdelight.machine")
    .icon(() => Item.of("createdelight:electrolyzer"))
    .content(() => [
      'createdelight:electrolyzer',
      'createdelight:emergency_industrial_platform',
      'mbd2:mbd_gadgets',
    ])
})