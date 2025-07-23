MoreJSEvents.villagerTrades(e => {
  TradeUtil.replaceVillageTradeIndex(e, "bakeries:pistrinamaster", [
    [["8x createdelightcore:copper_coin"], "2x vintagedelight:salt_dust"],
    [["4x createdelightcore:copper_coin"], "2x bakeries:flour"],
    [["4x createdelightcore:copper_coin"], "2x createdelight:corn_flour"]
  ], 1)
  TradeUtil.replaceVillageTradeIndex(e, "bakeries:pistrinamaster", [
    [["6x createdelightcore:copper_coin"], "bakeries:bottle_yeast"],
    [["8x createdelightcore:copper_coin"], "createdelight:dry_yeast"],
  ], 2)
  TradeUtil.replaceVillageTradeIndex(e, "bakeries:pistrinamaster", [
    [['4x createdelight:butter'], "2x createdelightcore:copper_coin"],
    [['4x bakeries:brown_sugar_cube'], "createdelightcore:copper_coin"],
    [['cosmopolitan:cream'], "createdelightcore:copper_coin"],
    [['bakeries:foamed_cream'], "createdelightcore:copper_coin"],
    [['bakeries:sweet_dough'], "2x createdelightcore:copper_coin"],
    [['bakeries:round_bread_dough'], "3x createdelightcore:copper_coin"],
    [['bakeries:baguette_dough'], "3x createdelightcore:copper_coin"],
    [['bakeries:croissant_dough'], "3x createdelightcore:copper_coin"],
  ], 3)
})
