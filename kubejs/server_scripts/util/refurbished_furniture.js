/**
 * 
 * @param { Internal.RecipesEventJS } event 
 * @param { InputItem_[] } inputs 
 * @param { OutputItem_ } output 
 * @param { number } count 
 */
function combination(event, inputs, output, count) {
    let recipe = {
        type: "refurbished_furniture:cutting_board_combining",
        count: count,
        ingredients: [],
        result: output
    }
    inputs.forEach(input => {
        recipe.ingredients.push(Ingredient.of(input))
    });
    event.custom(recipe).id(`refurbished_furniture:combining/${output.split(":")[1]}`)
    //增加机动兼容
    if (inputs.length == 2)
        event.recipes.create.deploying(output, inputs)
            .id(`create:deploying/${output.split(":")[1]}`)
    else if (inputs.length > 2) {
        let deploy_list = []
        for (let index = 1; index < inputs.length; index++) {
            let ingr = inputs[index];
            deploy_list.push(event.recipes.create.deploying(inputs[0], [inputs[0], ingr]))
        }
        let trans = Item.of(`createdelight:incomplete_${output.split(":")[1]}`)
        if (trans.isEmpty())
            trans = inputs[0]
        event.recipes.create.sequenced_assembly(output, inputs[0], deploy_list)
        .loops(1)
        .transitionalItem(trans)
        .id(`create:sequenced_assembly/${output.split(":")[1]}`)
    }
        
}

/**
 * @param { Internal.RecipesEventJS } event 
 * @param { InputItem_ } input 
 * @param { OutputItem_ } output
 * @param { number } count  
 * @param { String } category // "misc", "food"
 * @param { number } time // defult 1200 ticks
 */
function baking(event, input, output, count, category, time) {
    event.custom({ type: "refurbished_furniture:oven_baking", category: category, ingredient: { item: input }, result: { count: count, item: output }, time: time })
        .id(`refurbished_furniture:baking/${output.split(":")[1]}`)
    event.recipes.ratatouille.baking(Item.of(output, count), input)
        .processingTime(time || 200)
        .id(`ratatouille:baking/${output.split(":")[1]}`)
}

/**
 * @param { Internal.RecipesEventJS } event 
 * @param { InputItem_ } input 
 * @param { OutputItem_ } output
 * @param { String } category // "misc", "food"
 * @param { number } time 
 */
function toasting(event, input, output, category, time) {
    event.custom({ type: "refurbished_furniture:toaster_heating", category: category, ingredient: { item: input }, result: output, time: time })
        .id(`refurbished_furniture:toasting/${output.split(":")[1]}`)
}