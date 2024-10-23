EntityEvents.spawned((e) => {
  // 苍蝇生成
  if (e.entity.type == "alexsmobs:fly") {
    if (e.level.dimension != "minecraft:overworld") {
      e.cancel();
    }
  }
  // 蜈蚣生成
  if (e.entity.type == "alexsmobs:centipede_head") {
    e.cancel();
  }
  // 轻语灵生成
  if (e.entity.type == "alexsmobs:murmur") {
    e.cancel();
  }
});
