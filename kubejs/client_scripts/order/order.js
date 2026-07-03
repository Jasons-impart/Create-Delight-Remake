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
        let info = item?.nbt?.createdelightOrderInfo
        if (!info) return

        let entries = info.entries
        let type = info.type
        let customer = global.Order.customerProperties[type]
        let reward = customer.reward
        if (reward == null)
            reward = [`createdelight:orders/${info.type}`, 1]
        let rewardType = reward[0]
        let rewardAmount = reward[1] * entries.length

        // 标题
        text.add(Text.translate("tooltip.createdelight.order.title",
            Text.translate("tooltip.createdelight.order.customer." + type)
        ))
        text.add(Text.translate(`rarity.${customer.rarity.toLowerCase()}`).color(global.CDClientJavaClasses.$Rarity[customer.rarity.toUpperCase()].color))
        // 空行
        text.add("")

        // 需求
        text.add(Text.translate("tooltip.createdelight.order.require.title"))
        if (e.shift)
            entries.forEach(value => {
                let good = global.Order.orderProperties[value.id]
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
        text.add(Component.of("  ").append(global.MoneyUtil.convertBaseValueToString(global.Order.calculateMoneyReward(info) * customer.reward_money)))
    })

    e.addAdvanced("createdelight:unopened_order", (item, advanced, text) => {
        text.add(Text.translate("tooltip.createdelight.order_draft.use"))
        let draft = item?.nbt?.OrderDraft
        if (draft == null)
            return

        text.add("")
        text.add(Text.translate("tooltip.createdelight.order_draft.title"))
        if (draft.customerSeal != null)
            text.add(Text.translate(
                "tooltip.createdelight.order_draft.customer",
                Text.translate(`tooltip.createdelight.order_draft.seal.${draft.customerSeal}`)
            ))
        if (draft.categorySeal != null)
            text.add(Text.translate(
                "tooltip.createdelight.order_draft.category",
                Text.translate(`tooltip.createdelight.order_draft.seal.${draft.categorySeal}`)
            ))
    })

    e.addAdvanced("createdelight:order_seal", (item, advanced, text) => {
        let sealKey = item?.nbt?.OrderSeal == null ? null : `${item.nbt.OrderSeal}`
        let seal = sealKey == null ? null : global.Order.orderDraftSeals[sealKey]
        if (seal == null) {
            text.add(Text.translate("tooltip.createdelight.order_seal.empty"))
            return
        }

        text.add(Text.translate(
            "tooltip.createdelight.order_seal.name",
            Text.translate(`tooltip.createdelight.order_draft.seal.${seal.key}`)
        ))
        text.add(Text.translate("tooltip.createdelight.order_seal.use"))
        text.add(Text.translate(`tooltip.createdelight.order_seal.${seal.type}`))
    })

})
