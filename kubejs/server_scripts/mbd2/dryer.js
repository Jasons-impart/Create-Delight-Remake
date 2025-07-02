MBDMachineEvents.onTick("createdelight:dryer", e => {
    let event = e.event
    const {machine} = event
    const {pos, level} = machine
    let hl = -1
    let rl = 0
    /**
     * @type {Internal.KineticBlockEntity}
     */
    let be = machine.getMachineHolder()
    let s = Math.abs(be.speed)
    if (s == 0)
        return
    // 0 <= s <= 16 范围为2，<= 64为4，<= 256为8
    if (s <= 16)
        rl = 2
    else if (s <= 64)
        rl = 4
    else
        rl = 8
    let manager = SeasonUtil.getSaveData(level)
    let nearHumidityControlProvider = manager.queryHumidityControlProvider(pos)
        if (nearHumidityControlProvider != null
        && hl == nearHumidityControlProvider.getLevel()

        && rl == nearHumidityControlProvider.getRange()
    ) {
        if (nearHumidityControlProvider.getRemainTime() < 100000) {
            nearHumidityControlProvider.addRemainTime(100)
        }
    } else {
        if (hl != 0)
            manager.addHumidityControlProvider(pos, SeasonUtil.createHumidityControlProvider(hl, rl, 500))
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