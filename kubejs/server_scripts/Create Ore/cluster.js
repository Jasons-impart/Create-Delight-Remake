ServerEvents.recipes((event) => {
  //主世界金属矿簇
  event.recipes.createoreexcavation
    .vein(
      '{"text": "主世界金属矿簇"}',
      "createdelight:overworld_metal_ore_cluster",
    )
    .placement(128, 8, 64825185)
    .id("kubejs:overworld_metal_ore_cluster_ore")
    .biomeWhitelist("minecraft:is_overworld");
  event.recipes.createoreexcavation
    .drilling(
      "createdelight:overworld_metal_ore_cluster",
      "kubejs:overworld_metal_ore_cluster_ore",
      600,
    )
    .id("kubejs:overworld_metal_ore_cluster_ore_drilling");

  //主世界贵金属矿簇
  event.recipes.createoreexcavation
    .vein(
      '{"text": "主世界贵金属矿簇"}',
      "createdelight:overworld_noble_metal_ore_cluster",
    )
    .placement(128, 8, 64825185)
    .id("kubejs:overworld_noble_metal_ore_cluster_ore")
    .biomeWhitelist("minecraft:is_overworld");
  event.recipes.createoreexcavation
    .drilling(
      "createdelight:overworld_noble_metal_ore_cluster",
      "kubejs:overworld_noble_metal_ore_cluster_ore",
      600,
    )
    .id("kubejs:overworld_noble_metal_ore_cluster_ore_drilling")
    .drill("createoreexcavation:netherite_drill");
});
