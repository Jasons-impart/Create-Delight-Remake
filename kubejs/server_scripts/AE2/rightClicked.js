BlockEvents.rightClicked("functionalstorage:fluid_1", (event) => {
  const { player, block, item, level } = event;
  if (
    block.id === "functionalstorage:fluid_1" &&
    item.id === "ae2:cell_component_1k" &&
    player.isCrouching()
  ) {
    if (
      block.entityData.getCompound("fluidHandler").getCompound("0").getString("FluidName") ===
        "minecraft:lava" &&
      block.entityData.getCompound("fluidHandler").getCompound("0").getInt("Amount") > 10000000
    ) {
      block.setEntityData({
        fluidHandler: {
          0: {
            Amount:
              block.entityData.getCompound("fluidHandler").getCompound("0").getInt("Amount") -
              10000000,
            FluidName: "minecraft:lava",
          },
        },
      });
      block.entity.setChanged();
      level.destroyBlock(block.pos, true);
      item.count--;
      player.giveInHand(
        Item.of(
          "expatternprovider:infinity_cell",
          '{display:{Lore:[\'{"italic":false,"color":"white","extra":[{"text":""},{"text":"手持 "},{"color":"blue","text":"1k ME存储组件"},{"text":" 对装有大于1万桶熔岩的1x1流体抽屉蹲下右键获取"}],"text":""}\']},record:{"#c":"ae2:f",id:"minecraft:lava"}}'
        )
      );
    }
  } else {
    return;
  }
});
