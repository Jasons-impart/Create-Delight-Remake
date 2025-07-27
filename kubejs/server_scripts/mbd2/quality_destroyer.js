MBDMachineEvents.onTick("createdelight:quality_destroyer", e => {
    let event = e.event
    const {machine} = event
    const {level} = machine
    if (level.time % 100 != 0)
        return
    let items = machine.getCapability(ForgeCapabilities.ITEM_HANDLER).orElse(null)
    items.allItems.forEach(item => {
        let quality = $QualityUtils.getQuality(item)
        if (quality.level() > 0) {
            item.nbt.remove($QualityUtils.QUALITY_TAG)
        }
    })
})