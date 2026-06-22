EntityEvents.drops(event => {
    event.drops.forEach(drop => {
        let item = drop.item
        let quality = global.CDServerJavaClasses.$QualityUtils.getQuality(item)
        if (quality.level() > 0) {
            item.nbt.remove(global.CDServerJavaClasses.$QualityUtils.QUALITY_TAG)
            if (item.nbt.empty)
                item.removeTag()
        }
    })
})