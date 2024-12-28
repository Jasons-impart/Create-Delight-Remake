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
  StartupEvents.modifyCreativeTab("create_deepfried:deepfried", e => {
    e.remove([
      "create_deepfried:apple_slices",
      "create_deepfried:chicken_nuggets",
      "create_deepfried:fish_and_chips",
      "create_deepfried:raw_chicken_nuggets",
      "create_deepfried:raw_springroll",
      "create_deepfried:springroll",
      "create_deepfried:yuca",
    ])
  })
  //节日乐事
  StartupEvents.modifyCreativeTab("festival_delicacies:festival_delicacies", e => {
    e.remove([
      'festival_delicacies:rice',
      'festival_delicacies:red_bean'
    ])
    e.add([
        'createdelight:adzuki_beans_seed'
      ]
    )
  })
  