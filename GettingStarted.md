# 开发环境快速开始

在一个合适的目录下，启动配置好的 agent（如 Codex）并输入：

```text
参考 https://github.com/Jasons-impart/Create-Delight-Remake/blob/main/GettingStarted.md 搭建整合包开发环境
```

## 前置依赖
- Git，用于克隆仓库和提交变更。
- Java 17，游戏、Forge 服务端和 CDC 模组构建都使用 Java 17。
- Python 3，`scripts/sync-packwiz-assets.ps1` 会用它启动本地静态文件服务。
- 支持 CurseForge 整合包或本地实例导入的启动器，例如 HMCL。
- 能访问 CurseForge、GitHub raw 和对应 CDN；如果网络失败，先配置代理后重试。

## Agent 执行步骤
- 不要在 Codex 自动审批模式下执行本流程；使用会弹出权限请求、允许用户批准联网和文件写入的模式。
- 如果 `git clone`、联网下载或写入工作区因沙箱、代理、权限失败，切换到可手动审批权限请求的模式后重试。
- 如果目标目录已有失败残留，先让用户授权清理该目录，或让用户指定新的空目录。
- 先浅拷贝仓库；必须使用 `--depth 1`，不要普通 `git clone`：
  ```powershell
  git clone --depth 1 https://github.com/Jasons-impart/Create-Delight-Remake.git
  cd Create-Delight-Remake
  ```
- 如果已经普通克隆完成，不要删除重来，继续后续步骤。
- 在仓库根目录执行依赖检查：
  ```powershell
  git --version
  java -version
  python --version
  ```
- 如果 `java -version` 不是 Java 17，但 `JAVA_HOME` 指向 Java 17，可继续；同步脚本会优先读取 `JAVA_HOME`。
- 如果 `java -version` 和 `JAVA_HOME` 都不是 Java 17，修改 `variables.txt` 的 `JAVA=` 为本机 Java 17 的完整路径。
- 下载 HMCL 启动器：
  ```powershell
  Invoke-WebRequest -Uri "https://github.com/HMCL-dev/HMCL/releases/download/v3.13.2/HMCL-3.13.2.jar" -OutFile ".\HMCL.jar"
  ```
- 同步本地开发所需的 mod / 资源包 / 光影包：
  ```powershell
  powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\sync-packwiz-assets.ps1
  ```
- 脚本会自动下载 `packwiz.exe` 和 `packwiz-installer.jar` 到 `.cache/packwiz-sync/tools/`，执行 `packwiz refresh`，并按 `mods/`、`resourcepacks/`、`shaderpacks/` 下的 `*.pw.toml` 同步实际文件。
- 本地开发环境默认按客户端侧同步，只保留 `side = "both"` 和 `side = "client"` 的 mod；`side = "server"` 的服务端专用 mod 不会下载到客户端实例。
- 如果需要调试服务端侧文件，可显式运行 `powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\sync-packwiz-assets.ps1 -Side server`。
- 同步成功后，要求用户按“用户操作步骤”完成 HMCL 图形界面配置。
- 用户完成 HMCL 实例创建后，agent 继续执行“Agent 收尾检查”。

## Agent 给用户的操作提示
- 告诉用户打开 HMCL。
- 告诉用户新建或选择一个实例，实例名可自定。
- 告诉用户安装 Minecraft `1.20.1` 和 Forge `47.4.10`。
- 告诉用户开启版本隔离，并确认实例目录位于 `.minecraft/versions/{实例名}/`。
- 告诉用户完成后回复实例名和实例目录。
- 收到实例目录后，agent 将当前 repo 连同 `.git/` 移动到该实例目录；如果当前 repo 已经在该实例目录中，则直接确认。

## Agent 收尾检查
- 根据用户提供的实例名和实例目录，确认 `{实例名}.json`、`{实例名}.jar`、`pack.toml`、`kubejs/`、`config/`、`mods/` 存在。
- 如果当前 repo 不在实例目录，移动前先确认目标目录是 `.minecraft/versions/{实例名}/`，再移动整个 repo 目录并保留 `.git/`。
- 在实例目录执行：
  ```powershell
  if (-not (Test-Path .\hmclversion.cfg)) { Copy-Item .\.hmclversion.cfg .\hmclversion.cfg }
  if (-not (Test-Path .\options.txt)) { Copy-Item .\.options.txt .\options.txt }
  ```
- 确认 `mods/` 中存在实际 `.jar` 文件；如果只有 `*.pw.toml`，重新运行 `scripts/sync-packwiz-assets.ps1`。
- 检查通过后，告诉用户可以在 HMCL 中启动该实例。

## 用户操作步骤
- 打开 HMCL；如果 agent 下载了 `HMCL.jar`，双击或用 Java 17 启动它。
- 按“把 repo 变成可启动客户端实例”创建或修复实例。
- 在 HMCL 中选择该实例启动游戏。

## 常见阻塞
- `Java 17 was not found`：安装 Java 17，设置 `JAVA_HOME`，或更新 `variables.txt` 的 `JAVA=`。
- `Python was not found`：安装 Python 3，并确保 `python` 或 `py -3` 可用。
- 下载 packwiz、installer 或 CurseForge 文件失败：检查 GitHub / CurseForge / CDN 访问，必要时配置代理后重试。

## 把 repo 变成可启动客户端实例
- 用户在 HMCL 中新建实例，实例名可自定。
- 用户安装 Minecraft `1.20.1` 和 Forge `47.4.10`。
- 用户开启版本隔离，使实例目录位于 `.minecraft/versions/{实例名}/`。
- Agent 或用户将本 repo 目录整体移动到 `.minecraft/versions/{实例名}/`，保留 `.git/`，不要只复制工作区文件。
- 实例目录本身必须成为 Git 仓库根目录，目录形态应为：
  ```text
  .minecraft/
  └── versions/
      └── {实例名}/
          ├── .git/
          ├── {实例名}.json
          ├── {实例名}.jar
          ├── hmclversion.cfg
          ├── options.txt
          ├── config/
          ├── defaultconfigs/
          ├── kubejs/
          ├── mods/
          ├── resourcepacks/
          ├── shaderpacks/
          └── pack.toml
  ```
- 如果 agent 需要搬迁仓库，必须移动整个仓库目录或复制包含 `.git/` 的完整目录；不要排除 `.git/`、不要把仓库内容复制到另一个非仓库实例目录。
- 如果缺少 `{实例名}.json` 或 `{实例名}.jar`，用户回到 HMCL 为该实例重新安装 Minecraft `1.20.1` + Forge `47.4.10`。
- Agent 执行“Agent 收尾检查”。
- 用户在 HMCL 中选择该实例启动。
- 启动失败时，用户提供 `logs/latest.log`，agent 检查 Java 17、Forge 版本、版本隔离和日志错误。

## 后续阅读
- 开发规则、Packwiz 同步和发布入口：`docs/development.md`
- 优化模组与候选模组调研清单：`docs/mod-research.md`
