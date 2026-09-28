# 私货目录

把要覆盖或追加的文件放进 `files/`，保持游戏实例内的相对路径。程序会自己判断端侧：

- `resourcepacks/`、`shaderpacks/`、`kubejs/client_scripts/` → 客户端
- `kubejs/server_scripts/`、`libraries/`、`server.properties` → 服务端
- 覆盖官方已有文件时，沿用官方端侧
- 其余默认两端都发

不必手写 side。若要强制：放到 `files/client/`、`files/server/` 或 `files/both/` 下。

## 官方包调整

在管理页「官方包」里按分类排除官方文件；规则写入同目录的 `official-adjust.toml`：

```toml
[[exclude]]
path = "mods/SomeMod.jar"
side = "both"   # both / client / server
```

有同名私货时私货优先保留。保存后重新构建仓库才会生效。
