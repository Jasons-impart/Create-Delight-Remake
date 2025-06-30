ServerEvents.recipes(e => {
  remove_recipes_output(e, [
    "create_factory_logistics:network_link"
  ])
})
BlockEvents.rightClicked(e => {
  let item = e.player.getMainHandItem();
  if(item.id == "create_factory_logistics:network_link"){
    e.cancel();
    e.player.getHeldItem().shrink(1);
  }
})