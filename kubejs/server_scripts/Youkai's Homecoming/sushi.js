const $TableItemManager = Java.loadClass("dev.xkmc.youkaishomecoming.content.pot.table.item.TableItemManager")


let SushiTable = {}
// /**
//  * 
//  * @param {Internal.VariantModelPart} part 
//  * @param {string} id 
//  * @param {Internal.ItemStack_} stack 
//  * @returns {Internal.VariantModelPart$Entry} 来自$TableItemManager
//  */
// SushiTable.addMappingFromItemStack = function(part, id, stack) {
//   return part["addMapping(java.lang.String,net.minecraft.world.level.ItemLike)"](id, Item.of(stack).item)
// }

/**
 * 
 * @param {Internal.VariantModelPart} part 
 * @param {string} id 
 * @param {Internal.Ingredient_} ingrdient 
 * @returns {Internal.VariantModelPart$Entry} 来自$TableItemManager
 */
SushiTable.addMappingFromIngredient = function(part, id, ingrdient) {
  return part["addMapping(java.lang.String,java.util.function.Supplier)"](id, () => Ingredient.of(ingrdient))
}
/**
 * 
 * @param {string} id 
 * @param {string} path 
 * @param {Internal.Ingredient_} ingredient 
 * @param {VariantModelPart[]} parts 
 */
SushiTable.addBulk = function(id, path, ingredient, parts) {
  parts.forEach(part => {
    SushiTable.addMappingFromIngredient(part, id, ingredient).tex(`youkaishomecoming:block/table/${path}`)
  })
}
// 用例
// SushiTable.addMappingFromIngredient($TableItemManager.SUSHI_TOP, "sculk_sensor_tendril", "silentsdelight:sculk_sensor_tendril") 

// const {HOSOMAKI_INGREDIENT, FUTOMAKI_INGREDIENT, CAL_INGREDIENT} = $TableItemManager
// let rolls = [HOSOMAKI_INGREDIENT, FUTOMAKI_INGREDIENT, CAL_INGREDIENT]
// SushiTable.addBulk("cucumber", "ingredient/cucumber", "#oceanic_delight:squid_tentacles", rolls);
ServerEvents.recipes(e => {
  const{youkaishomecoming} = e.recipes
  youkaishomecoming.cuisine_mixed(
    "youkaishomecoming:california_roll",
    "youkaishomecoming:california",
    "create_bic_bit:mayonnaise_bottle",
    [
      '#forge:slices/cucumber',
      "youkaishomecoming:tamagoyaki_slice",
      "youkaishomecoming:imitation_crab"
    ]
  ).id("youkaishomecoming:california_roll")
})