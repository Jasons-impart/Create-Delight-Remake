ServerEvents.tags("item", (e) => {
  e.add("forge:fermentable", ["createaddition:biomass"]);
});
ServerEvents.recipes((e) => {
  remove_recipes_id(e, ["createdieselgenerators:crafting/engine_piston_from_rods"]);
  // 替换安山合金
  e.replaceInput(
    { mod: "createdieselgenerators", not: "createdieselgenerators:crafting/basin_lid" },
    "create:andesite_alloy",
    "#forge:ingots/steel"
  );
  e.replaceInput(
    { id: "createdieselgenerators:crafting/basin_lid" },
    "create:andesite_alloy",
    "#forge:ingots/cast_iron"
  );
  e.replaceInput({ mod: "createdieselgenerators" }, "create:propeller", "ad_astra:fan");
  e.custom({
    type: "minecraft:crafting_shaped",
    pattern: ["BBB", "PCP", "AIA"],
    key: {
      A: {
        tag: "forge:ingots/steel",
      },
      B: {
        tag: "forge:plates/steel",
      },
      I: {
        tag: "forge:plates/iron",
      },
      C: {
        item: "minecraft:clock",
      },
      P: {
        item: "create:fluid_pipe",
      },
    },
    result: {
      item: "createdieselgenerators:distillation_controller",
      count: 10,
    },
  }).id("createdieselgenerators:crafting/distillation_controller");
  let iner = "createdelight:incomplete_diesel_engine";
  e.recipes.create
    .sequenced_assembly(
      "createdieselgenerators:diesel_engine",
      "minecraft:polished_blackstone_slab",
      [
        e.recipes.create.deploying(iner, [iner, "#forge:storage_blocks/bronze"]),
        e.recipes.create.deploying(iner, [iner, "minecraft:flint_and_steel"]),
        e.recipes.create.deploying(iner, [iner, "createdieselgenerators:engine_piston"]),
        e.recipes.create.deploying(iner, [iner, "minecraft:flint_and_steel"]),
        e.recipes.create.deploying(iner, [iner, "createdieselgenerators:engine_piston"]),
        e.recipes.create.deploying(iner, [iner, "create:shaft"]),
      ]
    )
    .transitionalItem(iner)
    .loops(1)
    .id("createdieselgenerators:crafting/diesel_engine");
  let iner2 = "createdelight:incomplete_large_diesel_engine";
  e.recipes.create
    .sequenced_assembly(
      "createdieselgenerators:large_diesel_engine",
      "createdieselgenerators:diesel_engine",
      [
        e.recipes.create.deploying(iner2, [iner2, "#forge:plates/bronze"]),
        e.recipes.create.pressing(iner2, iner2),
      ]
    )
    .transitionalItem(iner2)
    .loops(3)
    .id("createdieselgenerators:crafting/large_diesel_engine");
  let iner3 = "createdelight:incomplete_huge_diesel_engine";
  e.recipes.create
    .sequenced_assembly(
      "createdieselgenerators:huge_diesel_engine",
      "#forge:storage_blocks/bronze",
      [
        e.recipes.vintageimprovements.turning(iner3, iner3),
        e.recipes.create.deploying(iner3, [iner3, "create:steam_engine"]),
        e.recipes.create.deploying(iner3, [iner3, "#forge:plates/steel"]),
        e.recipes.create.deploying(iner3, [iner3, "create:steam_engine"]),
        e.recipes.create.deploying(iner3, [iner3, "#forge:plates/steel"]),
        e.recipes.create.pressing(iner3, iner3),
      ]
    )
    .transitionalItem(iner3)
    .loops(1)
    .id("createdieselgenerators:crafting/huge_diesel_engine");
  e.recipes.vintageimprovements
    .turning("3x createdieselgenerators:oil_barrel", "#forge:storage_blocks/steel")
    .id("createdieselgenerators:crafting/oil_barrel");
  e.custom({
    type: "createdieselgenerators:basin_fermenting",
    ingredients: [
      {
        tag: "minecraft:coals",
      },
    ],
    processingTime: 200,
    results: [
      {
        item: "vintageimprovements:sulfur_chunk",
      },
      {
        item: "vintageimprovements:sulfur_chunk",
        chance: 0.25,
      },
    ],
    heatRequirement: "heated",
  }).id("createdieselgenerators:basin_fermenting/coals");
});

ServerEvents.recipes((event) => {
  const { kubejs } = event.recipes;
  kubejs.shapeless("createdieselgenerators:lighter", "createdieselgenerators:lighter");
});
