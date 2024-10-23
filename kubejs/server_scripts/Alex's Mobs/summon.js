BlockEvents.rightClicked("createdelight:fragment_of_border", (event) => {
  const { server, player, block, item, level, entity } = event;
  if (item.id === "createdelight:fragment_of_border") {
    level.destroyBlock(block.pos, true);
    item.count--;
    block.createEntity("alexsmobs:farseer").spawn();
  }
  return;
});

// ItemEvents.rightClicked("alexsmobs:shattered_dimensional_carver", (event) => {
//   const { server, player, block, item, level, entity } = event;
//   server.tell(item.id);
//   server.tell(player.level.dimension);
//   event.cancel()
//   player.hurt(1)
// });
