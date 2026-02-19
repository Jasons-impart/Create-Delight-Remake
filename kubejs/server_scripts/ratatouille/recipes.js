ServerEvents.recipes(e => {
  remove_recipes_id(e, [
    "create:mixing/compost_test",
    "create:mixing/salt",
    "ratatouille:threshing/boil_stone",
    "create:sequenced_assembly/unprocessed_mature_matter",
    "create:sequenced_assembly/unprocessed_ripen_matter",
    "ratatouille:composting/composting"
  ])
  const { create, createdieselgenerators } = e.recipes
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
  e.forEachRecipe({output: "ratatouille:compost_mass"}, recipe => {
    let ingredients = []
    let id_split = recipe.getId().split("/")[1]
    recipe.getOriginalRecipeIngredients().forEach(ing => {
      let count = 1
      if (id_split.endsWith("4to1"))
        count = 4
      else if (id_split.endsWith("2to1"))
        count = 2
      ingredients.push(Ingredient.of(ing, count))
    })
    create.mixing(Item.of("createaddition:biomass", recipe.getOriginalRecipeResult().count), ingredients)
    .id(`createdelight:mixing/${id_split}`)
  })
  remove_recipes_output(e, [
    "ratatouille:compost_mass"
  ])
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