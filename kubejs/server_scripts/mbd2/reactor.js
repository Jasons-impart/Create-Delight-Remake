const $ACEntityRegistry = Java.loadClass("com.github.alexmodguy.alexscaves.server.entity.ACEntityRegistry")
const $ForgeEnergyRecipeCapability = Java.loadClass("com.lowdragmc.mbd2.common.capability.recipe.ForgeEnergyRecipeCapability")
const $FluidRecipeCapability = Java.loadClass("com.lowdragmc.mbd2.common.capability.recipe.FluidRecipeCapability")
const $SwitchWidget = Java.loadClass("com.lowdragmc.lowdraglib.gui.widget.SwitchWidget")
const $AABB = Java.loadClass("net.minecraft.world.phys.AABB")
const $TargetingConditions = Java.loadClass("net.minecraft.world.entity.ai.targeting.TargetingConditions")
const $SoundSource = Java.loadClass("net.minecraft.sounds.SoundSource")

/**
 * 在机器处创造核爆
 * @param {Internal.MBDMachine} machine 
 */
function Bombbbb(machine) {
    let assembly_count = machine.customData.getInt("assembly_count")
    /**
     * @type {Internal.NuclearExplosionEntity}
     */
    let Bombbbb = $ACEntityRegistry.NUCLEAR_EXPLOSION.get().create(machine.level)
    Bombbbb.setPos(machine.pos.center)
    Bombbbb.setSize(Math.sqrt((assembly_count / 9 + 1)))
    machine.level.addFreshEntity(Bombbbb)
}

//初始化CustomData
MBDMachineEvents.onStructureFormed("createdelight:fission_reactor", e => {
    let customData = e.event.machine.customData
        let machine = e.event.machine
        let assembly_count = 0
        /**
         * @type {Internal.MBDMultiblockMachine}
         */
        let multiblock = machine

        multiblock.parts.forEach(part => {
            /**
             * @type {Internal.MBDPartMachine}
             */
            let machinePart = part
            if (machinePart.definition.id() == "createdelight:fission_fuel_assembly")
                assembly_count++
        })
    if(customData.getInt("assembly_count") != assembly_count) {
        customData.putInt("assembly_count", assembly_count)
    }
    if(!customData.getDouble("temperature")) {
        customData.putDouble("temperature", 298.15)
    }
    if(!customData.getBoolean("reactor_switch")) {
        customData.putBoolean("reactor_switch", false)
    }
    if(!customData.getDouble("degree_of_damage")) {
        customData.putDouble("degree_of_damage", 0)
    }
    if(!customData.getDouble("multiplier")) {
        customData.putDouble("multiplier", 0)
    }
})

//升温逻辑及代码判断
MBDMachineEvents.onTick("createdelight:fission_reactor", e => {
    const { machine } = e.event
    const customData = machine.customData

    let temp = customData.getDouble("temperature")
    let degree_of_damage = customData.getDouble("degree_of_damage")
    let multiplier = machine.customData.getDouble("multiplier")
    let assembly_count = customData.getInt("assembly_count")
    let ambientCooling = 0.05 + (temp - 298.15) * 0.0001

    const isActive = !!(machine.recipeLogic && machine.recipeLogic.fuelTime > 0)
    const controlRodsOut = !!customData.getBoolean("reactor_switch")
    const BASE_HEAT_RATE = 0.08         // 基础发热率
    const BASE_COOL_RATE = 0.08         // 基础冷却率
    const TEMP_MULTIPLIER = 0.0005      // 温度对效率的影响
    const CRITICAL_TEMP = 1500.0        //临界温度，超出后增加损坏率
    const MELTDOWN_TEMP = 2500.0        //融毁温度，超出后直接爆炸

    let heatProduced = 0
    if (isActive && controlRodsOut) {
        let tempEfficiency = 1.0 - (temp - 298.15) * TEMP_MULTIPLIER
        heatProduced = BASE_HEAT_RATE * assembly_count * Math.max(0.3, tempEfficiency)
    }
    let cooling = 0
    let damageReducecd = 0
    let fluidCap = machine.getCapability(ForgeCapabilities.FLUID_HANDLER).orElse(null)
    if (fluidCap) {
        let coolantEfficiency = 0
        if(machine.machineStateName == "working" && machine.recipeLogic.lastRecipe.getId() != "createdelight:fission_react/empty") {
            let fluid = fluidCap.getFluidInTank(0)
            if (fluid.fluid.getFluidType().toString() == "minecraft:water") coolantEfficiency = 1.0
            else if (fluid.fluid.getFluidType().toString() == "netherexp:ectoplasm") coolantEfficiency = 1.5
            damageReducecd = coolantEfficiency * 0.005 * assembly_count
            cooling = BASE_COOL_RATE * coolantEfficiency * assembly_count * 0.3 
        }
    }
    let newTemp = Math.max(298.15, temp + heatProduced - cooling - ambientCooling)
    let damageProduced = 0
    if (newTemp >= CRITICAL_TEMP) {
        damageProduced = 0.01 * assembly_count
        if(degree_of_damage > 50) {
            machine.level.playSound(null, machine.pos.x, machine.pos.y, machine.pos.z, "alexscaves:nuclear_siren", $SoundSource.BLOCKS, 1, 1)
        }
    }
    customData.putDouble("temperature", newTemp)


    let newDamage = Math.max(0, degree_of_damage + damageProduced - damageReducecd)
    if (degree_of_damage >= 100) {Bombbbb(machine)}
    if (newTemp >= MELTDOWN_TEMP) {Bombbbb(machine)}


    if (temp < 1000) {
        multiplier = 0
    } else if (temp >= 1000 && temp <= 1500) {
        multiplier = 1 + 2 * (temp - 1000) / 500
    } else {
        multiplier = 3
    }
    customData.putDouble("multiplier", multiplier)
    if (newDamage != degree_of_damage) {customData.putDouble("degree_of_damage", newDamage)}

    // machine.level.tell(`damageProduced:${damageProduced}, damageReducecd:${damageReducecd}, newDamage:${newDamage}, boolean:${newTemp >= CRITICAL_TEMP}`)
})
//温度对于产电的调节
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
        let multiplier = machine.customData.getDouble("multiplier")
        let assembly_count = machine.customData.getInt("assembly_count")
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
        let minFluid = 20 * multiplier * Math.pow(1.0415, assembly_count)
        //输入槽位有流体且输出槽位可接受配方产出时，使连续工作的空配方失效
        if (!fluid.getFluidInTank(0).empty
            && fluid.getFluidInTank(0).amount >= minFluid
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
        Bombbbb(e.event.machine)
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
            Bombbbb(e.event.machine)
        }
    }
})
MBDMachineEvents.onStructureInvalid("createdelight:fission_reactor", e => {
    // console.log(`machineStateName: ${e.event.machine.machineStateName}`)
    if (e.event.machine.machineStateName == "working") {
        Bombbbb(e.event.machine)
    }
})


//实现机器紧急启停效果
    //UI实现
MBDMachineEvents.onUI("createdelight:fission_reactor", e => {
    const { machine, root } = e.event
    let title = root.getFirstWidgetById("title")
    let damage = root.getFirstWidgetById("degree_of_damage")
    let temperature = root.getFirstWidgetById("temperature")
    let reactor_switch = root.getFirstWidgetById("switch") 
    /**@type {SwitchWidget} */
    let reactor_on = root.getFirstWidgetById("reactor_on")
    /**@type {SwitchWidget} */
    let reactor_off = root.getFirstWidgetById("reactor_off")
    if(machine.customData.getBoolean("reactor_switch")) {
        reactor_on.setPressed(true)
        reactor_off.setPressed(false)
    } else {
        reactor_on.setPressed(false)
        reactor_off.setPressed(true)
    }
    reactor_off.setOnPressCallback(p => {
        if(!p.isRemote && reactor_off.pressed) {
            reactor_on.setPressed(false)
            machine.customData.putBoolean("reactor_switch", false)
        }
        return
    })
    reactor_on.setOnPressCallback(p => {
        if(!p.isRemote && reactor_on.pressed) {
            reactor_off.setPressed(false)
            machine.customData.putBoolean("reactor_switch", true)
        }
        return
    })
    title.setTextProvider(() => Component.translate("block.createdelight.fission_reactor"))
    damage.setTextProvider(() => 
        Component.translate("message.createdelight.degree_of_damage", Math.round(machine.customData.getDouble("degree_of_damage") * 100) / 100)
    )
    temperature.setTextProvider(() => 
        Component.translate("message.createdelight.temperature", Math.round(machine.customData.getDouble("temperature") * 100) / 100)
    )
    reactor_switch.setTextProvider(() => 
        Component.translate("message.createdelight.switch").append(
            machine.customData.getDouble("temperature") >= 1500 
                ? Component.translate(
                    machine.customData.getDouble("temperature") >= 2000 
                        ? "message.createdelight.meltdown_temp" 
                        : "message.createdelight.critical_temp"
                )
                : Component.translate(
                    machine.customData.getBoolean("reactor_switch") 
                        ? "message.createdelight.switch_on" 
                        : "message.createdelight.switch_off"
                )
        )
    )
})
    //配方逻辑
MBDMachineEvents.onBeforeRecipeWorking("createdelight:fission_reactor", e => {
    const { machine } = e.event
    if (!machine.customData.getBoolean("reactor_switch")) {
        e.event.setCanceled(true)
    }
})
MBDMachineEvents.onFuelRecipeModify("createdelight:fission_reactor", e => {
    const { machine } = e.event
    if (!machine.customData.getBoolean("reactor_switch")) {
        e.event.setCanceled(true)
    }
})
MBDRecipeTypeEvents.onRecipeUI("createdelight:fission_react", e => {
    const { root } = e.event
    let cooling_efficiency = root.getFirstWidgetById("cooling_efficiency")
    cooling_efficiency.setTextProvider(() => 
        Component.translate(
            "message.createdelight.cooling_efficiency",
            e.event.getRecipe().getId() = "createdelight:fission_react/ectoplasm_cooling"
                ? 1.5 : 1.0
        )
    )
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
