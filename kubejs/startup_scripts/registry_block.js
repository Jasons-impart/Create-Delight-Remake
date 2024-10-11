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
    .resistance(10)
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
});
