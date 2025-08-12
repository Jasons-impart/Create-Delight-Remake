const $FluidIngredient = Java.loadClass("com.lowdragmc.mbd2.api.recipe.ingredient.FluidIngredient")
const $SizedIngredient = Java.loadClass("com.lowdragmc.mbd2.api.recipe.ingredient.SizedIngredient")
const $mbdFluidStack = Java.loadClass("com.lowdragmc.lowdraglib.side.fluid.FluidStack")

MBDMachineEvents.onBeforeRecipeWorking("createdelight:assembly_line", e => {

    let event = e.event
    const { machine, recipe } = event
    /** @type {Internal.MBDMultiblockMachine} */
    let multiblock = machine
    let conlist = []
    let parts = multiblock.getParts()
    let fluidIndex = 0
    let itemIndex = 4
    //content为先流体，再物品
    let input = recipe.inputs.values().toArray()
    
    input[0].forEach(content => {
        /** @type {com.lowdragmc.mbd2.api.recipe.ingredient.FluidIngredient} */
        let fContent = content.getContent()
        /**@type {Internal.MBDPartMachine} */
        let part = multiblock.parts.get(fluidIndex)
        let fluid = part.getCapability(ForgeCapabilities.FLUID_HANDLER).orElse(null).getFluidInTank(0)
        if (!(fContent.values[0].getStacks()[0].isSame(fluid.fluid) && fContent.amount == fluid.amount)) {
            event.setCanceled(true)
        }
        fluidIndex++
    })
    input[1].forEach(content => {
        /** @type {Internal.SizedIngredient} */
        let sContent = content.getContent()
        /**@type {Internal.MBDPartMachine} */
        let part = multiblock.parts.get(itemIndex)
        let item = part.getCapability(ForgeCapabilities.ITEM_HANDLER).orElse(null).getStackInSlot(0)
        if (!(sContent.first.count == item.count && sContent.first.is(item.item))) {
            event.setCanceled(true)
        }
        itemIndex++
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
    multiblock.parts.sort((/**@type {Internal.MBDPartMachine} */ a, /**@type {Internal.MBDPartMachine} */ b) => {
        let posA = a.pos
        let posB = b.pos

        let itemA = a.getCapability(ForgeCapabilities.ITEM_HANDLER).orElse(null)
        let itemB = b.getCapability(ForgeCapabilities.ITEM_HANDLER).orElse(null)

        // 没有物品 capability 的优先排前
        if (itemA === null && itemB !== null) return -1
        if (itemA !== null && itemB === null) return 1

        // 根据机器的朝向轴来反向排序
        switch (axis) {
            case "x":
                return (posB.x - posA.x) * (axisDirection === 1 ? 1 : -1)
            case "y":
                return (posB.y - posA.y) * (axisDirection === 1 ? 1 : -1)
            case "z":
                return (posB.z - posA.z) * (axisDirection === 1 ? 1 : -1)
            default:
                return 0
        }
    })
})

// MBDRecipeTypeEvents.onTransferProxyRecipe("createdelight:assembly_line", e => {
//     let event = e.event;
//     const {recipeType, proxyTypeId, proxyType, proxyRecipeId, proxyRecipe} = event;
//     if (proxyTypeId.toString() === "create:sequenced_assembly") {
        
//         /**@type {Internal.SequencedAssemblyRecipe} */
//         let proxySequencedAssemblyRecipe = proxyRecipe
        
//         let index = 0
//         let items = new ItemStackTransfer(12)
//         proxySequencedAssemblyRecipe.getSequence().forEach(recipe => {
//             let pRecipe = recipe.getRecipe()
//             let ingr = pRecipe.ingredients
//             if (!ingr.empty) {
//                 let item = ingr.get(0).getFirst()
//                 ItemTransferHelper.insertItemStacked(items, item.copyWithCount(proxySequencedAssemblyRecipe.loop * item.count), false)
//             }

//         })
//     }
// })