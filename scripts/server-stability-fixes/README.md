# 服务器崩溃补丁生成与回归

本目录生成四个 Hotai MemoryDiff，并使用实际转换器进行首次转存、序列化、apply/undo 和 DiffTransformer 重放。目标类 SHA-256 不匹配时拒绝生成，不能直接套到任意新版模组。

| 模组 | 本分支版本 | 跟踪 |
|---|---|---|
| Functional Storage | 1.2.14 | #2614 |
| Multiblocked2 | 1.0.38.a | #2616 |
| Applied Create | 1.1.6 | #2617 |
| Ecliptic Seasons | 0.13.8.1 | #2619 |

准备 Python 3、JDK 17+、与 Packwiz 元数据一致的原版目标 JAR，以及包含以下依赖的运行目录：ASM/asm-tree/asm-analysis 9.8、Hotai 1.0、ModLauncher 10.0.9、SLF4J API 2.0.1、fastutil 8.5.9。依赖从运行目录的 `mods/` 和 `libraries/` 读取，不上传第三方 JAR。

从仓库根目录执行，替换路径；每次使用新的输出目录：

```sh
python scripts/server-stability-fixes/ender-storage/build.py --server /path/to/runtime --jdk /path/to/jdk/bin --out /tmp/ender-check
python scripts/server-stability-fixes/mbd-fuel/build.py --server /path/to/runtime --jdk /path/to/jdk/bin --out /tmp/fuel-check
python scripts/server-stability-fixes/season-p2p/build.py --server /path/to/runtime --jdk /path/to/jdk/bin --out /tmp/season-p2p-check --weather-jar /path/to/ecliptic-seasons.jar
```

输出中的 `converted/hotai/` 为补丁，`manifest.json` 记录输入 JAR、原始 class 和输出补丁的摘要，`test-results.txt` 记录验证结果。将生成补丁的 SHA-256 与 `validation/` 清单及仓库 `hotai/` 文件比较；输出目录请放在仓库外。

回归先复现原类错误，再检查修复类：末影库存验证完整目标类、持久化和虚拟世界隔离；其余测试在最小游戏 API 替身中执行真实目标方法字节码。节气的并发测试仅证明该节流调用不访问共享世界 RNG，不证明整个世界访问线程安全；停服测试覆盖两种停服标志及任务清空，不覆盖所有停服卡死来源。小样本概率统计只作为冒烟检查。

服务器此前已加载四项补丁，完成保存及一次正常停服/再启动；完整 main 整合包、原蓝图场景及主动崩溃场景未在本次重演。方法语义、边界和上游复核条件见 [Hotai 明细](../../docs/dev-knowledge/hotai/badiff-details.md#服务器崩溃兼容补丁)。SPP #2615 在其源码仓库单独修复，不在这里叠加 AE2 容器替换补丁。
