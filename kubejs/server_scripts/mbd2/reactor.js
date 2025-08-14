const $ACEntityRegistry = Java.loadClass("com.github.alexmodguy.alexscaves.server.entity.ACEntityRegistry")
const $ForgeEnergyRecipeCapability = Java.loadClass("com.lowdragmc.mbd2.common.capability.recipe.ForgeEnergyRecipeCapability")
const $FluidRecipeCapability = Java.loadClass("com.lowdragmc.mbd2.common.capability.recipe.FluidRecipeCapability")
const $SwitchWidget = Java.loadClass("com.lowdragmc.lowdraglib.gui.widget.SwitchWidget")
/**
 * 
 * @param {Internal.MBDMachine} machine 
 */
function CreateNuclearExplodeFromReactor(machine) {
    /**
     * @type {Internal.MBDMultiblockMachine}
     */
    let multiblock = machine
    /**
     * @type {Internal.NuclearBombEntity}
     */
    let explosion = $ACEntityRegistry.NUCLEAR_EXPLOSION.get().create(machine.level)
    explosion.setPos(machine.pos.center)
    let fission_fuel_assembly_count = 0
    multiblock.parts.forEach(part => {
        /**
         * @type {Internal.MBDPartMachine}
         */
        let partMachine = part
        if (partMachine.definition.id() == "createdelight:fission_fuel_assembly")
            fission_fuel_assembly_count++
    })

    explosion.setSize(Math.sqrt((fission_fuel_assembly_count / 9 + 1)))
    machine.level.addFreshEntity(explosion)
}
MBDMachineEvents.onBeforeRecipeWorking("createdelight:fission_reactor", e => {
    const event = e.event
    const {machine} = event
    if (!machine.customData.getBoolean("reactor_switch")) {
        event.setCanceled(true)
    }
})
MBDMachineEvents.onFuelRecipeModify("createdelight:fission_reactor", e => {
    const event = e.event
    const {machine} = event
    if (!machine.customData.getBoolean("reactor_switch")) {
        event.setCanceled(true)
    }
})
MBDMachineEvents.onRecipeWorking("createdelight:fission_reactor", e => {
    const event = e.event
    const { machine, recipe } = event
    /**
     * @type {Internal.MBDMultiblockMachine}
     */
    let multiblock = machine
    let customData = multiblock.customData
    const { x, y, z } = multiblock.pos
    if (!customData.getDouble("degree_of_damage"))
        customData.putDouble("degree_of_damage", 0)
    if (customData.getDouble("degree_of_damage") > 100) {
        CreateNuclearExplodeFromReactor(machine)
    }

    // console.log(recipe.getId())
    // console.log(customData.getDouble("degree_of_damage"))
    if (recipe.id == "createdelight:fission_react/empty") {
        customData.putDouble("degree_of_damage", multiblock.customData.getDouble("degree_of_damage") + 0.01)
    }
    else if (customData.getDouble("degree_of_damage") > 0) {
        customData.putDouble("degree_of_damage", Math.max(0, multiblock.customData.getDouble("degree_of_damage") - 0.005))
    }
})

MBDMachineEvents.onAfterRecipeWorking("createdelight:fission_reactor", e => {
    let event = e.event
    const { machine, recipe } = event

    // console.log(`fluid.getFluidInTank(1).amount: ${fluid.getFluidInTank(1).amount}, capacity: ${fluid.getTankCapacity(1)}`)
    if (recipe.id && recipe.id == "createdelight:fission_react/empty") {
        let recipeLogic = machine.recipeLogic
        let fluid = machine.getCapability(ForgeCapabilities.FLUID_HANDLER).orElse(null)
        let energy = machine.getCapability(ForgeCapabilities.ENERGY).orElse(null)
        let maxEnergyOutput = 0
        let maxFluidOutput = 0
        machine.level.recipeManager.getByType("createdelight:fission_react").forEach((id, r) => {
            let mbdRecipe = machine.getModifiedRecipe(r)
            mbdRecipe.getOutputContents($ForgeEnergyRecipeCapability.CAP).forEach(con => {
                if (maxEnergyOutput < con.getContent())
                    maxEnergyOutput = con.getContent()
            })

            mbdRecipe.getOutputContents($FluidRecipeCapability.CAP).forEach(con => {
                if (maxFluidOutput < con.getContent().getAmount())
                    maxFluidOutput = con.getContent().getAmount()
            })
        })

        //输入槽位有流体且输出槽位可接受配方产出时，使连续工作的空配方失效
        if (!fluid.getFluidInTank(0).empty &&
            fluid.getFluidInTank(1).amount + maxFluidOutput <= fluid.getTankCapacity(1) &&
            energy.getEnergyStored() + maxEnergyOutput <= energy.getMaxEnergyStored())
            recipeLogic.markLastRecipeDirty()
    }
})

MBDMachineEvents.onRemoved("createdelight:fission_reactor", e => {
    // console.log(`machineStateName: ${e.event.machine.machineStateName}`)
    if (e.event.machine.machineStateName == "working") {
        CreateNuclearExplodeFromReactor(e.event.machine)
    }
})

MBDMachineEvents.onStateChanged("createdelight:fission_reactor", e => {
    // console.log(`newState: ${e.event.newState}, oldState: ${e.event.oldState}`)
    if (e.event.newState == "base" && e.event.oldState == "working") {
        /**
         * @type {Internal.MBDMultiblockMachine}
         */
        let multiblock = e.event.machine
        if (!multiblock.formed) {
            CreateNuclearExplodeFromReactor(e.event.machine)
        }
    }
})

MBDMachineEvents.onStructureInvalid("createdelight:fission_reactor", e => {
    // console.log(`machineStateName: ${e.event.machine.machineStateName}`)
    if (e.event.machine.machineStateName == "working") {
        CreateNuclearExplodeFromReactor(e.event.machine)
    }
})


/**
 * 
 * @param {Internal.Level} level 
 * @param {BlockPos} pos 
 * @param {number} age 
 * @param {Map<string, number>} list 
 * @param {number} degree_of_damage 
 * @returns {Map<string, number>}
 */
function nuclearDiffusionByAge(level, pos, age, list, degree_of_damage) {
    if (age == 0)
        return -1
    let positions = [pos.above(), pos.below(), pos.north(), pos.south(), pos.east(), pos.west()]
    if (!level.getBlock(pos).hasTag("create_new_age:stops_radiation")
        || degree_of_damage > 50) {
        list.set(`${pos.x},${pos.y},${pos.z}`, age)
        positions.forEach(position => {
            if (list.get(`${position.x},${position.y},${position.z}`) == null) {
                nuclearDiffusionByAge(level, position, age - 1, list, degree_of_damage)
            }
        })
    }
}

/**
 * 
 * @param {Internal.Level} level
 * @param {BlockPos} pos
 * @param {number} size
 * @param {Map<string, number>} list
 * @param {number} degree_of_damage 
 * @returns {Map<string, number>}
 */
function nuclearDiffusionByCount(level, pos, size, list, degree_of_damage) {
    if (list.size >= size)
        return
    let positions = [pos.above(), pos.below(), pos.north(), pos.south(), pos.east(), pos.west()]
    if (!level.getBlock(pos).hasTag("create_new_age:stops_radiation")
        || degree_of_damage > 50) {
        list.set(`${pos.x},${pos.y},${pos.z}`, age)
        positions.forEach(position => {
            if (list.get(`${position.x},${position.y},${position.z}`) == null) {
                nuclearDiffusionByCount(level, position, age - 1, list, degree_of_damage)
            }
        })
    }
}
let _reactor_map = new Map()
MBDMachineEvents.onTick("createdelight:fission_fuel_assembly", e => {
    const { level, pos, machineStateName } = e.event.machine
    // console.log(machineStateName)
    if (machineStateName == "working") {
        let time = level.time
        if (time % 200 == 0) {
            /**
             * @type {Map<string, number>}
             */
            let map = _reactor_map
            map.clear()
            //理论上只有一个控制器
            /**
             * @type {Internal.MBDMultiblockMachine}
             */
            let multiblock = e.event.machine.controllers.get(0)
            nuclearDiffusionByAge(level, pos, 7, map, multiblock.customData.getDouble("degree_of_damage"))
            map.forEach((age, position) => {
                let poslist = position.split(",")
                let x = parseInt(poslist[0])
                let y = parseInt(poslist[1])
                let z = parseInt(poslist[2])

                // let particle = Utils.particleOptions(`dust 1 0 0 1`)
                // level.spawnParticles(particle, false, x + 0.5, y + 0.5, z + 0.5, 0, 1, 0, 1, 0.5)
                level.getEntitiesWithin(AABB.of(x + 1, y + 1, z + 1, x - 1, y - 1, z - 1)).forEach(entity => {
                    if (entity.isLiving()) {
                        /**
                         * @type {Internal.LivingEntity}
                         */
                        let livingEntity = entity
                        livingEntity.potionEffects.add("alexscaves:irradiated", 12000, 4, true, true)
                    }
                })
            })
        }
    }
})
MBDMachineEvents.onOpenUI("createdelight:fission_reactor", e => {
    let event = e.event
    const { machine } = event

})
MBDMachineEvents.onUI("createdelight:fission_reactor", e => {
    let event = e.event
    const { machine, root } = event
    
    let label = root.getFirstWidgetById("degree_of_damage")
    /**@type {SwitchWidget} */
    let button = root.getFirstWidgetById("reactor_switch")
    
    if (button.pressed != machine.customData.getBoolean("reactor_switch"))
        button.setPressed(machine.customData.getBoolean("reactor_switch"))
    button.setOnPressCallback(data => {
        if (!data.isRemote) {
            machine.customData.putBoolean("reactor_switch", button.pressed)
        }
    })
    label.setTextProvider(() => Component.translate("message.createdelight.degree_of_damage",
        parseInt(machine.customData.getDouble("degree_of_damage") * 100) / 100))
})