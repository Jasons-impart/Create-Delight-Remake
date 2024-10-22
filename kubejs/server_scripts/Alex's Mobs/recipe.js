ServerEvents.recipes((e) => {
  e.recipes.kubejs
    .shapeless("alexsmobs:mosquito_repellent_stew", [
      "minecraft:bowl",
      "festival_delicacies:artemisia_argyi",
    ])
    .id("alexsmobs:mosquito_repellent_stew_from_artemisia_argyi");
});

ServerEvents.recipes((event) => {
  const { create, kubejs } = event.recipes;
  kubejs
    .shapeless("createdelight:fragment_of_border", [
      "alexsmobs:shattered_dimensional_carver",
      "ae2:singularity",
    ])
    .keepIngredient("alexsmobs:shattered_dimensional_carver");
});
