const $Rarity = Java.loadClass("net.minecraft.world.item.Rarity")
let Order = global.Order
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
                    .append(Text.translate("tooltip.createdelight.order.tier." + Order.getGoodsOrderProperty(item, type)))
                    .append(' ')
                added = true
            })
        if (added)
            text.add(comp)
    })
    e.addAdvanced("createdelight:order", (item, advanced, text) => {
        let info = item?.nbt?.createdelightOrderInfo
        if (!info) return

        let entries = info.entries
        let type = info.type
        let customer = Order.customerProperties[type]
        let reward = customer.reward
        if (reward == null)
            reward = [`createdelight:orders/${info.type}`, 1]
        let rewardType = reward[0]
        let rewardAmount = reward[1] * entries.length

        // 标题
        text.add(Text.translate("tooltip.createdelight.order.title",
            Text.translate("tooltip.createdelight.order.customer." + type)
        ))
        text.add(Text.translate(`rarity.${customer.rarity.toLowerCase()}`).color($Rarity[customer.rarity.toUpperCase()].color))
        // 空行
        text.add("")

        // 需求
        text.add(Text.translate("tooltip.createdelight.order.require.title"))
        if (e.shift) 
            entries.forEach(value => {
            let good = Order.orderProperties[value.id]
                text.add(Text.translate(
                    "tooltip.createdelight.order.require.entry_shift",
                    Text.translate("tooltip.createdelight.order.entries." + value.id),
                    value.count.toFixed(),
                    Text.translate("tooltip.createdelight.order.tier." + value.minQuality),
                    Text.of(good.base_count.toFixed()).gray(),
                    Text.of((value.count / good.base_count).toFixed(2)).gray()
                ))
            })
        else
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
        text.add(Component.of("  ").append(MoneyUtil.convertBaseValueToString(Order.calculateMoneyReward(info) * customer.reward_money)))
    })


})