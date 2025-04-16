/**
 * 
 * @param {Internal.LivingHurtEvent} e 
 */
global.TetraOverwhelmAttackEffect = function (e) {
    let player = e.getSource().getPlayer()
    if (!player || !player.isPlayer())
        return
    let item = player.mainHandItem
    if (item.item instanceof $ModularItem) {
        if (TetraUtil.itemHasEffect(item, "createdelight:overwhelm")) {
            let level = TetraUtil.getEffectLevel(item, "createdelight:overwhelm")
            let hp = e.getEntity().health
            e.setAmount(e.amount + hp * level / 100)
        }
    }
}