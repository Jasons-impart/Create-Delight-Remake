# KubeJS相关开发文档链接
- https://docs.qq.com/doc/DWVVpeGFrSE1sSGpj

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
- 以新配方替换原配方时，最好用相同的配方 id 直接覆盖。
- 小刀的配方应当使用cutting_2函数增加，其会将tetra的模块化刀的配方一并加入。
- 需要加入离心机的配方时请考虑使用centrifugation函数，其会加入三种离心机（vintageimprovement，小型，大型）的配方。

## 加入mod规范

### 加入食物类型mod
- 排除重复的食物。删除其配方，并且移除其在jei中的显示或者直接从创造模式物品栏中移除。
- 修改食物的配方。如果能够更合理则将其变得更合理，或者将其与整合包总体风格适配。
- 作物与静谧四季兼容。为作物物品以及作物方块根据现实收获时间打标签。
- 原材料与料理乐事兼容。为其增加料理乐事的属性。
- 与三明治mod兼容。如果有合适的流体则将其加入三明治的酱类兼容中。

# 正式版本发布流程
- 修改pack.toml中的版本号，并提交mr合并入main分支
- 使用git给main分支上修改版本号的这个commit打上对应版本的tag（v0.3.x.x），并将tag推送到github上
- 把main分支最新commit（即版本修改commit）推送到github上的 release 分支
- 在github的[tags](https://github.com/Jasons-impart/Create-Delight-Remake/tags)页面从新版本的tag创建release，并填写改动信息
- 【待自动化】github action自动产出后，将服务端、客户端、补丁下载下来提交到release上
- 踢一脚Jason让他更新[Gist](https://gist.github.com/JasonQ1123/14894447c0cf3254e307a1793efcefa4)，以实现标题界面的新版本提示，对应config/fancymenu/customization/craete.txt

# 测试版本发布流程
- 将代码推送到github的test-client / test-server / test-patch分支，分别生成对应的测试版本
- 到 https://github.com/Jasons-impart/Create-Delight-Remake/actions 查收结果

# 增加客户端mod
- 为了方便生成服务端包，请在增加后更新.clientonlymodlist文件

# 发包使用的工具
- packwiz https://packwiz.infra.link/tutorials/creating/getting-started/
- 因为原始repo的发布文件已经过期，使用了个人fork的版本：https://github.com/wanquanw/packwiz-build

# 修改整合包内的默认配置
- 直接修改整合包内的.options.txt文件即可，发包时会将这个作为整合包的默认配置
- 包括但不限于：键位设置、加载的资源包和加载顺序

# 修改整合包服务器jvm参数配置
- 修改variables.txt中的`JAVA_ARGS=`后面的内容

# 关于整合包升级补丁
- 当前会生成相对于最近一个git tag的补丁包
- 由于简单的覆盖无法处理删除文件的情况，并不能保证补丁能100%正常运作。暂时没有写bat以支持删除对应文件的计划。
- 对于mods文件夹下的改动，因为涉及到mod本体，不会包含在补丁包中，取而代之的是一个mod变化列表文件，放在补丁包根目录。

# 开发相关tips记录

## 环境配置
- 推荐使用[VSCode](https://code.visualstudio.com/)或者[IntelliJ IDEA Community Edition](https://www.jetbrains.com/idea/download/?section=windows)开发

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
- Colorwheel
  - 使得飞轮优化可以兼容光影 https://www.mcmod.cn/class/20111.html
- Create Better FPS
  - 机械动力在光影下的优化 https://www.mcmod.cn/class/18864.html
- CullLessLeaves Reforged
  - 更好的树叶渲染优化 https://www.mcmod.cn/class/9810.html
- Flerovium
  - 物品、粒子渲染优化 https://www.mcmod.cn/class/17322.html
- ServerCore
  - 优化服务器运算、实体活动范围（可选启用）、动态性能检查、村民脑叶切除术、繁殖上限、区块活动距离 https://www.mcmod.cn/class/6542.html
- Placebo
  - 合成配方加载、匹配优化 https://www.mcmod.cn/class/1023.html
- FerriteCore
  - 内存占用优化 https://www.mcmod.cn/class/3888.html
- Noisium
  - 区块生成性能优化 https://www.mcmod.cn/class/12724.html
- fastboot
  - 启动性能优化，延迟DFU的编译时间 https://www.mcmod.cn/class/15103.html
- Saturn
 - 修复了占用大量内存的内存泄露，如生物群系温度缓存、ticking tracker、生物 AI 清除等 https://www.mcmod.cn/class/7722.html

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
- Krypton Reforged
  - 优化MC的网络堆栈 https://www.mcmod.cn/class/5146.html
  - 建议**仅服务端**安装
- Acedium
  - 使用NV专用OpenGL扩展提高fps https://www.mcmod.cn/class/16808.html
- Fast Paintings
  - 优化画的渲染 https://www.mcmod.cn/class/10999.html
- Mobtimizations - Entity Performance Fixes
  - 服务器实体性能优化模组 https://www.mcmod.cn/class/13755.html
- AllTheLeaks (Memory Leak Fix)
  - https://www.mcmod.cn/class/17405.html
- 修复GPU内存泄漏
  - 和上面的AllTheLeaks不重合可以一起，https://www.mcmod.cn/class/11863.html
- Let Me Despawn
  - 让拿起物品的怪物也会消失 https://www.mcmod.cn/class/7415.html
- **有问题且停更，不加** Async Locator
  - locate指令异步执行减轻卡顿 https://www.mcmod.cn/class/8544.html
  - 测试过会导致locate不返回结果
- Radium Reforged
  - 泛用的优化mod，锂的forge迁移版 https://www.mcmod.cn/class/5580.html
- Nolijium
  - 调整各种效果 https://www.mcmod.cn/class/18050.html
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