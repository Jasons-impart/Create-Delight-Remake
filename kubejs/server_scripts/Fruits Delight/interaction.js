BlockEvents.rightClicked("minecraft:water_cauldron", e => {
  const {player} = e
  if(player.getMainHandItem().is('fruitsdelight:lemon_slice')) {
    player.swing()
    player.sendData("kubejs_player_playsound", { soundEvent: "block.bubble_column.upwards_ambient" })
  }
})
let fruit_list = [
  'minecraft:chorus_fruit',
  'minecraft:melon_slice',
  'fruitsdelight:durian_flesh',
  'fruitsdelight:pineapple_slice',
  'fruitsdelight:hamimelon_slice',
  'minecraft:apple',
  'fruitsdelight:lemon',
  'fruitsdelight:pear',
  'fruitsdelight:hawberry',
  'fruitsdelight:lychee',
  'fruitsdelight:mango',
  'fruitsdelight:persimmon',
  'fruitsdelight:peach',
  'fruitsdelight:orange',
  'fruitsdelight:mangosteen',
  'fruitsdelight:bayberry',
  'fruitsdelight:kiwi',
  'fruitsdelight:fig',
  'fruitsdelight:blueberry',
  'fruitsdelight:cranberry',
]
let special_fruit = [
  'minecraft:glow_berries',
  'minecraft:sweet_berries',
]
fruit_list.forEach(fruit => {
  BlockEvents.rightClicked("minecraft:water_cauldron", e => {
    const { player } = e
    const heldItem = player.getMainHandItem()
    if(heldItem.is("fruitsdelight:" + fruit.split(":")[1].split("_")[0] + "_jelly")) {
      player.swing()
      player.sendData("kubejs_player_playsound", { soundEvent: "minecraft:block.honey_block.place" })
    }
  })

  BlockEvents.rightClicked("fruitsdelight:lemonade_cauldron", e => {
    const { player, block } = e
    const isHeated = block.getDown().hasTag('farmersdelight:heat_sources')
    const heldItem = player.getMainHandItem()
    if(heldItem.is(fruit) && isHeated) {
      player.swing()
      player.sendData("kubejs_player_playsound", { soundEvent: "block.bubble_column.upwards_ambient" })
    }
  })

  BlockEvents.rightClicked(`fruitsdelight:${fruit.split(":")[1].split("_")[0]}_cauldron`, e => {
    const { player, block } = e
    const isHeated = block.getDown().hasTag('farmersdelight:heat_sources')
    const heldItem = player.getMainHandItem()
    const cauldron_level = block.properties.get("level")
    if (isHeated) {
      if(heldItem.is(fruit) && cauldron_level < 12) {
        player.swing()
        player.sendData("kubejs_player_playsound", { soundEvent: "block.bubble_column.upwards_ambient" })
      }
      if(heldItem.is('minecraft:sugar') && cauldron_level == 12) {
        player.swing()
        player.sendData("kubejs_player_playsound", { soundEvent: "minecraft:block.honey_block.place" })
      }
    }
    if(heldItem.is("fruitsdelight:" + fruit.split(":")[1].split("_")[0] + "_jelly") && cauldron_level < 12) {
      player.swing()
      player.sendData("kubejs_player_playsound", { soundEvent: "minecraft:block.honey_block.place" })
    }
  })
  
  BlockEvents.rightClicked(`fruitsdelight:${fruit.split(":")[1].split("_")[0]}_jelly_cauldron`, e => {
    const { player, block } = e
    const isHeated = block.getDown().hasTag('farmersdelight:heat_sources')
    const heldItem = player.getMainHandItem()
    if (isHeated) {
      if(heldItem.is('minecraft:slime_ball')) {
        player.swing()
        player.sendData("kubejs_player_playsound", { soundEvent: "minecraft:block.slime_block.place" })
      }
    }
    if(heldItem.is('minecraft:glass_bottle')) {
      player.swing()
      player.sendData("kubejs_player_playsound", { soundEvent: "minecraft:block.honey_block.place" })
    }
  })

  BlockEvents.rightClicked(`fruitsdelight:${fruit.split(":")[1].split("_")[0]}_jello_cauldron`, e => {
    const { player } = e
    const heldItem = player.getMainHandItem()
    if(heldItem.is('minecraft:bowl')) {
      player.swing()
      player.sendData("kubejs_player_playsound", { soundEvent: "minecraft:block.slime_block.place" })
    }
  })
})

special_fruit.forEach(fruit => {
  BlockEvents.rightClicked("minecraft:water_cauldron", e => {
    const { player } = e
    const heldItem = player.getMainHandItem()
    if(heldItem.is("fruitsdelight:" + fruit.split(":")[1].split("_")[0] + "berry_jelly")) {
      player.swing()
      player.sendData("kubejs_player_playsound", { soundEvent: "minecraft:block.honey_block.place" })
    }
  })

  BlockEvents.rightClicked("fruitsdelight:lemonade_cauldron", e => {
    const { player, block } = e
    const isHeated = block.getDown().hasTag('farmersdelight:heat_sources')
    const heldItem = player.getMainHandItem()
    if(heldItem.is(fruit) && isHeated) {
      player.swing()
      player.sendData("kubejs_player_playsound", { soundEvent: "block.bubble_column.upwards_ambient" })
    }
  })

  BlockEvents.rightClicked(`fruitsdelight:${fruit.split(":")[1].split("_")[0]}berry_cauldron`, e => {
    const { player, block } = e
    const isHeated = block.getDown().hasTag('farmersdelight:heat_sources')
    const heldItem = player.getMainHandItem()
    const cauldron_level = block.properties.get("level")
    if (isHeated) {
      if(heldItem.is(fruit) && cauldron_level < 12) {
        player.swing()
        player.sendData("kubejs_player_playsound", { soundEvent: "block.bubble_column.upwards_ambient" })
      }
      if(heldItem.is('minecraft:sugar') && cauldron_level == 12) {
        player.swing()
        player.sendData("kubejs_player_playsound", { soundEvent: "minecraft:block.honey_block.place" })
      }
    }
    if(heldItem.is("fruitsdelight:" + fruit.split(":")[1].split("_")[0] + "berry_jelly") && cauldron_level < 12) {
      player.swing()
      player.sendData("kubejs_player_playsound", { soundEvent: "minecraft:block.honey_block.place" })
    }
  })
  
  BlockEvents.rightClicked(`fruitsdelight:${fruit.split(":")[1].split("_")[0]}berry_jelly_cauldron`, e => {
    const { player, block } = e
    const isHeated = block.getDown().hasTag('farmersdelight:heat_sources')
    const heldItem = player.getMainHandItem()
    if (isHeated) {
      if(heldItem.is('minecraft:slime_ball')) {
        player.swing()
        player.sendData("kubejs_player_playsound", { soundEvent: "minecraft:block.slime_block.place" })
      }
    }
    if(heldItem.is('minecraft:glass_bottle')) {
      player.swing()
      player.sendData("kubejs_player_playsound", { soundEvent: "minecraft:block.honey_block.place" })
    }
  })

  BlockEvents.rightClicked(`fruitsdelight:${fruit.split(":")[1].split("_")[0]}berry_jello_cauldron`, e => {
    const { player } = e
    const heldItem = player.getMainHandItem()
    if(heldItem.is('minecraft:bowl')) {
      player.swing()
      player.sendData("kubejs_player_playsound", { soundEvent: "minecraft:block.slime_block.place" })
    }
  })
})