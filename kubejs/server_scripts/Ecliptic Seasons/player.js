let $GrowthDetectorItem = Java.loadClass("com.teamtea.eclipticseasons.common.item.GrowthDetectorItem")

PlayerEvents.tick(e => {
    const { player, level } = e
    const { mainHandItem } = player
    if (mainHandItem.is("eclipticseasons:growth_detector") && level.time % 60 == 0) {
        let playerPos = player.blockPosition()
        BlockPos.betweenClosed(playerPos.offset(-5, 0, -5), playerPos.offset(5, 2, 5)).forEach(pos => {
            let block = level.getBlock(pos)
            /**@type {Internal.Stream<Internal.TagKey<Internal.Item>>} */
            let tags = block.item.getTags()
            if (!tags.anyMatch(tag => tag.location().toString().startsWith("eclipticseasons"))) return
            let chance = $GrowthDetectorItem.getGrowChance(level, pos, block.blockState)
            let r, g

            if (chance <= 0.5) {
                // 红 -> 黄
                let t = chance / 0.5   // 0~1
                r = 1
                g = t
            } else {
                // 黄 -> 绿
                let t = (chance - 0.5) / 0.5 // 0~1
                r = 1 - t
                g = 1
            }

            let particle = `dust ${r} ${g} 0 1`
            level.spawnParticles(particle, true,
                pos.x + 0.5, pos.y + 0.5, pos.z + 0.5,
                Math.random() * 0.05, Math.random() * -0.05, Math.random() * 0.05,
                20, 0.1)
        })
    }
})