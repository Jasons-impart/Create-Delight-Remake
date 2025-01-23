EntityEvents.death("minecraft:player", e => {
    if (e.entity.isLiving() && e.entity.isPlayer()) {
        /**
         * @type {Internal.ServerPlayer}
         */
        let player = e.entity
        let maxrate = 0.4
        let minrate = 0.1
        let maxDiff = 250
        let realDiff = GetPlayerDifficulty(player)
        let diff = Math.min(Math.max(realDiff, 0), maxDiff)
        let divide = 5
        UpdateRank(player, -Math.floor(((diff / maxDiff) * minrate + (1 - diff / maxDiff) * maxrate) * realDiff / divide) * divide)
    }
})