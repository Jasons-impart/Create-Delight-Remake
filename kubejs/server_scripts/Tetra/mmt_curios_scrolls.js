const mmtCuriosScrollRecipes = [
  ['storm_combat', '62d9ff', 'cataclysm:essence_of_the_storm', 'iceandfire:stymphalian_bird_feather', 'tetra:pristine_emerald'],
  ['hive_guard', 'f4bf45', 'the_bumblezone:royal_jelly_bottle', 'the_bumblezone:glistering_honey_crystal', 'the_bumblezone:bee_stinger'],
  ['path_emblems', 'b78cff', 'minecraft:dragon_breath', 'minecraft:ender_eye', 'tetra:dragon_sinew'],
  ['lunar_arcane', '9aa8ff', 'cataclysm:void_core', 'minecraft:echo_shard', 'tetra:pristine_amethyst'],
  ['mars_guard', 'c85b48', 'cataclysm:monstrous_horn', 'cataclysm:ancient_metal_ingot', 'iceandfire:dragonbone'],
  ['magnetic_precision', 'e64f9b', 'alexscaves:telecore', 'alexscaves:scarlet_neodymium_ingot', 'iceandfire:lightning_dragon_blood'],
  ['ancient_purification', '78b35a', 'blackknightarmor:sun_light_ingot', 'iceandfire:pixie_dust', 'alexscaves:occult_gem'],
  ['deep_relic', '315d83', 'blackknightarmor:ghoststeel_ingot', 'cataclysm:cursium_ingot', 'alexscaves:abyssmarine'],
  ['astral_dominion', 'd08cff', 'blackknightarmor:end_dragon_ingot', 'blackknightarmor:end_dragon_ingot', 'cataclysm:void_core']
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
