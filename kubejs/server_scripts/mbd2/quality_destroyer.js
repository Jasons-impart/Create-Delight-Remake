MBDMachineEvents.onTick("createdelight:mechanic_grinding_wheel", e => {
    let event = e.event
    const {machine} = event
    const {level, holder} = machine
    /**@type {Internal.KineticBlockEntity} */
    let be = holder
    let interval = Math.max(5, Math.floor((40 - (35 * Math.abs(be.speed) / 256)) / 5) * 5)
    if (level.time % interval != 0 || Math.abs(be.speed) == 0)
        return
    /**@type {ItemStackTransfer} */
    let input = machine.getTraitByName("item_input_slot").storage
    /**@type {ItemStackTransfer} */
    let output = machine.getTraitByName("item_output_slot").storage
    for (let index = 0; index < input.slots; index++) {
        let item = input.getStackInSlot(index)
        let quality = $QualityUtils.getQuality(item)
        let ret = ItemTransferHelper.insertItemStacked(output, item, true)
        // console.log(ret)
        if (ret.is("air")) {
            if (quality.level() > 0) {
                item.nbt.remove($QualityUtils.QUALITY_TAG)
            }
            ItemTransferHelper.insertItemStacked(output, item, false)
            input.extractItem(index, item.count, false, false)
        }
    }
})