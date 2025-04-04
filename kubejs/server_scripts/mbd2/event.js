const $MBDMultiblockMachine = Java.loadClass("com.lowdragmc.mbd2.common.machine.MBDMultiblockMachine")
const $MBDPartMachine = Java.loadClass("com.lowdragmc.mbd2.common.machine.MBDPartMachine")
// 大坝与转子同向才可工作
MBDMachineEvents.onBeforeRecipeWorking("createdelight:hydropower_station", e => {
    /**
     * @type {Internal.MBDMultiblockMachine}
     */
    let machine = e.event.machine
    let mainFacing = machine.frontFacing.get()
    machine.getParts().forEach(ipart => {
        /**
         * @type {Internal.MBDPartMachine}
         */
        let part = ipart
        if (part.definition.id() == "createdelight:hydropower_station_fan") {
            let fanFacing = part.frontFacing.get()
            if (!(mainFacing.clockWise.equals(fanFacing) || mainFacing.counterClockWise.equals(fanFacing)))
                e.event.setCanceled(true)
        }
    })
    
})
// /**
//  * 
//  * @param {Internal.Level} level 
//  * @param {BlockPos} pos 
//  * @param {number} age 
//  * @param {Map<string, number>} list 
//  * @returns {Map<string, number>}
//  */
// function nuclearDiffusionByAge(level, pos, age, list) {
//     if (age == 0)
//         return -1
//     let positions = [pos.above(), pos.below(), pos.north(), pos.south(), pos.east(), pos.west()]
//     if (!level.getBlock(pos).hasTag("create_new_age:stops_radiation")) {
//         list.set(`${pos.x},${pos.y},${pos.z}`, age)
//         positions.forEach(position => {
//             if (list.get(`${position.x},${position.y},${position.z}`) == null) {
//                 nuclearDiffusionByAge(level, position, age - 1, list)
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
//  * @returns {Map<string, number>}
//  */
// function nuclearDiffusionByCount(level, pos, size, list) {
//     if (list.size >= size)
//         return
//     let positions = [pos.above(), pos.below(), pos.north(), pos.south(), pos.east(), pos.west()]
//     if (!level.getBlock(pos).hasTag("create_new_age:stops_radiation")) {
//         list.set(`${pos.x},${pos.y},${pos.z}`, age)
//         positions.forEach(position => {
//             if (list.get(`${position.x},${position.y},${position.z}`) == null) {
//                 nuclearDiffusionByAge(level, position, age - 1, list)
//             }
//         })
//     }
// }
// MBDMachineEvents.onTick("mbd2:reactor_rod", e => {
//     const { level, pos, machineStateName } = e.event.machine
//     if (machineStateName == "working") {
//         /**
//          * @type {Map<string, number>}
//          */
//         let map = new Map()
//         let time = level.time
//         if (time % 200 == 0) {
//             nuclearDiffusionByAge(level, pos, 7, map)
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

// MBDMachineEvents.onRemoved("mbd2:reactor_rod", e => {
//     const { level, pos, machineStateName } = e.event.machine
//     if (machineStateName == "working" || machineStateName == "waiting") {
//         level.createExplosion(pos.x, pos.y, pos.z)
//         .causesFire(false)
//         .explosionMode("block")
//         .explode()
//     }
// })

// MBDMachineEvents.onBeforeRecipeModify("createdelight:small_centrifugation", e => {

//     /**
//      * @type {Internal.KineticBlockEntity}
//      */
//     let be = e.event.machine.machineHolder
//     let inventory = e.event.machine.getCapability(ForgeCapabilities.ITEM_HANDLER).orElse(null)
//     let item = inventory.getStackInSlot(0)
//     function linear(val, start, end) {
//         return val * (end - start) + start
//     }
//     let durationMultipler = linear(be.speed / 256, 4, 1)
//     let count = item.getCount()
//     if (count >= 16 && count <= item.getMaxStackSize()) {
//         durationMultipler *= linear((count - 16)/(item.getMaxStackSize() - 16), 1, 2)
//     }
//     let oldRecipe = e.event.recipe.copy()
//     oldRecipe.duration *= durationMultipler
//     e.event.setRecipe(oldRecipe)
// })
