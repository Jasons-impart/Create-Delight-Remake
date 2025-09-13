JEIEvents.addItems(e => {
  e.add([
    'create_connected:fan_freezing_catalyst'
  ])
})
JEIEvents.addFluids(e => {
  e.add([
    "minecraft:milk"
  ])
})
JEIEvents.hideItems(e => {
  e.hide([
    // 使用创造模式物品栏移除一直失败，被迫使用JEI隐藏。
    // 其他情况下，能用创造模式物品栏移除就用创造模式物品栏移除
    'createdeco:gold_coinstack',
    'createdeco:netherite_coinstack',
    'createdeco:brass_coin',
    'createdeco:brass_coinstack',
    'createdeco:iron_coinstack',
    'createdeco:copper_coinstack',
    'createdeco:industrial_iron_coin',
    'createdeco:industrial_iron_coinstack',
    'createdeco:zinc_coin',
    'createdeco:zinc_coinstack',
  ])
})