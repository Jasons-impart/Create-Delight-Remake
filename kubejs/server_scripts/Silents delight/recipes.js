ServerEvents.recipes((event) => {
  remove_recipes_id(event, [
    "silentsdelight:sculk_sensor_tendril_roll",
    "farmersdelight:kelp_roll"
  ])
  const { create } = event.recipes;
});
