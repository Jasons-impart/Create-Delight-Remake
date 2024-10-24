BlockEvents.rightClicked("create_connected:fluid_vessel", e => {
    let item = e.player.mainHandItem
    if (item.id == "createdieselgenerators:distillation_controller")
        e.cancel()
})
