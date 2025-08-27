ServerEvents.recipes(e => {
  e.recipes.kubejs.shapeless("alexsmobs:mosquito_repellent_stew", [
    "minecraft:bowl",
    "festival_delicacies:artemisia_argyi",
    "2x neapolitan:roasted_adzuki_beans"
  ]).id("alexsmobs:mosquito_repellent_stew_from_artemisia_argyi");
  e.recipes.kubejs.shapeless(
  "createdelightcore:fragment_of_border",
  [
    "alexsmobs:shattered_dimensional_carver",
    "ae2:singularity",
  ]).keepIngredient("alexsmobs:shattered_dimensional_carver").id("createdelightcore:fragment_of_border_from_shattered_dimensional_carver")
  e.recipes.kubejs.shapeless(
    'alexsmobs:kangaroo_burger',
    [
      'some_assembly_required:burger_bun',
      "2x #alexsdelight:cooked_kangaroo",
      "#forge:salad_ingredients/cabbage",
      "minecraft:carrot"
    ]
  ).id("alexsmobs:kangaroo_burger")
  remove_recipes_id(e, [
    "alexsmobs:banana_crate",
    "alexsmobs:bananas"
  ])
})
