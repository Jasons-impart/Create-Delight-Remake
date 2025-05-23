const $TraderAPI = Java.loadClass("io.github.lightman314.lightmanscurrency.api.traders.TraderAPI")
const $TraderData = Java.loadClass("io.github.lightman314.lightmanscurrency.api.traders.TraderData")
const $ItemTradeData = Java.loadClass("io.github.lightman314.lightmanscurrency.common.traders.item.tradedata.ItemTradeData")
const $QualityUtils = Java.loadClass("de.cadentem.quality_food.util.QualityUtils")
const $QualityConfig = Java.loadClass("de.cadentem.quality_food.config.QualityConfig")

let TradeUtil = {}
/**
 * 
 * @param {Internal.VillagerTradingEventJS} e 
 * @param {Internal.VillagerProfession_} villager 
 * @param {[InputItem_[], InputItem_][]} trades
 * @param {number} index 
 */
TradeUtil.replaceVillageTradeIndex = function (e, villager, trades, index) {
    // if (villager.startsWith("minecraft:") || !villager.includes(":"))
    //     e.removeVanillaTrades([villager], index)
    // else
    e.removeModdedTrades([villager], index)
    this.addVillageTradeIndex(e, villager, trades, index)
}
/**
 * 
 * @param {Internal.VillagerTradingEventJS} e 
 * @param {Internal.VillagerProfession_} villager 
 * @param {[InputItem_[], InputItem_][]} trades
 * @param {number} index 
 */
TradeUtil.addVillageTradeIndex = function (e, villager, trades, index) {
    trades.forEach(trade => {
        e.addTrade(villager, index, trade[0], trade[1])
    })
}
/**
 * 
 * @returns {Internal.TraderAPIImpl}
 */
TradeUtil.getTradeAPI = function () {
    return $TraderAPI.API
}

ItemEvents.rightClicked("minecraft:stick", e => {
    // let trader = TradeUtil.getTradeAPI().GetTrader(false, 4)
})
