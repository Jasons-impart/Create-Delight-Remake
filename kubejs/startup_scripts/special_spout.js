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
    let tankId = [
        "create_sa:small_filling_tank",
        "create_sa:medium_filling_tank",
        "create_sa:large_filling_tank",
        "create_sa:small_fueling_tank",
        "create_sa:medium_fueling_tank",
        "create_sa:large_fueling_tank"
    ]

    e.add(
        "createdelight:depot_filling_tank_spout_interaction",
        ["create:depot", "create:weighted_ejector"],
        (block, fluid, simulate) => {
            let inventory = block.getInventory()
            if (inventory.isEmpty())
                return 0
            let item = inventory.getAllItems().get(0)
            if (tankId.indexOf(item.id) != -1) {
                item.getOrCreateTag()
                if (item.nbt.isEmpty()) {
                    item.nbt = { tagStock: 0 }
                }
                let nbt = item.nbt
                for (let i = 0; i < 6; i++) {
                    let fluidMultipler = getFuelMultipler(fluid)
                    if (fluidMultipler == 0)
                        return 0
                    let maxAmount = 800 * Math.pow(2, i % 3)
                    let fluidAmount = Math.min(maxAmount - nbt.tagStock, fluid.amount / 10 / fluidMultipler) * 10
                    const { pos, level } = block
                    const { x, y, z } = pos
                    if (fluidAmount > 0 && nbt.tagStock <= maxAmount) {
                        if (item.id == tankId[i] && ((i < 3 && fluid.id == "minecraft:water") || (i >= 3 && fluid.id != "minecraft:water"))) {
                            if (!simulate) {
                                level.server.runCommandSilent(`playsound create:spout block @a[x=${x},y=${y+2},z=${z},distance=..12] ${x} ${y+2} ${z}`)
                                nbt.tagStock = nbt.tagStock + fluidAmount / 10
                            }
                            return fluidAmount * fluidMultipler
                        }
                    }
                }
            }
            if (item.hasTag("create_sa:fillable") || item.hasTag("create_sa:fuelable")) {
                item.getOrCreateTag()
                if (item.hasTag("create_sa:fillable") && fluid.id == "minecraft:water")
                    return fillWater(fluid, simulate, item)
                if (item.hasTag("create_sa:fuelable"))
                    return fillFuel(fluid, simulate, item)
            }
            return 0
        }
    )
    e.add("createdelight:budding_certus_grow_spout_interaction",
        ["ae2:flawless_budding_quartz", "ae2:flawed_budding_quartz", "ae2:chipped_budding_quartz", "ae2:damaged_budding_quartz"],
        (block, fluid, simulate) => {
            if (fluid.id == "createdelight:spent_liquor" && fluid.amount >= 50) {
                if (!simulate) {
                    block.getBlockState().randomTick(block.level, block.pos, block.level.random)
                }
                return 200
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
})