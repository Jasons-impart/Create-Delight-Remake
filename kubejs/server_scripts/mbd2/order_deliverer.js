
const $TableClothBlockEntity = Java.loadClass("com.simibubi.create.content.logistics.tableCloth.TableClothBlockEntity")
const $PackageEntity = Java.loadClass("com.simibubi.create.content.logistics.box.PackageEntity")
let Order = global.Order
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
                            let o = find.nbt.createdelightOrderInfo
                            // console.log(packages.serializeNBT())
                            let nums = Order.checkAllPackages([o], packages)
                            let customer = Order.customerProperties[o.type]
                            let reward = customer.reward
                            if (reward == null)
                                reward = [`createdelight:orders/${o.type}`, 1] //如果没有写reward那么则为以类型为名的战利品表
                            let list = Utils.newList()

                            for (let i = 0; i < nums[0] * reward[1] * o.entries.length; i++) {
                                let rewardItems = LootUtils.getLootItems(reward[0], level)
                                rewardItems.forEach(item => {
                                    list.add(item)
                                })
                            }
                            // let reward = Order.getRewardContract(Order.customerProperties[o.type].reward, nums[0] * 5)
                            let money = Order.calculateMoneyReward(o) * nums[0] * customer.reward_money
                            MoneyUtil.convertBaseValueToItems(money).forEach(item => {
                                list.add(item)
                            })
                            let pList = []
                            for (let i = 0; i < list.length; i += 9) {
                                pList.push($PackageItem.containing(list.subList(i, Math.min(i + 9, list.length - 1))))
                            }
                            end = index - 1
                            for (let j = start; j <= end; j++) {
                                /**@type {Internal.TableClothBlockEntity} */
                                let be = level.getBlockEntity(pos[funcs[i]](j), "create:table_cloth").get()
                                be.manuallyAddedItems.clear()
                                be.notifyUpdate()
                            }

                            /**@type {Internal.TableClothBlockEntity} */
                            let startBe = level.getBlockEntity(pos[funcs[i]](start), "create:table_cloth").get()
                            if (pList.length != 0) {
                                for (let index = 0; index < pList.length; index++) {
                                    let element = pList[index];
                                    if (startBe.manuallyAddedItems.size() == 4) {
                                        $PackageEntity.fromItemStack(level, pos[funcs[i]](start).offset(0.5, 1, 0.5), element)
                                    } else {
                                        startBe.manuallyAddedItems.push(element)
                                        startBe.notifyUpdate()
                                    }
                                }
                            }
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
                    let o = order.nbt.createdelightOrderInfo
                    let nums = Order.checkAllPackages([o], packages)
                    let customer = Order.customerProperties[o.type]
                    let reward = customer.reward
                    if (reward == null)
                        reward = [`createdelight:orders/${o.type}`, 1] //如果没有写reward那么以类型为名的战利品表
                    let list = Utils.newList()

                    for (let i = 0; i < nums[0] * reward[1] * o.entries.length; i++) {
                        let rewardItems = LootUtils.getLootItems(reward[0], level)
                        rewardItems.forEach(item => {
                            list.add(item)
                        })
                    }
                    let money = Order.calculateMoneyReward(o) * nums[0] * customer.reward_money
                    MoneyUtil.convertBaseValueToItems(money).forEach(item => {
                        list.add(item)
                    })
                    let pList = []
                    for (let i = 0; i < list.length; i += 9) {
                        pList.push($PackageItem.containing(list.subList(i, Math.min(i + 9, list.length - 1))))
                    }

                    for (let j = start; j <= lastIndex; j++) {
                        /**@type {Internal.TableClothBlockEntity} */
                        let be2 = level.getBlockEntity(pos[funcs[i]](j), "create:table_cloth").get()
                        be2.manuallyAddedItems.clear()
                        be2.notifyUpdate()
                    }

                    /**@type {Internal.TableClothBlockEntity} */
                    let startBe = level.getBlockEntity(pos[funcs[i]](start), "create:table_cloth").get()
                    if (pList.length != 0) {
                        for (let index = 0; index < pList.length; index++) {
                            let element = pList[index];
                            if (startBe.manuallyAddedItems.size() == 4) {
                                $PackageEntity.fromItemStack(level, pos[funcs[i]](start).offset(0.5, 1, 0.5), element)
                            } else {
                                startBe.manuallyAddedItems.push(element)
                                startBe.notifyUpdate()
                            }
                        }
                    }
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