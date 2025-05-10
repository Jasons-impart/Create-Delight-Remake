/**
 * 
 * @param {Internal.LivingHurtEvent} e 
 */
global.TetraLifeDrainEffect = function (e) {
    let player = e.getSource().getPlayer()
    if (player == null || !player.isPlayer())
        return
    let item = player.mainHandItem

    if (item.item instanceof $ModularItem) {
        if (TetraUtil.itemHasEffect(item, "createdelight:life_drain")) {
            let level = TetraUtil.getEffectLevel(item, "createdelight:life_drain")
                player.heal(level / 100 * e.amount)
        }
    }
}