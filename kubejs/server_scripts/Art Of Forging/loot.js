LootJS.modifiers(e => {
    // // 移除恶意碎片
    // e.addEntityLootModifier("minecraft:wither_skeleton")
    //     .removeLoot("art_of_forging:shards_of_malice")
    // // 移除伊甸碎片
    // e.addEntityLootModifier("minecraft:wither")
    //     .removeLoot("art_of_forging:fragment_of_eden")
    // // 移除灵魂碎片
    // e.addEntityLootModifier("minecraft:blaze")
    //     .removeLoot("art_of_forging:soul_ember")
    /**
     * 
     * @param {Special.EntityType} entity 实体
     * @param {Internal.ItemStack_} item 物品
     * @param {number} chance 概率
     */
    function addNanoFuseLoot(entity, item, chance) {
        e.addEntityLootModifier(entity)
        .playerPredicate(player => {
            let weapon = player.getItemInHand("main_hand")
            if (!weapon.hasNBT())
                return false
            
            let flag = false
            weapon.nbt.getAllKeys().forEach(str => {
                console.log(str)
                if (str.endsWith("nano_fused")) {
                    flag = true
                }
            })
            return flag
        })
        .addLoot(LootEntry.of(item).when(c => c.randomChance(chance)))
    }
    addNanoFuseLoot("alexscaves:teletor", "art_of_forging:nano_insectoid", 0.5)
    addNanoFuseLoot("alexscaves:magnetron", "art_of_forging:nano_insectoid", 0.5)
    addNanoFuseLoot("alexscaves:boundroid", "art_of_forging:nano_insectoid", 0.5)
    addNanoFuseLoot("alexscaves:ferrouslime", "art_of_forging:nano_insectoid", 0.5)
    addNanoFuseLoot("alexscaves:notor", "art_of_forging:nano_insectoid", 0.5)
    

})