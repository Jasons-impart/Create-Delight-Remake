const $MBDKineticMachineBlockEntity = Java.loadClass("com.lowdragmc.mbd2.integration.create.machine.MBDKineticMachineBlockEntity")

MBDMachineEvents.onStructureFormed("createdelight:hydropower_station", e => {
  const{machine} = e.event
  /** @type {Internal.MBDMultiblockMachine} */
  let multiblock = machine
  let fan_poses = []
  multiblock.parts.forEach(part => {
    let fan_pos = [part.pos.x, part.pos.y, part.pos.z]
    fan_poses.push(fan_pos)
    /** @type {Internal.MBDKineticMachineBlockEntity} */
    let fan = part.machineHolder
    fan.scheduleWorkingRPM(-32, false)
  })
  machine.customData.putInt("fan_count", fan_poses.length)
  for(let i = 0; i <= fan_poses.length-1; i++) {
    machine.customData.putIntArray(`fan_pos_${i}`, fan_poses[i])
  }
})

MBDMachineEvents.onStructureInvalid("createdelight:hydropower_station", e => {
  const{machine} = e.event
  const{level,customData} = machine
  let fan_count = customData.getInt("fan_count")
  for(let i = 0; i <= fan_count; i++){
    let intArray = customData.getIntArray(`fan_pos_${i}`)
    /** @type {Internal.MBDKineticMachineBlockEntity} */
    let fan = level.getBlockEntity([intArray[0], intArray[1], intArray[2]])
    try {
      fan.stopWorking()
    } catch (error) {}
  }
})
