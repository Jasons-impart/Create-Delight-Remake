ItemEvents.tooltip(e => {
    e.addAdvancedToAll((item, advanced, text) => {
        /**@type {Internal.Stream<Internal.TagKey<Internal.Item>>} */
        let tags = item.getTags()
        if (tags == null)
            return
        if (item.hasNBT() && item.nbt.contains("quality_food")) {
            if (tags.anyMatch(tag => tag.location().toString().startsWith("eclipticseasons")))
                text.add(Text.translate("tooltip.createdelight.quality_crop_grow"))
            if (item.edible)
                text.add(Text.translate("tooltip.createdelight.quality_food_eaten"))
            text.add(Text.translate("tooltip.createdelight.quality_sell"))
        }
    })
})