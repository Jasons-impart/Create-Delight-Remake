/**
 * @param { Internal.RecipesEventJS } event 
 * @param { InputItem_[] } inputs 
 * @param { OutputItem_ } output 
 * @param { number } exp 
 * @param { number } time 
 */
function dumpling(event, inputs, output, exp, time) {
    event.recipes.festival_delicacies.stove(inputs, output, exp, time, "default")
        .id(`createdelight:stove/${output.split(":")[1]}`)
}

/**
 * @param { Internal.RecipesEventJS } event 
 * @param { InputItem_[] } inputs 
 * @param { OutputItem_ } output 
 * @param { number } exp 
 * @param { number } time 
 */
function wonton(event, inputs, output, exp, time) {
    event.recipes.festival_delicacies.stove(inputs, output, exp, time, "default", "minecraft:bowl")
        .id(`createdelight:stove/${output.split(":")[1]}`)
}
