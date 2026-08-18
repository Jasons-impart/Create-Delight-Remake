
function getOrderMarketModifier(level, orderInfo) {
    global.Order.ensureDataLoaded()
    let player = global.Order.reputation.getPlayer(level, orderInfo)
    let result = global.Order.marketSaturation.getModifier(player, orderInfo)
    return result
}

function stochasticRoundOrderReward(value) {
    let safeValue = Math.max(0, Number(value) || 0)
    let whole = Math.floor(safeValue)
    let fraction = safeValue - whole
    return whole + (fraction > 0 && Utils.random.nextFloat() < fraction ? 1 : 0)
}

function getOrderGiftRolls(orderInfo, qualityScore, customerRewardCount) {
    let grade = Math.max(1, Math.min(6, Number(orderInfo.orderGrade) || 1))
    let entries = orderInfo.entries == null ? [] : orderInfo.entries
    let baseBudget = [0, 1, 1, 2, 2, 3, 3][grade]

    // 品质和多样性只提供一次额外回礼机会，避免再次按 Score x 条目数线性膨胀。
    let qualityChance = Math.max(0, Number(qualityScore) - 1) * 0.35
    let diversityChance = Math.max(0, entries.length - 1) * 0.05
    let extraChance = Math.min(0.8, qualityChance + diversityChance)
    if (Utils.random.nextFloat() < extraChance)
        baseBudget++

    let giftMultiplier = orderInfo.rewardMultipliers != null && orderInfo.rewardMultipliers.gifts != null
        ? Math.max(0, Number(orderInfo.rewardMultipliers.gifts))
        : 1
    let customerScale = Math.max(0, Number(customerRewardCount) || 0)
    return Math.min(4, stochasticRoundOrderReward(baseBudget * customerScale * giftMultiplier))
}

function getOrderUsedClauseMap(orderInfo) {
    let result = {}
    if (orderInfo == null)
        return result
    let modifiers = orderInfo.modifiers == null && orderInfo.generationSpec != null
        ? orderInfo.generationSpec.modifiers
        : orderInfo.modifiers
    global.Order.toArray(modifiers).forEach(value => result[`${value}`] = true)
    return result
}

function addOrderClauseCandidate(pool, key, weight, grade, usedClauses) {
    let safeWeight = Math.max(0, Number(weight) || 0)
    if (safeWeight <= 0 || usedClauses[key])
        return
    let clause = global.Order.getClause(key)
    if (clause == null || key == "newcomer")
        return
    if (clause.minGrade != null && grade < clause.minGrade)
        return
    if (clause.maxGrade != null && grade > clause.maxGrade)
        return

    for (let i = 0; i < pool.length; i++) {
        if (pool[i].key == key) {
            pool[i].weight += safeWeight
            return
        }
    }
    pool.push({ key: key, weight: safeWeight })
}

function getOrderClauseRewardPool(orderInfo, qualityScore, marketModifier) {
    let grade = Math.max(1, Math.min(6, Number(orderInfo.orderGrade) || 1))
    let usedClauses = getOrderUsedClauseMap(orderInfo)
    let entries = orderInfo.entries == null ? [] : orderInfo.entries
    let totalCount = 0
    let totalMinQuality = 0
    entries.forEach(entry => {
        totalCount += Math.max(0, Number(entry.count) || 0)
        totalMinQuality += Math.max(1, Number(entry.minQuality) || 1)
    })
    let averageMinQuality = entries.length == 0 ? 1 : totalMinQuality / entries.length
    let gradeProfile = global.Order.gradeProfiles[grade] || global.Order.gradeProfiles[1]
    let maxTotal = Math.max(1, Number(gradeProfile.maxTotal) || 1)
    let pool = []

    addOrderClauseCandidate(pool, "small_trial", 1.0, grade, usedClauses)
    addOrderClauseCandidate(pool, "lenient_acceptance", 0.8, grade, usedClauses)
    addOrderClauseCandidate(pool, "specialty_supply", 1.2, grade, usedClauses)
    addOrderClauseCandidate(pool, "banquet_assortment", 1.2, grade, usedClauses)
    addOrderClauseCandidate(pool, "small_premium", 1.0, grade, usedClauses)
    addOrderClauseCandidate(pool, "bulk_purchase", 0.9, grade, usedClauses)
    addOrderClauseCandidate(pool, "quality_inspection", 0.9, grade, usedClauses)
    addOrderClauseCandidate(pool, "reputation_priority", 0.75, grade, usedClauses)
    addOrderClauseCandidate(pool, "cash_settlement", 0.75, grade, usedClauses)
    if (entries.length <= 1) {
        addOrderClauseCandidate(pool, "small_trial", 2.0, grade, usedClauses)
        addOrderClauseCandidate(pool, "specialty_supply", 3.0, grade, usedClauses)
    }
    if (entries.length >= 3)
        addOrderClauseCandidate(pool, "banquet_assortment", 3.0, grade, usedClauses)
    if (totalCount >= maxTotal * 0.7)
        addOrderClauseCandidate(pool, "bulk_purchase", 2.0, grade, usedClauses)
    if (totalCount <= maxTotal * 0.4) {
        addOrderClauseCandidate(pool, "small_trial", 1.0, grade, usedClauses)
        addOrderClauseCandidate(pool, "small_premium", 1.5, grade, usedClauses)
    }
    if (averageMinQuality >= 2 || Number(qualityScore) >= 1.75) {
        addOrderClauseCandidate(pool, "small_premium", 2.0, grade, usedClauses)
        addOrderClauseCandidate(pool, "quality_inspection", 3.0, grade, usedClauses)
    }
    if (Number(qualityScore) >= 2.5)
        addOrderClauseCandidate(pool, "quality_inspection", 2.0, grade, usedClauses)
    return pool
}

function pickOrderClauseReward(pool) {
    let totalWeight = 0
    pool.forEach(value => totalWeight += Math.max(0, Number(value.weight) || 0))
    if (totalWeight <= 0)
        return null
    let roll = Utils.random.nextFloat() * totalWeight
    for (let i = 0; i < pool.length; i++) {
        roll -= Math.max(0, Number(pool[i].weight) || 0)
        if (roll <= 0)
            return pool[i].key
    }
    return pool[pool.length - 1].key
}

function getOrderClauseReturnReason(orderInfo, qualityScore, clauseKey) {
    if (clauseKey == "urgent_delivery")
        return "timeliness"
    let entries = orderInfo == null || orderInfo.entries == null ? [] : orderInfo.entries
    let totalCount = 0
    let totalMinQuality = 0
    entries.forEach(entry => {
        totalCount += Math.max(0, Number(entry.count) || 0)
        totalMinQuality += Math.max(1, Number(entry.minQuality) || 1)
    })
    let grade = Math.max(1, Math.min(6, Number(orderInfo == null ? 1 : orderInfo.orderGrade) || 1))
    let gradeProfile = global.Order.gradeProfiles[grade] || global.Order.gradeProfiles[1]
    let maxTotal = Math.max(1, Number(gradeProfile.maxTotal) || 1)
    let averageMinQuality = entries.length == 0 ? 1 : totalMinQuality / entries.length

    if ((clauseKey == "small_trial" || clauseKey == "specialty_supply") && entries.length <= 1)
        return "single"
    if (clauseKey == "banquet_assortment" && entries.length >= 3)
        return "diverse"
    if (clauseKey == "bulk_purchase" && totalCount >= maxTotal * 0.7)
        return "volume"
    if ((clauseKey == "small_premium" || clauseKey == "quality_inspection")
        && (averageMinQuality >= 2 || Number(qualityScore) >= 1.75))
        return "quality"
    if (clauseKey == "reputation_priority" || clauseKey == "cash_settlement")
        return "settlement"
    return "general"
}

function getOrderClauseReward(orderInfo, qualityScore, marketModifier) {
    if (orderInfo == null)
        return null

    let grade = Math.max(1, Math.min(6, Number(orderInfo.orderGrade) || 1))
    if (grade < 2)
        return null

    let usedClauses = getOrderUsedClauseMap(orderInfo)
    let urgentChance = [0, 0, 0, 0.10, 0.15, 0.18, 0.22][grade]
    let qualityChance = Math.min(0.06, Math.max(0, Number(qualityScore) - 1) * 0.03)
    if (grade >= 3)
        urgentChance += qualityChance

    let timeRoll = Utils.random.nextFloat()
    if (timeRoll < urgentChance && !usedClauses.urgent_delivery)
        return Item.of("createdelight:order_clause", 1, {
            OrderClause: "urgent_delivery",
            ClauseReturnReason: "timeliness"
        })

    let modifiersUsed = Object.keys(usedClauses).length
    let standardChance = [0, 0, 0.14, 0.18, 0.22, 0.24, 0.26][grade]
    standardChance += Math.min(0.08, Math.max(0, Number(qualityScore) - 1) * 0.04)
    standardChance += Math.min(0.08, modifiersUsed * 0.04)
    if (Utils.random.nextFloat() >= Math.min(0.6, standardChance))
        return null

    let clauseKey = pickOrderClauseReward(getOrderClauseRewardPool(orderInfo, qualityScore, marketModifier))
    return clauseKey == null ? null : Item.of("createdelight:order_clause", 1, {
        OrderClause: clauseKey,
        ClauseReturnReason: getOrderClauseReturnReason(orderInfo, qualityScore, clauseKey)
    })
}

function buildOrderRewardBundles(level, orderInfo, qualityScore, marketModifier) {
    global.Order.ensureDataLoaded()
    let customer = global.Order.customerProperties[orderInfo.type]
    let reward = customer.reward
    if (reward == null)
        reward = [`createdelight:orders/${orderInfo.type}`, 1]

    let list = Utils.newList()
    list.add(global.Order.getGuildVoucher(1))
    let clauseReward = getOrderClauseReward(orderInfo, qualityScore, marketModifier)
    if (clauseReward != null)
        list.add(clauseReward)
    let giftRolls = getOrderGiftRolls(orderInfo, qualityScore, reward[1])
    for (let i = 0; i < giftRolls; i++) {
        let rewardItems = LootUtils.getLootItems(reward[0], level)
        rewardItems.forEach(item => {
            list.add(item)
        })
    }

    let money = getOrderMoneySettlement(level, orderInfo, qualityScore, marketModifier)
    global.MoneyUtil.convertBaseValueToItems(money.finalMoney).forEach(item => {
        list.add(item)
    })

    let rewardBundles = []
    for (let i = 0; i < list.length; i += 9) {
        rewardBundles.push(global.CDServerJavaClasses.$PackageItem.containing(list.subList(i, Math.min(i + 9, list.length))))
    }
    return rewardBundles
}

function getOrderMoneySettlement(level, orderInfo, qualityScore, marketModifier) {
    global.Order.ensureDataLoaded()
    let customer = global.Order.customerProperties[orderInfo.type]
    let marketMultiplier = marketModifier.multiplier
    let timeModifier = global.Order.getTimeRewardModifier(orderInfo, level)
    let orderMoney = global.Order.calculateMoneyReward(orderInfo) * customer.reward_money
    let preMarketMoney = orderMoney * qualityScore
    return {
        orderMoney: orderMoney,
        preMarketMoney: preMarketMoney,
        finalMoney: preMarketMoney * marketMultiplier * timeModifier.multiplier,
        qualityScore: qualityScore,
        marketMultiplier: marketMultiplier,
        timeMultiplier: timeModifier.multiplier,
        timeBonus: timeModifier.bonus
    }
}

function getOrderMarketBreakdown(marketModifier) {
    global.Order.ensureDataLoaded()
    let config = global.Order.marketSaturationConfig
    let categoryRaw = Math.max(0, marketModifier.categoryPressure * config.categoryPenalty)
    let customerRaw = Math.max(0, marketModifier.customerPressure * config.customerPenalty)
    let totalRaw = categoryRaw + customerRaw
    let maxBonus = Math.max(0, Number(config.maxBonus))
    let consumedBonus = Math.min(maxBonus, totalRaw)
    let categoryConsumed = totalRaw <= 0 ? 0 : consumedBonus * categoryRaw / totalRaw
    let customerConsumed = totalRaw <= 0 ? 0 : consumedBonus * customerRaw / totalRaw
    return {
        categoryPercent: Math.round(categoryConsumed * 100),
        customerPercent: Math.round(customerConsumed * 100),
        rawPercent: Math.round(totalRaw * 100),
        saturated: marketModifier.saturated === true
    }
}

function placeRewardBundles(level, pos, direction, start, end, rewardBundles) {
    if (rewardBundles.length == 0)
        return
    let outputIndex = start
    let startBe = null
    for (let index = start; index <= end; index++) {
        let obe = level.getBlockEntity(pos[direction](index), "create:table_cloth")
        if (obe.isPresent()) {
            outputIndex = index
            startBe = obe.get()
            break
        }
    }
    if (startBe == null)
        return
    for (let index = 0; index < rewardBundles.length; index++) {
        let element = rewardBundles[index]
        if (startBe.manuallyAddedItems.size() == 4) {
            global.CDServerJavaClasses.$PackageEntity.fromItemStack(level, pos[direction](outputIndex).offset(0.5, 1, 0.5), element)
        } else {
            startBe.manuallyAddedItems.push(element)
            startBe.notifyUpdate()
        }
    }
}

function clearOrderSegment(level, pos, direction, start, end) {
    for (let index = start; index <= end; index++) {
        /**@type {Internal.TableClothBlockEntity} */
        let obe = level.getBlockEntity(pos[direction](index), "create:table_cloth")
        if (!obe.isPresent())
            continue
        let be = obe.get()
        be.manuallyAddedItems.clear()
        be.notifyUpdate()
    }
}

function findOrderInStack(item) {
    if (item.is("createdelight:order"))
        return item
    if (!item.hasTag("create:packages"))
        return null
    let found = null
    global.CDServerJavaClasses.$PackageItem.getContents(item).allItems.forEach(content => {
        if (found == null && content.is("createdelight:order"))
            found = content
    })
    return found
}

function getOrderSettlementSummary(summaries, player) {
    let key = `${player.uuid}`
    let summary = summaries[key]
    if (summary == null) {
        summary = {
            player: player,
            count: 0,
            finalMoney: 0,
            orderMoney: 0,
            reputationGain: 0,
            completionBonus: 0,
            scoreTotal: 0,
            scoreMax: 0,
            marketMultiplierTotal: 0,
            marketMultiplierMin: null,
            timeMultiplierTotal: 0,
            timeMultiplierMax: 1,
            saturatedCount: 0,
            rawConsumptionMax: 0,
            categoryPercentTotal: 0,
            customerPercentTotal: 0,
            finalLevel: 0,
            leveledUp: false
        }
        summaries[key] = summary
    }
    return summary
}

function recordOrderSettlement(level, orderInfo, qualityScore, marketModifier, summaries) {
    let result = global.Order.reputation.awardForOrder(level, orderInfo, qualityScore)
    if (result == null)
        return

    let money = getOrderMoneySettlement(level, orderInfo, qualityScore, marketModifier)
    let market = getOrderMarketBreakdown(marketModifier)

    let summary = getOrderSettlementSummary(summaries, result.player)
    summary.count++
    summary.finalMoney += money.finalMoney
    summary.orderMoney += money.orderMoney
    summary.reputationGain += result.gain
    summary.completionBonus += result.completionBonus
    summary.scoreTotal += money.qualityScore
    summary.scoreMax = Math.max(summary.scoreMax, money.qualityScore)
    summary.marketMultiplierTotal += money.marketMultiplier
    summary.marketMultiplierMin = summary.marketMultiplierMin == null
        ? money.marketMultiplier
        : Math.min(summary.marketMultiplierMin, money.marketMultiplier)
    summary.timeMultiplierTotal += money.timeMultiplier
    summary.timeMultiplierMax = Math.max(summary.timeMultiplierMax, money.timeMultiplier)
    summary.finalLevel = result.level
    summary.leveledUp = summary.leveledUp || result.leveledUp
    summary.categoryPercentTotal += market.categoryPercent
    summary.customerPercentTotal += market.customerPercent
    summary.rawConsumptionMax = Math.max(summary.rawConsumptionMax, market.rawPercent)
    if (market.saturated)
        summary.saturatedCount++

    global.Order.marketSaturation.recordCompletion(result.player, orderInfo, 1)
    global.syncOrderMarketSaturation(result.player)
}

function flushOrderSettlementSummaries(summaries) {
    for (let key in summaries) {
        let summary = summaries[key]
        let count = Math.max(1, summary.count)
        let avgScore = summary.scoreTotal / count
        let avgMarket = summary.marketMultiplierTotal / count
        let minMarket = summary.marketMultiplierMin == null ? 1 : summary.marketMultiplierMin
        let avgTime = summary.timeMultiplierTotal / count
        let avgCategory = Math.round(summary.categoryPercentTotal / count)
        let avgCustomer = Math.round(summary.customerPercentTotal / count)

        summary.player.tell(Text.translate("message.createdelight.order_batch_title", [summary.count]))
        summary.player.tell(Text.translate("message.createdelight.order_batch_money", [
            global.MoneyUtil.convertBaseValueToString(summary.finalMoney),
            global.MoneyUtil.convertBaseValueToString(summary.orderMoney)
        ]))
        summary.player.tell(Text.translate("message.createdelight.order_batch_score", [
            avgScore.toFixed(2),
            Math.round(avgMarket * 100),
            Math.round(minMarket * 100)
        ]))
        summary.player.tell(Text.translate("message.createdelight.order_batch_time_bonus", [
            Math.round(avgTime * 100),
            Math.round(summary.timeMultiplierMax * 100)
        ]))
        summary.player.tell(Text.translate("message.createdelight.order_batch_reputation", [
            summary.reputationGain,
            summary.completionBonus,
            summary.finalLevel
        ]))
        summary.player.tell(Text.translate("message.createdelight.order_batch_market", [
            avgCategory,
            avgCustomer,
            summary.rawConsumptionMax,
            summary.saturatedCount
        ]))
        if (summary.saturatedCount > 0)
            summary.player.tell(Text.translate("message.createdelight.order_market_recovery_hint"))
    }
}

function settleOrderSegment(level, pos, direction, start, end, orderStack, packages, summaries) {
    if (orderStack == null)
        return false

    let orderInfo = orderStack.nbt.createdelightOrderInfo
    let nums = global.Order.checkAllPackages([orderInfo], packages)
    let qualityScore = nums[0]
    if (qualityScore <= 0)
        return false

    let marketModifier = getOrderMarketModifier(level, orderInfo)
    let rewardBundles = buildOrderRewardBundles(level, orderInfo, qualityScore, marketModifier)
    clearOrderSegment(level, pos, direction, start, end)
    placeRewardBundles(level, pos, direction, start, end, rewardBundles)
    recordOrderSettlement(level, orderInfo, qualityScore, marketModifier, summaries)
    return true
}

global.OrderDeliverySettlement = {
    buildRewardBundles: buildOrderRewardBundles,
    getGiftRolls: getOrderGiftRolls,
    getClauseReward: getOrderClauseReward,
    getClauseRewardPool: getOrderClauseRewardPool,
    getMarketModifier: getOrderMarketModifier,
    recordSettlement: recordOrderSettlement,
    flushSummaries: flushOrderSettlementSummaries
}

MBDMachineEvents.onTick("createdelight:order_deliverer", e => {
    let event = e.event
    const { machine } = event
    const { level, customData, pos } = machine
    /**@type {Internal.ServerLevel} */
    let serverLevel = level
    if (level.dayTime() % 24000 >= 1000 && level.dayTime() % 24000 <= 1000 + 5 * 20) {
        if (level.dayTime() % 24000 == 1000) {
            /**@type {Internal.BrassDroneEntity} */
            let entity = level.createEntity("create_sa:brass_drone")
            level.addFreshEntity(entity)
            entity.setPos(machine.pos.above())
            customData.putUUID("droneUUID", entity.uuid)
        }
        /**@type {Internal.BrassDroneEntity} */
        let entity = serverLevel.getEntity(customData.getUUID("droneUUID"))
        entity.setMotionY(Math.sin(level.time / 5) * 0.05)
        if (level.dayTime() % 24000 == 1000 + 5 * 20) {
            entity.discard()

            let funcs = ["north", "south", "east", "west"]
            let count = 8
            let settlementSummaries = {}
            for (let i = 0; i < 4; i++) {
                let packages = new ItemStackTransfer()
                packages.setSize(64)
                let order = null
                let start = 1
                let end = 1
                let lastIndex = 1
                for (let index = 1; index <= count; index++) {
                    let position = pos[funcs[i]](index)
                    let obe = level.getBlockEntity(position, "create:table_cloth")
                    if (!obe.isPresent()) {
                        break
                    }

                    /**@type {Internal.TableClothBlockEntity} */
                    let be = obe.get()
                    let item = be.manuallyAddedItems
                    let find = null
                    item.forEach(stack => {
                        if (find == null)
                            find = findOrderInStack(stack)
                    })

                    if (find != null) {
                        if (order != null) {
                            end = index - 1
                            settleOrderSegment(level, pos, funcs[i], start, end, order, packages, settlementSummaries)
                            packages = new ItemStackTransfer()
                            packages.setSize(64)
                        }
                        start = index
                        order = find
                    }
                    if (order != null) {
                        item.filter(item => item
                            .hasTag("create:packages") && findOrderInStack(item) == null)
                            .forEach(item => ItemTransferHelper.insertItemStacked(packages, item, false))
                    }
                    lastIndex = index
                }
                if (order != null) {
                    settleOrderSegment(level, pos, funcs[i], start, lastIndex, order, packages, settlementSummaries)
                }
            }
            flushOrderSettlementSummaries(settlementSummaries)
        }
    }
})
BlockEvents.rightClicked("create:white_table_cloth", e => {
    const { player, block, item } = e
    if (player.mainHandItem.is("createdelight:order_deliverer_item")) {
        block.set("createdelight:order_deliverer")
        if (!player.isCreative()) {
            item.count--
        }
        e.cancel()
    }
})
LootJS.modifiers(e => {
    e.addBlockLootModifier("createdelight:order_deliverer")
        .addLoot("create:white_table_cloth")
        .addLoot("createdelight:order_deliverer_item")
})
