MBDMachineEvents.onRightClick("createdelight:diesel_engine", e => {
  let player = e.event.player
  let machine = e.event.machine
  let heldItem = e.event.heldItem

  if(heldItem.id == "createdieselgenerators:engine_silencer" && machine.machineStateName != "mute" && machine.machineStateName != "turbo" && machine.machineStateName != "turbo_mute"){
    machine.setMachineState("mute")
    player.swing()
    if(!player.isCreative()){
      player.mainHandItem.count--
    }
  }

  if(heldItem == "createdieselgenerators:engine_silencer" && (machine.machineStateName == "turbo" || machine.machineStateName == "turbo_mute")){
    machine.setMachineState("mute")
    machine.setMachineLevel(0)
    player.swing()
    if(!player.isCreative()){
      player.mainHandItem.count--
      player.give("createdieselgenerators:engine_turbocharger")
    }
  }

  if(heldItem.id == "create:wrench" && machine.machineStateName == "mute"){
    machine.setMachineState("base")
    player.swing()
    if(!player.isCreative()){
      player.give("createdieselgenerators:engine_silencer")
    }
  }

  if(heldItem.id == "createdieselgenerators:engine_turbocharger" && machine.machineStateName != "mute" && machine.machineStateName != "turbo" && machine.machineStateName != "turbo_mute"){
    if(machine.onWorking()){
      machine.setMachineState("turbo")
    }else{
      machine.setMachineState("turbo_mute")
    }
    machine.setMachineLevel(1)
    player.swing()
    if(!player.isCreative()){
      player.mainHandItem.count--
    }
  }

  if(heldItem == "createdieselgenerators:engine_turbocharger" && machine.machineStateName == "mute"){
    if(machine.onWorking()){
      machine.setMachineState("turbo")
    }else{
      machine.setMachineState("turbo_mute")
    }
    machine.setMachineLevel(1)
    player.swing()
    if(!player.isCreative()){
      player.mainHandItem.count--
      player.give("createdieselgenerators:engine_silencer")
    }
  }

  if(heldItem.id == "create:wrench" && (machine.machineStateName == "turbo" || machine.machineStateName == "turbo_mute")){
    machine.setMachineState("base")
    machine.setMachineLevel(0)
    player.swing()
    if(!player.isCreative()){
      player.give("createdieselgenerators:engine_turbocharger")
    }
  }
})

MBDMachineEvents.onBeforeRecipeWorking("createdelight:diesel_engine", e => {
  let machine = e.event.machine
  if(machine.machineStateName == "base"){
    machine.setMachineState("working")
  }
  if(machine.machineStateName == "turbo_mute"){
    machine.setMachineState("turbo")
  }
})

ServerEvents.recipes(e => {
  const {createdelight} = e.recipes
  createdelight.diesel_burning()
    .duration(20)
    .inputFluids(Fluid.of("createdelight:fuel_mixtures", 2))
    .outputRPM(256)
    .outputStress(25600)
    .id("createdelight:diesel_burning/fuel_mixtures")
  createdelight.diesel_burning()
    .duration(20)
    .inputFluids(Fluid.of("createdieselgenerators:biodiesel", 1))
    .outputRPM(96)
    .outputStress(9600)
    .id("createdelight:diesel_burning/biodiesel")
  createdelight.diesel_burning()
    .duration(20)
    .inputFluids(Fluid.of("ad_astra:cryo_fuel", 2))
    .outputRPM(192)
    .outputStress(19200)
    .id("createdelight:diesel_burning/cryo_fuel")
  createdelight.diesel_burning()
    .duration(20)
    .inputFluids(Fluid.of("createdieselgenerators:diesel", 2))
    .outputRPM(128)
    .outputStress(12800)
    .id("createdelight:diesel_burning/diesel")
  createdelight.diesel_burning()
    .duration(20)
    .inputFluids(Fluid.of("createdieselgenerators:ethanol", 1))
    .outputRPM(64)
    .outputStress(6400)
    .id("createdelight:diesel_burning/ethanol")
  createdelight.diesel_burning()
    .duration(20)
    .inputFluids(Fluid.of("createdieselgenerators:gasoline", 1))
    .outputRPM(96)
    .outputStress(9600)
    .id("createdelight:diesel_burning/gasoline")
  createdelight.diesel_burning()
    .duration(20)
    .inputFluids(Fluid.of("createdieselgenerators:plant_oil", 1))
    .outputRPM(32)
    .outputStress(3200)
    .id("createdelight:diesel_burning/plant_oil")    
})