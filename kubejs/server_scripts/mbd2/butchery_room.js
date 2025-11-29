const $ItemRecipeCapability = Java.loadClass("com.lowdragmc.mbd2.common.capability.recipe.ItemRecipeCapability")
const $MeatHookBlockEntity = Java.loadClass("com.lance5057.butchercraft.workstations.hook.MeatHookBlockEntity")
const $ButcherBlockBlockEntity = Java.loadClass("com.lance5057.butchercraft.workstations.butcherblock.ButcherBlockBlockEntity")

MBDMachineEvents.onTick("createdelight:butchery_room", e => {
  const {machine} = e.event
  let pos = machine.pos
  let facing = machine.getFrontFacing().get()
  /**@type {Internal.MeatHookBlockEntity}*/
  let meatHook = machine.level.getBlockEntity(pos.relative(facing.opposite).above().above().above().relative(DirectionUtil.rotation270Direction(facing)))
  /**@type {Internal.ButcherBlockBlockEntity} */
  let butcherBlock = machine.level.getBlockEntity(pos.relative(facing.opposite).above())
  if(machine.machineStateName != "working") {
    if (machine.level.time % 10 == 0  && (meatHook.insertedItem != [] || butcherBlock.insertedItem != [])) {
      machine.level.playSound(null, machine.pos.x, machine.pos.y, machine.pos.z, "minecraft:block.slime_block.fall", "blocks", 1, 1)
      meatHook.finishRecipe()
      butcherBlock.finishRecipe()
    }
  }
  if(machine.machineStateName == "working") {
    /**@type {String} */
    let itemIds
    machine.recipeLogic.getLastRecipe().getInputContents($ItemRecipeCapability.CAP).forEach(con => {
      itemIds = con.getContent().toJson().get("ingredient").get("item")
    })
    machine.level.tell(itemIds)
    if(Item.of(itemIds).hasTag("butchercraft:big_carcass")) {
      if (machine.level.time % 20 != 0) return
      machine.level.playSound(null, machine.pos.x, machine.pos.y, machine.pos.z, "minecraft:block.slime_block.fall", "blocks", 1, 1)
      if (machine.level.time % 40 != 0) return
      if (meatHook.stage < 5) {
        meatHook.insertItem(Item.of(itemIds))
        meatHook.stage++
      }
    }else{
      if (machine.level.time % 20 != 0) return
      machine.level.playSound(null, machine.pos.x, machine.pos.y, machine.pos.z, "minecraft:block.slime_block.fall", "blocks", 1, 1)
      if (machine.level.time % 40 != 0) return
      if (butcherBlock.stage < 5) {
        butcherBlock.insertItem(Item.of(itemIds))
        butcherBlock.stage++
      }
    }
  }
})
MBDMachineEvents.onRemoved("createdelight:butchery_room", e => {
  const {machine} = e.event
  let pos = machine.pos
  let facing = machine.getFrontFacing().get()
  /**@type {Internal.MeatHookBlockEntity}*/
  let meatHook = machine.level.getBlockEntity(pos.relative(facing.opposite).above().above().above().relative(DirectionUtil.rotation270Direction(facing)))
  /**@type {Internal.ButcherBlockBlockEntity} */
  let butcherBlock = machine.level.getBlockEntity(pos.relative(facing.opposite).above())
  if(meatHook.insertedItem != [] || butcherBlock.insertedItem != []) {
    // meatHook.stage = 3
    meatHook.finishRecipe()
    butcherBlock.finishRecipe()
  }
})
MBDMachineEvents.onRecipeWorking("createdelight:butchery_room", e => {
  const {machine} = e.event
  let pos = machine.pos
  let facing = machine.getFrontFacing().get()
  /**@type {Internal.MeatHookBlockEntity}*/
  let meatHook = machine.level.getBlockEntity(pos.relative(facing.opposite).above().above().above().relative(DirectionUtil.rotation270Direction(facing)))
  /**@type {Internal.ButcherBlockBlockEntity} */
  let butcherBlock = machine.level.getBlockEntity(pos.relative(facing.opposite).above())
  /**@type {String} */
  let itemIds
  if(meatHook.insertedItem == [] && butcherBlock.insertedItem == []) {
    machine.recipeLogic.getLastRecipe().getInputContents($ItemRecipeCapability.CAP).forEach(con => {
      itemIds = con.getContent().toJson().get("ingredient").get("item")
    })
  }
})
