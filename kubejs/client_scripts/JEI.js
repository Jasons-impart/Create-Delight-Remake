const forcedJeiItems = [
  'create_connected:fan_freezing_catalyst'
]

// Create Connected 给该触媒加了兼容模组条件，进入世界后刷新可见性时会把它判成 disabled。
// 当前整合包并没有这些兼容模组，直接移除条件即可避免 JEI 和创造搜索被再次过滤。
forcedJeiItems.forEach(id => {
  global.CDClientJavaClasses.$FeatureToggle.FEATURE_CONDITIONS.remove(new global.CDClientJavaClasses.$ResourceLocation(id))
})

JEIEvents.addItems(e => {
  e.add(forcedJeiItems)
  e.add([
    ['storm_combat', '62d9ff'],
    ['hive_guard', 'f4bf45'],
    ['path_emblems', 'b78cff'],
    ['lunar_arcane', '9aa8ff'],
    ['mars_guard', 'c85b48'],
    ['magnetic_precision', 'e64f9b'],
    ['ancient_purification', '78b35a'],
    ['deep_relic', '315d83'],
    ['astral_dominion', 'd08cff']
  ].map(([key, ribbon]) => Item.of('tetra:scroll_rolled', {
    BlockEntityTag: {
      data: [{
        key: `mmt_curios/${key}`,
        schematics: [`createdelight:mmt_curios/${key}`],
        intricate: false,
        material: 2,
        ribbon: ribbon,
        glyphs: [3, 8, 1, 4]
      }]
    }
  })))
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

    // MMT 禁用材料 - JEI 隐藏
    'more_mod_tetra:fake_rose_golden_silk',
    'more_mod_tetra:fake_silky_cloth',
    'more_mod_tetra:bone_ingot',
    'more_mod_tetra:tidal_ingot',
    'more_mod_tetra:sacrifice_stone',
    'more_mod_tetra:bokushuu_ingot',
    'more_mod_tetra:bokuka_ingot',
    'more_mod_tetra:rennshi_ingot',
    'more_mod_tetra:blaze_ingot',
    'more_mod_tetra:blue_ice_ingot',
    'more_mod_tetra:electro_charged_ingot',
    'more_mod_tetra:dragon_breath_ingot',
    'more_mod_tetra:fake_alumite_ingot',
    'more_mod_tetra:fake_manyullyn_ingot',
    'more_mod_tetra:fake_hepatizon_ingot',
    'more_mod_tetra:fake_rose_gold_ingot',
    'more_mod_tetra:fake_pig_iron_ingot',
    'more_mod_tetra:abyssal_ocean_ingot',
    'more_mod_tetra:wither_ingot',
    'more_mod_tetra:rotten_flesh_ingot',
    'more_mod_tetra:wither_bone_ingot',
  ])
})
JEIEvents.hideFluids(e => {
  // 三氧化硫已并入氧化硫（fluid.vintageimprovements.sulfur_dioxide）。
  // 它没有物品形态（无桶装物品），创造标签无条目可移除，故直接在 JEI 隐藏流体。
  // OEI 为物品域合并，同样覆盖不到该流体。
  e.hide('vintageimprovements:sulfur_trioxide')
})
