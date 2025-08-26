const $FluidIngredient = Java.loadClass("com.lowdragmc.mbd2.api.recipe.ingredient.FluidIngredient")
const $SizedIngredient = Java.loadClass("com.lowdragmc.mbd2.api.recipe.ingredient.SizedIngredient")
const $mbdFluidStack = Java.loadClass("com.lowdragmc.lowdraglib.side.fluid.FluidStack")
const $ItemApplicationRecipe = Java.loadClass("com.simibubi.create.content.kinetics.deployer.ItemApplicationRecipe")

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

MBDRecipeTypeEvents.onTransferProxyRecipe("createdelight:assembly_line", e => {
    let event = e.event;
    const { recipeType, proxyTypeId, proxyType, proxyRecipeId, proxyRecipe } = event;
    if (proxyTypeId.toString() === "create:sequenced_assembly") {

        let changed = false
        /**@type {Internal.SequencedAssemblyRecipe} */
        let proxySequencedAssemblyRecipe = proxyRecipe
        /**@type {Internal.MBDRecipeSchema$MBDRecipeJS} */
        let resRecipe = recipeType.recipeBuilder() // same as create recipe via kjs event
        resRecipe.inputItems(Ingredient.of(proxySequencedAssemblyRecipe.getIngredient(), 64 / proxySequencedAssemblyRecipe.loops))
        // console.log(proxyRecipeId)
        if (proxySequencedAssemblyRecipe.sequence.size() > 1)
            proxySequencedAssemblyRecipe.sequence.forEach(recipe => {
                let pRecipe = recipe.getRecipe()
                let ingr = pRecipe.ingredients
                let fluidIngr = pRecipe.fluidIngredients

                // console.log("ingr:")
                // if (ingr != null)
                //     ingr.forEach(ingr => {
                //         console.log(ingr.getFirst())
                //     })
                // console.log("fluidIngr:")
                // console.log(fluidIngr)
                // if (fluidIngr != null && !fluidIngr.empty) {
                //     console.log(fluidIngr.get(0))
                //     console.log(fluidIngr.get(0).getMatchingFluidStacks())
                // }
                if (!fluidIngr.empty) {
                    let fluids = fluidIngr.get(0).getMatchingFluidStacks().map(fluid => {
                        let resAmount = fluid.amount * 64 / proxySequencedAssemblyRecipe.loops
                        if (proxySequencedAssemblyRecipe.loops != 1 && 64 % proxySequencedAssemblyRecipe.loops != 0)
                            resAmount = parseInt(resAmount / 50) * 50
                        return Fluid.of(fluid.fluid, resAmount)
                    })
                    resRecipe.inputFluids([fluids])
                    changed = true
                }
                if (ingr.size() == 2) {
                    if (pRecipe instanceof $ItemApplicationRecipe) {
                        /**@type {Internal.ItemApplicationRecipe} */
                        let appRecipe = pRecipe
                        if (appRecipe.shouldKeepHeldItem())
                            resRecipe.chance(0, builder =>
                                builder.inputItems(Ingredient.of(ingr.get(1), 1)))
                        else
                            resRecipe.inputItems(Ingredient.of(ingr.get(1), 64))
                    }
                    else
                        resRecipe.inputItems(Ingredient.of(ingr.get(1), 64))
                    changed = true
                }
            })

        resRecipe
            .duration(parseInt(Math.sqrt(proxySequencedAssemblyRecipe.loops) * 100))
            .outputItems(Item.of(proxySequencedAssemblyRecipe.getResultItem(null), 64 / proxySequencedAssemblyRecipe.loops * proxySequencedAssemblyRecipe.getResultItem(null).count))
            .id(proxyRecipeId + "_mbd2")
        // console.log("changed:" + changed)
        if (changed)
            event.mbdRecipe = resRecipe.buildMBDRecipe()
        else
            event.mbdRecipe = null
        // console.log("on finish")
    }
})