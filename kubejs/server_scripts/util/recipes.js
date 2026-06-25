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
 * @param { OutputItem_|OutputItem_[] } outputs 单个输出或输出数组，支持字符串、Item.of(...)、withChance(...)
 */
function cutting(event, input, outputs) {
    event.remove({type: "farmersdelight:cutting", input: input})
    if (!(outputs instanceof Array)) {
        outputs = [outputs]
    }

    let recipe = {
        type: "farmersdelight:cutting",
        ingredients: [{ item: input }],
        result: [],
        tool: { type: "farmersdelight:tool_action", action: "blade_cut" }
    }
    let result = []
    outputs.forEach(output => {
        let stack = null
        let chance = 1

        if (typeof output.getStack == "function") {
            stack = output.getStack()
        }
        else if (output.stack) {
            stack = output.stack
        }
        else if (typeof output.getItem == "function") {
            stack = output
        }
        else {
            stack = Item.of(output)
        }

        if (typeof output.getChance == "function") {
            chance = output.getChance()
        }
        else if (typeof output.chance == "number") {
            chance = output.chance
        }

        let id = String(stack.getItem().getId())
        let count = stack.getCount()
        recipe.result.push({
            item: id,
            count: count,
            chance: chance
        })
        result.push(output)
    });
    let inputId = String(input)
    let inputNamespace = inputId.split(":")[0]
    let inputPath = inputId.split(":")[1]
    event.recipes.farmersdelight.cutting(input, "#forge:tools/knives", result).id(`createdelight:knives_cutting/${inputNamespace}/${inputPath}`)
    event.custom(recipe).id(`createdelight:knives_cutting/${inputNamespace}/${inputPath}_2`)
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
