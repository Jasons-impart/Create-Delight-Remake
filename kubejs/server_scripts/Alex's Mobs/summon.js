BlockEvents.rightClicked("createdelight:fragment_of_border", (event) => {
  const { server, player, block, item, level, entity } = event;
  if (item.id === "createdelight:fragment_of_border") {
    level.destroyBlock(block.pos, true)
    item.count--
    block.createEntity("alexsmobs:farseer").spawn()
  }
  return
})