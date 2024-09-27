
CreateEvents.spoutHandler(e => {
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
        "create:depot",
        (block, fluid, simulate) => {
            let inventory = block.getInventory()
            if (inventory.isEmpty())
                return 0
            let item = inventory.getAllItems().get(0)
            if (tankId.indexOf(item.id) == -1)
                return 0
            if (item.nbt == null || item.nbt == {}) {
                item.nbt = {tagStock: 0}
            }
            let nbt = item.nbt
            for (let i = 0; i < 3; i++) {
                let maxAmount = 800 * Math.pow(2, i)
                let fluidAmount = Math.min(maxAmount - nbt.tagStock, 100) * 10
                console.log(fluidAmount)
                if (fluid.amount >= fluidAmount && nbt.tagStock <= maxAmount) {
                    if ((item.id == tankId[i] && fluid.id == "minecraft:water")) {
                        if (!simulate) {
                            nbt.tagStock = nbt.tagStock + fluidAmount / 10
                        }
                        return fluidAmount
                    }
                    if ((item.id == tankId[i + 3])) {
                        let fluidMultipler = 1
                        if (fluid.id == "minecraft:lava")
                            fluidMultipler = 1
                        else if (fluid.id == "createdieselgenerators:diesel" || fluid.id == "createdieselgenerators:biodiesel")
                            fluidMultipler = 0.5
                        else if (fluid.id == "createdieselgenerators:gasoline")
                            fluidMultipler = 0.4
                        else if (fluid.id == "createdieselgenerators:fluid_mixtures")
                            fluidMultipler = 0.25
                        else
                            return 0
                        if (!simulate) {
                            nbt.tagStock = nbt.tagStock + fluidAmount / 10 / fluidMultipler
                        }
                        return fluidAmount
                    }

                }
            }
            return 0
        }
    )
})