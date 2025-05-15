
CapabilityEvents.dynamicItem(e => {
    e.add(item => (item.item instanceof $ModularItem) && TetraUtil.itemHasEffect(item, "createdelight:charge"),
        CapabilityBuilder.ENERGY.customItemStack()
            .canReceive(i => i.nbt.getInt("energy") < 1000000)
            .getEnergyStored(i =>
                i.nbt.getInt("energy")
            )
            .getMaxEnergyStored(i => {
                if (i.nbt.getInt("maxEnergy") == 0)
                    i.nbt.putInt("maxEnergy", 1000000)
                return i.nbt.getInt("maxEnergy")
            })
            .receiveEnergy((item, amount, simulate) => {
                if (item.nbt.getInt("maxEnergy") == 0)
                    item.nbt.putInt("maxEnergy", 1000000)
                let energy = item.nbt.getInt("energy")
                let received = Math.min(item.nbt.getInt("maxEnergy") - energy, amount)
                if (!simulate) {
                    item.nbt.putInt("energy", energy + received)
                }
                return received
            })
    )
})