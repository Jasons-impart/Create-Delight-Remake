MBDMachineEvents.onPlaced("createdelight:sprinkler", e => {
    const { machine } = e.event
    const {customData, level} = machine
    let solidBlockPosY = SeasonUtil.belowSolidBlockY(level, machine.pos, 10)
    customData.putInt("solidBlockPosY", solidBlockPosY)
})

MBDMachineEvents.onTick("createdelight:sprinkler", e => {
    const { machine } = e.event
    const {customData, level} = machine
    if (level.time % 100 != 0) return
    let manager = SeasonUtil.getSaveData(level)
    if (machine.machineStateName == "working") {
        let solidBlockPosY = customData.getInt("solidBlockPosY")
        let solidBlockPos = [machine.pos.x, solidBlockPosY, machine.pos.z]
        let nearHumidityControlProvider = manager.queryHumidityControlProvider(solidBlockPos)
        if (nearHumidityControlProvider != null) {
            if(nearHumidityControlProvider.getRemainTime <= 200) {
                nearHumidityControlProvider.addRemainTime(100)
            }
        } else {
            manager.addHumidityControlProvider(solidBlockPos, SeasonUtil.createHumidityControlProvider(1, 4, 500))
        }
    }
    if (machine.machineStateName == "base") {
        if (manager != null) {
            let solidBlockPosY = customData.getInt("solidBlockPosY")
            let solidBlockPos = [machine.pos.x, solidBlockPosY, machine.pos.z]
            manager.removeHumidityControlProvider(solidBlockPos)
        }
    }
})

MBDMachineEvents.onRemoved("createdelight:sprinkler", e => {
    const { machine } = e.event
    const {customData, level} = machine
    let manager = SeasonUtil.getSaveData(level)
    if (manager != null) {
        let solidBlockPosY = customData.getInt("solidBlockPosY")
        let solidBlockPos = [machine.pos.x, solidBlockPosY, machine.pos.z]
        manager.removeHumidityControlProvider(solidBlockPos)
    }
})
MBDMachineEvents.onRecipeWorking("createdelight:sprinkler", e => {
    const { machine } = e.event
    const {level} = machine
    if (level.time % 40 != 0) return
    let fluid = machine.getCapability(ForgeCapabilities.FLUID_HANDLER).orElse(null)
    if (fluid) {
        let vec = Vec3d.atCenterOf(machine.pos)
            .add([0.0, -0.6, 0.0])
        // let aabb = AABB.ofSize(vec, 32, 32, 32) // 半径约 32 格
        level.spawnParticles(
            "minecraft:falling_water", true,
            vec.x(), vec.y(), vec.z(),
            Math.random() * 0.5, Math.random() * -0.5, Math.random() * 0.5,
            20, 0.1
        )
        // level.getPlayers().forEach(player => {$FluidFX.getFluidParticle(Fluid.of("minecraft:water").fluidStack)
        //     if (aabb.contains(player.position())) {
        //         player.sendData("spawn_create_particle", {
        //             fluid: "minecraft:water",
        //             x: vec.x(),
        //             y: vec.y(),
        //             z: vec.z(),
        //             vx: Math.random() * 0.5,
        //             vy: Math.random() * -0.5,
        //             vz: Math.random() * 0.5,
        //             count: 20,
        //             speed: 0.1
        //         })
        //     }
        // })
    }
})
