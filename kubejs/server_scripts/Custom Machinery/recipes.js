ServerEvents.recipes(e => {
  const{create, kubejs} = e.recipes
  create.mechanical_crafting("createdelight:emergency_industrial_platform", 
    [
      "ABABABABA",
      "BCDCDCDCB",
      "ADCDCDCDA",
      "BCDCDCDCB",
      "ADCDEDCDA",
      "BCDCDCDCB",
      "ADCDCDCDA",
      "BCDCDCDCB",
      "ABABABABA"
    ], {
      A: "minecraft:yellow_concrete",
      B: "minecraft:black_concrete",
      C: "minecraft:white_concrete",
      D: "minecraft:snow_block",
      E: "ae2:spatial_cell_component_128"
    }
  ).id("createdelight:emergency_industrial_platform")
  kubejs.shapeless(
    'createdelight:emergency_industrial_platform_block',
    'createdelight:emergency_industrial_platform'
  ).id("createdelight:emergency_industrial_platform_block")
  kubejs.shapeless(
    'createdelight:emergency_industrial_platform',
    'createdelight:emergency_industrial_platform_block'
  ).id("createdelight:emergency_industrial_platform_1")
  kubejs.shapeless(
    'createdelight:emergency_industrial_platform_dark',
    [
      'createdelight:emergency_industrial_platform',
      "minecraft:deepslate"
    ]
  ).id("createdelight:emergency_industrial_platform_dark")
  kubejs.shapeless(
    'createdelight:emergency_industrial_platform_dark_block',
    'createdelight:emergency_industrial_platform_dark'
  ).id("createdelight:emergency_industrial_platform_dark_1")
  kubejs.shapeless(
    'createdelight:emergency_industrial_platform_dark',
    'createdelight:emergency_industrial_platform_dark_block'
  ).id("createdelight:emergency_industrial_platform_dark_block")
  kubejs.shapeless(
   'createdelight:emergency_industrial_platform_lime',
   [
    'createdelight:emergency_industrial_platform',
    'minecraft:packed_mud',
    'minecraft:lime_dye'
   ]
  ).id("createdelight:emergency_industrial_platform_lime")
  kubejs.shapeless(
    'createdelight:emergency_industrial_platform_lime_block',
    'createdelight:emergency_industrial_platform_lime'
  ).id("createdelight:emergency_industrial_platform_lime_1")
  kubejs.shapeless(
    'createdelight:emergency_industrial_platform_lime',
    'createdelight:emergency_industrial_platform_lime_block' 
  ).id("createdelight:emergency_industrial_platform_lime_block")
})