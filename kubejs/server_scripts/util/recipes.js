// priority: 100

/**
 * @param { Internal.RecipesEventJS } event 
 * @param { Internal.ItemStack[] } items
 */
function remove_recipes_output(event, items) {
    event.remove({ output: items })
}
/**
 * @param { Internal.RecipesEventJS } event 
 * @param { Internal.ItemStack[] } items
 */
function remove_recipes_input(event, items) {
    event.remove({ input: items })
}
/**
 * @param { Internal.RecipesEventJS } event 
 * @param { ResourceLocation[] } ids
 */
function remove_recipes_id(event, ids) {
    ids.forEach(id => {
        event.remove({ id: id })
    })
}
/**
 * @param { Internal.RecipesEventJS } event 
 * @param { string[] } types
 */
function remove_recipes_type(event, types) {
    types.forEach(type => {
        event.remove({ type: type })
    })
}
/**
 * @param { Internal.RecipesEventJS } event 
 * @param { string[] } mods
 */
function remove_recipes_mod(event, mods) {
    mods.forEach(mod => {
        event.remove({ mod: mod })
    })
}


/**
 * @param { Internal.RecipesEventJS } event 
 * @param { InputItem_ } input 
 * @param { number } number 
 * @param { OutputItem_ } output 
 * @param { OutputItem_ } stone 
 */
function crushing_ore(event, input, output, number, stone) {
    event.recipes.create.crushing([
        Item.of(`${number}x ${output}`),
        Item.of(output).withChance(0.75),
        Item.of('create:experience_nugget').withChance(0.75),
        Item.of(stone).withChance(0.12)
    ], input).id(`createdelight:crushing_${input.split(":")[1]}`)
}