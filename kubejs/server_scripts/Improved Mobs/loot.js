//根据难度增加怪物掉落
LootJS.modifiers(e => {
    for (const key in global.difficultyLoots) {
        let element = global.difficultyLoots[key]
        element.forEach(val => {
            e.addEntityLootModifier(val.entity)
            .playerPredicate(player => Difficulty.getPlayerTier(player) >= val.tier)
            .addLoot(LootEntry.of(key).when(c => c.randomChance(val.chance)))
        })
    }
})

EntityEvents.drops(e => {
    const {entity, drops, source} = e
    if (entity.isPlayer() || source.player == null)
        return
    let dropMultipliers = [1, 1, 1.25, 1.5, 2, 3, 5]
    let multiplier = dropMultipliers[Difficulty.getPlayerTier(source.player)]
    drops.forEach(itemEntity => {
        let item = itemEntity.item
        let extraCount = (multiplier - 1) * item.count
        let guaranteedCount = Math.floor(extraCount)
        let fractionalChance = extraCount - guaranteedCount
        if (guaranteedCount > 0)
            e.addDrop(item.copyWithCount(guaranteedCount))
        if (fractionalChance > 0)
            e.addDrop(item.copyWithCount(1), fractionalChance)
    })
})
