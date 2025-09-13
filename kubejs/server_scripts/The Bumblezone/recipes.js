ServerEvents.recipes(e => {
  e.remove({ id: "the_bumblezone:bee_bread/from_bucket" })
  e.remove({ id: "the_bumblezone:bee_soup" })
  e.remove({ id: "the_bumblezone:sugar_water_bucket" })
  // 蜂王浆
  e.recipes.create.compacting(
    "the_bumblezone:royal_jelly_block",
    Fluid.of("the_bumblezone:royal_jelly_fluid_still", 1000)
  ).id("create:compacting/royal_jelly")
  e.recipes.create.compacting(
    "minecraft:honey_block",
    Fluid.of("create:honey", 1000)
  ).id("create:compacting/honey")
  e.recipes.create.mixing(
    Fluid.of("the_bumblezone:royal_jelly_fluid_still", 1000),
    "the_bumblezone:royal_jelly_block",
  ).heated().id("create:mixing/royal_jelly")
  e.recipes.kubejs.shapeless(
    "the_bumblezone:royal_jelly_block",
    "the_bumblezone:royal_jelly_bucket"
  ).replaceIngredient("the_bumblezone:royal_jelly_bucket", "minecraft:bucket").id("the_bumblezone:royal_jelly_bucket/to_royal_jelly_block")
  e.recipes.kubejs.shapeless(
    "the_bumblezone:royal_jelly_bucket",
    [
      "minecraft:bucket",
      "the_bumblezone:royal_jelly_block"
    ]
  ).id("the_bumblezone:royal_jelly_bucket/from_royal_jelly_block")
  e.recipes.create.filling(
    'the_bumblezone:royal_jelly_bottle',
    [
      "minecraft:glass_bottle",
      Fluid.of("the_bumblezone:royal_jelly_fluid_still", 250)
    ]
  ).id("create:filling/royal_jelly_bottle")
  // 蜂蜜
  e.recipes.create.emptying(
    [
      Fluid.of("create:honey", 1000),
      "minecraft:bucket"
    ],
    "create:honey_bucket"
  ).id("create:emptying/honey_bucket")
  e.recipes.create.filling(
    'minecraft:honey_bottle',
    [
      "minecraft:glass_bottle",
      Fluid.of("create:honey", 250)
    ]
  ).id("create:filling/honey_bottle")
  e.recipes.kubejs.shapeless(
    "create:honey_bucket",
    [
      "minecraft:bucket",
      "4x minecraft:honey_bottle"
    ]
  ).replaceIngredient("minecraft:honey_bottle", "minecraft:glass_bottle").id("the_bumblezone:honey_bucket/from_honey_bottle")
  //蜂蜜饲料
  e.recipes.create.filling(
    "the_bumblezone:bee_bread",
    ["the_bumblezone:pollen_puff", Fluid.of("create:honey", 250)
    ]).id("filling/bee_bread")
  //蜜蜂汤
  e.recipes.farmersdelight.cooking(
    [
      "the_bumblezone:bee_bread",
      "minecraft:beetroot",
      "minecraft:potatoes",
      "minecraft:honeycomb",
      "minecraft:honeycomb",
      "the_bumblezone:bee_stinger"
    ],
    "the_bumblezone:bee_soup",
    1.0, 200, "minecraft:bowl"
  ).id("createdelight:cook/bee_soup")
  // 机械动力兼容
  e.recipes.create.mixing(
    Fluid.of("create:honey", 50),
    [
      Fluid.of("minecraft:water", 50),
      'the_bumblezone:honey_crystal_shards'
    ], 200
  ).heated().id("create:mixing/honey_crystal_shards")
  e.recipes.create.compacting(
    [
      'minecraft:honeycomb',
      Fluid.of("create:honey", 250)
    ],
    'the_bumblezone:filled_porous_honeycomb_block'
  ).id("create:compacting/filled_porous_honeycomb_block")
  e.recipes.create.compacting(
    'minecraft:honeycomb',
    'the_bumblezone:porous_honeycomb_block'
  ).id("create:compacting/porous_honeycomb_block")
  e.recipes.create.cutting(
    '9x minecraft:honeycomb',
    '#the_bumblezone:carvable_wax'
  ).id("create:cutting/carvable_wax")
  e.recipes.create.compacting(
    'minecraft:honeycomb',
    'the_bumblezone:empty_honeycomb_brood_block'
  ).id("create:compacting/empty_honeycomb_brood_block")
  // 蜂蜜增产
  e.recipes.create.mixing(
    Fluid.of("create:honey", 100),
    [
      Fluid.of("the_bumblezone:sugar_water_still", 100),
      Fluid.of("the_bumblezone:royal_jelly_fluid_still", 5)
    ]
  )

  // 产蜂蜜结晶
  e.recipes.vintageimprovements.vacuumizing(
    "5x the_bumblezone:glistering_honey_crystal"
  , [
    Fluid.of("create_enchantment_industry:experience", 30),
    "the_bumblezone:glistering_honey_crystal"
  ]).id("vintageimprovements:vacuumizing/glistering_honey_crystal")

  e.recipes.vintageimprovements.pressurizing([
    Fluid.of("createcafe:melted_sugar", 25), Fluid.water(500)],
    Fluid.of("the_bumblezone:sugar_water_still", 500))
    .secondaryFluidOutput(1)
    .processingTime(100)
    .heated()
    .id("vintageimprovements:pressurizing/sugar_water_still")
  e.recipes.create.filling(
    "the_bumblezone:sugar_water_bottle",
    ["minecraft:glass_bottle", Fluid.of("the_bumblezone:sugar_water_still", 250)])
    .id("create:filling/sugar_water_bottle")

  e.recipes.create.emptying(
    ["minecraft:glass_bottle", Fluid.of("the_bumblezone:sugar_water_still", 250)],
    "the_bumblezone:sugar_water_bottle")
    .id("create:emptying/sugar_water_bottle")

})
