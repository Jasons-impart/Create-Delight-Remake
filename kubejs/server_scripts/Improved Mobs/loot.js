//根据难度增加怪物掉落
let difficultyLoots = global.difficultyLoots
LootJS.modifiers(e => {
    for (const key in difficultyLoots) {
        let element = difficultyLoots[key]
        element.forEach(val => {
            e.addEntityLootModifier(val.entity)
            .playerPredicate(player => GetPlayerDifficulty(player) >= val.difficulty)
            .addLoot(LootEntry.of(key).when(c => c.randomChance(val.chance)))
        })
    }
})