const $PlayerListing = Java.loadClass("io.github.lightman314.lightmanscurrency.common.traders.rules.types.PlayerListing")
const $TraderDataCache = Java.loadClass("io.github.lightman314.lightmanscurrency.common.data.types.TraderDataCache")
ItemEvents.rightClicked("minecraft:stick", e => {
})
/**
 * 
 * @param {Internal.QuestObjectCompletedEventJS} e 
 * @param {Internal.ItemStack_} item 
 */
function unlockTechTrade(e, item) {
    let trader = TradeUtil.getTradeAPI().GetTrader(false, 10)
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
                if (itemTradeData.getSellItem(0).is(item) || itemTradeData.getSellItem(1).is(item)) {
                    player.tell(listRule.addToWhitelist(player))
                    trader.markTradeRulesDirty()
                }
            }
        })
    })
}

let list = [
    ["510B2EE25982FD73", "create:andesite_alloy"],
    ["0E515BE9EA2A0B2F", "create:brass_ingot"],
    ["70CA8C3E0DEBBE1A", "createmetallurgy:steel_ingot"],
    ["2CBBADBE62382C1B", "create:electron_tube"],
    ["575185F2DB0AD44C", "create:precision_mechanism"],
    ["20B3A29ADFDF1D4A", "createdelightcore:bronze_ingot"],
    ["55E42ECE1CE4E99F", "createutilities:void_steel_ingot"],
    ["2CC8B87D086B3275", "createaddition:electrum_ingot"],
    ["614A05331AB5461E", "ae2:logic_processor"],
    ["553A46B5D4145655", "ae2:calculation_processor"],
    ["452DE0751B904A74", "megacells:accumulation_processor"],
    ["6B3B3C96CDBD584F", "ae2:engineering_processor"],
    ["292ADE53BBE862DB", "ae2:certus_quartz_crystal"],
    ["4CBACEC15826AB34", "ae2:fluix_crystal"],
    ["7A9629CF8E2BC6F1", "ae2:annihilation_core"],
    ["4F6B70A38ACBA2AC", "ae2:formation_core"],
    ["605F75F85D1E9394", "ad_astra:desh_ingot"],
    ["393E1E2F429F9972", "ad_astra:ostrum_ingot"],
    ["0EF849425CE2BC23", "ad_astra:calorite_ingot"]
]
list.forEach(v => {
    FTBQuestsEvents.completed(v[0], e => {
        unlockTechTrade(e, v[1])
        $TraderDataCache.TYPE.get(false).reloadPersistentTraders()
    })
})