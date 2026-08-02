const ORDER_BUILDER_TRAITS = {
    draft: "draft_slot",
    customerSeal: "seal_slot_1",
    categorySeal: "seal_slot_2",
    modifier1: "modifier_slot_1",
    modifier2: "modifier_slot_2",
    result: "result_slot"
}

const ORDER_BUILDER_WIDGETS = {
    draft: "ui:draft_slot_0",
    customerSeal: "ui:seal_slot_1_0",
    categorySeal: "ui:seal_slot_2_0",
    modifier1: "ui:modifier_slot_1_0",
    modifier2: "ui:modifier_slot_2_0",
    result: "ui:result_slot_0",
    applyButton: "apply_button",
    openButton: "open_button",
    statusText: "status_text"
}

const ORDER_BUILDER_LANG = {
    draftSlot: "gui.createdelight.order_builder.draft_slot",
    customerSealSlot: "gui.createdelight.order_builder.customer_seal_slot",
    categorySealSlot: "gui.createdelight.order_builder.category_seal_slot",
    modifier1Slot: "gui.createdelight.order_builder.modifier_slot_1",
    modifier2Slot: "gui.createdelight.order_builder.modifier_slot_2",
    resultSlot: "gui.createdelight.order_builder.result_slot",
    applyButton: "gui.createdelight.order_builder.apply",
    openButton: "gui.createdelight.order_builder.open",
    customerOnly: "message.createdelight.order_builder.customer_only",
    categoryOnly: "message.createdelight.order_builder.category_only",
    clauseOnly: "message.createdelight.order_builder.clause_only",
    clauseFailed: "message.createdelight.order_builder.clause_failed",
    sealFailed: "message.createdelight.order_builder.seal_failed",
    needDraft: "message.createdelight.order_builder.need_draft",
    needMaterial: "message.createdelight.order_builder.need_material",
    resultBlocked: "message.createdelight.order_builder.result_blocked",
    needOwner: "message.createdelight.order_builder.need_owner",
    applied: "message.createdelight.order_builder.applied",
    appliedCount: "message.createdelight.order_builder.applied_count",
    extractFailed: "message.createdelight.order_builder.extract_failed",
    opened: "message.createdelight.order_builder.opened",
    statusReady: "gui.createdelight.order_builder.status.ready",
    statusNeedDraft: "gui.createdelight.order_builder.status.need_draft",
    statusNeedMaterial: "gui.createdelight.order_builder.status.need_material",
    statusResultBlocked: "gui.createdelight.order_builder.status.result_blocked",
    statusNeedOwner: "gui.createdelight.order_builder.status.need_owner",
    statusApplied: "gui.createdelight.order_builder.status.applied",
    statusAppliedCount: "gui.createdelight.order_builder.status.applied_count",
    statusOpened: "gui.createdelight.order_builder.status.opened",
    applyTip1: "tooltip.createdelight.order_builder.apply.1",
    applyTip2: "tooltip.createdelight.order_builder.apply.2",
    openTip1: "tooltip.createdelight.order_builder.open.1",
    openTip2: "tooltip.createdelight.order_builder.open.2"
}

const ORDER_BUILDER_DATA = {
    owner: "owner",
    ownerName: "ownerName"
}

function getOtherHandItem(player, hand) {
    return `${hand}` == "MAIN_HAND" ? player.offHandItem : player.mainHandItem
}

function orderBuilderTranslate(key) {
    return Component.translate(key)
}

function orderBuilderTranslateArgs(key, args) {
    if (args == null || args.length <= 0)
        return Component.translate(key)
    if (args.length == 1)
        return Component.translate(key, args[0])
    if (args.length == 2)
        return Component.translate(key, args[0], args[1])
    if (args.length == 3)
        return Component.translate(key, args[0], args[1], args[2])
    return Component.translate(key, args)
}

function orderBuilderTranslateString(key) {
    return Component.translate(key).getString()
}

function orderBuilderTranslateStringArgs(key, args) {
    return orderBuilderTranslateArgs(key, args).getString()
}

function tellOrderBuilder(player, key) {
    if (player != null)
        player.tell(orderBuilderTranslate(key))
}

function tellOrderBuilderArgs(player, key, args) {
    if (player != null)
        player.tell(orderBuilderTranslateArgs(key, args))
}

function setOrderBuilderStatus(statusWidget, key) {
    if (statusWidget != null && statusWidget.setText != null)
        statusWidget.setText(orderBuilderTranslateString(key))
}

function setOrderBuilderStatusArgs(statusWidget, key, args) {
    if (statusWidget != null && statusWidget.setText != null)
        statusWidget.setText(orderBuilderTranslateStringArgs(key, args))
}

function getOrderBuilderTraitStorage(machine, name) {
    let trait = machine == null ? null : machine.getTraitByName(name)
    return trait == null ? null : trait.storage
}

function getOrderBuilderSlot(machine, name) {
    let storage = getOrderBuilderTraitStorage(machine, name)
    if (storage == null || storage.slots <= 0)
        return Item.empty
    return storage.getStackInSlot(0)
}

function isOrderBuilderStackEmpty(stack) {
    return stack == null || stack.empty || stack.isEmpty && stack.isEmpty() || stack.is && stack.is("air") || stack.count <= 0
}

function getOrderBuilderSealKey(stack) {
    if (isOrderBuilderStackEmpty(stack) || !stack.is("createdelight:order_seal"))
        return null
    return stack.nbt == null || stack.nbt.OrderSeal == null ? null : `${stack.nbt.OrderSeal}`
}

function getOrderBuilderSeal(stack) {
    global.Order.ensureDataLoaded()
    let key = getOrderBuilderSealKey(stack)
    return key == null ? null : global.Order.orderDraftSeals[key]
}

function isOrderBuilderSealType(stack, type) {
    let seal = getOrderBuilderSeal(stack)
    return seal != null && seal.type == type
}

function isOrderBuilderClause(stack) {
    return !isOrderBuilderStackEmpty(stack) && global.Order.getClause(stack) != null
}

function consumeOrderBuilderSlot(machine, name, count) {
    let storage = getOrderBuilderTraitStorage(machine, name)
    if (storage != null)
        storage.extractItem(0, count, false, false)
}

function isOrderBuilderDraft(stack) {
    return !isOrderBuilderStackEmpty(stack) && stack.is("createdelight:unopened_order")
}

function isOrderBuilderOutputItem(stack) {
    return !isOrderBuilderStackEmpty(stack) && (stack.is("createdelight:unopened_order") || stack.is("createdelight:order"))
}

function hasOrderBuilderOwner(machine) {
    try {
        return machine != null && machine.customData.contains(ORDER_BUILDER_DATA.owner)
    } catch (error) {
        return false
    }
}

function storeOrderBuilderOwner(machine, player, overwrite) {
    if (machine == null || player == null || player.fake || !player.player)
        return
    if (!overwrite && hasOrderBuilderOwner(machine))
        return
    machine.customData.putUUID(ORDER_BUILDER_DATA.owner, player.uuid)
    machine.customData.putString(ORDER_BUILDER_DATA.ownerName, `${player.username}`)
}

function getOrderBuilderOwner(machine, fallbackPlayer) {
    if (machine == null)
        return fallbackPlayer

    try {
        if (machine.customData.contains(ORDER_BUILDER_DATA.owner)) {
            let owner = machine.level.getPlayerByUUID(machine.customData.getUUID(ORDER_BUILDER_DATA.owner))
            if (owner != null)
                return owner
        }
    } catch (error) {
    }

    return fallbackPlayer
}

function consumeOrderBuilderSeal(player, sealStack) {
    if (player == null || sealStack == null || player.isCreative())
        return
    sealStack.shrink(1)
}

function trySealOrderDraftAtBuilder(player, draftStack, sealStack) {
    if (!global.Order.applyDraftSeal(draftStack, sealStack))
        return false

    consumeOrderBuilderSeal(player, sealStack)
    player.tell(Text.translate("message.createdelight.order_draft_sealed"))
    player.swing()
    return true
}

function applyOrderBuilderSealSlot(machine, player, statusWidget, draftStack, traitName, expectedType) {
    let sealStack = getOrderBuilderSlot(machine, traitName)
    if (isOrderBuilderStackEmpty(sealStack))
        return false

    if (!isOrderBuilderSealType(sealStack, expectedType)) {
        tellOrderBuilder(player, expectedType == "customer" ? ORDER_BUILDER_LANG.customerOnly : ORDER_BUILDER_LANG.categoryOnly)
        setOrderBuilderStatus(statusWidget, expectedType == "customer" ? ORDER_BUILDER_LANG.customerOnly : ORDER_BUILDER_LANG.categoryOnly)
        return false
    }

    if (!global.Order.applyDraftSeal(draftStack, sealStack)) {
        tellOrderBuilder(player, ORDER_BUILDER_LANG.sealFailed)
        setOrderBuilderStatus(statusWidget, ORDER_BUILDER_LANG.sealFailed)
        return false
    }

    consumeOrderBuilderSlot(machine, traitName, 1)
    return true
}

function getOrderBuilderValidMaterialPlan(machine, player, statusWidget, draftStack) {
    let plan = []
    let customerSeal = getOrderBuilderSlot(machine, ORDER_BUILDER_TRAITS.customerSeal)
    let categorySeal = getOrderBuilderSlot(machine, ORDER_BUILDER_TRAITS.categorySeal)

    if (!isOrderBuilderStackEmpty(customerSeal)) {
        if (!isOrderBuilderSealType(customerSeal, "customer")) {
            tellOrderBuilder(player, ORDER_BUILDER_LANG.customerOnly)
            setOrderBuilderStatus(statusWidget, ORDER_BUILDER_LANG.customerOnly)
            return null
        }
        plan.push({ trait: ORDER_BUILDER_TRAITS.customerSeal, stack: customerSeal, kind: "seal" })
    }

    if (!isOrderBuilderStackEmpty(categorySeal)) {
        if (!isOrderBuilderSealType(categorySeal, "category")) {
            tellOrderBuilder(player, ORDER_BUILDER_LANG.categoryOnly)
            setOrderBuilderStatus(statusWidget, ORDER_BUILDER_LANG.categoryOnly)
            return null
        }
        plan.push({ trait: ORDER_BUILDER_TRAITS.categorySeal, stack: categorySeal, kind: "seal" })
    }

    let draftSource = draftStack.nbt == null ? null : draftStack.nbt.OrderDraft
    let draft = {
        Clauses: global.Order.toArray(draftSource == null ? null : draftSource.Clauses).map(value => `${value}`)
    }
    let modifierTraits = [ORDER_BUILDER_TRAITS.modifier1, ORDER_BUILDER_TRAITS.modifier2]
    for (let i = 0; i < modifierTraits.length; i++) {
        let modifierStack = getOrderBuilderSlot(machine, modifierTraits[i])
        if (isOrderBuilderStackEmpty(modifierStack))
            continue
        if (!isOrderBuilderClause(modifierStack)) {
            tellOrderBuilder(player, ORDER_BUILDER_LANG.clauseOnly)
            setOrderBuilderStatus(statusWidget, ORDER_BUILDER_LANG.clauseOnly)
            return null
        }
        let clauseKey = global.Order.getClauseKey(modifierStack)
        if (global.Order.validateDraftClause(draft, clauseKey) != null) {
            tellOrderBuilder(player, ORDER_BUILDER_LANG.clauseFailed)
            setOrderBuilderStatus(statusWidget, ORDER_BUILDER_LANG.clauseFailed)
            return null
        }
        draft.Clauses = global.Order.toArray(draft.Clauses).concat([clauseKey])
        plan.push({ trait: modifierTraits[i], stack: modifierStack, kind: "clause" })
    }

    if (plan.length <= 0) {
        tellOrderBuilder(player, ORDER_BUILDER_LANG.needMaterial)
        setOrderBuilderStatus(statusWidget, ORDER_BUILDER_LANG.statusNeedMaterial)
        return null
    }

    return plan
}

function getOrderBuilderBatchLimit(draftStack, materialPlan) {
    let limit = draftStack.count
    materialPlan.forEach(material => {
        limit = Math.min(limit, material.stack.count)
    })
    return limit
}

function createOrderBuilderModifiedDraft(draftStack, materialPlan, count) {
    let output = draftStack.copyWithCount(count)
    for (let i = 0; i < materialPlan.length; i++) {
        let applied = materialPlan[i].kind == "clause"
            ? global.Order.applyDraftClause(output, materialPlan[i].stack)
            : global.Order.applyDraftSeal(output, materialPlan[i].stack)
        if (!applied)
            return Item.empty
    }
    return output
}

function getOrderBuilderInsertableCount(storage, stack) {
    if (storage == null || isOrderBuilderStackEmpty(stack))
        return 0

    let remainder = ItemTransferHelper.insertItemStacked(storage, stack, true)
    if (isOrderBuilderStackEmpty(remainder))
        return stack.count
    return Math.max(0, stack.count - remainder.count)
}

function canOrderBuilderInsertAll(storage, stack) {
    return getOrderBuilderInsertableCount(storage, stack) >= stack.count
}

function applyOrderBuilderSlots(machine, player, statusWidget) {
    let draftStack = getOrderBuilderSlot(machine, ORDER_BUILDER_TRAITS.draft)
    if (!isOrderBuilderDraft(draftStack)) {
        tellOrderBuilder(player, ORDER_BUILDER_LANG.needDraft)
        setOrderBuilderStatus(statusWidget, ORDER_BUILDER_LANG.statusNeedDraft)
        return
    }

    let materialPlan = getOrderBuilderValidMaterialPlan(machine, player, statusWidget, draftStack)
    if (materialPlan == null)
        return

    let resultStorage = getOrderBuilderTraitStorage(machine, ORDER_BUILDER_TRAITS.result)
    let batchLimit = getOrderBuilderBatchLimit(draftStack, materialPlan)
    let outputStack = createOrderBuilderModifiedDraft(draftStack, materialPlan, batchLimit)
    if (isOrderBuilderStackEmpty(outputStack)) {
        tellOrderBuilder(player, ORDER_BUILDER_LANG.sealFailed)
        setOrderBuilderStatus(statusWidget, ORDER_BUILDER_LANG.sealFailed)
        return
    }

    let insertable = getOrderBuilderInsertableCount(resultStorage, outputStack)
    if (insertable <= 0) {
        tellOrderBuilder(player, ORDER_BUILDER_LANG.resultBlocked)
        setOrderBuilderStatus(statusWidget, ORDER_BUILDER_LANG.statusResultBlocked)
        return
    }

    let finalOutput = insertable == outputStack.count ? outputStack : outputStack.copyWithCount(insertable)
    consumeOrderBuilderSlot(machine, ORDER_BUILDER_TRAITS.draft, insertable)
    materialPlan.forEach(material => consumeOrderBuilderSlot(machine, material.trait, insertable))
    ItemTransferHelper.insertItemStacked(resultStorage, finalOutput, false)

    tellOrderBuilderArgs(player, ORDER_BUILDER_LANG.appliedCount, [insertable])
    setOrderBuilderStatusArgs(statusWidget, ORDER_BUILDER_LANG.statusAppliedCount, [insertable])
}

function getOrderBuilderOpenSource(machine) {
    let draftStack = getOrderBuilderSlot(machine, ORDER_BUILDER_TRAITS.draft)
    if (isOrderBuilderDraft(draftStack))
        return ORDER_BUILDER_TRAITS.draft

    let resultStack = getOrderBuilderSlot(machine, ORDER_BUILDER_TRAITS.result)
    if (isOrderBuilderDraft(resultStack))
        return ORDER_BUILDER_TRAITS.result

    return null
}

function createOrderBuilderOpenedOrder(owner, draftStack) {
    if (owner == null || !isOrderBuilderDraft(draftStack))
        return Item.empty

    let draft = draftStack.nbt == null ? null : draftStack.nbt.OrderDraft
    let spec = global.Order.createSpecFromDraft(draft)
    let order = global.Order.create(owner, spec)
    let attempts = 0
    while (order.entries.length == 0 && attempts < 20) {
        order = global.Order.create(owner, spec)
        attempts++
    }

    return Item.of("createdelight:order", 1, { createdelightOrderInfo: order })
}

function openOrderBuilderDraft(machine, player, statusWidget) {
    let sourceTrait = getOrderBuilderOpenSource(machine)
    if (sourceTrait == null) {
        tellOrderBuilder(player, ORDER_BUILDER_LANG.needDraft)
        setOrderBuilderStatus(statusWidget, ORDER_BUILDER_LANG.statusNeedDraft)
        return
    }

    let storage = getOrderBuilderTraitStorage(machine, sourceTrait)
    let resultStorage = getOrderBuilderTraitStorage(machine, ORDER_BUILDER_TRAITS.result)
    if (storage == null || resultStorage == null)
        return

    let owner = getOrderBuilderOwner(machine, player)
    if (owner == null) {
        tellOrderBuilder(player, ORDER_BUILDER_LANG.needOwner)
        setOrderBuilderStatus(statusWidget, ORDER_BUILDER_LANG.statusNeedOwner)
        return
    }

    let sourceStack = getOrderBuilderSlot(machine, sourceTrait)
    let openedOrder = createOrderBuilderOpenedOrder(owner, sourceStack)
    if (isOrderBuilderStackEmpty(openedOrder)) {
        tellOrderBuilder(player, ORDER_BUILDER_LANG.extractFailed)
        setOrderBuilderStatus(statusWidget, ORDER_BUILDER_LANG.extractFailed)
        return
    }

    if (sourceTrait == ORDER_BUILDER_TRAITS.result && sourceStack.count > 1) {
        tellOrderBuilder(player, ORDER_BUILDER_LANG.resultBlocked)
        setOrderBuilderStatus(statusWidget, ORDER_BUILDER_LANG.statusResultBlocked)
        return
    }

    if (sourceTrait != ORDER_BUILDER_TRAITS.result && !canOrderBuilderInsertAll(resultStorage, openedOrder)) {
        tellOrderBuilder(player, ORDER_BUILDER_LANG.resultBlocked)
        setOrderBuilderStatus(statusWidget, ORDER_BUILDER_LANG.statusResultBlocked)
        return
    }

    let extracted = storage.extractItem(0, 1, false, false)
    if (isOrderBuilderStackEmpty(extracted)) {
        tellOrderBuilder(player, ORDER_BUILDER_LANG.extractFailed)
        setOrderBuilderStatus(statusWidget, ORDER_BUILDER_LANG.extractFailed)
        return
    }

    ItemTransferHelper.insertItemStacked(resultStorage, openedOrder, false)
    tellOrderBuilder(player, ORDER_BUILDER_LANG.opened)
    setOrderBuilderStatus(statusWidget, ORDER_BUILDER_LANG.statusOpened)
}

function setOrderBuilderStorageFilters(machine) {
    let draft = getOrderBuilderTraitStorage(machine, ORDER_BUILDER_TRAITS.draft)
    if (draft != null)
        draft.setFilter(item => item != null && item.is("createdelight:unopened_order"))

    let customerSeal = getOrderBuilderTraitStorage(machine, ORDER_BUILDER_TRAITS.customerSeal)
    if (customerSeal != null)
        customerSeal.setFilter(item => isOrderBuilderSealType(item, "customer"))

    let categorySeal = getOrderBuilderTraitStorage(machine, ORDER_BUILDER_TRAITS.categorySeal)
    if (categorySeal != null)
        categorySeal.setFilter(item => isOrderBuilderSealType(item, "category"))

    let modifier1 = getOrderBuilderTraitStorage(machine, ORDER_BUILDER_TRAITS.modifier1)
    if (modifier1 != null)
        modifier1.setFilter(item => isOrderBuilderClause(item))

    let modifier2 = getOrderBuilderTraitStorage(machine, ORDER_BUILDER_TRAITS.modifier2)
    if (modifier2 != null)
        modifier2.setFilter(item => isOrderBuilderClause(item))

    let result = getOrderBuilderTraitStorage(machine, ORDER_BUILDER_TRAITS.result)
    if (result != null)
        result.setFilter(item => isOrderBuilderOutputItem(item))
}

function setOrderBuilderButtonText(button, label) {
    if (button == null)
        return
    try {
        let text = new global.CDServerJavaClasses.$TextTexture(label)
        text.setColor(0xFFFFFF)
        text.setDropShadow(false)
        button.setButtonTexture(global.CDServerJavaClasses.$ResourceBorderTexture.BUTTON_COMMON, text)
    } catch (error) {
        button.setHoverTooltips(Text.of(label))
    }
}

function configureOrderBuilderSlotTooltips(root) {
    let draft = root.getFirstWidgetById(ORDER_BUILDER_WIDGETS.draft)
    if (draft != null)
        draft.setHoverTooltips(orderBuilderTranslate(ORDER_BUILDER_LANG.draftSlot))

    let customerSeal = root.getFirstWidgetById(ORDER_BUILDER_WIDGETS.customerSeal)
    if (customerSeal != null)
        customerSeal.setHoverTooltips(orderBuilderTranslate(ORDER_BUILDER_LANG.customerSealSlot))

    let categorySeal = root.getFirstWidgetById(ORDER_BUILDER_WIDGETS.categorySeal)
    if (categorySeal != null)
        categorySeal.setHoverTooltips(orderBuilderTranslate(ORDER_BUILDER_LANG.categorySealSlot))

    let modifier1 = root.getFirstWidgetById(ORDER_BUILDER_WIDGETS.modifier1)
    if (modifier1 != null)
        modifier1.setHoverTooltips(orderBuilderTranslate(ORDER_BUILDER_LANG.modifier1Slot))

    let modifier2 = root.getFirstWidgetById(ORDER_BUILDER_WIDGETS.modifier2)
    if (modifier2 != null)
        modifier2.setHoverTooltips(orderBuilderTranslate(ORDER_BUILDER_LANG.modifier2Slot))

    let result = root.getFirstWidgetById(ORDER_BUILDER_WIDGETS.result)
    if (result != null)
        result.setHoverTooltips(orderBuilderTranslate(ORDER_BUILDER_LANG.resultSlot))
}

function cancelOrderBuilderEvent(event) {
    if (event != null && event.cancel != null)
        event.cancel()
}

MBDMachineEvents.onPlaced("createdelight:order_builder", e => {
    const { machine, player } = e.event
    setOrderBuilderStorageFilters(machine)
    storeOrderBuilderOwner(machine, player, true)
})

MBDMachineEvents.onLoad("createdelight:order_builder", e => {
    setOrderBuilderStorageFilters(e.event.machine)
})

MBDMachineEvents.onUI("createdelight:order_builder", e => {
    const { machine, root, player } = e.event
    storeOrderBuilderOwner(machine, player, false)
    setOrderBuilderStorageFilters(machine)
    configureOrderBuilderSlotTooltips(root)

    let applyButton = root.getFirstWidgetById(ORDER_BUILDER_WIDGETS.applyButton)
    let openButton = root.getFirstWidgetById(ORDER_BUILDER_WIDGETS.openButton)
    let statusText = root.getFirstWidgetById(ORDER_BUILDER_WIDGETS.statusText)

    setOrderBuilderButtonText(applyButton, orderBuilderTranslateString(ORDER_BUILDER_LANG.applyButton))
    setOrderBuilderButtonText(openButton, orderBuilderTranslateString(ORDER_BUILDER_LANG.openButton))
    setOrderBuilderStatus(statusText, ORDER_BUILDER_LANG.statusReady)

    if (applyButton != null) {
        applyButton.setHoverTooltips(
            orderBuilderTranslate(ORDER_BUILDER_LANG.applyTip1),
            orderBuilderTranslate(ORDER_BUILDER_LANG.applyTip2)
        )
        applyButton.setOnPressCallback(clickData => {
            if (!clickData.isRemote)
                applyOrderBuilderSlots(machine, player, statusText)
        })
    }

    if (openButton != null) {
        openButton.setHoverTooltips(
            orderBuilderTranslate(ORDER_BUILDER_LANG.openTip1),
            orderBuilderTranslate(ORDER_BUILDER_LANG.openTip2)
        )
        openButton.setOnPressCallback(clickData => {
            if (!clickData.isRemote)
                openOrderBuilderDraft(machine, player, statusText)
        })
    }
})

MBDMachineEvents.onRightClick("createdelight:order_builder", e => {
    let event = e.event
    const { heldItem, player, hand } = event
    if (heldItem == null || heldItem.empty)
        return

    let otherStack = getOtherHandItem(player, hand)

    if (heldItem.is("createdelight:order_seal")) {
        if (trySealOrderDraftAtBuilder(player, otherStack, heldItem))
            cancelOrderBuilderEvent(event)
        return
    }

    if (heldItem.is("createdelight:order_clause")) {
        if (global.Order.applyDraftClause(otherStack, heldItem)) {
            consumeOrderBuilderSeal(player, heldItem)
            player.tell(Text.translate("message.createdelight.order_draft_clause_applied"))
            player.swing()
            cancelOrderBuilderEvent(event)
        }
        return
    }

    if (!heldItem.is("createdelight:unopened_order"))
        return

    if (trySealOrderDraftAtBuilder(player, heldItem, otherStack)) {
        cancelOrderBuilderEvent(event)
        return
    }

    if (otherStack.is("createdelight:order_clause")) {
        if (global.Order.applyDraftClause(heldItem, otherStack)) {
            consumeOrderBuilderSeal(player, otherStack)
            player.tell(Text.translate("message.createdelight.order_draft_clause_applied"))
            player.swing()
        } else {
            player.tell(Text.translate("message.createdelight.order_draft_clause_failed"))
        }
        cancelOrderBuilderEvent(event)
        return
    }

    if (global.Order.openDraft(player, heldItem) != null) {
        player.swing()
        cancelOrderBuilderEvent(event)
    }
})
