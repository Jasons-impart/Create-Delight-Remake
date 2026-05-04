// priority: 100
// 设置 mcwifipnp 默认端口为 25565

ServerEvents.loaded(e => {
  const { server } = e;
  const configPath = server.getWorldPath().resolve("mcwifipnp.json");

  // 检查是否已存在配置文件
  if (!JsonIO.exists(configPath)) {
    const defaultConfig = {
      port: 25565,
      maxPlayers: 8,
      GameMode: "survival",
      motd: "Minecraft LAN Server",
      AllPlayersCheats: false,
      Whitelist: false,
      UseUPnP: true,
      AllowCommands: false,
      OnlineMode: true,
      EnableUUIDFixer: false,
      ForceOfflinePlayers: [],
      PvP: true,
      CopyToClipboard: true
    };

    JsonIO.write(configPath, defaultConfig);
    console.log("Created default mcwifipnp.json with port 25565");
  }
});
