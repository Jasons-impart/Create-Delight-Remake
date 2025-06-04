ItemEvents.foodEaten("dungeonsdelight:soft_serve_sniffer_egg", e => {
    e.server.scheduleInTicks(1, func => {
        e.player.give("trailandtales_delight:sniffer_eggshell")
    })
})