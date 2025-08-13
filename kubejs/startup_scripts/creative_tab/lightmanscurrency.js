// 货币系统
StartupEvents.modifyCreativeTab("lightmanscurrency:machines", e => {
    e.remove([
      'lightmanscurrency:coinmint',
    ])
  })
StartupEvents.modifyCreativeTab("lightmanscurrency:coins", e => {
  e.remove([
    'lightmanscurrency:coin_diamond',
    "lightmanscurrency:coinpile_copper",
    "lightmanscurrency:coinpile_iron",
    "lightmanscurrency:coinpile_gold",
    "lightmanscurrency:coinpile_emerald",
    "lightmanscurrency:coinpile_diamond",
    "lightmanscurrency:coinpile_netherite",
    'lightmanscurrency:coinblock_copper',
    'lightmanscurrency:coinblock_iron',
    'lightmanscurrency:coinblock_gold',
    'lightmanscurrency:coinblock_emerald',
    'lightmanscurrency:coinblock_diamond',
    'lightmanscurrency:coinblock_netherite',
    'lightmanscurrency:coin_chocolate_copper',
    'lightmanscurrency:coinpile_chocolate_copper',
    'lightmanscurrency:coinblock_chocolate_copper',
    'lightmanscurrency:coin_chocolate_iron',
    'lightmanscurrency:coinpile_chocolate_iron',
    'lightmanscurrency:coinblock_chocolate_iron',
    'lightmanscurrency:coin_chocolate_gold',
    'lightmanscurrency:coinpile_chocolate_gold',
    'lightmanscurrency:coinblock_chocolate_gold',
    'lightmanscurrency:coin_chocolate_emerald',
    'lightmanscurrency:coinpile_chocolate_emerald',
    'lightmanscurrency:coinblock_chocolate_emerald',
    'lightmanscurrency:coin_chocolate_diamond',
    'lightmanscurrency:coinpile_chocolate_diamond',
    'lightmanscurrency:coinblock_chocolate_diamond',
    'lightmanscurrency:coin_chocolate_netherite',
    'lightmanscurrency:coinpile_chocolate_netherite',
    'lightmanscurrency:coinblock_chocolate_netherite',
  ])
  e.add([
    'lightmanscurrency:offer_upgrade_1',
    'lightmanscurrency:offer_upgrade_2',
    'lightmanscurrency:offer_upgrade_3',
    'lightmanscurrency:offer_upgrade_4',
    'lightmanscurrency:offer_upgrade_5',
    'lightmanscurrency:offer_upgrade_6',
  ])
})
 
  