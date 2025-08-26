
MBDMachineEvents.onTick("createdelight:order_deliverer", e => {
    let event = e.event
    const { machine } = event
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
})

