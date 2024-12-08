BlockEvents.rightClicked(e => {
    const {player, block} = e
    if(player.mainHandItem.id == "create_new_age:overcharged_diamond") {
        player.swing()
    } else {
        return 0
    }
})