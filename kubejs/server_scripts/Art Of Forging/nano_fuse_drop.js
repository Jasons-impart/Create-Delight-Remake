
EntityEvents.drops(e => {
    /**
     * @param {Internal.LivingEntityDropsEventJS} e 
     * @param {Special.EntityType} entity 实体
     * @param {Internal.ItemStack_} item 物品
     */
    function addNanoFuseLoot(e, entity, item) {
        let player = e.source.player
        if (e.entity.type != entity)
            return
        
        if (!player.isPlayer())
            return

        let weapon = player.getItemInHand("main_hand")
        if (!weapon.hasNBT())
            return 
        let nano_fused_count = 0
        weapon.nbt.getAllKeys().forEach(str => {
            if (str.endsWith("nano_fused")) {
                nano_fused_count++
            }
        })
        e.addDrop(item, nano_fused_count * 0.25)
    }
    addNanoFuseLoot(e, "alexscaves:teletor", "art_of_forging:nano_insectoid")
    addNanoFuseLoot(e, "alexscaves:magnetron", "art_of_forging:nano_insectoid")
    addNanoFuseLoot(e, "alexscaves:boundroid", "art_of_forging:nano_insectoid")
    addNanoFuseLoot(e, "alexscaves:ferrouslime", "art_of_forging:nano_insectoid")
    addNanoFuseLoot(e, "alexscaves:notor", "art_of_forging:nano_insectoid")
    addNanoFuseLoot(e, "minecraft:wither_skeleton", "art_of_forging:shards_of_malice")
    
    let dread_monster = [
        "iceandfire:dread_beast",
        "iceandfire:dread_ghoul",
        "iceandfire:dread_horse",
        "iceandfire:dread_knight",
        "iceandfire:dread_lich",
        "iceandfire:dread_lich_skull",
        "iceandfire:dread_scuttler",
        "iceandfire:dread_thrall",
    ]
    dread_monster.forEach(type => {
        addNanoFuseLoot(e, type, "createdelight:dread_heart")
    })
})