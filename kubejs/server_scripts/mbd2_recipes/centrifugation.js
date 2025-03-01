ServerEvents.recipes(e => {
  let centrifugations = [
    [100, 'createmetallurgy:dirty_wolframite_dust', 'createmetallurgy:wolframite_dust', '2x minecraft:gold_nugget', 0.25],
    [100, 'createmetallurgy:dirty_gold_dust', 'createmetallurgy:gold_dust', 'minecraft:quartz', 0.5],
    [100, 'createmetallurgy:dirty_iron_dust', 'createmetallurgy:iron_dust', 'minecraft:redstone', 0.75],
    [100, 'createmetallurgy:dirty_copper_dust', 'createmetallurgy:copper_dust', 'minecraft:clay_ball', 0.5],
    [100, 'createmetallurgy:dirty_zinc_dust', 'createmetallurgy:zinc_dust', 'minecraft:gunpowder', 0.5],
    [100, 'createdelight:dirty_tin_dust', 'createdelight:tin_dust', 'minecraft:glowstone_dust', 0.5],
    [100, 'createdelight:dirty_silver_dust', 'createdelight:silver_dust', 'vintageimprovements:sulfur_chunk', 0.5],
    [100, 'createdelight:dirty_desh_dust', 'createdelight:desh_dust', 'ad_astra:cheese', 0.5],
    [100, 'createdelight:dirty_ostrum_dust', 'createdelight:ostrum_dust', 'iceandfire:myrmex_desert_resin', 0.2],
    [100, 'createdelight:dirty_calorite_dust', 'createdelight:calorite_dust', 'iceandfire:deathworm_egg', 0.2],
  ]
  centrifugations.forEach(([energy, input, output, extra, extrachance]) => {
    e.recipes.createdelight.small_centrifugation()
      .inputItems(input)
      .perTick(builder => builder
        .inputFE(energy)
      )
      .outputItems(output)
      .chance(0.5, builder => builder
        .outputItems(output)
      )
      .chance(extrachance, builder => builder
       .outputItems(extra)
      )
      .id(`createdelight:centrifugation/${input.split(":")[1]}`)
  })
})