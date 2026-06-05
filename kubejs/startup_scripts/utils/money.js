// priority: 1050

let LightmansCurrencyApi = global.CDLightmansCurrencyApi
let MoneyUtil = {}

MoneyUtil.getMoneyChain = function () {
    return LightmansCurrencyApi.CDConfig.moneyChain
}

MoneyUtil.coinValueFromBase = function (value) {
    return LightmansCurrencyApi.CoinValue["fromNumber(java.lang.String,long)"](MoneyUtil.getMoneyChain(), value)
}

MoneyUtil.coinValueFromItemOrValue = function (item, value) {
    return LightmansCurrencyApi.CoinValue.fromItemOrValue(Item.of(item).item, value)
}

MoneyUtil.insertPlayerMoney = function (player, moneyValue) {
    LightmansCurrencyApi.MoneyAPI.getApi().GetPlayersMoneyHandler(player).insertMoney(moneyValue, false)
}

MoneyUtil.getItemId = function (item) {
    return LightmansCurrencyApi.ForgeRegistries.ITEMS.getKey(item).toString()
}

MoneyUtil.getCoinName = function (item) {
    return LightmansCurrencyApi.ForgeRegistries.ITEMS.getKey(item).getPath().replace("_coin", "")
}

MoneyUtil.addCoreCoinDownExchangeRecipes = function (e) {
    let chain = LightmansCurrencyApi.CoinAPI.getApi().ChainData(MoneyUtil.getMoneyChain())
    if (chain == null) return

    chain.getCoreChain().forEach(entry => {
        let lowerExchange = entry.getLowerExchange()
        if (lowerExchange == null) return

        let input = entry.getCoin()
        let output = lowerExchange.getFirst().getCoin()
        let count = Number(lowerExchange.getSecond())

        e.recipes.minecraft.crafting_shapeless(
            Item.of(MoneyUtil.getItemId(output), count),
            [MoneyUtil.getItemId(input)]
        ).id(`createdelight:${MoneyUtil.getCoinName(input)}_2_${MoneyUtil.getCoinName(output)}`)
    })
}

/**
 * 将数字的值转化为含有货币的列表
 * @param {number} value 价值，以基础钱币（铁币）为基础
 * @returns {Internal.List<Internal.ItemStack>}
 */
MoneyUtil.convertBaseValueToItems = function (value) {
    /** @type {Internal.CoinValue} */
    let coinValue = MoneyUtil.coinValueFromBase(value)
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
