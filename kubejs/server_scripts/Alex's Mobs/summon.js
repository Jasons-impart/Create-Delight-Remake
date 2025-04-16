BlockEvents.rightClicked("createdelightcore:fragment_of_border", (event) => {
  const { server, player, block, item, level, entity } = event;
  if (item.id === "createdelightcore:fragment_of_border") {
    level.destroyBlock(block.pos, true)
    item.count--
    block.createEntity("alexsmobs:farseer").spawn()
  }
  return
})