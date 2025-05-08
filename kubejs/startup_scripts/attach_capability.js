
CapabilityEvents.dynamicItem(e => {
    e.add(item => (item.item instanceof $ModularItem) && TetraUtil.itemHasEffect(item, "createdelight:charge"),
        CapabilityBuilder.ENERGY.customItemStack()
            .canReceive(i => i.nbt.getInt("energy") < 1000000)
            .getEnergyStored(i =>
                i.nbt.getInt("energy")
            )
            .getMaxEnergyStored(i => 1000000)
            .receiveEnergy((item, amount, simulate) => {
                let energy = item.nbt.getInt("energy")
                let received = Math.min(1000000 - energy, amount)
                if (!simulate) {
                    item.nbt.putInt("energy", energy + received)
                }
                return received
            })
    )

})