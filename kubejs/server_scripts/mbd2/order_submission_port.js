const ORDER_SUBMISSION_PORT = "createdelight:order_submission_port"

const ORDER_SUBMISSION_TRAITS = {
    orderInput: "order_input",
    packageInput: "package_input",
    orderReturn: "order_return",
    packageReturn: "package_return",
    rewardOutput: "reward_output"
}

const ORDER_SUBMISSION_WIDGETS = {
    submitButton: "submit_button",
    statusText: "status_text"
}

const ORDER_SUBMISSION_PROCESS_TICKS = 15 * 60 * 20
const ORDER_SUBMISSION_PACKAGE_BUFFER_CAPACITY = 32

const ORDER_SUBMISSION_LANG = {
    submit: "gui.createdelight.order_submission_port.submit",
    ready: "gui.createdelight.order_submission_port.status.ready",
    missingOrder: "gui.createdelight.order_submission_port.status.missing_order",
    missingPackage: "gui.createdelight.order_submission_port.status.missing_package",
    invalidOrder: "gui.createdelight.order_submission_port.status.invalid_order",
    invalidPackage: "gui.createdelight.order_submission_port.status.invalid_package",
    notMatched: "gui.createdelight.order_submission_port.status.not_matched",
    rewardBlocked: "gui.createdelight.order_submission_port.status.reward_blocked",
    returnBlocked: "gui.createdelight.order_submission_port.status.return_blocked",
    submitted: "gui.createdelight.order_submission_port.status.submitted",
    accepted: "gui.createdelight.order_submission_port.status.accepted",
    processing: "gui.createdelight.order_submission_port.status.processing",
    alreadyProcessing: "gui.createdelight.order_submission_port.status.already_processing",
    finishedWaitingOutput: "gui.createdelight.order_submission_port.status.finished_waiting_output",
    inputChanged: "gui.createdelight.order_submission_port.status.input_changed",
    returned: "gui.createdelight.order_submission_port.status.returned",
    buffered: "gui.createdelight.order_submission_port.status.buffered",
    bufferFull: "gui.createdelight.order_submission_port.status.buffer_full",
    incompleteBuffered: "gui.createdelight.order_submission_port.status.incomplete_buffered",
    returningPackages: "gui.createdelight.order_submission_port.status.returning_packages",
    submitTip1: "tooltip.createdelight.order_submission_port.submit.1",
    submitTip2: "tooltip.createdelight.order_submission_port.submit.2",
    submitTip3: "tooltip.createdelight.order_submission_port.submit.3"
}

const ORDER_SUBMISSION_DATA = {
    powered: "powered",
    processing: "processing",
    startedTime: "startedTime",
    finishTime: "finishTime",
    inputFingerprint: "inputFingerprint",
    outputSignal: "outputSignal",
    packageBuffer: "packageBuffer",
    returningPackages: "returningPackages"
}

function orderSubmissionTranslate(key) {
    return Component.translate(key)
}

function orderSubmissionTranslateArgs(key, args) {
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

function orderSubmissionTranslateString(key) {
    return Component.translate(key).getString()
}

function orderSubmissionTranslateStringArgs(key, args) {
    return orderSubmissionTranslateArgs(key, args).getString()
}

function setOrderSubmissionStatus(statusWidget, key, args) {
    if (statusWidget != null && statusWidget.setText != null) {
        if (args == null)
            statusWidget.setText(orderSubmissionTranslateString(key))
        else
            statusWidget.setText(orderSubmissionTranslateStringArgs(key, args))
    }
}

function getOrderSubmissionTime(machine) {
    return machine == null || machine.level == null ? 0 : Math.floor(machine.level.time)
}

function formatOrderSubmissionDuration(ticks) {
    let seconds = Math.max(0, Math.ceil(ticks / 20))
    let minutes = Math.floor(seconds / 60)
    let rest = seconds % 60
    return `${minutes}:${rest < 10 ? "0" : ""}${rest}`
}

function isOrderSubmissionProcessing(machine) {
    return machine != null && machine.customData.getBoolean(ORDER_SUBMISSION_DATA.processing)
}

function clearOrderSubmissionProcess(machine) {
    if (machine == null)
        return
    machine.customData.putBoolean(ORDER_SUBMISSION_DATA.processing, false)
    machine.customData.putDouble(ORDER_SUBMISSION_DATA.startedTime, 0)
    machine.customData.putDouble(ORDER_SUBMISSION_DATA.finishTime, 0)
    machine.customData.putString(ORDER_SUBMISSION_DATA.inputFingerprint, "")
    setOrderSubmissionStorageFilters(machine)
}

function getOrderSubmissionRemainingTicks(machine) {
    if (!isOrderSubmissionProcessing(machine))
        return 0
    return Math.max(0, machine.customData.getDouble(ORDER_SUBMISSION_DATA.finishTime) - getOrderSubmissionTime(machine))
}

function setOrderSubmissionProcessStatus(machine, statusWidget) {
    if (!isOrderSubmissionProcessing(machine)) {
        let buffered = getOrderSubmissionBufferedPackageCount(machine)
        if (isOrderSubmissionReturningPackages(machine))
            setOrderSubmissionStatus(statusWidget, ORDER_SUBMISSION_LANG.returningPackages,
                [getOrderSubmissionPendingPackageReturnCount(machine)])
        else if (buffered >= ORDER_SUBMISSION_PACKAGE_BUFFER_CAPACITY)
            setOrderSubmissionStatus(statusWidget, ORDER_SUBMISSION_LANG.bufferFull, [buffered, ORDER_SUBMISSION_PACKAGE_BUFFER_CAPACITY])
        else if (buffered > 0)
            setOrderSubmissionStatus(statusWidget, ORDER_SUBMISSION_LANG.buffered, [buffered, ORDER_SUBMISSION_PACKAGE_BUFFER_CAPACITY])
        else
            setOrderSubmissionStatus(statusWidget, ORDER_SUBMISSION_LANG.ready)
        return
    }

    let remaining = getOrderSubmissionRemainingTicks(machine)
    if (remaining > 0)
        setOrderSubmissionStatus(statusWidget, ORDER_SUBMISSION_LANG.processing, [formatOrderSubmissionDuration(remaining)])
    else
        setOrderSubmissionStatus(statusWidget, ORDER_SUBMISSION_LANG.finishedWaitingOutput)
}

function hasOrderSubmissionRewardOutput(machine) {
    let rewardOutput = getOrderSubmissionTraitStorage(machine, ORDER_SUBMISSION_TRAITS.rewardOutput)
    if (rewardOutput == null)
        return false
    for (let slot = 0; slot < rewardOutput.slots; slot++) {
        if (!isOrderSubmissionStackEmpty(rewardOutput.getStackInSlot(slot)))
            return true
    }
    return false
}

function getOrderSubmissionOutputSignal(machine) {
    if (isOrderSubmissionProcessing(machine) && getOrderSubmissionRemainingTicks(machine) <= 0)
        return 0
    return hasOrderSubmissionRewardOutput(machine) ? 0 : 15
}

function updateOrderSubmissionOutputSignal(machine) {
    if (machine == null)
        return
    let signal = getOrderSubmissionOutputSignal(machine)
    if (machine.customData.getInt(ORDER_SUBMISSION_DATA.outputSignal) == signal)
        return
    machine.customData.putInt(ORDER_SUBMISSION_DATA.outputSignal, signal)
    machine.setOutputSignal(signal, machine.getFrontFacing().get())
    machine.updateSignal()
}

function getOrderSubmissionTraitStorage(machine, name) {
    let trait = machine == null ? null : machine.getTraitByName(name)
    return trait == null ? null : trait.storage
}

function isOrderSubmissionStackEmpty(stack) {
    return stack == null || stack.empty || stack.isEmpty && stack.isEmpty() || stack.is && stack.is("air") || stack.count <= 0
}

function isOrderSubmissionPackage(stack) {
    return !isOrderSubmissionStackEmpty(stack) && stack.hasTag("create:packages")
}

function findOrderInSubmissionStack(stack) {
    if (isOrderSubmissionStackEmpty(stack))
        return null
    if (stack.is("createdelight:order"))
        return stack
    if (!stack.hasTag("create:packages"))
        return null

    let found = null
    global.CDServerJavaClasses.$PackageItem.getContents(stack).allItems.forEach(content => {
        if (found == null && content.is("createdelight:order"))
            found = content
    })
    return found
}

function isOrderSubmissionPlainPackage(stack) {
    return isOrderSubmissionPackage(stack) && findOrderInSubmissionStack(stack) == null
}

function isOrderSubmissionReturningPackages(machine) {
    return machine != null && machine.customData.getBoolean(ORDER_SUBMISSION_DATA.returningPackages)
}

function getOrderSubmissionBufferedPackages(machine) {
    let packages = []
    if (machine == null)
        return packages

    let buffer = machine.customData.getCompound(ORDER_SUBMISSION_DATA.packageBuffer)
    let count = Math.max(0, Math.min(ORDER_SUBMISSION_PACKAGE_BUFFER_CAPACITY, buffer.getInt("Count")))
    for (let index = 0; index < count; index++) {
        let stack = global.CDServerJavaClasses.$ItemStack.of(buffer.getCompound(`Package${index}`))
        if (isOrderSubmissionPlainPackage(stack))
            packages.push(stack.copyWithCount(1))
    }
    return packages
}

function setOrderSubmissionBufferedPackages(machine, packages) {
    if (machine == null)
        return

    let buffer = new global.CDServerJavaClasses.$CompoundTag()
    let count = Math.min(ORDER_SUBMISSION_PACKAGE_BUFFER_CAPACITY, packages == null ? 0 : packages.length)
    buffer.putInt("Count", count)
    for (let index = 0; index < count; index++) {
        let stackTag = new global.CDServerJavaClasses.$CompoundTag()
        packages[index].copyWithCount(1).save(stackTag)
        buffer.put(`Package${index}`, stackTag)
    }
    machine.customData.put(ORDER_SUBMISSION_DATA.packageBuffer, buffer)
}

function clearOrderSubmissionBufferedPackages(machine) {
    setOrderSubmissionBufferedPackages(machine, [])
}

function getOrderSubmissionBufferedPackageCount(machine) {
    return getOrderSubmissionBufferedPackages(machine).length
}

function getOrderSubmissionPendingPackageReturnCount(machine) {
    let count = getOrderSubmissionBufferedPackageCount(machine)
    let packageInput = getOrderSubmissionTraitStorage(machine, ORDER_SUBMISSION_TRAITS.packageInput)
    getOrderSubmissionStacks(packageInput, stack => isOrderSubmissionPlainPackage(stack))
        .forEach(ref => count += ref.stack.count)
    return count
}

function ingestOrderSubmissionPackages(machine, allowWhileReturning) {
    if (machine == null || isOrderSubmissionProcessing(machine)
        || isOrderSubmissionReturningPackages(machine) && !allowWhileReturning)
        return 0

    let packageInput = getOrderSubmissionTraitStorage(machine, ORDER_SUBMISSION_TRAITS.packageInput)
    if (packageInput == null)
        return 0

    let packages = getOrderSubmissionBufferedPackages(machine)
    let refs = getOrderSubmissionStacks(packageInput, stack => isOrderSubmissionPlainPackage(stack))
    let moved = 0

    for (let refIndex = 0; refIndex < refs.length && packages.length < ORDER_SUBMISSION_PACKAGE_BUFFER_CAPACITY; refIndex++) {
        let ref = refs[refIndex]
        let accepted = Math.min(ref.stack.count, ORDER_SUBMISSION_PACKAGE_BUFFER_CAPACITY - packages.length)
        for (let count = 0; count < accepted; count++)
            packages.push(ref.stack.copyWithCount(1))
        if (accepted > 0) {
            packageInput.extractItem(ref.slot, accepted, false, false)
            moved += accepted
        }
    }

    if (moved > 0) {
        setOrderSubmissionBufferedPackages(machine, packages)
        setOrderSubmissionStorageFilters(machine)
    }
    return moved
}

function pumpOrderSubmissionPackageReturns(machine) {
    if (machine == null || !isOrderSubmissionReturningPackages(machine))
        return 0

    let packageReturn = getOrderSubmissionTraitStorage(machine, ORDER_SUBMISSION_TRAITS.packageReturn)
    if (packageReturn == null)
        return 0

    let moved = 0
    while (true) {
        let packages = getOrderSubmissionBufferedPackages(machine)
        while (packages.length > 0) {
            let remainder = ItemTransferHelper.insertItemStacked(packageReturn, packages[0].copy(), false)
            if (!isOrderSubmissionStackEmpty(remainder)) {
                setOrderSubmissionBufferedPackages(machine, packages)
                return moved
            }
            packages.shift()
            moved++
        }

        setOrderSubmissionBufferedPackages(machine, packages)
        if (ingestOrderSubmissionPackages(machine, true) <= 0)
            break
    }

    machine.customData.putBoolean(ORDER_SUBMISSION_DATA.returningPackages, false)
    setOrderSubmissionStorageFilters(machine)
    return moved
}

function startOrderSubmissionPackageReturn(machine, statusWidget) {
    if (getOrderSubmissionBufferedPackageCount(machine) <= 0)
        return false
    machine.customData.putBoolean(ORDER_SUBMISSION_DATA.returningPackages, true)
    setOrderSubmissionStorageFilters(machine)
    pumpOrderSubmissionPackageReturns(machine)
    let remaining = getOrderSubmissionPendingPackageReturnCount(machine)
    if (remaining > 0)
        setOrderSubmissionStatus(statusWidget, ORDER_SUBMISSION_LANG.returningPackages, [remaining])
    else
        setOrderSubmissionStatus(statusWidget, ORDER_SUBMISSION_LANG.returned)
    return true
}

function dropOrderSubmissionBufferedPackages(machine) {
    if (machine == null || machine.level == null)
        return
    let packages = getOrderSubmissionBufferedPackages(machine)
    clearOrderSubmissionBufferedPackages(machine)
    packages.forEach(stack => {
        let entity = new global.CDServerJavaClasses.$ItemEntity(
            machine.level,
            machine.pos.x + 0.5,
            machine.pos.y + 0.75,
            machine.pos.z + 0.5,
            stack
        )
        machine.level.addFreshEntity(entity)
    })
}

function isOrderSubmissionOrderStack(stack) {
    return !isOrderSubmissionStackEmpty(stack) && findOrderInSubmissionStack(stack) != null
}

function getOrderSubmissionOrderInfo(stack) {
    let orderStack = findOrderInSubmissionStack(stack)
    if (orderStack == null || orderStack.nbt == null)
        return null
    return orderStack.nbt.createdelightOrderInfo
}

function isOrderSubmissionValidOrder(stack) {
    return getOrderSubmissionOrderInfo(stack) != null
}

function setOrderSubmissionStorageFilters(machine) {
    let locked = isOrderSubmissionProcessing(machine) || isOrderSubmissionReturningPackages(machine)
    let orderInput = getOrderSubmissionTraitStorage(machine, ORDER_SUBMISSION_TRAITS.orderInput)
    if (orderInput != null)
        orderInput.setFilter(item => !locked && isOrderSubmissionOrderStack(item))

    let packageInput = getOrderSubmissionTraitStorage(machine, ORDER_SUBMISSION_TRAITS.packageInput)
    if (packageInput != null)
        packageInput.setFilter(item => !locked
            && getOrderSubmissionBufferedPackageCount(machine) < ORDER_SUBMISSION_PACKAGE_BUFFER_CAPACITY
            && isOrderSubmissionPlainPackage(item))

    let orderReturn = getOrderSubmissionTraitStorage(machine, ORDER_SUBMISSION_TRAITS.orderReturn)
    if (orderReturn != null)
        orderReturn.setFilter(item => item != null && item.is("createdelight:order"))

    let packageReturn = getOrderSubmissionTraitStorage(machine, ORDER_SUBMISSION_TRAITS.packageReturn)
    if (packageReturn != null)
        packageReturn.setFilter(item => isOrderSubmissionPackage(item))

    let rewardOutput = getOrderSubmissionTraitStorage(machine, ORDER_SUBMISSION_TRAITS.rewardOutput)
    if (rewardOutput != null)
        rewardOutput.setFilter(item => isOrderSubmissionPackage(item))
}

function getFirstOrderSubmissionStack(storage, predicate) {
    if (storage == null)
        return null
    for (let slot = 0; slot < storage.slots; slot++) {
        let stack = storage.getStackInSlot(slot)
        if (!isOrderSubmissionStackEmpty(stack) && (predicate == null || predicate(stack)))
            return { slot: slot, stack: stack }
    }
    return null
}

function createOrderSubmissionTransferFromStorage(storage, predicate) {
    let transfer = new ItemStackTransfer()
    transfer.setSize(storage == null ? 0 : storage.slots)
    if (storage == null)
        return transfer

    for (let slot = 0; slot < storage.slots; slot++) {
        let stack = storage.getStackInSlot(slot)
        if (!isOrderSubmissionStackEmpty(stack) && (predicate == null || predicate(stack)))
            transfer.setStackInSlot(slot, stack.copy())
    }
    return transfer
}

function createOrderSubmissionPackageTransfer(packages) {
    let transfer = new ItemStackTransfer()
    transfer.setSize(packages.length)
    packages.forEach((stack, slot) => transfer.setStackInSlot(slot, stack.copyWithCount(1)))
    return transfer
}

function getOrderSubmissionStacks(storage, predicate) {
    let stacks = []
    if (storage == null)
        return stacks

    for (let slot = 0; slot < storage.slots; slot++) {
        let stack = storage.getStackInSlot(slot)
        if (!isOrderSubmissionStackEmpty(stack) && (predicate == null || predicate(stack)))
            stacks.push({ slot: slot, stack: stack.copy() })
    }
    return stacks
}

function getOrderSubmissionStackFingerprint(stack) {
    if (isOrderSubmissionStackEmpty(stack))
        return "empty"
    let nbt = stack.nbt == null ? "" : stack.nbt.toString()
    return `${stack.id}|${stack.count}|${nbt}`
}

function createOrderSubmissionInputFingerprint(orderRef, packages) {
    let parts = []
    if (orderRef != null)
        parts.push(`order:${orderRef.slot}:${getOrderSubmissionStackFingerprint(orderRef.stack)}`)
    packages.forEach((stack, index) => {
        parts.push(`package:${index}:${getOrderSubmissionStackFingerprint(stack)}`)
    })
    return parts.join("\n")
}

function createCurrentOrderSubmissionInputFingerprint(machine) {
    let orderInput = getOrderSubmissionTraitStorage(machine, ORDER_SUBMISSION_TRAITS.orderInput)
    let orderRef = getFirstOrderSubmissionStack(orderInput, stack => isOrderSubmissionOrderStack(stack))
    return createOrderSubmissionInputFingerprint(orderRef, getOrderSubmissionBufferedPackages(machine))
}

function createOrderSubmissionStorageSnapshot(storage) {
    let snapshot = new ItemStackTransfer()
    snapshot.setSize(storage == null ? 0 : storage.slots)
    if (storage == null)
        return snapshot

    for (let slot = 0; slot < storage.slots; slot++) {
        let stack = storage.getStackInSlot(slot)
        if (!isOrderSubmissionStackEmpty(stack))
            snapshot.setStackInSlot(slot, stack.copy())
    }
    return snapshot
}

function canOrderSubmissionInsertAll(storage, stacks) {
    if (storage == null)
        return stacks.length <= 0

    let snapshot = createOrderSubmissionStorageSnapshot(storage)
    for (let i = 0; i < stacks.length; i++) {
        let remainder = ItemTransferHelper.insertItemStacked(snapshot, stacks[i].copy(), false)
        if (!isOrderSubmissionStackEmpty(remainder))
            return false
    }
    return true
}

function insertOrderSubmissionStacks(storage, stacks) {
    if (storage == null)
        return false
    for (let i = 0; i < stacks.length; i++) {
        let remainder = ItemTransferHelper.insertItemStacked(storage, stacks[i].copy(), false)
        if (!isOrderSubmissionStackEmpty(remainder))
            return false
    }
    return true
}

function extractOrderSubmissionStacks(storage, stacks) {
    if (storage == null)
        return
    for (let i = 0; i < stacks.length; i++) {
        storage.extractItem(stacks[i].slot, stacks[i].stack.count, false, false)
    }
}

function returnOrderSubmissionInputs(machine, orderRef, packageRefs, statusWidget) {
    let orderInput = getOrderSubmissionTraitStorage(machine, ORDER_SUBMISSION_TRAITS.orderInput)
    let packageInput = getOrderSubmissionTraitStorage(machine, ORDER_SUBMISSION_TRAITS.packageInput)
    let orderReturn = getOrderSubmissionTraitStorage(machine, ORDER_SUBMISSION_TRAITS.orderReturn)
    let packageReturn = getOrderSubmissionTraitStorage(machine, ORDER_SUBMISSION_TRAITS.packageReturn)

    let rawOrderStacks = orderRef == null || isOrderSubmissionPackage(orderRef.stack) ? [] : [{ slot: orderRef.slot, stack: orderRef.stack.copyWithCount(1) }]
    let orderPackageStacks = orderRef == null || !isOrderSubmissionPackage(orderRef.stack) ? [] : [{ slot: orderRef.slot, stack: orderRef.stack.copyWithCount(1) }]
    let packageStacks = packageRefs.map(ref => ({ slot: ref.slot, stack: ref.stack.copy() }))
    let allPackageStacks = orderPackageStacks.concat(packageStacks)

    if (!canOrderSubmissionInsertAll(orderReturn, rawOrderStacks) || !canOrderSubmissionInsertAll(packageReturn, allPackageStacks)) {
        setOrderSubmissionStatus(statusWidget, ORDER_SUBMISSION_LANG.returnBlocked)
        return false
    }

    if (orderRef != null)
        orderInput.extractItem(orderRef.slot, 1, false, false)
    extractOrderSubmissionStacks(packageInput, packageStacks)
    insertOrderSubmissionStacks(orderReturn, rawOrderStacks.map(ref => ref.stack))
    insertOrderSubmissionStacks(packageReturn, allPackageStacks.map(ref => ref.stack))
    setOrderSubmissionStatus(statusWidget, ORDER_SUBMISSION_LANG.returned)
    return true
}

function validateOrderSubmissionInputs(machine, statusWidget, returnInvalidInputs) {
    let orderInput = getOrderSubmissionTraitStorage(machine, ORDER_SUBMISSION_TRAITS.orderInput)

    let orderRef = getFirstOrderSubmissionStack(orderInput, stack => isOrderSubmissionOrderStack(stack))
    if (orderRef == null) {
        setOrderSubmissionStatus(statusWidget, ORDER_SUBMISSION_LANG.missingOrder)
        return null
    }

    if (!isOrderSubmissionValidOrder(orderRef.stack)) {
        if (returnInvalidInputs && returnOrderSubmissionInputs(machine, orderRef, [], statusWidget))
            setOrderSubmissionStatus(statusWidget, ORDER_SUBMISSION_LANG.invalidOrder)
        return null
    }

    let packages = getOrderSubmissionBufferedPackages(machine)
    if (packages.length <= 0) {
        setOrderSubmissionStatus(statusWidget, ORDER_SUBMISSION_LANG.missingPackage)
        return null
    }

    let packageTransfer = createOrderSubmissionPackageTransfer(packages)
    let orderInfo = getOrderSubmissionOrderInfo(orderRef.stack)
    let score = global.Order.checkAllPackages([orderInfo], packageTransfer)[0]
    if (score <= 0) {
        setOrderSubmissionStatus(statusWidget, ORDER_SUBMISSION_LANG.incompleteBuffered,
            [packages.length, ORDER_SUBMISSION_PACKAGE_BUFFER_CAPACITY])
        return null
    }

    let settlement = global.OrderDeliverySettlement
    if (settlement == null) {
        setOrderSubmissionStatus(statusWidget, ORDER_SUBMISSION_LANG.notMatched)
        return null
    }

    return {
        orderInput: orderInput,
        orderRef: orderRef,
        packages: packages,
        orderInfo: orderInfo,
        score: score,
        settlement: settlement,
        fingerprint: createOrderSubmissionInputFingerprint(orderRef, packages)
    }
}

function startOrderSubmissionProcess(machine, statusWidget, returnBufferedWithoutOrder) {
    if (isOrderSubmissionProcessing(machine)) {
        let remaining = getOrderSubmissionRemainingTicks(machine)
        if (remaining > 0)
            setOrderSubmissionStatus(statusWidget, ORDER_SUBMISSION_LANG.alreadyProcessing, [formatOrderSubmissionDuration(remaining)])
        else
            finishOrderSubmissionProcess(machine, statusWidget)
        return false
    }

    ingestOrderSubmissionPackages(machine)
    let orderInput = getOrderSubmissionTraitStorage(machine, ORDER_SUBMISSION_TRAITS.orderInput)
    let orderRef = getFirstOrderSubmissionStack(orderInput, stack => isOrderSubmissionOrderStack(stack))
    if (orderRef == null && returnBufferedWithoutOrder && startOrderSubmissionPackageReturn(machine, statusWidget))
        return false

    let validation = validateOrderSubmissionInputs(machine, statusWidget, true)
    if (validation == null)
        return false

    let startedTime = getOrderSubmissionTime(machine)
    let finishTime = startedTime + ORDER_SUBMISSION_PROCESS_TICKS
    machine.customData.putBoolean(ORDER_SUBMISSION_DATA.processing, true)
    machine.customData.putDouble(ORDER_SUBMISSION_DATA.startedTime, startedTime)
    machine.customData.putDouble(ORDER_SUBMISSION_DATA.finishTime, finishTime)
    machine.customData.putString(ORDER_SUBMISSION_DATA.inputFingerprint, validation.fingerprint)
    machine.customData.putBoolean(ORDER_SUBMISSION_DATA.returningPackages, false)
    setOrderSubmissionStorageFilters(machine)
    updateOrderSubmissionOutputSignal(machine)

    setOrderSubmissionStatus(statusWidget, ORDER_SUBMISSION_LANG.accepted, [formatOrderSubmissionDuration(ORDER_SUBMISSION_PROCESS_TICKS)])
    return true
}

function finishOrderSubmissionProcess(machine, statusWidget) {
    if (!isOrderSubmissionProcessing(machine))
        return false

    let remaining = getOrderSubmissionRemainingTicks(machine)
    if (remaining > 0) {
        setOrderSubmissionStatus(statusWidget, ORDER_SUBMISSION_LANG.processing, [formatOrderSubmissionDuration(remaining)])
        return false
    }

    let expectedFingerprint = machine.customData.getString(ORDER_SUBMISSION_DATA.inputFingerprint)
    let currentFingerprint = createCurrentOrderSubmissionInputFingerprint(machine)
    if (expectedFingerprint != currentFingerprint) {
        clearOrderSubmissionProcess(machine)
        updateOrderSubmissionOutputSignal(machine)
        setOrderSubmissionStatus(statusWidget, ORDER_SUBMISSION_LANG.inputChanged)
        return false
    }

    let validation = validateOrderSubmissionInputs(machine, statusWidget, false)
    if (validation == null) {
        clearOrderSubmissionProcess(machine)
        updateOrderSubmissionOutputSignal(machine)
        return false
    }

    let rewardOutput = getOrderSubmissionTraitStorage(machine, ORDER_SUBMISSION_TRAITS.rewardOutput)
    let marketModifier = validation.settlement.getMarketModifier(machine.level, validation.orderInfo)
    let rewardBundles = validation.settlement.buildRewardBundles(machine.level, validation.orderInfo, validation.score, marketModifier)
    if (!canOrderSubmissionInsertAll(rewardOutput, rewardBundles)) {
        setOrderSubmissionStatus(statusWidget, ORDER_SUBMISSION_LANG.finishedWaitingOutput)
        updateOrderSubmissionOutputSignal(machine)
        return false
    }

    validation.orderInput.extractItem(validation.orderRef.slot, 1, false, false)
    clearOrderSubmissionBufferedPackages(machine)
    insertOrderSubmissionStacks(rewardOutput, rewardBundles)
    clearOrderSubmissionProcess(machine)
    updateOrderSubmissionOutputSignal(machine)

    let summaries = {}
    validation.settlement.recordSettlement(machine.level, validation.orderInfo, validation.score, marketModifier, summaries)
    validation.settlement.flushSummaries(summaries)
    setOrderSubmissionStatus(statusWidget, ORDER_SUBMISSION_LANG.submitted, [validation.score.toFixed(2), rewardBundles.length])
    return true
}

function setOrderSubmissionButtonText(button, label) {
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

function configureOrderSubmissionTooltips(root) {
    let submitButton = root.getFirstWidgetById(ORDER_SUBMISSION_WIDGETS.submitButton)
    if (submitButton != null) {
        submitButton.setHoverTooltips(
            orderSubmissionTranslate(ORDER_SUBMISSION_LANG.submitTip1),
            orderSubmissionTranslate(ORDER_SUBMISSION_LANG.submitTip2),
            orderSubmissionTranslate(ORDER_SUBMISSION_LANG.submitTip3)
        )
    }
}

function handleOrderSubmissionPulse(machine) {
    let powered = machine.level.hasNeighborSignal(machine.pos)
    let wasPowered = machine.customData.getBoolean(ORDER_SUBMISSION_DATA.powered)
    machine.customData.putBoolean(ORDER_SUBMISSION_DATA.powered, powered)
    if (powered && !wasPowered)
        startOrderSubmissionProcess(machine, null, false)
}

MBDMachineEvents.onLoad(ORDER_SUBMISSION_PORT, e => {
    setOrderSubmissionStorageFilters(e.event.machine)
    updateOrderSubmissionOutputSignal(e.event.machine)
})

MBDMachineEvents.onPlaced(ORDER_SUBMISSION_PORT, e => {
    setOrderSubmissionStorageFilters(e.event.machine)
    updateOrderSubmissionOutputSignal(e.event.machine)
})

MBDMachineEvents.onNeighborChanged(ORDER_SUBMISSION_PORT, e => {
    let event = e.event
    const { machine } = event
    setOrderSubmissionStorageFilters(machine)
    handleOrderSubmissionPulse(machine)
})

MBDMachineEvents.onTick(ORDER_SUBMISSION_PORT, e => {
    const { machine } = e.event
    if (isOrderSubmissionReturningPackages(machine))
        pumpOrderSubmissionPackageReturns(machine)
    else if (!isOrderSubmissionProcessing(machine))
        ingestOrderSubmissionPackages(machine)
    if (machine.level.time % 20 != 0)
        return
    if (isOrderSubmissionProcessing(machine))
        finishOrderSubmissionProcess(machine, null)
    updateOrderSubmissionOutputSignal(machine)
})

MBDMachineEvents.onRemoved(ORDER_SUBMISSION_PORT, e => {
    dropOrderSubmissionBufferedPackages(e.event.machine)
})

MBDMachineEvents.onUI(ORDER_SUBMISSION_PORT, e => {
    const { machine, root } = e.event
    setOrderSubmissionStorageFilters(machine)
    updateOrderSubmissionOutputSignal(machine)
    configureOrderSubmissionTooltips(root)

    let submitButton = root.getFirstWidgetById(ORDER_SUBMISSION_WIDGETS.submitButton)
    let statusText = root.getFirstWidgetById(ORDER_SUBMISSION_WIDGETS.statusText)
    setOrderSubmissionButtonText(submitButton, orderSubmissionTranslateString(ORDER_SUBMISSION_LANG.submit))
    setOrderSubmissionProcessStatus(machine, statusText)

    if (submitButton != null) {
        submitButton.setOnPressCallback(clickData => {
            if (!clickData.isRemote)
                startOrderSubmissionProcess(machine, statusText, true)
        })
    }
})
