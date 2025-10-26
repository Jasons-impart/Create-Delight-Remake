let CreateDelight = {}
/**
 * @type {Internal.Map<string, (item: Internal.ItemStack) => number}
 */
CreateDelight.goodsMap = Utils.newMap()

global.CreateDelight = CreateDelight

//计算订单货物属性事件
/**
 * 
 * @param {string} id 
 * @param {(item: Internal.ItemStack) => number} itemFunc
 */
CreateDelightServerEvent.onCalculateGoodsQuality = function(id, itemFunc) {
    CreateDelight.goodsMap.put(id, itemFunc)
}

// CreateDelightServerEvent.onCalculateGoodsQuality("burger", item => {
//     return 3
// })