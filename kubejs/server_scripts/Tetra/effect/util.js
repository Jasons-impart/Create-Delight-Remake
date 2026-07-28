let TetraUtil = {}
/**
 *
 * @param {Internal.ItemStack} itemStack
 * @returns {Internal.ModularItem}
 */
TetraUtil.getItem = function(itemStack) {
    if (itemStack == null || itemStack.empty)
        return null
    let item = itemStack.item
    if (!(item instanceof global.CDServerJavaClasses.$IModularItem))
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
    if (itemClass == null)
        return Utils.newList()
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
    if (itemClass == null)
        return false
    return itemClass.getEffects(item).contains(global.CDServerJavaClasses.$ItemEffect.get(effectKey))
}
/**
 *
 * @param {string} key
 * @returns {Internal.ItemEffect}
 */
TetraUtil.getEffectFromKey = function(key) {
    return global.CDServerJavaClasses.$ItemEffect.get(key)
}
/**
 *
 * @param {Internal.ItemStack} item
 * @param {string} effect
 * @returns {number}
 */
TetraUtil.getEffectEfficiency = function(item, effect) {
    let itemClass = TetraUtil.getItem(item)
    if (itemClass == null)
        return 0
    return itemClass.getEffectEfficiency(item, global.CDServerJavaClasses.$ItemEffect.get(effect))
}
/**
 *
 * @param {Internal.ItemStack} item
 * @param {string} effect
 * @returns {number}
 */
TetraUtil.getEffectLevel = function(item, effect) {
    let itemClass = TetraUtil.getItem(item)
    if (itemClass == null)
        return 0
    return itemClass.getEffectLevel(item, global.CDServerJavaClasses.$ItemEffect.get(effect))
}

/**
 * Returns the summed level of an effect across equipped modular armor.
 *
 * @param {Internal.LivingEntity} entity
 * @param {string} effect
 * @returns {number}
 */
TetraUtil.getArmorEffectLevel = function(entity, effect) {
    if (entity == null)
        return 0
    return global.CDServerJavaClasses.$GeoArmorEffectUtil.getArmorTotalEffectLevel(
        entity,
        global.CDServerJavaClasses.$ItemEffect.get(effect)
    )
}

/**
 * Returns the higher effect level from the entity's main hand and offhand.
 *
 * @param {Internal.LivingEntity} entity
 * @param {string} effect
 * @returns {number}
 */
TetraUtil.getHeldEffectLevel = function(entity, effect) {
    if (entity == null)
        return 0
    return Math.max(
        TetraUtil.getEffectLevel(entity.mainHandItem, effect),
        TetraUtil.getEffectLevel(entity.offHandItem, effect)
    )
}
