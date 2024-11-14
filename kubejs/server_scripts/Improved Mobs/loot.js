//根据难度增加怪物掉落

LootJS.modifiers(e => {
    /**
     * @type {[Special.EntityType, number, Special.Item, number][]}
     */
    const difficultyLootList = [
    ]
    /**
     * 
     * @param {Special.EntityType} entity 实体
     * @param {number} difficulty 难度
     * @param {Special.Item} item 物品
     * @param {number} chance 概率
     */
    function addDifficultyLoot(entity, difficulty, item, chance) {
        difficultyLootList.push(
            [entity, difficulty, item, chance]
        )
    }

    addDifficultyLoot("minecraft:zombie", 100, "minecraft:iron_ingot", 0.5)

    difficultyLootList.forEach((value) => {
        e.addEntityLootModifier(value[0])
        .playerPredicate(player => GetPlayerDifficulty(player) > value[1])
        .addLoot(LootEntry.of(value[2]).when(c => c.randomChance(value[3])))
    })
    
})