function brewinandchewin_fermenting_item_ingredient(input) {
  if (input[0] == "#")
    return { tag: input.slice(1) }
  return { item: input }
}

function brewinandchewin_cdg_fermenting(event, base, inputs, fluid, output, time, amount, conditions) {
  const recipeId = `${output.split(":")[1]}_from_${base.split(":")[1]}`
  const ingredients = [
    {
      fluid: base,
      amount: amount
    }
  ]
  inputs.forEach(input => ingredients.push(brewinandchewin_fermenting_item_ingredient(input)))

  const recipe = {
    ingredients: ingredients,
    processingTime: time,
    results: [
      {
        fluid: fluid,
        amount: amount
      }
    ]
  }
  if (conditions)
    recipe.conditions = conditions

  event.custom(Object.assign({ type: "createdieselgenerators:basin_fermenting" }, recipe))
    .id(`createdelight:basin_fermenting/${recipeId}`)
  event.custom(Object.assign({ type: "createdieselgenerators:bulk_fermenting" }, recipe, { processingTime: time * 0.5 }))
    .id(`createdelight:bulk_fermenting/${recipeId}`)
}

/**
 * @param { Internal.RecipesEventJS_ } event 
 * @param { Internal.FluidStackJS_ } base 
 * @param { InputItem_[] } inputs 最多输入为4个
 * @param { Internal.FluidStackJS_ } fluid 
 * @param { OutputItem_ } container 
 * @param { InputItem_ } [amount]
 * @param { number } [temperature] 默认为3
 * @param { number } [amount] 默认1000
 * @param { number } [time] 默认9600
 */
function frementing_2(event, base, inputs, fluid, output, container, temperature, time, amount) {
  temperature = temperature || 3
  amount = amount || 1000
  time = time || 9600
  let ingrs = []
  inputs.forEach(input => {
  ingrs.push(brewinandchewin_fermenting_item_ingredient(input))
  });
  let frementing_receipe = {
    "type": "brewinandchewin:fermenting",
    "basefluid": {
      "count": amount,
      "fluid": base
    },
    "fermentingtime": time,
    "experience": 1.0,
    "ingredients": ingrs,
    "result": {
      "count": amount,
      "fluid": fluid
    },
    "recipe_book_tab": "drinks",
    "temperature": temperature
  }
  event.custom(frementing_receipe).id(`createdelight:fermenting/${output.split(":")[1]}_from_${base.split(":")[1]}`)
  brewinandchewin_cdg_fermenting(event, base, inputs, fluid, output, time, amount)
  // keg_pouring(fluid, output, amount, filling, container, strict)
  event.recipes.brewinandchewin.keg_pouring(fluid, output, 250, true, container, false).id(`createdelight:pouring/${output.split(":")[1]}`)
}

/**
 * @param { Internal.RecipesEventJS_ } event 
 * @param { Internal.FluidStackJS_ } base 
 * @param { InputItem_[] } inputs 最多输入为4个
 * @param { Internal.FluidStackJS_ } fluid 
 * @param { InputItem_ } [amount]
 * @param { number } [temperature] 默认为3
 * @param { number } [amount] 默认1000
 * @param { number } [time] 默认9600
 */
function frementing_3(event, base, inputs, fluid, output, temperature, time, amount, recipeBookTab, experience, conditions) {
  temperature = temperature || 3
  amount = amount || 1000
  time = time || 9600
  recipeBookTab = recipeBookTab || "drinks"
  experience = experience || 1.0
  let ingrs = []
  inputs.forEach(input => {
  ingrs.push(brewinandchewin_fermenting_item_ingredient(input))
  });
  let frementing_receipe = {
    "type": "brewinandchewin:fermenting",
    "basefluid": {
      "count": amount,
      "fluid": base
    },
    "fermentingtime": time,
    "experience": experience,
    "ingredients": ingrs,
    "result": {
      "count": amount,
      "fluid": fluid
    },
    "recipe_book_tab": recipeBookTab,
    "temperature": temperature
  }
  if (conditions) {
    frementing_receipe.conditions = conditions
  }
  event.custom(frementing_receipe).id(`createdelight:fermenting/${output.split(":")[1]}_from_${base.split(":")[1]}`)
  brewinandchewin_cdg_fermenting(event, base, inputs, fluid, output, time, amount, conditions)
}
