const ORDER_MARKET_SYNC_PACKET = "createdelight_order_market_saturation"

global.CDOrderMarketSaturation = {
    data: null,
    day: 0
}

NetworkEvents.dataReceived(ORDER_MARKET_SYNC_PACKET, e => {
    let raw = e.data.get("data").getAsString()

    try {
        global.CDOrderMarketSaturation.data = raw.length == 0 ? null : JSON.parse(raw)
    } catch (error) {
        global.CDOrderMarketSaturation.data = null
    }
    global.CDOrderMarketSaturation.day = e.data.get("day").getAsInt()
})

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

function getOrderClientValue(container, key) {
    if (container == null || key == null)
        return null

    try {
        if (container.containsKey != null && container.containsKey(key))
            return container.get(key)
    } catch (ignored) {
    }
    try {
        if (container.contains != null && container.contains(key))
            return container.get(key)
    } catch (ignored) {
    }
    try {
        let value = container[key]
        return value == null ? null : value
    } catch (ignored) {
        return null
    }
}

function getClientOrderReputationLevel() {
    let status = global.CDOrderSupplyStatus
    if (status == null || Client.player == null)
        return null
    let playerId = getOrderClientValue(status, "playerId")
    if (playerId != null && `${Client.player.uuid}` != `${playerId}`)
        return null
    let level = Number(getOrderClientValue(status, "reputationLevel"))
    return isFinite(level) ? Math.max(1, level) : null
}

function getNextOrderMachinePermitLevel(level) {
    let nextLevel = null
    global.Order.reputation.machinePermits.forEach(permit => {
        if (permit.level > level && (nextLevel == null || permit.level < nextLevel))
            nextLevel = permit.level
    })
    return nextLevel
}

function getClientOrderMarketModifier(order) {
    global.Order.ensureDataLoaded()
    if (global.CDOrderMarketSaturation.data == null)
        return null
    if (order == null || order.entries == null || order.entries.length == 0)
        return { multiplier: 1, bonus: 0, consumedBonus: 0, rawConsumption: 0, saturated: false, categoryPressure: 0, customerPressure: 0 }

    let config = global.Order.marketSaturationConfig
    let categoryPenaltyValue = Number(config.categoryPenalty)
    let customerPenaltyValue = Number(config.customerPenalty)
    let maxBonusValue = Number(config.maxBonus)
    let data = global.Order.marketSaturation.decay(
        JSON.parse(JSON.stringify(global.CDOrderMarketSaturation.data)),
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
    let rawConsumption = categoryPressure * categoryPenaltyValue + customerPressure * customerPenaltyValue
    let consumedBonus = Math.min(maxBonusValue, Math.max(0, rawConsumption))
    let availableBonus = Math.max(0, maxBonusValue - consumedBonus)
    let result = {
        multiplier: 1 + availableBonus,
        bonus: availableBonus,
        consumedBonus: consumedBonus,
        rawConsumption: rawConsumption,
        saturated: rawConsumption >= maxBonusValue - 0.0001,
        categoryPressure: categoryPressure,
        customerPressure: customerPressure
    }
    return global.Order.marketSaturation.applyPolicy(order, result)
}

ItemEvents.tooltip(e => {
    global.Order.ensureDataLoaded()
    e.addAdvanced("lightmanscurrency:ticket", (item, advanced, text) => {
        let ticketColor = Number(item?.nbt?.TicketColor)
        let ticketId = Number(item?.nbt?.TicketID)
        if (ticketColor != global.Order.guildVoucherColor || ticketId != -10)
            return
        text.add(Text.translate("item.createdelight.name.guild_voucher").gold())
        text.add(Text.translate("tooltip.createdelight.order.guild_voucher").gray())
    })
    e.addAdvancedToAll((item, advanced, text) => {
        let comp = Component.empty()
        let added = false
        /**@type {Internal.Stream<Internal.TagKey<Internal.Item>>} */
        let tags = item.getTags()
        tags.filter(tag => tag.location().toString().startsWith("createdelight:order"))
            .forEach(tag => {
                let type = tag.location().path.split("/")[1]
                if (type == null || getOrderClientValue(global.Order.orderProperties, type) == null)
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

        let entries = global.Order.toObjectArray(info.entries)
        let type = info.type
        let customer = getOrderClientValue(global.Order.customerProperties, type)
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
                let good = getOrderClientValue(global.Order.orderProperties, value.id)
                text.add(Text.translate(
                    "tooltip.createdelight.order.require.entry_shift",
                    Text.translate("tooltip.createdelight.order.entries." + value.id),
                    formatOrderNumber(value.count),
                    Text.translate("tooltip.createdelight.order.tier." + value.minQuality),
                    Text.of(formatOrderNumber(good == null ? 0 : good.base_count)).gray(),
                    Text.of(formatOrderNumber(Number(value.count) / Math.max(1, Number(good == null ? 1 : good.base_count)), 2)).gray(),
                    Text.of(((Math.max(0.1, Number(good == null ? 1 : good.reward_weight) || 1)) * 100).toFixed(0)).gray()
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
        if (e.shift) {
            let grade = Math.max(1, Math.min(6, Number(info.orderGrade) || 1))
            let gradeBaseMoney = Math.max(0, Number(global.Order.gradeProfiles[grade].baseMoney) || 0)
            text.add(Text.translate(
                "tooltip.createdelight.order.money.grade_base",
                global.MoneyUtil.convertBaseValueToString(gradeBaseMoney)
            ).darkGray())
        }
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
        let timeModifier = global.Order.getTimeRewardModifier(info, Client.level)
        if (info.acceptedGameTime != null) {
            if (timeModifier.remainingTicks > 0)
                text.add(Text.translate(
                    "tooltip.createdelight.order.money.time_bonus",
                    (timeModifier.multiplier * 100).toFixed(0),
                    (timeModifier.remainingTicks / 24000).toFixed(1)
                ).gray())
            else
                text.add(Text.translate("tooltip.createdelight.order.money.time_bonus_expired").darkGray())
        }
        let generationSpec = getOrderClientValue(info, "generationSpec")
        let marketFloor = generationSpec == null ? NaN : Number(getOrderClientValue(generationSpec, "marketMultiplierFloor"))
        if (isFinite(marketFloor) && marketFloor > 1) {
            let marketGapCategoryValue = generationSpec == null ? null : getOrderClientValue(generationSpec, "marketGapCategory")
            let marketGapCategory = marketGapCategoryValue == null ? null : `${marketGapCategoryValue}`
            if (marketGapCategory != null && marketGapCategory.length > 0) {
                text.add(Text.translate(
                    "tooltip.createdelight.order.money.market_gap",
                    Text.translate(`tooltip.createdelight.order.entries.${marketGapCategory}`),
                    (marketFloor * 100).toFixed(0)
                ).gold())
            } else {
                text.add(Text.translate(
                    "tooltip.createdelight.order.money.market_floor",
                    (marketFloor * 100).toFixed(0)
                ).gold())
            }
        }
        if (marketModifier == null) {
            text.add(Text.translate("tooltip.createdelight.order.market_saturation.delivery_time").gray())
        } else {
            let currentMoney = baseMoney * marketModifier.multiplier * timeModifier.multiplier
            text.add(Text.translate(
                "tooltip.createdelight.order.money.current_market",
                global.MoneyUtil.convertBaseValueToString(currentMoney),
                (marketModifier.multiplier * 100).toFixed(0)
            ).gray())
            if (marketModifier.saturated) {
                text.add(Text.translate(
                    "tooltip.createdelight.order.money.market_capped",
                    (marketModifier.rawConsumption * 100).toFixed(0)
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
        let draftGrade = Math.max(0, Math.floor(Number(draft.Grade) || 0))
        if (draftGrade > 0)
            text.add(Text.translate("tooltip.createdelight.order_draft.grade", `${draftGrade}`))
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
        let requiredCategories = global.Order.toArray(getOrderClientValue(draft, "requiredCategories")).map(value => `${value}`)
        let requiredCategory = getOrderClientValue(draft, "requiredCategory")
        if (requiredCategory != null && requiredCategories.indexOf(`${requiredCategory}`) < 0)
            requiredCategories.push(`${requiredCategory}`)
        requiredCategories.forEach(category => {
            text.add(Text.translate(
                "tooltip.createdelight.order_draft.required_category",
                Text.translate(`tooltip.createdelight.order.entries.${category}`)
            ).gold())
        })
        let boardKind = getOrderClientValue(draft, "BoardKind")
        if (`${boardKind}` == "adapted" && requiredCategories.length > 0)
            text.add(Text.translate("tooltip.createdelight.order_draft.adapted_fixed").green())
        let boardMarketMultiplier = Number(getOrderClientValue(draft, "BoardMarketMultiplier"))
        if (`${boardKind}` == "opportunity" && isFinite(boardMarketMultiplier) && boardMarketMultiplier > 1)
            text.add(Text.translate(
                "tooltip.createdelight.order_draft.market_floor",
                (boardMarketMultiplier * 100).toFixed(0)
            ).gold())
        let clauses = global.Order.toArray(getOrderClientValue(draft, "Clauses"))
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
        let returnReasonValue = item.nbt == null ? null : getOrderClientValue(item.nbt, "ClauseReturnReason")
        let returnReason = returnReasonValue == null ? null : `${returnReasonValue}`
        if (returnReason != null)
            text.add(Text.translate("tooltip.createdelight.order_clause.return_reason",
                Text.translate(`tooltip.createdelight.order_clause.return_reason.${returnReason}`)
            ).darkGreen())
        else if (clauseKey != "newcomer")
            text.add(Text.translate("tooltip.createdelight.order_clause.return_source").darkGreen())
        text.add(Text.translate("tooltip.createdelight.order_clause.use").darkGray())
    })

    e.addAdvanced("createdelight:order_reputation_certificate", (item, advanced, text) => {
        let hasLevel = item.nbt != null && item.nbt.contains("OrderReputationLevel")
        let level = hasLevel ? Math.max(0, item.nbt.getInt("OrderReputationLevel")) : 0
        let hasPermits = item.nbt != null && item.nbt.contains("OrderMachinePermits")
        let permits = hasPermits ? item.nbt.getCompound("OrderMachinePermits") : null
        let hasOwner = item.nbt != null && item.nbt.contains("OrderCertificateOwner")
        if (permits != null && !hasLevel && !hasOwner) {
            text.add(Text.translate("tooltip.createdelight.order_reputation_certificate.required_permits").gray())
            global.Order.reputation.machinePermits.forEach(permit => {
                if (permits.getBoolean(permit.key))
                    text.add(Text.translate(
                        "tooltip.createdelight.order_reputation_certificate.permit",
                        Text.translate(permit.nameKey)
                    ).green())
            })
            text.add(Text.translate("tooltip.createdelight.order_reputation_certificate.keep").gray())
            return
        }
        let reputationLevel = getClientOrderReputationLevel()
        text.add(Text.translate("tooltip.createdelight.order_reputation_certificate.level", `${level}`).gold())
        if (reputationLevel == null) {
            text.add(Text.translate("tooltip.createdelight.order_reputation_certificate.status_waiting").darkGray())
        } else {
            text.add(Text.translate(
                "tooltip.createdelight.order_reputation_certificate.actual_level",
                `${Math.max(0, Math.floor(Number(reputationLevel) || 0))}`
            ).aqua())
            if (reputationLevel > level)
                text.add(Text.translate("tooltip.createdelight.order_reputation_certificate.refresh_needed").yellow())
        }
        if (level < 2 || permits == null) {
            text.add(Text.translate("tooltip.createdelight.order_reputation_certificate.unverified").red())
        } else {
            text.add(Text.translate("tooltip.createdelight.order_reputation_certificate.permits").gray())
            global.Order.reputation.machinePermits.forEach(permit => {
                if (permits.getBoolean(permit.key))
                    text.add(Text.translate(
                        "tooltip.createdelight.order_reputation_certificate.permit",
                        Text.translate(permit.nameKey)
                    ).green())
            })
        }
        if (reputationLevel != null) {
            let nextLevel = getNextOrderMachinePermitLevel(reputationLevel)
            if (nextLevel == null) {
                text.add(Text.translate("tooltip.createdelight.order_reputation_certificate.all_unlocked").green())
            } else {
                text.add(Text.translate(
                    "tooltip.createdelight.order_reputation_certificate.next_level",
                    `${nextLevel}`
                ).aqua())
                global.Order.reputation.machinePermits.forEach(permit => {
                    if (permit.level == nextLevel)
                        text.add(Text.translate(
                            "tooltip.createdelight.order_reputation_certificate.next_permit",
                            Text.translate(permit.nameKey)
                        ).gray())
                })
            }
            if (reputationLevel == 4)
                text.add(Text.translate("tooltip.createdelight.order_reputation_certificate.level4_guide").yellow())
        }
        text.add(Text.translate("tooltip.createdelight.order_reputation_certificate.keep").gray())
        text.add(Text.translate("tooltip.createdelight.order_reputation_certificate.refresh").darkGray())
    })

    global.Order.reputation.machinePermits.forEach(permit => {
        e.addAdvanced(permit.item, (item, advanced, text) => {
            text.add(Text.translate(permit.roleKey).gray())
            let reputationLevel = getClientOrderReputationLevel()
            if (reputationLevel == null) {
                text.add(Text.translate(
                    "tooltip.createdelight.order_machine_certificate.required",
                    `${permit.level}`
                ).gold())
                text.add(Text.translate("tooltip.createdelight.order_machine_certificate.status_waiting").darkGray())
            } else {
                let statusLine = Text.translate(
                    "tooltip.createdelight.order_machine_certificate.status",
                    `${Math.max(0, Math.floor(Number(reputationLevel) || 0))}`,
                    `${permit.level}`
                )
                if (reputationLevel >= permit.level) {
                    text.add(statusLine.green())
                    text.add(Text.translate("tooltip.createdelight.order_machine_certificate.unlocked").green())
                } else {
                    text.add(statusLine.red())
                    text.add(Text.translate("tooltip.createdelight.order_machine_certificate.locked").red())
                }
            }
            let guideKey = getOrderClientValue(permit, "guideKey")
            if (guideKey != null)
                text.add(Text.translate(guideKey).yellow())
            text.add(Text.translate("tooltip.createdelight.order_machine_certificate.borrow").gray())
            text.add(Text.translate("tooltip.createdelight.order_machine_certificate.kept").darkGray())
        })
    })

})
