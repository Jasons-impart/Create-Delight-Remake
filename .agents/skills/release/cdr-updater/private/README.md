# 私货目录

把要覆盖或追加的文件放进 `files/`，保持游戏实例内的相对路径。程序会自己判断端侧：

- `resourcepacks/`、`shaderpacks/`、`kubejs/client_scripts/` → 客户端
- `kubejs/server_scripts/`、`libraries/`、`server.properties` → 服务端
- 覆盖官方已有文件时，沿用官方端侧
- 其余默认两端都发

不必手写 side。若要强制：放到 `files/client/`、`files/server/` 或 `files/both/` 下。
