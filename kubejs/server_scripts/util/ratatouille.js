/**
 * 
 * @param { Internal.RecipesEventJS } event 
 * @param { InputItem_ } ingredients 
 * @param { OutputItem_ } results 
 * @param { number } [time] defult 2400 ticks
 */
function freezing(event, ingredients, results, time) {
  time = time || 200
  event.recipes.ratatouille.freezing(results, ingredients).id(`createdelightcore:freezing/${results.split(":")[1]}`)
  event.recipes.createdelightcore.fan_freezing(results, ingredients).id(`createdelightcore:fan_freezing/${ingredients.split(":")[1]}`)
  event.custom({type: "refurbished_furniture:freezer_solidifying", category: "blocks", ingredient:{item: ingredients}, result:{item: results}, time: time}).id(`refurbished_furniture:freezer_solidifying/${results.split(":")[1]}`)
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
/**
 * 
 * @param { Internal.RecipesEventJS } event
 * @param { OutputItem_ } output 输出香肠
 * @param { InputItem_ } ingredient 单个输入item
 */
function addSausageRecipe(event, output, ingredient) {
  event.recipes.ratatouille.squeezing(
    output,
    [
      "ratatouille:sausage_casing",
      ingredient,
      Fluid.of("luncheonmeatsdelight:flesh_mud", 250)
    ]
  ).id(`createdelight:squeezing/${output.split(":")[1]}`)
}

