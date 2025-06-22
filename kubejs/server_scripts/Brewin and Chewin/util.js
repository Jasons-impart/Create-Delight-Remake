/**
 * 
 * @param {Internal.RecipesEventJS_} e 
 * @param {OutputItem_ | Internal.OutputFluid_} result 
 * @param {Internal.Ingredient[]} ingredients 
 * @param {Internal.InputFluid_} inputFluid 
 * @param {number} [experience]
 * @param {number} [fermentingtime] 
 * @param {number} [temperature]
 * @returns 
 */
function brewinandchewin_fermenting(e, result, ingredients, inputFluid, experience, fermentingtime, temperature) {
    let ingrs = []
    if (!(ingredients instanceof Array)) {
        ingredients = [ingredients]
    }
    ingredients.forEach(i => {
        i.stacks.forEach(item => {
            ingrs.push(Ingredient.of(item).toJson())
        })
    })
    let res = {}
    if (!result.amount) {
        let tmp = Item.of(result)
        res = {
            count: tmp.count,
            item: tmp.id
        }
    }
    else {
        res = {
            count: result.amount,
            fluid: result.id
        }
    }
    inputFluid = Fluid.of(inputFluid)
    fermentingtime = fermentingtime || 4800
    experience = experience || 1.0
    temperature = temperature || 3
    let json = {
        type: "brewinandchewin:fermenting",
        basefluid: {
            count: inputFluid.amount,
            fluid: inputFluid.id
        },
        experience: experience,
        fermentingtime: fermentingtime,
        ingredients: ingrs,
        result: res,
        temperature: temperature
    }
    return e.custom(json)
}
