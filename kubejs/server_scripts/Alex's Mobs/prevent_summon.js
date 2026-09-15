EntityEvents.spawned((e) => {
  // 苍蝇生成
  if (e.entity.type == "alexsmobs:fly") {
    if (e.level.dimension != "minecraft:overworld") {
      e.cancel();
    }
  }
});
