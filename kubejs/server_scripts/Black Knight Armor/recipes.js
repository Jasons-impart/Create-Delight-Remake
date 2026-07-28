ServerEvents.recipes(e => {
  const { create, kubejs, minecraft } = e.recipes
  const armorSlots = ["helmet", "chestplate", "leggings", "boots"]
  const armorRecipeSets = [
    "black_knight_armor",
    "berserk_armor",
    "solar_flare_armor",
    "white_behemoth",
    "ghost",
    "dragon_fire_armor"
  ]
  const removedRecipeIds = [
    "blackknightarmor:mied_floral_flavor_ice_cream",
    "blackknightarmor:dark_flame_ingot",
    "blackknightarmor:rage_soul_ingot",
    "blackknightarmor:sun_light_ingot",
    "blackknightarmor:ghoststeel_ingot",
    "blackknightarmor:frost_tooth_ingot",
    "blackknightarmor:dragon_fire_ingot",
    "blackknightarmor:black_knight_sword_crafting",
    "blackknightarmor:dragon_slayer_sword_crafting",
    "blackknightarmor:daybreak_spear_crafting",
    "blackknightarmor:ice_tooth_axe_crafting",
    "blackknightarmor:candlelight_sword",
    "blackknightarmor:dragon_fire_sword_crafting",
    "blackknightarmor:ultimate_black_knight_sword_crafting",
    "blackknightarmor:mad_soul_dragon_slayer_sword_crafting",
    "blackknightarmor:burning_sword_soul",
    "blackknightarmor:endless_anger",
    "blackknightarmor:sunlight_essence",
    "blackknightarmor:end_dragon_ingot_fire_forge",
    "blackknightarmor:end_dragon_ingot_ice_forge",
    "blackknightarmor:end_dragon_ingot_lightning_forge"
  ]
  armorRecipeSets.forEach(set => {
    armorSlots.forEach(slot => {
      removedRecipeIds.push(`blackknightarmor:${set}_${slot}_crafting`)
    })
  })
  remove_recipes_id(e, removedRecipeIds)

  // 主题锭统一使用三种输入的工作盆压块塑形，并按 1:1 加工。
  create.compacting("blackknightarmor:dark_flame_ingot", [
    "dreadsteel:dreadsteel_ingot",
    "alexscaves:pure_darkness",
    Fluid.of("netherexp:ectoplasm", 250)
  ]).heated().id("createdelight:compacting/dark_flame_ingot")

  create.compacting("blackknightarmor:rage_soul_ingot", [
    "dreadsteel:dreadsteel_ingot",
    "blackknightarmor:storm_essence",
    Fluid.of("createdelight:lightning_dragon_blood", 250)
  ]).superheated().id("createdelight:compacting/rage_soul_ingot")

  create.compacting("blackknightarmor:sun_light_ingot", [
    "dreadsteel:dreadsteel_ingot",
    "the_bumblezone:glistering_honey_crystal",
    "alexscaves:ambersol"
  ]).heated().id("createdelight:compacting/sun_light_ingot")

  create.compacting("blackknightarmor:frost_tooth_ingot", [
    "dreadsteel:dreadsteel_ingot",
    "netherexp:soul_permafrost",
    Fluid.of("createdelight:ice_dragon_blood", 250)
  ]).id("createdelight:compacting/frost_tooth_ingot")

  create.compacting("blackknightarmor:ghoststeel_ingot", [
    "dreadsteel:dreadsteel_ingot",
    "endergetic:portaplasm",
    "iceandfire:ectoplasm"
  ]).id("createdelight:compacting/ghoststeel_ingot")

  create.compacting("blackknightarmor:dragon_fire_ingot", [
    "dreadsteel:dreadsteel_ingot",
    "alexscaves:tectonic_shard",
    Fluid.of("createdelight:fire_dragon_blood", 250)
  ]).superheated().id("createdelight:compacting/dragon_fire_ingot")

  // 终结龙血物品与流体保持 1:250 mB 的可逆转换。
  create.emptying([
    Fluid.of("createdelight:end_dragon_blood", 250),
    "minecraft:glass_bottle"
  ], "blackknightarmor:end_dragon_blood")
    .id("createdelight:emptying/end_dragon_blood")
  create.filling("blackknightarmor:end_dragon_blood", [
    "minecraft:glass_bottle",
    Fluid.of("createdelight:end_dragon_blood", 250)
  ]).id("createdelight:filling/end_dragon_blood")

  create.compacting("blackknightarmor:end_dragon_ingot", [
    "dreadsteel:dreadsteel_ingot",
    Fluid.of("createdelight:end_dragon_blood", 250),
    "minecraft:chorus_fruit"
  ]).heated().id("createdelight:compacting/end_dragon_ingot")

  // 骑士升级模板：首张由悚怖钢阶段进入，之后可复制。
  kubejs.shaped("blackknightarmor:knight_upgrade_smithing_template", [
    "A B",
    " D ",
    "A C"
  ], {
    A: "dreadsteel:dreadsteel_ingot",
    B: "blackknightarmor:storm_essence",
    C: "minecraft:echo_shard",
    D: "createdelight:dread_upgrade_smithing_template"
  }).id("createdelight:knight_upgrade_smithing_template")

  kubejs.shaped("2x blackknightarmor:knight_upgrade_smithing_template", [
    "A B",
    "A C"
  ], {
    A: "iceandfire:dread_shard",
    B: "blackknightarmor:knight_upgrade_smithing_template",
    C: "minecraft:echo_shard"
  }).id("createdelight:knight_upgrade_smithing_template_copying")

  const armorUpgrades = [
    ["blackknightarmor:black_knight_armor", "iceandfire:dragonsteel_fire", "blackknightarmor:dark_flame_ingot"],
    ["blackknightarmor:berserk_armor", "iceandfire:dragonsteel_lightning", "blackknightarmor:rage_soul_ingot"],
    ["blackknightarmor:solar_flare_armor", "iceandfire:dragonsteel_fire", "blackknightarmor:sun_light_ingot"],
    ["blackknightarmor:white_behemoth", "iceandfire:dragonsteel_ice", "blackknightarmor:frost_tooth_ingot"],
    ["blackknightarmor:ghost", "iceandfire:dragonsteel_ice", "blackknightarmor:ghoststeel_ingot"],
    ["blackknightarmor:dragon_fire_armor", "iceandfire:dragonsteel_fire", "blackknightarmor:dragon_fire_ingot"]
  ]
  armorUpgrades.forEach(upgrade => {
    armorSlots.forEach(slot => {
      const result = `${upgrade[0]}_${slot}`
      const base = `${upgrade[1]}_${slot}`
      minecraft.smithing_transform(
        result,
        "blackknightarmor:knight_upgrade_smithing_template",
        base,
        upgrade[2]
      ).id(`createdelight:smithing_transform/${result.split(":")[1]}`)
    })
  })

  const weaponUpgrades = [
    ["blackknightarmor:black_knight_sword", "iceandfire:dragonsteel_fire_sword", "blackknightarmor:dark_flame_ingot"],
    ["blackknightarmor:dragon_slayer_sword", "iceandfire:dragonsteel_lightning_sword", "blackknightarmor:rage_soul_ingot"],
    ["blackknightarmor:daybreak_spear", "iceandfire:dragonsteel_fire_sword", "blackknightarmor:sun_light_ingot"],
    ["blackknightarmor:ice_tooth_axe", "iceandfire:dragonsteel_ice_axe", "blackknightarmor:frost_tooth_ingot"],
    ["blackknightarmor:candlelight_sword", "iceandfire:ghost_sword", "blackknightarmor:ghoststeel_ingot"],
    ["blackknightarmor:dragon_fire_sword", "iceandfire:dragonsteel_fire_sword", "blackknightarmor:dragon_fire_ingot"]
  ]
  weaponUpgrades.forEach(upgrade => {
    minecraft.smithing_transform(
      upgrade[0],
      "blackknightarmor:knight_upgrade_smithing_template",
      upgrade[1],
      upgrade[2]
    ).id(`createdelight:smithing_transform/${upgrade[0].split(":")[1]}`)
  })

  // 高级武器核心。冰冷欲望先补齐来源；霜兽斧仍保留原无序升级，待源码祭坛支持后迁移。
  kubejs.shaped("blackknightarmor:burning_sword_soul", [
    "ABA",
    "C D",
    "A A"
  ], {
    A: "blackknightarmor:dark_flame_ingot",
    B: "netherexp:treacherous_flame",
    C: "alexscaves:occult_gem",
    D: "minecraft:nether_star"
  }).id("createdelight:burning_sword_soul")

  kubejs.shaped("blackknightarmor:endless_anger", [
    "ABA",
    "C D",
    "A A"
  ], {
    A: "blackknightarmor:rage_soul_ingot",
    B: "cataclysm:monstrous_horn",
    C: "cataclysm:essence_of_the_storm",
    D: "minecraft:nether_star"
  }).id("createdelight:endless_anger")

  kubejs.shaped("blackknightarmor:sunlight_essence", [
    "ABA",
    "C D",
    "A A"
  ], {
    A: "blackknightarmor:sun_light_ingot",
    B: "alexscaves:ambersol",
    C: "the_bumblezone:crystalline_flower",
    D: "the_bumblezone:royal_jelly_bottle"
  }).id("createdelight:sunlight_essence")

  kubejs.shaped("blackknightarmor:cold_desire", [
    "ABA",
    " C ",
    "ADA"
  ], {
    A: "blackknightarmor:frost_tooth_ingot",
    B: "iceandfire:ice_dragon_heart",
    C: "createdelightcore:frost_lily_cluster",
    D: "netherexp:soul_permafrost"
  }).id("createdelight:cold_desire")

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
