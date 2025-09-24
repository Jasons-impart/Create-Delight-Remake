BlockEvents.rightClicked("alexsmobs:capsid", e => {
  const { block, player, level } = e
  let mainHandItem = player.mainHandItem
  let entityData = block.entityData
  if (
    entityData["Items"][0]["id"] == "create:minecart_contraption" &&
    mainHandItem.id == "create:minecart_contraption"
  ) {
    e.cancel()
    player.sendInventoryUpdate()
  }
  if (
    entityData["Items"][0]["id"].search("present") != -1 &&
    mainHandItem.id.search("present") != -1
  ) {
    e.cancel()
    player.sendInventoryUpdate()
  }
  if (
    entityData["Items"][0]["id"].search("functionalstorage") != -1 &&
    mainHandItem.id.search("functionalstorage") != -1
  ) {
    e.cancel()
    player.sendInventoryUpdate()
  }
})
