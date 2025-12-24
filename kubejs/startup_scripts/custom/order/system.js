// priority: 1000


const $FoodInstance = Java.loadClass("com.tarinoita.solsweetpotato.tracking.FoodInstance")
const $PackageItem = Java.loadClass("com.simibubi.create.content.logistics.box.PackageItem")
const $AuctionTradeData = Java.loadClass("io.github.lightman314.lightmanscurrency.common.traders.auction.tradedata.AuctionTradeData")
const $BrassDroneEntity = Java.loadClass("net.mcreator.createstuffadditions.entity.BrassDroneEntity")
const $QualityUtils = Java.loadClass("de.cadentem.quality_food.util.QualityUtils")
const $FoodList = Java.loadClass("com.tarinoita.solsweetpotato.tracking.FoodList")
const $CoinValue = Java.loadClass("io.github.lightman314.lightmanscurrency.api.money.value.builtin.CoinValue")
const $TraderAPI = Java.loadClass("io.github.lightman314.lightmanscurrency.api.traders.TraderAPI")
//订单系统
//玩家通过某种方式获取到订单。订单通常包括多组方便量产的物品，完成订单后玩家会获取一定的报酬
//设计的意义是为整合包中大量食物等物品寻求用途

let Order = {}
global.Order = Order

/**
 * 根据玩家来生成订单
 * @param {Internal.Player} player 
 */
Order.create = function (player) {
    let order = { entries: [] };
    let level = this.reputation.getLevel(player);
    let selected;

    // --- 根据 chance 加权随机选择客户类型 ---
    let weightedList = [];
    let totalWeight = 0;

    for (let key in Order.customerProperties) {
        if (!Object.prototype.hasOwnProperty.call(Order.customerProperties, key)) continue;
        let element = Order.customerProperties[key];
        let weight = Math.sqrt(level) / Math.sqrt(5) * 0.8 * element.chance;
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
        if (Utils.random.nextFloat() >= selected.base_continue_rate * bonus) canceled = true;
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
    $TraderAPI.API.GetTrader(false, 0).addTrade(data, null, false)
}

Order.reputation = {}

/**
 * 
 * @param {Internal.Player} player 
 */
Order.reputation.getRawValue = function(player) {
    if (player.persistentData.getInt("order_reputation") == 0)
        player.persistentData.putInt("order_reputation", 0)
    return player.persistentData.getInt("order_reputation")
}

Order.reputation.threshold = [0, 10, 20, 40, 60, 100]



/**
 * 
 * @param {Internal.Player} player 
 */
Order.reputation.getLevel = function(player) {
    let value = this.getRawValue(player)
    let level = 0
    for (let index = 0; index < this.threshold.length; index++) {
        let element = this.threshold[index]
        level ++
        if (value >= element)
            break
    }
    return level
}

// ItemEvents.rightClicked("minecraft:stick", e => {
//     const {player, level} = e
//     let param = new $LootParams$Builder(level).create($LootContextParamSets.EMPTY)
    
//     Utils.server.lootData.getLootTable("createdelight:orders/random_hatbag").getRandomItems(param).forEach(item => player.give(item))
//     player.tell(123)
// })