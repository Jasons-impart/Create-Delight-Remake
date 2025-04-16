const $MBDMultiblockMachine = Java.loadClass("com.lowdragmc.mbd2.common.machine.MBDMultiblockMachine")
const $MBDPartMachine = Java.loadClass("com.lowdragmc.mbd2.common.machine.MBDPartMachine")
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
