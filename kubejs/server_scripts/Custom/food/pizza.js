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
  combination(e, [
    "bakeries:pizza_flatbread",
    'create_bic_bit:ketchup_bottle',
    "#createdelight:order/vegetable",
    "minecraft:beetroot",
    "trailandtales_delight:cheese_slice"
  ], "createdelightcore:raw_vegetable_pizza", 1)
  combination(e, [
    "bakeries:pizza_flatbread",
    'create_bic_bit:ketchup_bottle',
    "#forge:meat/processed/raw",
    "#createdelight:order/vegetable",
    "trailandtales_delight:cheese_slice"
  ], "createdelightcore:raw_meatlovers_pizza", 1)
  combination(e, [
    "bakeries:pizza_flatbread",
    'create_bic_bit:ketchup_bottle',
    "mynethersdelight:hoglin_loin",
    ["netherexp:warped_wart", "minecraft:nether_wart"],
    "trailandtales_delight:cheese_slice"
  ], "createdelightcore:raw_nether_pizza", 1)
  combination(e, [
    "bakeries:pizza_flatbread",
    'create_bic_bit:ketchup_bottle',
    "trailandtales_delight:cheese_slice"
  ], "bakeries:raw_pizza", 1)
  cutting(e, "createdelightcore:meatlovers_pizza", [["createdelightcore:meatlovers_pizza_slice", 4]])
  cutting(e, "createdelightcore:vegetable_pizza", [["createdelightcore:vegetable_pizza_slice", 4]])
  cutting(e, "bakeries:pizza", [["createdelightcore:pizza_slice", 4]])
  cutting(e, "createdelightcore:nether_pizza", [["createdelightcore:nether_pizza_slice", 4]])
})