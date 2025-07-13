let $Boolean = Java.loadClass("java.lang.Boolean")
const inversedDirectionUpper = { "WEST": "EAST", "SOUTH": "NORTH", "NORTH": "SOUTH", "EAST": "WEST", "UP": "DOWN", "DOWN": "UP" }
//右键切换管道开口，shift切换对面
BlockEvents.rightClicked("create:fluid_pipe", event => {
  if (event.item.id != "minecraft:air" || event.hand != "MAIN_HAND") { return }
  let State = event.block.properties
  let BlockStates = event.block.blockState
  let Pos = event.block.pos
  let i1 = 0
  event.entity.swing()
  event.block.level.playSound(null, event.block.x, event.block.y, event.block.z, "minecraft:block.copper.place", "blocks", 0.6, 1.2)
  for (let i of [State.west, State.east, State.south, State.north, State.up, State.down]) {
    if (i == "true") {
      i1++
    }
  }
  let Face = event.facing.toString().toUpperCase()
  if (event.player.shiftKeyDown) {
    Face = inversedDirectionUpper[Face]
  }
  let Bool = BlockStates.getValue(BlockProperties[Face])
  if (i1 <= 2 && Bool) {
    event.player.setStatusMessage(Component.translate("message.createdelight.pipe").color(Color.RED))
    return
  }
  event.level.setBlockAndUpdate(Pos, BlockStates.setValue(BlockProperties[Face], Bool ? $Boolean.FALSE : $Boolean.TRUE))
})
//右键切换管道箱开口，shift切换对面
BlockEvents.rightClicked("create:encased_fluid_pipe", event => {
  if (event.item.id != "minecraft:air" || event.hand != "MAIN_HAND") { return }
  let BlockStates = event.block.blockState
  let Pos = event.block.pos
  //动画和音效
  event.entity.swing()
  event.block.level.playSound(null, event.block.x, event.block.y, event.block.z, "minecraft:block.copper.place", "blocks", 0.6, 1.2)
  //功能实现
  let Face = event.facing.toString().toUpperCase()
  if (event.player.shiftKeyDown) {
    Face = inversedDirectionUpper[Face]
  }
  let Bool = BlockStates.getValue(BlockProperties[Face])
  event.level.setBlockAndUpdate(Pos, BlockStates.setValue(BlockProperties[Face], Bool ? $Boolean.FALSE : $Boolean.TRUE))

})