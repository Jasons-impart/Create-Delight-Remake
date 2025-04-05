
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
      console.log(`res: ${res.toString()}`)
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
    .perTick(builder => builder
      .inputRPM(32)
    )
    .outputItems('5x alexscaves:uranium_shard')
    .outputFluids(Fluid.of("alexscaves:acid", 250))
    .id("createdelight:big_centrifugation/unrefined_waste")
  e.recipes.createdelight.big_centrifugation()
    .inputItems('createdelight:uranium_dust')
    .duration(1000)
    .perTick(builder => builder
      .inputRPM(32)
    )
    .chance(0.1, builder => builder
      .outputItems('createdelight:enriched_uraniumdust')
    )
    .chance(0.9, builder => builder
     .outputItems("createdelight:depleted_uranium_dust")
    )
    .id("createdelight:big_centrifugation/uranium_dust")
})