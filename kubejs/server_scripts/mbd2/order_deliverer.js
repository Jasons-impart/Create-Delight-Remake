
function buildOrderRewardBundles(level, orderInfo, qualityScore) {
    let customer = global.Order.customerProperties[orderInfo.type]
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

    let money = global.Order.calculateMoneyReward(orderInfo) * qualityScore * customer.reward_money
    global.MoneyUtil.convertBaseValueToItems(money).forEach(item => {
        list.add(item)
    })

    let rewardBundles = []
    for (let i = 0; i < list.length; i += 9) {
        rewardBundles.push(global.CDServerJavaClasses.$PackageItem.containing(list.subList(i, Math.min(i + 9, list.length))))
    }
    return rewardBundles
}

function placeRewardBundles(level, pos, direction, start, end, rewardBundles) {
    if (rewardBundles.length == 0)
        return
    let outputIndex = start
    let startBe = null
    for (let index = start; index <= end; index++) {
        let obe = level.getBlockEntity(pos[direction](index), "create:table_cloth")
        if (obe.isPresent()) {
            outputIndex = index
            startBe = obe.get()
            break
        }
    }
    if (startBe == null)
        return
    for (let index = 0; index < rewardBundles.length; index++) {
        let element = rewardBundles[index]
        if (startBe.manuallyAddedItems.size() == 4) {
            global.CDServerJavaClasses.$PackageEntity.fromItemStack(level, pos[direction](outputIndex).offset(0.5, 1, 0.5), element)
        } else {
            startBe.manuallyAddedItems.push(element)
            startBe.notifyUpdate()
        }
    }
}

function clearOrderSegment(level, pos, direction, start, end) {
    for (let index = start; index <= end; index++) {
        /**@type {Internal.TableClothBlockEntity} */
        let obe = level.getBlockEntity(pos[direction](index), "create:table_cloth")
        if (!obe.isPresent())
            continue
        let be = obe.get()
        be.manuallyAddedItems.clear()
        be.notifyUpdate()
    }
}

function findOrderInStack(item) {
    if (item.is("createdelight:order"))
        return item
    if (!item.hasTag("create:packages"))
        return null
    let found = null
    global.CDServerJavaClasses.$PackageItem.getContents(item).allItems.forEach(content => {
        if (found == null && content.is("createdelight:order"))
            found = content
    })
    return found
}

function notifyOrderReputation(level, orderInfo, qualityScore) {
    let result = global.Order.reputation.awardForOrder(level, orderInfo, qualityScore)
    if (result == null)
        return
    result.player.tell(Text.translate("message.createdelight.order_reputation_gain", [
        result.gain,
        result.completionBonus,
        result.value,
        result.level
    ]))
    if (result.leveledUp)
        result.player.tell(Text.translate("message.createdelight.order_reputation_level_up", [result.level]))
}

function settleOrderSegment(level, pos, direction, start, end, orderStack, packages) {
    if (orderStack == null)
        return false

    let orderInfo = orderStack.nbt.createdelightOrderInfo
    let nums = global.Order.checkAllPackages([orderInfo], packages)
    let qualityScore = nums[0]
    if (qualityScore <= 0)
        return false

    let rewardBundles = buildOrderRewardBundles(level, orderInfo, qualityScore)
    clearOrderSegment(level, pos, direction, start, end)
    placeRewardBundles(level, pos, direction, start, end, rewardBundles)
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
                    let find = null
                    item.forEach(stack => {
                        if (find == null)
                            find = findOrderInStack(stack)
                    })

                    if (find != null) {
                        if (order != null) {
                            end = index - 1
                            settleOrderSegment(level, pos, funcs[i], start, end, order, packages)
                            packages = new ItemStackTransfer()
                            packages.setSize(64)
                        }
                        start = index
                        order = find
                    }
                    if (order != null) {
                        item.filter(item => item
                            .hasTag("create:packages") && findOrderInStack(item) == null)
                            .forEach(item => ItemTransferHelper.insertItemStacked(packages, item, false))
                    }
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
            //         let reward = global.Order.getRewardContract(global.Order.customerProperties[orders[index].type].reward, element * 5)
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
