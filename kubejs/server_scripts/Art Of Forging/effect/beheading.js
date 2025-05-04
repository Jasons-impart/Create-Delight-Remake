EntityEvents.drops(e => {
    /**
 * @param {Internal.LivingEntityDropsEventJS} e 
 * @param {Special.EntityType} entity 实体
 * @param {Internal.ItemStack_} item 物品
 */
    function addBeheadingLoot(e, entity, item) {
        let player = e.source.player
        if (e.entity.type != entity)
            return

        if (player == null || !player.isPlayer())
            return

        let weapon = player.getItemInHand("main_hand")
        if (!(weapon.item instanceof $ModularItem) || !TetraUtil.itemHasEffect(weapon, "art_of_forging:beheading"))
            return
        let level = TetraUtil.getEffectLevel(weapon, "art_of_forging:beheading")
        e.addDrop(item, level / 100)
    }
    addBeheadingLoot(e, "iceandfire:hippogryph", "iceandfire:hippogryph_skull")
    addBeheadingLoot(e, "iceandfire:cockatrice", "iceandfire:cockatrice_skull")
    addBeheadingLoot(e, "iceandfire:cyclops", "iceandfire:cyclops_skull")
    addBeheadingLoot(e, "iceandfire:stymphalian_bird", "iceandfire:stymphalian_skull")
    addBeheadingLoot(e, "iceandfire:troll", "iceandfire:troll_skull")
    addBeheadingLoot(e, "iceandfire:amphithere", "iceandfire:amphithere_skull")
    addBeheadingLoot(e, "iceandfire:sea_serpent", "iceandfire:seaserpent_skull")
    addBeheadingLoot(e, "iceandfire:hydra", "iceandfire:hydra_skull")
    addBeheadingLoot(e, "minecraft:enderman", "supplementaries:enderman_head")
    addBeheadingLoot(e, "neapolitan:chimpanzee", "neapolitan:chimpanzee_head")
})