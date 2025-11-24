const $ForgeEnergyRecipeCapability = Java.loadClass("com.lowdragmc.mbd2.common.capability.recipe.ForgeEnergyRecipeCapability")
const $FluidRecipeCapability = Java.loadClass("com.lowdragmc.mbd2.common.capability.recipe.FluidRecipeCapability")
const $SwitchWidget = Java.loadClass("com.lowdragmc.lowdraglib.gui.widget.SwitchWidget")



//初始化CustomData
MBDMachineEvents.onStructureFormed("createdelight:fission_reactor", e => {
    let customData = e.event.machine.customData
        let machine = e.event.machine
        let assembly_count = 0
        /** @type {Internal.MBDMultiblockMachine} */
        let multiblock = machine

        multiblock.parts.forEach(part => {
            /** @type {Internal.MBDPartMachine} */
            let machinePart = part
            if (machinePart.definition.id() == "createdelight:fission_fuel_assembly")
                assembly_count++
        })
    if(customData.getInt("assembly_count") != assembly_count) {
        customData.putInt("assembly_count", assembly_count)
    }
    if(!customData.getDouble("burning_rate")) {
        customData.putDouble("burning_rate", 0)
    }
    if(!customData.getDouble("temperature")) {
        customData.putDouble("temperature", 298.15)
    }
    if(!customData.getDouble("degree_of_damage")) {
        customData.putDouble("degree_of_damage", 0)
    }
    if(!customData.getDouble("multiplier")) {
        customData.putDouble("multiplier", 0)
    }
})
const BASE_HEAT_RATE = 0.08         // 基础发热率
const BASE_COOL_RATE = 0.08         // 基础冷却率
const TEMP_MULTIPLIER = 0.0005      // 温度对效率的影响
const CRITICAL_TEMP = 1500.0        //临界温度，超出后增加损坏率
const MELTDOWN_TEMP = 2500.0        //融毁温度，超出后直接爆炸

//升温逻辑及代码判断
MBDMachineEvents.onTick("createdelight:fission_reactor", e => {
    const { machine } = e.event
    const customData = machine.customData
    if (machine.level.time % 3 != 0) return

    let temp = customData.getDouble("temperature")
    let degree_of_damage = customData.getDouble("degree_of_damage")
    let multiplier = machine.customData.getDouble("multiplier")

    // 缓存冷却与发热，避免重复调用造成开销
    const heatProduced = ReactorUtil.heatProduced(machine)
    const cooling = ReactorUtil.cooling(machine)
    const coolingTemp = cooling[0]
    const coolingDamage = cooling[1]

    let ambientCooling = 0.05 + (temp - 298.15) * 0.0001
    let newTemp = Math.max(298.15, temp + heatProduced * 3 - coolingTemp * 3 - ambientCooling * 3)
    customData.putDouble("temperature", newTemp)

    let damageProduced = 0
    if (newTemp >= CRITICAL_TEMP) {
        damageProduced = 0.01 * customData.getInt("assembly_count") * 3
        if(degree_of_damage > 50) {
            machine.level.playSound(null, machine.pos.x, machine.pos.y, machine.pos.z, "alexscaves:nuclear_siren", "blocks", 1, 1)
        }
    }

    let newDamage = Math.max(0, degree_of_damage + damageProduced - coolingDamage * 3)
    if (newDamage != degree_of_damage) {customData.putDouble("degree_of_damage", newDamage)}
    
    if (temp < 1000) { multiplier = 0 }
    else if (temp >= 1000 && temp <= 1500) { multiplier = (1 + 2 * (temp - 1000) / 500) }
    else { multiplier = 3 }
    customData.putDouble("multiplier", multiplier)

    if (degree_of_damage >= 100) {ReactorUtil.Bombbbb(machine)}
    if (newTemp >= MELTDOWN_TEMP) {ReactorUtil.Bombbbb(machine)}
    // machine.level.tell(`damageProduced:${damageProduced}, damageReducecd:${damageReducecd}, newDamage:${newDamage}, boolean:${newTemp >= CRITICAL_TEMP}`)
})
//温度对于产电的调节
MBDMachineEvents.onBeforeRecipeModify("createdelight:fission_reactor", e => {
    const { machine, recipe } = e.event
    let burning_rate = machine.customData.getDouble("burning_rate")
    let assembly_count = machine.customData.getInt("assembly_count") * burning_rate
    e.event.setRecipe(recipe.copy(ContentModifier.multiplier(Math.pow(1.0415, assembly_count)), false, "both"))
})
MBDMachineEvents.onAfterRecipeModify("createdelight:fission_reactor", e => {
    const { machine, recipe } = e.event
    let multiplier = machine.customData.getDouble("multiplier") 

    if(multiplier != 0) {
        e.event.setRecipe(recipe.copy(ContentModifier.multiplier(multiplier), false, "both"))
    } else {
        e.event.setRecipe(recipe.copy(ContentModifier.multiplier(0), false, "out"))
    }
})

// 输入槽位有流体且输出槽位可接受配方产出时，使连续工作的空配方失效
MBDMachineEvents.onAfterRecipeWorking("createdelight:fission_reactor", e => {
    const { machine, recipe } = e.event
    
    if (recipe.id && recipe.id == "createdelight:fission_react/empty") {
        let recipeLogic = machine.recipeLogic
        let fluid = machine.getCapability(ForgeCapabilities.FLUID_HANDLER).orElse(null)
        let energy = machine.getCapability(ForgeCapabilities.ENERGY).orElse(null)
        let maxFluidInput = ReactorUtil.inputFluid(machine)
        let maxEnergyOutput = ReactorUtil.outputEnergy(machine)
        let maxFluidOutput = ReactorUtil.outputFluid(machine)
        // machine.level.recipeManager.getByType("createdelight:fission_react").forEach((id, r) => {
        //     let mbdRecipe = machine.getModifiedRecipe(r)
        //     mbdRecipe.getOutputContents($ForgeEnergyRecipeCapability.CAP).forEach(con => {
        //         if (maxEnergyOutput < con.getContent())
        //             maxEnergyOutput = con.getContent()
        //     })

        //     mbdRecipe.getOutputContents($FluidRecipeCapability.CAP).forEach(con => {
        //         if (maxFluidOutput < con.getContent().getAmount())
        //             maxFluidOutput = con.getContent().getAmount()
        //     })

        //     mbdRecipe.getInputContents($FluidRecipeCapability.CAP).forEach(con => {
        //         if(maxFluidInput < con.getContent().getAmount())
        //             maxFluidInput = con.getContent().getAmount()
        //     })
        // })
        //输入槽位有流体且输出槽位可接受配方产出时，使连续工作的空配方失效
        if (!fluid.getFluidInTank(0).empty
            && fluid.getFluidInTank(0).amount >= maxFluidInput
            && fluid.getFluidInTank(1).amount + maxFluidOutput <= fluid.getTankCapacity(1)
            && energy.getEnergyStored() + maxEnergyOutput <= energy.getMaxEnergyStored()
            ) {
                recipeLogic.markLastRecipeDirty()
            }
    }
})

//实现移除时核反应堆爆炸
MBDMachineEvents.onRemoved("createdelight:fission_reactor", e => {
    // console.log(`machineStateName: ${e.event.machine.machineStateName}`)
    if (e.event.machine.machineStateName == "working") {
        ReactorUtil.Bombbbb(e.event.machine)
    }
})
MBDMachineEvents.onStateChanged("createdelight:fission_reactor", e => {
    // console.log(`newState: ${e.event.newState}, oldState: ${e.event.oldState}`)
    if (e.event.newState == "base" && e.event.oldState == "working") {
        /** @type {Internal.MBDMultiblockMachine} */
        let multiblock = e.event.machine
        if (!multiblock.formed) {
            ReactorUtil.Bombbbb(e.event.machine)
        }
    }
})
MBDMachineEvents.onStructureInvalid("createdelight:fission_reactor", e => {
    // console.log(`machineStateName: ${e.event.machine.machineStateName}`)
    if (e.event.machine.machineStateName == "working") {
        ReactorUtil.Bombbbb(e.event.machine)
    }
})


//实现机器紧急启停效果
    //UI实现
MBDMachineEvents.onUI("createdelight:fission_reactor", e => {
    const { machine, root } = e.event
    const customData = machine.customData
    let burning_rate = customData.getDouble("burning_rate")

    let damage = root.getFirstWidgetById("degree_of_damage")
    let temperature = root.getFirstWidgetById("temperature")
    let reactor_switch = root.getFirstWidgetById("switch") 
    /**@type {SwitchWidget} */
    let reactor_on = root.getFirstWidgetById("reactor_on")
    /**@type {SwitchWidget} */
    let reactor_off = root.getFirstWidgetById("reactor_off")
    let heatProduced = root.getFirstWidgetById("heatProduced")
    let cooling = root.getFirstWidgetById("cooling")
    let ambientCooling = root.getFirstWidgetById("ambientCooling")
    let inputFluid = root.getFirstWidgetById("inputFluid")
    let outputFluid = root.getFirstWidgetById("outputFluid")
    let outputEnergy = root.getFirstWidgetById("outputEnergy")
    let burningRate = root.getFirstWidgetById("burningRate")
    /** @type {TextFieldWidget} */
    let modify_burning_rate = root.getFirstWidgetById("modify_burning_rate")
    if(burning_rate != 0) {
        reactor_on.setPressed(true)
        reactor_off.setPressed(false)
    } else {
        reactor_on.setPressed(false)
        reactor_off.setPressed(true)
    }

    reactor_off.setOnPressCallback(p => {
        if(!p.isRemote && reactor_off.pressed) {
            reactor_on.setPressed(false)
            customData.putDouble("burning_rate", 0)
        }
        if(!p.isRemote && !reactor_off.pressed) {
            reactor_off.setPressed(true)
        }
        return
    })

    reactor_on.setOnPressCallback(p => {
        if(!p.isRemote && reactor_on.pressed) {
            reactor_off.setPressed(false)
            customData.putDouble("burning_rate", 1)
        }
        if(!p.isRemote && !reactor_on.pressed) {
            reactor_on.setPressed(true)
        }
        return
    })

    damage.setTextProvider(() => 
        Component.translate("message.createdelight.fission_reactor.degree_of_damage", Math.round(customData.getDouble("degree_of_damage") * 100) / 100)
    )

    temperature.setTextProvider(() => 
        Component.translate("message.createdelight.fission_reactor.temperature", Math.round(customData.getDouble("temperature") * 100) / 100)
    )

    reactor_switch.setTextProvider(() => 
        Component.translate("message.createdelight.fission_reactor.switch").append(
            customData.getDouble("temperature") >= 1500 
                ? Component.translate(
                    customData.getDouble("temperature") >= 2000 
                        ? "message.createdelight.fission_reactor.meltdown_temp" 
                        : "message.createdelight.fission_reactor.critical_temp"
                )
                : Component.translate(
                    customData.getDouble("burning_rate") != 0
                        ? "message.createdelight.fission_reactor.switch_on" 
                        : "message.createdelight.fission_reactor.switch_off"
                )
        )
    )

    modify_burning_rate.currentString = (burning_rate * 100 || 0).toFixed()
    modify_burning_rate.setNumbersOnlyInt(0, 100)
    modify_burning_rate.setTextResponder(num => {
        if(num != 0) {
            reactor_on.setPressed(true)
            reactor_off.setPressed(false)
        } else {
            reactor_on.setPressed(false)
            reactor_off.setPressed(true)
        }
        customData.putDouble("burning_rate", num / 100)
    })

    heatProduced.setTextProvider(() =>
        Component.translate("message.createdelight.fission_reactor.heat_produced", Math.round(ReactorUtil.heatProduced(machine) * 100) / 100)
    )

    cooling.setTextProvider(() =>
        Component.translate("message.createdelight.fission_reactor.fluid_cooling", Math.round(ReactorUtil.cooling(machine)[0] * 100) / 100)
    )

    ambientCooling.setTextProvider(() =>
        Component.translate("message.createdelight.fission_reactor.ambient_cooling",
            Math.round((0.05 + (customData.getDouble("temperature") - 298.15) * 0.0001) * 100) / 100
        )
    )

    inputFluid.setTextProvider(() =>
        Component.translate("message.createdelight.fission_reactor.input_fluid", Math.round(ReactorUtil.inputFluid(machine,) * 100) / 100)
    )

    outputFluid.setTextProvider(() =>
        Component.translate("message.createdelight.fission_reactor.output_fluid", Math.round(ReactorUtil.outputFluid(machine) * 100) / 100)
    )

    outputEnergy.setTextProvider(() =>
        Component.translate("message.createdelight.fission_reactor.output_energy", Math.round(ReactorUtil.outputEnergy(machine)) / 1000)
    )

    burningRate.setTextProvider(() =>
        Component.translate("message.createdelight.fission_reactor.burning_rate", Math.round(customData.getDouble("burning_rate") * 100))
    )
})
    //配方逻辑
MBDMachineEvents.onBeforeRecipeWorking("createdelight:fission_reactor", e => {
    const { machine } = e.event
    if (machine.customData.getDouble("burning_rate") == 0) {
        e.event.setCanceled(true)
    }
})
MBDMachineEvents.onFuelRecipeModify("createdelight:fission_reactor", e => {
    const { machine } = e.event
    if (machine.customData.getDouble("burning_rate") == 0) {
        e.event.setCanceled(true)
    }
})




// /**
//  * 
//  * @param {Internal.Level} level 
//  * @param {BlockPos} pos 
//  * @param {number} age 
//  * @param {Map<string, number>} list 
//  * @param {number} degree_of_damage 
//  * @returns {Map<string, number>}
//  */
// function nuclearDiffusionByAge(level, pos, age, list, degree_of_damage) {
//     if (age == 0)
//         return -1
//     let positions = [pos.above(), pos.below(), pos.north(), pos.south(), pos.east(), pos.west()]
//     if (!level.getBlock(pos).hasTag("create_new_age:stops_radiation")
//         || degree_of_damage > 50) {
//         list.set(`${pos.x},${pos.y},${pos.z}`, age)
//         positions.forEach(position => {
//             if (list.get(`${position.x},${position.y},${position.z}`) == null) {
//                 nuclearDiffusionByAge(level, position, age - 1, list, degree_of_damage)
//             }
//         })
//     }
// }

// /**
//  * 
//  * @param {Internal.Level} level
//  * @param {BlockPos} pos
//  * @param {number} size
//  * @param {Map<string, number>} list
//  * @param {number} degree_of_damage 
//  * @returns {Map<string, number>}
//  */
// function nuclearDiffusionByCount(level, pos, size, list, degree_of_damage) {
//     if (list.size >= size)
//         return
//     let positions = [pos.above(), pos.below(), pos.north(), pos.south(), pos.east(), pos.west()]
//     if (!level.getBlock(pos).hasTag("create_new_age:stops_radiation")
//         || degree_of_damage > 50) {
//         list.set(`${pos.x},${pos.y},${pos.z}`, age)
//         positions.forEach(position => {
//             if (list.get(`${position.x},${position.y},${position.z}`) == null) {
//                 nuclearDiffusionByCount(level, position, age - 1, list, degree_of_damage)
//             }
//         })
//     }
// }
// let _reactor_map = new Map()
// MBDMachineEvents.onTick("createdelight:fission_fuel_assembly", e => {
//     const { level, pos, machineStateName } = e.event.machine
//     // console.log(machineStateName)
//     if (machineStateName == "working") {
//         let time = level.time
//         if (time % 200 == 0) {
//             /**
//              * @type {Map<string, number>}
//              */
//             let map = _reactor_map
//             map.clear()
//             //理论上只有一个控制器
//             /**
//              * @type {Internal.MBDMultiblockMachine}
//              */
//             let multiblock = e.event.machine.controllers.get(0)
//             nuclearDiffusionByAge(level, pos, 7, map, multiblock.customData.getDouble("degree_of_damage"))
//             map.forEach((age, position) => {
//                 let poslist = position.split(",")
//                 let x = parseInt(poslist[0])
//                 let y = parseInt(poslist[1])
//                 let z = parseInt(poslist[2])

//                 // let particle = Utils.particleOptions(`dust 1 0 0 1`)
//                 // level.spawnParticles(particle, false, x + 0.5, y + 0.5, z + 0.5, 0, 1, 0, 1, 0.5)
//                 level.getEntitiesWithin(AABB.of(x + 1, y + 1, z + 1, x - 1, y - 1, z - 1)).forEach(entity => {
//                     if (entity.isLiving()) {
//                         /**
//                          * @type {Internal.LivingEntity}
//                          */
//                         let livingEntity = entity
//                         livingEntity.potionEffects.add("alexscaves:irradiated", 12000, 4, true, true)
//                     }
//                 })
//             })
//         }
//     }
// })
