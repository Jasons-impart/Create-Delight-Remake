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
                    .append(Text.translate("tooltip.createdelight.order.tier." + global.Order.getGoodsOrderProperty(item, type)))
                    .append(' ')
                added = true
            })
        if (added)
            text.add(comp)
    })
    e.addAdvanced("createdelight:order", (item, advanced, text) => {
        let info = item.nbt.createdelightOrderInfo
        if (!info) return

        let entries = info.entries
        let type = info.type
        let reward = global.Order.customerProperties[type].reward
        if (reward == null)
            reward = [`createdelight:orders/${info.type}`, 1]
        let rewardType = reward[0]
        let rewardAmount = reward[1] * entries.length

        // 标题
        text.add(Text.translate("tooltip.createdelight.order.title",
            Text.translate("tooltip.createdelight.order.customer." + type)
        ))

        // 空行
        text.add("")

        // 需求
        text.add(Text.translate("tooltip.createdelight.order.require.title"))
        entries.forEach(value => {
            text.add(Text.translate(
                "tooltip.createdelight.order.require.entry",
                Text.translate("tooltip.createdelight.order.entries." + value.id),
                value.count.toFixed(),
                Text.translate("tooltip.createdelight.order.tier." + value.minQuality)
            ))
        })

        text.add("")

        // 奖励
        text.add(Text.translate("tooltip.createdelight.order.reward.title"))
        text.add(Text.translate(
            "tooltip.createdelight.order.reward.entry",
            rewardAmount.toFixed(),
            Text.translate("tooltip.createdelight.order.reward." + rewardType.split(":")[1])
        ))
    })


})