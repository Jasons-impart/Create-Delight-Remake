ServerEvents.tick(e => {    
    if (e.server.getLevel("minecraft:overworld").dayTime() % 12000 == 0) {
        let count = Utils.random.nextInt(0, 4)
        for (let i = 0; i < count; i++)
            global.Order.addOrderToAuction()
    }
})

ItemEvents.rightClicked("createdelight:unopened_order", e => {
    let draftStack = e.player.getItemInHand(e.hand)
    let otherStack = `${e.hand}` == "MAIN_HAND" ? e.player.offHandItem : e.player.mainHandItem

    if (global.Order.applyDraftSeal(draftStack, otherStack)) {
        if (!e.player.isCreative())
            otherStack.shrink(1)
        e.player.tell(Text.translate("message.createdelight.order_draft_sealed"))
        e.cancel()
        return
    }

    let draft = draftStack.nbt == null ? null : draftStack.nbt.OrderDraft
    let spec = global.Order.createSpecFromDraft(draft)
    draftStack.shrink(1)

    let ret = global.Order.create(e.player, spec)
    let attempts = 0
    while (ret.entries.length == 0 && attempts < 20) {
        ret = global.Order.create(e.player, spec)
        attempts++
    }
    e.player.give(Item.of("createdelight:order", 1, { createdelightOrderInfo: ret }))
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
