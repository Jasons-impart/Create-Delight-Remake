ServerEvents.recipes(e => {
  remove_recipes_id(e, [
    "luncheonmeatsdelight:luncheon_meat_can_raw"
  ])
  const { kubejs, create } = e.recipes
  kubejs.shapeless(
    'luncheonmeatsdelight:luncheon_meat_sandwich',
    [
      'bakeries:sliced_toast',
      '2x cavedelight:cooked_slam_slice',
      "#forge:salad_ingredients",
      'bakeries:sliced_toast',
    ]
  ).id("createdelight:cooking/luncheon_meat_sandwich_manual_only")
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
