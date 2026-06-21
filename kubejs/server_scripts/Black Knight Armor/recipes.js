ServerEvents.recipes(e => {
  const {create, kubejs} = e.recipes
  remove_recipes_id(e, [
    "blackknightarmor:mied_floral_flavor_ice_cream"
  ])
  kubejs.shapeless(
    'blackknightarmor:mied_floral_flavor_ice_cream',
    [
      "minecraft:glass_bottle",
      "3x alexscaves:vanilla_ice_cream_scoop",
      'iceandfire:fire_stew',
      'iceandfire:frost_stew',
      'iceandfire:lightning_stew'
    ]
  ).id("createdelight:shapeless/blackied_floral_flavor_ice_cream")
  {
    let iner = "minecraft:glass_bottle"
    create.sequenced_assembly("blackknightarmor:mied_floral_flavor_ice_cream", iner, [
      create.deploying(iner, [iner, "alexscaves:vanilla_ice_cream_scoop"]),
      create.deploying(iner, [iner, "alexscaves:vanilla_ice_cream_scoop"]),
      create.deploying(iner, [iner, "alexscaves:vanilla_ice_cream_scoop"]),
      create.deploying(iner, [iner, "iceandfire:fire_stew"]),
      create.deploying(iner, [iner, "iceandfire:frost_stew"]),
      create.deploying(iner, [iner, "iceandfire:lightning_stew"]),
    ])
    .loops(1)
    .transitionalItem(iner)
    .id("createdelight:sequenced_assembly/blackied_floral_flavor_ice_cream")
  }
})

ItemEvents.foodEaten("blackknightarmor:mied_floral_flavor_ice_cream", e => {
  const { entity, player, level, server } = e

  global.CDServerJavaClasses.$EntityDataProvider.getCapability(entity).ifPresent(data => data.frozenData.setFrozen(entity, 100))
  entity.setTicksFrozen(100)
  let lightning = level.createEntity("minecraft:lightning_bolt")
  lightning.setPos(entity.position())
  level.addFreshEntity(lightning)
  server.scheduleInTicks(1, () => {
    if (!player.isCreative()) {
      if (!player.getInventory().add("minecraft:glass_bottle")) {
        player.drop("minecraft:glass_bottle", false)
      }
    }
  })
  server.scheduleInTicks(10, () => {
    entity.setSecondsOnFire(3)
  })
})
