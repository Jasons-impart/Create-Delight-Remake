ServerEvents.recipes(e => {
  e.recipes.kubejs.shapeless("alexsmobs:mosquito_repellent_stew", [
      "minecraft:bowl",
      "festival_delicacies:artemisia_argyi",
      "2x neapolitan:roasted_adzuki_beans"
  ]).id("alexsmobs:mosquito_repellent_stew_from_artemisia_argyi");
})

ServerEvents.recipes(e => {
  e.recipes.kubejs.shapeless(
    "createdelightcore:fragment_of_border",
    [
      "alexsmobs:shattered_dimensional_carver",
      "ae2:singularity",
    ]).keepIngredient("alexsmobs:shattered_dimensional_carver")
})
