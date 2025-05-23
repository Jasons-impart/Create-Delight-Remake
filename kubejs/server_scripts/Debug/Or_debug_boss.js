ItemEvents.rightClicked("createdelight:debug_reload_tool", (event) => {
  const { server, player } = event;
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

ItemEvents.rightClicked("createdelight:debug_info_tool", (event) => {
  const { server, player, target } = event;
  player.swing()
});