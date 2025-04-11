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
})

MBDMachineEvents.onRemoved("createdelight:sprinkler", e => {
    let event = e.event
    const { machine } = event
    let manager = SeasonUtil.getSaveData(machine.level)
    if (manager != null) {
        manager.removeHumidityControlProvider(machine.pos)
    }

})