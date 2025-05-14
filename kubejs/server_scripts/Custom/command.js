ServerEvents.customCommand("openholo", e => {
    if (e.player.inventory.countItem("tetra:holo") == 0)
        return
    e.player.sendData("openholo", {})
})