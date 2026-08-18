ItemEvents.rightClicked("minecraft:stick", e => {
})

function cdTraderUnlockStackMatches(stack, target) {
    if (stack == null || stack.isEmpty())
        return false
    let targetStack = Item.of(target)
    if (!stack.is(targetStack.id))
        return false
    if (!targetStack.hasNBT())
        return true
    return stack.hasNBT() && stack.nbt.equals(targetStack.nbt)
}

/** @param {Internal.ServerPlayer} player */
function unlockTraderTradeForPlayer(player, id, item) {
    if (!(item instanceof Array))
        item = [item]
    let trader = global.CDServerJavaClasses.$TraderDataCache.TYPE.get(false).getTrader(id)
    if (trader == null) {
        console.error(`Unable to unlock persistent trader '${id}': trader not found`)
        return false
    }
    let changed = false
    trader.tradeData.forEach(tradeData => {
        tradeData.rules.forEach(rule => {
            if (rule instanceof global.CDServerJavaClasses.$PlayerListing) {
                /**
                 * @type {Internal.PlayerListing}
                 */
                let listRule = rule
                /**
                * @type {Internal.ItemTradeData}
                */
                let itemTradeData = tradeData
                item.forEach(item => {
                    if (cdTraderUnlockStackMatches(itemTradeData.getSellItem(0), item)
                        || cdTraderUnlockStackMatches(itemTradeData.getSellItem(1), item)) {
                        if (listRule.addToWhitelist(player)) {
                            trader.markTradeRulesDirty()
                            changed = true
                        }
                    }
                })
            }
        })
    })
    return changed
}

function hasCompletedTradeUnlockQuest(player, questId) {
    let file = global.CDServerJavaClasses.$ServerQuestFile.INSTANCE
    if (file == null)
        return false
    let quest = file.getQuest(file.getID(questId))
    if (quest == null)
        return false
    return file.getOrCreateTeamData(player).isCompleted(quest)
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
    ["4FCBBE103FE7E9C7", "northstar:titanium_ingot"],
    ["057F6F421273C4DC", "northstar:martian_steel_ingot"]
]
let res_list = [
    ["63356DE1A41FB7E0", ["minecraft:copper_ingot", "minecraft:iron_ingot", "minecraft:coal", "createdelightcore:tin_ingot", "create:zinc_ingot"]],
    ["441F72B76AC3D7AC", ["minecraft:gold_ingot", "minecraft:diamond", "iceandfire:silver_ingot"]],
    ["36114A8D5283E6E5", ["createmetallurgy:tungsten_ingot", "minecraft:ancient_debris"]]
]

let order_clause_trade_unlocks = [
    { level: 2, clauses: ["specialty_supply", "banquet_assortment"] },
    { level: 3, clauses: ["bulk_purchase", "small_premium"] },
    { level: 4, clauses: ["quality_inspection"] },
    { level: 5, clauses: ["reputation_priority", "cash_settlement"] }
]

function cdOrderClauseTradeStack(clause) {
    return Item.of("createdelight:order_clause", 1, { OrderClause: clause })
}

function cdUnlockOrderClauseTrades(player, minimumExclusiveLevel, currentLevel, notify) {
    let changed = false
    order_clause_trade_unlocks.forEach(tier => {
        if (tier.level <= minimumExclusiveLevel || tier.level > currentLevel)
            return
        tier.clauses.forEach(clause => {
            let clauseChanged = unlockTraderTradeForPlayer(
                player,
                "order_guild_trader",
                cdOrderClauseTradeStack(clause)
            )
            if (clauseChanged && notify) {
                player.tell(Text.translate(
                    "message.createdelight.order_clause.trade_unlocked",
                    tier.level,
                    Text.translate(`tooltip.createdelight.order_clause.${clause}.name`)
                ))
            }
            changed = clauseChanged || changed
        })
    })
    return changed
}

global.Order.reputation.notifyTradeUnlocks = function(player, beforeLevel, afterLevel) {
    if (cdUnlockOrderClauseTrades(player, beforeLevel, afterLevel, true))
        global.CDServerJavaClasses.$TraderDataCache.TYPE.get(false).reloadPersistentTraders()
}
tech_list.forEach(v => {
    FTBQuestsEvents.completed(v[0], e => {
        if (unlockTraderTradeForPlayer(e.player, "technology_help_trade", v[1]))
            global.CDServerJavaClasses.$TraderDataCache.TYPE.get(false).reloadPersistentTraders()
    })
})

res_list.forEach(v => {
    FTBQuestsEvents.completed(v[0], e => {
        if (unlockTraderTradeForPlayer(e.player, "resource_trader", v[1]))
            global.CDServerJavaClasses.$TraderDataCache.TYPE.get(false).reloadPersistentTraders()
    })
})

PlayerEvents.loggedIn(e => {
    let changed = false
    tech_list.forEach(v => {
        if (!hasCompletedTradeUnlockQuest(e.player, v[0]))
            return
        changed = unlockTraderTradeForPlayer(e.player, "technology_help_trade", v[1]) || changed
    })
    res_list.forEach(v => {
        if (!hasCompletedTradeUnlockQuest(e.player, v[0]))
            return
        changed = unlockTraderTradeForPlayer(e.player, "resource_trader", v[1]) || changed
    })
    let reputationLevel = global.Order.reputation.getLevel(e.player)
    let clauseChanged = cdUnlockOrderClauseTrades(e.player, 0, reputationLevel, false)
    if (clauseChanged) {
        e.player.tell(Text.translate(
            "message.createdelight.order_clause.trade_reconciled",
            reputationLevel
        ))
    }
    changed = clauseChanged || changed
    if (changed)
        global.CDServerJavaClasses.$TraderDataCache.TYPE.get(false).reloadPersistentTraders()
})
