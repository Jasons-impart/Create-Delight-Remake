# KubeJS相关开发文档链接
- https://docs.qq.com/doc/DWVVpeGFrSE1sSGpj

# 正式版本发布流程
- 修改pack.toml中的版本号，并提交mr合并入main分支
- 使用git给main分支上修改版本号的这个commit打上对应版本的tag（v0.3.x.x），并将tag推送到github上
- 把main分支最新commit（即版本修改commit）推送到github上的 release 分支
- 在github的[tags](https://github.com/Jasons-impart/Create-Delight-Remake/tags)页面从新版本的tag创建release，并填写改动信息
- 【待自动化】github action自动产出后，将服务端、客户端、补丁下载下来提交到release上

# 测试版本发布流程
- 将代码推送到github的test-release分支
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

# 关于整合包已有的优化模组（供新增时参考）
- Embeddium
  - 渲染优化 https://www.mcmod.cn/class/12028.html
- Sodium/Embeddium Extras
  - 渲染优化 https://www.mcmod.cn/class/5312.html
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