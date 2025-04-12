const $FluidFX = Java.loadClass("com.simibubi.create.content.fluids.FluidFX")
MBDMachineEvents.onRecipeWorking("createdelight:sprinkler", e => {
    let event = e.event
    const { machine } = event
    let hl = 1
    let rl = 25
    let manager = SeasonUtil.getSaveData(machine.level)
    let nearHumidityControlProvider = manager.queryHumidityControlProvider(machine.pos)
    if (nearHumidityControlProvider != null
        && hl == nearHumidityControlProvider.getLevel()
        && rl == nearHumidityControlProvider.getRange()
    ) {
        if (nearHumidityControlProvider.getRemainTime() < 100000) {
            nearHumidityControlProvider.addRemainTime(100);
        }
    } else {
        if (hl != 0)
            manager.addMap(machine.pos, SeasonUtil.createHumidityControlProvider(hl, rl, 500));
    }
    let fluid = machine.getCapability(ForgeCapabilities.FLUID_HANDLER).orElse(null)
    if (fluid) {
        // console.log("hahaha")
        let particle = $FluidFX.getFluidParticle(fluid.getFluidInTank(0).fluid).writeToString()
        let x = 0, z = 0;
        let random = machine.level.random
        let vx = 0, vz = 0
        let y = random.nextDouble() * 2 - 1
        if (random.nextBoolean()) {
            x = (random.nextDouble() + 1) * (random.nextInt(2) * 2 - 1)
            vz = random.nextDouble() * 2 - 1
        }
        else {
            z = (random.nextDouble() + 1) * (random.nextInt(2) * 2 - 1)
            vx = random.nextDouble() * 2 - 1
        }
        let vec = Vec3d.atCenterOf(machine.pos)
            .add([0.0, y * 0.3, 0.0])
            .add([x * 0.3, 0.0, z * 0.3])
        try {
            let level = machine.level
            // console.log(machine.level)
            level.getPlayers().forEach(player => {
                /**@type {Internal.Player} */(player).sendData("spawn_create_particle", {
                particle: particle,
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
            // machine.level.addParticle(particle,
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
    const { machine, } = event
    if (machine.machineStateName == "base") {
        let manager = SeasonUtil.getSaveData(machine.level)
        if (manager != null) {
            manager.removeHumidityControlProvider(machine.pos)
        }
    }
})

MBDMachineEvents.onRemoved("createdelight:sprinkler", e => {
    let event = e.event
    const { machine } = event
    let manager = SeasonUtil.getSaveData(machine.level)
    if (manager != null) {
        manager.removeHumidityControlProvider(machine.pos)
    }
})