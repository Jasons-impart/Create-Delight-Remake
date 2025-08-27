BlockEvents.rightClicked("create:blaze_burner", e => {
  const {player, item} = e;
  if (player == null) return;
  if (!player.isCrouching() 
      && (Ingredient.of("createfluidstuffs:bucket").test(item) 
          || Ingredient.of("createfluidstuffs:jar").test(item))) 
    e.cancel();
})