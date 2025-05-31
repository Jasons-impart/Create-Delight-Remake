ServerEvents.recipes(e => {
  const { minecraft } = e.recipes
  e.replaceInput({id: "ad_astra:space_helmet"}, "ad_astra:steel_plate", "createdelight:aviation_fibers_sheet")
  e.replaceInput({id: "ad_astra:space_suit"}, "ad_astra:steel_plate", "createdelight:aviation_fibers_sheet")
  e.replaceInput({id: "ad_astra:space_pants"}, "ad_astra:steel_plate", "createdelight:aviation_fibers_sheet")
  e.replaceInput({id: "ad_astra:space_boots"}, "ad_astra:steel_plate", "createdelight:aviation_fibers_sheet")
  minecraft.smithing_transform(
    'ad_astra:netherite_space_helmet',
    'minecraft:netherite_upgrade_smithing_template',
    "ad_astra:space_helmet",
    'minecraft:netherite_helmet'
  ).id("ad_astra:netherite_space_helmet")
  minecraft.smithing_transform(
    'ad_astra:netherite_space_suit',
   'minecraft:netherite_upgrade_smithing_template',
    "ad_astra:space_suit",
   'minecraft:netherite_chestplate'
  ).id("ad_astra:netherite_space_suit")
  minecraft.smithing_transform(
    'ad_astra:netherite_space_pants',
  'minecraft:netherite_upgrade_smithing_template',
    "ad_astra:space_pants",
  'minecraft:netherite_leggings'
  ).id("ad_astra:netherite_space_pants")
  minecraft.smithing_transform(
    'ad_astra:netherite_space_boots',
 'minecraft:netherite_upgrade_smithing_template',
    "ad_astra:space_boots",
 'minecraft:netherite_boots'
  ).id("ad_astra:netherite_space_boots")

})