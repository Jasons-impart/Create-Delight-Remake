MoreJSEvents.villagerTrades(e => {
  TradeUtil.replaceVillageTradeIndex(e, "vinery:winemaker", [
    [["createdelightcore:gold_coin"], "vinery:straw_hat"],
    [["createdelightcore:gold_coin"], "vinery:winemaker_apron"],
    [["createdelightcore:gold_coin"], "vinery:winemaker_leggings"],
    [["createdelightcore:gold_coin"], "vinery:winemaker_boots"],
  ], 4)
  TradeUtil.replaceVillageTradeIndex(e, "vinery:winemaker", [
    [["createdelightcore:gold_coin"], "vinery:clark_wine"],
    [["createdelightcore:gold_coin"], "vinery:lilitu_wine"],
    [["createdelightcore:gold_coin"], "vinery:jellie_wine"],
    [["createdelightcore:netherite_coin"], "vinery:vinery_standard"],
  ], 5)
})