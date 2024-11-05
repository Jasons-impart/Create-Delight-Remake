BlockEvents.rightClicked(e => {
    let player = e.player
    let block = e.block
    if (player.mainHandItem == "createdelight:pipettes") {
        player.tell(block.entity.blockState)
    }
})