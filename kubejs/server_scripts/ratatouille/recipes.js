ServerEvents.recipes(e => {
  remove_recipes_id(e, [
    "create:mixing/compost_test",
    "create:mixing/salt",
    "create:mixing/mince_meat",
    "create:mixing/salty_dough",
    "create:mixing/cake_batter",
    "create:filling/cake_mold_filled",
    "create:emptying/yolk",
    "ratatouille:threshing/boil_stone",
    "ratatouille:squeezing/raw_sausage",
    "create:sequenced_assembly/unprocessed_mature_matter",
    "create:sequenced_assembly/unprocessed_ripen_matter",
    "ratatouille:composting/composting",
    "ratatouille:compost_tower",
  ])
  const { create, createdieselgenerators } = e.recipes;
  // remove_recipes_input(e, [
  //   'ratatouille:ripen_matter',
  //   'ratatouille:ripen_matter_fold',
  //   'ratatouille:compost_mass',
  //   'ratatouille:bio_gas_bucket',
  //   'ratatouille:compost_tea_bucket',
  //   'ratatouille:bio_gas',
  //   'ratatouille:compost_tea',
  //   'ratatouille:compost_residue_fluid',
  // ])
  // remove_recipes_output(e, [
  //   'ratatouille:ripen_matter',
  //   'ratatouille:ripen_matter_fold',
  //   'ratatouille:compost_mass',
  //   'ratatouille:bio_gas_bucket',
  //   'ratatouille:compost_tea_bucket',
  //   'ratatouille:bio_gas',
  //   'ratatouille:compost_tea',
  //   'ratatouille:compost_residue_fluid',
  // ])
  [
    ["compost_mass_1to1", "1x createaddition:biomass", [Ingredient.of("#ratatouille:compostable_items_1to1")]],
    ["compost_mass_1to4", "4x createaddition:biomass", [Ingredient.of("#ratatouille:compostable_items_1to4")]],
    ["compost_mass_1to9", "9x createaddition:biomass", ["minecraft:melon"]],
    ["compost_mass_2to1", "createaddition:biomass", [Ingredient.of("#ratatouille:compostable_items_2to1", 2)]],
    ["compost_mass_4to1", "createaddition:biomass", [Ingredient.of("#ratatouille:compostable_items_4to1", 4)]],
  ].forEach(recipe => {
    create.mixing(recipe[1], recipe[2])
      .id(`createdelight:mixing/${recipe[0]}`)
    e.remove({ id: `ratatouille:squeezing/${recipe[0]}` })
  })
  e.replaceInput({}, "ratatouille:compost_mass", "createaddition:biomass")
  remove_recipes_type(e, ["ratatouille:composting"])
  {
    let iner = "ratatouille:unprocessed_mature_matter_fold"
    create.sequenced_assembly("ratatouille:mature_matter_fold", "ratatouille:compost_residue", [
      create.filling(iner, [iner, Fluid.of("create:potion", 100, { Bottle: "REGULAR", Potion: "youkaishomecoming:aphrodisiac" })]),
      create.pressing(iner, iner)
    ])
    .loops(1)
    .transitionalItem(iner)
    .id("createdelight:sequenced_assembly/mature_matter_fold")
  }
  {
    let iner = "ratatouille:unprocessed_ripen_matter_fold"
    create.sequenced_assembly("ratatouille:ripen_matter_fold", "ratatouille:compost_residue", [
      create.filling(iner, [iner, Fluid.of("ratatouille:compost_tea", 100)]),
      create.pressing(iner, iner)
    ])
    .loops(1)
    .transitionalItem(iner)
    .id("createdelight:sequenced_assembly/ripen_matter_fold")
  }

  createdieselgenerators.distillation([
    Fluid.of("ratatouille:compost_residue_fluid", 60),
    Fluid.of("ratatouille:compost_tea", 30),
    Fluid.of("ratatouille:bio_gas", 10)
  ], Fluid.of("ratatouille:compost_fluid", 100))
  .processingTime(100)
  .heatRequirement("heated")
  .id("createdelight:distillation/compost_fluid")
  
  create.compacting(Fluid.of("ratatouille:compost_fluid", 100), "createaddition:biomass")
  .superheated()
  .id("createdelight:compacting/compost_fluid")
})
