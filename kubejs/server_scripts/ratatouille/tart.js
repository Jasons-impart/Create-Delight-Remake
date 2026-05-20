ServerEvents.recipes(e => {
  const {vintageimprovements, create} = e.recipes

  remove_recipes_id(e, [
    "bakeries:raw_egg_tart",
    "bakeries:dough_crafting_table/egg_tart_shell"
  ])
  e.custom({
    type: "bakeries:dough_crafting_table",
    count: 3,
    ingredient:{item: "createdelight:puff_pastry"},
    result: "bakeries:egg_tart_shell"
  }).id("createdelight:dough_crafting_table/egg_tart_shell")
  create.mixing(
    Fluid.of("createdelight:egg_tart_fluid", 1000),
    [
      FluidIngredients("forge:egg_yolk", 750),
      Fluid.of("cosmopolitan:cream", 250),
      "2x minecraft:sugar"
    ]
  ).id("createdelight:mixing/egg_tart_fluid")
  create.filling(
    'bakeries:raw_egg_tart',
    [
      Fluid.of("createdelight:egg_tart_fluid", 250),
      'bakeries:egg_tart_shell'
    ]
  ).id("createdelight:filling/egg_tart_fluid")

  vintageimprovements.curving("3x bakeries:egg_tart_shell", "createdelight:puff_pastry").mode(1).id("createdelight:curving/egg_tart_shell")
  baking(e, 'bakeries:raw_egg_tart', 'bakeries:egg_tart', 1, "food", 100)
  create.deploying(
    'fruitsdelight:lemon_tart',
    [
      'bakeries:egg_tart',
      "fruitsdelight:lemon_slice"
    ]
  ).id("createdelight:deploying/lemon_tart")
  create.deploying(
    'fruitsdelight:fig_tart',
    [
      'bakeries:egg_tart',
      "fruitsdelight:fig"
    ]
  ).id("createdelight:deploying/fig_tart")
})