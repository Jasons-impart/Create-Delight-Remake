MoreJSEvents.villagerTrades(e => {
  e.removeModdedTrades(["bakeries:pistrinamaster"], 1)
  e.removeModdedTrades(["bakeries:pistrinamaster"], 2)
  e.removeModdedTrades(["bakeries:pistrinamaster"], 3)
  const trades = [
      ["8x createdelightcore:copper_coin", "2x vintagedelight:salt_dust"],
      ["4x createdelightcore:copper_coin", "2x bakeries:flour"],
      ["4x createdelightcore:copper_coin", "2x createdelight:corn_flour"],
  ]
  const trades_2 = [
      ["6x createdelightcore:copper_coin", "bakeries:bottle_yeast"],
      ["8x createdelightcore:copper_coin", "createdelight:dry_yeast"],
  ]
  const trades_3 = [
      ['4x createdelight:butter', "2x createdelightcore:copper_coin"],
      ['4x bakeries:brown_sugar_cube', "createdelightcore:copper_coin"],
      ['createdelight:whipped_cream_bowl', "createdelightcore:copper_coin"],
      ['bakeries:sweet_dough', "2x createdelightcore:copper_coin"],
      ['bakeries:round_bread_dough', "3x createdelightcore:copper_coin"],
      ['bakeries:baguette_dough', "3x createdelightcore:copper_coin"],
      ['bakeries:croissant_dough', "3x createdelightcore:copper_coin"],
  ]
  trades.forEach(trade => {
      e.addTrade("bakeries:pistrinamaster", 1, [trade[0]], trade[1])
  })
  trades_2.forEach(trade => {
      e.addTrade("bakeries:pistrinamaster", 2, [trade[0]], trade[1])
  })
  trades_3.forEach(trade => {
      e.addTrade("bakeries:pistrinamaster", 3, [trade[0]], trade[1])
  })

})
