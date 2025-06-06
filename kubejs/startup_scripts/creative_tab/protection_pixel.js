StartupEvents.modifyCreativeTab("protection_pixel:pp", e => {
  e.add([
    Item.of('createdelight:fire_dragonsteel_armorplate', '{Damage:0,armor:2.5d,toughness:1.5d,weight:1.5d}'),
    Item.of('createdelight:ice_dragonsteel_armorplate', '{Damage:0,armor:2.5d,toughness:1.5d,weight:1.5d}'),
    Item.of('createdelight:lightning_dragonsteel_armorplate', '{Damage:0,armor:2.5d,toughness:1.5d,weight:1.5d}')
  ])
  e.remove([
    'protection_pixel:hookcannon',
    'protection_pixel:hookitem',
    'protection_pixel:suspjetpack',
    'protection_pixel:chestplatelining'
  ])
})
