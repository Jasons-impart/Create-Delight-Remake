const $CuriosApi = Java.loadClass("top.theillusivec4.curios.api.CuriosApi")
const $ICurioItem = Java.loadClass("top.theillusivec4.curios.api.type.capability.ICurioItem")

let CuriosUtil = {}
/**
 * 
 * @param {Internal.LivingEntity_} entity 
 * @returns {Internal.LazyOptional<Internal.ICuriosItemHandler>}
 */
CuriosUtil.getCuriosInventory = function(entity) {
    return $CuriosApi.getCuriosInventory(entity)
}
/**
 * 
 * @param {Internal.LivingEntity_} entity 
 * @param {Internal.ItemStack_} itemStack 
 * @returns {Internal.SlotResult[]}
 */
CuriosUtil.findCuriosFromEntity = function(entity, itemStack) {
    let slotResultList = []

    this.getCuriosInventory(entity).ifPresent(inv => inv.findCurios(itemStack.item).forEach(slotResult => {
        slotResultList.add(slotResult)
    }))
    return slotResultList
}