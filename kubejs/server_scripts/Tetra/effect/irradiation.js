PlayerEvents.tick(e => {
    if (e.level.time % (30 * 20) == 0) {
        let player = e.player
        if (player == null)
            return
        let item = player.mainHandItem
        if (item.item instanceof $ModularItem) {
            if (TetraUtil.itemHasEffect(item, "createdelight:irradiation")) {
                let level = TetraUtil.getEffectLevel(item, "createdelight:irradiation")
                let efficiency = TetraUtil.getEffectEfficiency(item, "createdelight:irradiation")
                player.potionEffects.add("alexscaves:irradiated", efficiency + (player.getEffect("alexscaves:irradiated")?.duration || 0), level, true, true)
            }
        }
    }
})