const $Ingredients = Java.loadClass("net.minecraft.world.item.crafting.Ingredient")
const $FluidStackJS = Java.loadClass("dev.latvian.mods.kubejs.fluid.FluidStackJS")
ServerEvents.recipes(e => {
  e.forEachRecipe(
    [{ type: "vintageimprovements:centrifugation" }], recipe => {
      /**
       * @type {Internal.ProcessingRecipe}
       */
      let originalRecipe = recipe.getOriginalRecipe()
      let small
      if (originalRecipe.fluidResults.isEmpty())
        small = e.recipes.createdelight.small_centrifugation()
          .perTick(builder => builder
            .inputFE(100)
          )
      let big = e.recipes.createdelight.big_centrifugation()
      originalRecipe.ingredients.forEach(ingr => {
        if (originalRecipe.fluidResults.isEmpty())
          small.inputItems(ingr.asStack())
        big.inputItems(ingr.asStack())
      })
      originalRecipe.fluidIngredients.forEach(ingr => {
        big.inputFluids(ingr.matchingFluidStacks)
      })
      originalRecipe.rollableResults.forEach(res => {
        if (originalRecipe.fluidResults.isEmpty())
          small.chance(res.chance, builder => builder.outputItems(res.stack))
        big.chance(res.chance, builder => builder.outputItems(res.stack))
      })
      originalRecipe.fluidResults.forEach(res => {
        big.outputFluids(Fluid.of(res.fluid, res.amount))
      })
    })
})
/**
 * 
 * @param {Internal.RecipesEventJS} e 
 * @param {(Internal.OutputFluid_|OutputItem_)[]} results 
 * @param {(Internal.InputFluid_|InputItem_)[]} ingredients 
 * @param {number|string} [processingTime=100]
 * @param {number} [minimalRPM=100]
 * @returns {Special.Recipes.CentrifugationVintageimprovements}
 */
function centrifugation(e, results, ingredients, processingTime, minimalRPM) {
  processingTime = processingTime || 100
  minimalRPM = minimalRPM || 100
  let vintageRecipe = e.recipes.vintageimprovements.centrifugation(results, ingredients)
    .processingTime(processingTime)
    .minimalRPM(minimalRPM)
  let input = RecipeUtil.convertInput(ingredients)
  let output = RecipeUtil.convertOutput(results)
  let mbdRecipe = e.recipes.createdelight.big_centrifugation()
  if (input[0].length != 0)
    mbdRecipe.inputItems([input[0]])
  if (input[1].length != 0)
    mbdRecipe.inputFluids([input[1]])

    output[0].forEach(out => {
      if (out instanceof OutputItem) {
        mbdRecipe.chance(out.chance, builder => builder.outputItems(out))
      }
      else
        mbdRecipe.outputItems(out)
    })
  mbdRecipe.outputFluids(output[1])
  return vintageRecipe
}

