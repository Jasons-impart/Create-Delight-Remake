let TradeUtil = {}
/**
 * 
 * @param {Internal.VillagerTradingEventJS} e 
 * @param {Internal.VillagerProfession_} villager 
 * @param {[InputItem_[], InputItem_][]} trades
 * @param {number} index 
 */
TradeUtil.replaceVillageTradeIndex = function(e, villager, trades, index) {
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
TradeUtil.addVillageTradeIndex = function(e, villager, trades, index) {
   trades.forEach(trade => {
       e.addTrade(villager, index, trade[0], trade[1])
   }) 
}