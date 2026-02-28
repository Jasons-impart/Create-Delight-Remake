const $MoneyAPI = Java.loadClass("io.github.lightman314.lightmanscurrency.api.money.MoneyAPI")
const $CoinAPI = Java.loadClass("io.github.lightman314.lightmanscurrency.api.money.coins.CoinAPI")
const $ChainData = Java.loadClass("io.github.lightman314.lightmanscurrency.api.money.coins.data.ChainData")
// QualityUtils、QualityConfig、CoinValue 已在system.js里引用

let MoneyUtil = {}

const COIN_CHAIN_MAIN_VALUE = "main"
/**
 * 
 * @returns {io.github.lightman314.lightmanscurrency.api.money.coins.data.ChainData}
 */
MoneyUtil.getMainChainData = function () {
    return $CoinAPI.getApi().ChainData(COIN_CHAIN_MAIN_VALUE)
}
/**
 * 将数字的值转化为含有货币的列表
 * @param {number} value 价值，以基础钱币（铁币）为基础
 * @returns {Internal.List<Internal.ItemStack>}
 */
MoneyUtil.convertBaseValueToItems = function (value) {
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
MoneyUtil.convertBaseValueToString = function (values) {
    let component = Component.of("")
    if (values > 0)
        MoneyUtil.convertBaseValueToItems(values).forEach(item => {
            switch (item.id) {
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
MoneyUtil.calculateFoodValue = function (itemStack) {
    // 1. 尝试获取预设的 OEV 价值
    let baseValue = OEV$ItemValueManager.getValue(itemStack)

    // 2. 如果没有预设价值，则尝试根据食物属性计算基于营养的价值
    if (baseValue <= 0) {
        let prop = itemStack.getFoodProperties(null)
        // 不是食物且没有预设价值，直接返回不可出售标识 (-1)
        if (prop == null) return -1

        let { nutrition, saturationModifier, effects } = prop

        // 计算效果加成
        let effectScore = 1
        effects.forEach(eff => {
            let effect = eff.first.get()
            effectScore += 2 + effect.amplifier
        })
        let effMultipler = Math.sqrt(effectScore)

        // 基于默认面包作为参考基准计算价格 (nutrition=6, saturation=0.6)
        nutrition = Math.max(nutrition, 1)
        saturationModifier = Math.max(saturationModifier, 0.1)
        baseValue = (nutrition / 6) * (saturationModifier / 0.6) * 5 * effMultipler
    }

    // 3. 统一处理所有有价值物品的品质（Quality）倍率修正
    if (baseValue > 0) {
        let quality = $QualityUtils.getQuality(itemStack)
        if (quality.level() !== 0) {
            let multiplier = Math.round(Math.sqrt(2 / $QualityConfig.getChance(quality)))
            return baseValue * multiplier
        }
    }

    return baseValue
}

global.MoneyUtil = MoneyUtil
