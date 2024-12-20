BlockEvents.rightClicked("functionalstorage:fluid_1", e => {
  // 手持1k ME存储组件蹲下右击获取
  const { player, block, item, level } = e;
  if (block.id === "functionalstorage:fluid_1" && item.id === "ae2:cell_component_1k" && player.isCrouching()) {
    if (block.entityData.getCompound("fluidHandler").getCompound("0").getString("FluidName") === "minecraft:lava" &&
      block.entityData.getCompound("fluidHandler").getCompound("0").getInt("Amount") > 10000000
    ) {
      block.setEntityData(
      {
        fluidHandler: {0: {Amount:
          block.entityData.getCompound("fluidHandler").getCompound("0").getInt("Amount") - 10000000,
          FluidName: "minecraft:lava"
        }}
      }
      );
      block.entity.setChanged()
      level.destroyBlock(block.pos, true)
      item.count--
      player.giveInHand(Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:f",id:"minecraft:lava"}}'))
    }
  }
  return
})
