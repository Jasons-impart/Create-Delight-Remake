BlockEvents.rightClicked("create:blaze_burner", e => {
    const {player, item} = e;
    if (player == null) return;
    if ((Ingredient.of("createfluidstuffs:bucket").test(item) || Ingredient.of("createfluidstuffs:jar").test(item))
      && !e.player.shiftKeyDown) e.cancel();
})