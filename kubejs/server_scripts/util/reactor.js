const $ACEntityRegistry = Java.loadClass("com.github.alexmodguy.alexscaves.server.entity.ACEntityRegistry")

let ReactorUtil = {}

/**
 * 在机器处创造核爆
 * @param {Internal.MBDMachine} machine 
 */
ReactorUtil.Bombbbb = function(machine) {
  let assembly_count = machine.customData.getInt("assembly_count")
  /** @type {Internal.NuclearExplosionEntity} */
  let Bombbbb = $ACEntityRegistry.NUCLEAR_EXPLOSION.get().create(machine.level)
  Bombbbb.setPos(machine.pos.center)
  Bombbbb.setSize(Math.sqrt((assembly_count / 9 + 1)))
  machine.level.addFreshEntity(Bombbbb)
}

/**
 * 计算核反应堆产热
 * @param {Internal.MBDMachine} machine 
 * @returns {number}
 */
ReactorUtil.heatProduced = function (machine) {
  let temp = machine.customData.getDouble("temperature")
  let burning_rate = machine.customData.getDouble("burning_rate")
  let assembly_count = machine.customData.getInt("assembly_count") * burning_rate
  let heatProduced = 0
  const isActive = machine.recipeLogic && machine.recipeLogic.fuelTime > 0
  const controlRodsOut = machine.customData.getDouble("burning_rate") != 0
  if (isActive && controlRodsOut) {
    let tempEfficiency = 1.0 - (temp - 298.15) * TEMP_MULTIPLIER
    heatProduced = BASE_HEAT_RATE * assembly_count * Math.max(0.3, tempEfficiency)
  }
  return heatProduced
}

/**
 * 计算核反应堆液冷散热及损坏度降低
 * @param {Internal.MBDMachine} machine 
 * @returns {number[]} [0]散热，[1]损坏度降低
 */
ReactorUtil.cooling = function(machine) {
  let cooling = 0
  let damageReducecd = 0
  let burning_rate = machine.customData.getDouble("burning_rate")
  let assembly_count = machine.customData.getInt("assembly_count") * burning_rate
  let fluidCap = machine.getCapability(ForgeCapabilities.FLUID_HANDLER).orElse(null)
  if (fluidCap) {
    let coolantEfficiency = 0
    if(machine.machineStateName == "working" && machine.recipeLogic.lastRecipe.getId() != "createdelight:fission_react/empty") {
      let fluid = fluidCap.getFluidInTank(0)
      if (fluid.fluid.getFluidType().toString() == "minecraft:water") coolantEfficiency = 1.0
      else if (fluid.fluid.getFluidType().toString() == "netherexp:ectoplasm") coolantEfficiency = 1.5
      damageReducecd = coolantEfficiency * 0.005 * assembly_count
      cooling = BASE_COOL_RATE * coolantEfficiency * assembly_count * 0.3 
    }
  }
  return [cooling, damageReducecd]
}

/**
 * 计算核反应堆当前须输入流体
 * @param {Internal.MBDMachine} machine 
 * @returns {number}
 */
ReactorUtil.inputFluid = function(machine) {
  let multiplier = machine.customData.getDouble("multiplier")
  let burning_rate = machine.customData.getDouble("burning_rate")
  let assembly_count = machine.customData.getInt("assembly_count") * burning_rate
  const isActive = machine.recipeLogic && machine.recipeLogic.fuelTime > 0
  const controlRodsOut = machine.customData.getDouble("burning_rate") != 0
  let inputFluid = 0
  if (isActive && controlRodsOut) {
    inputFluid = 20 * (multiplier == 0 ? 1 : multiplier) * Math.pow(1.0415, assembly_count)
  }
  return inputFluid
}

/**
 * 计算核反应堆当前须输出流体
 * @param {Internal.MBDMachine} machine 
 * @returns {number}
 */
ReactorUtil.outputFluid = function(machine) {
  let multiplier = machine.customData.getDouble("multiplier")
  let burning_rate = machine.customData.getDouble("burning_rate")
  let assembly_count = machine.customData.getInt("assembly_count") * burning_rate
  const isActive = machine.recipeLogic && machine.recipeLogic.fuelTime > 0
  const controlRodsOut = machine.customData.getDouble("burning_rate") != 0
  let outputFluid = 0
  if (isActive && controlRodsOut) {
    outputFluid = 20 * multiplier * Math.pow(1.0415, assembly_count)
  }
  return outputFluid
}

/**
 * 计算核反应堆当前产出能量
 * @param {Internal.MBDMachine} machine 
 * @returns {number}
 */
ReactorUtil.outputEnergy = function(machine) {
  let multiplier = machine.customData.getDouble("multiplier")
  let burning_rate = machine.customData.getDouble("burning_rate")
  let assembly_count = machine.customData.getInt("assembly_count") * burning_rate
  const isActive = machine.recipeLogic && machine.recipeLogic.fuelTime > 0
  const controlRodsOut = machine.customData.getDouble("burning_rate") != 0
  let outputEnergy = 0
  if (isActive && controlRodsOut) {
    outputEnergy = 40960 * multiplier * Math.pow(1.0415, assembly_count)
  }
  return outputEnergy
}

/**
 * 
 * @param {Internal.MBDMachine} machine 
 * @param {number} power 
 */
ReactorUtil.outputSignal = function(machine, power) {
  machine.setOutputSignal(power, machine.getFrontFacing().get())
  machine.updateSignal()
}