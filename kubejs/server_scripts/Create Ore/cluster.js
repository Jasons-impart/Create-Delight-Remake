ServerEvents.recipes((event) => {
  event.remove({mod: "createoreexcavation", type: "createoreexcavation:vein"})
  event.remove({mod: "createoreexcavation", type: "createoreexcavation:drilling"})
  //主世界金属矿簇
  event.recipes.createoreexcavation
    .vein(
      '{"text": "主世界金属矿簇"}',
      "createdelight:overworld_metal_ore_cluster",
    )
    .placement(64, 8, 114514)
    .biomeWhitelist("minecraft:is_overworld")
    .id("kubejs:overworld_metal_ore_cluster_ore");
  event.recipes.createoreexcavation
    .drilling(
      "createdelight:overworld_metal_ore_cluster",
      "kubejs:overworld_metal_ore_cluster_ore",
      600,
    )
    .stress(512)
    .id("kubejs:overworld_metal_ore_cluster_ore_drilling");

  //主世界贵金属矿簇
  event.recipes.createoreexcavation
    .vein(
      '{"text": "主世界贵金属矿簇"}',
      "createdelight:overworld_noble_metal_ore_cluster",
    )
    .placement(128, 16, 721)
    .biomeWhitelist("minecraft:is_overworld")
    .id("kubejs:overworld_noble_metal_ore_cluster_ore");
  event.recipes.createoreexcavation
    .drilling(
      "createdelight:overworld_noble_metal_ore_cluster",
      "kubejs:overworld_noble_metal_ore_cluster_ore",
      1000,
    )
    .stress(1024)
    .drill("createoreexcavation:diamond_drill")
    .id("kubejs:overworld_noble_metal_ore_cluster_ore_drilling");

  //下界矿簇
  event.recipes.createoreexcavation
    .vein('{"text": "下界矿簇"}', "createdelight:nether_ore_cluster")
    .placement(64, 8, 114514)
    .biomeWhitelist("minecraft:is_nether")
    .id("kubejs:nether_ore_cluster");
  event.recipes.createoreexcavation
    .drilling(
      "createdelight:nether_ore_cluster",
      "kubejs:nether_ore_cluster",
      600,
    )
    .stress(1536)
    .drill("createoreexcavation:netherite_drill")
    .id("kubejs:nether_ore_cluster_drilling");

  //月球矿簇
  event.recipes.createoreexcavation
    .vein('{"text": "月球矿簇"}', "createdelight:moon_ore_cluster")
    .placement(64, 8, 114514)
    .biomeWhitelist("createdelight:is_moon")
    .id("kubejs:moon_ore_cluster_ore");
  event.recipes.createoreexcavation
    .drilling(
      "createdelight:moon_ore_cluster",
      "kubejs:moon_ore_cluster_ore",
      600,
    )
    .stress(1024)
    .id("kubejs:moon_ore_cluster_ore_drilling");

  //火星矿簇
  event.recipes.createoreexcavation
    .vein('{"text": "火星矿簇"}', "createdelight:mars_ore_cluster")
    .placement(64, 8, 114514)
    .biomeWhitelist("createdelight:is_mars")
    .id("kubejs:mars_ore_cluster_ore");
  event.recipes.createoreexcavation
    .drilling(
      "createdelight:mars_ore_cluster",
      "kubejs:mars_ore_cluster_ore",
      600,
    )
    .stress(1024)
    .id("kubejs:mars_ore_cluster_ore_drilling");

  //火星宝石矿簇
  event.recipes.createoreexcavation
    .vein('{"text": "火星宝石矿簇"}', "createdelight:mars_gemstone_cluster")
    .placement(128, 16, 721)
    .biomeWhitelist("createdelight:is_mars")
    .id("kubejs:mars_gemstone_cluster_ore");
  event.recipes.createoreexcavation
    .drilling(
      "createdelight:mars_gemstone_cluster",
      "kubejs:mars_gemstone_cluster_ore",
      1000,
    )
    .stress(1536)
    .drill("createoreexcavation:diamond_drill")
    .id("kubejs:mars_gemstone_cluster")
  
  //水星矿簇
  event.recipes.createoreexcavation
    .vein('{"text": "水星矿簇"}', "createdelight:mercury_ore_cluster")
    .placement(64, 8, 114514)
    .biomeWhitelist("createdelight:is_mercury")
    .id("kubejs:mercury_ore_cluster_ore");
  event.recipes.createoreexcavation
    .drilling(
      "createdelight:mercury_ore_cluster",
      "kubejs:mercury_ore_cluster_ore",
      600,
    )
    .stress(1024)
    .drill("createoreexcavation:diamond_drill")
    .id("kubejs:mercury_ore_cluster_ore_drilling");

  //金星矿簇
  event.recipes.createoreexcavation
    .vein('{"text": "金星矿簇"}', "createdelight:venus_ore_cluster")
    .placement(128, 16, 721)
    .biomeWhitelist("createdelight:is_venus")
    .id("kubejs:venus_ore_cluster_ore")
  event.recipes.createoreexcavation
    .drilling(
      "createdelight:venus_ore_cluster",
      "kubejs:venus_ore_cluster_ore",
      1000,
    )
    .stress(2048)
    .drill("createoreexcavation:netherite_drill")
    .id("kubejs:venus_ore_cluster");
  //霜原星矿簇
  event.recipes.createoreexcavation
   .vein('{"text": "霜原星矿簇"}', "createdelight:glacio_ore_cluster")
   .placement(128, 16, 721)
   .biomeWhitelist("createdelight:is_glacio")
   .id("kubejs:glacio_ore_cluster_ore");
  event.recipes.createoreexcavation
   .drilling(
     "createdelight:glacio_ore_cluster",
     "kubejs:glacio_ore_cluster_ore",
     1000,
   )
   .stress(2048)
   .drill("createoreexcavation:netherite_drill")
   .id("kubejs:glacio_ore_cluster");
 
});
