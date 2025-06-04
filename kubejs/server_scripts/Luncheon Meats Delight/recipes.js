ServerEvents.recipes(e => {
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
})

BlockEvents.rightClicked("luncheonmeatsdelight:small_toast", e => {
  if(e.player.mainHandItem.hasTag('forge:tools/knives')){
    e.player.swing()
    e.block.set("air")
    e.block.popItem('2x bakeries:sliced_toast')
    e.cancel()
  }
})