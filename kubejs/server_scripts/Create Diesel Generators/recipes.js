ServerEvents.recipes((e) => {
  remove_recipes_id(e, [
    "createdieselgenerators:crafting/engine_piston_from_rods",
    "createdieselgenerators:compacting/plant_oil",
    "createdieselgenerators:basin_fermenting/dough"
  ]);
  e.replaceInput({ mod: "createdieselgenerators", not: "createdieselgenerators:crafting/basin_lid" }, "create:andesite_alloy", "#forge:ingots/steel")
  e.replaceInput({ id: "createdieselgenerators:crafting/basin_lid" }, "create:andesite_alloy", "#forge:ingots/cast_iron")
  e.replaceInput({ id: "createdieselgenerators:basin_fermenting/fermentable" }, "minecraft:bone_meal", "createdelight:dry_yeast")
  e.replaceInput({ mod: "createdieselgenerators" }, "create:propeller", "ad_astra:fan")
  e.recipes.createdieselgenerators.basin_fermenting(
    Fluid.of("createdieselgenerators:ethanol", 250),
    [
      'createaddition:biomass',
      "createdelight:dry_yeast"
    ]
  ).id("createdieselgenerators:basin_fermenting/biomass")
  e.recipes.createdieselgenerators.basin_fermenting(
    [
      Fluid.of("createdieselgenerators:ethanol", 100),
      "minecraft:fermented_spider_eye"
    ],
    [
      "minecraft:spider_eye",
      "minecraft:sugar",
      "createdelight:dry_yeast",
      Fluid.water(100)
    ]
  ).id("createdieselgenerators:basin_fermenting/fermented_spider_eye")
  e.recipes.kubejs.shaped(
    "9x createdieselgenerators:distillation_controller",
    [
      "BBB",
      "PCP",
      "AIA"
    ], {
      A: "#forge:ingots/steel",
      B: "#forge:plates/steel",
      I: "#forge:plates/iron",
      C: "minecraft:clock",
      P: "create:fluid_pipe"
    }
  ).id("createdieselgenerators:crafting/distillation_controller")

  let iner = "createdelight:incomplete_diesel_engine"
  e.recipes.create.sequenced_assembly("createdieselgenerators:diesel_engine", "minecraft:polished_blackstone_slab",
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
  e.recipes.create.sequenced_assembly("createdieselgenerators:large_diesel_engine", "createdieselgenerators:diesel_engine",
      [
        e.recipes.create.deploying(iner2, [iner2, "#forge:plates/bronze"]),
        e.recipes.create.pressing(iner2, iner2),
      ]
    )
      .transitionalItem(iner2)
      .loops(3)
      .id("createdieselgenerators:crafting/large_diesel_engine");
  let iner3 = "createdelight:incomplete_huge_diesel_engine";
  e.recipes.create.sequenced_assembly("createdieselgenerators:huge_diesel_engine", "#forge:storage_blocks/bronze",
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
      .id("createdieselgenerators:crafting/huge_diesel_engine")

  e.recipes.vintageimprovements.turning("3x createdieselgenerators:oil_barrel", "#forge:storage_blocks/steel").id("createdieselgenerators:crafting/oil_barrel")
  e.recipes.createdieselgenerators.basin_fermenting(
    [
      "vintageimprovements:sulfur_chunk",
      Item.of("vintageimprovements:sulfur_chunk").withChance(0.25)
    ],
    "#minecraft:coals"
  )
    .heatRequirement("heated")
    .id("createdieselgenerators:basin_fermenting/coals")
  e.recipes.create.compacting(
    Fluid.of("createdieselgenerators:plant_oil", 100), 
    Ingredient.of("#forge:seeds").subtract([
        "frycooks_delight:canola_seeds", 
        "youkaishomecoming:soybean"
      ])
  ).id("createdieselgenerators:compacting/plant_oil")
})