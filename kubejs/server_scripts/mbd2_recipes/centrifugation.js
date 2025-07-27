
ServerEvents.recipes(e => {
  e.forEachRecipe(
    [{type: "vintageimprovements:centrifugation"}], recipe => {
    let prevIngr = recipe.json.get("ingredients").getAsJsonArray()
    let prevResult = recipe.json.get("results").getAsJsonArray()
    let newIngr = []
    let newRes = []
    let hasFluid = false

    prevIngr.forEach(ingr => {
      if (ingr.asJsonObject.get("fluid") != null || ingr.asJsonObject.get("fluidTag") != null)
        hasFluid = true
      newIngr.push(ingr)
    })
    prevResult.forEach(res => {
      // console.log(`res: ${res.toString()}`)
      if (res.asJsonObject.get("fluid") != null || res.asJsonObject.get("fluidTag") != null)
        hasFluid = true
      newRes.push(res)
    })

    if (newIngr.length > 1 || hasFluid)
      return
    e.recipes.createdelight.small_centrifugation()
    .perTick(builder => builder
      .inputFE(100)
    )
    .inputItems(newIngr)
    .outputItems(newRes)
  })
  
  e.recipes.createdelight.big_centrifugation()
    .inputItems('alexscaves:unrefined_waste')
    .duration(500)
    .outputItems('3x alexscaves:uranium_shard')
    .outputFluids(Fluid.of("alexscaves:acid", 250))
    .id("createdelight:big_centrifugation/unrefined_waste")
  e.recipes.createdelight.big_centrifugation()
    .inputItems('createdelight:uranium_dust')
    .duration(1000)
    .chance(0.1, builder => builder
      .outputItems('createdelight:enriched_uraniumdust')
    )
    .chance(0.9, builder => builder
     .outputItems("createdelight:depleted_uranium_dust")
    )
    .id("createdelight:big_centrifugation/uranium_dust")
    //液体离心
    //双液体组分液体离心
    let fluidSeparation_2_fluids = [
      [["createmetallurgy:molten_brass", 180], ["createmetallurgy:molten_copper", 90], ["createmetallurgy:molten_zinc", 90]],
      [["createmetallurgy:molten_bronze", 360], ["createmetallurgy:molten_tin", 90], ["createmetallurgy:molten_copper", 270]],
      [["createmetallurgy:molten_electrum", 180], ["createmetallurgy:molten_silver", 90], ["createmetallurgy:molten_gold", 90]],
      [["createbigcannons:molten_nethersteel", 540], ["createmetallurgy:molten_steel", 90], ["createmetallurgy:molten_netherite", 90]]
    ]
    fluidSeparation_2_fluids.forEach(fluid => {
      e.recipes.createdelight.big_centrifugation()
        .inputFluids(Fluid.of(fluid[0][0], fluid[0][1]))
        .outputFluids(Fluid.of(fluid[1][0], fluid[1][1]))
        .outputFluids(Fluid.of(fluid[2][0], fluid[2][1]))
        .duration(100)
        .id(`createdelight:big_centrifugation/separation/${fluid[0][0].split(":")[1]}`)
    })
  //液固混合液体离心
  e.recipes.createdelight.big_centrifugation()
    .inputFluids(Fluid.of("createdelightcore:ferrouslime", 900))
    .outputFluids(Fluid.of("createdelightcore:slime", 900))
    .id("createdelight:big_centrifugation/separation/ferrouslime")
  //巧克力离心
  e.recipes.createdelight.big_centrifugation()
    .inputFluids(Fluid.of("create:chocolate", 250))
    .outputItems("ratatouille:cocoa_butter")
    .outputItems("ratatouille:cocoa_solids")
    .outputItems("minecraft:sugar")
    .outputFluids(Fluid.of("minecraft:milk", 250))
    .id("createdelight:big_centrifugation/separation/chocolate")
  e.recipes.createdelight.big_centrifugation()
    .inputFluids(Fluid.of("create_confectionery:ruby_chocolate", 250))
    .outputItems("ratatouille:cocoa_butter")
    .outputItems("ratatouille:cocoa_solids")
    .outputItems("minecraft:sugar")
    .outputFluids(Fluid.of("create_central_kitchen:dragon_breath", 250))
    .id("createdelight:big_centrifugation/separation/ruby_chocolate")
  e.recipes.createdelight.big_centrifugation()
    .inputFluids(Fluid.of("create_confectionery:white_chocolate", 250))
    .outputItems("ratatouille:cocoa_butter")
    .outputItems("minecraft:sugar")
    .outputFluids(Fluid.of("minecraft:milk", 250))
    .id("createdelight:big_centrifugation/separation/white_chocolate")
  e.recipes.createdelight.big_centrifugation()
    .inputFluids(Fluid.of("create_confectionery:black_chocolate", 250))
    .outputItems("ratatouille:cocoa_butter")
    .outputItems("ratatouille:cocoa_solids")
    .outputFluids(Fluid.of("minecraft:milk", 250))
    .id("createdelight:big_centrifugation/separation/black_chocolate")
})