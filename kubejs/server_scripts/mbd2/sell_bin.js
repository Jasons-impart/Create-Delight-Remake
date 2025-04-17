
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
    if (e.event.machine.level.dayTime() != 1000) return

    let player = e.event.machine.level.getPlayerByUUID(e.event.machine.customData.getUUID("owner"))
    if (player == null)
        return
    let items = e.event.machine.getCapability(ForgeCapabilities.ITEM_HANDLER).orElse(null)
    let values = 0
    TradeUtil.getTradeAPI().GetTrader(false, 4).getTradeData().forEach(tradeData => {
        /**@type {Internal.ItemTradeData} */
        let itemTradeData = tradeData
        let first = itemTradeData.getSellItem(0)
        let second = itemTradeData.getSellItem(1)

        // 定义减少物品的函数
        /**
         * 
         * @param {Internal.ItemStack} item 
         * @returns {Internal.ItemStack}
         */
        function getItem(item) {
            if (item.empty) return false; // 如果物品为空，直接返回 false

            let slot = items.find(item); // 查找物品所在槽位
            if (slot == -1) return false; // 如果没有找到，返回 false
            if (items.getStackInSlot(slot).count >= item.count) {
                return items.getStackInSlot(slot)
            }
            return false
        }
        // 循环减少物品
        while (true) {
            let decreasedFirst = getItem(first)
            let decreasedSecond = getItem(second)
            let firstQuality = $QualityUtils.getQuality(decreasedFirst)
            let secondQuality = $QualityUtils.getQuality(decreasedSecond)
            // 如果两个物品都无法减少，结束循环
            if (!(decreasedFirst || decreasedSecond)) {
                break;
            }
            if (typeof decreasedFirst != "boolean")
                decreasedFirst.shrink(first.count)
            if (typeof decreasedSecond != "boolean")
                decreasedSecond.shrink(second.count)

            let multiplier = JavaMath.floor(JavaMath.sqrt(2 / (
                (firstQuality.level() != 0 ? $QualityConfig.getChance(firstQuality) : 1)
                 + (firstQuality.level() != 0 ? $QualityConfig.getChance(secondQuality) : 1))) + 0.5)
            values += multiplier * tradeData.getCost().coreValue * 4
        }

    })
    let coinValue = $CoinValue["fromNumber(java.lang.String,long)"](COIN_CHAIN_MAIN_VALUE, values)
    // todo: 改成i18n
    player.tell(Component.ofString(`你出售了出货箱中的内容，你获得了${coinValue.getText().getString()}`))
    $MoneyAPI.API.GetPlayersMoneyHandler(player).insertMoney(coinValue, false)

})