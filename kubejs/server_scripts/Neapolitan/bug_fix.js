BlockEvents.rightClicked("neapolitan:milk_cauldron", e => {
  let { player, block, hand } = e
  if (!player.getItemInHand(hand).is("minecraft:glass_bottle"))
    e.cancel()
  let prop = block.properties
  let level = parseInt(block.properties.get("level"))
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
  player.sendData("kubejs_player_playsound", {soundEvent: "minecraft:item.bottle.fill"})
  e.cancel()
})