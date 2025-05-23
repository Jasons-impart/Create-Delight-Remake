let RecipeUtil = {}
/**
 * 
 * @param {(Internal.InputFluid_|InputItem_)[]} originalInput
 * @returns {[Internal.Itemstack_[], Internal.InputFluid_[]]}
 */
RecipeUtil.convertInput = function(originalInput) {
    let ret = [[], []]
    if (!(originalInput instanceof Array))
        originalInput = [originalInput]
    originalInput.forEach(ingr => {
        if (typeof(ingr) == "string") {
            ret[0].push(Item.of(ingr))
        }
        else if (typeof(ingr) == "object") {
            if (ingr.class != null) {
                if (ingr.class == Ingredient.none.class) {
                    ret[0].push(ingr)
                }
                else if (ingr.class == Fluid.water().class) {
                    let fluidIngr = Fluid.of(ingr)
                    ret[1].push(fluidIngr)
                }
                else if (ingr.class == Item.empty.class) {
                    ret[0].push(ingr)
                }
                else if (ingr instanceof InputItem) {
                    ret[0].push(ingr)
                }
            }
            else {
                if (ingr.fluidTag != null) {
                    ret[1].push(ingr)
                }
            }
        }
    })
    return ret
}
/**
 * 
 * @param {(Internal.OutputFluid_|OutputItem_)[]} originalOutput
 * @returns {[OutputItem_[], Internal.OutputFluid_[]]}
 */
RecipeUtil.convertOutput = function(originalOutput) {
    let ret = [[], []]
    if (!(originalOutput instanceof Array))
        originalOutput = [originalOutput]
    originalOutput.forEach(res => {
        if (typeof(res) == "string") {
            ret[0].push(Item.of(res))
        }
        else if (res.class == Item.empty.class) {
            ret[0].push(res)
        }
        else if (res instanceof OutputItem) {
            ret[0].push(res)
        }
        else if (res.class == Fluid.water().class) {
            ret[1].push(Fluid.of(res))
        }
    })
    return ret
}