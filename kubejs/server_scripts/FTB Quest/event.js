FTBQuestsEvents.completed(e => {
    let id = e.object.getCodeString()
    let player = e.player
    if (id == "25781A3553108A4C") {
        GamePhase.addPhase(player, "end")
    }
})