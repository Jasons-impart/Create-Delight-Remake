BlockEvents.rightClicked("minecraft:cauldron", e => {
  const{ player } = e
  if(player.getMainHandItem().id == "minecraft:milk_bucket"){
    e.cancel()
  }
})