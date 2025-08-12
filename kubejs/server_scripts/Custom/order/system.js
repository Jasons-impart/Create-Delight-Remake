const $FoodInstance = Java.loadClass("com.tarinoita.solsweetpotato.tracking.FoodInstance")
const $PackageItem = Java.loadClass("com.simibubi.create.content.logistics.box.PackageItem")
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
    let level = this.getPlayerRankLevel(player);
    let selected;

    // 按概率选择客户类型
    for (let key in Order.customerProperties) {
        if (!Object.prototype.hasOwnProperty.call(Order.customerProperties, key)) continue;
        let element = Order.customerProperties[key];
        let chance = Math.sqrt(level) / Math.sqrt(5) * 0.8 * element.chance; // 5 = maxLevel
        if (Utils.random.nextFloat() <= chance) {
            selected = element;
            order.type = key;
            break;
        }
    }

    if (!selected) return order;

    // 计算总权重
    let allWeight = 0;
    for (const key in selected.entries) {
        if (!Object.prototype.hasOwnProperty.call(selected.entries, key)) continue;
        let entryVal = selected.entries[key];
        let weight = Array.isArray(entryVal) ? entryVal[0] : entryVal; // 兼容旧写法
        allWeight += weight;
    }

    let count = 0;
    while (count < selected.max_count) {
        for (const key in selected.entries) {
            if (!Object.prototype.hasOwnProperty.call(selected.entries, key)) continue;
            let entryVal = selected.entries[key];
            let weight, minQuality;
            if (Array.isArray(entryVal)) {
                [weight, minQuality] = entryVal;
            } else {
                weight = entryVal;
                minQuality = 0; // 旧写法默认无品质要求
            }

            let bonus = Math.sqrt(level);
            if (
                Utils.random.nextFloat() < weight / allWeight &&
                Utils.random.nextFloat() < selected.base_continue_rate * bonus
            ) {
                let amount = Order.orderProperties[key].base_count * Utils.random.nextFloat(1, bonus);
                // 格式: [类型, 数量, 最低品质要求]
                order.entries.push([key, amount, minQuality]);
                count++;
                if (count >= selected.max_count) break;
            }
        }
    }

    return order;
};


/**
 * @param {Internal.IItemHandler} items
 * @returns {ItemStackTransfer} 
 */
Order.convertPackageToItemHandler = function (items) {
    let transfer = new ItemStackTransfer()
    items.allItems.forEach(item => {
        $PackageItem.getContents(item).allItems.forEach(i => {
            ItemTransferHelper.insertItemStacked(transfer, i, false)
        })
    })
    return transfer
}

/**
 * 检查多个订单是否依次可完成（共用扣减的库存）
 * @param {{type: string, entries: [[string, number, number]]}[]} orders 多个订单
 * @param {Internal.IItemHandler} items 玩家物品栏
 * @returns {boolean[]} 每个订单是否满足
 */
Order.checkAllPackages = function (orders, items) {
    let transfer = Order.convertPackageToItemHandler(items);
    let results = [];

    orders.forEach(order => {
        let needed = order.entries.map(function (entry) {
            var id = entry[0];
            var count = entry[1];
            var minQuality = entry[2];
            return { id: id, count: count, minQuality: minQuality };
        });

        needed.forEach(req => {
            for (let i = 0; i < transfer.getSlots(); i++) {
                let stack = transfer.getStackInSlot(i);
                if (!stack.isEmpty() && stack.hasTag("createdelight:order/" + req.id)) {
                    // 检查品质
                    let foodQuality = Order.getFoodOrderProperty(stack, req.id) || 0;
                    if (foodQuality < req.minQuality) continue;

                    let take = Math.min(req.count, stack.getCount());
                    if (take > 0) {
                        stack.shrink(take); // 从可写库存扣除
                        req.count -= take;
                        if (req.count <= 0) break;
                    }
                }
            }
        });

        results.push(needed.every(n => n.count <= 0));
    });

    return results;
};


/**
 * 
 * @param {Internal.Player} player 
 * @returns {number}
 */
Order.getPlayerRank = function (player) {
    return player.persistentData.getInt("order_rank")
}

Order.getPlayerRankLevel = function (player) {
    let rank = this.getPlayerRank(player)
    let level = 0
    for (let index = 0; index < Order.rankThreshold.length; index++) {
        if (rank < Order.rankThreshold[index])
            break
        level = index + 1
    }
    return level
}
/**
 * 
 * @param {Internal.ItemStack} item 
 * @param {string} type
 */
Order.getFoodOrderProperty = function (item, type) {
    let qualityLevel = $QualityUtils.getQuality(item).level()
    let complexity = $FoodList.getComplexity(new $FoodInstance(item.item))
    if (!item.hasTag("createdelight:order/" + type))
        return
    let food = Order.orderProperties[type]
    let level = 0
    for (let index = 0; index < food.diversity.length; index++) {
        level++
        if (complexity <= food.diversity[index])
            break
    }
    return Math.max(Math.min(3, qualityLevel + level), 1)
}

