BlockEvents.rightClicked("neapolitan:milk_cauldron", e => {
  let { player, block, hand } = e
  let prop = block.properties
  let level = parseInt(block.properties.get("level"))
  if (player.getItemInHand(hand).is("minecraft:glass_bottle")) {
    level--
    if (level != 0) {
      prop.put("level", level.toString())
      block.set("neapolitan:milk_cauldron", prop)
    }
    else {
      block.set("minecraft:cauldron")
    }
    player.give("farmersdelight:milk_bottle")
    player.getItemInHand(hand).shrink(1)
    player.sendData("kubejs_player_playsound", { soundEvent: "minecraft:item.bottle.fill" })

    e.cancel()
  }
  else if (player.getItemInHand(hand).is("farmersdelight:milk_bottle")) {
    level++
    if (level != 4) {
      prop.put("level", level.toString())
      block.set("neapolitan:milk_cauldron", prop)
      player.getItemInHand(hand).shrink(1)
      player.give("minecraft:glass_bottle")
      player.sendData("kubejs_player_playsound", { soundEvent: "minecraft:item.bottle.fill" })
    }

    e.cancel()
  }
})

BlockEvents.rightClicked("minecraft:cauldron", e => {
  let { player, block, hand } = e
  if (player.getItemInHand(hand).is("farmersdelight:milk_bottle")) {
    player.getItemInHand(hand).shrink(1)
    player.sendData("kubejs_player_playsound", { soundEvent: "minecraft:item.bottle.fill" })
    block.set("neapolitan:milk_cauldron", { level: "1" })
    e.cancel()
  }
})