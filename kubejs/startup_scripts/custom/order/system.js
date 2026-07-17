// priority: 1000


//订单系统
//玩家通过某种方式获取到订单。订单通常包括多组方便量产的物品，完成订单后玩家会获取一定的报酬
//设计的意义是为整合包中大量食物等物品寻求用途

let Order = {}
global.Order = Order

Order.customerUnlockLevels = {
    COMMON: 1,
    UNCOMMON: 2,
    RARE: 4,
    EPIC: 6
}

Order.getCustomerUnlockLevel = function (customer) {
    if (customer == null || customer.rarity == null)
        return 1
    let unlockLevel = this.customerUnlockLevels[customer.rarity]
    if (unlockLevel == null)
        return 1
    return unlockLevel
}

Order.toArray = function (value) {
    if (value == null)
        return []
    if (Array.isArray(value))
        return value
    if (typeof value == "string")
        return [value]
    let result = []
    if (value.forEach != null) {
        value.forEach(v => result.push(`${v}`))
        return result
    }
    return [value]
}

Order.mergeSpec = function (base, addition) {
    let result = base || {}
    if (addition == null)
        return result

    if (addition.customerGroups != null)
        result.customerGroups = this.toArray(result.customerGroups).concat(this.toArray(addition.customerGroups))
    if (addition.categoryGroups != null)
        result.categoryGroups = this.toArray(result.categoryGroups).concat(this.toArray(addition.categoryGroups))

    if (addition.customerWeightBonus != null)
        result.customerWeightBonus = Object.assign(result.customerWeightBonus || {}, addition.customerWeightBonus)
    if (addition.categoryWeightBonus != null)
        result.categoryWeightBonus = Object.assign(result.categoryWeightBonus || {}, addition.categoryWeightBonus)

    if (addition.countMultiplier != null)
        result.countMultiplier = (result.countMultiplier == null ? 1 : result.countMultiplier) * addition.countMultiplier
    if (addition.entryCountMultiplier != null)
        result.entryCountMultiplier = (result.entryCountMultiplier == null ? 1 : result.entryCountMultiplier) * addition.entryCountMultiplier
    if (addition.minQualityBonus != null)
        result.minQualityBonus = (result.minQualityBonus || 0) + addition.minQualityBonus
    if (addition.moneyMultiplier != null)
        result.moneyMultiplier = (result.moneyMultiplier == null ? 1 : result.moneyMultiplier) * addition.moneyMultiplier
    if (addition.reputationMultiplier != null)
        result.reputationMultiplier = (result.reputationMultiplier == null ? 1 : result.reputationMultiplier) * addition.reputationMultiplier

    return result
}

Order.createSpecFromDraft = function (draft) {
    this.ensureDataLoaded()
    let spec = {}
    if (draft == null)
        return null

    let customerSeal = draft.customerSeal == null ? null : `${draft.customerSeal}`
    let categorySeal = draft.categorySeal == null ? null : `${draft.categorySeal}`
    if (customerSeal == null && categorySeal == null)
        return null

    for (let itemId in this.orderDraftSeals) {
        let seal = this.orderDraftSeals[itemId]
        if (seal.type == "customer" && seal.key == customerSeal)
            spec = this.mergeSpec(spec, seal.spec)
        if (seal.type == "category" && seal.key == categorySeal)
            spec = this.mergeSpec(spec, seal.spec)
    }

    let sealCount = (customerSeal != null ? 1 : 0) + (categorySeal != null ? 1 : 0)
    spec.selectionPrecision = sealCount
    spec.source = "draft"
    return spec
}

Order.applyDraftSeal = function (orderStack, sealStack) {
    this.ensureDataLoaded()
    if (orderStack == null || sealStack == null || !orderStack.is("createdelight:unopened_order"))
        return false
    if (!sealStack.is("createdelight:order_seal"))
        return false

    let sealKey = sealStack.nbt == null || sealStack.nbt.OrderSeal == null ? null : `${sealStack.nbt.OrderSeal}`
    let seal = sealKey == null ? null : this.orderDraftSeals[sealKey]
    if (seal == null)
        return false

    let nbt = orderStack.nbt || {}
    let draft = nbt.OrderDraft || {}
    draft.Revision = 1

    if (seal.type == "customer")
        draft.customerSeal = seal.key
    else if (seal.type == "category")
        draft.categorySeal = seal.key
    else
        return false

    nbt.OrderDraft = draft
    orderStack.nbt = nbt
    return true
}

Order.openDraft = function (player, draftStack) {
    if (player == null || draftStack == null || !draftStack.is("createdelight:unopened_order"))
        return null

    let draft = draftStack.nbt == null ? null : draftStack.nbt.OrderDraft
    let spec = this.createSpecFromDraft(draft)
    draftStack.shrink(1)

    let ret = this.create(player, spec)
    let attempts = 0
    while (ret.entries.length == 0 && attempts < 20) {
        ret = this.create(player, spec)
        attempts++
    }

    let orderStack = Item.of("createdelight:order", 1, { createdelightOrderInfo: ret })
    player.give(orderStack)
    return orderStack
}

Order.marketSaturation = {}

Order.marketSaturation.getDay = function (playerOrLevel) {
    let level = playerOrLevel == null ? null : (playerOrLevel.level || playerOrLevel)
    if (level == null || level.dayTime == null)
        return 0
    return Math.floor(level.dayTime() / 24000)
}

Order.marketSaturation.createData = function (day) {
    return {
        lastDay: day,
        categories: {},
        customers: {}
    }
}

Order.marketSaturation.read = function (player) {
    let config = Order.marketSaturationConfig
    let day = this.getDay(player)
    if (player == null || player.persistentData == null)
        return this.createData(day)

    let raw = player.persistentData.getString(config.storageKey)
    if (raw == null || raw.length == 0)
        return this.createData(day)

    try {
        let data = JSON.parse(raw)
        data.categories = data.categories || {}
        data.customers = data.customers || {}
        data.lastDay = data.lastDay == null ? day : data.lastDay
        return data
    } catch (error) {
        return this.createData(day)
    }
}

Order.marketSaturation.write = function (player, data) {
    if (player == null || player.persistentData == null)
        return
    player.persistentData.putString(Order.marketSaturationConfig.storageKey, JSON.stringify(data))
}

Order.marketSaturation.decay = function (data, day) {
    let config = Order.marketSaturationConfig
    let elapsed = Math.max(0, day - (data.lastDay == null ? day : data.lastDay))
    if (elapsed <= 0) {
        data.lastDay = day
        return data
    }

    let factor = Math.pow(config.decayPerDay, elapsed)
    ;["categories", "customers"].forEach(group => {
        let values = data[group] || {}
        for (let key in values) {
            values[key] *= factor
            if (values[key] < 0.01)
                delete values[key]
        }
        data[group] = values
    })
    data.lastDay = day
    return data
}

Order.marketSaturation.getModifier = function (player, order) {
    Order.ensureDataLoaded()
    let config = Order.marketSaturationConfig
    if (player == null || order == null || order.entries == null || order.entries.length == 0)
        return { multiplier: 1, penalty: 0, categoryPressure: 0, customerPressure: 0 }

    let data = this.decay(this.read(player), this.getDay(player))
    let categoryPressure = 0
    order.entries.forEach(entry => {
        categoryPressure += data.categories[entry.id] || 0
    })
    categoryPressure /= Math.max(1, order.entries.length)

    let customerPressure = data.customers[order.type] || 0
    let penalty = Math.min(config.maxPenalty, categoryPressure * config.categoryPenalty + customerPressure * config.customerPenalty)
    return {
        multiplier: Math.max(0, 1 - penalty),
        penalty: penalty,
        categoryPressure: categoryPressure,
        customerPressure: customerPressure
    }
}

Order.marketSaturation.recordCompletion = function (player, order) {
    Order.ensureDataLoaded()
    let config = Order.marketSaturationConfig
    if (player == null || order == null || order.entries == null)
        return null

    let day = this.getDay(player)
    let data = this.decay(this.read(player), day)
    let activeCategories = {}
    order.entries.forEach(entry => {
        activeCategories[entry.id] = true
    })

    let categoryRecovery = config.categoryCrossRecovery == null ? 1 : config.categoryCrossRecovery
    let customerRecovery = config.customerCrossRecovery == null ? 1 : config.customerCrossRecovery
    for (let id in data.categories) {
        if (activeCategories[id])
            continue
        data.categories[id] *= categoryRecovery
        if (data.categories[id] < 0.01)
            delete data.categories[id]
    }
    for (let id in data.customers) {
        if (id == order.type)
            continue
        data.customers[id] *= customerRecovery
        if (data.customers[id] < 0.01)
            delete data.customers[id]
    }

    let categoryScales = {}
    order.entries.forEach(entry => {
        let property = Order.orderProperties[entry.id]
        let baseCount = property == null ? 64 : property.base_count
        categoryScales[entry.id] = (categoryScales[entry.id] || 0) + entry.count / Math.max(1, baseCount * 4)
    })

    let categoryScaleMax = config.categoryCompletionScaleMax == null ? 2 : config.categoryCompletionScaleMax
    for (let id in categoryScales) {
        let scale = Math.max(1, Math.min(categoryScaleMax, categoryScales[id]))
        data.categories[id] = (data.categories[id] || 0) + config.categoryCompletionGain * scale
    }
    if (order.type != null)
        data.customers[order.type] = (data.customers[order.type] || 0) + config.customerCompletionGain

    this.write(player, data)
    return data
}

Order.getCustomerWeightMultiplier = function (customerKey, spec) {
    this.ensureDataLoaded()
    if (spec == null)
        return 1

    let multiplier = 1
    let groups = this.toArray(spec.customerGroups)
    if (groups.length > 0) {
        let matched = groups.some(group => {
            let prefix = this.customerGroupPrefixes[`${group}`]
            return prefix != null && `${customerKey}`.startsWith(prefix)
        })
        multiplier *= matched ? 4 : 0.35
    }

    let directBonus = spec.customerWeightBonus != null ? spec.customerWeightBonus[customerKey] : null
    if (directBonus != null)
        multiplier *= directBonus

    return multiplier
}

Order.getEntryWeightMultiplier = function (entryKey, spec) {
    this.ensureDataLoaded()
    if (spec == null)
        return 1

    let multiplier = 1
    let groups = this.toArray(spec.categoryGroups)
    if (groups.length > 0) {
        let matchedWeight = 0
        groups.forEach(group => {
            let groupMap = this.categoryGroups[`${group}`]
            if (groupMap != null && groupMap[entryKey] != null)
                matchedWeight = Math.max(matchedWeight, groupMap[entryKey])
        })
        multiplier *= matchedWeight > 0 ? matchedWeight : 0.35
    }

    let directBonus = spec.categoryWeightBonus != null ? spec.categoryWeightBonus[entryKey] : null
    if (directBonus != null)
        multiplier *= directBonus

    return multiplier
}

/**
 * 根据玩家来生成订单
 * @param {Internal.Player} player
 * @param {Object=} spec
 */
Order.create = function (player, spec) {
    this.ensureDataLoaded()
    let level = this.reputation.getLevel(player);
    let order = {
        entries: [],
        generatedReputationLevel: level,
        ownerName: `${player.username}`,
        ownerUUID: `${player.uuid}`
    };
    let selected;

    // --- 根据 chance 加权随机选择客户类型 ---
    let weightedList = [];
    let totalWeight = 0;

    for (let key in Order.customerProperties) {
        if (!Object.prototype.hasOwnProperty.call(Order.customerProperties, key)) continue;
        let element = Order.customerProperties[key];
        let unlockLevel = Order.getCustomerUnlockLevel(element);
        if (level < unlockLevel) continue;
        let weight = element.chance * (1 + Math.max(0, level - unlockLevel) * 0.15);
        weight *= Order.getCustomerWeightMultiplier(key, spec);
        if (weight > 0) {
            let entry = { key: key, element: element, weight: weight };
            weightedList.push(entry);
            totalWeight += weight;
        }
    }

    if (weightedList.length > 0) {
        let r = Utils.random.nextFloat() * totalWeight;
        for (let i = 0; i < weightedList.length; i++) {
            r -= weightedList[i].weight;
            if (r <= 0) {
                selected = weightedList[i].element;
                order.type = weightedList[i].key;
                break;
            }
        }
    }

    if (!selected) return order;

    // --- 准备条目权重列表 ---
    const entriesList = [];
    let totalEntryWeight = 0;
    for (const key in selected.entries) {
        if (!Object.prototype.hasOwnProperty.call(selected.entries, key)) continue;
        let entryVal = selected.entries[key];
        let weight, minQuality;
        if (Array.isArray(entryVal)) {
            [weight, minQuality] = entryVal;
        } else {
            weight = entryVal;
            minQuality = 0;
        }
        weight *= Order.getEntryWeightMultiplier(key, spec);
        let entry = { key: key, weight: weight, minQuality: minQuality };
        entriesList.push(entry);
        totalEntryWeight += weight;
    }

    // --- 生成订单条目，按加权随机选择 ---
    let count = 0;
    let canceled = false;
    let bonus = Math.sqrt(level);
    let countMultiplier = spec != null && spec.countMultiplier != null ? spec.countMultiplier : 1;
    let minQualityBonus = spec != null && spec.minQualityBonus != null ? spec.minQualityBonus : 0;
    let entryCountMultiplier = spec != null && spec.entryCountMultiplier != null ? spec.entryCountMultiplier : 1;
    let maxEntryCount = Math.max(1, Math.round(selected.max_count * entryCountMultiplier));

    while (count < maxEntryCount && !canceled && totalEntryWeight > 0) {
        // 随机选一个条目
        let r = Utils.random.nextFloat() * totalEntryWeight;
        let chosenEntry;
        for (let i = 0; i < entriesList.length; i++) {
            r -= entriesList[i].weight;
            if (r <= 0) {
                chosenEntry = entriesList[i];
                break;
            }
        }

        if (!chosenEntry) break; // 防护

        let amount = Order.orderProperties[chosenEntry.key].base_count * Utils.random.nextFloat(1, bonus * 1.25) * countMultiplier;
        order.entries.push({
            id: chosenEntry.key,
            count: parseInt(amount) * 4,
            minQuality: Math.min(3, Math.max(chosenEntry.minQuality + minQualityBonus, 1))
        });

        count++;
        let continueRate = Math.min(0.95, selected.base_continue_rate * bonus);
        if (Utils.random.nextFloat() >= continueRate) canceled = true;
    }

    let moneyMultiplier = spec != null && spec.moneyMultiplier != null ? spec.moneyMultiplier : 1
    let reputationMultiplier = spec != null && spec.reputationMultiplier != null ? spec.reputationMultiplier : 1

    if (spec != null) {
        order.generationSpec = {
            source: spec.source || "direct",
            customerGroups: this.toArray(spec.customerGroups),
            categoryGroups: this.toArray(spec.categoryGroups),
            selectionPrecision: spec.selectionPrecision || 0
        }
    }

    if (spec != null) {
        order.rewardMultipliers = {
            money: moneyMultiplier,
            reputation: reputationMultiplier
        }
    }

    return order;
};



/**
 * @param {ItemStackTransfer} items
 * @returns {ItemStackTransfer} 
 */
Order.convertPackageToItemHandler = function (items) {

    let transfer = new ItemStackTransfer()
    transfer.setSize(81)
    for (let index = 0; index < items.getSlots(); index++) {
        let item = items.getStackInSlot(index)
        if (!item.is("air"))
            global.CDStartupJavaClasses.$PackageItem.getContents(item).allItems.forEach(i => {
                ItemTransferHelper.insertItemStacked(transfer, i, false)
            })
    }
    return transfer
}

/**
 * 检查多个订单是否依次可完成（共用扣减的库存），返回正负表示匹配与否
 * @param {{type: string, entries: [{ id: string, count: number, minQuality: number }]}[]} orders
 * @param {ItemStackTransfer} items
 * @returns {number[]} 正数=完全匹配产出量，0=不完全匹配产出量
 */
Order.checkAllPackages = function (orders, items) {
    let transfer = Order.convertPackageToItemHandler(items);
    let results = [];

    // 计算条目内部“物品分布”的奖励：基尼系数 G = 1 - sum(p_i^2)，typeBonus = 1 + G ∈ [1,2)
    function calcTypeBonus(countByType) {
        let total = 0;
        for (let k in countByType) total += countByType[k];
        if (total <= 0) return 1;

        let sumSquares = 0;
        for (let k in countByType) {
            let p = countByType[k] / total;
            sumSquares += p * p;
        }
        let gini = 1 - sumSquares;
        return 1 + gini;
    }

    orders.forEach(order => {
        if (order == null) {
            results.push(0);
            return;
        }

        let seenEntryIds = {}
        let needed = order.entries.map(e => {
            seenEntryIds[e.id] = (seenEntryIds[e.id] || 0) + 1
            return {
                id: e.id,
                key: seenEntryIds[e.id] == 1 ? e.id : `${e.id}#${seenEntryIds[e.id]}`,
                count: e.count,
                minQuality: e.minQuality
            }
        });

        // 每个条目记录：累计品质、数量、以及“按物品类型计数”的分布
        let entryMap = {};
        needed.forEach(req => {
            entryMap[req.key] = {
                totalQuality: 0,
                totalCount: 0,
                countByType: {}  // { typeKey: count }
            };
        });

        // 消耗库存满足条目
        needed.forEach(req => {
            for (let i = 0; i < transfer.getSlots(); i++) {
                let stack = transfer.getStackInSlot(i);
                if (!stack.isEmpty() && stack.hasTag("createdelight:order/" + req.id)) {
                    let foodQuality = Order.getGoodsOrderProperty(stack, req.id) || 1;
                    if (foodQuality < req.minQuality) continue;

                    let take = Math.min(req.count, stack.getCount());
                    if (take > 0) {

                        let entry = entryMap[req.key];
                        entry.totalQuality += (foodQuality - req.minQuality + 1) * take;
                        entry.totalCount += take;

                        let typeKey = stack.id;
                        entry.countByType[typeKey] = (entry.countByType[typeKey] || 0) + take;
                        stack.shrink(take);
                        req.count -= take;

                        if (req.count <= 0) break;
                    }
                }
            }
        });

        let fullyMatched = needed.every(n => n.count <= 0);
        let output = 0;

        if (fullyMatched) {
            // 这里是关键改动：把“条目奖励”直接乘进该条目的贡献里，再做数量加权平均
            let sumWeightedWithBonus = 0;
            let totalCountAll = 0;

            for (let id in entryMap) {
                let entry = entryMap[id];
                if (entry.totalCount <= 0) continue;
                let avgQuality = entry.totalQuality / entry.totalCount;
                let typeBonus = calcTypeBonus(entry.countByType);

                sumWeightedWithBonus += avgQuality * entry.totalCount * typeBonus;
                totalCountAll += entry.totalCount;
            }

            if (totalCountAll > 0) {
                // 最终“产出量/得分” = (Σ 每条目[平均品质 × 数量 × 条目种类奖励]) / 总数量
                output = sumWeightedWithBonus / totalCountAll;
            }
        }

        results.push(output);
    });

    return results;
};
/**
 * 
 * @param {{type: string, entries: [{ id: string, count: number, minQuality: number }]}} order 
 */
Order.calculateMoneyReward = function(order) {
    this.ensureDataLoaded()
    let origin = this.customerProperties[order.type]
    if (origin == null)
        return 0
    let rarityBonus = 1
    switch (origin.rarity) {
        case "UNCOMMON":
            rarityBonus = 1.25
            break;
        case "RARE":
            rarityBonus = 1.5
            break;
        case "EPIC":
            rarityBonus = 2
            break;
        default:
            rarityBonus = 1
            break;
    }
    let chanceBonus = 1 / origin.chance
    let goodsBonus = 0
    order.entries.forEach(entry => {
        let qualityMultiplier = 1 + 0.2 * (entry.minQuality - 1)
        goodsBonus += qualityMultiplier * entry.count / this.orderProperties[entry.id].base_count
    })
    let multiplier = order.rewardMultipliers != null && order.rewardMultipliers.money != null
        ? order.rewardMultipliers.money
        : 1
    if (order.marketSaturation != null && order.marketSaturation.multiplier > 0)
        multiplier /= order.marketSaturation.multiplier
    return rarityBonus * chanceBonus * goodsBonus * multiplier
}

/**
 * 
 * @param {Internal.ItemStack} item 
 * @param {string} type
 */
Order.getGoodsOrderProperty = function (item, type) {
    let goodsMap = CreateDelight.goodsMap.get(type)
    if (goodsMap != null)
        return goodsMap(item)
    let quality = global.CDStartupJavaClasses.$OrderGoodsQuality.getQuality(item, type)
    return quality > 0 ? quality : undefined
}
/**
 * @deprecated
 * @param {string} type 
 * @param {number} count 
 * @returns {Internal.ItemStack}
 */
Order.getRewardContract = function (type, count) {
    let reward = Item.of('lightmanscurrency:ticket', count, `{ 
        TicketColor: ${Order.ticketColorMapping[type]}, 
        TicketID: -10 }`)
    reward.setHoverName(Component.translate("item.createdelight.name." + type).italic(false))
    return reward
}

Order.addOrderToAuction = function() {
    let data = new global.CDStartupJavaClasses.$AuctionTradeData({})
    data.auctionItems.add(Item.of("createdelight:unopened_order"))
    data.setMinBidDifferent(global.MoneyUtil.coinValueFromItemOrValue("createdeco:copper_coin", 1))
    data.setStartingBid(global.MoneyUtil.coinValueFromItemOrValue("createdelightcore:gold_coin", 1).multiplyValue(Utils.random.nextFloat(0.5, 2)))
    data.setDuration(1000 * 60 * 60 * 1)
    global.CDStartupJavaClasses.$TraderAPI.getApi().GetTrader(false, 0).addTrade(data, null, false)
}

Order.reputation = {}

Order.reputation.key = "order_reputation"

/**
 * 
 * @param {Internal.Player} player 
 */
Order.reputation.getRawValue = function(player) {
    let value = player.persistentData.getInt(this.key)
    if (value < 0) {
        player.persistentData.putInt(this.key, 0)
        return 0
    }
    return value
}

Order.reputation.setRawValue = function(player, value) {
    let safeValue = Math.max(0, Math.floor(value))
    player.persistentData.putInt(this.key, safeValue)
    return safeValue
}

Order.reputation.addValue = function(player, value) {
    if (player == null)
        return 0
    return this.setRawValue(player, this.getRawValue(player) + value)
}

Order.reputation.threshold = [0, 10, 20, 40, 60, 100]

Order.reputation.getLevelByValue = function(value) {
    for (let index = this.threshold.length - 1; index >= 0; index--) {
        if (value >= this.threshold[index])
            return index + 1
    }
    return 1
}

Order.reputation.getCompletionBonus = function(order, qualityScore) {
    let completionScore = Math.max(0, qualityScore - 1)
    if (completionScore <= 0)
        return 0
    let entryFactor = 0.75 + order.entries.length * 0.5
    return Math.max(0, Math.min(6, Math.round(completionScore * entryFactor)))
}

Order.reputation.getOrderGainDetails = function(order, qualityScore) {
    Order.ensureDataLoaded()
    let customer = Order.customerProperties[order.type]
    let rarityBonus = 0
    switch (customer != null ? customer.rarity : "COMMON") {
        case "UNCOMMON":
            rarityBonus = 1
            break;
        case "RARE":
            rarityBonus = 2
            break;
        case "EPIC":
            rarityBonus = 3
            break;
        default:
            rarityBonus = 0
            break;
    }
    let entryBonus = Math.max(1, Math.round(order.entries.length * 0.5))
    let completionBonus = this.getCompletionBonus(order, qualityScore)
    let gain = Math.max(1, entryBonus + rarityBonus + completionBonus)
    return {
        gain: gain,
        rarityBonus: rarityBonus,
        entryBonus: entryBonus,
        completionBonus: completionBonus
    }
}

Order.reputation.getOrderGain = function(order, qualityScore) {
    return this.getOrderGainDetails(order, qualityScore).gain
}

Order.reputation.getPlayer = function(level, order) {
    if (level == null || order == null)
        return null

    function matchesOrderOwner(player) {
        if (player == null)
            return false
        if (order.ownerUUID != null && `${player.uuid}` == `${order.ownerUUID}`)
            return true
        return order.ownerName != null && `${player.username}` == `${order.ownerName}`
    }

    function findInPlayers(players) {
        let found = null
        if (players == null)
            return null
        players.forEach(player => {
            if (found == null && matchesOrderOwner(player))
                found = player
        })
        return found
    }

    let sameLevelPlayer = findInPlayers(level.getPlayers())
    if (sameLevelPlayer != null)
        return sameLevelPlayer

    let server = level.server
    if (server == null)
        return null

    let found = null

    if (order.ownerUUID != null && global.CDServerJavaClasses != null && global.CDServerJavaClasses.$UUID != null) {
        try {
            found = server.getPlayerList().getPlayer(global.CDServerJavaClasses.$UUID.fromString(`${order.ownerUUID}`))
        } catch (error) {
            found = null
        }
    }
    if (found != null)
        return found

    try {
        return findInPlayers(server.getPlayerList().getPlayers())
    } catch (error) {
        return null
    }
}

Order.reputation.awardForOrder = function(level, order, qualityScore) {
    let player = this.getPlayer(level, order)
    if (player == null)
        return null
    let details = this.getOrderGainDetails(order, qualityScore)
    let beforeLevel = this.getLevel(player)
    let value = this.addValue(player, details.gain)
    let afterLevel = this.getLevel(player)
    return {
        player: player,
        gain: details.gain,
        completionBonus: details.completionBonus,
        rarityBonus: details.rarityBonus,
        entryBonus: details.entryBonus,
        value: value,
        level: afterLevel,
        leveledUp: afterLevel > beforeLevel
    }
}

/**
 * 
 * @param {Internal.Player} player 
 */
Order.reputation.getLevel = function(player) {
    return this.getLevelByValue(this.getRawValue(player))
}

// ItemEvents.rightClicked("minecraft:stick", e => {
//     const {player, level} = e
//     let param = new $LootParams$Builder(level).create($LootContextParamSets.EMPTY)
    
//     Utils.server.lootData.getLootTable("createdelight:orders/random_hatbag").getRandomItems(param).forEach(item => player.give(item))
//     player.tell(123)
// })
