ServerEvents.recipes((e) => {
  remove_recipes_id(e, [
    "silentsdelight:cutting/sculk_sensor_tendril_roll_slice",
    "silentsdelight:cutting/minced_warden_heart",
    "silentsdelight:cutting/sculk_sensor_tendril",
  ]);
  // 增加配方：强化深板岩
  e.shaped("4x minecraft:reinforced_deepslate", ["ABA", "BCB", "ABA"], {
    A: "minecraft:ancient_debris",
    B: "minecraft:deepslate",
    C: "minecraft:nether_star",
  });

  cutting_3(e, "silentsdelight:warden_ear", [
    ["silentsdelight:cut_warden_ear", 2],
    ["minecraft:bone_meal"],
  ]);
  cutting_3(e, "silentsdelight:sculk_sensor_tendril_roll", [["silentsdelight:sculk_sensor_tendril_roll_slice", 3]]);
  cutting_3(e, "silentsdelight:warden_heart", [["silentsdelight:minced_warden_heart", 2]]);
  cutting_3(e, "minecraft:sculk_sensor", [["silentsdelight:sculk_sensor_tendril", 4]]);
  cutting_3(e, "silentsdelight:sculk_catalyst_pie", [["silentsdelight:sculk_catalyst_pie_slice", 4]]);
});
