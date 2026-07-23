# 齿轮盛宴整合包内容 FAQ

> 来源：[飞书文档](https://my.feishu.cn/docx/O6z3ddPckoCLEFxqIZqcZbz6npd)（由原始 Word 导出转换，含全部截图）

在提问前，请务必先检查整合包版本是否足够新，自己是否有增删/升级模组，并仔细阅读任务书、JEI、思索：过旧的整合包版本问题可能不会再记述在本文内；制作组没有能力保证增删/升级模组后整合包仍然能正常游玩；其他整合包/mod的配方与内容在本整合包下可能已经被改动。

其他信息包括下载地址等见：[机械动力：悠然乐事重置版 信息汇总](https://xr5r5e86lk.feishu.cn/docx/LE9ud6DgXoBaQhxowJucOQVqnWb)

![截图 001：概览](https://r2.jsi-team.com/cdr/docs/faq/overview/001.png)

![截图 002：概览](https://r2.jsi-team.com/cdr/docs/faq/overview/002.png)

## 进入游戏前

### 客户端大小不到100M，是正常的吗？

本整合包不带能在curseforge上下载到的mod的本体，mod由启动器下载以保证mod作者的收益。保护mod作者的收益就是保护mc mod社区的良好发展。

### 整合包安装/启动时的各色报错信息

（手机屏摄均来源于真实案例）

#### 启动器不识别整合包 / 无法确定应当执行的文件拖拽操作

请确认是从正确位置下载的 [Client]开头的 压缩包。详见[机械动力：悠然乐事重置版 信息汇总](https://xr5r5e86lk.feishu.cn/docx/LE9ud6DgXoBaQhxowJucOQVqnWb#share-KvuqdYVZuoFoeYxqLQycRrSsnme)

![截图 003：启动器不识别整合包 / 无法确定应当执行的文件拖拽操作](https://r2.jsi-team.com/cdr/docs/faq/pre-game/003.jpeg)

#### 网络环境不佳，安装整合包失败，未完成依赖下载

如：网络不佳导致无法下载整合包内容 /  下载 Mod（主加载器）失败  / TimeOut等

如果是pcl2请先更新pcl2再重试。

一般来说要尝试加速器或者挂梯子，运气好切手机热点或者反复尝试下载可以解决。

或者找个乐于助人的热心群友发一个安装好的给你，制作组受限于minecraft的用户协议约束无法合法地提供安装好的整合包。

![截图 004：网络环境不佳，安装整合包失败，未完成依赖下载](https://r2.jsi-team.com/cdr/docs/faq/pre-game/004.png)

![截图 005：网络环境不佳，安装整合包失败，未完成依赖下载](https://r2.jsi-team.com/cdr/docs/faq/pre-game/005.png)

![截图 006：网络环境不佳，安装整合包失败，未完成依赖下载](https://r2.jsi-team.com/cdr/docs/faq/pre-game/006.png)

#### 整合包所在路径过长

如PCL报错，整合包所在路径太长，可先将整合包移动到桌面或某个盘符下根目录，再安装。

如果还不理解可以求助AI。

![截图 007：整合包所在路径过长](https://r2.jsi-team.com/cdr/docs/faq/pre-game/007.jpeg)

#### 网络环境不佳，难以连接到服务器

网络问题或mojang.账号服务器爆炸，尝试挂vpn或者离线登录。

![截图 008：网络环境不佳，难以连接到服务器](https://r2.jsi-team.com/cdr/docs/faq/pre-game/008.png)

#### PCL报错：部分mod版本已被Mod作者删除

![截图 009：PCL报错：部分mod版本已被Mod作者删除](https://r2.jsi-team.com/cdr/docs/faq/pre-game/009.png)

这是因为PCL使用的镜像源有问题，缺失部分mod版本。请使用加速器加速curseforge，并修改PCL的下载为 尽量使用官方源 。

![截图 010：PCL报错：部分mod版本已被Mod作者删除](https://r2.jsi-team.com/cdr/docs/faq/pre-game/010.png)

#### 启动时报错KubeJS alexscaves

偶发错误，制作组无法复现。  解决方案：找到 游戏根目录下startup_scripts/custom/register_metal_dust.js这个文件，删除下图红框部分

![截图 011：启动时报错KubeJS alexscaves](https://r2.jsi-team.com/cdr/docs/faq/pre-game/011.jpeg)

![截图 012：启动时报错KubeJS alexscaves](https://r2.jsi-team.com/cdr/docs/faq/pre-game/012.png)

#### 启动时报错：Error loading mods，没有安装mod xxx

安装有问题导致模组没有全部安装，参考[齿轮盛宴整合包 信息汇总](https://xr5r5e86lk.feishu.cn/docx/LE9ud6DgXoBaQhxowJucOQVqnWb)文档里正确安装方法安装后再启动。

![截图 013：启动时报错：Error loading mods，没有安装mod xxx](https://r2.jsi-team.com/cdr/docs/faq/pre-game/013.jpeg)

### 创建/进入世界的问题

#### 创建新世界长时间卡住，日志显示 Registering recipes: ali:jei_plugin

尝试升级ALI，如果依然卡住，可以移除ALI试试。

![截图 014：创建新世界长时间卡住，日志显示 Registering recipes: ali:jei_plugin](https://r2.jsi-team.com/cdr/docs/faq/pre-game/014.png)

### 无法进入老存档

#### 更新整合包后无法进入

整合包更新时不可避免地需要更新模组和魔改兼容，制作组无法保证老存档一定能在新整合包上运行，因此 跨版本迁移存档 或 直接使用升级补丁 时请务必备份存档。

下面提供一些可能的解决办法

#### 清空存档里的config

- 进入对应的存档世界文件夹，将serverconfig目录下的内容清空

#### 清空OEI缓存

- 删除整合包版本文件夹下的 oei\global_replacement_cache.dat

#### 使用全新存档的level.dat替换老存档里的level.dat

- 使用整合包老版本打开存档，所有玩家把物品栏和背包都清空，物品都存放到箱子里。否则可能升级后发现物品栏和背包清空。

- 备份存档，并记录存档的世界生成seed，保证和老存档seed一致，减少可能出现的地形撕裂问题。

- （客户端）生成世界的时候指定记录的seed，（服务端）世界生成seed填入server.properties

- 重新生成世界，然后用新世界的level.dat替换备份存档里的level.dat

#### 放下烤箱用鼓风机崩溃后 无法进入

尝试关闭光影后进入。

然后检查崩溃前游玩使用的光影是否是有colorwheel补丁的版本（详见下面的 [整合包内的光影](https://xr5r5e86lk.feishu.cn/docx/O6z3ddPckoCLEFxqIZqcZbz6npd#share-Cy7ddhKfloMFsPxJ9fScmGvcnUe) 问题）

## 联机、链接服务器

连接服务器前，请先确认：

- 你和服务器的整合包版本是否一致

- 你是否手动更新了客户端里的模组

- 服主是否有改动整合包模组

能解决80%以上的问题。

### 如何和朋友联机？

- 整合包内置局域网联机mod（[https://www.mcmod.cn/class/4498.html](https://www.mcmod.cn/class/4498.html)），可参考

[该类型的内容暂不支持下载]

- 或使用交流群内官服，交流群见[齿轮盛宴整合包 信息汇总](https://xr5r5e86lk.feishu.cn/docx/LE9ud6DgXoBaQhxowJucOQVqnWb)

- 联机相关报错排查可参考下面视频，与整合包内容关系不大，建议自行搜索攻略解决。

[该类型的内容暂不支持下载]

### 链接丢失、Connection time out / reset

玩家的网络与服务器的连接不好，建议换个网络（如使用手机热点），换个服务器线路或者换个服务器。

![截图 015：链接丢失、Connection time out / reset](https://r2.jsi-team.com/cdr/docs/faq/world/015.jpeg)

![截图 016：链接丢失、Connection time out / reset](https://r2.jsi-team.com/cdr/docs/faq/world/016.jpeg)

### 无法连接至服务器 连接中断

首先更新zstdnet到最新版再尝试。

![截图 017：无法连接至服务器 连接中断](https://r2.jsi-team.com/cdr/docs/faq/world/017.jpeg)

如果还不行，请参考如下步骤进行联机：

启动游戏，进入存档，点击开放局域网，这里面会多一个zstd端口的选择，在这里填入您想要使用frp/公网的端口，比如你设置了本地端口为25565，那么您在樱花/公网里面设置的本地端口应该为25565，樱花会分配远程端口给您，在日志里复制樱花的端口发给您的朋友即可

![截图 018：无法连接至服务器 连接中断](https://r2.jsi-team.com/cdr/docs/faq/world/018.jpeg)

![截图 019：无法连接至服务器 连接中断](https://r2.jsi-team.com/cdr/docs/faq/world/019.png)

如果依然不行

带宽或流量不够（国内环境基本只有付费服务器够）：禁用 zstdnet 改用 [BandwidthOptimizer](https://www.curseforge.com/minecraft/mc-mods/bandwidthoptimizer) (作者Pink_Cats)

带宽够且流量够：可以直接禁用zstdnet

### 版本问题： mod mismatched ; error loading mods ; 缺少必需的数据包注册表

连接的服务器整合包版本和客户端整合包版本不一致。请使用同一个版本的整合包

请不要使用原版mc连接齿轮盛宴服务器。

![截图 020：版本问题： mod mismatched ; error loading mods ; 缺少必需的数据包注册表](https://r2.jsi-team.com/cdr/docs/faq/world/020.png)

![截图 021：版本问题： mod mismatched ; error loading mods ; 缺少必需的数据包注册表](https://r2.jsi-team.com/cdr/docs/faq/world/021.jpeg)

![截图 022：版本问题： mod mismatched ; error loading mods ; 缺少必需的数据包注册表](https://r2.jsi-team.com/cdr/docs/faq/world/022.png)

- v0.4.5.6以后的服务器版本可在加入前检查。

![截图 023：版本问题： mod mismatched ; error loading mods ; 缺少必需的数据包注册表](https://r2.jsi-team.com/cdr/docs/faq/world/023.png)

### 登录失败：无效会话

如游戏提示，请先尝试重启。

如果还不行，请确认自己是否在使用离线登录进入开启了正版验证的服务器。

![截图 024：登录失败：无效会话](https://r2.jsi-team.com/cdr/docs/faq/world/024.jpeg)

### invalid characters in username

用户名请使用英文

![截图 025：invalid characters in username](https://r2.jsi-team.com/cdr/docs/faq/world/025.jpeg)

### Non character in path

检查服务端和客户端的整合包版本是否是一致的。

![截图 026：Non character in path](https://r2.jsi-team.com/cdr/docs/faq/world/026.jpeg)

### 链接服务器时崩溃

例如：报错包含 Registry minecraft:block: Object did not get ID it asked for. Name: createdelight:andesite_export_bus Expected: 1243 Got: 0

![截图 027：链接服务器时崩溃](https://r2.jsi-team.com/cdr/docs/faq/world/027.png)

检查整合包根目录里有没有ldlib这个文件夹，这通常是因为使用了由PCL的导出整合包导出的包所导致的文件缺失

请不要使用PCL的导出整合包来分享齿轮盛宴，PCL导出的包会丢失齿轮盛宴必须的文件。

### 链接服务器时崩溃，崩溃报错信息包含 ModMismatchDisconnectedScreen

检查服务端和客户端的整合包版本是否是一致的。

![截图 028：链接服务器时崩溃，崩溃报错信息包含 ModMismatchDisconnectedScreen](https://r2.jsi-team.com/cdr/docs/faq/world/028.png)

### 无法链接到服务器，提示OutOfMemoryError

一般重启游戏可以解决，有条件的可以尝试在启动器配置分配更多内存。

![截图 029：无法链接到服务器，提示OutOfMemoryError](https://r2.jsi-team.com/cdr/docs/faq/world/029.png)

### 无法直接通过小地图传送，无法传送，无法使用/tp指令

服务器直接传送需要op权限，可通过查看自己聊天中的名称是否是绿色的来判断。

可使用ftb essentials提供的无需权限的传送指令 tpa, tpahere, home, back等，详见mcmod百科。

## 进入游戏后的异常

### 合成配方缺失，无法使用原木合成木板，JEI查询到的木板合成配方异常

- 指定使用java17启动游戏。

- 检查安装是否有异常，请遵循 [齿轮盛宴整合包 信息汇总](https://xr5r5e86lk.feishu.cn/docx/LE9ud6DgXoBaQhxowJucOQVqnWb) 内的安装方法。

![截图 030：合成配方缺失，无法使用原木合成木板，JEI查询到的木板合成配方异常](https://r2.jsi-team.com/cdr/docs/faq/multiplayer/030.jpeg)

![截图 031：合成配方缺失，无法使用原木合成木板，JEI查询到的木板合成配方异常](https://r2.jsi-team.com/cdr/docs/faq/multiplayer/031.png)

### 进入服务器后部分机械动力配方（如电子管）查询不到，但实际上有配方

退出服务器，开启一个本地存档，然后再重进服务器。

### 老存档充电板配方缺失，新创建存档正常

在聊天框输入如下语句，回车，等待提示 reloaded

/datapack disable "create_new_age:create_new_age_monkey_edition"

![截图 032：老存档充电板配方缺失，新创建存档正常](https://r2.jsi-team.com/cdr/docs/faq/multiplayer/032.png)

推测是存档迁移会导致不该生效的 机械动力电气时代[monkey edition] 数据包生效，它会移除充电板的配方。

![截图 033：老存档充电板配方缺失，新创建存档正常](https://r2.jsi-team.com/cdr/docs/faq/multiplayer/033.png)

### 任务书无法打开 Quest locked

小退世界重进

![截图 034：任务书无法打开 Quest locked](https://r2.jsi-team.com/cdr/docs/faq/multiplayer/034.png)

### 任务书是空的

安装有问题，本地游戏请重新安装，联机请让服主重新按正确步骤安装

![截图 035：任务书是空的](https://r2.jsi-team.com/cdr/docs/faq/multiplayer/035.png)

### 精妙背包无法打开，日志内有 Failed to create screen for menu type: sophisticatedbackpacks:backpack 报错

JAVA版本应使用17，而非21

### 放下烤箱用鼓风机后崩溃

尝试关闭光影后进入。

然后检查崩溃前游玩使用的光影是否是有colorwheel补丁的版本（详见下面光影问题）

### 部分方块和物品名称变为空气；材质错误；单次游戏内二次进入单人世界显示数据包错误；联机时非主机玩家放置方块导致客户端崩溃

由 ships及时雨巷 发现并提供解决方法

问题原因推测（by @蓝蟹）：跨整合包版本迁移存档，新整合包版本更新了mbd2模组，导致迁移来的旧存档level.dat与新版本mbd2不兼容。也有可能是整合包增加了机器导致的

注意：每一个存档迁移的版本可能都会有这个问题。该问题其他的体现为：进入世界后退出再次进入世界会显示“数据包错误”。

解决方法：

- 使用 nbt 修改器删掉原来 level.dat 里面 fml 子项里的所有东西，然后就可以正常进入存档，会在重新进入存档时自动生成新的、没有问题的fml子项数据。

- NBT修改可参考：

[该类型的内容暂不支持下载]

如果不会使用nbt修改器，可：

- 新创建一个存档，然后使用新存档的level.dat替换需要修复的存档的level.dat

- 问题

- 新生成的世界因为seed和老存档不一致所以区块边界衔接不平滑

- 可在新建存档的时候指定相同的种子解决

- 非服务器环境下（如单人游玩 或 在客户端内开启局域网联机），会导致玩家数据丢失

- 可先把物品都存放到箱子里来减少损失。

![截图 036：部分方块和物品名称变为空气；材质错误；单次游戏内二次进入单人世界显示数据包错误；联机时非主机玩家放置方块导致客户端崩溃](https://r2.jsi-team.com/cdr/docs/faq/multiplayer/036.png)

![截图 037：部分方块和物品名称变为空气；材质错误；单次游戏内二次进入单人世界显示数据包错误；联机时非主机玩家放置方块导致客户端崩溃](https://r2.jsi-team.com/cdr/docs/faq/multiplayer/037.png)

### 使用喷气背包飞行时卡顿：无法放置方块，背包内物品移动到快捷栏之后一段时间会直接回到背包

回退喷气背包版本到4.4.1（mod名称 create_jetpack-forge-4.4.2.jar ）

![截图 038：使用喷气背包飞行时卡顿：无法放置方块，背包内物品移动到快捷栏之后一段时间会直接回到背包](https://r2.jsi-team.com/cdr/docs/faq/multiplayer/038.png)

[机械动力:喷气背包 (Create Jetpack) - MC百科|最大的Minecraft中文MOD百科](https://www.mcmod.cn/class/7338.html)

### 单人档退出世界时卡住/时间过长

- 整合包加入了c2mef以提升区块加载性能，同时因为其机制，不可避免地会拉长 退出世界时的保存时间 & 创建世界的初始化时间。

- 另外，c2mef和夸克板条箱也有冲突，会导致板条箱内的内容消失。

- 如果不在乎跑图生成区块耗时上涨，可以直接禁用c2mef。

- c2mef已于v0.4.7.11移除

[该类型的内容暂不支持下载]

### 显示问题

为了提高fps，整合包加入了较多渲染优化模组，在遇到渲染显示问题的时候可以尝试禁用下述两个模组，但渲染性能可能会受到影响

- Accelerated Rendering

- Entity Culling

整合包内其他渲染优化模组（不分先后）

- Vanillin

- Colorwheel

- Create Better FPS

- CullLessLeaves Reforged

- Flerovium

- Embeddium

- Sodium/Embeddium Extras

#### 箱子上面是黑的；工具箱是白的 等

![截图 039：箱子上面是黑的；工具箱是白的 等](https://r2.jsi-team.com/cdr/docs/faq/multiplayer/039.jpeg)

![截图 040：箱子上面是黑的；工具箱是白的 等](https://r2.jsi-team.com/cdr/docs/faq/multiplayer/040.jpeg)

AMD/Intel显卡问题，参考：https://bbs.mcmod.cn/thread-16131-1-1.html

可通过 关闭飞轮优化 /flywheel backend off 解决，但可能导致后续机械动力的实体渲染卡顿。

#### 机械动力移动实体变透明

先尝试F3+A重载材质看能否恢复正常

如果不行，尝试禁用entity culling这个模组。（可能导致帧率轻微下降）

更新Colorwheel版本到最新。

![截图 041：机械动力移动实体变透明](https://r2.jsi-team.com/cdr/docs/faq/multiplayer/041.jpeg)

#### 我的风车/水车一直在鬼畜怎么办？

机械动力经典问题，请尝试F3+A重载所有区块。

#### 隼巢胸甲渲染bug（机素防护）

本模组已于0.4.8以上移除。

模组本身材质缺失。

![截图 042：隼巢胸甲渲染bug（机素防护）](https://r2.jsi-team.com/cdr/docs/faq/multiplayer/042.png)

#### 看向机械动力装甲（机素防护）时fps严重下降

尝试禁用Accelerated Rendering

机素防护mod本身bug较多（本模组已于0.4.8以上移除）

### 整合包内的光影(v0.4以及以后)；colorwheel报错not compatible

为了使机械动力的飞轮兼容光影，整合包使用了[Colorwheel](https://www.mcmod.cn/class/20111.html)。  Colorwheel要求光影必须打补丁，为避免分发光影本体，整合包使用启动器下载光影并配合[Colorwheel Patcher](https://www.mcmod.cn/class/20210.html)自动给光影打补丁，这会导致 未打补丁 和 打补丁 的光影同时出现在光影选择列表里，请使用未被划删除线的光影。

![截图 043：整合包内的光影(v0.4以及以后)；colorwheel报错not compatible](https://r2.jsi-team.com/cdr/docs/faq/multiplayer/043.png)

选择错误可能导致包括但不限于看到烤箱用鼓风机崩溃等问题，请务必选择正确的光影。

选择错误光影时会看到聊天框出现报错信息

![截图 044：整合包内的光影(v0.4以及以后)；colorwheel报错not compatible](https://r2.jsi-team.com/cdr/docs/faq/multiplayer/044.png)

并非所有光影都支持ColorWheel，具体支持列表请参考[Colorwheel curseforge](https://www.curseforge.com/minecraft/mc-mods/colorwheel)

请知悉，使用其他光影带来的渲染问题整合包制作组没有能力解决，请反馈给[Colorwheel](https://www.mcmod.cn/class/20111.html)或者光影开发者。

对于低配电脑，推荐使用Complementary + Euphoria Colorwheel并修改光影配置到极低。

## 进入游戏后 非游戏内容的功能性问题

### 整合包有连锁吗？

有，请按住 ~ 按键触发连锁。

### 任务书打不开，显示Quest Locked

退出重进多试几次，如果仍然发生请重新安装整合包

![截图 045：任务书打不开，显示Quest Locked](https://r2.jsi-team.com/cdr/docs/faq/game-errors/045.jpeg)

### 材质变成原版材质了，如何恢复？ OR 想要换回原版材质，如何更改？OR 为什么开启的栅栏门有绿色边框？

整合包使用的材质包为XK材质包（见作者b站动态：https://space.bilibili.com/5930630），如右图红框圈中的两个，注意高亮需要放在上面。

如果想要使用其他材质，则可移动右边圈选的两个材质包到左边，改为自己想用的。（图中缺少了一个，实际上squarefulcolorfulheart也要禁用）。

如果不想要栅栏门出现绿色边框，可以移动右边的XK高亮到左边

![截图 046：材质变成原版材质了，如何恢复？ OR 想要换回原版材质，如何更改？OR 为什么开启的栅栏门有绿色边框？](https://r2.jsi-team.com/cdr/docs/faq/game-errors/046.png)

### 为什么中文翻译没了/缺失？

进入资源包界面拉到最下面，确认红框圈住的四个资源包是否都添加了，且顺序是否和下图一致。

![截图 047：为什么中文翻译没了/缺失？](https://r2.jsi-team.com/cdr/docs/faq/game-errors/047.png)

### 为什么进游戏后我的皮肤没生效？如何设置皮肤？

整合包自带万用皮肤补丁，整合包制作组未修改皮肤相关内容，相关问题请自行查阅littleskin攻略

[该类型的内容暂不支持下载]

### fps太低了

笔记本请检查独显是否开启。RTX50系显卡请检查驱动是否更新到最新。

查看视频设置最高帧率是否有限制在60，并尝试降低渲染距离、降低光影配置。

或者GPU占用低的情况下，可使用小黄鸭 Lossless Scaling（需要基础帧率能跑到40+帧才能获得良好体验）、

PS：本整合包是有350+模组 且包含机械动力 的大型整合包，因此对电脑配置有一定基础要求，还请见谅。

PS2：在附近有大量机械动力机器的情况下，卡顿是玩机械动力不得不品的一环，只能删除机械动力解决。

### 如何创建超平坦？

- 整合包使用了terralith与tectonic群系mod，这两个mod会导致超平坦无法生成。禁用这两个mod即可解决。

- 注意：禁用terralith前的世界在禁用terralith后无法进入！！

- 可使用整合包内有的 应急工业平台 来快速平整一块区块大小的地。

### 每游玩5min渲染距离就会被改动是什么原因？

- 整合包安装了优化性能的ServerCore模组，这个模组会根据MSTP动态调整包括渲染距离和模拟距离在内的数据。

- 如果希望不被修改，可以修改config/servercore/config.yml配置文件，把红框圈住的代码里的max和min都改成你想要调整到的数值。

![截图 048：每游玩5min渲染距离就会被改动是什么原因？](https://r2.jsi-team.com/cdr/docs/faq/game-errors/048.png)

[该类型的内容暂不支持下载]

### FTB组队提示未接收到队伍数据

未开启正版验证的服务器无法使用图形界面，需要使用指令。可以在mcmod中查询。

[该类型的内容暂不支持下载]

![截图 049：FTB组队提示未接收到队伍数据](https://r2.jsi-team.com/cdr/docs/faq/game-errors/049.png)

![截图 050：FTB组队提示未接收到队伍数据](https://r2.jsi-team.com/cdr/docs/faq/game-errors/050.jpeg)

### 为什么配方书看不了？如何查看可合成的物品配方？

![截图 051：为什么配方书看不了？如何查看可合成的物品配方？](https://r2.jsi-team.com/cdr/docs/faq/game-errors/051.png)

mc原版的配方书非常消耗资源，和JEI功能重叠，因此被关闭了。

如果需要可合成物品配方，可以在整合包基础上额外安装[EMI](https://www.mcmod.cn/class/6630.html)，即可在右侧边栏切换查看可合成物品，如下图所示：

![截图 052：为什么配方书看不了？如何查看可合成的物品配方？](https://r2.jsi-team.com/cdr/docs/faq/game-errors/052.png)

### 抱起的东西放不下来了？

清空手上物品的指令：/carryon clear

![截图 053：抱起的东西放不下来了？](https://r2.jsi-team.com/cdr/docs/faq/game-errors/053.png)

### 为什么有的物品光标移上去按住shift会有一堆内容？

按下F3+H关闭[高级提示框](https://www.mcmod.cn/item/210715.html)

![截图 054：为什么有的物品光标移上去按住shift会有一堆内容？](https://r2.jsi-team.com/cdr/docs/faq/game-errors/054.jpeg)

### 右侧显示一大堆透明文字 0/x 等，如何关掉？

进入任务书把 固定任务（右上角图标按钮） 关掉。

![截图 055：右侧显示一大堆透明文字 0/x 等，如何关掉？](https://r2.jsi-team.com/cdr/docs/faq/game-errors/055.png)

### 为什么AE内物品会多倍显示？比如说实际只有1个钻石，终端显示有4个

单个容器（如保险库）不要贴多个存储总线。比如2x2x3的保险库，只需要贴一个存储总线。

### 为什么使用小地图无法传送tp？

此问题为mc原版特性，与整合包无关

单人游戏请在创建世界/开启局域网联机时开启作弊。

服务器游玩时请给需要tp的玩家op权限。

### MineMenu的文字乱码

启动器内找到JVM参数配置，加上-Dfile.encoding=UTF-8

v0.4.7.6开始 HMCL和PCL2预期会自动加上这个参数配置。

![截图 056：MineMenu的文字乱码](https://r2.jsi-team.com/cdr/docs/faq/game-errors/056.jpeg)

### hud显示季节卡在春季第一天，和实际季节不一致

![截图 057：hud显示季节卡在春季第一天，和实际季节不一致](https://r2.jsi-team.com/cdr/docs/faq/game-errors/057.png)

目前已知修改游戏内时间会导致此问题，为节气模组的特性，目前制作组还不知道解决方法。

可以尝试使用节气提供的指令 /ecliptic solar 设置节气天数。

## 进入游戏后 游戏内容相关问题

### 找不到tacz原版枪械

本包删除了tacz原版枪械，只保留了机械动力风格的枪械包。

### 商店内无法购买矿物，显示不在白名单

任务书拉到最下面 交易解锁 章节。

### 找不到安山岩

整合包地形模组调整了安山岩的生成群系，请寻找 安山岩洞穴 群系。

可使用探险家指南针，或在有权限的情况下直接使用locate指令搜索terralith:cave/andesite_caves

### 为什么铜锭锌锭搅拌不能产出黄铜？

原版配方已被改动，需要熔融铜和熔融锌搅拌产出熔融黄铜后再冷却，详见JEI和任务书。

v0.3.2.0后会有 锌粒和铜粒加热搅拌4倍慢速合成黄铜粒的配方。

### 为什么我的无限岩浆没效果？

本包修复了流动岩浆也会被记入无限岩浆数量的bug。

现在需要2500格岩浆源才能计为无限岩浆。

### 为什么xx作物/植物长得很慢？

本包包含了节气mod https://www.mcmod.cn/class/16860.html ，反季节且湿度不适宜的情况下生长很慢。

具体解决方案请查看任务的“四时行焉”章节。

### 为什么在某些地上种不了小麦？

引用自Minecraft Wiki：

在Java版中，亮度等级≤7时无法对耕地使用小麦种子，已种植的小麦植株也会在接收到方块更新时掉落为物品实体。

### 为什么带箱子的动态结构无法正常工作/无法从箱子里获取物品？

请勿使用夸克添加的变种箱子，使用原版箱子或木桶。

v0.4.6.1(还在测试)以及以后添加了相关mod以支持夸克的变种箱子或精妙背包。

![截图 058：为什么带箱子的动态结构无法正常工作/无法从箱子里获取物品？](https://r2.jsi-team.com/cdr/docs/faq/rendering/058.png)

### 如何制作x级别的锤子？

本包的魔改中龙钢锤为七级锤，悚怖钢/末影钢锤为八级锤。镶嵌下界之星可增加一级，镶嵌纯粹黑暗可增加两级。锤头速度打磨满后也可加一级锤子等级。具体内容请查看tetra的任务。

### 为什么流体管道不工作了？

- 先尝试扳手切两下相关动力泵的方向。

- 检查是不是把 护甲装配台 接到管道上了。

- 参考qq频道内帖子：https://pd.qq.com/s/hho29um5j

### 冰与火的小精灵偷我东西

config文件夹下找到冰与火配置文件，将Pixies Steal Items改为false。

如果有人因为被偷了东西来打制作组，蓝蟹第一个投降┗( ´・∧・｀)┛

![截图 059：冰与火的小精灵偷我东西](https://r2.jsi-team.com/cdr/docs/faq/rendering/059.png)

![截图 060：冰与火的小精灵偷我东西](https://r2.jsi-team.com/cdr/docs/faq/rendering/060.png)

[该类型的内容暂不支持下载]

### 蟑螂/苍蝇好多

可以先使用指令杀死所有蟑螂：/kill @e[type=alexsmobs:cockroach]

禁止蟑螂生成可以让服主打开config/alexsmobs.toml，搜索cockroachSpawnWeight和cockroachSpawnRolls，改为0。然后重启服务器。

苍蝇类似。

![截图 061：蟑螂/苍蝇好多](https://r2.jsi-team.com/cdr/docs/faq/rendering/061.png)

未禁用苍蝇的原因：

![截图 062：蟑螂/苍蝇好多](https://r2.jsi-team.com/cdr/docs/faq/rendering/062.png)

### 为什么陈酿桶GUI打不开？

陈酿桶的所有酿酒配方均已统一到饮酒作乐的发酵桶，因此禁用其GUI避免误导玩家。

没有完全删除是因为还有村民职业要绑定这个工作方块。

### 熔铸盆熔化金属液之后没有出液口怎么办？

在下面有容器接出液的时候，扳手右键熔融盆。

### 为什么熔融铁和煤无法熔铸搅拌器制作熔融钢？

检查你是否是在同一个熔融盆里融化的铁，如果是需要先把熔融铁拿出来再输回去。

这是因为单一个熔融盆/工作盆均无法把上一个配方的输出直接用作下一个配方的输入，需要拿出来再放回去，或者输出到另一个盆再执行下一个配方，该bug已在冶金学0.0.7（整合包v0.4.5.0以及以后）修复。

### 要塞结构太复杂了找不到传送门

我们添加了Integrated Stronghold模组，对要塞做了改动需要解密，如果懒得解密可以：

- 抄作业

- 进入大厅，以有这个旗子的为正，沿着路一直朝前走，遇到方块就拆，直到出现与该结构不一样的方块，

- 这边以安山岩为例，直接向下挖，一直挖到y=-16到-14为止，

- 这边会掉到一个小空间，会有怪但不必管他，我们直接朝西面走、贴着右手边的墙一直向西挖，会依次经过两组水车

- 第二组水车依然贴着右手向地图上的西方挖，可以直接挖到末地大厅

![截图 063：要塞结构太复杂了找不到传送门](https://r2.jsi-team.com/cdr/docs/faq/rendering/063.jpeg)

- 或者干脆去另一个有末地传送门的结构，用结构指南针搜索createdungeonbase，或指令/locate structure create_structures_arise:create_dungeon_base里面有传送门。

[该类型的内容暂不支持下载]

### 为什么找不到xx龙？

见任务书，龙在其他维度。

### 找不到xx家具的合成需要用的方块

方块就叫 【工作台】，mrcrayfish模组的

![截图 064：找不到xx家具的合成需要用的方块](https://r2.jsi-team.com/cdr/docs/faq/rendering/064.jpeg)

### alex的洞穴怎么找不到？怎么去？

见任务书

注：史前世界的石灰岩要用 机械动力 的，使用流动蜂蜜+流动岩浆生成。

### 伊甸碎片如何获取？杀凋零骷髅掉率很低？

100难度以上才可以通过击杀凋零骷髅获取伊甸碎片，如果感觉掉率太低请先提升难度。

### 使用装有燃料的安山桶喂烈焰人燃烧室时安山桶会被一并吃掉

相关mod的兼容有问题，可以按住shift再右键喂以保留安山桶。

### 机械手使用 桶装岩浆 喂烈焰人燃烧室时反复喂一个

相关模组的兼容性bug，建议直接将液体燃料泵入烈焰人燃烧室。

### 商品交易终端配置好交易后仍然不交易

检查右上角是否从始终禁止改为了激活。

![截图 065：商品交易终端配置好交易后仍然不交易](https://r2.jsi-team.com/cdr/docs/faq/rendering/065.png)

### 商品交易终端无法使用钱包里的货币

交易终端方块使用的是银行内的钱，请先把钱用ATM存入银行。

![截图 066：商品交易终端无法使用钱包里的货币](https://r2.jsi-team.com/cdr/docs/faq/rendering/066.png)

### 为什么屠宰动物不出产物？

根据qq频道的玩家反馈，不要把动物架太高，3格高度就行，再高了不出产物。

### 为什么制作咖啡的水壶无法做出咖啡/需要重启才能做出来？

农夫暇事 ＆ 饮酒作乐均需要 先加入流体 再加入物品材料。

![截图 067：为什么制作咖啡的水壶无法做出咖啡/需要重启才能做出来？](https://r2.jsi-team.com/cdr/docs/faq/rendering/067.png)

### 蓝图大炮打印出的lc商店交易终端无法破坏

这是因为蓝图大炮打印出的交易终端没有所属用户，只有lc的管理可以破坏。

在有权限的情况下使用指令/lcadmin toggleadmin，进入lc的管理模式，就可以敲掉了。

### 雪傀儡冷冻室如何使用？

管道通入凛冰燃料 or 喂烈焰蛋糕

### 为什么采集的作物没有品质

需要手动且非连锁采集才能够收获有品质的作物。如需批量采集可使用钻石锄右键。

### 为什么xx（动力锯，砂带磨床，粉碎轮）的输出乱飞/反向

检查通入应力的转向是否反了，粉碎轮需要额外关注两轮是否不同转向。

### xx多方块（大坝、核电站、合金电炉等）为什么不成型？

使用任务书内提到的mbd工具调试模式可以看未成形原因

### 为什么转速齿轮箱不会改变转速

按住W思索，并看完。

### 为什么无法合成AE枪械使用的电池/弹夹？

需要完全充满电的电池。

如果直接连入AE网络而非使用AE充能器充电，可能会出现差一点点满电的情况。

![截图 068：为什么无法合成AE枪械使用的电池/弹夹？](https://r2.jsi-team.com/cdr/docs/faq/rendering/068.png)

### 分馏塔为什么3x3还是很慢，是bug么？

柴油动力作者在某次更新后取消了分馏塔效率和尺寸之间的关系，作者已经在[github issue](https://github.com/george8188625/Create-Diesel-Generators/issues/173)中明确这是刻意的修改而非bug。

如果有需要可以向柴油动力作者提要求恢复效率和尺寸之间的关系。

![截图 069：分馏塔为什么3x3还是很慢，是bug么？](https://r2.jsi-team.com/cdr/docs/faq/rendering/069.png)

## 开服相关

面板服开服相关问题请优先联系面板服客服，制作组提供的服务端仅是为了方便制作组自己开启 齿轮盛宴官方公益服务器，因此存在不完善的地方，请见谅。

### 有不需要通过执行start脚本下载内容的完整版服务器端吗？

没有，mojang官方用户协议规定任何人不得二次分发minecraft本体，因此制作组受限于minecraft的用户协议约束无法合法提供安装好的完整版服务端。

https://www.minecraft.net/zh-hant/eula

![截图 070：有不需要通过执行start脚本下载内容的完整版服务器端吗？](https://r2.jsi-team.com/cdr/docs/faq/client-features/070.png)

### 没有run.sh文件该怎么写启动脚本？

见[齿轮盛宴整合包 信息汇总](https://xr5r5e86lk.feishu.cn/docx/LE9ud6DgXoBaQhxowJucOQVqnWb)里的开服部分。

### 服务器启动脚本报错 contained no existing paths: [libraries\...

forge安装过程中下载依赖库文件失败，请尝试其他网络环境 or 开启加速器/vpn(或更换挂的加速器/vpn)

![截图 071：服务器启动脚本报错 contained no existing paths: [libraries\...](https://r2.jsi-team.com/cdr/docs/faq/client-features/071.png)

### 服务器磁盘吃的好多一下子就满了，为什么？

简单备份simplebackup会保留10份至多25G存储空间的存档备份（v0.4.5.3以及以后会改为5份 10G），如果磁盘已满可删除simplebackup文件夹下的备份，并修改config/simplebackups-common.toml配置文件，[配置文件介绍文档](https://www.mcmod.cn/post/4675.html)。

## 其他

### 我存档炸了，能救吗？存档备份文件夹是哪个？

游戏目录下的simplebackup，里面是各个时间的世界的存档，直接解压到saves下即可。

![截图 072：我存档炸了，能救吗？存档备份文件夹是哪个？](https://r2.jsi-team.com/cdr/docs/faq/gameplay/072.png)

### 自从给我家AE插了空间锚服务器就巨卡，怎么办？

恭喜你，染上了谁用谁卡服之锚

关闭服务器，备份存档。

然后到各个维度下的chunks.dat里，使用任意NBT编辑器删除如下ae2的标签

NBT编辑器可用：

[该类型的内容暂不支持下载]

![截图 073：自从给我家AE插了空间锚服务器就巨卡，怎么办？](https://r2.jsi-team.com/cdr/docs/faq/gameplay/073.png)

![截图 074：自从给我家AE插了空间锚服务器就巨卡，怎么办？](https://r2.jsi-team.com/cdr/docs/faq/gameplay/074.png)

### 我找不到官方服务器群的密码了，怎么办？

急急急，怎么就不知道看官网呢？

请你前往我们的官方网站，划到最下面就有了

www.齿轮盛宴.com

## 修改整合包

制作组成员精力有限，无法解决整合包内容修改后出现的错误，请自行排查解决。

以下内容均为群友自行测试的结论，汇集在这里供参考，制作组不对这些内容的正确性做任何保证。

### 灵魂出窍？

安装freecam

### 自行增加的需要额外注意的mod

遥远地平线：可能需要2.4.5b版本才能正确渲染（参考issue https://github.com/TeamTeaMC/Ecliptic-Seasons/issues/155）

YSM（较旧的版本可能与bettercombat不兼容）

匠魂（其熔融金属与冶金学的熔融金属不完全能够兼容且贴图一致，很难看出区别）

瓦尔基里 稳定性差，制作组不会对加入后整合包的稳定运行做出任何保证。

Tweakerge 部分功能如果开启可能导致诸如龙尸直接消失无法获得战利品等问题。

森罗物语 与农场物语及其附属没有完全兼容，可能出现物品无法通用问题

### 不建议增加的mod

加入了整合包内已有矿物的mod（部分魔改配方未使用标签，会导致矿物不通用的问题）

### 增加枪包

本包使用的tacz版本为1.1.4，暂时没有更换预期。使用仅支持其他版本的枪包可能会出现问题。

### 修改高度限制

修改config文件夹下的tectonic.json文件中的max_y项的值。

## 还有其他问题要反馈？

- v0.4.7.x正式版加入的游戏内反馈仅有文字可能描述不清，因此无法保证及时处理，如有严肃反馈依然建议走下述问题反馈流程填写反馈表。

- 确认整合包版本是否为最新，看标题界面右下角两行小字或游戏标题，红框圈住位置或游戏标题会有 v0.x.x.x 形式的整合包版本。最新整合包版本可通过三个小人下方的公告确认。如果不是最新，请先更新到最新以避免反馈已修复的bug。

![截图 075：还有其他问题要反馈？](https://r2.jsi-team.com/cdr/docs/faq/misc/075.png)

- 请确认自己是否对整合包内的mod、kubejs脚本、mbd2文件等做了增删，整合包本体已经有大量的适配和兼容bug需要修复，制作组没有足够精力解决玩家自行修改整合包后的报错和反馈。

- 如果是服务器游玩中的问题，请先联系服务器服主，确认服主是否正确安装了整合包，或是否对整合包服务端做了修改。（官方服务器可以通过论坛：https://forum.tcs-team.cn/反馈）

- 如果是崩溃或者明显的异常

- 请收集报错信息。一般可进入日志文件夹获取latest.log

![截图 076：还有其他问题要反馈？](https://r2.jsi-team.com/cdr/docs/faq/misc/076.png)

- 使用 https://mclo.gs/ 网站保存自己的报错信息，得到一个报错分享链接

- 求助时带上报错分享链接。

- 填写反馈文档（接受对整合包的修改建议）：[问题反馈填写链接](https://xr5r5e86lk.feishu.cn/share/base/form/shrcnIDUxvX4oOvWSQaddJUht9b) ；[已知问题查看](https://xr5r5e86lk.feishu.cn/share/base/view/shrcnO1e5x7PXEFGptoVzZU8CGg)

- （如果有能力）直接前往齿轮盛宴整合包的[github repo提Pull Request](https://github.com/Jasons-impart/Create-Delight-Remake/compare)。
