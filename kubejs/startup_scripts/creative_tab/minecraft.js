StartupEvents.modifyCreativeTab("minecraft:food_and_drinks", e => {
  e.remove([
    'farmersrespite:coffee',
    'farmersrespite:long_coffee',
    'farmersrespite:strong_coffee',
  ])
})
StartupEvents.modifyCreativeTab("minecraft:ingredients", e => {
  e.remove([
    'dreadsteel:dreadsteel_ingot',
    'dreadsteel:kit_default',
    'dreadsteel:kit_white',
    'dreadsteel:kit_black',
    'dreadsteel:kit_bronze',
  ])
})
StartupEvents.modifyCreativeTab("minecraft:redstone_blocks", e => {
  e.remove([
    'mbd2:mbd_gadgets'
  ])
})
StartupEvents.modifyCreativeTab("minecraft:functional_blocks", e => {
  e.remove([
    "quark:iron_ladder",
  ]) 
})
StartupEvents.modifyCreativeTab("minecraft:building_blocks", e => {
  e.remove([
    'protection_pixel:openedmaneuveringwing',
  ])
})