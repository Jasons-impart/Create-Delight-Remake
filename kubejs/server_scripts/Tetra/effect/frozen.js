const $EntityDataProvider = Java.loadClass("com.github.alexthe666.iceandfire.entity.props.EntityDataProvider")

/**
 * 
 * @param {Internal.LivingHurtEvent} e 
 */
global.TetraFrozenAttackEffect = function(e) {
    let player = e.source.player
    if (!player.isLiving() || !player.isPlayer()) return
    let item = TetraUtil.getItem(player.mainHandItem)
    if (item == null || !TetraUtil.itemHasEffect(item, "createdelight:frozen")) return
    let level = TetraUtil.getEffectLevel(item, "createdelight:frozen")
    $EntityDataProvider.getCapability(e.entity).ifPresent(data => data.frozenData.setFrozen(e.entity, level * 20))
    
}