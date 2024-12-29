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

    addDifficultyLoot("minecraft:wither_skeleton", 100, "art_of_forging:fragment_of_eden", 0.1)
    addDifficultyLoot("minecraft:wither", 100, "art_of_forging:sigil_of_eden", 0.25)

    addDifficultyLoot("iceandfire:cockatrice", 100, "iceandfire:cockatrice_eye", 0.5)
    addDifficultyLoot("iceandfire:dread_lich", 150, "iceandfire:dragonsteel_ice_ingot", 0.1)
    addDifficultyLoot("iceandfire:dread_knight", 150, "iceandfire:dragonsteel_ice_ingot", 0.1)
    addDifficultyLoot("iceandfire:dread_thrall", 150, "iceandfire:dragonsteel_ice_ingot", 0.05)
    addDifficultyLoot("iceandfire:dread_ghoul", 150, "iceandfire:dragonsteel_ice_ingot", 0.05)

    difficultyLootList.forEach((value) => {
        e.addEntityLootModifier(value[0])
        .playerPredicate(player => GetPlayerDifficulty(player) > value[1])
        .addLoot(LootEntry.of(value[2]).when(c => c.randomChance(value[3])))
    })
    
})