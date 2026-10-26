ServerEvents.recipes(e => {
  const {create} = e.recipes
  remove_recipes_id(e, [
    "createdelightcore:cutting/vegetable_pizza",
    "createdelightcore:deploying/vegetable_pizza",
    "createdelightcore:cutting/meatlovers_pizza",
    "createdelightcore:deploying/meatlovers_pizza",
    "createdelightcore:cutting/nether_pizza",
    "createdelightcore:deploying/nether_pizza",
    "createdelightcore:cutting/pizza",
    "createdelightcore:deploying/pizza",
  ])
  // 序列装配第一步须唯一：四种披萨曾都以番茄酱起步，Create 会锁进其中一条导致只能做出蔬菜披萨。
  // 芝士披萨仍以番茄酱开头；其余先上各自特色配料，番茄酱后置。
  combination(e, [
    "bakeries:pizza_flatbread",
    "#createdelight:order/vegetable",
    'create_bic_bit:ketchup_bottle',
    "minecraft:beetroot",
    "trailandtales_delight:cheese_slice"
  ], "createdelightcore:raw_vegetable_pizza", 1)
  combination(e, [
    "bakeries:pizza_flatbread",
    "#forge:meat/processed/raw",
    'create_bic_bit:ketchup_bottle',
    "#createdelight:order/vegetable",
    "trailandtales_delight:cheese_slice"
  ], "createdelightcore:raw_meatlovers_pizza", 1)
  combination(e, [
    "bakeries:pizza_flatbread",
    "mynethersdelight:hoglin_loin",
    'create_bic_bit:ketchup_bottle',
    ["netherexp:warped_wart", "minecraft:nether_wart"],
    "trailandtales_delight:cheese_slice"
  ], "createdelightcore:raw_nether_pizza", 1)
  combination(e, [
    "bakeries:pizza_flatbread",
    'create_bic_bit:ketchup_bottle',
    "trailandtales_delight:cheese_slice"
  ], "bakeries:raw_pizza", 1)
  cutting(e, "createdelightcore:meatlovers_pizza", "4x createdelightcore:meatlovers_pizza_slice")
  cutting(e, "createdelightcore:vegetable_pizza", "4x createdelightcore:vegetable_pizza_slice")
  cutting(e, "bakeries:pizza", "4x createdelightcore:pizza_slice")
  cutting(e, "createdelightcore:nether_pizza", "4x createdelightcore:nether_pizza_slice")
})
