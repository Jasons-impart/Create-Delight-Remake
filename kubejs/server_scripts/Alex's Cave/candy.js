ServerEvents.recipes(e => {
  remove_recipes_id(e, [
   "create:sandpaper_polishing/rose_quartz",
   "alexscaves:hot_chocolate_bottle",
   "create_oppenheimered:sequenced_assembly/peppermint_mocha",
   "create_oppenheimered:mixing/ice_cream_licoroot",
   "create_oppenheimered:mixing/ice_cream_chocolate",
   "create_oppenheimered:mixing/ice_cream_sweetberry",
  ])
  //焦糖苹果
  e.recipes.kubejs.shapeless(
    "alexscaves:caramel_apple",
    [
      'create_confectionery:bar_of_caramel',
      "minecraft:apple"
    ]
  ).id("alexscaves:caramel_apple")
  e.recipes.create.filling(
    "alexscaves:caramel_apple",
    [
      "minecraft:apple",
      Fluid.of("create_confectionery:caramel", 250)
    ]
  ).id("alexscaves:filling/caramel_apple")
  //苏打水
  e.recipes.create.mixing(
    Fluid.of("alexscaves:purple_soda", 500),
    [
      Fluid.water(500),
      'alexscaves:sprinkles',
      'alexscaves:peppermint_powder'
    ]
  ).id("create_oppenheimered:mixing/purple_honey_soda")
  e.recipes.create.filling(
    'alexscaves:purple_soda_bottle',
    [
      "minecraft:glass_bottle",
      Fluid.of("alexscaves:purple_soda", 250)
    ]
  ).id("alexscaves:filling/purple_soda_bottle")
  e.recipes.create.emptying(
    [
      "minecraft:glass_bottle",
      Fluid.of("alexscaves:purple_soda", 250)
    ],
    'alexscaves:purple_soda_bottle'
  ).id("alexscaves:emptying/purple_soda_bottle")
  //苏打水火箭
  e.recipes.create.deploying(
    'alexscaves:purple_soda_bottle_rocket',
    [
      'alexscaves:purple_soda_bottle',
      '#createdelight:mint_candy'
    ]
  ).id("alexscaves:purple_soda_bottle_rocket")
  //薄荷糖
  e.recipes.create.mixing(
    'neapolitan:mint_candies',
    [
      'alexscaves:peppermint_powder',
      "#minecraft:ice",
      Fluid.of("create:honey", 50)
    ]
  ).id("neapolitan:mint/mint_candies")
  e.recipes.kubejs.shapeless(
    'neapolitan:mint_candies',
    [
      'alexscaves:peppermint_powder',
      'minecraft:honey_bottle',
      "#minecraft:ice"
    ]
  ).id("neapolitan:mint/mint_candies_2")
  .replaceIngredient('minecraft:honey_bottle', "minecraft:glass_bottle")
  e.recipes.kubejs.shaped(
    'alexscaves:frostmint',
    [
      "AAA"
    ], {
      A: "neapolitan:mint_candies"
    }
  ).id("alexscaves:frostmint")
  //泡芙
  e.recipes.create.filling(
    'alexscaves:sweet_puff',
    [
      Fluid.of("cosmopolitan:cream", 250),
      'create_deepfried:berliner'
    ]
  ).id("create_oppenheimered:mixing/sweet_puff_spinning")
  //巧克力块系列
  e.recipes.create.compacting(
   'alexscaves:block_of_chocolate',
   Fluid.of("create_confectionery:black_chocolate", 100) 
  ).heatRequirement("cooled").id("alexscaves:compacting/block_of_chocolate")
  e.recipes.create.deploying(
    'alexscaves:block_of_frosted_chocolate',
    [
      'alexscaves:block_of_chocolate',
      'alexscaves:block_of_frosting'
    ]
  ).id("alexscaves:block_of_frosted_chocolate").keepIngredient("alexscaves:block_of_frosting")
  e.recipes.create.mixing(
    Fluid.of("create_confectionery:black_chocolate", 100),
    'alexscaves:block_of_chocolate'
  ).heated().id("alexscaves:mixing/block_of_chocolate")
  //糖霜块
  e.recipes.kubejs.shapeless( 
    'alexscaves:block_of_frosting',
    '4x minecraft:sugar'
  ).id("alexscaves:block_of_frosting")
  e.recipes.kubejs.shapeless(
    '4x minecraft:sugar',
    'alexscaves:block_of_frosting'
  ).id("alexscaves:sugar")
  e.recipes.kubejs.shapeless(
    "alexscaves:block_of_vanilla_frosting",
    [
      'alexscaves:block_of_frosting',
      'neapolitan:dried_vanilla_pods'
    ]
  ).id("alexscaves:block_of_vanilla_frosting")
  e.recipes.kubejs.shapeless(
    "alexscaves:block_of_chocolate_frosting",
    [
      'alexscaves:block_of_frosting',
      '#forge:bars/chocolate'
    ]
  ).id("alexscaves:block_of_chocolate_frosting")
  //蛋糕胚
  e.recipes.create.compacting(
    "ratatouille:cake_base",
    "3x alexscaves:cake_layer"
  ).heated().id("alexscaves:compacting/cake_base")
  e.recipes.create.cutting(
    "3x alexscaves:cake_layer",
    "ratatouille:cake_base"
  ).id("alexscaves:cutting/cake_layer")
  //蛋糕合成
  e.recipes.kubejs.shaped(
    'minecraft:cake',
    [
      "AAA",
      "BBB"
    ], {
      A: 'alexscaves:block_of_frosting',
      B: "alexscaves:cake_layer"
    }
  ).id("alexscaves:cake_from_cake_layer")
  e.recipes.kubejs.shaped(
    'neapolitan:vanilla_cake',
    [
      "AAA",
      "BBB"
    ], {
      A: 'alexscaves:block_of_vanilla_frosting',
      B: "alexscaves:cake_layer"
    }
  ).id("alexscaves:vanilla_cake_from_cake_layer")
  e.recipes.kubejs.shaped(
    'neapolitan:chocolate_cake',
    [
      "AAA",
      "BBB"
    ], {
      A: 'alexscaves:block_of_chocolate_frosting',
      B: "alexscaves:cake_layer"
    }
  ).id("alexscaves:chocolate_cake_from_cake_layer")
  //曲奇
  e.recipes.create.cutting(
    '2x minecraft:cookie',
    'alexscaves:cookie_block'
  ).id("alexscaves:cutting/cookie_block")
  //统一拐杖糖
  e.recipes.create.mixing("alexscaves:candy_cane", [
      Fluid.water(250),
      "4x minecraft:sugar",
      "neapolitan:mint_leaves"
  ])
  //拐杖糖打磨成尖拐杖糖
  e.recipes.createmetallurgy.grinding(
    "alexscaves:sharpened_candy_cane", 
    "#createdelight:candy_cane"
  ).id("alexscaves:grinding/sharpened_candy_cane")

  //拐杖糖粉碎成薄荷糖粉
  e.recipes.create.crushing([Item.of("3x alexscaves:peppermint_powder"), Item.of("2x alexscaves:peppermint_powder").withChance(0.5)], [["alexscaves:sharpened_candy_cane", "#createdelight:candy_cane"]])
  //姜饼块to姜饼块
  e.recipes.minecraft.stonecutting("6x alexscaves:gingerbread_block", "create_confectionery:gingerbread_block")
      .id("gingerbread_block_from_gingerbread_block")

  //姜饼面团to生面团块
  e.recipes.create.compacting(
    'alexscaves:dough_block',
    'farmersdelight:wheat_dough'
  ).id("alexscaves:compacting/dough_block")

  //甘草糖粉碎出甘草蔓
  e.recipes.create.crushing([Item.of("alexscaves:licoroot_vine"), Item.of("alexscaves:licoroot_vine").withChance(0.25)], "alexscaves:licoroot")
      .id("alexscaves:crushing/licoroot_vine")
  e.recipes.create.item_application("alexscaves:licoroot_sprout", ["alexscaves:licoroot_vine", "minecraft:sugar"])
      .id("alexscaves:item_application/licoroot_sprout")
  //姜饼块粉碎出姜饼屑
  e.recipes.create.milling("alexscaves:gingerbread_crumbs", "alexscaves:gingerbread_block")
      .id("alexscaves:milling/gingerbread_crumbs")
})