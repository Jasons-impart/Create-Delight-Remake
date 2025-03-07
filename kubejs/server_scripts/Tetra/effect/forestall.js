
PlayerEvents.tick(e => {
    const { player } = e


    let item = player.mainHandItem
    if (TetraUtil.getItem(item))
        return
    if (!TetraUtil.itemHasEffect(item, "createdelight:forstall"))
        return
    let efficiency = TetraUtil.getEffectEfficiency(item, "createdelight:forstall")
    let name = "tetra_effect_forstall_countdown"
    let count = player.persistentData.get(name)
    if (count == null)
        player.persistentData.putInt(name, efficiency * 20)
    else if (count > 0) {
        if (count == 20) {
            player.level.playSound(player, player.pos, "minecraft:block.chain.place", "players", 100, 1)
        }
        player.persistentData.putInt(name, --count)
    }
})
/**
 * 
 * @param {Internal.LivingHurtEvent} e 
 */
global.TetraForstallAttackEffect = function (e) {
    let player = e.getSource().getPlayer()
    if (!player || !player.isPlayer())
        return
    let item = player.mainHandItem

    // console.log(item.getItem().getClass())
    if (item.item instanceof $ModularItem) {
        if (TetraUtil.itemHasEffect(item, "createdelight:forstall")) {
            let efficiency = TetraUtil.getEffectEfficiency(item, "createdelight:forstall")
            let level = TetraUtil.getEffectLevel(item, "createdelight:forstall")
            let count = player.persistentData.get("tetra_effect_forstall_countdown")
            if (count == 0) {
                e.setAmount(e.amount * level)
            }
            player.persistentData.putInt("tetra_effect_forstall_countdown", efficiency * 20)
        }
    }
}