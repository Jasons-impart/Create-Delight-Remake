JEIEvents.addItems((e) => {
  e.add([
    'create_connected:fan_freezing_catalyst'
  ]);
});
JEIEvents.hideItems((e) => {
  e.hide([
    // 使用创造模式物品栏移除一直失败，被迫使用JEI隐藏。
    // 其他情况下，能用创造模式物品栏移除就用创造模式物品栏移除
    'createdeco:andesite_sheet',
    'createdeco:zinc_sheet',
    'createdeco:netherite_sheet',
    'createdeco:gold_coin',
    'createdeco:gold_coinstack',
    'createdeco:netherite_coin',
    'createdeco:netherite_coinstack',
    'createdeco:brass_coin',
    'createdeco:brass_coinstack',
    'createdeco:iron_coin',
    'createdeco:iron_coinstack',
    'createdeco:copper_coin',
    'createdeco:copper_coinstack',
    'createdeco:industrial_iron_coin',
    'createdeco:industrial_iron_coinstack',
    'createdeco:zinc_coin',
    'createdeco:zinc_coinstack',
    // 无法合成的箱装/压缩物品
    "fruitsdelight:apple_crate",
    // "quark:carrot_crate",
    "quark:potato_crate",
    "quark:beetroot_crate",
    "quark:apple_crate",
    "quark:golden_apple_crate",
    "quark:golden_carrot_crate",
    "quark:berry_sack",
    "quark:glowberry_sack",
    "quark:gunpowder_sack"
  ])
})