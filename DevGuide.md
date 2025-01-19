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