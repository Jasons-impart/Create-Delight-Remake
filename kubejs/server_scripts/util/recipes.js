// priority: 100

/**
 * @param { Internal.RecipesEventJS } event 
 * @param { Internal.ItemStack_[] } items
 */
function remove_recipes_output(event, items) {
    event.remove({ output: items })
}
/**
 * @param { Internal.RecipesEventJS } event 
 * @param { Internal.ItemStack_[] } items
 */
function remove_recipes_input(event, items) {
    event.remove({ input: items })
}
/**
 * @param { Internal.RecipesEventJS } event 
 * @param { Special.RecipeId[] } ids
 */
function remove_recipes_id(event, ids) {
    ids.forEach(id => {
        event.remove({ id: id })
    })
}
/**
 * @param { Internal.RecipesEventJS } event 
 * @param { Special.RecipeType[] } types
 */
function remove_recipes_type(event, types) {
    types.forEach(type => {
        event.remove({ type: type })
    })
}
/**
 * @param { Internal.RecipesEventJS } event 
 * @param { Special.Mod[] } mods
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
        event.recipes.create.sequenced_assembly(output, inputs[0], deploy_list)
        .loops(1)
        .transitionalItem(inputs[0])
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
/**
 * @param { Internal.RecipesEventJS } event 
 * @param { InputItem_ } input 
 * @param { any[] } outputs 
 */
function cutting(event, input, outputs) {
    let recipe = {
        type: "farmersdelight:cutting",
        ingredients: [{ item: input }],
        result: [],
        tool: { type: "farmersdelight:tool_action", action: "blade_cut" }
    }
    let result = []
    outputs.forEach(output => {
        let id = output[0]
        let count = output.length > 1 ? output[1] : 1
        let chance = output.length > 2 ? output[2] : 1
        recipe.result.push({
            item: id,
            count: count,
            chance: chance
        })
        result.push(Item.of(`${count}x ${id}`).withChance(chance))
    });
    event.recipes.farmersdelight.cutting(input, "#forge:tools/knives", result).id(`farmersdelight:cutting/${input.split(":")[1]}`)
    event.custom(recipe).id(`tetracelium:cutting/${input.split(":")[1]}`)
}
/**
 * @param { Internal.RecipesEventJS } event 
 * @param { InputItem_ } input 
 * @param { any[] } outputs 
 */
function cutting_1(event, input, outputs) {
    let result = []
    outputs.forEach(output => {
        let id = output[0]
        let count = output.length > 1 ? output[1] : 1
        let chance = output.length > 2 ? output[2] : 1
        result.push(Item.of(`${count}x ${id}`).withChance(chance))
    });
    event.recipes.farmersdelight.cutting(input, "#forge:tools/knives", result).id(`${outputs[0][0].split(":")[0]}:food/${outputs[0][0].split(":")[1]}`)
}
/**
 * @param { Internal.RecipesEventJS } event 
 * @param { InputItem_ } input 
 * @param { any[] } outputs 
 */
function cutting_2(event, input, outputs) {
    let recipe = {
        type: "farmersdelight:cutting",
        ingredients: [{ item: input }],
        result: [],
        tool: { type: "farmersdelight:tool_action", action: "blade_cut" }
    }
    let result = []
    outputs.forEach(output => {
        let id = output[0]
        let count = output.length > 1 ? output[1] : 1
        let chance = output.length > 2 ? output[2] : 1
        recipe.result.push({
            item: id,
            count: count,
            chance: chance
        })
        result.push(Item.of(`${count}x ${id}`).withChance(chance))
    });
    event.recipes.farmersdelight.cutting(input, "#forge:tools/knives", result).id(`${input.split(":")[0]}:${input.split(":")[1]}_cutting`)
    event.custom(recipe).id(`tetracelium:cutting/${input.split(":")[1]}_from_${input.split(":")[0]}`)
}
/**
 * 
 * @param { Internal.RecipesEventJS } e 
 * @param { InputItem_ } input 
 * @param { OutputItem_ } output 
 */
function make_cake(e, input, output) {
    e.recipes.create.deploying(output, [
        "minecraft:cake",
        input
    ])
        .id(`neapolitan:deploying/${output.split(":")[1]}`)
}
/**
 * 
 * @param {Special.FluidTag} fluidTag 
 * @param {?number} amount
 * @param {?Internal.CompoundTag_} tag
 * @returns {Internal.CompoundTag_}
 */
function FluidIngredients(fluidTag, amount, tag) {
    amount = amount || 1000
    tag = tag || {}
    return { fluidTag: fluidTag, amount: amount, tag: tag }
}

/**
 * 
 * @param {Internal.RecipesEventJS} e 
 * @param {(Internal.OutputFluid_|OutputItem_)[]} results 
 * @param {(Internal.InputFluid_|InputItem_)[]} inputs 
 * @param {number} [processingTime] 
 * @param {number} [heatRequirement]
 */
function fermenting(e, results, inputs, processingTime, heatRequirement){
    processingTime = processingTime || 100
    let basin_fermenting = e.recipes.createdieselgenerators.basin_fermenting(results, inputs)
        .processingTime(processingTime)
        // .id(`createdieselgenerators:basin_fermenting/${results[0].split(":")[1]}`)
    let bulk_fermenting = e.recipes.createdieselgenerators.bulk_fermenting(results, inputs)
        .processingTime(processingTime*0.5)
        // .id(`createdieselgenerators:bulk_fermenting/${results[0].split(":")[1]}`)
    if (heatRequirement) {
        basin_fermenting.heatRequirement(heatRequirement)
        bulk_fermenting.heatRequirement(heatRequirement)
    }
}