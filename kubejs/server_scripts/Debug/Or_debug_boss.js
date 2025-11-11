ItemEvents.rightClicked("createdelight:debug_reload_tool", e => {
  const { server, player } = e;
  if (player.isCrouching()) {
    player.swing()
    server.tell("§6[成功]已经重载server脚本（不包括配方）");
    server.runCommand("kubejs reload server_scripts");
  } else {
    player.swing()
    server.tell("§6[成功]已经重载client脚本");
    server.runCommand("kubejs reload server_scripts");
  }
  return;
});

ItemEvents.rightClicked("createdelight:debug_info_tool", e => {
  const { level, player, server } = e;
  if (player.isCrouching()) {
    player.swing()
  } else {
    player.swing()
  }
  return;
});