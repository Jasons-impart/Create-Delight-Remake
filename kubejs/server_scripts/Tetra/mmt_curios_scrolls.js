const mmtCuriosScrollRecipes = [
  ['storm_combat', '62d9ff', 'cataclysm:essence_of_the_storm', 'createdelight:forged_steel_sheet', 'tetra:pristine_emerald'],
  ['hive_guard', 'f4bf45', 'the_bumblezone:royal_jelly_bottle', 'the_bumblezone:glistering_honey_crystal', 'tetra:forged_mesh'],
  ['path_emblems', 'b78cff', 'minecraft:dragon_breath', 'northstar:circuit', 'tetra:dragon_sinew'],
  ['lunar_arcane', '9aa8ff', 'cataclysm:void_core', 'northstar:advanced_circuit', 'tetra:pristine_amethyst'],
  ['mars_guard', 'c85b48', 'cataclysm:monstrous_horn', 'northstar:martian_steel_ingot', 'createdelight:forged_steel_sheet'],
  ['magnetic_precision', 'e64f9b', 'alexscaves:telecore', 'northstar:advanced_circuit', 'cataclysm:ignitium_ingot'],
  ['ancient_purification', '78b35a', 'cataclysm:ancient_metal_ingot', 'alexscaves:radon_bottle', 'alexscaves:occult_gem'],
  ['deep_relic', '315d83', 'cataclysm:abyssal_egg', 'cataclysm:cursium_ingot', 'createdelight:sturdy_oxygen_tank'],
  ['astral_dominion', 'd08cff', 'blackknightarmor:ultimate_dragon_heart', 'ae2:singularity', 'cataclysm:void_crystal']
]

function mmtCuriosScroll(key, ribbon) {
  return Item.of('tetra:scroll_rolled', {
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
  })
}

ServerEvents.recipes(event => {
  mmtCuriosScrollRecipes.forEach(([key, ribbon, upper, sides, lower]) => {
    event.shaped(mmtCuriosScroll(key, ribbon), [
      ' B ',
      'CAC',
      ' D '
    ], {
      A: 'minecraft:writable_book',
      B: upper,
      C: sides,
      D: lower
    }).id(`createdelight:mmt_curios_scrolls/${key}`)
  })
})
