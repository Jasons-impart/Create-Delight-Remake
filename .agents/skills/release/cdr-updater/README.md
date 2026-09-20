# Create Delight Remake 更新器

点开即用的 Java 17 程序。从 GitHub 拉取官方 **Client** / **Server** zip 后自行区分端侧；私货按路径和官方标记分流。客户端只用 PCL2 可导入的 zip 安装，不改 PCL2。

请用 `启动更新服务器.bat` 启动，不要双击 `cdr-updater.jar`。若系统默认是 Java 8，程序会自动再拉起 Java 17。

本目录是源码。本地 `config.toml`、`data/`、`dist/` 和 `private/files/` 里的真实私货不要提交。

## 本地编译

需要 JDK 17。

```
powershell -NoProfile -ExecutionPolicy Bypass -File .\build.ps1
```

会编译、跑测试，并生成 `dist/cdr-updater.jar`。

## 启动更新服务器

1. 若没有 `config.toml`，双击 `启动更新服务器.bat` 会从 `config.example.toml` 复制一份
2. 按需改 `listen`、`port`、`public_url`、`access_token`，或启动后在本机窗口改
3. 私货放到 `private/files/`，保持游戏内相对路径；示例见 `private.example/`
4. 双击 `启动更新服务器.bat`

首次启动会从 GitHub 拉官方包并构建仓库。关闭本机管理窗口即停止服务。

管理功能：

- 本机窗口：已连接的服务端、私货、连接地址、网页管理、GitHub 版本、导出 PCL2、导出服务端
- 网页：`http://地址:端口/admin`，功能与本机相同，**不含导出**。登录密码在本机窗口「网页管理」设置；未设网页令牌时只能本机打开

只记录连过的游戏服务端，不记录客户端。

## 连接地址

`config.toml` 的 `[server]`，或管理界面「连接地址」：

- `listen`：只给本机用填 `127.0.0.1`，局域网或外网填 `0.0.0.0`
- `port`：默认 `8765`
- `public_url`：客户端/服务端实际去连的地址，外网填 `http://公网IP:8765`
- `access_token`：可选。填写后客户端/服务端同步必须带同一令牌
- `admin_token`：可选。在本机窗口「网页管理」设置。网页登录密码，不能和 `access_token` 相同，也不会写入导出的整合包

可点「开放外网访问」：监听改为 `0.0.0.0`，尝试填公网 IP 并放行 Windows 防火墙。路由器后面还要把外网 TCP `8765` 映射到这台电脑。

改完后重新导出 PCL2 / 服务端。已经装好的实例改 `cdr-updater.toml`：

```
update_server = "http://192.168.1.8:8765"
update_token = "你的令牌"
```

服务端还要改 `user_jvm_args.txt` 里 javaagent 后面的地址。

## 发给别人什么

编译后把 `dist` 拷走即可。

### 客户端（PCL2）

双击 `导出PCL2整合包.bat`，或：

```
java -jar dist/cdr-updater.jar export-pcl2 --config config.toml
```

玩家在 PCL2：**下载 → 整合包 → 安装整合包**。不要改启动器、不要改 `Setup.ini`、不要填「启动前执行命令」。

zip 只打配置、KubeJS、资源包和更新器，不内置模组 jar。有 CurseForge 编号的模组写进 `manifest.json`，安装时由 PCL2 拉取；其余模组第一次开游戏时由更新器补齐。

### 服务端

双击本机窗口「导出服务端」，或：

```
java -jar dist/cdr-updater.jar export-server --config config.toml
```

解压后先开更新服务器。

- Windows：`启动游戏服务端.bat`
- Linux：`sh start.sh`（需要 Java 17；没有 Forge 运行参数时会经 BMCLAPI 安装）

Agent 在 Forge 扫描 mods 之前按文件哈希同步。管理员改过的服务端文件不会覆盖，除非更新服务器上删除了该路径。玩家自己加的客户端文件不会被删。

## 同步规则

两端都按 SHA-256 清单同步，只动更新器管过的路径。

客户端：

- 玩家自己加的模组、资源包等不在清单里的文件不会删
- 官方/私货哈希变了会覆盖
- 已有 `options.txt`、`config/`、`saves/`、截图等受保护路径不覆盖、不删除
- 缺的配置会写入默认值

服务端：

- 第一次同步时已经存在的文件会留下
- 管理员改过的模组、脚本、配置会留下；没改过的官方文件会更新
- 更新器管过的路径若在服务器上删掉，本地也会删
- 管理员额外加的模组、世界、`eula.txt`、`server.properties`、`ops.json` 不会动
- 缺失的托管文件会补回

只记录连过的游戏服务端，不记录客户端。

## 端侧规则

GitHub：

- 只在 Client zip → 客户端
- 只在 Server zip → 按 packwiz `side` 或路径规则（模组默认两端，libraries 只在服务端）
- 两端都有 → 各用各的内容
- 资源包/光影：服务端包没有时，按 Client zip 和 packwiz 为客户端补拉

私货：

- `resourcepacks/`、`shaderpacks/`、`kubejs/client_scripts/` → 客户端
- `kubejs/server_scripts/`、`libraries/` → 服务端
- 覆盖官方同名文件时沿用官方端侧
- 其余默认两端
- 需要强制时放到 `files/client/`、`files/server/` 或 `files/both/`
