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
  let frementing_receipe = {
    "type": "brewinandchewin:fermenting",
    "basefluid": {
      "count": amount,
      "fluid": base
    },
    "fermentingtime": time,
    "experience": 1.0,
    "ingredients": [],
    "result": {
      "count": amount,
      "fluid": fluid
    },
    "recipe_book_tab": "drinks",
    "temperature": temperature
  }
  inputs.forEach(input => {
    if (input[0] == "#") {
      frementing_receipe.ingredients.push({
        "tag": input.slice(1)
      })
    } else {
      frementing_receipe.ingredients.push({
        "item": input
      })
    }
  });
  event.custom(frementing_receipe).id(`brewinandchewin:fermenting/${output.split(":")[1]}_from_${base.split(":")[1]}`)
  event.custom({
    "type": "brewinandchewin:keg_pouring",
    "amount": 250,
    "filling": true,
    "container": {
      "item": container
    },
    "fluid": fluid,
    "output": {
      "item": output
    },
    "strict": false
  }).id(`brewinandchewin:pouring/${output.split(":")[1]}`)
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
function frementing_3(event, base, inputs, fluid, output, temperature, time, amount) {
  temperature = temperature || 3
  amount = amount || 1000
  time = time || 9600
  let frementing_receipe = {
    "type": "brewinandchewin:fermenting",
    "basefluid": {
      "count": amount,
      "fluid": base
    },
    "fermentingtime": time,
    "experience": 1.0,
    "ingredients": [],
    "result": {
      "count": amount,
      "fluid": fluid
    },
    "recipe_book_tab": "drinks",
    "temperature": temperature
  }
  inputs.forEach(input => {
    if (input[0] == "#") {
      frementing_receipe.ingredients.push({
        "tag": input.slice(1)
      })
    } else {
      frementing_receipe.ingredients.push({
        "item": input
      })
    }
  });
  event.custom(frementing_receipe).id(`brewinandchewin:fermenting/${output.split(":")[1]}_from_${base.split(":")[1]}`)
}
