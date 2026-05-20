EntityEvents.death("minecraft:player", e => {
    if (e.entity.isLiving() && e.entity.isPlayer()) {
        /**
         * @type {Internal.ServerPlayer}
         */
        let player = e.entity
        let raw = Difficulty.getPlayerRawValue(player)
        let tier = Difficulty.getPlayerTier(player)
        let tierStart = tier == 0 ? 0 : Difficulty.tierThreshold[tier - 1]
        let tierProgress = raw - tierStart
        let lossRate = 0.35
        let grain = 5

        let loss = Math.ceil(tierProgress * lossRate / grain) * grain

        if (loss >= tierProgress) {
            if (tierProgress < grain) {
                if (tier > 0) {
                    let prevStart = tier <= 1 ? 0 : Difficulty.tierThreshold[tier - 2]
                    let prevEnd = Difficulty.tierThreshold[tier - 1]
                    let newRaw = prevStart + Math.floor((prevEnd - prevStart) * 0.8)
                    UpdateRank(player, newRaw - raw, "death")
                }
            } else {
                let newRaw = tierStart + 1
                UpdateRank(player, newRaw - raw, "death")
            }
        } else {
            UpdateRank(player, -loss, "death")
        }
    }
})