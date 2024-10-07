BlockEvents.rightClicked("functionalstorage:fluid_1", (event) => {
  const { player, block, item, server } = event;
  // 没写完下次接着写
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
      server.runCommand(
        `say ${block.entityData.getCompound("fluidHandler").getCompound("0").getInt("Amount")}`
      );
    }
  } else {
    return;
  }
});
