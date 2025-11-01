ServerEvents.recipes((event) => {
  event.remove({ mod: "createoreexcavation", type: "createoreexcavation:vein" })
  event.remove({ mod: "createoreexcavation", type: "createoreexcavation:drilling" })
  //主世界金属矿簇
  event.recipes.createoreexcavation
    .vein(
      '{"text": "主世界金属矿簇"}',
      "createdelight:overworld_metal_ore_cluster",
    )
    .placement(64, 8, 114514)
    .biomeWhitelist("minecraft:is_overworld")
    .id("kubejs:overworld_metal_ore_cluster_ore");

  //主世界贵金属矿簇
  event.recipes.createoreexcavation
    .vein(
      '{"text": "主世界贵金属矿簇"}',
      "createdelight:overworld_noble_metal_ore_cluster",
    )
    .placement(128, 16, 721)
    .biomeWhitelist("minecraft:is_overworld")
    .id("kubejs:overworld_noble_metal_ore_cluster_ore");

  //下界矿簇
  event.recipes.createoreexcavation
    .vein('{"text": "下界矿簇"}', "createdelight:nether_ore_cluster")
    .placement(64, 8, 114514)
    .biomeWhitelist("minecraft:is_nether")
    .id("kubejs:nether_ore_cluster");

  //月球矿簇
  event.recipes.createoreexcavation
    .vein('{"text": "月球矿簇"}', "createdelight:moon_ore_cluster")
    .placement(64, 8, 114514)
    .biomeWhitelist("createdelight:is_moon")
    .id("kubejs:moon_ore_cluster_ore");

  //火星矿簇
  event.recipes.createoreexcavation
    .vein('{"text": "火星矿簇"}', "createdelight:mars_ore_cluster")
    .placement(64, 8, 114514)
    .biomeWhitelist("createdelight:is_mars")
    .id("kubejs:mars_ore_cluster_ore");

  //火星宝石矿簇
  event.recipes.createoreexcavation
    .vein('{"text": "火星宝石矿簇"}', "createdelight:mars_gemstone_cluster")
    .placement(128, 16, 721)
    .biomeWhitelist("createdelight:is_mars")
    .id("kubejs:mars_gemstone_cluster_ore");

  //水星矿簇
  event.recipes.createoreexcavation
    .vein('{"text": "水星矿簇"}', "createdelight:mercury_ore_cluster")
    .placement(64, 8, 114514)
    .biomeWhitelist("createdelight:is_mercury")
    .id("kubejs:mercury_ore_cluster_ore");

  //金星矿簇
  event.recipes.createoreexcavation
    .vein('{"text": "金星矿簇"}', "createdelight:venus_ore_cluster")
    .placement(128, 16, 721)
    .biomeWhitelist("createdelight:is_venus")
    .id("kubejs:venus_ore_cluster_ore")
  //霜原星矿簇
  event.recipes.createoreexcavation
    .vein('{"text": "霜原星矿簇"}', "createdelight:glacio_ore_cluster")
    .placement(128, 16, 721)
    .biomeWhitelist("createdelight:is_glacio")
    .id("kubejs:glacio_ore_cluster_ore");
  /**
   * 
   * @param {OutputItem_|OutputItem_[]} output //矿脉产出
   * @param {string} veinId //矿脉id
   * @param {Internal.FluidStackJS} baseFluid //基础流体（必须要用Fluid.xx指定流体量）
   * @param {number} baseStress //基础应力消耗
   * @param {number} baseProcessingTime //基础工作时间
   * @param {number} level //所需润滑油的最低等级（）
   */
  function drilling(output, veinId, baseFluid, baseStress, baseProcessingTime, level) {
    let fluidArr = ["createdelight:ice_lubricating_oil", "createdelight:lubricating_oil", baseFluid]
    let l = fluidArr.length + 1 - level
    let processingTimeMulti = [0.1, 0.2, 1]
    let stressMulti = [0.5, 0.75, 1]
    let fluidAmountMulti = [0.05, 0.1, 1]
    let drill = ["createoreexcavation:netherite_drill", "createoreexcavation:diamond_drill", "createoreexcavation:drill"]
    for (let index = 0; index < l; index++) {
      let fluid = Fluid.of(fluidArr[index], baseFluid.amount * fluidAmountMulti[index]);

      event.recipes.createoreexcavation
        .drilling(
          output,
          veinId,
          baseProcessingTime * processingTimeMulti[index],
        )
        .fluid(fluid)
        .drill(drill[index])
        .stress(baseStress * stressMulti[index])
        .id(`kubejs:${output.split(":")[1]}_using_${fluid.id.split(":")[1]}`)
    }
  }

  drilling("createdelight:overworld_metal_ore_cluster", "kubejs:overworld_metal_ore_cluster_ore", Fluid.water(500), 1024, 8000, 1)
  drilling("createdelight:overworld_noble_metal_ore_cluster", "kubejs:overworld_noble_metal_ore_cluster_ore", Fluid.water(500), 1536, 10000, 1)
  drilling("createdelight:nether_ore_cluster", "kubejs:nether_ore_cluster", Fluid.lava(500), 2048, 12000, 1)
  drilling("createdelight:moon_ore_cluster", "kubejs:moon_ore_cluster_ore", Fluid.of("netherexp:ectoplasm", 500), 1024, 4000, 1)
  drilling("createdelight:mars_ore_cluster", "kubejs:mars_ore_cluster_ore", Fluid.of("netherexp:ectoplasm", 500), 1536, 4000, 2)
  drilling("createdelight:mars_gemstone_cluster", "kubejs:mars_gemstone_cluster_ore", Fluid.of("netherexp:ectoplasm", 500), 2048, 4000, 2)
  drilling("createdelight:mercury_ore_cluster", "kubejs:mercury_ore_cluster_ore", Fluid.lava(1000), 2048, 2000, 3)
  drilling("createdelight:venus_ore_cluster", "kubejs:venus_ore_cluster_ore", Fluid.lava(500), 2048, 8000, 3)
  drilling("createdelight:glacio_ore_cluster", "kubejs:glacio_ore_cluster_ore", Fluid.of("netherexp:ectoplasm", 1000), 2048, 2000, 3)
});
