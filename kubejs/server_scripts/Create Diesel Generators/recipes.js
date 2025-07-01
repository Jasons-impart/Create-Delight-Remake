ServerEvents.recipes(e => {
  remove_recipes_type(e, [
    "createdieselgenerators:compression_molding",
    "createdieselgenerators:casting",
    "createdieselgenerators:hammering",
    "createdieselgenerators:wire_cutting"
  ])
  remove_recipes_id(e, [
    "createdieselgenerators:crafting/engine_piston_from_rods",
    "createdieselgenerators:compacting/plant_oil",
    "createdieselgenerators:basin_fermenting/dough",
    "createdieselgenerators:crafting/burner",
    "createdieselgenerators:cutting/bar_mold",
    "createdieselgenerators:cutting/chain_mold",
    "createdieselgenerators:cutting/bowl_mold",
    "createdieselgenerators:cutting/lines_mold",
    "createdieselgenerators:basin_fermenting/fermented_spider_eye",
    "createdieselgenerators:crafting/wire_cutters",
    "createdieselgenerators:crafting/hammer",
    "createdieselgenerators:crafting/huge_diesel_engine",
    "createdieselgenerators:crafting/large_diesel_engine"
  ]);
  e.replaceInput({ mod: "createdieselgenerators", not: "createdieselgenerators:crafting/basin_lid" }, "create:andesite_alloy", "#forge:ingots/steel")
  e.replaceInput({ id: "createdieselgenerators:crafting/basin_lid" }, "create:andesite_alloy", "#forge:ingots/cast_iron")
  e.replaceInput({ id: "createdieselgenerators:basin_fermenting/fermentable" }, "minecraft:bone_meal", "createdelight:dry_yeast")
  e.replaceInput({ id: "createdieselgenerators:bulk_fermenting/fermentable" }, "minecraft:bone_meal", "createdelight:dry_yeast")
  e.replaceInput({ mod: "createdieselgenerators" }, "create:propeller", "ad_astra:fan")
  fermenting(e,
    Fluid.of("createdieselgenerators:ethanol", 250),
    [
      'createaddition:biomass',
      "createdelight:dry_yeast"
    ]
  )
  fermenting(e,
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
  )
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
  e.recipes.create.sequenced_assembly("createdelight:diesel_engine", "minecraft:polished_blackstone_slab",
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
  let iner2 = "createdelight:incomplete_modular_diesel_engine";
  e.recipes.create.sequenced_assembly("createdelight:modular_diesel_engine", "createdelight:diesel_engine",
      [
        e.recipes.create.deploying(iner2, [iner2, "#forge:plates/bronze"]),
        e.recipes.create.pressing(iner2, iner2),
      ]
    )
      .transitionalItem(iner2)
      .loops(3)
      .id("createdieselgenerators:crafting/modular_diesel_engine");

  e.recipes.vintageimprovements.turning("3x createdieselgenerators:oil_barrel", "#forge:storage_blocks/steel").id("createdieselgenerators:crafting/oil_barrel")
  fermenting(e,
    [
      "vintageimprovements:sulfur_chunk",
      Item.of("vintageimprovements:sulfur_chunk").withChance(0.25)
    ],
    "#minecraft:coals", 100, "heated"
  )
  e.recipes.create.compacting(
    Fluid.of("createdieselgenerators:plant_oil", 100), 
    Ingredient.of("#forge:seeds").subtract([
        "frycooks_delight:canola_seeds", 
        "youkaishomecoming:soybean"
      ])
  ).id("createdieselgenerators:compacting/plant_oil")
  e.recipes.kubejs.shaped(
    'createdieselgenerators:bulk_fermenter',
    [
      'createdieselgenerators:basin_lid',
      'create:basin'
    ]
  ).id("createdieselgenerators:crafting/bulk_fermenter")
  {
    let iner = "create:iron_sheet"
    e.recipes.create.sequenced_assembly('createdieselgenerators:sheet_metal_panel', iner, [
      e.recipes.vintageimprovements.hammering(iner, iner)
    ])
      .loops(3)
      .transitionalItem(iner)
      .id("createdieselgenerators:crafting/sheet_metal_panel")
  }
  e.recipes.kubejs.shapeless(
    'createdieselgenerators:andesite_girder',
    [
      "create:andesite_alloy",
      "create:metal_girder"
    ]
  ).id("createdieselgenerators:crafting/andesite_girder")
})