/**
 * @param { Internal.RecipesEventJS_ } event 
 * @param { InputItem_ } base 
 * @param { InputItem_[] } inputs 
 * @param { OutputItem_ } fluid 
 * @param { OutputItem_ } output 
 */
function brewing(event, base, inputs, fluid, output) {
    let brewing_receipe = {
        "type": "farmersrespite:brewing",
        "base": {
            "count": 1000,
            "fluid": base
        },
        "cookingtime": 2400,
        "experience": 0.35,
        "ingredients": [],
        "result": {
            "count": 1000,
            "fluid": fluid
        }
    }
    inputs.forEach(input => {
        if(input[0] == "#"){
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