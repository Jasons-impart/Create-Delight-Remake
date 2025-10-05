let chorus_items = [
  'ends_delight:chorus_fruit_milk_tea',
  'ends_delight:bubble_tea',
  'ends_delight:chorus_cookie',
  'createdelight:chorus_cookie_dough',
  'ends_delight:chorus_fruit_grain',
  'ends_delight:chorus_flower_pie',
  'ends_delight:chorus_flower_tea',
  'ends_delight:chorus_fruit_pie_slice',
]
chorus_items.forEach(item => {
  ItemEvents.foodEaten(item, e => {
    if (e.player.cooldowns.isOnCooldown(e.item.item))
      return
    e.player.addItemCooldown(e.item.item, 20)
  })
})