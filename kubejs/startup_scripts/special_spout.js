/**
 * 
 * @param {Internal.FluidStackJS} fluid 流体
 */
function getFuelMultipler(fluid) {
    let fluidMultipler = 1
    if (fluid.id == "minecraft:lava" || fluid.id == "minecraft:water")
        fluidMultipler = 1
    else if (fluid.id == "createdieselgenerators:diesel" || fluid.id == "createdieselgenerators:biodiesel")
        fluidMultipler = 0.5
    else if (fluid.id == "createdieselgenerators:gasoline")
        fluidMultipler = 0.4
    else if (fluid.id == "createdelight:fuel_mixtures")
        fluidMultipler = 0.25
    else
        fluidMultipler = 0
    return fluidMultipler

}

/**
 * 
 * @param {Internal.FluidStackJS} fluid 
 * @param {boolean} simulate 
 * @param {Internal.ItemStack} item
 */
function fillWater(fluid, simulate, item) {
    if (!item.nbt.tagWater) {
        item.nbt.tagWater = 0
    }
    let fluidAmount = Math.min(1600 - item.nbt.tagWater, fluid.amount / 10) * 10
    if (fluidAmount > 0) {
        if (!simulate) {
            item.nbt.tagWater += fluidAmount / 10
        }
        return fluidAmount
    }
    return 0
}
/**
 * 
 * @param {Internal.FluidStackJS} fluid 
 * @param {boolean} simulate 
 * @param {Internal.ItemStack} item
 */
function fillFuel(fluid, simulate, item) {
    if (!item.nbt.tagFuel) {
        item.nbt.tagFuel = 0
    }
    let fuelMultipler = getFuelMultipler(fluid)
    let fluidAmount = Math.min(1600 - item.nbt.tagFuel, fluid.amount / 10 / fuelMultipler) * 10
    if (fluidAmount > 0) {
        if (!simulate) {
            item.nbt.tagFuel += fluidAmount / 10
        }
        return fluidAmount * fuelMultipler
    }
    return 0
}
CreateEvents.spoutHandler(e => {

    // e.add(
    //     "createdelight:depot_filling_tank_spout_interaction",
    //     ["create:depot", "create:weighted_ejector"],
    //     (block, fluid, simulate) => {
    //         let inventory = block.getInventory()
    //         if (inventory.isEmpty())
    //             return 0
    //         let item = inventory.getAllItems().get(0)
    //         if (item.hasTag("create_sa:fillable") || item.hasTag("create_sa:fuelable")) {
    //             item.getOrCreateTag()
    //             if (item.hasTag("create_sa:fillable") && fluid.id == "minecraft:water")
    //                 return fillWater(fluid, simulate, item)
    //             if (item.hasTag("create_sa:fuelable") && fluid.id != "minecraft:water")
    //                 return fillFuel(fluid, simulate, item)
    //         }
    //         return 0
    //     }
    // )
    e.add("createdelight:budding_certus_grow_spout_interaction",
        ["ae2:flawless_budding_quartz", "ae2:flawed_budding_quartz", "ae2:chipped_budding_quartz", "ae2:damaged_budding_quartz"],
        (block, fluid, simulate) => {
            if (fluid.id == "createdelight:spent_liquor" && fluid.amount >= 50) {
                if (!simulate) {
                    block.getBlockState().randomTick(block.level, block.pos, block.level.random)
                    block.getBlockState().randomTick(block.level, block.pos, block.level.random)
                    block.getBlockState().randomTick(block.level, block.pos, block.level.random)
                }
                return 50
            }
            return 0
        }
    )
    // e.add("createdelight:budding_certus_fix_spout_interaction",
    //     ["ae2:chipped_budding_quartz", "ae2:damaged_budding_quartz", "ae2:quartz_block"],
    //     (block, fluid, simulate) => {
    //         if (fluid.id == "createdelight:spent_liquor" && fluid.amount >= 50 && block.level.random.nextInt(4) == 0) {
    //             if (!simulate) {
    //                 if (block.id == "ae2:quartz_block")
    //                     block.setBlockState(Block.getBlock("ae2:damaged_budding_quartz").defaultBlockState(), 2)
    //                 else if (block.id == "ae2:damaged_budding_quartz")
    //                     block.setBlockState(Block.getBlock("ae2:chipped_budding_quartz").defaultBlockState(), 2)
    //                 else if (block.id == "ae2:chipped_budding_quartz")
    //                     block.setBlockState(Block.getBlock("ae2:flawed_budding_quartz").defaultBlockState(), 2)
    //             }
    //             return 50
    //         }
    //         return 0
    //     }
    // )
    e.add(
        "createdelight:sulfur_spout_interaction", // ID
        "alexscaves:sulfur", // 目標方塊
        (block, fluid, simulate) => {
            let level = block.level
            let upPos = block.pos.above()
            let upBlock = level.getBlock(upPos)
            if (fluid.id === "alexscaves:acid" && fluid.amount >= 10 && upBlock.getId() !== "alexscaves:sulfur_cluster") {
                if (!simulate) {
                    if (level.getRandom().nextInt(3) == 0) {
                        if (upBlock.getId() === "minecraft:air")
                            level.server.runCommandSilent(`/execute in ${level.dimension} run setblock ${upPos.x} ${upPos.y} ${upPos.z} alexscaves:sulfur_bud_small`)
                        else if (upBlock.getId() === "alexscaves:sulfur_bud_small")
                            level.server.runCommandSilent(`/execute in ${level.dimension} run setblock ${upPos.x} ${upPos.y} ${upPos.z} alexscaves:sulfur_bud_medium`)
                        else if (upBlock.getId() === "alexscaves:sulfur_bud_medium")
                            level.server.runCommandSilent(`/execute in ${level.dimension} run setblock ${upPos.x} ${upPos.y} ${upPos.z} alexscaves:sulfur_bud_large`)
                        else if (upBlock.getId() === "alexscaves:sulfur_bud_large")
                            level.server.runCommandSilent(`/execute in ${level.dimension} run setblock ${upPos.x} ${upPos.y} ${upPos.z} alexscaves:sulfur_cluster`)
                    }
                }
                return 10;
            }
            return 0;
        }
    )
})