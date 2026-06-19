PlayerEvents.tick(e => {
    if (global.CDClientJavaClasses.BetterCombat$KeyBindings.toggleMineKeyBinding.isDown()) {
        e.player.sendData("show_bettercombat_mine_key")
    }
})