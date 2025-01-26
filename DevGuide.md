# KubeJS相关开发文档链接
- https://docs.qq.com/doc/DWVVpeGFrSE1sSGpj

# 发布流程
- （可选）修改pack.toml中的版本号
- 提交代码到 test-release 或 release 分支
- test-release发布的文件名会额外带上时间戳方便区分
- 到 https://github.com/Jasons-impart/Create-Delight-Remake/actions 查收结果

# 增加客户端mod
- 为了方便生成服务端包，请在增加后更新.clientonlymodlist文件

# 发包使用的工具
- packwiz https://packwiz.infra.link/tutorials/creating/getting-started/
- 因为原始repo的发布文件已经过期，使用了个人fork的版本：https://github.com/wanquanw/packwiz-build

# 修改整合包内的默认配置
- 直接修改整合包内的.options.txt文件即可，发包时会将这个作为整合包的默认配置
- 包括但不限于：键位设置、加载的资源包和加载顺序

# 修改整合包服务器核心jvm参数配置样例
- 修改.user_jvm_args.example.txt，发包时会带上。不会直接生效，给用户自己参考。

# 关于整合包升级补丁
- 当前会生成相对于最近一个git tag的补丁包
- 由于简单的覆盖无法处理删除文件的情况，并不能保证补丁能100%正常运作。暂时没有写bat以支持删除对应文件的计划。
- 对于mods文件夹下的改动，因为涉及到mod本体，不会包含在补丁包中，取而代之的是一个mod变化列表文件，放在补丁包根目录。