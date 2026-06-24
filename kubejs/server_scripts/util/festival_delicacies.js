/**
 * @param { Internal.RecipesEventJS } e 
 * @param { InputItem_[] } inputs 
 * @param { OutputItem_ } output 
 * @param { number } exp 
 * @param { number } time 
 */
function dumpling(e, inputs, output, exp, time) {
    exp = 1.0 || exp
    time = 200 || time
    e.recipes.festival_delicacies.stove(
        [
            "create:dough",
            "#forge:vegetables/onion",
        ].concat(inputs),
        output,
        exp, time, "default"
    ).id(`createdelight:stove/${output.split(":")[1]}`)
    e.recipes.farmersdelight.cooking(
        [
            "create:dough",
            "#forge:vegetables/onion",
        ].concat(inputs),
        output, exp, time
    ).id(`createdelight:cooking/${output.split(":")[1]}`)
}

/**
 * @param { Internal.RecipesEventJS } e 
 * @param { InputItem_[] } inputs 
 * @param { OutputItem_ } output 
 * @param { number } exp 
 * @param { number } time 
 */
function wonton(e, inputs, output, exp, time) {
    e.recipes.festival_delicacies.stove(inputs, output, exp, time, "default", "minecraft:bowl")
        .id(`createdelight:stove/${output.split(":")[1]}`)
    e.recipes.farmersdelight.cooking(inputs, output, exp, time, "minecraft:bowl")
        .id(`createdelight:cooking/${output.split(":")[1]}`)
}
