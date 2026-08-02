ServerEvents.tick(e => {    
    if (e.server.getLevel("minecraft:overworld").dayTime() % 12000 == 0) {
        let count = Utils.random.nextInt(1, 4)
        for (let i = 0; i < count; i++)
            global.Order.addOrderToAuction()
    }
})

const ORDER_MARKET_SYNC_PACKET = "createdelight_order_market_saturation"

global.syncOrderMarketSaturation = function(player) {
    if (player == null || global.Order == null || global.Order.marketSaturation == null)
        return

    global.Order.ensureDataLoaded()
    let config = global.Order.marketSaturationConfig
    let raw = player.persistentData.getString(config.storageKey)
    player.sendData(ORDER_MARKET_SYNC_PACKET, {
        data: raw == null ? "" : raw,
        day: global.Order.marketSaturation.getDay(player)
    })
}

PlayerEvents.loggedIn(e => {
    global.syncOrderMarketSaturation(e.player)
})

PlayerEvents.tick(e => {
    if (e.level.time % 200 != 0)
        return
    global.syncOrderMarketSaturation(e.player)
})

ItemEvents.rightClicked("createdelight:unopened_order", e => {
    let draftStack = e.player.getItemInHand(e.hand)
    let otherStack = `${e.hand}` == "MAIN_HAND" ? e.player.offHandItem : e.player.mainHandItem

    if (otherStack.is("createdelight:order_seal")) {
        if (!global.Order.applyDraftSeal(draftStack, otherStack)) {
            e.player.tell(Text.translate("message.createdelight.order_draft_material_failed"))
            e.cancel()
            return
        }
        if (!e.player.isCreative())
            otherStack.shrink(1)
        e.player.tell(Text.translate("message.createdelight.order_draft_sealed"))
        e.cancel()
        return
    }

    if (otherStack.is("createdelight:order_clause")) {
        if (!global.Order.applyDraftClause(draftStack, otherStack)) {
            e.player.tell(Text.translate("message.createdelight.order_draft_clause_failed"))
            e.cancel()
            return
        }
        if (!e.player.isCreative())
            otherStack.shrink(1)
        e.player.tell(Text.translate("message.createdelight.order_draft_clause_applied"))
        e.cancel()
        return
    }

    global.Order.openDraft(e.player, draftStack)
    e.cancel()
})

ItemEvents.rightClicked("createdelight:order_seal", e => {
    let sealStack = e.player.getItemInHand(e.hand)
    let draftStack = `${e.hand}` == "MAIN_HAND" ? e.player.offHandItem : e.player.mainHandItem

    if (!global.Order.applyDraftSeal(draftStack, sealStack))
        return

    if (!e.player.isCreative())
        sealStack.shrink(1)
    e.player.tell(Text.translate("message.createdelight.order_draft_sealed"))
    e.cancel()
})

ItemEvents.rightClicked("createdelight:order_clause", e => {
    let clauseStack = e.player.getItemInHand(e.hand)
    let draftStack = `${e.hand}` == "MAIN_HAND" ? e.player.offHandItem : e.player.mainHandItem

    if (!draftStack.is("createdelight:unopened_order"))
        return
    if (!global.Order.applyDraftClause(draftStack, clauseStack)) {
        e.player.tell(Text.translate("message.createdelight.order_draft_clause_failed"))
        e.cancel()
        return
    }

    if (!e.player.isCreative())
        clauseStack.shrink(1)
    e.player.tell(Text.translate("message.createdelight.order_draft_clause_applied"))
    e.cancel()
})
