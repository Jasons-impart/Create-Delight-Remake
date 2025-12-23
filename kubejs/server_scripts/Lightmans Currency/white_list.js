const $PlayerListing = Java.loadClass("io.github.lightman314.lightmanscurrency.common.traders.rules.types.PlayerListing")
const $TraderDataCache = Java.loadClass("io.github.lightman314.lightmanscurrency.common.data.types.TraderDataCache")
ItemEvents.rightClicked("minecraft:stick", e => {
})
/**
 * 
 * @param {Internal.QuestObjectCompletedEventJS} e 
 * @param {Internal.ItemStack_[]} item 
 */
function unlockTraderTrade(e, id, item) {
    if (!(item instanceof Array))
        item = [item]
    let trader = TradeUtil.getTradeAPI().GetTrader(false, id)
    let player = e.player
    trader.tradeData.forEach(tradeData => {
        tradeData.rules.forEach(rule => {
            if (rule instanceof $PlayerListing) {
                /**
                 * @type {Internal.PlayerListing}
                 */
                let listRule = rule
                /**
                * @type {Internal.ItemTradeData}
                */
                let itemTradeData = tradeData
                item.forEach(item => {
                    if (itemTradeData.getSellItem(0).is(item) || itemTradeData.getSellItem(1).is(item)) {
                        if (listRule.addToWhitelist(player))
                            trader.markTradeRulesDirty()
                    }
                })
            }
        })
    })
}

let tech_list = [
    ["7D54AF3A775B6E9E", "create:andesite_alloy"],
    ["7A608C48C3947975", "create:brass_ingot"],
    ["027EEF0721C497D3", "createmetallurgy:steel_ingot"],
    ["3A1374A5FCBE5558", "create:electron_tube"],
    ["2C75BC13E58E3293", "create:precision_mechanism"],
    ["7794F6910AF7591C", "createdelightcore:bronze_ingot"],
    ["02FD263E4D2BFD82", "createmetallurgy:obdurium_ingot"],
    ["256EC76BA5595E4C", "createutilities:void_steel_ingot"],
    ["52CAEFBED4952D92", "createaddition:electrum_ingot"],
    ["50B7170A5AAEBA8A", "ae2:logic_processor"],
    ["1219B75C2EB5BDD3", "ae2:calculation_processor"],
    ["555915045BD9EEC0", "megacells:accumulation_processor"],
    ["5B0583F6E1474359", "ae2:engineering_processor"],
    ["7781E14E3569EDC6", "ae2:certus_quartz_crystal"],
    ["611F3C0D64351D0F", "ae2:fluix_crystal"],
    ["6098CD2DFB98E121", "ae2:annihilation_core"],
    ["3042E8CAEFF3F7CE", "ae2:formation_core"],
    ["4FCBBE103FE7E9C7", "ad_astra:desh_ingot"],
    ["057F6F421273C4DC", "ad_astra:ostrum_ingot"],
    ["630E52E14877F5B7", "ad_astra:calorite_ingot"]
]
let res_list = [
    ["63356DE1A41FB7E0", ["minecraft:copper_ingot", "minecraft:iron_ingot", "minecraft:coal", "createdelightcore:tin_ingot", "create:zinc_ingot"]],
    ["441F72B76AC3D7AC", ["minecraft:gold_ingot", "minecraft:diamond", "iceandfire:silver_ingot"]],
    ["36114A8D5283E6E5", ["createmetallurgy:tungsten_ingot", "minecraft:ancient_debris"]]
]
tech_list.forEach(v => {
    FTBQuestsEvents.completed(v[0], e => {
        unlockTraderTrade(e, 7, v[1])
        $TraderDataCache.TYPE.get(false).reloadPersistentTraders()
    })
})

res_list.forEach(v => {
    FTBQuestsEvents.completed(v[0], e => {
        unlockTraderTrade(e, 10, v[1])
        $TraderDataCache.TYPE.get(false).reloadPersistentTraders()
    })
})