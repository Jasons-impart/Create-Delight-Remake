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
 * @param { OutputItem_[] } outputs // [output, count] | [output, count, chance]
 * @param { number } time // defult 200 ticks
 */
function threshing(event, input, outputs, time) {
  const [first, second] = outputs
  event.recipes.ratatouille.threshing(outputs, input)
    .id(`ratatouille:threshing/${input.split(":")[1]}`).processingTime(time)
  event.recipes.farmersdelight.cutting(input, "#forge:tools/knives", [first, second])
    .id(`farmersdelight:cutting/${input.split(":")[1]}`)
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
  ).id(`ratatouille:squeezing/${output.split(":")[1]}`)
}

