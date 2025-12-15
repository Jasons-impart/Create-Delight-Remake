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
    /** @type {Internal.CoinValue} */
    let coinValue = $CoinValue.fromNumber(COIN_CHAIN_MAIN_VALUE, value)
    if (coinValue.getAsItemList)
        return coinValue.getAsItemList()
    return ["minecraft:air"]
}

/**
 * 将数字的值转化为对应显示的字符串
 * @param {number} values 价值，以基础钱币（铁币）为基础
 */
MoneyUtil.convertBaseValueToString = function(values) {
    let component = Component.of("")
    if (values > 0)
        MoneyUtil.convertBaseValueToItems(values).forEach(item => {
            switch(item.id) {
                case "createdelightcore:iron_coin":
                    component.append(item.count.toString()).append(Component.of("§f\uAA01§r").font("createdelight:coin_font")).append(" ")
                    break
                case "createdelightcore:copper_coin":
                    component.append(item.count.toString()).append(Component.of("§f\uAA02§r").font("createdelight:coin_font")).append(" ")
                    break
                case "createdelightcore:gold_coin":
                    component.append(item.count.toString()).append(Component.of("§f\uAA03§r").font("createdelight:coin_font")).append(" ")
                    break
                case "createdelightcore:emerald_coin":
                    component.append(item.count.toString()).append(Component.of("§f\uAA04§r").font("createdelight:coin_font")).append(" ")
                    break
                case "createdelightcore:netherite_coin":
                    component.append(item.count.toString()).append(Component.of("§f\uAA05§r").font("createdelight:coin_font")).append(" ")
                    break
            }
        })
    else
        component = Component.of("§f\uAA01§r").font("createdelight:coin_font")
    return component
}
/**
 * 
 * @param {Internal.ItemStack} itemStack 
 * @returns 
 */
MoneyUtil.calculateFoodValue = function(itemStack) {
    let baseNutrition = 6
    let baseSaturationModifier = 0.6
    if (itemStack.getFoodProperties(null) == null) return -1
    let prop = itemStack.getFoodProperties(null)
    let { nutrition, saturationModifier, effects } = prop
    
    let num = 1
    effects.forEach(eff => {
        let effect = eff.first.get()
        num = num + 2 + effect.amplifier
        // Client.tell(`Effect: ${effect} Amp: ${effect.amplifier} Num: ${num}`)
    })
    let effMultipler = Math.sqrt(num)   
    nutrition = Math.max(nutrition, 1)
    saturationModifier = Math.max(saturationModifier, 0.1)
    return nutrition / baseNutrition * saturationModifier / baseSaturationModifier * 5 * effMultipler //以面包单价为参考
}