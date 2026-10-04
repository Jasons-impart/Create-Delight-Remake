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
    // 不能边遍历 drops 边 addDrop（会向同一个 ArrayList 追加，触发 ConcurrentModificationException），
    // 先收集本轮要追加的掉落，遍历结束后再统一 addDrop。
    let pending = []
    drops.forEach(itemEntity => {
        let item = itemEntity.item
        let extraCount = (multiplier - 1) * item.count
        let guaranteedCount = Math.floor(extraCount)
        let fractionalChance = extraCount - guaranteedCount
        if (guaranteedCount > 0)
            pending.push({ stack: item.copyWithCount(guaranteedCount), chance: 1 })
        if (fractionalChance > 0)
            pending.push({ stack: item.copyWithCount(1), chance: fractionalChance })
    })
    pending.forEach(entry => {
        if (entry.chance >= 1)
            e.addDrop(entry.stack)
        else
            e.addDrop(entry.stack, entry.chance)
    })
})
