/**
 * 
 * @param {Internal.LivingHurtEvent} e 
 */
global.TetraDragonRestraintEvent = function (e) {
    let player = e.getSource().getPlayer()
    if (player == null || !player.isPlayer())
        return
    let item = player.mainHandItem

    if (item.item instanceof $ModularItem) {
        ["ice", "fire", "lightning"].forEach(dragonType => {
            if (TetraUtil.itemHasEffect(item, `createdelight:${dragonType}_dragon_restraint`)) {
                let level = TetraUtil.getEffectLevel(item, `createdelight:${dragonType}_dragon_restraint`)
                if (e.entity.type == `iceandfire:${dragonType}_dragon`)
                    e.setAmount(e.amount + level)
            }
        })
    }
}