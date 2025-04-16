MoreJSEvents.villagerTrades(e => {
  TradeUtil.replaceVillageTradeIndex(e, "minecraft:farmer", [
    [['32x minecraft:wheat'], "createdelightcore:copper_coin"],
    [['32x vintagedelight:oat'], "createdelightcore:copper_coin"],
    [['32x farmersdelight:rice_panicle'], "createdelightcore:copper_coin"],
    [['32x culturaldelights:corn_cob'], "createdelightcore:copper_coin"],
    [['32x minecraft:potato'], "createdelightcore:copper_coin"],
    [['32x minecraft:carrot'], "createdelightcore:copper_coin"],
    [['32x minecraft:beetroot'], "createdelightcore:copper_coin"],
    [['32x frycooks_delight:canola'], "createdelightcore:copper_coin"],
    [['32x vintagedelight:peanut'], "createdelightcore:copper_coin"],
    [['16x vintagedelight:cucumber'], "createdelightcore:copper_coin"],
    [['16x culturaldelights:eggplant'], "createdelightcore:copper_coin"],
    [['16x festival_delicacies:eggplant'], "createdelightcore:copper_coin"],
    [['16x farmersdelight:tomato'], "createdelightcore:copper_coin"],
    [['16x farmersdelight:onion'], "createdelightcore:copper_coin"],
    [['16x festival_delicacies:greenonion'], "createdelightcore:copper_coin"],
    [['16x vintagedelight:ghost_pepper'], "createdelightcore:copper_coin"],
    [["createdelightcore:copper_coin"], '8x minecraft:bread'],
    [["createdelightcore:gold_coin"], 'hotbath:bath_herb'],
  ], 1)
  TradeUtil.addVillageTradeIndex(e, "minecraft:farmer", [
    [['16x festival_delicacies:chinese_cabbage'], "createdelightcore:copper_coin"],
  ], 2)
  TradeUtil.replaceVillageTradeIndex(e, "minecraft:farmer", [
    [['4x minecraft:melon'], "2x createdelightcore:copper_coin"],
    [['8x neapolitan:banana'], "2x createdelightcore:copper_coin"],
    [['22x supplementaries:flax_seeds'], "createdelightcore:copper_coin"],
    [["3x createdelightcore:copper_coin"], '18x minecraft:cookie'],
    [["3x createdelightcore:copper_coin"], '12x neapolitan:strawberry_scones'],
  ], 3)
})