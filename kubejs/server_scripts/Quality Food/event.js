EntityEvents.drops(event => {
    event.drops.forEach(drop => {
        let item = drop.item
        let quality = $QualityUtils.getQuality(item)
        if (quality.level() > 0) {
            item.nbt.remove($QualityUtils.QUALITY_TAG)
            if (item.nbt.empty)
                item.removeTag()
        }
    })
})