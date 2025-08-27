
MBDMachineEvents.onTick("createdelight:order_deliverer", e => {
    let event = e.event
    const { machine } = event
    const {level, customData} = machine
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
        if (level.dayTime() % 2400 == 1000 + 5 * 20) {
            entity.discard()

            /**@type {ItemStackTransfer} */
            let storage = machine.getTraitByName("order_slot").storage
            /**@type {ItemStackTransfer} */
            let packageStorage = machine.getTraitByName("package_slot").storage
            /**@type {ItemStackTransfer} */
            let outputStorage = machine.getTraitByName("output_slot").storage
            let orders = []
            for (let index = 0; index < storage.getSlots(); index++) {

                let item = storage.getStackInSlot(index)
                if (item.is("createdelight:order"))
                    orders.push(item.nbt.createdelightOrderInfo)
                else
                    orders.push(null)
            }
            let res = Order.checkAllPackages(orders, packageStorage)
            for (let index = 0; index < res.length; index++) {
                let element = res[index];
                if (element > 0) {
                    console.log(`index: ${index}, element: ${element}`)
                    storage.extractItem(index, 1, false)
                    let reward = Order.getRewardContract(Order.customerProperties[orders[index].type].reward, element * 5)
                    ItemTransferHelper.insertItemStacked(outputStorage, reward, false)
                }
            }
        }
    }
})

