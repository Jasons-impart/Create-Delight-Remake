# Create Delight Remake 更新器

这个目录是给整合包用的更新器：`cdr-updater.jar` 是客户端，`server/` 是 Go 更新服务器。玩家用客户端跟更新服务器同步；更新服务器从 GitHub Release 拉官方 Client / Server 包，再按清单发给客户端和服务端。

使用步骤见 [使用方式.md](使用方式.md)。

## 目录

| 路径 | 作用 |
| --- | --- |
| `cdr-updater.jar` | 客户端界面，以及构建仓库、导出 PCL2、导出服务端 |
| `server/` | Go 更新服务器源码。编译后负责对外提供清单和文件 |
| `config.toml` | 自己创建，不要提交真实令牌和私货 |
| `private/files/` | 私货，保持游戏内相对路径 |

构建仓库时，Go 服务器会调用旁边的 `cdr-updater.jar`，所以运行更新服务器的机器需要 **Java 17**。编译 `server/` 需要 **Go 1.23**。不要把 `config.toml`、`data/`、`private/files/` 里的真实内容提交到仓库。
