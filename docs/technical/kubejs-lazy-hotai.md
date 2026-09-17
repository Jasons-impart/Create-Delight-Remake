# KubeJS Lazy 并发缓存补丁（#1736）

## 目的与范围

修复 KubeJS `Lazy.get()` 与 `forget()` 并发访问时可能返回空缓存的问题。
补丁文件为 `hotai/dev/latvian/mods/kubejs/util/Lazy.badiff`，由现有 HotAI 1.0 在启动时应用。
只给实例方法 `get()Ljava/lang/Object;` 和 `forget()V` 增加 `ACC_SYNCHRONIZED`，
等价于两个方法都声明为 `synchronized`。不更改方法体、缓存过期规则或异常传播。
不同 Lazy 实例使用不同的锁，同一实例的资源生成和清缓存串行执行。

不修改 KubeJS/TACZ JAR、Curios 数据、自动重载脚本、packwiz 索引或版本号。
该补丁修复已验证的竞态，并通过本地 Windows 实例的基础游戏回归；
尚未在原报告的 Steam Deck 环境复测，也不涵盖所有饰品丢失原因。

## 适用版本

- 基于 `release-v048x` 提交 `de9a2dc2a6e8f7a4930d8de5a106d993c2178c36`。
- 输入：`mods/kubejs-forge-2001.6.5-build.16.jar`。
- 输入 JAR SHA-256：`3de6b7267d3aab981848ed54d3afe7edf20532fa4060631fd6fffcd99ac5f3d5`。
- 补丁：20 字节，SHA-256：`8281ccd31169e6a7b6b22e30ccc49bf766830135e95f31e85757f0f2587e8642`。

升级 KubeJS、HotAI 或 ASM 后必须重新检查。HotAI 的补丁装载器本身不校验上述 JAR 哈希；
生成/校验工具会校验它。不要将本补丁直接沿用到未经验证的版本。

## 生成与验证

使用 JDK 17 和游戏已有的 HotAI、ASM 9.8、ModLauncher 10.0.9、SLF4J API。
在仓库根目录执行以下 PowerShell 7 命令；按实际环境修改 Java 和 libraries 路径：

```powershell
$java = 'C:/Program Files/Java/jdk-17/bin/java.exe'
$libraries = 'E:/minecraft/Client/HMCL/.minecraft/libraries'
$classpath = @(
    'mods/hotai-1.0.jar'
    "$libraries/org/ow2/asm/asm/9.8/asm-9.8.jar"
    "$libraries/org/ow2/asm/asm-tree/9.8/asm-tree-9.8.jar"
    "$libraries/cpw/mods/modlauncher/10.0.9/modlauncher-10.0.9.jar"
    "$libraries/org/slf4j/slf4j-api/2.0.9/slf4j-api-2.0.9.jar"
) -join [IO.Path]::PathSeparator
rtk proxy $java --class-path $classpath scripts/hotai/KubeJSLazyPatch.java check .
```

`check` 不写入文件；将它改为 `build` 可重新生成补丁。工具在验证成功后才写入补丁。
无需编译上游源码，也不需要生成或部署替换 JAR。

HotAI 的 diff 输入是 `ClassNode` 经 `ClassWriter(0)` 序列化的结果，不能直接用 JAR 内原始 class 字节生成差分。
工具使用 `MemoryDiff.serialize(DefaultSerialization)`，并通过发行 JAR 中的真实 `DiffTransformer`
应用补丁，验证转换后与预期 class 完全一致。`.badiff` 不是 `BadiffFileDiff` 容器格式。

自动验证包括：

- 原 JAR 哈希、补丁可重复生成，以及规范化 class 仅有两个同步标志字节变化。
- 真实 HotAI 转换器往返应用，并将转换后的 class 加载到独立 ClassLoader。
- 缓存命中、forget 后重新生成、过期缓存、supplier 抛异常后的重试语义。
- 8 线程共 200 万次 get/forget；原版作为对照，补丁版必须为零空值。

首次 Java 17.0.12 验证：原版 60,808 次空值，实际补丁版 0 次。
原版竞态计数依赖线程调度，不要求每次都复现；补丁版任何空值均判失败。
命令行测试没有配置 SLF4J 日志后端时，NOP logger 提示不影响校验。

## 游戏内验收与回滚

使用存档副本，完整重启游戏，确认日志出现：

```text
Patched class: dev/latvian/mods/kubejs/util/Lazy
```

验证多次冷启动首次进档、同进程退出后重进、手动 `/reload`，检查：

- 不再出现 `GeneratedData.get()` 的空字节数组异常或 TACZ `GUN_DATA=null` 登录异常。
- 饰品槽、饰品背包及内部物品在保存重启后保持，必要时对比玩家 capability NBT。
- TACZ 枪械同步、JEI 注液配方及流体标签展开正常。
- 独立服务器启动、客户端连接与重载正常。

2026-09-17 本地 Windows 实例已验证：HotAI 加载补丁、首次进档、游戏内重载、退出后重进、正常保存退出。
维护者随后确认完整冷启动进档后饰品完整。首轮日志未出现 `GeneratedData` 空值、`GUN_DATA=null`
或 `Couldn't place player`。这是指定故障链的回归结果，不代表整合包日志没有其他错误；
例如该轮存在 `taczaddon` 背包兼容层的 HUD 异常，应独立排查。

Steam Deck、独立服务器、JEI 注液配方及完整枪械功能仍需专项验证。
尚未测量同条件下的进档耗时或 FPS。实例锁主要会影响同一资源的并发读取，不能承诺零性能损失。
回滚时只移除本补丁文件并完整重启；不要清除玩家数据。补丁不会恢复已经丢失的物品。

## 故障依据

[Issue #1736](https://github.com/Jasons-impart/Create-Delight-Remake/issues/1736) 的
[日志](https://api.mclo.gs/1/raw/BCYVrqJ) 第 8175–8198 行是 KubeJS 资源读取失败，
第 13155–13178 行是随后 TACZ 登录同步的 `GUN_DATA=null`。
日志的 Curios 同步监听器位于抛异常的 TACZ 监听器之后；这说明同步被中断，
但不能单凭日志证明饰品持久化丢失的具体路径。
自动重载脚本曾因 JEI 回归在 #1743 恢复，因此此补丁保留现有重载行为。
