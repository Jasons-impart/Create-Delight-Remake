const LIFE_MATTER_EXTRACTOR_INTERVAL = 200
const LIFE_MATTER_EXTRACTOR_MAX_BATCH = 8

MBDMachineEvents.onTick("createdelight:life_matter_extractor", e => {
    const {machine} = e.event
    if (machine.level.time % LIFE_MATTER_EXTRACTOR_INTERVAL != 0)
        return

    let input = machine.getTraitByName("item_input_slot").storage
    let output = machine.getTraitByName("item_output_slot").storage

    for (let index = 0; index < input.slots; index++) {
        let item = input.getStackInSlot(index)
        if (item.empty)
            continue

        let quality = global.CDServerJavaClasses.$QualityUtils.getQuality(item)
        if (quality.level() <= 0)
            continue

        let amount = getLifeMatterExtractorValue(quality.level())
        let batchSize = Math.min(item.count, LIFE_MATTER_EXTRACTOR_MAX_BATCH, Math.floor(64 / amount))
        if (batchSize <= 0)
            continue

        let lifeMatter = Item.of("createdelight:life_matter", amount * batchSize)
        let remainder = ItemTransferHelper.insertItemStacked(output, lifeMatter, true)
        if (!remainder.empty)
            continue

        let extracted = input.extractItem(index, batchSize, true, false)
        if (extracted.empty || extracted.count < batchSize)
            continue

        input.extractItem(index, batchSize, false, false)
        ItemTransferHelper.insertItemStacked(output, lifeMatter, false)
        return
    }
})

function getLifeMatterExtractorValue(qualityLevel) {
    switch (qualityLevel) {
        case 1:
            return 1
        case 2:
            return 3
        case 3:
            return 6
        default:
            return 0
    }
}
