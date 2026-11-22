ServerEvents.tags("item", e => {
  e.add("c:hidden_from_recipe_viewers", "kaleidoscope_tavern:vinegar")
  // 瓶酒和果汁桶不是食物，需要材料白名单才能承载并传递 QF 品质。
  e.add("quality_food:material_whitelist", [
    "kaleidoscope_tavern:white_lady",
    "kaleidoscope_tavern:emerald",
    "kaleidoscope_tavern:brass_heart",
    "kaleidoscope_tavern:godfather",
    "kaleidoscope_tavern:grasshopper",
    "kaleidoscope_tavern:screwdriver",
    "kaleidoscope_tavern:allium_garden",
    "kaleidoscope_tavern:depth_charge",
    "kaleidoscope_tavern:nether_special",
    "kaleidoscope_tavern:bloody_mary",
    "kaleidoscope_tavern:sculk_special",
    "kaleidoscope_tavern:vinegar",
    "kaleidoscope_tavern:mojito",
    "kaleidoscope_tavern:mystery_cocktail",
    "kaleidoscope_tavern:signature_cocktail",
    "kaleidoscope_tavern:grape_bucket",
    "kaleidoscope_tavern:ice_grape_bucket",
    "kaleidoscope_tavern:gold_grape_bucket",
    "kaleidoscope_tavern:green_grape_bucket",
    "kaleidoscope_tavern:sweet_berries_bucket",
    "kaleidoscope_tavern:glow_berries_bucket",
    "kaleidoscope_tavern:brandy",
    "kaleidoscope_tavern:carignan",
    "kaleidoscope_tavern:champagne",
    "kaleidoscope_tavern:glowflower_brew",
    "kaleidoscope_tavern:honey_wine",
    "kaleidoscope_tavern:ice_wine",
    "kaleidoscope_tavern:luminous_bride",
    "kaleidoscope_tavern:madame_shexiang",
    "kaleidoscope_tavern:miners_star",
    "kaleidoscope_tavern:molotov",
    "kaleidoscope_tavern:mother_snow",
    "kaleidoscope_tavern:plum_wine",
    "kaleidoscope_tavern:polaris_sweet_white",
    "kaleidoscope_tavern:red_queen",
    "kaleidoscope_tavern:riesling_dry_white",
    "kaleidoscope_tavern:rum",
    "kaleidoscope_tavern:sakura_wine",
    "kaleidoscope_tavern:sauvignon_blanc_dry_white",
    "kaleidoscope_tavern:sherry",
    "kaleidoscope_tavern:sunset_glow",
    "kaleidoscope_tavern:sweet_berry_wine",
    "kaleidoscope_tavern:vodka",
    "kaleidoscope_tavern:whiskey",
    "kaleidoscope_tavern:wine",
  ])
  e.add("forge:fruits/grape", [
    'kaleidoscope_tavern:grape',
    'kaleidoscope_tavern:ice_grape',
    'kaleidoscope_tavern:gold_grape',
    'kaleidoscope_tavern:green_grape',
  ])
  e.remove("forge:fruits/grapes", [
    'kaleidoscope_tavern:grape',
  ])
})
ServerEvents.tags("fluid", e => {
  e.add("c:hidden_from_recipe_viewers", /^creategearsandtavern:(flowing_)?vinegar$/)
  // 原料果汁的桶、管道及放置回收共用 QFF 品质。
  const juiceFluids = [
    "kaleidoscope_tavern:grape_juice",
    "kaleidoscope_tavern:flowing_grape_juice",
    "kaleidoscope_tavern:ice_grape_juice",
    "kaleidoscope_tavern:flowing_ice_grape_juice",
    "kaleidoscope_tavern:gold_grape_juice",
    "kaleidoscope_tavern:flowing_gold_grape_juice",
    "kaleidoscope_tavern:green_grape_juice",
    "kaleidoscope_tavern:flowing_green_grape_juice",
    "kaleidoscope_tavern:sweet_berries_juice",
    "kaleidoscope_tavern:flowing_sweet_berries_juice",
    "kaleidoscope_tavern:glow_berries_juice",
    "kaleidoscope_tavern:flowing_glow_berries_juice",
  ]
  e.add("quality_food_fluids:quality_fluids", juiceFluids)
  e.add("quality_food_fluids:world_quality_fluids", juiceFluids)
  // CGT 为基酒、醋与鸡尾酒注册的虚拟酒液；未安装 CGT 时正则不会匹配条目。
  e.add("quality_food_fluids:quality_fluids", /^creategearsandtavern:(flowing_)?(vinegar|signature_cocktail|mystery_cocktail|white_lady|emerald|brass_heart|godfather|grasshopper|screwdriver|mojito|allium_garden|depth_charge|nether_special|bloody_mary|sculk_special|brandy|carignan|champagne|glowflower_brew|honey_wine|ice_wine|luminous_bride|madame_shexiang|miners_star|mother_snow|plum_wine|polaris_sweet_white|red_queen|riesling_dry_white|rum|sakura_wine|sauvignon_blanc_dry_white|sherry|sunset_glow|sweet_berry_wine|vodka|whiskey|wine)$/)
})

ServerEvents.tags("block", e => {
  // 杯中鸡尾酒使用 QF 原生位置品质，覆盖手动摆放、取回及破坏掉落。
  e.add("quality_food:quality_blocks", [
    "kaleidoscope_tavern:signature_cocktail",
    "kaleidoscope_tavern:mystery_cocktail",
    "kaleidoscope_tavern:white_lady",
    "kaleidoscope_tavern:emerald",
    "kaleidoscope_tavern:brass_heart",
    "kaleidoscope_tavern:godfather",
    "kaleidoscope_tavern:grasshopper",
    "kaleidoscope_tavern:screwdriver",
    "kaleidoscope_tavern:mojito",
    "kaleidoscope_tavern:allium_garden",
    "kaleidoscope_tavern:depth_charge",
    "kaleidoscope_tavern:nether_special",
    "kaleidoscope_tavern:bloody_mary",
    "kaleidoscope_tavern:sculk_special",
  ])
})
