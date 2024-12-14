EntityEvents.death("minecraft:player", e => {
    if (e.entity.isLiving() && e.entity.isPlayer()) {
        /**
         * @type {Internal.ServerPlayer}
         */
        let player = e.entity
        let diff = GetPlayerDifficulty(player)
        let maxrate = 0.25
        let minrate = 0.1
        let maxDiff = 250
        UpdateRank(player, Math.floor(((diff / maxDiff) * minrate + (1 - diff / maxDiff) * maxrate) / 5) * 5)
    }
})