MBDMachineEvents.onRightClick("createdelight:modular_diesel_engine", e => {
  /**
   * @type {Internal.MBDMultiblockMachine}
   */
  let player = e.event.player
  let machine = e.event.machine
  let heldItem = e.event.heldItem
  if(heldItem.id == "createdieselgenerators:engine_silencer" && machine.machineStateName != "mute"){
    /**
     * @type {Internal.MBDPartMachine}
     */
    machine.setMachineState("mute")
    /**
     * @type {Internal.Player}
     */
    player.swing()
    player.mainHandItem.count--
  }
  if(heldItem.id == "create:wrench" && machine.machineStateName == "mute"){
    /**
     * @type {Internal.MBDPartMachine}
     */
    machine.setMachineState("working")
    /**
     * @type {Internal.Player}
     */
    player.swing()
    player.give("createdieselgenerators:engine_silencer")
  }
})