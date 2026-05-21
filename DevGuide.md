# 开发环境安装指南

在一个合适的目录下，启动配置好的 agent（如 Codex）并输入：

```text
参考 https://github.com/Jasons-impart/Create-Delight-Remake/blob/main/DevGuide.md 搭建整合包开发环境
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
- 下载HMCL启动器：
  ```powershell
  Invoke-WebRequest -Uri "https://github.com/HMCL-dev/HMCL/releases/download/v3.7.3/HMCL-3.7.3.jar" -OutFile ".\HMCL.jar"
  ```
- 同步本地开发所需的 mod / 资源包 / 光影包：
  ```powershell
  powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\sync-packwiz-assets.ps1
  ```
- 脚本会自动下载 `packwiz.exe` 和 `packwiz-installer.jar` 到 `.cache/packwiz-sync/tools/`，执行 `packwiz refresh`，并按 `mods/`、`resourcepacks/`、`shaderpacks/` 下的 `*.pw.toml` 同步实际文件。
- 同步成功后，要求用户按“用户操作步骤”完成 HMCL 图形界面配置。
- 用户完成 HMCL 实例创建后，agent 继续执行“Agent 收尾检查”。

## Agent 给用户的操作提示
- 告诉用户打开 HMCL。
- 告诉用户新建或选择一个实例，实例名可自定。
- 告诉用户安装 Minecraft `1.20.1` 和 Forge `47.4.10`。
- 告诉用户开启版本隔离，并确认实例目录位于 `.minecraft/versions/{实例名}/`。
- 告诉用户将当前 repo 放到该实例目录，或确认当前 repo 已经在该实例目录中。
- 告诉用户完成后回复实例名和实例目录。

## Agent 收尾检查
- 根据用户提供的实例名和实例目录，确认 `{实例名}.json`、`{实例名}.jar`、`pack.toml`、`kubejs/`、`config/`、`mods/` 存在。
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
- Agent 或用户将本 repo 放入 `.minecraft/versions/{实例名}/`，目录形态应为：
  ```text
  .minecraft/
  └── versions/
      └── {实例名}/
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
- 如果缺少 `{实例名}.json` 或 `{实例名}.jar`，用户回到 HMCL 为该实例重新安装 Minecraft `1.20.1` + Forge `47.4.10`。
- Agent 执行“Agent 收尾检查”。
- 用户在 HMCL 中选择该实例启动。
- 启动失败时，用户提供 `logs/latest.log`，agent 检查 Java 17、Forge 版本、版本隔离和日志错误。

# KubeJS相关开发文档链接
- https://docs.qq.com/doc/DWVVpeGFrSE1sSGpj
- https://docs.mihono.cn/zh/modpack/kubejs/1.20.1/Introduction/Description

# 编写代码相关
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
- 所有自定义配方都应该配有有意义的 id，配方id命名空间使用createdelight。
- 小刀的配方应当使用cutting_2函数增加，其会将tetra的模块化刀的配方一并加入。
- 需要加入离心机的配方时请考虑使用centrifugation函数，其会加入三种离心机（vintageimprovement，小型，大型）的配方。
- 序列组装配方在编写时要格外留意冲突问题，从相同初始物开始：未注册中间产物的情况下，N步配方的最后一步不能和其他的配方的第N步完全相同；有中间产物情况下则第一步不能和其他配方第一步相同

### commit规范
- 可以参考https://www.conventionalcommits.org/zh-hans/v1.0.0/#%e7%ba%a6%e5%ae%9a%e5%bc%8f%e6%8f%90%e4%ba%a4%e8%a7%84%e8%8c%83

## 食物配方修改规范
- 成类型，也就是一个前体可以同时制作一大堆后续物品，只是修改部分加入的配料，也就是基础的基底是相同的
- 沉浸感，也就是尽量用现有的工具站模拟现实配方，比如蛋糕需要用蛋糕液注入模具然后烤制
- 同类型贴图尽量统一风格
- 同类型食物的合成方式尽量只改变部分配料，也就是尽量只有口味变化
- 对于某些引导不明确或者与原整合包配方类型冲突（比如bakeries的搅拌机），选用更偏向机械动力风格+沉浸风格的
- 奇幻风格的食物之类的我觉得可以发挥天马行空的想象力，但是也尽量使用食物系的工作站来合成
- 一般不添加生食物，但mod增加生食物后，可根据mod的风格进行其余系列食物的生食物制作（包括贴图）

## 加入mod规范

### 加入食物类型mod
- 排除重复的食物。删除其配方，并且移除其在jei中的显示或者直接从创造模式物品栏中移除。
- 修改食物的配方。如果能够更合理则将其变得更合理，或者将其与整合包总体风格适配。
- 作物与静谧四季兼容。为作物物品以及作物方块根据现实收获时间打标签。
- 原材料与料理乐事兼容。为其增加料理乐事的属性。
- 与三明治mod兼容。如果有合适的流体则将其加入三明治的酱类兼容中。

# 版本发布流程
- 正式版本和测试版本发布均使用 `.agents/skills/release/` 中的 release skill。
- 对 AI 助手可直接提出“发布版本”“发布测试版”等请求；人工执行时查看 `.agents/skills/release/SKILL.md` 并运行其中的脚本。

# 增加客户端mod
- 为了方便生成服务端包，请在增加后更新.clientonlymodlist文件

# 发包使用的工具
- packwiz https://packwiz.infra.link/tutorials/creating/getting-started/
- 因为原始repo的发布文件已经过期，使用了个人fork的版本：https://github.com/wanquanw/packwiz-build

# 直接克隆仓库后的资源同步
- 如果是直接 `git clone` 本仓库，而不是下载发布包，请先在仓库根目录双击 `sync-packwiz-assets.bat`
- 该脚本会扫描 `mods/`、`resourcepacks/`、`shaderpacks/` 下已经提交的 `*.pw.toml` 文件
- 首次运行时会自动下载 `packwiz.exe` 和 `packwiz-installer.jar`，缓存到 `.cache/packwiz-sync/`
- 随后会自动执行 `packwiz refresh`、启动本地静态文件服务，并调用 `packwiz-installer`，把缺失的 mod / 资源包 / 光影包同步到本地
- 运行前需要准备好 Java 17，并确保能够访问 CurseForge 或对应 CDN
- 如果不想双击批处理，也可以在终端手动执行：`powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\sync-packwiz-assets.ps1`
- 这个同步流程只会处理 `*.pw.toml` 描述的外部文件，不会覆盖仓库里已经被 Git 跟踪的普通文件

# 手动更新/加入mod后的同步
- 当前仓库不再追踪 `mods/*.jar`；`mods/` 目录只提交 `*.pw.toml`，本地实际 jar 默认忽略。根目录和各子目录采用“默认忽略，按需白名单”的 `.gitignore` 方案。
- 无论是手动更新一个已有模组，还是直接往 `mods/` 里放入一个新的 jar，都可以先执行根目录下的 `update-packwiz-meta.bat`
- 也可以手动运行：`powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\update-packwiz-meta.ps1`
- 对于已经存在 `*.pw.toml` 的 CurseForge 模组，脚本会根据本地新 jar 与旧 `filename` 的差异，尝试执行 `packwiz update <slug> --yes`；更新后还会再次验证对应 CurseForge 文件是否允许第三方下载
- 对于新加入但还没有 `*.pw.toml` 的模组，脚本会优先使用 `packwiz curseforge detect` 对本地 jar 做指纹识别；只有 detect 失败时才会再用文件名和 jar 内元数据搜索 CurseForge
- 当脚本拿到候选 CurseForge 文件后，会额外构造一个最小临时 pack，实际跑一次 `packwiz-installer` 探测该 `project-id + file-id` 是否允许第三方下载，并把结果缓存到 `.cache/packwiz-sync/cf-downloadability-cache.json`
- 如果新模组无法被稳定识别为 CurseForge 文件、识别结果落到了错误版本，或者 CurseForge 标记为必须手动下载，脚本会自动把该 jar 复制到 `packwiz-files/mods/`，并在 `mods/` 下生成或保留一个指向 raw GitHub 地址的本地 `pw.toml`
- 对于已经存在的本地 `packwiz-files` 模组，如果你手动替换成了新 jar，脚本会先尝试迁移到可第三方下载的 CurseForge；只有不能安全迁移时，才会复用原来的 `pw.toml`，并更新 `filename`、下载地址和 `hash`
- 如果你手动删除了一个模组的 jar，且没有检测到同 basename 的替代文件，脚本会把对应的 `mods/*.pw.toml` 一并删除；如果它是本地 `packwiz-files` 模组，还会删除对应的 `packwiz-files/mods/...jar`
- 如果脚本发现缺失的模组数量异常多，会认为你当前本地 `mods/` 目录可能还没同步完整，此时会跳过自动删除并给出警告，避免误删整包元数据
- 无论走的是 CurseForge 还是 `packwiz-files`，脚本最后都会自动执行 `packwiz refresh`
- 更新完成后，正常需要检查并提交对应的 `mods/*.pw.toml`、`index.toml`、`pack.toml`，以及本轮产生的 `packwiz-files/` 变更；不要重新提交 `mods/*.jar`

# 修改整合包内的默认配置
- 直接修改整合包内的.options.txt文件即可，发包时会将这个作为整合包的默认配置
- 包括但不限于：键位设置、加载的资源包和加载顺序

# 修改整合包服务器jvm参数配置
- 修改variables.txt中的`JAVA_ARGS=`后面的内容

# 关于整合包升级补丁
- 当前会生成相对于最近一个git tag的补丁包，并附带一个bat用于删除被移除的文件。
- 会在升级后的版本加上`(patch)`以示区分。
- 对于mods文件夹下的改动，因为涉及到mod本体，不会包含在补丁包中，取而代之的是一个mod变化列表文件，放在补丁包根目录。

# 开发相关tips记录

## 环境配置
- 推荐使用[VSCode](https://code.visualstudio.com/)或者[IntelliJ IDEA Community Edition](https://www.jetbrains.com/idea/download/?section=windows)开发
- 如果想使用AI IDE，推荐[Trae CN](https://www.trae.cn/)

## 杂项笔记
- Kubejs的server/client脚本更改后可以直接在游戏内热加载`\kubejs reload server_scripts`，无需重启游戏
  - 如果是修改了配方、标签、掉落表等，需要再执行`\reload`
- 模组的配置也可以热更新，在esc-模组-搜索找到对应模组后配置即可
  
## 推荐阅读/链接
- [KubeJS开发文档中文翻译](https://gumeng.gitbook.io/ce-shi)
  - 翻译自[KubeJS官方wiki](https://wiki.latvian.dev/books/kubejs)
- [中文 Minecraft Mod 开发指南 by Team CovertDragon](https://covertdragon.team)
- [forge官方文档-中文](https://mcforge-cn.readthedocs.io/zh/latest/forgedev)

# 关于整合包已有的优化模组（供新增时参考）
- Embeddium
  - 渲染优化 https://www.mcmod.cn/class/12028.html
- Sodium/Embeddium Extras
  - 渲染优化 https://www.mcmod.cn/class/5312.html
- Vanillin
  - 飞轮实体渲染优化 https://www.mcmod.cn/class/19260.html
- Accelerated Rendering
  - 大量实体或拥有大量顶点的复杂Mod实体的渲染性能优化 https://www.mcmod.cn/class/21060.html
- Colorwheel
  - 使得飞轮优化可以兼容光影 https://www.mcmod.cn/class/20111.html
- Create Better FPS
  - 机械动力在光影下的优化 https://www.mcmod.cn/class/18864.html
- Entity Culling
  - 实体渲染机制优化 https://www.mcmod.cn/class/3629.html
- CullLessLeaves Reforged
  - 更好的树叶渲染优化 https://www.mcmod.cn/class/9810.html
- Flerovium
  - 物品、粒子渲染优化 https://www.mcmod.cn/class/17322.html
- ServerCore
  - 优化服务器运算、实体活动范围（可选启用）、动态性能检查、村民脑叶切除术、繁殖上限、区块活动距离 https://www.mcmod.cn/class/6542.html
- Harium
  - 锂的forge移植，优化各种原版机制计算方法 https://www.curseforge.com/minecraft/mc-mods/harium
- moestweaks
  - 关闭配方书 https://www.mcmod.cn/class/17039.html
- FerriteCore
  - 内存占用优化 https://www.mcmod.cn/class/3888.html
- Placebo
  - 合成配方加载、匹配优化 https://www.mcmod.cn/class/1023.html
- fastboot
  - 启动性能优化，延迟DFU的编译时间 https://www.mcmod.cn/class/15103.html
- Create: Fast Schematic Cannon
  - 蓝图炮优化 https://www.mcmod.cn/class/22205.html
- Krypton Reforged
  - 优化MC的网络堆栈 https://www.mcmod.cn/class/5146.html
- Biomespy
  - 大幅减少搜索群系所花时间 https://www.curseforge.com/minecraft/mc-mods/biomespy
- DSBG
  - 关闭setblock in far chunk警告，本包里adastra等模组在生成时会频繁触发这个警报，有卡服风险。 https://www.mcmod.cn/class/14239.html
- Create: LazyTick
  - 优化机械动力机器的性能 https://www.curseforge.com/minecraft/mc-mods/create-lazytick

# 考虑中的实用模组
- 卓越火炬
  - 可配置的生物生成阻止火把 https://www.mcmod.cn/class/9896.html
- Overflowing Bars （vs 已有的Colorful Heart）
  - 显示护甲/生命值了多少层 https://www.mcmod.cn/class/10074.html
- Better ModList
  - http://mcmod.cn/class/16643.html
  - 已尝试，会弄乱标题画面，并且无法正确识别mod是否为前置
- Stack Refill
  - https://www.mcmod.cn/class/7064.html
  - 整合包当前使用已经会refill，但丢弃的时候不会refill，加入这个mod丢弃时会refill。

# 考虑中的优化模组
- Chunk Sending 
  - 服务端区块数据包分发逻辑优化 https://www.mcmod.cn/class/10461.html
- Acedium
  - 使用NV专用OpenGL扩展提高fps https://www.mcmod.cn/class/16808.html
- Fast Paintings
  - 优化画的渲染 https://www.mcmod.cn/class/10999.html
- Mobtimizations - Entity Performance Fixes
  - 服务器实体性能优化模组 https://www.mcmod.cn/class/13755.html
- 修复GPU内存泄漏
  - 和上面的AllTheLeaks不重合可以一起，https://www.mcmod.cn/class/11863.html
- Let Me Despawn
  - 让拿起物品的怪物也会消失 https://www.mcmod.cn/class/7415.html
- Nolijium
  - 调整各种效果 https://www.mcmod.cn/class/18050.html
- C2ME - forge
  - 优化区块生成、I/O、加载 https://www.mcmod.cn/class/21774.html
  - 因为会引入较多问题被移除，如Quark板条箱内容消失，退出世界耗时大幅提升，小地图加载速度变慢等。


# 考虑中的内容模组
- 拾光定影
  - 拍照 https://www.mcmod.cn/class/12905.html
- Tide
  - 潮汐 https://www.mcmod.cn/class/13540.html
- Mmobs
  - Mowzie的生物 https://www.mcmod.cn/class/984.html
- Rustic Engineer
  - 机械风生物 https://www.mcmod.cn/class/15150.html
- Aquamirae
  - 海灵物语 https://www.mcmod.cn/class/5011.html
- Bosses of Mass Destruction
  - 添加4个boss https://www.mcmod.cn/class/12887.html
- 溺亡者之嚎
  - 添加1个boss https://www.mcmod.cn/class/16470.html
- 生于混沌
  - 体量太大，不一定好做兼容 https://www.mcmod.cn/class/8006.html
- Ghosts
  - https://www.mcmod.cn/class/8029.html
- 灾变
  - https://www.mcmod.cn/class/5214.html
- Legendary Monsters
  - https://www.mcmod.cn/class/12933.html
- 迎战
  - https://www.mcmod.cn/class/4204.html
- 突变生物
  - 拟与生物科技相联 https://www.mcmod.cn/class/10081.html
- Mokels Bossfight: Kinora
  - https://www.mcmod.cn/class/15496.html
- Mokels The Shattered Goddess
  - https://www.mcmod.cn/class/15290.html
- Mutated Items / Items to Mobs
  - https://www.mcmod.cn/class/10256.html
- Mythic Mounts
  - https://www.mcmod.cn/class/7192.html
- ATi Structures
  - https://www.mcmod.cn/class/17109.html
- Species
  - https://www.mcmod.cn/class/10307.html
- It Takes a Pillage
  - https://www.mcmod.cn/class/7622.html
- [WAB]Wan's Ancient Beasts
  - https://www.mcmod.cn/class/16975.html

# 考虑中的外饰模组
- Rainbows!
  - 增加彩虹 https://www.mcmod.cn/class/16847.html
- Beautify
  - 添加装饰品 https://www.mcmod.cn/class/7263.html
- Chimes
  - 添加风铃 https://www.mcmod.cn/class/6988.html
- Cluttered
  - https://www.mcmod.cn/class/9330.html
- Convenient Decor
  - https://www.mcmod.cn/class/9143.html
- Lucky's Cozy Home: Refurnished
  - https://www.mcmod.cn/class/9931.html
- Dark Paintings
  - https://www.mcmod.cn/class/8079.html
- Handcrafted
  - https://www.mcmod.cn/class/9261.html
- Macaw的门
  - https://www.mcmod.cn/class/2574.html
- Macaw的活板门
  - https://www.mcmod.cn/class/2918.html
- Macaw的桥梁
  - https://www.mcmod.cn/class/2040.html
- Macaw's Stairs
  - https://www.mcmod.cn/class/16896.html
- Macaw的栅栏与墙
  - https://www.mcmod.cn/class/4795.html
- Macaw 的窗户
  - https://www.mcmod.cn/class/2565.html
- Macaw的画
  - https://www.mcmod.cn/class/5498.html
- Plushie Buddies
  - 装饰性玩偶 https://www.mcmod.cn/class/15793.html
- Serene Shrubbery
  - 加7种花卉 https://www.mcmod.cn/class/8356.html
- Simple hats
  - https://www.mcmod.cn/class/8846.html
- Tanuki Decor
  - https://www.mcmod.cn/class/13280.html
- 群青：重织
  - https://www.mcmod.cn/class/13041.html
- VerdantVibes
  - https://www.mcmod.cn/class/13000.html
- Lucky's Wardrobe
  - https://www.mcmod.cn/class/15310.html
- MrCrayfish 的家具
  - https://www.mcmod.cn/class/15668.html
- Fantasy的家具
  - https://www.mcmod.cn/class/6455.html
- 添加一些毛绒玩具
  - https://www.mcmod.cn/class/15185.html
- [DF]Diagonal Fences
  - https://www.mcmod.cn/class/6701.html
