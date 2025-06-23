let $Boolean = Java.loadClass("java.lang.Boolean")
const inversedDirection = {west: "east",south: "north",north: "south",east: "west",up: "down",down: "up"}
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
  let Face=event.facing
  if (event.player.shiftKeyDown){
    Face=inversedDirection[Face]
  }
  switch (Face) {
    case "east":
      if (State.east == "true") {
        if (i1 <= 2) {
          event.player.setStatusMessage(Component.translate("message.createdelight.pipe").color(Color.RED))
          return
        }
        event.level.setBlockAndUpdate(Pos, BlockStates.setValue(BlockProperties.EAST, $Boolean.FALSE))
        return
      }
      event.level.setBlockAndUpdate(Pos, BlockStates.setValue(BlockProperties.EAST, $Boolean.TRUE))
      return
    case "west":
      if (State.west == "true") {
        if (i1 <= 2) {
          event.player.setStatusMessage(Component.translate("message.createdelight.pipe").color(Color.RED))
          return
        }
        event.level.setBlockAndUpdate(Pos, BlockStates.setValue(BlockProperties.WEST, $Boolean.FALSE))
        return
      }
      event.level.setBlockAndUpdate(Pos, BlockStates.setValue(BlockProperties.WEST, $Boolean.TRUE))
      return
    case "south":
      if (State.south == "true") {
        if (i1 <= 2) {
          event.player.setStatusMessage(Component.translate("message.createdelight.pipe").color(Color.RED))
          return
        }
        event.level.setBlockAndUpdate(Pos, BlockStates.setValue(BlockProperties.SOUTH, $Boolean.FALSE))
        return
      }
      event.level.setBlockAndUpdate(Pos, BlockStates.setValue(BlockProperties.SOUTH, $Boolean.TRUE))
      return
    case "north":
      if (State.north == "true") {
        if (i1 <= 2) {
          event.player.setStatusMessage(Component.translate("message.createdelight.pipe").color(Color.RED))
          return
        }
        event.level.setBlockAndUpdate(Pos, BlockStates.setValue(BlockProperties.NORTH, $Boolean.FALSE))
        return
      }
      event.level.setBlockAndUpdate(Pos, BlockStates.setValue(BlockProperties.NORTH, $Boolean.TRUE))
      return
    case "up":
      if (State.up == "true") {
        if (i1 <= 2) {
          event.player.setStatusMessage(Component.translate("message.createdelight.pipe").color(Color.RED))
          return
        }
        event.level.setBlockAndUpdate(Pos, BlockStates.setValue(BlockProperties.UP, $Boolean.FALSE))
        return
      }
      event.level.setBlockAndUpdate(Pos, BlockStates.setValue(BlockProperties.UP, $Boolean.TRUE))
      return
    case "down":
      if (State.down == "true") {
        if (i1 <= 2) {
          event.player.setStatusMessage(Component.translate("message.createdelight.pipe").color(Color.RED))
          return
        }
        event.level.setBlockAndUpdate(Pos, BlockStates.setValue(BlockProperties.DOWN, $Boolean.FALSE))
        return
      }
      event.level.setBlockAndUpdate(Pos, BlockStates.setValue(BlockProperties.DOWN, $Boolean.TRUE))
      return
  }
})
BlockEvents.rightClicked("create:encased_fluid_pipe", event => {
  if (event.item.id != "minecraft:air" || event.hand != "MAIN_HAND") { return }
  let State = event.block.properties
  let BlockStates = event.block.blockState
  let Pos = event.block.pos
  event.entity.swing()
  event.block.level.playSound(null, event.block.x, event.block.y, event.block.z, "minecraft:block.copper.place", "blocks", 0.6, 1.2)
  let Face=event.facing
  if (event.player.shiftKeyDown){
    Face=inversedDirection[Face]
  }
  switch (Face) {
    case "east":
      if (State.east == "true") {
        event.level.setBlockAndUpdate(Pos, BlockStates.setValue(BlockProperties.EAST, $Boolean.FALSE))
        return
      }
      event.level.setBlockAndUpdate(Pos, BlockStates.setValue(BlockProperties.EAST, $Boolean.TRUE))
      return
    case "west":
      if (State.west == "true") {
        event.level.setBlockAndUpdate(Pos, BlockStates.setValue(BlockProperties.WEST, $Boolean.FALSE))
        return
      }
      event.level.setBlockAndUpdate(Pos, BlockStates.setValue(BlockProperties.WEST, $Boolean.TRUE))
      return
    case "south":
      if (State.south == "true") {
        event.level.setBlockAndUpdate(Pos, BlockStates.setValue(BlockProperties.SOUTH, $Boolean.FALSE))
        return
      }
      event.level.setBlockAndUpdate(Pos, BlockStates.setValue(BlockProperties.SOUTH, $Boolean.TRUE))
      return
    case "north":
      if (State.north == "true") {
        event.level.setBlockAndUpdate(Pos, BlockStates.setValue(BlockProperties.NORTH, $Boolean.FALSE))
        return
      }
      event.level.setBlockAndUpdate(Pos, BlockStates.setValue(BlockProperties.NORTH, $Boolean.TRUE))
      return
    case "up":
      if (State.up == "true") {
        event.level.setBlockAndUpdate(Pos, BlockStates.setValue(BlockProperties.UP, $Boolean.FALSE))
        return
      }
      event.level.setBlockAndUpdate(Pos, BlockStates.setValue(BlockProperties.UP, $Boolean.TRUE))
      return
    case "down":
      if (State.down == "true") {
        event.level.setBlockAndUpdate(Pos, BlockStates.setValue(BlockProperties.DOWN, $Boolean.FALSE))
        return
      }
      event.level.setBlockAndUpdate(Pos, BlockStates.setValue(BlockProperties.DOWN, $Boolean.TRUE))
      return
  }
})
