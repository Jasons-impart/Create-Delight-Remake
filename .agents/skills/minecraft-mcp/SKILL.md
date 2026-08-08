---
name: minecraft-mcp
description: 连接、诊断、测试、操作、修复、构建和部署 minecraft-mod-mcp（mcpmod）及其 Forge 1.20.1 模组，并通过运行时帮助探索 FTB Library、KubeJS 等模组指令。用于 CDRdev 中的 MCP 端口冲突、Mod not connected、截图/键鼠/命令调用、玩家或世界数据异常、生产环境反射映射失效、测试 JAR 替换与真实游戏回归。
---

# Minecraft MCP

使用 Minecraft MCP 观察和控制 CDRdev 客户端，并在外部 fork 中维护模组源码。

## 边界

- 把 `D:\game\.minecraft\versions\CDRdev` 仅用于运行验证和 Packwiz 资产管理。
- 把干净源码放在 `D:\learnmod\minecraft-mod-mcp-SSWTLZZ69`；保留已有脏目录 `D:\learnmod\minecraft-mod-mcp`，不要覆盖或清理其中改动。
- 使用上游 `langyo/minecraft-mod-mcp`，fork 为 `SSWTLZZ69/minecraft-mod-mcp`。
- 未经用户明确要求，不创建 PR；可以在用户要求 fork/修复时提交并推送 fork 分支。
- 修改 `mods/`、`packwiz-files/` 或 Packwiz 元数据前，先使用 `/packwiz-assets`。
- 把 `mods/*.jar` 视为本机运行文件；测试替换不能成为 Git 跟踪内容。

## 连接诊断

1. 从可用工具中查找 `mcp__minecraft_mcp__*`。
2. 调用 `get_minecraft_status` 和 `ping`；以 `connected: true` 与 `pong` 判断连接，不要只看 `processAlive`。
3. HMCL 外部启动的 CDRdev 可能显示 `processAlive: false`，这不代表模组断连。
4. 检查模组和日志：

```powershell
Get-ChildItem -LiteralPath mods -Force | Where-Object Name -Match 'minecraft.*mcp|mcp.*minecraft'
rg -n -i 'mcpmod|MCP-MOD|Address already in use' logs\latest.log
```

5. 检查默认端口及占用者：

```powershell
Get-NetTCPConnection -LocalPort 9876 -ErrorAction SilentlyContinue |
  Select-Object State, LocalAddress, LocalPort, OwningProcess
```

6. 不要因为端口冲突直接结束 Blender 或 Minecraft；先确认 PID、进程名和用户当前状态。

## 安全调用

按以下顺序测试，先只读、后可逆控制：

1. 调用 `ping`、`screenshot_to_file`、`get_player_info`、`get_world_info` 和 `debug_fields`。
2. 如果截图仍是 `ProgressScreen`、`LevelLoadingScreen` 或 `ReceivingLevelScreen`，等待进入世界后再判断玩家/世界数据。
3. 检查玩家名、血量、坐标、维度和存档名是否为真实值；空名、0 血量、0 坐标和 `unknown` 表示适配失败。
4. 测试 `pause_game` 后立即调用 `close_screen` 恢复。
5. 测试 `open_chat` 后立即调用 `close_screen` 恢复。
6. 进入控制模式，将视角水平旋转 `+5` 度，再旋转 `-5` 度恢复，最后退出控制模式。
7. 未经用户要求，不移动、使用物品、放置方块、切换模式或执行除开发测试 reload 之外的命令。

当前已知限制：Forge 1.20.1 能识别 `PauseScreen`、`ChatScreen`，但按钮枚举可能仍返回空数组；此时使用截图和坐标点击。

## 建立命令测试证据链

把 MCP 命令返回的 `executed` 只视为“已发送到客户端连接”，不要视为服务端执行成功。

1. 使用唯一的 `/say MCP_<TEST>_BEGIN` 和 `END` 标记测试区间。
2. 按 `setup → action → assert → cleanup → cleanup assert` 拆分步骤；每一步之间短暂等待。
3. 在判断功能结果前，先从 `logs/latest.log` 检查命令解析错误、方块放置反馈和目标是否存在。
4. 第一次探测返回“其他或无结果”时，不要立即判定业务逻辑；先排除命令版本语法、坐标、槽位和执行时序。
5. 优先把结果写入已确认可临时使用的固定槽位，再读取实体 NBT；不要依赖掉落实体位置、自动拾取时序或画面纹理辨认。
6. 修改测试槽位前记录原内容，测试后恢复；不要假定某个槽位永远为空。
7. 同时检查运行时 JAR/数据包资源和游戏内结果，用两条证据区分上游数据、整合包覆盖与全局 Loot Modifier。

Minecraft 1.20.1 的方块掉落确定性测试可使用：

```text
/loot replace entity @s hotbar.8 1 mine <x> <y> <z> minecraft:shears
/data get entity @s Inventory[{Slot:8b}]
/execute if entity @s[nbt={Inventory:[{Slot:8b,id:"<namespace:item>"}]}] run say MCP_RESULT_EXPECTED
```

不要在 `mine <x> <y> <z>` 与工具物品之间加入 `tool` 关键字；1.20.1 会把它解析成物品 ID。完成后清除临时方块/掉落物并用独立标记确认清理成功。

## 发现模组指令

把当前运行实例的 Brigadier 帮助树作为命令语法来源，不要只凭记忆拼接 FTB Library、KubeJS 或其他模组命令。

1. 用 `/help <根指令>` 列出一级子命令，例如 `/help ftblibrary`、`/help kubejs`。
2. 用 `/help <根指令> <子命令>` 递归查看下一层，例如 `/help ftblibrary nbtedit`、`/help kubejs reload`。
3. 在 help 前后加入唯一 `/say` 标记，再从 `logs/latest.log` 提取标记区间；MCP 的命令返回值不包含帮助正文。
4. 把帮助结果视为当前模组版本和当前权限下的事实；升级模组后重新查询，不维护容易过期的完整硬编码列表。
5. 优先使用只读诊断指令，例如查看手持物、背包、错误、标签或注册表；执行 NBT 编辑、阶段修改等有状态命令前说明影响并获得授权；开发测试所需的脚本重载按“执行 reload”一节处理。
6. 区分原版 `/reload` 与细分的 `/kubejs reload <目标>`；先查看帮助，再选择 `config`、各类脚本、纹理或语言资源等具体目标。

当前实例的代表性入口包括：

- FTB Library：游戏模式、天气/昼夜、NBT 编辑、Loot Table 生成和客户端配置。
- KubeJS：手持物/背包检查、错误查询、分类 reload、导出、标签/注册表、Stages、Painter、Typings、Packmode、内部事件和持久数据。

## 执行 reload

按场景判断是否需要用户授权：

- 当 `/reload` 用于当前开发任务的脚本、配方、资源验证或回归测试时，agent 可以主动执行，不需要用户单独授权；执行前在 commentary 简要说明影响。
- 非开发测试场景仅在用户明确要求后执行。

1. 进入控制模式。
2. 调用 `execute_command`，命令为 `/reload`。
3. 立即退出控制模式。
4. 等待 10 秒以上并检查 `logs/latest.log`。
5. 以以下日志为成功证据：

```text
Reloaded with no KubeJS errors!
Server resource reload complete!
```

区分重载成功与附带警告；村民交易转换、JEI 配方输出数和旧进度条目警告不一定阻止 reload。

## 保持文件换行与检查 diff

- Windows 下编辑文本文件时，先保留目标文件已有的 CRLF/LF 格式；不要只把补丁片段写成另一种换行格式，造成混合换行。
- 修改后用 `git diff --patch --unified=0 -- <path>` 确认精确变更行数，再用 `git diff --check` 检查空白错误；若预期只改一行，`git diff --numstat` 应显示 `1 0`。

## 源码修复

1. 从上游 `dev` 创建功能分支，不在 `master` 直接开发。
2. 优先检查：

```text
packages/common/src/main/java/xyz/langyo/minecraft/mcp/common/
packages/mods/1.20.1/forge/src/main/java/xyz/langyo/minecraft/mcp/mod/
```

3. 牢记 Forge 生产环境映射边界：Java 直接方法调用会被 ForgeGradle 重映射，字符串反射名如 `getHealth`、`getX`、`pauseGame` 不会自动重映射。
4. 对 1.20.1 专属失败使用版本模块内的直接 API 适配器，不要继续堆猜测式反射名。
5. 保留 `McpConfig` 的端口 `0` 作为自动发现哨兵；无显式端口时让 `McpHttpServer` 从 `9876` 向下扫描到 `9000`。
6. 用 `javap -c` 检查最终 JAR，确认直接 Minecraft 调用已变成 `m_<数字>_` SRG 方法。

## 构建与部署

在目标模块构建：

```powershell
Set-Location D:\learnmod\minecraft-mod-mcp-SSWTLZZ69\packages\mods\1.20.1\forge
.\gradlew.bat clean build --no-daemon --console=plain
```

- 使用 Java 17 目标工具链和 Forge `47.4.10`。
- 如果出现多个 Gradle Wrapper 争用下载锁，只结束本次启动的重复构建进程；不要修改所有 wrapper URL。
- 构建后检查 `build/libs/`、SHA-256、JAR 内适配器类以及 `git diff --check`。
- 部署前确认 Minecraft 已正常退出。
- 备份旧运行 JAR，再以相同运行文件名复制修复版；复制后核对 SHA-256。
- 检查 CDRdev `git status --short`，不要把已有用户改动归因于本次测试。
- 若要正式纳入整合包，转入 `/packwiz-assets` 的 `packwiz-files` 与元数据流程；不要提交 `mods/*.jar`。

## 回归与交付

至少验证：

- `ping` 返回 `pong`，状态端点报告正确 `version`、`loader` 和端口。
- 玩家和世界数据为真实值。
- 暂停、聊天、截图和可逆视角控制正常。
- 9876 被占用时服务回退到 9875。
- 游戏日志没有新的 MCP 启动异常。

提交时使用有说明正文的开发分支 commit；按用户要求推送 fork。明确报告未修复限制，并再次确认没有意外创建 PR。
