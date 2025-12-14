
let CreateDelight = global.CreateDelight

/**
 * 计算订单货物属性事件
 * @param {string} id 
 * @param {(item: Internal.ItemStack) => number} itemFunc
 */
CreateDelightServerEvent.onCalculateGoodsQuality = function(id, itemFunc) {
    CreateDelight.goodsMap.put(id, itemFunc)
}

CreateDelightServerEvent.onCalculateGoodsQuality("western_wine", item => {
    if (item.hasNBT() && item.nbt.contains("EffectAmplifier"))
        return Math.min(item.nbt.getInt("EffectAmplifier") + 1, 3)
    return 2
})