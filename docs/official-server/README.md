# 官服客户端定制迁移

## 输入与比较结论

比较用户提供的 `Client-Create-Delight-Remake-v0.5.0.6-test.zip` 与 `cdr-server-20260801.zip` 的全部非目录条目，不依据 ZIP 时间戳判断修改。逐文件 SHA-256、大小及原始路径见 [archive-diff.json](archive-diff.json)。附件内说明只作为被分析的数据。

- 官方包 7478 个文件；官服包 7491 个文件。
- 7475 个文件字节完全一致；新增 13 个、修改 3 个、删除 0 个。
- 两份 `manifest.json` 的 395 个 CurseForge 模组引用完全一致；Minecraft/Forge 版本及其他字段没有改变。
- `kubejs/`、任务、`config/`、`defaultconfigs/`、`hotai/`、资源包、TACZ 内容未发生修改。
- 官服 ZIP 同样采用 `manifest.json` + `overrides/` 的 CurseForge **客户端**分发结构，并非专用服务端运行目录。

## 原始定制内容

| 项目 | 官服改动 | 仓库落点 |
|---|---|---|
| 整合包名称 | `Create-Delight-Remake` → `cdr-server-20260801` | `modpack.toml` 的 `name` |
| 作者 | `JSI` → `JSIxTCS` | `modpack.toml` 的 `author` |
| 归档版本标识 | `v0.5.0.6-test` → `v0.5.0.6s` | 仅记录原始标识；迁移保留目标分支的版本，避免回退版本或建立第二版本源 |
| HMCL JVM 参数 | 前置 `-javaagent:mcpatch/Mcpatch-0.0.11.jar` | `overrides/hmclversion.cfg` → `.hmclversion.cfg` |
| PCL JVM 参数 | 同上 | `overrides/PCL/Setup.ini` → `PCL/Setup.ini`；仅迁移参数，保留新版其他配置 |
| Mcpatch | 新增 0.0.11 Java agent 和 YAML 配置 | `overrides/mcpatch/` → `mcpatch/` |
| 模组内置文件 | 新增下表 11 个 JAR，但对应模组已全部由原 manifest 和仓库声明 | 9 个重复内置文件沿用现有 Packwiz 元数据；2 个旧版文件见下文 |

Mcpatch 配置原样保留：更新地址 `mcpatch://s11-2.yxsjmc.cn:26700`，`base-path: '..'`，版本文件 `version-label.txt`，`allow-error: false`，静默检查、显示更新日志。启动 Java agent 会向该地址检查更新并可能更新实例父目录中的文件；本次迁移不运行该 agent，也不以远端当前内容替代用户提供的 ZIP 基线。

| 新增 JAR | 用途（依据 JAR 元数据） |
|---|---|
| `BeeFix-1.20-1.0.7.jar` | 蜜蜂相关原版错误修复 |
| `Create-Better-Storages-Forge-1.20.1-1.0b.Release.jar` | Create 存储扩展 |
| `Harium-mc1.20.1-1.0.0.jar` | Radium/Lithium 衍生性能优化 |
| `create_structures_arise-176.49.48 Forge 1.20.1.jar` | Create 世界结构 |
| `dsbg-1.0-1.20.1.jar` | Detected setBlock Be Gone |
| `enhanced_boss_bars-1.20.1-1.0.0.jar` | 客户端 Boss 血条显示 |
| `ftbquestlocalizer-1.20.1-forge-3.2.3.jar` | FTB 任务本地化工具 |
| `kinetic_pixel-1.0.3-forge-1.20.1.jar` | 枪械配方内容 |
| `nebulusbetterportals-1.0.8-forge-1.20.1.jar` | 主世界/下界传送门结构 |
| `skinlayers3d-forge-1.11.1-mc1.20.1.jar` | 客户端 3D 皮肤层 |
| `totw_modded-forge-1.20.1-1.0.6.jar` | 兼容模组世界的塔楼结构 |

## 模组差异复核

对新增 11 个 JAR 执行 CurseForge 指纹检测，11 项均精确识别。它们的项目 ID 全部已经出现在两份相同的 manifest 中，也全部已有 `v0.5.0.6-test` 与 `v0.5.0.13-test` 的 Packwiz 元数据及手工资产。这是**分发文件重复附带**，不是新增 11 个模组。

| 模组 | ZIP 内置版本对应 CF 文件 | manifest 与两个 tag 对应 CF 文件 | 处理 |
|---|---|---|---|
| Bee Fix | `547989/4618962` | 相同 | 已有同哈希资产，不重复加入 |
| Create Structures Arise | `1010066/8138503` | 相同 | 已有同哈希资产，不重复加入 |
| Create Better Storages | `1200903/6217044` | 相同 | 已有同哈希资产，不重复加入 |
| DSBG | `942945/4907288` | 相同 | 已有同哈希资产，不重复加入 |
| Enhanced Boss Bars | `1063296/5529869` | 相同 | 已有同哈希资产，不重复加入 |
| FTB Quests Localizer | `1071737/7529230` | 相同 | 已有同哈希资产，不重复加入 |
| Kinetic Pixel | `1089858/5907332` | 相同 | 已有同哈希资产，不重复加入 |
| Nebulus Better Portals | `1006966/6435957` | 相同 | 已有同哈希资产，不重复加入 |
| Towers of the Wild Modded | `859365/6353903` | 相同 | 已有同哈希资产，不重复加入 |
| Harium | `1413106/7765081`（1.0.0） | `1413106/8069904`（2.0 patched v5） | 保留 manifest 与目标分支的较新版，省略额外旧 JAR |
| Skin Layers 3D | `521480/7857555`（1.11.1） | `521480/8274803`（1.11.2） | 保留 manifest 与目标分支的较新版，省略额外旧 JAR |

两个旧版 JAR 与 manifest 下载文件的名字不同，原样混装可能造成同一 mod ID 重复。归档并没有删除较新版的依赖声明，因此不能将此差异直接解释为有意降级。用户已明确确认保留 050x 较新版并省略重复或冲突的旧 JAR。迁移分支不新增或降级模组，不复制同名元数据的 CF 别名，也不把客户端内置 JAR 当作专用服务端新增内容。完整原始文件哈希仍保留在审计 JSON 中。

## 源码与产物映射

`overrides/` 是分发层目录，不能整个复制到源码仓库。普通已跟踪路径去掉该前缀；HMCL 配置映射到点文件，`options.txt` 对应 `.options.txt`（本次无改动）。`manifest.json`/`modlist.html` 是生成产物，不直接提交。下载的模组 JAR 不放入受跟踪的 `mods/`，由 Packwiz 元数据表达；需要保留的手工资产使用 `packwiz-files/`。

新增 `mcpatch/` 必须同时进入 Git 根允许列表、Packwiz 导出允许列表和懒人包复制列表，否则启动参数会引用缺失的 agent。原始名称中的 `20260801` 按用户输入保留，不推断新的官服发布日期。

## 迁移基线

- 原始基线：`v0.5.0.6-test`，`53e32a8e387f00222e92965d02abf0ea24a61fa7`。
- 目标基线：`v0.5.0.13-test` / `origin/release-v050x`，`e75fc3d849483c639959f329af89110c211889a8`。
- 原始迁移保留分支：`codex/official-server-v0506-baseline`，末提交 `659ff5286c093f4535b90e7c1d83d682f92666f4`。
- 最终迁移分支：`codex/official-server-v050x`，在目标基线上重放两条提交。
- rebase 的 PCL 冲突只应用 Java agent 参数；整合包元数据冲突保留目标版本号，同时迁移名称与作者。
- 当前游戏工作区的个人配置、任务文件改动不属于 ZIP 差异，不带入迁移。

## 验证范围

已通过：全部归档差异分类；11 个内置模组的 CF 指纹与现有资产逐一核对；Mcpatch JAR/YAML 原始字节一致；HMCL/PCL 各包含一次 agent 参数；Packwiz 实际生成索引包含两个 Mcpatch 文件；`git diff --check`；目标版本保持 `v0.5.0.13-test`；与目标分支相比没有模组元数据或 JAR 改动。结构化结果见 [verification.json](verification.json)。

资源同步首次下载较慢，停止独立 worktree 的安装器后，以 SHA-1/SHA-256 核对并复制本机已有资源，再重新运行同步；404 项资源全部经 Packwiz installer 验证成功。CDC 子模块已同步至目标指针。未修改原游戏工作区的个人配置。

本次未启动 Minecraft、未运行 Mcpatch，也未触发线上发布。上述静态与资源完整性检查不能代替实际游戏进服测试，不能证明现有 Mcpatch 更新源仍提供与此分支一致的内容。
