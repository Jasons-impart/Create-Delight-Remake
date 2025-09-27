// 移除初始水晶无敌避免偶发问题
/*
let crystal_sp = 0;
EntityEvents.spawned("minecraft:end_crystal", (event) => {
  const { entity, server, player } = event;
  if (entity.isInvulnerable()) {
    entity.setInvulnerable(false);
    crystal_sp++;
    if (crystal_sp == 4) {
      server.tell(Text.translate("message.createdelight.first_summon_end_dragon"));
    }
  }
});
*/
