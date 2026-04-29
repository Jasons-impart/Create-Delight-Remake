//根据难度增加怪物掉落
let difficultyLoots = global.difficultyLoots
LootJS.modifiers(e => {
    for (const key in difficultyLoots) {
        let element = difficultyLoots[key]
        element.forEach(val => {
            e.addEntityLootModifier(val.entity)
            .playerPredicate(player => Difficulty.getPlayerTier(player) >= val.tier)
            .addLoot(LootEntry.of(key).when(c => c.randomChance(val.chance)))
        })
    }
})

EntityEvents.drops(e => {
    const {drops, source} = e
    if (source.player == null)
        return
    let dropMultipler = [1, 1, 1.25, 1.5, 2, 3, 5]
    let d = []
    drops.forEach(itemEntity => {
        let item = itemEntity.item
        d.push(item.copyWithCount(dropMultipler[Difficulty.getPlayerTier(source.player)] - 1 * item.count))
    })
    d.forEach(item =>{
        e.addDrop(item)
    })
})

