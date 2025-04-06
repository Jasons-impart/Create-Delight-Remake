// 原代码源自Qi_Month的New Create
// 开发者用户信息
const playerNames = [
  "Qi_Month",
  "hk11238981",
  "nanchuan211",
  "LuJiChi",
  "mi_xiao_bao",
  "LightLeaves",
  "ikoi03",
  "C_Pearl",
  "zhongxiaoli",
  "Maruyama_Ayaa",
  "XinJinIris",
  "cawyyds",
  "SSWTLZZ",
  "JIAFALSEDREAM",
  "AzureCrab"
];

const isDeveloper = (playerUsername) => playerNames.includes(playerUsername);

ItemEvents.rightClicked((event) => {
  const { item, player, server } = event;
  if (player.crouching && player.mainHandItem !== "minecraft:air" && isDeveloper(player.username) && player.mainHandItem !== "createdelight:debug_reload_tool" && player.mainHandItem!== "createdelight:debug_info_tool") {
    if (player.mainHandItem === item.id) {
      player.runCommandSilent("kubejs hand");
    }
  }
});

const handleChatCommand = (event, command, message, target) => {
  const { player, server } = event;
  if (isDeveloper(player.username)) {
    switch (command) {
      case "-kli":
        server.runCommandSilent("kill @e[type=item]");
        server.runCommandSilent(`tellraw ${target} "§4掉落物已清除"`);
        event.cancel();
        break;
      case "-efg":
        player.runCommandSilent("effect give @s minecraft:night_vision infinite 255 true");
        player.runCommandSilent("effect give @s minecraft:strength infinite 255 true");
        player.runCommandSilent("effect give @s minecraft:resistance infinite 255 true");
        player.runCommandSilent(`tellraw @s "§6已获得所有BUFF"`);
        event.cancel();
        break;
      case "-efc":
        player.runCommandSilent("effect clear");
        player.runCommandSilent(`tellraw @s "§4已清除所有BUFF"`);
        event.cancel();
        break;
      //未知原因报错
      // case "-kle":
      //   server.runCommandSilent("kill @e[type=!minecraft:player]");
      //   server.runCommandSilent(`tellraw ${target} "§4所有实体已清除"`);
      //   event.cancel();
      //   break;
    }
  }
};

PlayerEvents.chat((event) => {
  const { player, message, server } = event;
  const trimmedMessage = message.trim().toLowerCase();
  const target = trimmedMessage.startsWith("-kle") ? "@a" : "@s";
  handleChatCommand(event, trimmedMessage, message, target);
});

PlayerEvents.loggedIn((event) => {
  const { player } = event;
  if (isDeveloper(player.username)) {
    player.tell(Text.translate("message.createdelight.debug", [player.username]));
    player.tell(Text.translate("message.createdelight.conventcommand", [player.username]));
  }
});
