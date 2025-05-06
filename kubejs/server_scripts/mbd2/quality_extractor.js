const $QualityFoodUtils = Java.loadClass("de.cadentem.quality_food.util.Utils")
MBDMachineEvents.onTick("createdelight:quality_extractor", e => {
    let event = e.event
    const {machine} = event
    const {level} = machine
    if (level.time % 100 != 0)
        return
    let items = machine.getCapability(ForgeCapabilities.ITEM_HANDLER).orElse(null)
    let fluid = machine.getCapability(ForgeCapabilities.FLUID_HANDLER).orElse(null)
    let amount = [0, 0.1, 0.2, 0.3]
    for (let index = 0; index < items.getSlots(); index++) {
        let element = items.getStackInSlot(index)
        let quality = $QualityUtils.getQuality(element)
        fluid.fill(Fluid.water(amount[quality.level()] * element.count).fluidStack, "execute") 

        items.setStackInSlot(index, Item.of(element.id, element.count))
    }
})