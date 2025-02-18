ServerEvents.recipes((e) => {
  // 增加配方：强化深板岩
  e.shaped("4x minecraft:reinforced_deepslate", ["ABA", "BCB", "ABA"], {
    A: "minecraft:ancient_debris",
    B: "minecraft:deepslate",
    C: "minecraft:nether_star",
  });
});
