ServerEvents.recipes(e => {
  const {create, createdieselgenerators, vintageimprovements, createaddition, createmetallurgy} = e.recipes
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
    "createdieselgenerators:crafting/large_diesel_engine",
    "createdieselgenerators:crushing/wood_chip_logs",
    "createdieselgenerators:mechanical_crafting/chemcial_sprayer",
    "createdieselgenerators:deploying/chemical_sprayer_lighter",
    "createdieselgenerators:crafting/chemical_turret",
    "createdieselgenerators:crafting/chemical_turret_lighter",
    "createdieselgenerators:crushing/wood_chip_casings"
  ]);
  create.crushing(["31x createdieselgenerators:wood_chip",
      Item.of("createdieselgenerators:wood_chip", 1).withChance(0.5),
      Item.of("farmersdelight:tree_bark", 1).withChance(0.75)],
  "#minecraft:logs")
  .id("createdieselgenerators:crushing/wood_chip_logs/with_bark")
  e.replaceInput({ mod: "createdieselgenerators", not: "createdieselgenerators:crafting/basin_lid" }, "create:andesite_alloy", "#forge:ingots/steel")
  e.replaceInput({ id: "createdieselgenerators:crafting/basin_lid" }, "create:andesite_alloy", "createdeco:industrial_iron_ingot")
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
      .id("createdieselgenerators:crafting/modular_large_engine");
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
  e.recipes.kubejs.shaped(
    "minecraft:chest",
    [
      "AAA",
      "A A",
      "AAA"
    ], {
      A: "createdieselgenerators:chip_wood_block"
    }
  ).id("createdieselgenerators:crafting/chip_wood_chest_manual_only")
  e.recipes.kubejs.shaped(
    "4x minecraft:chest",
    [
      "AAA",
      "A A",
      "AAA"
    ], {
      A: "createdieselgenerators:chip_wood_beam"
    }
  ).id("createdieselgenerators:crafting/chip_wood_chest_4x_manual_only")
})