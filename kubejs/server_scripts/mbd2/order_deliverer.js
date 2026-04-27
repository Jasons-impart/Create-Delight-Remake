
const $TableClothBlockEntity = Java.loadClass("com.simibubi.create.content.logistics.tableCloth.TableClothBlockEntity")
const $PackageEntity = Java.loadClass("com.simibubi.create.content.logistics.box.PackageEntity")
let Order = global.Order
let MoneyUtil = global.MoneyUtil

function buildOrderRewardPackages(level, orderInfo, qualityScore) {
    let customer = Order.customerProperties[orderInfo.type]
    let reward = customer.reward
    if (reward == null)
        reward = [`createdelight:orders/${orderInfo.type}`, 1]

    let list = Utils.newList()
    for (let i = 0; i < qualityScore * reward[1] * orderInfo.entries.length; i++) {
        let rewardItems = LootUtils.getLootItems(reward[0], level)
        rewardItems.forEach(item => {
            list.add(item)
        })
    }

    let money = Order.calculateMoneyReward(orderInfo) * qualityScore * customer.reward_money
    MoneyUtil.convertBaseValueToItems(money).forEach(item => {
        list.add(item)
    })

    let rewardPackages = []
    for (let i = 0; i < list.length; i += 9) {
        rewardPackages.push($PackageItem.containing(list.subList(i, Math.min(i + 9, list.length))))
    }
    return rewardPackages
}

function placeRewardPackages(level, pos, direction, start, rewardPackages) {
    /**@type {Internal.TableClothBlockEntity} */
    let startBe = level.getBlockEntity(pos[direction](start), "create:table_cloth").get()
    if (rewardPackages.length == 0)
        return
    for (let index = 0; index < rewardPackages.length; index++) {
        let element = rewardPackages[index]
        if (startBe.manuallyAddedItems.size() == 4) {
            $PackageEntity.fromItemStack(level, pos[direction](start).offset(0.5, 1, 0.5), element)
        } else {
            startBe.manuallyAddedItems.push(element)
            startBe.notifyUpdate()
        }
    }
}

function clearOrderSegment(level, pos, direction, start, end) {
    for (let index = start; index <= end; index++) {
        /**@type {Internal.TableClothBlockEntity} */
        let be = level.getBlockEntity(pos[direction](index), "create:table_cloth").get()
        be.manuallyAddedItems.clear()
        be.notifyUpdate()
    }
}

function notifyOrderReputation(level, orderInfo, qualityScore) {
    let result = Order.reputation.awardForOrder(level, orderInfo, qualityScore)
    if (result == null)
        return
    result.player.tell(Component.translate("message.createdelight.order_reputation_gain", result.gain, result.value, result.level))
    if (result.leveledUp)
        result.player.tell(Component.translate("message.createdelight.order_reputation_level_up", result.level))
}

function settleOrderSegment(level, pos, direction, start, end, orderStack, packages) {
    if (orderStack == null)
        return false

    let orderInfo = orderStack.nbt.createdelightOrderInfo
    let nums = Order.checkAllPackages([orderInfo], packages)
    let qualityScore = nums[0]
    if (qualityScore <= 0)
        return false

    let rewardPackages = buildOrderRewardPackages(level, orderInfo, qualityScore)
    clearOrderSegment(level, pos, direction, start, end)
    placeRewardPackages(level, pos, direction, start, rewardPackages)
    notifyOrderReputation(level, orderInfo, qualityScore)
    return true
}

MBDMachineEvents.onTick("createdelight:order_deliverer", e => {
    let event = e.event
    const { machine } = event
    const { level, customData, pos } = machine
    /**@type {Internal.ServerLevel} */
    let serverLevel = level
    if (level.dayTime() % 24000 >= 1000 && level.dayTime() % 24000 <= 1000 + 5 * 20) {
        if (level.dayTime() % 24000 == 1000) {
            /**@type {Internal.BrassDroneEntity} */
            let entity = level.createEntity("create_sa:brass_drone")
            level.addFreshEntity(entity)
            entity.setPos(machine.pos.above())
            customData.putUUID("droneUUID", entity.uuid)
        }
        /**@type {Internal.BrassDroneEntity} */
        let entity = serverLevel.getEntity(customData.getUUID("droneUUID"))
        entity.setMotionY(Math.sin(level.time / 5) * 0.05)
        if (level.dayTime() % 24000 == 1000 + 5 * 20) {
            entity.discard()

            let funcs = ["north", "south", "east", "west"]
            let count = 8
            for (let i = 0; i < 4; i++) {
                let packages = new ItemStackTransfer()
                packages.setSize(64)
                let order = null
                let start = 1
                let end = 1
                let lastIndex = 1
                for (let index = 1; index <= count; index++) {
                    let position = pos[funcs[i]](index)
                    let obe = level.getBlockEntity(position, "create:table_cloth")
                    if (!obe.isPresent()) {
                        break
                    }

                    /**@type {Internal.TableClothBlockEntity} */
                    let be = obe.get()
                    let item = be.manuallyAddedItems
                    let find = item.find(item => item.is("createdelight:order"))

                    if (find != null) {
                        if (order != null) {
                            end = index - 1
                            settleOrderSegment(level, pos, funcs[i], start, end, order, packages)
                            start = index
                            packages = new ItemStackTransfer()
                            packages.setSize(64)
                        }
                        order = find
                    }
                    item.filter(item => item
                        .hasTag("create:packages"))
                        .forEach(item => ItemTransferHelper.insertItemStacked(packages, item, false))
                    lastIndex = index
                }
                if (order != null) {
                    settleOrderSegment(level, pos, funcs[i], start, lastIndex, order, packages)
                }
            }

            // /**@type {ItemStackTransfer} */
            // let storage = machine.getTraitByName("order_slot").storage
            // /**@type {ItemStackTransfer} */
            // let packageStorage = machine.getTraitByName("package_slot").storage
            // /**@type {ItemStackTransfer} */
            // let outputStorage = machine.getTraitByName("output_slot").storage
            // let orders = []
            // for (let index = 0; index < storage.getSlots(); index++) {

            //     let item = storage.getStackInSlot(index)
            //     if (item.is("createdelight:order"))
            //         orders.push(item.nbt.createdelightOrderInfo)
            //     else
            //         orders.push(null)
            // }
            // let res = Order.checkAllPackages(orders, packageStorage)
            // for (let index = 0; index < res.length; index++) {
            //     let element = res[index];
            //     if (element > 0) {
            //         // console.log(`index: ${index}, element: ${element}`)
            //         storage.extractItem(index, 1, false)
            //         let reward = Order.getRewardContract(Order.customerProperties[orders[index].type].reward, element * 5)
            //         ItemTransferHelper.insertItemStacked(outputStorage, reward, false)
            //     }
            // }
        }
    }
})
BlockEvents.rightClicked("create:white_table_cloth", e => {
    const { player, block, item } = e
    if (player.mainHandItem.is("createdelight:order_deliverer_item")) {
        block.set("createdelight:order_deliverer")
        if (!player.isCreative()) {
            item.count--
        }
        e.cancel()
    }
})
LootJS.modifiers(e => {
    e.addBlockLootModifier("createdelight:order_deliverer")
        .addLoot("create:white_table_cloth")
        .addLoot("createdelight:order_deliverer_item")
})
