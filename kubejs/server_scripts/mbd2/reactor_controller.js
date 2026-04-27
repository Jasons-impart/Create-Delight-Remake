const $IMultiPart = Java.loadClass('com.lowdragmc.mbd2.api.machine.IMultiPart');
const $BlockStateProperties = Java.loadClass('net.minecraft.world.level.block.state.properties.BlockStateProperties')
//自动化逻辑
  //初始化customData
MBDMachineEvents.onPlaced("createdelight:fission_reactor_controller", e => {
  const { machine } = e.event
  if (!machine.customData.getInt("state")) {
    machine.customData.putInt("state", 0)
  }
  if (!machine.customData.getInt("last_signal")) {
    let facing = machine.level.getBlockState(machine.pos).getValue($BlockStateProperties.HORIZONTAL_FACING)
    let blockPos = machine.pos.relative(facing)
    let blcokState = machine.level.getBlockState(blockPos)
    machine.customData.putInt("last_signal", blcokState.getSignal(machine.level, blockPos, facing))
  }
})
  //UI实现
MBDMachineEvents.onUI("createdelight:fission_reactor_controller", e => {
  const { machine, root } = e.event
  /**@type {SwitchWidget} */
  let button_0 = root.getFirstWidgetById("off")
  /**@type {SwitchWidget} */
  let button_1 = root.getFirstWidgetById("on")
  /**@type {SwitchWidget} */
  let button_2 = root.getFirstWidgetById("high_temp")
  /**@type {SwitchWidget} */
  let button_3 = root.getFirstWidgetById("output_fluid_choke")
  /**@type {SwitchWidget} */
  let button_4 = root.getFirstWidgetById("output_energy_choke")
  /**@type {SwitchWidget} */
  let button_5 = root.getFirstWidgetById("lack_of_fuel")
  const buttons = [button_0, button_1, button_2, button_3, button_4, button_5]

  let state = machine.customData.getInt("state")
  buttons[state].setPressed(true)
  let buttons_rs = buttons.filter(btn => btn != buttons[state])
  buttons_rs.forEach(btn_rs => {
    btn_rs.setPressed(false)
  })

  buttons.forEach((btn) => {
    btn.setOnPressCallback(p => {
      if (!p.isRemote) {
        if (btn.pressed) {
          buttons.forEach(b => b.setPressed(false))
          machine.customData.putInt("state", buttons.indexOf(btn))
        }
        if (!btn.pressed) {
          btn.setPressed(true)
        }
      }
      return
    })
  })
})
MBDMachineEvents.onTick("createdelight:fission_reactor_controller", e => {
  const {machine} = e.event
  if (machine.level.time % 3 != 0) return
  let state = machine.customData.getInt("state")
  if(machine.getMachineStateName() == "base" || state == 0) {
    ReactorUtil.outputSignal(machine, 0)
    return
  }
  /**
   * @type {Internal.MBDMultiblockMachine}
   */
  let controller = e.event.machine.controllers.get(0)
  switch(state) {
    case 1 : {
      ReactorUtil.outputSignal(machine, 0)
      let facing = machine.level.getBlockState(machine.pos).getValue($BlockStateProperties.HORIZONTAL_FACING)
      let blockPos = machine.pos.relative(facing)
      let blockState = machine.level.getBlockState(blockPos)
      let currentSignal = blockState.getSignal(machine.level, blockPos, facing)
      let lastSignal = machine.customData.getInt("last_signal")
      // T 触发：仅在上升沿(0 -> >0)时切换一次
      if (currentSignal > 0 && lastSignal == 0) {
        let br = controller.customData.getDouble("burning_rate")
        controller.customData.putDouble("burning_rate", br == 0 ? 1 : 0)
      }
      // 记录本次信号用于下一 Tick 边沿检测
      machine.customData.putInt("last_signal", currentSignal)
      break
    }
    case 2 :
      if(controller.customData.getDouble("temperature") >= 1500) {
        ReactorUtil.outputSignal(machine, 15)
      } else {
        ReactorUtil.outputSignal(machine, 0)
      }
      break
    case 3 :
      let fluid = controller.getCapability(ForgeCapabilities.FLUID_HANDLER).orElse(null)
      let maxFluidOutput = ReactorUtil.outputFluid(controller)
      if(fluid.getFluidInTank(1).amount + maxFluidOutput >= fluid.getTankCapacity(1)) {
        ReactorUtil.outputSignal(machine, 15)
      } else {
        ReactorUtil.outputSignal(machine, 0)
      }
      break
    case 4 :
      let energy = controller.getCapability(ForgeCapabilities.ENERGY).orElse(null)
      let maxEnergyOutput = ReactorUtil.outputEnergy(controller)
      if(energy.getEnergyStored() + maxEnergyOutput >= energy.getMaxEnergyStored()) {
        ReactorUtil.outputSignal(machine, 15)
      } else {
        ReactorUtil.outputSignal(machine, 0)
      }
      break
    case 5 :
      let item = controller.getCapability(ForgeCapabilities.ITEM_HANDLER).orElse(null)
      if(item.getStackInSlot(0).count == 0) {
        ReactorUtil.outputSignal(machine, 15)
      } else {
        ReactorUtil.outputSignal(machine, 0)
      }
      break
  }
})
