MBDMachineEvents.onAfterRecipeModify("createdelight:big_centrifuge", e => {
    /**
     * @type {Internal.MBDMultiblockMachine}
     */
    let multiblock = e.event.machine
    let maxSpeed = 32
    multiblock.parts.forEach(part => {
        /**
         * @type {Internal.MBDPartMachine}
         */
        let partMachine = part
        if (partMachine.definition.id() == "createdelight:create_in") {
            /**
             * @type {Internal.KineticBlockEntity}
             */
            let kineticInput = partMachine.machineHolder
            maxSpeed = Math.max(Math.abs(kineticInput.speed), maxSpeed)
        }
    })
    function linear(val, start, end) {
        return val * (end - start) + start
    }
    let durationMultipler = linear((maxSpeed - 32) / (256 - 32), 4, 1)
    let oldRecipe = e.event.recipe.copy()
    oldRecipe.duration *= durationMultipler
    e.event.setRecipe(oldRecipe)
})