ServerEvents.recipes(e => {
  remove_recipes_id(e, [
    "luncheonmeatsdelight:luncheon_meat_can_raw"
  ])
  const { kubejs, create } = e.recipes
  kubejs.shapeless(
    'luncheonmeatsdelight:luncheon_meat_sandwich',
    [
      'bakeries:sliced_toast',
      '2x luncheonmeatsdelight:luncheon_meat',
      "#forge:salad_ingredients",
      'bakeries:sliced_toast',
    ]
  ).id("luncheonmeatsdelight:cooking/luncheon_meat_sandwich")
  create.cutting(
    '2x bakeries:sliced_toast',
    'luncheonmeatsdelight:small_toast'
  )
  //饭团
  e.recipes.kubejs.shapeless(
    '2x luncheonmeatsdelight:luncheon_meat_rice_ball',
    [
      "minecraft:dried_kelp",
      "createdelight:empty_riceball",
      "createdelight:empty_riceball",
      "luncheonmeatsdelight:luncheon_meat"
    ]
  ).id("luncheonmeatsdelight:luncheon_meat_rice_ball")
})

BlockEvents.rightClicked("luncheonmeatsdelight:small_toast", e => {
  if(e.player.mainHandItem.hasTag('forge:tools/knives')){
    e.player.swing()
    e.block.set("air")
    e.block.popItem('2x bakeries:sliced_toast')
    e.cancel()
  }
})