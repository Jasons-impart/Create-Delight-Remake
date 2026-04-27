// priority: 1000


const $FoodInstance = Java.loadClass("com.tarinoita.solsweetpotato.tracking.FoodInstance")
const $PackageItem = Java.loadClass("com.simibubi.create.content.logistics.box.PackageItem")
const $AuctionTradeData = Java.loadClass("io.github.lightman314.lightmanscurrency.common.traders.auction.tradedata.AuctionTradeData")
const $BrassDroneEntity = Java.loadClass("net.mcreator.createstuffadditions.entity.BrassDroneEntity")
const $QualityUtils = Java.loadClass("de.cadentem.quality_food.util.QualityUtils")
const $QualityConfig = Java.loadClass("de.cadentem.quality_food.config.QualityConfig")
const $FoodList = Java.loadClass("com.tarinoita.solsweetpotato.tracking.FoodList")
const $CoinValue = Java.loadClass("io.github.lightman314.lightmanscurrency.api.money.value.builtin.CoinValue")
const $TraderAPI = Java.loadClass("io.github.lightman314.lightmanscurrency.api.traders.TraderAPI")
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

/**
 * 根据玩家来生成订单
 * @param {Internal.Player} player 
 */
Order.create = function (player) {
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
        let entry = { key: key, weight: weight, minQuality: minQuality };
        entriesList.push(entry);
        totalEntryWeight += weight;
    }

    // --- 生成订单条目，按加权随机选择 ---
    let count = 0;
    let canceled = false;
    let bonus = Math.sqrt(level);

    while (count < selected.max_count && !canceled && totalEntryWeight > 0) {
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

        let amount = Order.orderProperties[chosenEntry.key].base_count * Utils.random.nextFloat(1, bonus * 1.25);
        order.entries.push({
            id: chosenEntry.key,
            count: parseInt(amount) * 4,
            minQuality: Math.min(3, Math.max(chosenEntry.minQuality, 1))
        });

        count++;
        let continueRate = Math.min(0.95, selected.base_continue_rate * bonus);
        if (Utils.random.nextFloat() >= continueRate) canceled = true;
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
            $PackageItem.getContents(item).allItems.forEach(i => {
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

        let needed = order.entries.map(e => ({
            id: e.id,
            count: e.count,
            minQuality: e.minQuality
        }));

        // 每个条目记录：累计品质、数量、以及“按物品类型计数”的分布
        let entryMap = {};
        needed.forEach(req => {
            entryMap[req.id] = {
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

                        let entry = entryMap[req.id];
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
    let origin = this.customerProperties[order.type]
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
    return rarityBonus * chanceBonus * goodsBonus
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
    let qualityLevel = $QualityUtils.getQuality(item).level()
    let complexity = $FoodList.getComplexity(new $FoodInstance(item.item))
    if (!item.hasTag("createdelight:order/" + type))
        return
    let food = Order.orderProperties[type]
    let level = 0
    for (let index = 0; index < food.diversity.length; index++) {
        if (complexity <= food.diversity[index])
            break
        level++
    }
    return Math.max(Math.min(3, qualityLevel + level), 1)
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
    let data = new $AuctionTradeData({})
    data.auctionItems.add(Item.of("createdelight:unopened_order"))
    data.setMinBidDifferent($CoinValue.fromItemOrValue("createdeco:copper_coin", 1))
    data.setStartingBid($CoinValue.fromItemOrValue("createdelightcore:gold_coin", 1).multiplyValue(Utils.random.nextFloat(0.5, 2)))
    data.setDuration(1000 * 60 * 60 * 1)
    $TraderAPI.getApi().GetTrader(false, 0).addTrade(data, null, false)
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
    let players = level.getPlayers()
    let found = null
    players.forEach(player => {
        if (found != null)
            return
        if (order.ownerUUID != null && `${player.uuid}` == `${order.ownerUUID}`) {
            found = player
            return
        }
        if (order.ownerName != null && `${player.username}` == `${order.ownerName}`) {
            found = player
        }
    })
    return found
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
