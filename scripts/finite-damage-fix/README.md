# 非有限伤害 Hotai 补丁构建与回归

生成两个版本绑定的 `.badiff`，并使用实际 Hotai 1.0 转换器验证首次加载转存、序列化重放和反向恢复。补丁语义、触发链与维护边界见 [方法级说明](../../docs/dev-knowledge/hotai/badiff-details.md#非有限伤害兼容补丁)。

需要 Python 3、JDK 17+，以及带完整 `mods/` 和 `libraries/` 的参考运行目录。脚本只读该运行目录；输出目录必须不存在且位于运行目录之外。原模组 SHA-256 不匹配会拒绝构建。

```sh
python3 scripts/finite-damage-fix/build_and_test.py \
  --runtime /path/to/minecraft \
  --output /path/to/new-output \
  --java-home /path/to/jdk
```

默认读取仓库的 `config/attributeslib.cfg`，可用 `--config` 指定参考服公式。依赖版本为 ASM 9.8、ModLauncher 10.0.9、SLF4J API 2.0.1、Hotai 1.0，均从运行目录读取。未安装 SLF4J 日志提供者时出现 NOP 提示不影响测试。

输出文件：

- `converted/hotai/**/*.badiff`：需要提交到仓库的两个补丁。
- `patch/hotai/**/*.class`：待首次转存的完整类，仅用于构建和本地验证，不提交。
- `replayed/hotai/**/*.class`：通过实际 DiffTransformer 重放得到的类，用于第二轮语义回归。
- `manifest.json`、`test-results.txt`：原模组、产物哈希、使用的公式及测试结果。

`BuildDamageFix.java` 只改蚊子特殊攻击常量，并给四个计算入口加非有限伤害处理。`DamageFixRegression.java` 使用真实 ALCombatRules 和模组自带表达式引擎；Minecraft/Forge API 与配置接口为轻量替身。`HotaiRoundTrip.java` 使用实际 BytecodeTransformer 和 DiffTransformer，校验序列化 diff 的 apply/undo 与两次加载结果。

每轮语义回归共 2,976 项检查，其中 840 次正常有限输入结果逐位比较；还会复现原异常并验证正负无穷和 NaN。完整类与重放类各执行一轮。实际 Forge 启动、其他事件处理器以及游戏内攻击场景仍需另行验证。

安装时只合并对应两个目标，不能同时保留同名 `.class` 与 `.badiff`；已有覆盖需先审查合并。重启后核对两个 `Patched class:` 日志，再验证普通战斗、蟾蜍攻击绯红蚊子、保存退出和再次启动。回退时恢复这两个目标安装前的覆盖状态。
