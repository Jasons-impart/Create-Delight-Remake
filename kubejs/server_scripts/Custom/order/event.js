
/**
 * 计算订单货物属性事件
 * @param {string} id 
 * @param {(item: Internal.ItemStack) => number} itemFunc
 */
CreateDelightServerEvent.onCalculateGoodsQuality = function(id, itemFunc) {
    global.CreateDelight.goodsMap.put(id, itemFunc)
}
