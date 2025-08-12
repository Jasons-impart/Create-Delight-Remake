ItemEvents.tooltip(e => {
    e.addAdvancedToAll((item, advanced, text) => {
        let comp = Component.empty()
        let added = false
        /**@type {Internal.Stream<Internal.TagKey<Internal.Item>>} */
        let tags = item.getTags()
        tags.filter(tag => tag.location().toString().startsWith("createdelight:order"))
            .forEach(tag => {
                let type = tag.location().path.split("/")[1]
                comp.append(Text.translate("tooltip.createdelight.order.entries." + type))
                .append('-')
                .append(Text.translate("tooltip.createdelight.order.tier." + global.Order.getFoodOrderProperty(item, type)))
                .append(' ')
                added = true
            })
        if (added)
            text.add(comp)

    })
})