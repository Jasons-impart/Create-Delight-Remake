const $ModularItem = Java.loadClass("se.mickelus.tetra.items.modular.ModularItem")
const $ItemEffect = Java.loadClass("se.mickelus.tetra.effect.ItemEffect")
let TetraUtil = {}
/**
 * 
 * @param {Internal.ItemStack} itemStack 
 * @returns {Internal.ModularItem}
 */
TetraUtil.getItem = function(itemStack) {
    let item = itemStack.item
    if (!item instanceof $ModularItem)
        return null
    return item
}

/**
 * 
 * @param {Internal.ItemStack} item 
 * @returns {Internal.Collection<Internal.ItemEffect>}
 */
TetraUtil.getItemEffects = function(item) {
    let itemClass = TetraUtil.getItem(item)
    return itemClass.getEffects(item)
}
/**
 * 
 * @param {Internal.ItemStack} item 
 * @param {string} effectKey
 * @returns {boolean}
 */
TetraUtil.itemHasEffect = function(item, effectKey) {
    let itemClass = TetraUtil.getItem(item)
    return itemClass.getEffects(item).contains($ItemEffect.get(effectKey))
}
/**
 * 
 * @param {string} key 
 * @returns {Internal.ItemEffect}
 */
TetraUtil.getEffectFromKey = function(key) {
    return $ItemEffect.get(effect)
}
/**
 * 
 * @param {Internal.ItemStack} item 
 * @param {string} effect 
 * @returns {number}
 */
TetraUtil.getEffectEfficiency = function(item, effect) {
    let itemClass = TetraUtil.getItem(item)
    return itemClass.getEffectEfficiency(item, $ItemEffect.get(effect))
}
/**
 * 
 * @param {Internal.ItemStack} item 
 * @param {string} effect 
 * @returns {number}
 */
TetraUtil.getEffectLevel = function(item, effect) {
    let itemClass = TetraUtil.getItem(item)
    return itemClass.getEffectLevel(item, $ItemEffect.get(effect))
}