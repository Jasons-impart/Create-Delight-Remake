NetworkEvents.dataReceived("kubejs_player_playsound", e => {
    e.player.playSound(e.data.get("soundEvent").getAsString())
})