MoreJSEvents.villagerTrades(e => {
  e.removeModdedTrades(["vinery:winemaker"], 4)
  e.removeModdedTrades(["vinery:winemaker"], 5)
  const trades_4 = [
    ["createdelightcore:gold_coin", "vinery:straw_hat"],
    ["createdelightcore:gold_coin", "vinery:winemaker_apron"],
    ["createdelightcore:gold_coin", "vinery:winemaker_leggings"],
    ["createdelightcore:gold_coin", "vinery:winemaker_boots"],
  ]
  const trades_5 = [
    ["createdelightcore:gold_coin", "vinery:clark_wine"],
    ["createdelightcore:gold_coin", "vinery:lilitu_wine"],
    ["createdelightcore:gold_coin", "vinery:jellie_wine"],
    ["createdelightcore:netherite_coin", "vinery:vinery_standard"],
  ]
  trades_4.forEach(trade => {
    e.addTrade("vinery:winemaker", 4, [trade[0]], trade[1])
  })
  trades_5.forEach(trade => {
    e.addTrade("vinery:winemaker", 5, [trade[0]], trade[1])
  })
})