ItemEvents.rightClicked("createdelight:quality_absorber", e => {
    const {player} = e
    if (player == null || !player.isPlayer())
        return

    let items = player.getCapability(ForgeCapabilities.ITEM_HANDLER).orElse(null)
    let amount = 0
    items.allItems.forEach(item => {
        let quality = global.CDServerJavaClasses.$QualityUtils.getQuality(item)
        if (quality.level() > 0) {
            amount += getLifeMatterExtractionValue(quality.level()) * item.count
            item.nbt.remove(global.CDServerJavaClasses.$QualityUtils.QUALITY_TAG)
            if (item.nbt.empty)
                item.removeTag()
        }
    })

    if (amount == 0)
        return

    player.give(Item.of("createdelight:life_matter", amount))
    player.tell(Component.of(`将物品栏中的所有品质物品提取为 ${amount} 个生命质。`))
})

function getLifeMatterExtractionValue(qualityLevel) {
    switch (qualityLevel) {
        case 1:
            return 1
        case 2:
            return 3
        case 3:
            return 8
        default:
            return 0
    }
}
