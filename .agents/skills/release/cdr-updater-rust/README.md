# Create Delight Remake 更新器（Rust 服务器）

这个目录是给整合包用的更新器：`cdr-updater.jar` 是客户端，本目录其余部分是 **Rust** 更新服务器源码。玩家用客户端跟更新服务器同步；更新服务器从 GitHub Release 拉官方 Client / Server 包，再按清单发给客户端和服务端。

使用步骤见 [使用方式.md](使用方式.md)。

## 目录

| 路径 | 作用 |
| --- | --- |
| `cdr-updater.jar` | 客户端界面，以及构建仓库、导出 PCL2、导出服务端 |
| `src/`、`web/`、`Cargo.toml` | Rust 更新服务器源码。编译后负责对外提供清单和文件 |
| `config.toml` | 自己创建，不要提交真实令牌和私货 |
| `private/files/` | 私货，保持游戏内相对路径 |

构建仓库在 Rust 服务器内完成；导出 PCL2 / 服务端仍调用旁边的 `cdr-updater.jar`，所以导出机器需要 **Java 17**。编译本目录需要 **Rust 1.75+**（`cargo`）。不要把 `config.toml`、`data/`、`private/files/` 里的真实内容提交到仓库。
