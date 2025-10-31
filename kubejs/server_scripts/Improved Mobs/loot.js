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
     * @param {number} difficulty 难度等级
     * @param {Special.Item} item 物品
     * @param {number} chance 概率
     */
    function addDifficultyLoot(entity, difficulty, item, chance) {
        difficultyLootList.push(
            [entity, difficulty, item, chance]
        )
    }

    addDifficultyLoot("minecraft:wither_skeleton", 3, "art_of_forging:fragment_of_eden", 0.1)
    addDifficultyLoot("minecraft:wither", 3, "art_of_forging:sigil_of_eden", 0.25)

    addDifficultyLoot("iceandfire:cockatrice", 3, "iceandfire:cockatrice_eye", 0.5)
    addDifficultyLoot("iceandfire:dread_lich", 4, "iceandfire:dragonsteel_ice_ingot", 0.1)
    addDifficultyLoot("iceandfire:dread_knight", 4, "iceandfire:dragonsteel_ice_ingot", 0.1)
    addDifficultyLoot("iceandfire:dread_thrall", 4, "iceandfire:dragonsteel_ice_ingot", 0.05)
    addDifficultyLoot("iceandfire:dread_ghoul", 4, "iceandfire:dragonsteel_ice_ingot", 0.05)

    difficultyLootList.forEach((value) => {
        e.addEntityLootModifier(value[0])
        .playerPredicate(player => Difficulty.getPlayerTier(player) >= value[1])
        .addLoot(LootEntry.of(value[2]).when(c => c.randomChance(value[3])))
    })  
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