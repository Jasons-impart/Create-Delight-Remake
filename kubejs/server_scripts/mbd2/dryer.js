const $Mth = Java.loadClass("net.minecraft.util.Mth")

MBDMachineEvents.onTick("createdelight:dryer", e => {
    const {machine} = e.event
    const {pos, level} = machine
    if (level.time % 100 != 0) return
    /** @type {Internal.KineticBlockEntity} */
    let be = machine.getMachineHolder()
    let speed = Math.abs(be.speed)
    if (speed <= 8) return
    let manager = SeasonUtil.getSaveData(level)
    let nearHumidityControlProvider = manager.queryHumidityControlProvider(pos)
        if (nearHumidityControlProvider != null) {
        if (nearHumidityControlProvider.getRemainTime() <= 200) {
            nearHumidityControlProvider.addRemainTime(100)
        }
    } else {
        manager.addHumidityControlProvider(pos, SeasonUtil.createHumidityControlProvider(-1, 4, 500))
    }
})

MBDMachineEvents.onRemoved("createdelight:dryer", e => {
    let event = e.event
    const { machine } = event
    const {pos, level} = machine
    let manager = SeasonUtil.getSaveData(level)
    if (manager != null) {
        manager.removeHumidityControlProvider(pos)
    }
})

MBDMachineEvents.onTick("createdelight:dryer", e => {
    const {machine} = e.event
    const {pos, level} = machine
    if (level.time % 60 != 0) return
    /** @type {Internal.KineticBlockEntity} */
    let be = machine.getMachineHolder()
    let speed = Math.abs(be.speed)
    if (speed <= 8) return
    let start = Vec3d.atCenterOf(pos).offsetRandom(level.random, 1)
    let motion = Vec3d.atCenterOf(pos).subtract(start)
        .normalize()
        .scale($Mth.clamp(2, 0, 0.5))
    level.spawnParticles("minecraft:poof", true, start.x(), start.y(), start.z(), motion.x(), motion.y(), motion.z(), 3, 0.2)
})