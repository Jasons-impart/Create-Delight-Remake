const $TableItemManager = Java.loadClass("dev.xkmc.youkaishomecoming.content.pot.table.item.TableItemManager")
const $FoodModelHelper = Java.loadClass("dev.xkmc.youkaishomecoming.content.pot.table.food.FoodModelHelper")
const {SUSHI_SAUCE, HOSOMAKI_SAUCE, FUTOMAKI_SAUCE, CAL_SAUCE, CAL_TOP_SAUCE, HOSOMAKI_INGREDIENT, FUTOMAKI_INGREDIENT, CAL_INGREDIENT, GUNKAN_TOP, SUSHI_TOP, CAL_COVER, COMPLETE_HOSOMAKI} = $TableItemManager
// 酱汁
let sauces = [SUSHI_SAUCE, HOSOMAKI_SAUCE, FUTOMAKI_SAUCE, CAL_SAUCE, CAL_TOP_SAUCE]
// 寿司卷馅料
let rools = [HOSOMAKI_INGREDIENT, FUTOMAKI_INGREDIENT, CAL_INGREDIENT]

let SushiTable = {}
/**
 * 
 * @param {Internal.VariantModelPart} part  来自$TableItemManager
 * @param {string} id 
 * @param {Internal.Ingredient_} ingrdient 
 * @returns {Internal.VariantModelPart$Entry}
 */
SushiTable.addMappingFromIngredient = function(part, id, ingrdient) {
  return part["addMapping(java.lang.String,java.util.function.Supplier)"](id, () => Ingredient.of(ingrdient))
}
/**
 * 
 * @param {string} id 
 * @param {string} path 
 * @param {Internal.Ingredient_} ingredient 
 * @param {VariantModelPart[]} parts  来自$TableItemManager
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
// SushiTable.addBulk("squid_tentacles", "ingredient/squid_tentacles", "#oceanic_delight:squid_tentacles", rolls);

//$FoodModelHelper用例
// let model = $FoodModelHelper.hosomaki("sculk_sensor_tendril_roll") //取物品id的path
// $FoodModelHelper.map("silentsdelight:sculk_sensor_tendril_roll", model)
ServerEvents.recipes(e => {
  remove_recipes_id(e, [
    "farmersdelight:salmon_roll",
    "farmersdelight:cod_roll",
  ])
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
  SushiTable.addBulk("mayonnaise", "sauce/mayonnaise", "create_bic_bit:mayonnaise_bottle", sauces)
  youkaishomecoming.cuisine_ordered(
    '2x youkaishomecoming:tobiko_gunkan',
    "youkaishomecoming:gunkan",
    [
      "#forge:roe"
    ]
  ).id("youkaishomecoming:tobiko_gunkan")
  SushiTable.addMappingFromIngredient(CAL_COVER, "roe", "#forge:roe")
  SushiTable.addMappingFromIngredient(GUNKAN_TOP, "roe", "#forge:roe")
  youkaishomecoming.cuisine_ordered(
    '2x culturaldelights:pufferfish_roll',
    "youkaishomecoming:sushi",
    [
      "#forge:pufferfish",
    ]
  ).id("youkaishomecoming:pufferfish_roll")
  SushiTable.addMappingFromIngredient(SUSHI_TOP, "pufferfish", "#forge:pufferfish")
  youkaishomecoming.cuisine_ordered(
    '2x createdelight:fugu_roll',
    "youkaishomecoming:sushi",
    [
      'crabbersdelight:cooked_pufferfish_slice'
    ]
  ).id("createdelight:fugu_roll")
  SushiTable.addMappingFromIngredient(SUSHI_TOP, "cooked_pufferfish", "crabbersdelight:cooked_pufferfish_slice")
  youkaishomecoming.cuisine_ordered(
    '2x collectorsreap:uni_roll',
    "youkaishomecoming:gunkan",
    [
      'collectorsreap:uni'
    ]
  ).id("collectorsreap:uni_roll")
  SushiTable.addMappingFromIngredient(GUNKAN_TOP, "uni", "collectorsreap:uni")
  youkaishomecoming.cuisine_ordered(
    '2x culturaldelights:tropical_roll',
    "youkaishomecoming:sushi",
    [
      '#forge:tropical',
    ]
  ).id("youkaishomecoming:tropical_roll")
  SushiTable.addMappingFromIngredient(SUSHI_TOP, "tropical", "#forge:tropical")
  youkaishomecoming.cuisine_ordered(
    "2x oceanic_delight:shrimp_roll",
    "youkaishomecoming:sushi",
    [
      "#forge:shrimps",
      "minecraft:dried_kelp"
    ]
  ).id("youkaishomecoming:shrimp_roll")
  SushiTable.addMappingFromIngredient(SUSHI_TOP, "shrimp", "#forge:shrimps")
  youkaishomecoming.cuisine_ordered(
    "2x culturaldelights:calamari_roll",
    "youkaishomecoming:sushi",
    [
      '#oceanic_delight:squid_tentacles',
      "minecraft:dried_kelp"
    ]
  ).id("youkaishomecoming:calamari_roll")
  SushiTable.addMappingFromIngredient(SUSHI_TOP, "squid", '#oceanic_delight:squid_tentacles')
  youkaishomecoming.cuisine_ordered(
    "2x collectorsreap:clam_roll",
    "youkaishomecoming:sushi",
    [
      "#forge:raw_clam"
    ]
  ).id("youkaishomecoming:clam_roll")
  SushiTable.addMappingFromIngredient(SUSHI_TOP, "clam", "#forge:raw_clam")
  youkaishomecoming.cuisine_ordered(
    '2x cavedelight:trilocaris_roll',
    "youkaishomecoming:sushi",
    [
      'cavedelight:raw_trilocaris_slice'
    ]
  ).id("youkaishomecoming:trilocaris_roll")
  SushiTable.addMappingFromIngredient(SUSHI_TOP, "trilocaris", 'cavedelight:raw_trilocaris_slice')
  youkaishomecoming.cuisine_ordered(
    'silentsdelight:sculk_sensor_tendril_roll',
    "youkaishomecoming:hosomaki",
    [
      "silentsdelight:sculk_sensor_tendril",
    ]
  ).id("youkaishomecoming:sculk_sensor_tendril_roll")
  SushiTable.addMappingFromIngredient(HOSOMAKI_INGREDIENT, "tendril", "silentsdelight:sculk_sensor_tendril")
  // SushiTable.addMappingFromIngredient(COMPLETE_HOSOMAKI, "sculk_sensor_tendril_roll", "silentsdelight:sculk_sensor_tendril_roll")
})