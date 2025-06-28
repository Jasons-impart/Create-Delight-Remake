

const $MoneyAPI = Java.loadClass("io.github.lightman314.lightmanscurrency.api.money.MoneyAPI")
const $CoinAPI = Java.loadClass("io.github.lightman314.lightmanscurrency.api.money.coins.CoinAPI")
const $CoinValue = Java.loadClass("io.github.lightman314.lightmanscurrency.api.money.value.builtin.CoinValue")
const $ChainData = Java.loadClass("io.github.lightman314.lightmanscurrency.api.money.coins.data.ChainData")
let MoneyUtil = {}

const COIN_CHAIN_MAIN_VALUE = "main"
/**
 * 
 * @returns {io.github.lightman314.lightmanscurrency.api.money.coins.data.ChainData}
 */
MoneyUtil.getMainChainData = function() {
    return $CoinAPI.API.ChainData(COIN_CHAIN_MAIN_VALUE)
}
/**
 * 将数字的值转化为含有货币的列表
 * @param {number} value 价值，以基础钱币（铁币）为基础
 * @returns {Internal.List<Internal.ItemStack>}
 */
MoneyUtil.convertBaseValueToItems = function(value) {
    /**
     * @type {Internal.CoinValue}
     */
    let coinValue = $CoinValue.fromNumber(COIN_CHAIN_MAIN_VALUE, value)
    if (coinValue.getAsItemList)
        return coinValue.getAsItemList()
    return ["minecraft:air"]
}
