# 开发环境快速开始

本文是人类可读的开发环境入口；agent 执行完整搭建流程时应使用 `.agents/skills/dev-setup/SKILL.md`。

## 适用场景

- 从 GitHub 仓库创建一个可启动的 HMCL 客户端开发实例。
- 修复仓库已克隆但还不能直接启动的本地实例。
- 同步 `mods/`、`resourcepacks/`、`shaderpacks/` 对应的实际文件。

## 前置依赖

- Git。
- Java 17。
- Python 3。
- HMCL 或其他支持本地实例导入的启动器。
- 能访问 CurseForge、GitHub raw 和对应 CDN；海外服务失败时按项目代理规则重试。

## 让 agent 执行

在一个合适的目录启动配置好的 agent，并输入：

```text
参考 https://github.com/Jasons-impart/Create-Delight-Remake/blob/main/GettingStarted.md 搭建整合包开发环境
```

agent 应加载 `dev-setup` skill，并按其中的依赖检查、Packwiz 资产同步、HMCL 图形界面提示和收尾检查执行。

## 人工操作概要

1. 克隆仓库。
   ```powershell
   git clone --depth 1 https://github.com/Jasons-impart/Create-Delight-Remake.git
   cd Create-Delight-Remake
   ```
2. 检查 Java 17、Python 3 和 Git。
3. 运行 `scripts/sync-packwiz-assets.ps1` 同步本地实际 mod、资源包和光影包。
4. 在 HMCL 中创建 Minecraft `1.20.1` + Forge `47.4.10` 实例并开启版本隔离。
5. 将整个仓库目录作为实例目录，保留 `.git/`。
6. 确认实例目录中存在 `kubejs/`、`config/`、`mods/`、`pack.toml` 和实际 `.jar` 文件。

## 后续阅读

- 完整 agent 流程：`.agents/skills/dev-setup/SKILL.md`
- 开发规则、Packwiz 同步和发布入口：`docs/development.md`
- 优化模组与候选模组调研清单：`docs/mod-research.md`
