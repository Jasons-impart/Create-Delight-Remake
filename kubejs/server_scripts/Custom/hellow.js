PlayerEvents.loggedIn(e => {
	const { player } = e
    if(player.username != null){
        player.tell(Text.translate("message.createdelight.logIn", [player.username]))
    }
})