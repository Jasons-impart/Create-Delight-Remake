ServerEvents.recipes(e => {
  const {create, kubejs} = e.recipes
  remove_recipes_id(e, [
    "create_central_kitchen:mixing/apple_cider",
    "create_central_kitchen:emptying/chocolate_ice_cream",
    "create_central_kitchen:emptying/strawberry_ice_cream",
    "create_central_kitchen:emptying/vanilla_ice_cream",
    "create_central_kitchen:emptying/banana_ice_cream",
    "create_central_kitchen:emptying/mint_ice_cream",
    "create_central_kitchen:emptying/adzuki_ice_cream",
    "create_central_kitchen:mixing/chocolate_ice_cream_from_fluid_chocolate",
    "create_central_kitchen:mixing/chocolate_ice_cream",
    "create_central_kitchen:mixing/strawberry_ice_cream",
    "create_central_kitchen:mixing/vanilla_ice_cream",
    "create_central_kitchen:mixing/banana_ice_cream",
    "create_central_kitchen:mixing/mint_ice_cream",
    "create_central_kitchen:mixing/adzuki_ice_cream",
    "create_central_kitchen:mixing/chocolate_milkshake",
    "create_central_kitchen:mixing/chocolate_milkshake_from_ice_cream",
    "create_central_kitchen:mixing/strawberry_milkshake",
    "create_central_kitchen:mixing/strawberry_milkshake_from_ice_cream",
    "create_central_kitchen:mixing/vanilla_milkshake",
    "create_central_kitchen:mixing/vanilla_milkshake_from_ice_cream",
    "create_central_kitchen:mixing/banana_milkshake",
    "create_central_kitchen:mixing/banana_milkshake_from_ice_cream",
    "create_central_kitchen:mixing/mint_milkshake",
    "create_central_kitchen:mixing/mint_milkshake_from_ice_cream",
    "create_central_kitchen:mixing/adzuki_milkshake",
    "create_central_kitchen:mixing/adzuki_milkshake_from_ice_cream",
    "create_central_kitchen:emptying/chocolate_milkshake",
    "create_central_kitchen:emptying/strawberry_milkshake",
    "create_central_kitchen:emptying/vanilla_milkshake",
    "create_central_kitchen:emptying/banana_milkshake",
    "create_central_kitchen:emptying/mint_milkshake",
    "create_central_kitchen:emptying/adzuki_milkshake",
  ])
  create.mixing(
    Fluid.of("create_central_kitchen:tomato_sauce", 250),
    [
      '2x #forge:vegetables/tomato',
      "minecraft:sugar"
    ]
  ).id("create_central_kitchen:mixing/tomato_sauce")
  create.mixing(
    Fluid.of("create_central_kitchen:creamy_corn_drink", 250),
    [
      "createdelight:corn_flour",
      FluidIngredients("forge:milk", 250),
      "minecraft:sugar"
    ]
  ).heated().id("create_central_kitchen:mixing/creamy_corn_drink")
  create.mixing(
    Fluid.of("create_central_kitchen:creamy_corn_drink", 250),
    [
      "createdelight:corn_flour",
      Fluid.of("cosmopolitan:cream", 250),
      "minecraft:sugar"
    ]
  ).heated().id("create_central_kitchen:mixing/creamy_corn_drink_from_cream")
  create.filling(
    'corn_delight:creamy_corn_drink',
    [
      "minecraft:glass_bottle",
      Fluid.of("create_central_kitchen:creamy_corn_drink", 250)
    ]
  ).id("create_central_kitchen:filling/creamy_corn_drink")
  create.emptying(
    [
      "minecraft:glass_bottle",
      Fluid.of("create_central_kitchen:creamy_corn_drink", 250)
    ],
    'corn_delight:creamy_corn_drink'
  ).id("create_central_kitchen:emptying/creamy_corn_drink")

  create.mixing(
    Fluid.of("create_central_kitchen:corn_soup", 250),
    [
      "createdelight:corn_flour",
      FluidIngredients("forge:milk", 250),
      "#forge:salad_ingredients",
      "#brewinandchewin:raw_meats"
    ]
  ).heated().id("create_central_kitchen:mixing/corn_soup")
  create.mixing(
    Fluid.of("create_central_kitchen:corn_soup", 250),
    [
      "createdelight:corn_flour",
      Fluid.of("cosmopolitan:cream", 250),
      "#forge:salad_ingredients",
      "#brewinandchewin:raw_meats"
    ]
  ).heated().id("create_central_kitchen:mixing/corn_soup_from_cream")
  create.filling(
    'corn_delight:corn_soup',
    [
      "minecraft:bowl",
      Fluid.of("create_central_kitchen:corn_soup", 250)
    ]
  ).id("create_central_kitchen:filling/corn_soup")
  create.emptying(
    [
      "minecraft:bowl",
      Fluid.of("create_central_kitchen:corn_soup", 250)
    ],
    'corn_delight:corn_soup'
  ).id("create_central_kitchen:emptying/corn_soup")
})