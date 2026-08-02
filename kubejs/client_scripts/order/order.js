const ORDER_MARKET_SYNC_PACKET = "createdelight_order_market_saturation"

global.CDOrderMarketSaturation = {
    data: null,
    day: 0
}

NetworkEvents.dataReceived(ORDER_MARKET_SYNC_PACKET, e => {
    let raw = e.data.data
    let day = e.data.day
    if (raw == null && e.data.get != null) {
        raw = e.data.get("data").getAsString()
        day = e.data.get("day").getAsInt()
    }

    try {
        let parsed = raw == null || `${raw}`.length == 0 ? null : JSON.parse(`${raw}`)
        if (typeof parsed == "string" && parsed.length > 0)
            parsed = JSON.parse(parsed)
        global.CDOrderMarketSaturation.data = parsed
    } catch (error) {
        global.CDOrderMarketSaturation.data = null
    }
    global.CDOrderMarketSaturation.day = day == null ? 0 : Number(day)
})

function cloneOrderMarketData(data) {
    if (data == null)
        return null
    return JSON.parse(JSON.stringify(data))
}

function getOrderMarketNumber(value, fallback) {
    let number = Number(value)
    return isFinite(number) ? number : fallback
}

function formatOrderNumber(value, digits) {
    let number = Number(value)
    if (!isFinite(number))
        number = 0
    return number.toFixed(digits == null ? 0 : digits)
}

function getClientOrderMarketModifier(order) {
    if (global.Order == null || global.Order.marketSaturation == null)
        return null
    global.Order.ensureDataLoaded()
    if (global.CDOrderMarketSaturation == null || global.CDOrderMarketSaturation.data == null)
        return null
    if (order == null || order.entries == null || order.entries.length == 0)
        return { multiplier: 1, penalty: 0, categoryPressure: 0, customerPressure: 0 }

    let config = global.Order.marketSaturationConfig || {}
    let categoryPenaltyValue = getOrderMarketNumber(config.categoryPenalty, 0.08)
    let customerPenaltyValue = getOrderMarketNumber(config.customerPenalty, 0.05)
    let maxPenaltyValue = getOrderMarketNumber(config.maxPenalty, 0.35)
    let data = global.Order.marketSaturation.decay(
        cloneOrderMarketData(global.CDOrderMarketSaturation.data),
        global.CDOrderMarketSaturation.day
    )
    data.categories = data.categories || {}
    data.customers = data.customers || {}

    let categoryPressure = 0
    order.entries.forEach(entry => {
        categoryPressure += getOrderMarketNumber(data.categories[entry.id], 0)
    })
    categoryPressure /= Math.max(1, order.entries.length)

    let customerPressure = getOrderMarketNumber(data.customers[order.type], 0)
    let pressure = categoryPressure * categoryPenaltyValue + customerPressure * customerPenaltyValue
    let penalty = Math.min(maxPenaltyValue, pressure)
    if (!isFinite(penalty))
        return null

    return {
        multiplier: 1 - penalty,
        penalty: penalty,
        rawPenalty: pressure,
        capped: pressure > penalty + 0.0001,
        categoryPressure: categoryPressure,
        customerPressure: customerPressure
    }
}

ItemEvents.tooltip(e => {
    global.Order.ensureDataLoaded()
    e.addAdvancedToAll((item, advanced, text) => {
        let comp = Component.empty()
        let added = false
        /**@type {Internal.Stream<Internal.TagKey<Internal.Item>>} */
        let tags = item.getTags()
        tags.filter(tag => tag.location().toString().startsWith("createdelight:order"))
            .forEach(tag => {
                let type = tag.location().path.split("/")[1]
                if (type == null || global.Order.orderProperties[type] == null)
                    return
                let quality = global.Order.getGoodsOrderProperty(item, type)
                if (quality == null || !isFinite(Number(quality)))
                    return
                comp.append(Text.translate("tooltip.createdelight.order.entries." + type))
                    .append('-')
                    .append(Text.translate("tooltip.createdelight.order.tier." + Number(quality)))
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
        let giftMultiplier = info.rewardMultipliers != null && info.rewardMultipliers.gifts != null
            ? Math.max(0, Number(info.rewardMultipliers.gifts))
            : 1
        let rewardAmount = Math.max(0, Math.round(reward[1] * entries.length * giftMultiplier))

        // 标题
        text.add(Text.translate("tooltip.createdelight.order.title",
            Text.translate("tooltip.createdelight.order.customer." + type)
        ))
        let grade = Number(info.orderGrade || info.generationSpec?.orderGrade || 1)
        text.add(Text.translate(
            "tooltip.createdelight.order.grade",
            grade,
            Text.translate(`tooltip.createdelight.order.grade.${grade}`)
        ).gold())
        text.add(Text.translate(`rarity.${customer.rarity.toLowerCase()}`).color(global.CDClientJavaClasses.$Rarity[customer.rarity.toUpperCase()].color))

        let modifiers = global.Order.toArray(info.modifiers == null ? info.generationSpec?.modifiers : info.modifiers)
        if (modifiers.length > 0) {
            text.add(Text.translate("tooltip.createdelight.order.modifiers.title"))
            modifiers.forEach(value => {
                text.add(Text.translate(
                    "tooltip.createdelight.order.modifiers.entry",
                    Text.translate(`tooltip.createdelight.order_clause.${value}.name`)
                ).gray())
            })
        }
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
                    formatOrderNumber(value.count),
                    Text.translate("tooltip.createdelight.order.tier." + value.minQuality),
                    Text.of(formatOrderNumber(good == null ? 0 : good.base_count)).gray(),
                    Text.of(formatOrderNumber(Number(value.count) / Math.max(1, Number(good == null ? 1 : good.base_count)), 2)).gray()
                ))
            })
        else
            entries.forEach(value => {
                text.add(Text.translate(
                    "tooltip.createdelight.order.require.entry",
                    Text.translate("tooltip.createdelight.order.entries." + value.id),
                    formatOrderNumber(value.count),
                    Text.translate("tooltip.createdelight.order.tier." + value.minQuality)
                ))
            })

        text.add("")

        // 奖励
        text.add(Text.translate("tooltip.createdelight.order.reward.title"))
        text.add(Text.translate(
            "tooltip.createdelight.order.reward.entry",
            formatOrderNumber(rewardAmount),
            Text.translate("tooltip.createdelight.order.reward." + rewardType.split(":")[1])
        ))
        let baseMoney = global.Order.calculateMoneyReward(info) * customer.reward_money
        text.add(Text.translate(
            "tooltip.createdelight.order.money.base",
            global.MoneyUtil.convertBaseValueToString(baseMoney)
        ))
        let reputationMultiplier = info.rewardMultipliers != null && info.rewardMultipliers.reputation != null
            ? Number(info.rewardMultipliers.reputation)
            : 1
        if (Math.abs(reputationMultiplier - 1) > 0.001)
            text.add(Text.translate(
                "tooltip.createdelight.order.reputation_multiplier",
                (reputationMultiplier * 100).toFixed(0)
            ).gray())
        if (Math.abs(giftMultiplier - 1) > 0.001)
            text.add(Text.translate(
                "tooltip.createdelight.order.gift_multiplier",
                (giftMultiplier * 100).toFixed(0)
            ).gray())

        let marketModifier = getClientOrderMarketModifier(info)
        if (marketModifier == null) {
            text.add(Text.translate("tooltip.createdelight.order.market_saturation.delivery_time").gray())
        } else {
            let currentMoney = baseMoney * marketModifier.multiplier
            text.add(Text.translate(
                "tooltip.createdelight.order.money.current_market",
                global.MoneyUtil.convertBaseValueToString(currentMoney),
                (marketModifier.multiplier * 100).toFixed(0)
            ).gray())
            if (marketModifier.capped) {
                text.add(Text.translate(
                    "tooltip.createdelight.order.money.market_capped",
                    (marketModifier.rawPenalty * 100).toFixed(0)
                ).darkGray())
                text.add(Text.translate("tooltip.createdelight.order.money.cross_recovery").darkGray())
            }
            text.add(Text.translate("tooltip.createdelight.order.money.viewer_estimate").darkGray())
        }
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
        let clauses = global.Order.toArray(draft.Clauses)
        clauses.forEach(value => {
            text.add(Text.translate(
                "tooltip.createdelight.order_draft.clause",
                Text.translate(`tooltip.createdelight.order_clause.${value}.name`)
            ))
        })
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

    e.addAdvanced("createdelight:order_clause", (item, advanced, text) => {
        let clauseKey = global.Order.getClauseKey(item)
        let clause = global.Order.getClause(clauseKey)
        if (clause == null) {
            text.add(Text.translate("tooltip.createdelight.order_clause.empty"))
            return
        }

        text.add(Text.translate(`tooltip.createdelight.order_clause.${clauseKey}.name`).gold())
        text.add(Text.translate(`tooltip.createdelight.order_clause.${clauseKey}.effect`))
        text.add(Text.translate("tooltip.createdelight.order_clause.category",
            Text.translate(`tooltip.createdelight.order_clause.category.${clause.category}`)
        ).gray())
        if (clause.minGrade != null)
            text.add(Text.translate("tooltip.createdelight.order_clause.min_grade", clause.minGrade).darkGray())
        if (clause.maxGrade != null)
            text.add(Text.translate("tooltip.createdelight.order_clause.max_grade", clause.maxGrade).darkGray())
        text.add(Text.translate("tooltip.createdelight.order_clause.use").darkGray())
    })

})
