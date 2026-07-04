
function getOrderMarketPlayer(level, orderInfo) {
    if (global.Order.reputation == null || global.Order.reputation.getPlayer == null)
        return null
    return global.Order.reputation.getPlayer(level, orderInfo)
}

function getOrderMarketModifier(level, orderInfo) {
    global.Order.ensureDataLoaded()
    if (global.Order.marketSaturation == null)
        return { multiplier: 1, penalty: 0, categoryPressure: 0, customerPressure: 0 }

    let player = getOrderMarketPlayer(level, orderInfo)
    return global.Order.marketSaturation.getModifier(player, orderInfo)
}

function buildOrderRewardBundles(level, orderInfo, qualityScore, marketModifier) {
    global.Order.ensureDataLoaded()
    let customer = global.Order.customerProperties[orderInfo.type]
    let reward = customer.reward
    if (reward == null)
        reward = [`createdelight:orders/${orderInfo.type}`, 1]

    let list = Utils.newList()
    for (let i = 0; i < qualityScore * reward[1] * orderInfo.entries.length; i++) {
        let rewardItems = LootUtils.getLootItems(reward[0], level)
        rewardItems.forEach(item => {
            list.add(item)
        })
    }

    let money = getOrderMoneySettlement(orderInfo, qualityScore, marketModifier)
    global.MoneyUtil.convertBaseValueToItems(money.finalMoney).forEach(item => {
        list.add(item)
    })

    let rewardBundles = []
    for (let i = 0; i < list.length; i += 9) {
        rewardBundles.push(global.CDServerJavaClasses.$PackageItem.containing(list.subList(i, Math.min(i + 9, list.length))))
    }
    return rewardBundles
}

function getOrderMoneySettlement(orderInfo, qualityScore, marketModifier) {
    global.Order.ensureDataLoaded()
    let customer = global.Order.customerProperties[orderInfo.type]
    let marketMultiplier = marketModifier == null || marketModifier.multiplier == null ? 1 : marketModifier.multiplier
    let orderMoney = global.Order.calculateMoneyReward(orderInfo) * customer.reward_money
    let preMarketMoney = orderMoney * qualityScore
    return {
        orderMoney: orderMoney,
        preMarketMoney: preMarketMoney,
        finalMoney: preMarketMoney * marketMultiplier,
        qualityScore: qualityScore,
        marketMultiplier: marketMultiplier
    }
}

function getOrderMarketBreakdown(marketModifier) {
    global.Order.ensureDataLoaded()
    let config = global.Order.marketSaturationConfig
    let categoryRaw = marketModifier == null ? 0 : Math.max(0, marketModifier.categoryPressure * config.categoryPenalty)
    let customerRaw = marketModifier == null ? 0 : Math.max(0, marketModifier.customerPressure * config.customerPenalty)
    let totalRaw = categoryRaw + customerRaw
    let cappedPenalty = marketModifier == null ? 0 : Math.max(0, 1 - marketModifier.multiplier)
    let categoryPenalty = totalRaw <= 0 ? 0 : cappedPenalty * categoryRaw / totalRaw
    let customerPenalty = totalRaw <= 0 ? 0 : cappedPenalty * customerRaw / totalRaw
    return {
        categoryPercent: Math.round(categoryPenalty * 100),
        customerPercent: Math.round(customerPenalty * 100),
        rawPercent: Math.round(totalRaw * 100),
        capped: totalRaw > cappedPenalty + 0.0001
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
            marketMultiplierMin: 1,
            cappedCount: 0,
            rawPenaltyMax: 0,
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

    let money = getOrderMoneySettlement(orderInfo, qualityScore, marketModifier)
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
    summary.marketMultiplierMin = Math.min(summary.marketMultiplierMin, money.marketMultiplier)
    summary.finalLevel = result.level
    summary.leveledUp = summary.leveledUp || result.leveledUp
    summary.categoryPercentTotal += market.categoryPercent
    summary.customerPercentTotal += market.customerPercent
    summary.rawPenaltyMax = Math.max(summary.rawPenaltyMax, market.rawPercent)
    if (market.capped)
        summary.cappedCount++

    if (global.Order.marketSaturation != null)
        global.Order.marketSaturation.recordCompletion(result.player, orderInfo)
    if (global.syncOrderMarketSaturation != null)
        global.syncOrderMarketSaturation(result.player)
}

function flushOrderSettlementSummaries(summaries) {
    for (let key in summaries) {
        let summary = summaries[key]
        let count = Math.max(1, summary.count)
        let avgScore = summary.scoreTotal / count
        let avgMarket = summary.marketMultiplierTotal / count
        let avgCategory = Math.round(summary.categoryPercentTotal / count)
        let avgCustomer = Math.round(summary.customerPercentTotal / count)

        summary.player.tell(Text.translate("message.createdelight.order_batch_settlement", [
            summary.count,
            global.MoneyUtil.convertBaseValueToString(summary.finalMoney),
            global.MoneyUtil.convertBaseValueToString(summary.orderMoney),
            avgScore.toFixed(2),
            Math.round(avgMarket * 100),
            Math.round(summary.marketMultiplierMin * 100),
            summary.reputationGain,
            summary.completionBonus,
            summary.finalLevel
        ]))
        summary.player.tell(Text.translate("message.createdelight.order_batch_market", [
            avgCategory,
            avgCustomer,
            summary.rawPenaltyMax,
            summary.cappedCount
        ]))
        if (summary.cappedCount > 0)
            summary.player.tell(Text.translate("message.createdelight.order_market_recovery_hint"))
        if (summary.leveledUp)
            summary.player.tell(Text.translate("message.createdelight.order_reputation_level_up", [summary.finalLevel]))
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

            // /**@type {ItemStackTransfer} */
            // let storage = machine.getTraitByName("order_slot").storage
            // /**@type {ItemStackTransfer} */
            // let packageStorage = machine.getTraitByName("package_slot").storage
            // /**@type {ItemStackTransfer} */
            // let outputStorage = machine.getTraitByName("output_slot").storage
            // let orders = []
            // for (let index = 0; index < storage.getSlots(); index++) {

            //     let item = storage.getStackInSlot(index)
            //     if (item.is("createdelight:order"))
            //         orders.push(item.nbt.createdelightOrderInfo)
            //     else
            //         orders.push(null)
            // }
            // let res = Order.checkAllPackages(orders, packageStorage)
            // for (let index = 0; index < res.length; index++) {
            //     let element = res[index];
            //     if (element > 0) {
            //         // console.log(`index: ${index}, element: ${element}`)
            //         storage.extractItem(index, 1, false)
            //         let reward = global.Order.getRewardContract(global.Order.customerProperties[orders[index].type].reward, element * 5)
            //         ItemTransferHelper.insertItemStacked(outputStorage, reward, false)
            //     }
            // }
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
