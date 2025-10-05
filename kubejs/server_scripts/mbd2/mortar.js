const $ServerPlayer = Java.loadClass("net.minecraft.server.level.ServerPlayer")
const $MillingRecipe = Java.loadClass("com.simibubi.create.content.kinetics.millstone.MillingRecipe")
MBDMachineEvents.onRecipeWorking("createdelight:mortar", e => {
    let event = e.event
    const {machine} = event
    machine.recipeLogic.progress--
})

MBDMachineEvents.onRightClick("createdelight:mortar", e => {
    let event = e.event
    const {machine, player} = event
    if (player.shiftKeyDown) {
        let output = machine.getCapability(ForgeCapabilities.ITEM_HANDLER, "down").orElse(null)
        player.give(output.extractItem(0, output.getStackInSlot(0).count, false))
        player.swing()
    }
    else if (machine.machineStateName == "working") {
        let time = 5 * 2
        machine.recipeLogic.progress += machine.recipeLogic.duration / time
        player.sendData("kubejs_player_playsound", {soundEvent: "minecraft:block.stone.hit"})
        player.swing()
    }
})

MBDRecipeTypeEvents.onTransferProxyRecipe("createdelight:mortar", e => {
    let event = e.event;
    const {recipeType, proxyTypeId, proxyType, proxyRecipeId, proxyRecipe} = event;

    // console.log(` : ${proxyRecipe}`)
    // console.log(`proxyTypeId: ${proxyTypeId}`)
    // make sure the recipe type is correct
    if (proxyTypeId.toString() === "create:milling") {
        
        let input = proxyRecipe.getIngredients()[0]; // we assume the ingredients has and only has one item.
        /**@type {Internal.MillingRecipe} */
        let proxyMillingRecipe = proxyRecipe
        // console.log(`proxyMillingRecipe: ${proxyMillingRecipe}`)
        /**@type {Internal.MBDRecipeSchema$MBDRecipeJS} */
        var recipe = recipeType.recipeBuilder() // same as create recipe via kjs event
            .id(proxyRecipeId + "_mbd2")
            .duration(proxyMillingRecipe.processingDuration)
            .inputItems(input)
        proxyMillingRecipe.rollableResults.forEach(output => {
            recipe
            .chance(output.chance, builder => builder.outputItems(output.stack))
        })
        // If you want to skip this recipe
        // event.mbdRecipe = null;
        // set the result
        event.mbdRecipe = recipe.buildMBDRecipe();
    }
})