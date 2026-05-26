ServerEvents.recipes((event) => {
  remove_recipes_id(event, [
    "silentsdelight:sculk_sensor_tendril_roll",
    "farmersdelight:kelp_roll"
  ])
});

ServerEvents.tags("item", e => {
  e.removeAllTagsFrom([
    'silentsdelight:sculk_catalyst_pie',
    'silentsdelight:sculk_catalyst_pie_slice',
    'silentsdelight:sculk_catalyst_pie_crust'
  ])
})
