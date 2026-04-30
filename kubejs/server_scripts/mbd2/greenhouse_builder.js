const $Direction = Java.loadClass("net.minecraft.core.Direction")
const $BlockItem = Java.loadClass("net.minecraft.world.item.BlockItem")

const GREENHOUSE_DEFAULT_SIZE = 9
const GREENHOUSE_MIN_SIZE = 3
const GREENHOUSE_MAX_SIZE = 64
const GREENHOUSE_SIZE_KEYS = {
    length: "houseLength",
    width: "houseWidth",
    height: "houseHeight"
}
const ADJACENT_DIRECTIONS = [
    $Direction.NORTH,
    $Direction.SOUTH,
    $Direction.WEST,
    $Direction.EAST,
    $Direction.UP,
    $Direction.DOWN
]

/**
 * @param {Internal.MBDMachine} machine
 */
function ensureGreenhouseDefaults(machine) {
    let customData = machine.customData
    let length = customData.contains(GREENHOUSE_SIZE_KEYS.length) ? customData.getInt(GREENHOUSE_SIZE_KEYS.length) : GREENHOUSE_DEFAULT_SIZE
    let width = customData.contains(GREENHOUSE_SIZE_KEYS.width) ? customData.getInt(GREENHOUSE_SIZE_KEYS.width) : GREENHOUSE_DEFAULT_SIZE
    let height = customData.contains(GREENHOUSE_SIZE_KEYS.height) ? customData.getInt(GREENHOUSE_SIZE_KEYS.height) : GREENHOUSE_DEFAULT_SIZE

    customData.putInt(GREENHOUSE_SIZE_KEYS.length, parseGreenhouseSize(length, GREENHOUSE_DEFAULT_SIZE))
    customData.putInt(GREENHOUSE_SIZE_KEYS.width, parseGreenhouseSize(width, GREENHOUSE_DEFAULT_SIZE))
    customData.putInt(GREENHOUSE_SIZE_KEYS.height, parseGreenhouseSize(height, GREENHOUSE_DEFAULT_SIZE))
}

/**
 * @param {string} raw
 * @param {number} fallback
 */
function parseGreenhouseSize(raw, fallback) {
    let source = raw
    if (source == null) {
        source = fallback
    }
    let parsed = parseInt(String(source).trim(), 10)
    if (Number.isNaN(parsed)) {
        parsed = fallback
    }
    if (parsed < GREENHOUSE_MIN_SIZE) {
        parsed = GREENHOUSE_MIN_SIZE
    }
    if (parsed > GREENHOUSE_MAX_SIZE) {
        parsed = GREENHOUSE_MAX_SIZE
    }
    return parsed
}

/**
 * @param {Internal.Player} player
 * @param {Internal.Component} message
 */
function tellGreenhouse(player, message) {
    if (player != null) {
        player.tell(message)
    }
}

/**
 * @param {Internal.MBDMachine} machine
 * @returns {ItemStackTransfer}
 */
function getGreenhouseMaterialSlot(machine) {
    return machine.getTraitByName("item_slot").storage
}

/**
 * @param {Internal.MBDMachine} machine
 */
function getAdjacentItemHandlers(machine) {
    let handlers = []

    ADJACENT_DIRECTIONS.forEach(direction => {
        let neighbor = machine.level.getBlockEntity(machine.pos.relative(direction))
        if (neighbor == null) {
            return
        }

        let handler = neighbor.getCapability(ForgeCapabilities.ITEM_HANDLER, direction.opposite).orElse(null)
        if (handler == null) {
            handler = neighbor.getCapability(ForgeCapabilities.ITEM_HANDLER, null).orElse(null)
        }
        if (handler != null) {
            handlers.push(handler)
        }
    })

    return handlers
}

/**
 * @param handlers
 * @param {Internal.ItemStack} sampleStack
 */
function countMatchingItems(handlers, sampleStack) {
    let total = 0

    handlers.forEach(handler => {
        for (let slot = 0; slot < handler.getSlots(); slot++) {
            let stack = handler.getStackInSlot(slot)
            if (!stack.empty && ItemTransferHelper.canItemStacksStack(sampleStack, stack)) {
                total += stack.count
            }
        }
    })

    return total
}

/**
 * @param handlers
 * @param {Internal.ItemStack} sampleStack
 * @param {number} amount
 */
function consumeMatchingItems(handlers, sampleStack, amount) {
    let remaining = amount

    handlers.forEach(handler => {
        if (remaining <= 0) {
            return
        }

        for (let slot = 0; slot < handler.getSlots() && remaining > 0; slot++) {
            let stack = handler.getStackInSlot(slot)
            if (stack.empty || !ItemTransferHelper.canItemStacksStack(sampleStack, stack)) {
                continue
            }

            let extracted = handler.extractItem(slot, remaining, false)
            if (extracted != null && !extracted.empty) {
                remaining -= extracted.count
            }
        }
    })

    return remaining === 0
}

/**
 * Build the greenhouse one block below the machine's current Y level,
 * while centering the footprint on X/Z.
 * For even length/width values Minecraft cannot center perfectly on one block,
 * so the footprint is biased by one block toward the negative axis.
 *
 * @param {Internal.MBDMachine} machine
 * @param {number} length
 * @param {number} width
 * @param {number} height
 */
function collectGreenhouseTargets(machine, length, width, height) {
    let minX = -Math.floor(length / 2)
    let maxX = Math.ceil(length / 2) - 1
    let minZ = -Math.floor(width / 2)
    let maxZ = Math.ceil(width / 2) - 1
    let minY = -1
    let maxY = height - 2
    let targets = []
    let skipped = 0

    for (let x = minX; x <= maxX; x++) {
        for (let y = minY; y <= maxY; y++) {
            for (let z = minZ; z <= maxZ; z++) {
                let isBoundary = x === minX || x === maxX || y === minY || y === maxY || z === minZ || z === maxZ
                if (!isBoundary) {
                    continue
                }

                let targetPos = machine.pos.offset(x, y, z)
                let targetBlock = machine.level.getBlock(targetPos)
                if (!targetBlock.blockState.isAir()) {
                    skipped++
                    continue
                }

                targets.push(targetPos)
            }
        }
    }

    return {
        targets: targets,
        skipped: skipped
    }
}

/**
 * @param {Internal.MBDMachine} machine
 * @param {Internal.Player} player
 * @param {number} length
 * @param {number} width
 * @param {number} height
 */
function buildGreenhouse(machine, player, length, width, height) {
    let materialSlot = getGreenhouseMaterialSlot(machine)
    let sampleStack = materialSlot.getStackInSlot(0)

    if (sampleStack.empty) {
        tellGreenhouse(player, Component.translate("message.createdelight.greenhouse_builder.no_material"))
        return
    }
    if (!(sampleStack.item instanceof $BlockItem)) {
        tellGreenhouse(player, Component.translate("message.createdelight.greenhouse_builder.invalid_material"))
        return
    }

    let itemHandlers = getAdjacentItemHandlers(machine)
    if (itemHandlers.length === 0) {
        tellGreenhouse(player, Component.translate("message.createdelight.greenhouse_builder.no_inventory"))
        return
    }

    let targetData = collectGreenhouseTargets(machine, length, width, height)
    let targets = targetData.targets
    let skipped = targetData.skipped
    if (targets.length === 0) {
        tellGreenhouse(player, Component.translate("message.createdelight.greenhouse_builder.no_air", skipped))
        return
    }

    let available = countMatchingItems(itemHandlers, sampleStack)
    if (available < targets.length) {
        tellGreenhouse(player, Component.translate("message.createdelight.greenhouse_builder.not_enough_material", targets.length, sampleStack.id, available))
        return
    }

    if (!consumeMatchingItems(itemHandlers, sampleStack, targets.length)) {
        tellGreenhouse(player, Component.translate("message.createdelight.greenhouse_builder.extract_failed"))
        return
    }

    let blockState = Block.getBlock(sampleStack.id).defaultBlockState()
    targets.forEach(pos => {
        machine.level.getBlock(pos).setBlockState(blockState, 3)
    })

    machine.level.playSound(null, machine.pos.x, machine.pos.y, machine.pos.z, "minecraft:block.stone.place", "blocks", 1, 1)
    tellGreenhouse(player, Component.translate("message.createdelight.greenhouse_builder.success", targets.length, skipped))
}

MBDMachineEvents.onPlaced("createdelight:greenhouse_builder", e => {
    ensureGreenhouseDefaults(e.event.machine)
})

MBDMachineEvents.onLoad("createdelight:greenhouse_builder", e => {
    ensureGreenhouseDefaults(e.event.machine)
})

MBDMachineEvents.onUI("createdelight:greenhouse_builder", e => {
    const machine = e.event.machine
    const root = e.event.root
    const player = e.event.player
    ensureGreenhouseDefaults(machine)

    /** @type {TextFieldWidget} */
    let houseLength = root.getFirstWidgetById("houseLength")
    /** @type {TextFieldWidget} */
    let houseWidth = root.getFirstWidgetById("houseWidth")
    /** @type {TextFieldWidget} */
    let houseHeight = root.getFirstWidgetById("houseHeight")
    /** @type {ButtonWidget} */
    let buildButton = root.getFirstWidgetById("buildButton")

    if (houseLength == null || houseWidth == null || houseHeight == null || buildButton == null) {
        return
    }

    houseLength.currentString = String(machine.customData.getInt(GREENHOUSE_SIZE_KEYS.length) || GREENHOUSE_DEFAULT_SIZE)
    houseWidth.currentString = String(machine.customData.getInt(GREENHOUSE_SIZE_KEYS.width) || GREENHOUSE_DEFAULT_SIZE)
    houseHeight.currentString = String(machine.customData.getInt(GREENHOUSE_SIZE_KEYS.height) || GREENHOUSE_DEFAULT_SIZE)

    houseLength.setNumbersOnlyInt(GREENHOUSE_MIN_SIZE, GREENHOUSE_MAX_SIZE)
    houseWidth.setNumbersOnlyInt(GREENHOUSE_MIN_SIZE, GREENHOUSE_MAX_SIZE)
    houseHeight.setNumbersOnlyInt(GREENHOUSE_MIN_SIZE, GREENHOUSE_MAX_SIZE)

    houseLength.setTextResponder(raw => {
        machine.customData.putInt(GREENHOUSE_SIZE_KEYS.length, parseGreenhouseSize(raw, GREENHOUSE_DEFAULT_SIZE))
    })
    houseWidth.setTextResponder(raw => {
        machine.customData.putInt(GREENHOUSE_SIZE_KEYS.width, parseGreenhouseSize(raw, GREENHOUSE_DEFAULT_SIZE))
    })
    houseHeight.setTextResponder(raw => {
        machine.customData.putInt(GREENHOUSE_SIZE_KEYS.height, parseGreenhouseSize(raw, GREENHOUSE_DEFAULT_SIZE))
    })

    buildButton.setOnPressCallback(clickData => {
        if (clickData.isRemote) {
            return
        }

        let length = parseGreenhouseSize(houseLength.getCurrentString(), machine.customData.getInt(GREENHOUSE_SIZE_KEYS.length) || GREENHOUSE_DEFAULT_SIZE)
        let width = parseGreenhouseSize(houseWidth.getCurrentString(), machine.customData.getInt(GREENHOUSE_SIZE_KEYS.width) || GREENHOUSE_DEFAULT_SIZE)
        let height = parseGreenhouseSize(houseHeight.getCurrentString(), machine.customData.getInt(GREENHOUSE_SIZE_KEYS.height) || GREENHOUSE_DEFAULT_SIZE)

        machine.customData.putInt(GREENHOUSE_SIZE_KEYS.length, length)
        machine.customData.putInt(GREENHOUSE_SIZE_KEYS.width, width)
        machine.customData.putInt(GREENHOUSE_SIZE_KEYS.height, height)

        buildGreenhouse(machine, player, length, width, height)
    })
})
