MBDMachineEvents.onRightClick("createdelight:modular_diesel_engine", e => {
  /**
   * @type {Internal.MBDMultiblockMachine}
   */
  let player = e.event.player
  let machine = e.event.machine
  let heldItem = e.event.heldItem
  if(heldItem.id == "createdieselgenerators:engine_silencer" && machine.machineStateName != "mute" && machine.machineStateName != "turbo"){
    /**
     * @type {Internal.MBDPartMachine}
     */
    machine.setMachineState("mute")
    /**
     * @type {Internal.Player}
     */
    player.swing()
    if(!player.isCreative()){
      player.mainHandItem.count--
    }
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
    if(!player.isCreative()){
      player.give("createdieselgenerators:engine_silencer")
    }
  }
  if(heldItem.id == "createdieselgenerators:engine_turbocharger" && machine.machineStateName != "mute" && machine.machineStateName != "turbo"){
    /**
     * @type {Internal.MBDPartMachine}
     */
    machine.setMachineState("turbo")
    machine.setMachineLevel(1)
    /**
     * @type {Internal.Player}
     */
    player.swing()
    if(!player.isCreative()){
      player.mainHandItem.count--
    }
  }
  if(heldItem.id == "create:wrench" && machine.machineStateName == "turbo"){
    /**
     * @type {Internal.MBDPartMachine}
     */
    machine.setMachineState("working")
    machine.setMachineLevel(0)
    /**
     * @type {Internal.Player}
     */
    player.swing()
    if(!player.isCreative()){
      player.give("createdieselgenerators:engine_turbocharger")
    }
  }

})
ServerEvents.recipes(e => {
  const {createdelight} = e.recipes
  createdelight.modular_diesel_burning()
    .duration(20)
    .inputFluids(Fluid.of("createdelight:fuel_mixtures", 2))
    .outputRPM(256)
    .outputStress(32768)
    .id("createdelight:modular_diesel_burning/fuel_mixtures")
  createdelight.modular_diesel_burning()
    .duration(20)
    .inputFluids(Fluid.of("createdieselgenerators:biodiesel", 1))
    .outputRPM(96)
    .outputStress(12288)
    .id("createdelight:modular_diesel_burning/biodiesel")
  createdelight.modular_diesel_burning()
    .duration(20)
    .inputFluids(Fluid.of("ad_astra:cryo_fuel", 2))
    .outputRPM(128)
    .outputStress(16384)
    .id("createdelight:modular_diesel_burning/cryo_fuel")
  createdelight.modular_diesel_burning()
    .duration(20)
    .inputFluids(Fluid.of("createdieselgenerators:diesel", 2))
    .outputRPM(128)
    .outputStress(16384)
    .id("createdelight:modular_diesel_burning/diesel")
  createdelight.modular_diesel_burning()
    .duration(20)
    .inputFluids(Fluid.of("createdieselgenerators:ethanol", 1))
    .outputRPM(64)
    .outputStress(8192)
    .id("createdelight:modular_diesel_burning/ethanol")
  createdelight.modular_diesel_burning()
    .duration(20)
    .inputFluids(Fluid.of("createdieselgenerators:gasoline", 1))
    .outputRPM(96)
    .outputStress(12288)
    .id("createdelight:modular_diesel_burning/gasoline")
  createdelight.modular_diesel_burning()
    .duration(20)
    .inputFluids(Fluid.of("createdieselgenerators:plant_oil", 1))
    .outputRPM(32)
    .outputStress(4096)
    .id("createdelight:modular_diesel_burning/plant_oil")
})