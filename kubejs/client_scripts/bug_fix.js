BlockEvents.rightClicked("alexsmobs:capsid", e => {
  const { block, player, level } = e
  let mainHandItem = player.mainHandItem
  let entityData = block.entityData
  let entityId = entityData 
                  && entityData["Items"] 
                  && entityData["Items"][0]
                  && entityData["Items"][0]["id"]
                  || 'unknown';
  if (
    entityId == "create:minecart_contraption"
    && mainHandItem?.id == "create:minecart_contraption"
  ) {
    e.cancel()
    player.sendInventoryUpdate()
  }
  if (
    entityId.search("present") != -1
    && mainHandItem?.id.search("present") != -1
  ) {
    e.cancel()
    player.sendInventoryUpdate()
  }
  if (
    entityId.search("functionalstorage") != -1
    && mainHandItem?.id.search("functionalstorage") != -1
  ) {
    e.cancel()
    player.sendInventoryUpdate()
  }
})
