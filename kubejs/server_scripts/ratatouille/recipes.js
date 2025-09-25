ServerEvents.recipes(e => {
  remove_recipes_id(e, [
    "create:mixing/compost_test",
    "create:mixing/salt",
    "ratatouille:threshing/boil_stone"
  ])
  remove_recipes_input(e, [
    'ratatouille:ripen_matter',
    'ratatouille:ripen_matter_fold',
    'ratatouille:compost_mass',
    'ratatouille:bio_gas_bucket',
    'ratatouille:compost_tea_bucket',
    'ratatouille:bio_gas',
    'ratatouille:compost_tea',
    'ratatouille:compost_residue_fluid',
  ])
  remove_recipes_output(e, [
    'ratatouille:ripen_matter',
    'ratatouille:ripen_matter_fold',
    'ratatouille:compost_mass',
    'ratatouille:bio_gas_bucket',
    'ratatouille:compost_tea_bucket',
    'ratatouille:bio_gas',
    'ratatouille:compost_tea',
    'ratatouille:compost_residue_fluid',
  ])

  // 上面删除催熟素生产的相关配方，改为骨粉+生物质合成催熟素
  e.shapeless('ratatouille:ripen_matter', ['minecraft:bone_meal', 'createaddition:biomass'])
})