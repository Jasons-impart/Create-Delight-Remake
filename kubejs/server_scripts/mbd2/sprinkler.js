
MBDMachineEvents.onRecipeWorking("createdelight:sprinkler", e => {
    let event = e.event
    const { machine } = event
    const {customData, level} = machine
    if (customData.getIntArray("solidBlockPos") != null) {
        let array = customData.getIntArray("solidBlockPos")
        customData.putIntArray("oldSolidBlockPos", [array[0], array[1], array[2]])
    }

    let tmpSolidBlockPos = machine.pos
    while (level.getBlock(tmpSolidBlockPos.below()).getBlockState().isAir())
        tmpSolidBlockPos = tmpSolidBlockPos.below()
    customData.putIntArray("solidBlockPos", [tmpSolidBlockPos.x, tmpSolidBlockPos.y, tmpSolidBlockPos.z])
    let hl = 1
    let rl = 4
    let rawOldSolidBlockPos = customData.getIntArray("oldSolidBlockPos")
    let rawSolidBlockPos = customData.getIntArray("solidBlockPos")
    let solidBlockPos = [rawSolidBlockPos[0], rawSolidBlockPos[1], rawSolidBlockPos[2]]
    let oldSolidBlockPos = [rawOldSolidBlockPos[0], rawOldSolidBlockPos[1], rawOldSolidBlockPos[2]]
    let manager = SeasonUtil.getSaveData(level)
    if (oldSolidBlockPos != null && (oldSolidBlockPos[0] != solidBlockPos[0] || oldSolidBlockPos[1] != solidBlockPos[1] || oldSolidBlockPos[2] != solidBlockPos[2])) {
            manager.removeHumidityControlProvider(oldSolidBlockPos)
    }
    let nearHumidityControlProvider = manager.queryHumidityControlProvider(solidBlockPos)
    if (nearHumidityControlProvider != null
        && hl == nearHumidityControlProvider.getLevel()

        && rl == nearHumidityControlProvider.getRange()
    ) {
        if (nearHumidityControlProvider.getRemainTime() < 100000) {
            nearHumidityControlProvider.addRemainTime(100)
        }
    } else {
        if (hl != 0)
            manager.addHumidityControlProvider(solidBlockPos, SeasonUtil.createHumidityControlProvider(hl, rl, 500))
    }
    let fluid = machine.getCapability(ForgeCapabilities.FLUID_HANDLER).orElse(null)
    if (fluid) {
        // console.log("hahaha")
        let x = 0, z = 0;
        let random = level.random
        let vx = 0, vz = 0
        let y = random.nextDouble() - 1
        if (random.nextBoolean()) {
            x = (random.nextDouble() + 1) * (random.nextInt(2) * 2 - 1)
            vz = random.nextDouble() * 2 - 1
        }
        else {
            z = (random.nextDouble() + 1) * (random.nextInt(2) * 2 - 1)
            vx = random.nextDouble() * 2 - 1
        }
        let vec = Vec3d.atCenterOf(machine.pos)
            .add([0.0, y * 0.3 - 0.1, 0.0])
            .add([x * 0.3, 0.0, z * 0.3])
        try {
            // console.log(level)

            level.getPlayers().forEach(player => {
                /**@type {Internal.Player} */(player).sendData("spawn_create_particle", {
                fluid: Fluid.of(fluid.getFluidInTank(0).fluid).getId(),
                x: vec.x(),
                y: vec.y(),
                z: vec.z(),
                vx: (x + vx) * 0.2,
                vy: y * 0.7,
                vz: (z + vz) * 0.2,
                count: 1,
                speed: 0.5
            })
            })
            // level.spawnParticles(particle, false,
            //         vec.x(), vec.y(), vec.z(),
            //         x * 0.2, -0.1, z * 0.2, 1, 0.5)
            // level.addParticle(particle,
            //     vec.x(), vec.y(), vec.z(),
            //     x * 0.2, -0.1, z * 0.2)
        } catch (error) {
            console.log(error)
            console.log("wtfisgoingon")
        }
    }
})
MBDMachineEvents.onTick("createdelight:sprinkler", e => {
    let event = e.event
    const { machine} = event
    const {customData, level} = machine
    let rawOldSolidBlockPos = customData.getIntArray("oldSolidBlockPos")
    let rawSolidBlockPos = customData.getIntArray("solidBlockPos")
    let solidBlockPos = [rawSolidBlockPos[0], rawSolidBlockPos[1], rawSolidBlockPos[2]]
    let oldSolidBlockPos = [rawOldSolidBlockPos[0], rawOldSolidBlockPos[1], rawOldSolidBlockPos[2]]
    if (machine.machineStateName == "base") {
        let manager = SeasonUtil.getSaveData(level)
        if (manager != null) {
            manager.removeHumidityControlProvider(oldSolidBlockPos)
            manager.removeHumidityControlProvider(solidBlockPos)
        }
    }
})

MBDMachineEvents.onRemoved("createdelight:sprinkler", e => {
    let event = e.event
    const { machine } = event
    const {customData, level} = machine
    let rawOldSolidBlockPos = customData.getIntArray("oldSolidBlockPos")
    let rawSolidBlockPos = customData.getIntArray("solidBlockPos")
    let solidBlockPos = [rawSolidBlockPos[0], rawSolidBlockPos[1], rawSolidBlockPos[2]]
    let oldSolidBlockPos = [rawOldSolidBlockPos[0], rawOldSolidBlockPos[1], rawOldSolidBlockPos[2]]
    let manager = SeasonUtil.getSaveData(level)
    if (manager != null) {
        manager.removeHumidityControlProvider(oldSolidBlockPos)
        manager.removeHumidityControlProvider(solidBlockPos)
    }
})