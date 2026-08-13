
PlayerEvents.loggedIn(e => {
    const {player} = e
    if (player.persistentData.get("notFirstLogin") == null) {
        player.give("ftbquests:book")
        player.persistentData.putBoolean("notFirstLogin", true)
    }
})
