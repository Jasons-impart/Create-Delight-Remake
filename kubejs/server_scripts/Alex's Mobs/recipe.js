ServerEvents.recipes(e => {
  e.recipes.kubejs.shapeless("alexsmobs:mosquito_repellent_stew", [
    "minecraft:bowl",
    "festival_delicacies:mugwort",
    "2x neapolitan:roasted_adzuki_beans"
  ]).id("createdelight:mosquito_repellent_stew_from_artemisia_argyi");
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
  ).id("createdelight:kangaroo_burger")
  remove_recipes_id(e, [
    "alexsmobs:banana_crate",
    "alexsmobs:bananas",
    "alexsmobs:mosquito_repellent_stew",
    "alexsmobs:kangaroo_burger"
  ])

  if (Platform.isLoaded("alexsdelight") && Platform.isLoaded("amfd")) {
    e.remove({ id: "alexsdelight:barbecue_on_a_stick" })
    e.recipes.kubejs.shapeless(
      "2x farmersdelight:barbecue_stick",
      [
        "farmersdelight:tomato",
        "farmersdelight:onion",
        "amfd:singular_cooked_moose_rib",
        "minecraft:cooked_chicken",
        "minecraft:stick",
        "minecraft:stick"
      ]
    ).id("alexsdelight:barbecue_on_a_stick")
  }
})
