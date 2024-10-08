BlockEvents.rightClicked("alexsmobs:capsid", (e) => {
  const { block, player, level } = e;
  if (
    block.entityData["Items"][0]["id"] == "create:minecart_contraption" &&
    player.mainHandItem.id == "create:minecart_contraption"
  ) {
    player.tell(Text.translate("message.createdelight.capsid"));
    e.cancel();
    player.sendInventoryUpdate();
  }
  if (
    block.entityData["Items"][0]["id"].search("present") != -1 &&
    player.mainHandItem.id.search("present") != -1
  ) {
    player.tell(Text.translate("message.createdelight.capsid"));
    e.cancel();
    player.sendInventoryUpdate();
  } else {
    return;
  }
});
