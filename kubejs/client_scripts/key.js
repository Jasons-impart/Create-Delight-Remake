let BetterCombat$KeyBindings = Java.loadClass("net.bettercombat.client.BetterCombatKeybindings")

PlayerEvents.tick(e => {
    if (BetterCombat$KeyBindings.toggleMineKeyBinding.isDown()) {
        e.player.sendData("show_bettercombat_mine_key")
    }
})