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
    "2x createdelight:radgill_sushi",
    "youkaishomecoming:sushi",
    [
      "alexscaves:radgill"
    ]
  ).id("createdelight:radgill_sushi")
  SushiTable.addMappingFromIngredient(SUSHI_TOP, "radgill", "alexscaves:radgill")
  youkaishomecoming.cuisine_ordered(
    'farmersdelight:kelp_roll',
    "youkaishomecoming:hosomaki",
    [
      'youkaishomecoming:soy_sauce_bottle',
      "minecraft:carrot"
    ]
  ).id("youkaishomecoming:kelp_roll")
  youkaishomecoming.cuisine_ordered(
    'silentsdelight:sculk_sensor_tendril_roll',
    "youkaishomecoming:hosomaki",
    [
      'youkaishomecoming:soy_sauce_bottle',
      "silentsdelight:sculk_sensor_tendril"
    ]
  ).id("youkaishomecoming:sculk_sensor_tendril_roll")
  SushiTable.addBulk("tendril", "ingredient/tendril", "silentsdelight:sculk_sensor_tendril", rools)
  $FoodModelHelper.map("silentsdelight:sculk_sensor_tendril_roll", $FoodModelHelper.hosomaki("sculk_sensor_tendril_roll"))
  youkaishomecoming.cuisine_mixed(
    'oceanic_delight:sea_pickle_roll',
    "youkaishomecoming:futomaki",
    'youkaishomecoming:soy_sauce_bottle',
    [
      '#oceanic_delight:squid_tentacles',
      '#oceanic_delight:squid_tentacles',
      "#forge:sea_pickles",
      "#forge:sea_pickles"
    ]
  ).id("youkaishomecoming:sea_pickle_roll")
  SushiTable.addBulk("sea_pickle", "ingredient/sea_pickle", "#forge:sea_pickles", rools)
  SushiTable.addBulk("squid", "ingredient/squid", "#oceanic_delight:squid_tentacles", rools)
  $FoodModelHelper.map("oceanic_delight:sea_pickle_roll", $FoodModelHelper.futomaki("sea_pickle_roll"))
  youkaishomecoming.cuisine_mixed(
    'culturaldelights:midori_roll',
    "youkaishomecoming:futomaki",
    'youkaishomecoming:soy_sauce_bottle',
    [
      'youkaishomecoming:cucumber_slice',
      'youkaishomecoming:cucumber_slice',
      'culturaldelights:cut_avocado',
      'culturaldelights:cut_avocado'
    ]
  ).id("youkaishomecoming:midori_roll")
  SushiTable.addBulk("avocado", "ingredient/avocado", "culturaldelights:cut_avocado", rools)
  $FoodModelHelper.map("culturaldelights:midori_roll", $FoodModelHelper.futomaki("midori_roll"))
  youkaishomecoming.cuisine_mixed(
    'culturaldelights:chicken_roll',
    "youkaishomecoming:futomaki",
    'youkaishomecoming:soy_sauce_bottle',
    [
      [
        "minecraft:carrot",
        "minecraft:beetroot"
      ],
      [
        "minecraft:carrot",
        "minecraft:beetroot"
      ],      
      '#forge:cooked_chicken',
      '#forge:cooked_chicken',
    ]
  ).id("youkaishomecoming:chicken_roll")
  SushiTable.addBulk("chicken", "ingredient/chicken", '#forge:cooked_chicken', rools)
  $FoodModelHelper.map("culturaldelights:chicken_roll", $FoodModelHelper.futomaki("chicken_roll"))
  youkaishomecoming.cuisine_mixed(
    'alexscaves:deep_sea_sushi_roll',
    "youkaishomecoming:futomaki",
    'youkaishomecoming:soy_sauce_bottle',
    [
      'alexscaves:tripodfish',
      'alexscaves:sea_pig',
      'alexscaves:lanternfish',
      'youkaishomecoming:cucumber_slice',
    ]
  ).id("youkaishomecoming:deep_sea_sushi_roll")
  SushiTable.addBulk("tripodfish", "ingredient/tripodfish", 'alexscaves:tripodfish', rools)
  SushiTable.addBulk("sea_pig", "ingredient/sea_pig", 'alexscaves:sea_pig', rools)
  SushiTable.addBulk("lanternfish", "ingredient/lanternfish", 'alexscaves:lanternfish', rools)
  $FoodModelHelper.map("alexscaves:deep_sea_sushi_roll", $FoodModelHelper.futomaki("deep_sea_roll"))
  youkaishomecoming.cuisine_ordered(
    "youkaishomecoming:roe_california_roll",
    "youkaishomecoming:california_roll",
    [
      "#forge:roe"
    ]
  ).id("youkaishomecoming:roe_california_roll")
})