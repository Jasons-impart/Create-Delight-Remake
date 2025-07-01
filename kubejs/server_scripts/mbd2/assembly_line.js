const $FluidIngredient = Java.loadClass("com.lowdragmc.mbd2.api.recipe.ingredient.FluidIngredient")
const $SizedIngredient = Java.loadClass("com.lowdragmc.mbd2.api.recipe.ingredient.SizedIngredient")
const $mbdFluidStack = Java.loadClass("com.lowdragmc.lowdraglib.side.fluid.FluidStack")

MBDMachineEvents.onBeforeRecipeWorking("createdelight:assembly_line", e => {

    let event = e.event
    const { machine, recipe } = event
    /** @type {Internal.MBDMultiblockMachine} */
    let multiblock = machine
    let conlist = []
    recipe.inputs.values().forEach(con => {
        con.forEach(content => {
            conlist.push(content)
        })
    })
    conlist.sort((/**@type {Internal.Content} */ conA, /**@type {Internal.Content} */ conB) => {
        return parseInt(conA.uiName) - parseInt(conB.uiName)
    })
    conlist.forEach(v => {
        /**@type {Internal.Content} */
        let content = v
        /**@type {Internal.MBDPartMachine} */
        let part = multiblock.parts.get(parseInt(content.uiName - 1))
        if (content.getContent() instanceof $FluidIngredient) {
            /** @type {com.lowdragmc.mbd2.api.recipe.ingredient.FluidIngredient} */
            let fContent = content.getContent()
            let fluid = part.getCapability(ForgeCapabilities.FLUID_HANDLER).orElse(null).getFluidInTank(0)
            if (!(fContent.values[0].getStacks()[0].isSame(fluid.fluid) && fContent.amount == fluid.amount)) {
                event.setCanceled(true)
            }

        }
        else if (content.getContent() instanceof $SizedIngredient) {
            /** @type {Internal.SizedIngredient} */
            let sContent = content.getContent()
            let item = part.getCapability(ForgeCapabilities.ITEM_HANDLER).orElse(null).getStackInSlot(0)
            if (!(sContent.first.count == item.count && sContent.first.is(item.item))) {
                event.setCanceled(true)
            }
        }
    })
})
MBDMachineEvents.onStructureFormed("createdelight:assembly_line", e => {
    let event = e.event
    /**
     * @type {Internal.MBDMultiblockMachine}
     */
    let multiblock = event.machine
    let axisDirection = multiblock.frontFacing.get().axisDirection.opposite().ordinal()
    let axis = multiblock.frontFacing.get().axis
    multiblock.parts.sort((/**@type {Internal.MBDPartMachine} */ a, /**@type {Internal.MBDPartMachine} */b) => {
        let posA = a.pos
        let posB = b.pos

        // 根据机器的朝向轴来反向排序
        switch (axis) {
            case "x":
                // 如果朝向是x轴，则反向排序基于x坐标
                return (posB.x - posA.x) * (axisDirection === 1 ? 1 : -1);
            case "y":
                // 如果朝向是y轴，则反向排序基于y坐标
                return (posB.y - posA.y) * (axisDirection === 1 ? 1 : -1);
            case "z":
                // 如果朝向是z轴，则反向排序基于z坐标
                return (posB.z - posA.z) * (axisDirection === 1 ? 1 : -1);
            default:
                return 0;
        }
    })
})