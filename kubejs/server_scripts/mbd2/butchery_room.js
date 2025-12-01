const $ItemRecipeCapability = Java.loadClass("com.lowdragmc.mbd2.common.capability.recipe.ItemRecipeCapability")
const $MeatHookBlockEntity = Java.loadClass("com.lance5057.butchercraft.workstations.hook.MeatHookBlockEntity")
const $ButcherBlockBlockEntity = Java.loadClass("com.lance5057.butchercraft.workstations.butcherblock.ButcherBlockBlockEntity")

function cleanString(str) {
  return String(str)
    .trim() // 移除空白
    .replace(/^["']+/, '') // 移除开头的引号和单引号
    .replace(/["']+$/, '') // 移除结尾的引号和单引号
    .replace(/[^\w:]+$/, ''); // 移除末尾的任何非单词字符（除了冒号）
}

let carcass_data = [
  ["butchercraft:pig_carcass", 5],
  ["butchercraft:cow_carcass", 6],
  ["butchercraft:sheep_carcass", 4],
  ["butchercraft:goat_carcass", 4],
  ["butchercraft:white_rabbit_carcass", 4],
  ["butchercraft:black_rabbit_carcass", 4],
  ["butchercraft:brown_rabbit_carcass", 4],
  ["butchercraft:splotched_rabbit_carcass", 4],
  ["butchercraft:gold_rabbit_carcass", 4],
  ["butchercraft:salt_rabbit_carcass", 4],
  ["butchercraft:cow_head_item", 0],
  ["butchercraft:sheep_head_item", 0],
  ["butchercraft:pig_head_item", 0],
  ["butchercraft:goat_head_item", 0],
  ["butchercraft:chicken_head_item", 0],
  ["butchercraft:rabbit_brown_head_item", 0],
  ["butchercraft:rabbit_gold_head_item", 0],
  ["butchercraft:rabbit_salt_head_item", 0],
  ["butchercraft:rabbit_splotched_head_item", 0],
  ["butchercraft:rabbit_white_head_item", 0],
  ["butchercraft:rabbit_black_head_item", 0],
  ["butchercraft:chicken_carcass", 0]
]
MBDMachineEvents.onTick("createdelight:butchery_room", e => {
  const {machine} = e.event
  if (machine.level.time % 20 != 0) return
  let pos = machine.pos
  let facing = machine.getFrontFacing().get()
  /**@type {Internal.MeatHookBlockEntity}*/
  let meatHook = machine.level.getBlockEntity(pos.relative(facing.opposite).above().above().above().relative(DirectionUtil.rotation270Direction(facing)))
  /**@type {Internal.ButcherBlockBlockEntity} */
  let butcherBlock = machine.level.getBlockEntity(pos.relative(facing.opposite).above())
  if(machine.machineStateName != "working") {
    if (meatHook.insertedItem != [] || butcherBlock.insertedItem != []) {
      machine.level.playSound(null, machine.pos.x, machine.pos.y, machine.pos.z, "minecraft:block.slime_block.fall", "blocks", 1, 1)
      meatHook.finishRecipe()
      butcherBlock.finishRecipe()
    }
  }
  if(machine.machineStateName == "working") {
    /**@type {String} */
    let itemIds
    machine.recipeLogic.getLastRecipe().getInputContents($ItemRecipeCapability.CAP).forEach(con => {
      itemIds = cleanString(con.getContent().toJson().get("ingredient").get("item"))
    })
    let maxStage = carcass_data[carcass_data.findIndex(data => data[0] == itemIds)][1]
    if(Item.of(itemIds).hasTag("butchercraft:big_carcass")) {
      if(meatHook.insertedItem == []){
        meatHook.insertItem(Item.of(itemIds))
        meatHook.stage = 0
      }
      if(meatHook.insertedItem.id != itemIds || (meatHook.stage == maxStage && meatHook.insertedItem.id == itemIds)){
        meatHook.finishRecipe()
        meatHook.insertItem(Item.of(itemIds))
        meatHook.stage = 0
      }
      machine.level.playSound(null, machine.pos.x, machine.pos.y, machine.pos.z, "minecraft:block.slime_block.fall", "blocks", 1, 1)
      if (machine.level.time % 40 != 0) return
      if (meatHook.stage <= maxStage - 1) {
        meatHook.insertItem(Item.of(itemIds))
        meatHook.stage++
      }
    }else{
      if(butcherBlock.insertedItem == []){
        butcherBlock.insertItem(Item.of(itemIds))
        butcherBlock.stage = 0
      }
      if(butcherBlock.insertedItem.id != itemIds || (butcherBlock.stage == maxStage && butcherBlock.insertedItem.id == itemIds)){
        butcherBlock.finishRecipe()
        butcherBlock.insertItem(Item.of(itemIds))
        butcherBlock.stage = 0
      }
      machine.level.playSound(null, machine.pos.x, machine.pos.y, machine.pos.z, "minecraft:block.slime_block.fall", "blocks", 1, 1)
      if (machine.level.time % 40 != 0) return
      if (butcherBlock.stage < maxStage - 1) {
        butcherBlock.insertItem(Item.of(itemIds))
        butcherBlock.stage++
      }
      if(itemIds == "butchercraft:chicken_carcass" && butcherBlock.stage < 5) {
        butcherBlock.insertItem(Item.of(itemIds))
        butcherBlock.stage = butcherBlock.stage + 4
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
