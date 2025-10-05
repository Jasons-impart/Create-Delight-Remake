StartupEvents.registry("minecraft:creative_mode_tab", e => {
  e.create("seasonals:seasonals")
  .icon(() => Item.of("seasonals:pumpkin_puree"))
  .content(() => [
    'seasonals:pumpkin_ice_cream_block',
    'seasonals:sweet_berry_ice_cream_block',
    'seasonals:beetroot_ice_cream_block',
    'seasonals:pumpkin_puree',
    'seasonals:pumpkin_milkshake',
    'seasonals:pumpkin_ice_cream',
    'seasonals:pumpkin_cake',
    'seasonals:chocolate_pumpkin_muffin',
    'seasonals:pumpkin_adzuki_stew',
    'seasonals:sweet_berry_ice_cream',
    'seasonals:sweet_berry_milkshake',
    'seasonals:glazed_sweet_berries',
    'seasonals:sweet_berry_cake',
    'seasonals:sweet_berry_vanilla_yogurt',
    'seasonals:beetroot_milkshake',
    'seasonals:beetroot_ice_cream',
    'seasonals:beetroot_cake',
    'seasonals:roasted_beetroot',
    'seasonals:oxidized_beetroot',
    'seasonals:rabbit_roast',
    'seasonals:mixed_berry_muffin',
    'seasonals:red_velvet_cupcake',
    'seasonals:banana_split_sundae',
  ]).translationKey("itemGroup.seasonals.seasonals")
})