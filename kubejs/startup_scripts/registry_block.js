StartupEvents.registry("block", (e) => {
  // 富集陨石
  e.create("createdelight:enriched_sky_stone_block")
    .translationKey("block.createdelight.enriched_sky_stone_block")
    .soundType("stone")
    .hardness(10)
    .resistance(10)
    .tagBlock(`minecraft:mineable/pickaxe`)
    .tagBlock(`minecraft:needs_iron_tool`)
    .requiresTool(true);

  // 铁外壳
  e.create("createdelight:iron_casing")
    .translationKey("block.createdelight.iron_casing")
    .soundType("metal")
    .hardness(10)
    .resistance(10)
    .tagBlock(`minecraft:mineable/pickaxe`)
    .tagBlock(`minecraft:needs_iron_tool`)
    .requiresTool(true);

  // 空间外壳
  e.create("createdelight:space_casing")
    .translationKey("block.createdelight.space_casing")
    .soundType("metal")
    .hardness(100)
    .resistance(100)
    .tagBlock(`minecraft:mineable/pickaxe`)
    .tagBlock(`minecraft:needs_iron_tool`)
    .tagBlock("minecraft:wither_immune")
    .tagBlock("minecraft:dragon_immune")
    .requiresTool(true);

  // 陨铁外壳
  e.create("createdelight:sky_steel_casing")
    .translationKey("block.createdelight.sky_steel_casing")
    .soundType("metal")
    .hardness(30)
    .resistance(10)
    .tagBlock(`minecraft:mineable/pickaxe`)
    .tagBlock(`minecraft:needs_iron_tool`)
    .tagBlock("minecraft:wither_immune")
    .tagBlock("minecraft:dragon_immune")
    .requiresTool(true);
  // 动物.zip
  let zip = [
    "cow",
    "sheep",
    "pig",
    "chicken",
    "goat",
    "black_rabbit",
    "brown_rabbit",
    "splotched_rabbit",
    "gold_rabbit",
    "white_rabbit",
  ];
  zip.forEach((n) => {
    e.create(`createdelight:${n}_zip`)
      .model("createdelight:block/zip")
      .translationKey(`block.createdelight.${n}_zip`)
      .soundType("powder_snow")
      .hardness(10)
      .resistance(10)
      .tagBlock(`minecraft:mineable/pickaxe`)
      .tagBlock(`minecraft:needs_iron_tool`)
      .requiresTool(false);
  });
  // 边界碎片
  e.create("createdelight:fragment_of_border")
    .model("ftbquests:block/barrier")
    .defaultTranslucent()
    .suffocating(true)
    .noDrops()
    .fullBlock(false)
    .lightLevel(15)
    .hardness(400)
    .resistance(100)
    .translationKey("block.createdelight.fragment_of_border")
    .soundType("metal")
    .tagBlock(`minecraft:mineable/pickaxe`)
    .tagBlock(`minecraft:needs_iron_tool`);

    
  // 打包弹药
  e.create("createdelight:packaged_ammo")
  .soundType("metal")
  .requiresTool(false)
  .translationKey("block.createdelight.packaged_ammo");

  // 线圈
  e.create("createdelight:coil")
    .translationKey("block.createdelight.coil")
    .soundType("metal")
    .hardness(10)
    .resistance(10)
    .tagBlock(`minecraft:mineable/pickaxe`)
    .tagBlock(`minecraft:needs_iron_tool`)
    .requiresTool(true);


    
  e.create("createdelight:forged_steel_block")
      .soundType("metal")
      .hardness(7)
      .resistance(7)
      .tag("minecraft:mineable/pickaxe")
      .tag("minecraft:needs_iron_tool")
      .translationKey("block.createdelight.forged_steel_block")
      .requiresTool(true)
});
