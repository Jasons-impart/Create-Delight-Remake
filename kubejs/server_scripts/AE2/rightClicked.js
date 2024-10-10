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
      player.giveInHand(
        Item.of(
          "tetra:modular_single",
          '{Damage:1115,EnchantmentMapping:{"minecraft:unbreaking":"single/head"},HideFlags:1,honing_available:1b,honing_count:2,honing_progress:0,id:"3a008be3-ffae-4c86-b385-6f81ac3e681b",repairCount:2,"single/basic_handle_material":"basic_handle/oak","single/basic_shovel_material":"basic_shovel/diamond","single/binding":"single/binding","single/binding_material":"single_binding/bolt","single/handle":"single/basic_handle","single/handle:settled":1,"single/handle:thick":0,"single/head":"single/basic_shovel","single/head:arrested":0,"single/head:head_hone/durability":2,weapon_attributes:\'{"parent":"bettercombat:staff","attributes":{"attack_range":3.0,"two_handed":true,"category":"staff","attacks":[{"hitbox":"HORIZONTAL_PLANE","damage_multiplier":0.8,"angle":160.0,"upswing":0.5,"animation":"bettercombat:two_handed_slash_horizontal_right","swing_sound":{"id":"bettercombat:staff_slash","volume":1.0,"pitch":1.0,"randomness":0.1}},{"hitbox":"HORIZONTAL_PLANE","damage_multiplier":1.0,"angle":160.0,"upswing":0.5,"animation":"bettercombat:two_handed_slash_horizontal_left","swing_sound":{"id":"bettercombat:staff_slash","volume":1.0,"pitch":1.0,"randomness":0.1}},{"hitbox":"VERTICAL_PLANE","damage_multiplier":1.2,"angle":120.0,"upswing":0.5,"animation":"bettercombat:two_handed_slam","swing_sound":{"id":"bettercombat:staff_slam","volume":1.0,"pitch":1.0,"randomness":0.1}}]}}\'}'
        ).enchant("minecraft:unbreaking", 3)
      );
    }
  } else {
    return;
  }
});
