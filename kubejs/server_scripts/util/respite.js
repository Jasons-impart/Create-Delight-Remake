/**
 * @param { Internal.RecipesEventJS_ } event 
 * @param { Internal.FluidStackJS_ } base 
 * @param { InputItem_[] } inputs 最多输入为2个
 * @param { Internal.FluidStackJS_ } fluid 
 * @param { OutputItem_ } output 
 * @param {number} [amount]
 */
function brewing(event, base, inputs, fluid, output, amount) {
    amount = amount || 1000
    let brewing_receipe = {
        "type": "farmersrespite:brewing",
        "base": {
            "count": amount,
            "fluid": base
        },
        "cookingtime": 2400,
        "experience": 0.35,
        "ingredients": [],
        "result": {
            "count": amount,
            "fluid": fluid
        }
    }
    inputs.forEach(input => {
        if (input[0] == "#") {
            brewing_receipe.ingredients.push({
                "tag": input.slice(1)
            })
        } else {
            brewing_receipe.ingredients.push({
                "item": input
            })
        }
    });
    event.custom(brewing_receipe).id(`farmersrespite:brewing/${output.split(":")[1]}_from_${base.split(":")[1]}`)
    event.custom({
        "type": "farmersrespite:kettle_pouring",
        "amount": 250,
        "container": {
            "item": "minecraft:glass_bottle"
        },
        "fluid": fluid,
        "output": {
            "item": output
        }
    }).id(`farmersrespite:pouring/${output.split(":")[1]}`)
}

/**
 * 无倾倒的煮茶
 * @param { Internal.RecipesEventJS_ } event 
 * @param { Internal.FluidStackJS_ } base 
 * @param { InputItem_[] } inputs 最多输入为2个
 * @param { Internal.FluidStackJS_ } fluid 
 * @param { OutputItem_ } output 
 * @param {number} [amount]
 */
function brewing_2(event, base, inputs, fluid, output, amount) {
    amount = amount || 1000
    let brewing_receipe = {
        "type": "farmersrespite:brewing",
        "base": {
            "count": amount,
            "fluid": base
        },
        "cookingtime": 2400,
        "experience": 0.35,
        "ingredients": [],
        "result": {
            "count": amount,
            "fluid": fluid
        }
    }
    inputs.forEach(input => {
        if (typeof input == "string" && input[0] == "#") {
            brewing_receipe.ingredients.push({
                "tag": input.slice(1)
            })
        } else {
            brewing_receipe.ingredients.push({
                "item": input
            })
        }
    });
    event.custom(brewing_receipe).id(`farmersrespite:brewing/${output.split(":")[1]}_from_${base.split(":")[1]}`)
}
/**
 * 
 * @param {Internal.RecipesEventJS_} event 
 * @param {InputItem_} input 
 * @param {Internal.FluidStackJS_} fluid 
 * @param {InputItem_} [container]
 * @param {number} amount
 */
function pouring(event, input, fluid, container, amount) {
    let ingr = Ingredient.of(input)
    let con = container || "minecraft:glass_bottle"
    amount = amount || 250
    let c = Ingredient.of(con)
    event.custom({
        "type": "farmersrespite:kettle_pouring",
        "amount": amount,
        "container": c,
        "fluid": fluid,
        "output": ingr
    }).id(`farmersrespite:pouring/${ingr.getFirst().getId().split(":")[1]}`)

    event.custom({
        "type": "brewinandchewin:keg_pouring",
        "amount": amount,
        "container": c,
        "filling": true,
        "fluid": fluid,
        "output": ingr,
        "strict": false
    })
}