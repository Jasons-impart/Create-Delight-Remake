MBDMachineEvents.onStructureFormed("createdelight:alloy_electric_furnace", e => {
    let event = e.event
    const { machine } = event
    /**@type {ItemStackTransfer} */
    let input = machine.getTraitByName("forged_steel_import_item_slot").storage
    input.setFilter(item => {
        // console.log(item)
        let hasItem = false
        let canStack = false

        for (let i = 0; i < input.slots; i++) {
            let stack = input.getStackInSlot(i)
            if (ItemTransferHelper.canItemStacksStack(item, stack)) {
                hasItem = true
                if (item.count + stack.count <= 64)
                    canStack = true
            }
        }
        // console.log(hasItem, canStack)
        // 返回条件：如果没有该物品或该物品能堆叠，则允许；否则阻止
        return !hasItem || (hasItem && canStack)
    })

})