EntityEvents.drops(e => {
    const {entity, source} = e
    /**
     * @type {Internal.List<Special.EntityType>}
     */
    let list = Utils.newList()
    list.addAll([
        "minecraft:villager"
    ])
    if (!list.contains(entity.type))
        return
    let player = source.player
    if (player == null || !player.isPlayer())
        return

    let mainhandItem = player.getMainHandItem()
    let item = TetraUtil.getItem(mainhandItem)
    if (!(item instanceof $ModularItem) || !TetraUtil.itemHasEffect(mainhandItem, "createdelight:fiber_proliferation"))
        return
    let level = TetraUtil.getEffectLevel(mainhandItem, "createdelight:fiber_proliferation")
    let effciency = TetraUtil.getEffectEfficiency(mainhandItem, "createdelight:fiber_proliferation")
    e.addDrop(`${effciency}x art_of_forging:life_fiber`, level / 100)
})