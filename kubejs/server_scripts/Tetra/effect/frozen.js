/**
 * 
 * @param {Internal.LivingHurtEvent} e 
 */
global.TetraFrozenAttackEffect = function(e) {
    let player = e.source.player
    if (player == null || !player.isPlayer()) return
    let item = player.mainHandItem
    if (!(item.item instanceof global.CDServerJavaClasses.$ModularItem) || !TetraUtil.itemHasEffect(item, "createdelight:frozen")) return
    let level = TetraUtil.getEffectLevel(item, "createdelight:frozen")
    global.CDServerJavaClasses.$EntityDataProvider.getCapability(e.entity).ifPresent(data => data.frozenData.setFrozen(e.entity, level * 20))
}