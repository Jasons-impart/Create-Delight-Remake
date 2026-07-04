---
name: dev-setup
description: 搭建或修复 Create-Delight Remake 本地开发环境。用于从仓库创建可启动 HMCL 客户端实例、同步 Packwiz 资产、检查 Java/Python/Git 依赖、处理版本隔离目录，以及指导用户完成 HMCL 图形界面步骤。
---

# 开发环境搭建

本 skill 用于把仓库变成可启动的 HMCL 客户端开发实例。流程涉及联网下载、写入工作区和可能移动仓库目录；不要在无法请求用户批准的自动审批模式下执行。

## 前置依赖

- Git：克隆仓库和提交变更。
- Java 17：游戏、Forge 服务端和 CDC 模组构建都使用 Java 17。
- Python 3：`scripts/sync-packwiz-assets.ps1` 会用它启动本地静态文件服务。
- HMCL 或其他支持本地实例导入的启动器。
- 能访问 CurseForge、GitHub raw 和对应 CDN；海外服务超时后按项目代理规则重试。

## Agent 执行流程

1. 如果目标目录已有失败残留，先让用户授权清理该目录，或让用户指定新的空目录。
2. 优先浅克隆仓库；必须使用 `--depth 1`，不要普通 `git clone`。
   ```powershell
   git clone --depth 1 https://github.com/Jasons-impart/Create-Delight-Remake.git
   cd Create-Delight-Remake
   ```
3. 如果已经普通克隆完成，不要删除重来，继续后续步骤。
4. 在仓库根目录检查依赖。
   ```powershell
   git --version
   java -version
   python --version
   ```
5. 如果 `java -version` 不是 Java 17，但 `JAVA_HOME` 指向 Java 17，可继续；同步脚本会优先读取 `JAVA_HOME`。
6. 如果 `java -version` 和 `JAVA_HOME` 都不是 Java 17，修改 `variables.txt` 的 `JAVA=` 为本机 Java 17 完整路径。
7. 下载 HMCL 启动器。
   ```powershell
   Invoke-WebRequest -Uri "https://github.com/HMCL-dev/HMCL/releases/download/v3.13.2/HMCL-3.13.2.jar" -OutFile ".\HMCL.jar"
   ```
8. 同步本地开发需要的 mod、资源包和光影包。
   ```powershell
   pwsh -NoLogo -NoProfile -ExecutionPolicy Bypass -File .\scripts\sync-packwiz-assets.ps1
   ```
9. 同步成功后，让用户完成 HMCL 图形界面步骤。
10. 用户回复实例名和实例目录后，执行收尾检查。

## 提示用户操作

- 打开 HMCL；如果 agent 下载了 `HMCL.jar`，用 Java 17 启动它。
- 新建或选择一个实例，实例名可自定。
- 安装 Minecraft `1.20.1` 和 Forge `47.4.10`。
- 开启版本隔离，确认实例目录位于 `.minecraft/versions/{实例名}/`。
- 完成后回复实例名和实例目录。

## 收尾检查

1. 确认实例目录中存在 `{实例名}.json`、`{实例名}.jar`、`pack.toml`、`kubejs/`、`config/`、`mods/`。
2. 如果当前 repo 不在实例目录，移动前先确认目标目录是 `.minecraft/versions/{实例名}/`，再移动整个 repo 目录并保留 `.git/`。
3. 在实例目录补齐 HMCL 和默认选项文件。
   ```powershell
   if (-not (Test-Path .\hmclversion.cfg)) { Copy-Item .\.hmclversion.cfg .\hmclversion.cfg }
   if (-not (Test-Path .\options.txt)) { Copy-Item .\.options.txt .\options.txt }
   ```
4. 确认 `mods/` 中存在实际 `.jar` 文件；如果只有 `*.pw.toml`，重新运行 `scripts/sync-packwiz-assets.ps1`。
5. 检查通过后，告诉用户可以在 HMCL 中启动该实例。

## 常见阻塞

- `Java 17 was not found`：安装 Java 17，设置 `JAVA_HOME`，或更新 `variables.txt` 的 `JAVA=`。
- `Python was not found`：安装 Python 3，并确保 `python` 或 `py -3` 可用。
- 下载 packwiz、installer 或 CurseForge 文件失败：检查 GitHub、CurseForge、CDN 访问，必要时配置代理后重试。
- 缺少 `{实例名}.json` 或 `{实例名}.jar`：回到 HMCL 为该实例重新安装 Minecraft `1.20.1` + Forge `47.4.10`。
- 启动失败：让用户提供 `logs/latest.log`，检查 Java 17、Forge 版本、版本隔离和日志错误。
