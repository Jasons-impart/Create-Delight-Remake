# 开发指南

## KubeJS 相关开发文档链接
- https://docs.qq.com/doc/DWVVpeGFrSE1sSGpj
- https://docs.mihono.cn/zh/modpack/kubejs/1.20.1/Introduction/Description

## 代码规范

### 代码格式（并非要求强制遵循，能做到代码可读性较高即可）
- 文件结尾处留一个空行。
- 缩进使用 4 个空格。
- 每个独立语句后必须换行。
- 链式函数调用中，每个函数应占至少一行。
- 无特别需求时，字符串使用双引号包裹。
- 函数和变量使用驼峰命名法。常量使用大写字母命名，下划线分割单词。类使用帕斯卡命名法。
- 使用 let 和 const 声明变量和常量，不要使用 var。

### 代码内容
- ResourceLocation 中严禁包含大写字母和其他无效字符。
- 所有自定义配方都应该配有有意义的 id，配方 id 命名空间使用 createdelight。
- 小刀的配方应当使用 cutting_2 函数增加，其会将 tetra 的模块化刀的配方一并加入。
- 需要加入离心机的配方时请考虑使用 centrifugation 函数，其会加入三种离心机（vintageimprovement，小型，大型）的配方。
- 序列组装配方在编写时要格外留意冲突问题，从相同初始物开始：未注册中间产物的情况下，N 步配方的最后一步不能和其他的配方的第 N 步完全相同；有中间产物情况下则第一步不能和其他配方第一步相同。

### Commit 规范
- 可以参考 https://www.conventionalcommits.org/zh-hans/v1.0.0/#%e7%ba%a6%e5%ae%9a%e5%bc%8f%e6%8f%90%e4%ba%a4%e8%a7%84%e8%8c%83

## 食物配方修改规范
- 成类型，也就是一个前体可以同时制作一大堆后续物品，只是修改部分加入的配料，也就是基础的基底是相同的。
- 沉浸感，也就是尽量用现有的工具站模拟现实配方，比如蛋糕需要用蛋糕液注入模具然后烤制。
- 同类型贴图尽量统一风格。
- 同类型食物的合成方式尽量只改变部分配料，也就是尽量只有口味变化。
- 对于某些引导不明确或者与原整合包配方类型冲突（比如 bakeries 的搅拌机），选用更偏向机械动力风格 + 沉浸风格的。
- 奇幻风格的食物之类的我觉得可以发挥天马行空的想象力，但是也尽量使用食物系的工作站来合成。
- 一般不添加生食物，但 mod 增加生食物后，可根据 mod 的风格进行其余系列食物的生食物制作（包括贴图）。

## 加入 mod 规范

### 加入食物类型 mod
- 排除重复的食物。删除其配方，并且移除其在 JEI 中的显示或者直接从创造模式物品栏中移除。
- 修改食物的配方。如果能够更合理则将其变得更合理，或者将其与整合包总体风格适配。
- 作物与静谧四季兼容。为作物物品以及作物方块根据现实收获时间打标签。
- 原材料与料理乐事兼容。为其增加料理乐事的属性。
- 与三明治 mod 兼容。如果有合适的流体则将其加入三明治的酱类兼容中。

## 版本发布流程
- 正式版本和测试版本发布均使用 `.agents/skills/release/` 中的 release skill。
- 对 AI 助手可直接提出“发布版本”“发布测试版”等请求；人工执行时查看 `.agents/skills/release/SKILL.md` 并运行其中的脚本。

## 增加客户端/服务端专用 mod
- 客户端专用 mod 在对应 `mods/*.pw.toml` 中设置 `side = "client"`；服务端专用 mod 设置 `side = "server"`。
- 本地同步默认按客户端侧处理；服务端发布会按 `side` 过滤和删除 mod。

## 发包使用的工具
- packwiz https://packwiz.infra.link/tutorials/creating/getting-started/
- 因为原始 repo 的发布文件已经过期，使用了个人 fork 的版本：https://github.com/wanquanw/packwiz-build

## 直接克隆仓库后的资源同步
- 如果是直接 `git clone` 本仓库，而不是下载发布包，请先在仓库根目录双击 `sync-packwiz-assets.bat`。
- 该脚本会扫描 `mods/`、`resourcepacks/`、`shaderpacks/` 下已经提交的 `*.pw.toml` 文件。
- 首次运行时会自动下载 `packwiz.exe` 和 `packwiz-installer.jar`，缓存到 `.cache/packwiz-sync/`。
- 随后会自动执行 `packwiz refresh`、启动本地静态文件服务，并调用 `packwiz-installer`，把缺失的 mod / 资源包 / 光影包同步到本地。
- 默认同步目标是客户端开发环境，只下载 `side = "both"` 和 `side = "client"`；服务端专用 mod 使用 `side = "server"` 标记，不会进入默认客户端实例。
- 运行前需要准备好 Java 17，并确保能够访问 CurseForge 或对应 CDN。
- 如果不想双击批处理，也可以在终端手动执行：`powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\sync-packwiz-assets.ps1`。
- 如果需要同步服务端侧文件，可手动执行：`powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\sync-packwiz-assets.ps1 -Side server`。
- 这个同步流程只会处理 `*.pw.toml` 描述的外部文件，不会覆盖仓库里已经被 Git 跟踪的普通文件。

## 手动更新/加入 mod 后的同步
- 当前仓库不再追踪 `mods/*.jar`；`mods/` 目录只提交 `*.pw.toml`，本地实际 jar 默认忽略。根目录和各子目录采用“默认忽略，按需白名单”的 `.gitignore` 方案。
- 无论是手动更新一个已有模组，还是直接往 `mods/` 里放入一个新的 jar，都可以先执行根目录下的 `update-packwiz-meta.bat`。
- 也可以手动运行：`powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\update-packwiz-meta.ps1`。
- 对于已经存在 `*.pw.toml` 的 CurseForge 模组，脚本会根据本地新 jar 与旧 `filename` 的差异，尝试执行 `packwiz update <slug> --yes`；更新后还会再次验证对应 CurseForge 文件是否允许第三方下载。
- 对于新加入但还没有 `*.pw.toml` 的模组，脚本会优先使用 `packwiz curseforge detect` 对本地 jar 做指纹识别；只有 detect 失败时才会再用文件名和 jar 内元数据搜索 CurseForge。
- 当脚本拿到候选 CurseForge 文件后，会额外构造一个最小临时 pack，实际跑一次 `packwiz-installer` 探测该 `project-id + file-id` 是否允许第三方下载，并把结果缓存到 `.cache/packwiz-sync/cf-downloadability-cache.json`。
- 如果新模组无法被稳定识别为 CurseForge 文件、识别结果落到了错误版本，或者 CurseForge 标记为必须手动下载，脚本会自动把该 jar 复制到 `packwiz-files/mods/`，并在 `mods/` 下生成或保留一个指向 raw GitHub 地址的本地 `pw.toml`。
- 对于已经存在的本地 `packwiz-files` 模组，如果你手动替换成了新 jar，脚本会先尝试迁移到可第三方下载的 CurseForge；只有不能安全迁移时，才会复用原来的 `pw.toml`，并更新 `filename`、下载地址和 `hash`。
- 如果你手动删除了一个模组的 jar，且没有检测到同 basename 的替代文件，脚本会把对应的 `mods/*.pw.toml` 一并删除；如果它是本地 `packwiz-files` 模组，还会删除对应的 `packwiz-files/mods/...jar`。
- 如果脚本发现缺失的模组数量异常多，会认为你当前本地 `mods/` 目录可能还没同步完整，此时会跳过自动删除并给出警告，避免误删整包元数据。
- 无论走的是 CurseForge 还是 `packwiz-files`，脚本最后都会自动执行 `packwiz refresh`。
- 更新完成后，正常需要检查并提交对应的 `mods/*.pw.toml`、`index.toml`、`pack.toml`，以及本轮产生的 `packwiz-files/` 变更；不要重新提交 `mods/*.jar`。

## 修改整合包内的默认配置
- 直接修改整合包内的 `.options.txt` 文件即可，发包时会将这个作为整合包的默认配置。
- 包括但不限于：键位设置、加载的资源包和加载顺序。

## 修改整合包服务器 JVM 参数配置
- 修改 `variables.txt` 中的 `JAVA_ARGS=` 后面的内容。

## 关于整合包升级补丁
- 当前会生成相对于最近一个 git tag 的补丁包，并附带一个 bat 用于删除被移除的文件。
- 会在升级后的版本加上 `(patch)` 以示区分。
- 对于 `mods` 文件夹下的改动，因为涉及到 mod 本体，不会包含在补丁包中，取而代之的是一个 mod 变化列表文件，放在补丁包根目录。

## 开发相关 tips 记录

### 环境配置
- 推荐使用 [VSCode](https://code.visualstudio.com/) 或者 [IntelliJ IDEA Community Edition](https://www.jetbrains.com/idea/download/?section=windows) 开发。
- 如果想使用 AI IDE，推荐 [Trae CN](https://www.trae.cn/)。

### 杂项笔记
- KubeJS 的 server/client 脚本更改后可以直接在游戏内热加载 `/kubejs reload server_scripts`，无需重启游戏。
- 如果是修改了配方、标签、掉落表等，需要再执行 `/reload`。
- 模组的配置也可以热更新，在 Esc - 模组 - 搜索找到对应模组后配置即可。

### 推荐阅读/链接
- [KubeJS 开发文档中文翻译](https://gumeng.gitbook.io/ce-shi)
- [KubeJS 官方 wiki](https://wiki.latvian.dev/books/kubejs)
- [中文 Minecraft Mod 开发指南 by Team CovertDragon](https://covertdragon.team)
- [Forge 官方文档-中文](https://mcforge-cn.readthedocs.io/zh/latest/forgedev)
