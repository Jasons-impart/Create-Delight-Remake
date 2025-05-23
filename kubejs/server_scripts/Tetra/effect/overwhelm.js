/**
 * 
 * @param {Internal.LivingHurtEvent} e 
 */
global.TetraOverwhelmAttackEffect = function (e) {
    let player = e.getSource().getPlayer()
    let entity = e.getEntity()
    if (player == null || !player.isPlayer())
        return
    let item = player.mainHandItem
    if (item.item instanceof $ModularItem) {
        if (TetraUtil.itemHasEffect(item, "createdelight:overwhelm")) {
            let level = TetraUtil.getEffectLevel(item, "createdelight:overwhelm")
            let hp = entity.health
            //TODO: 需要更多测试
            entity.attack(player.damageSources().generic(), hp * level / 100)
        }
    }
}