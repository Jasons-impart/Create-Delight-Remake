
MBDMachineEvents.onPlaced("createdelight:sell_bin", e => {

    /**
     * @type {Internal.Player}
     */
    let player = e.event.player
    let machine = e.event.machine
    if (!player.player || player.fake)
        return
    machine.customData.putUUID("owner", player.uuid)
})


MBDMachineEvents.onTick("createdelight:sell_bin", e => {
    if ((e.event.machine.level.dayTime() % 24000) != 1000) return

    let player = e.event.machine.level.getPlayerByUUID(e.event.machine.customData.getUUID("owner"))
    if (player == null)
        return
    let items = e.event.machine.getCapability(ForgeCapabilities.ITEM_HANDLER).orElse(null)
    let values = 0
    let traderId = [4, 5, 9, 13]
    traderId.forEach(id => {
        TradeUtil.getTradeAPI().GetTrader(false, id).getTradeData().forEach(tradeData => {
            /**@type {Internal.ItemTradeData} */
            let itemTradeData = tradeData
            let first = itemTradeData.getSellItem(0)
            let second = itemTradeData.getSellItem(1)

            /**
             * 
             * @param {Internal.ItemStack} item 
             * @returns {Internal.ItemStack}
             */
            function getMaxCountItem(item) {
                if (item == null) return false
                let max = -1
                let maxi = -1
                for (let index = 0; index < items.slots; index++) {
                    let element = items.getStackInSlot(index)
                    if (element != null && element.count > max && element.is(item)) {
                        maxi = index
                        max = element.count
                    }
                }
                if (maxi == -1)
                    return false
                return items.getStackInSlot(maxi)
            }
            // 循环减少物品
            while (true) {
                let decreasedFirst = first != null ? getMaxCountItem(first) : null; // 若 first 为 null，则结果为 null
                let decreasedSecond = second != null ? getMaxCountItem(second) : null; // 若 second 为 null，则结果为 null
                let firstQuality = $QualityUtils.getQuality(decreasedFirst)
                let secondQuality = $QualityUtils.getQuality(decreasedSecond)
                let firstRate = decreasedFirst ? (decreasedFirst.count / (first?.count || 1)) : Infinity;
                let secondRate = decreasedSecond ? (decreasedSecond.count / (second?.count || 1)) : Infinity;
                firstRate = (first != null && firstRate === Infinity) ? 0 : firstRate;
                secondRate = (second != null && secondRate === Infinity) ? 0 : secondRate;

                let minRate = Math.min(firstRate, secondRate);
                let firstCount = decreasedFirst ? Math.floor((first?.count || 0) * minRate) : 0;
                let secondCount = decreasedSecond ? Math.floor((second?.count || 0) * minRate) : 0;
                // player.tell(`minRate: ${minRate}, firstCount: ${firstCount}, secondCount: ${secondCount}`)
                // 如果没有任何减少，结束交易
                if (firstCount === 0 && secondCount === 0) break;

                // 减少库存中的物品数量
                if (decreasedFirst && firstCount > 0) {
                    decreasedFirst.shrink(firstCount);
                }
                if (decreasedSecond && secondCount > 0) {
                    decreasedSecond.shrink(secondCount);
                }
                // player.tell(`firstQuality: ${firstQuality} secondQuality: ${secondQuality}`)
                let multiplier = Math.floor(JavaMath.sqrt(2 / (
                    (firstQuality.level() != 0 ? $QualityConfig.getChance(firstQuality) : (secondQuality.level() != 0 ? $QualityConfig.getChance(secondQuality) : 1))
                    + (secondQuality.level() != 0 ? $QualityConfig.getChance(secondQuality) : (firstQuality.level() != 0 ? $QualityConfig.getChance(firstQuality) : 1)))) + 0.5)
                values += minRate * multiplier * tradeData.getCost().coreValue * 4
            }
        })
    })
    //直接出售食物
    let baseNutrition = 6
    let baseSaturationModifier = 0.6
    /**
     * @type {Internal.List<Internal.Item>}
     */
    let itemList = Utils.newList()
    items.allItems.forEach(item => {
        itemList.add(item.item)
    })
    let types = itemList.stream()
    .distinct()
    .filter(item => item.getFoodProperties() != null)
    .toList()
    .length
    for (let index = 0; index < items.slots; index++) {
        let element = items.getStackInSlot(index)
        let prop = element.getFoodProperties(player)
        if (prop != null) {
            
            let { nutrition, saturationModifier, effects } = prop
            let num = 1
            effects.forEach(eff => {
                let effect = eff.first
                num = num + 2 + effect.amplifier
            })
            let effMultipler = Math.sqrt(num)
            values += nutrition / baseNutrition * saturationModifier / baseSaturationModifier * effMultipler * element.count * 3 * Math.sqrt(types + 1)
            element.setCount(0)
        }
    }
    let coinValue = $CoinValue["fromNumber(java.lang.String,long)"](COIN_CHAIN_MAIN_VALUE, values)
    if (!coinValue.empty)
        player.tell(Component.translate("message.createdelight.sell_bin_hint", e.event.machine.pos.toShortString(), coinValue.getText().getString()))
    $MoneyAPI.API.GetPlayersMoneyHandler(player).insertMoney(coinValue, false)

})

ItemEvents.rightClicked(e => {
    // let prop = e.item.getFoodProperties(null)
    // if (prop == null)
    //     return
    // const { nutrition, saturationModifier, effects } = prop

    // e.player.tell(`${nutrition}, ${saturationModifier}`)
    // effects.forEach(eff => {
    //     let effect = eff.first
    //     let num = eff.second
    //     e.player.tell(`${effect.amplifier}, ${effect.duration}, ${num}`)
    // })
})