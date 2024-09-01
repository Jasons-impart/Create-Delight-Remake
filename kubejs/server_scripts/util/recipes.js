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
        Item.of("create:experience_nugget").withChance(0.75),
        Item.of(stone).withChance(0.12)
    ], input).id(`createdelight:crushing_${input.split(":")[1]}`)
}

/**
 * @param { Internal.RecipesEventJS } event 
 * @param { Item_ } item 
 * @param { Item_ } storage_block 
 * @param { number } package_item_number 
 */
function package_item(event, item, storage_block, package_item_number) {
    event.recipes.kubejs.shapeless(storage_block, `${package_item_number}x ${item}`).id(`createdelight:${item.split(":")[1]}_2_${storage_block.split(":")[1]}`)
    event.recipes.kubejs.shapeless(`${package_item_number}x ${item}`, storage_block).id(`createdelight:${storage_block.split(":")[1]}_2_${item.split(":")[1]}`)
}
/**
 * 
 * @param { Internal.RecipesEventJS } event 
 * @param { InputItem_[] } inputs //No tags!!!
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
        recipe.ingredients.push({
            item: input
        })
    });
    event.custom(recipe).id(`refurbished_furniture:combining/${output.split(":")[1]}`)
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
 * @param { Internal.RecipesEventJS } event 
 * @param { InputItem_[] } inputs 
 * @param { OutputItem_ } output 
 * @param { number } exp 
 * @param { number } time 
 */
function dumpling(event, inputs, output, exp, time) {
    event.recipes.festival_delicacies.stove(inputs, output, exp, time, true)
        .id(`createdelight:stove/${output.split(":")[1]}`)
    event.recipes.farmersdelight.cooking(inputs, output, exp, time)
        .id(`createdelight:cooking/${output.split(":")[1]}`)
}

/**
 * @param { Internal.RecipesEventJS } event 
 * @param { InputItem_[] } inputs 
 * @param { OutputItem_ } output 
 * @param { number } exp 
 * @param { number } time 
 */
function wonton(event, inputs, output, exp, time) {
    event.recipes.festival_delicacies.stove(inputs, output, exp, time, true, "minecraft:bowl")
        .id(`createdelight:stove/${output.split(":")[1]}`)
    event.recipes.farmersdelight.cooking(inputs, output, exp, time, "minecraft:bowl")
        .id(`createdelight:cooking/${output.split(":")[1]}`)
}

/**
 * @param { Internal.RecipesEventJS } event 
 * @param { InputItem_ } input
 * @param { OutputItem_ } output 
 * @param { number } xp // default 0.7
 * @param { number } time // default 100 ticks
 */
function blast_and_smelting(event, input, output, xp, time) {
    event.recipes.minecraft.blasting(output, input, xp, time).id(`createdelight:blasting/${output.split(":")[1]}_from_blasting_${input.split(":")[1]}`)
    event.recipes.minecraft.smelting(output, input, xp, 2 * time).id(`createdelight:smelting/${output.split(":")[1]}_from_melting_${input.split(":")[1]}`)
}