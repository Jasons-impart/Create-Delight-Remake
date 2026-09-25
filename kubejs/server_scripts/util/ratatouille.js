/**
 *
 * @param { Internal.RecipesEventJS } event
 * @param { InputItem_ } ingredients
 * @param { OutputItem_ | OutputItem_[] } results
 * @param { number } [time] default 200 ticks
 */
function freezing(event, ingredients, results, time) {
  time = time || 200
  let resultKey = Array.isArray(results) ? results[0] : results
  let resultName = String(resultKey).split(":")[1]
  event.recipes.ratatouille.freezing(results, ingredients).id(`createdelightcore:freezing/${resultName}`)
  event.recipes.create_dragons_plus.freezing(results, ingredients).id(`createdelightcore:fan_freezing/${ingredients.split(":")[1]}`)
  event.recipes.refurbished_furniture.freezer_solidifying(ingredients, resultKey, "blocks", time).id(`refurbished_furniture:freezer_solidifying/${resultName}`)
}

/**
 * @param { Internal.RecipesEventJS } event 
 * @param { InputItem_ } input 
 * @param { OutputItem_[] } outputs // [0]主产物，[1]主产物（概率增产）, [2]副产物
 * @param { number } time // defult 200 ticks
 */
function threshing(event, input, outputs, time) {
  time = time || 200
  event.recipes.ratatouille.threshing(outputs, input)
    .id(`createdelight:threshing/${input.split(":")[1]}`).processingTime(time)
  let cutting_outputs = [outputs[0], outputs[2]]
  cutting(event, input, cutting_outputs)
}
