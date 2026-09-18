# 下界捕食攻击非有限伤害兼容修复计划

## 最新决策：定向将捕食伤害改为 10,000，保留探针待测

用户已批准将蟾蜍捕食绯红蚊的特殊伤害由 `Float.MAX_VALUE` 改为 `10_000.0F`。CDC 新增 `alexsmobs/WarpedToadPredationDamageMixin`，仅匹配该分支唯一极值；普通攻击、事件与死亡流程保留，不实施暴击局部饱和或玩家范围过滤，既有抗性修复继续保留。

实现提交为 CDC `f7b1111`。Java 17 完整 build、既有诊断与真实 SRG/历史导出类回归通过；核对实际 Alex's Mobs JAR 的唯一目标常量以及生产补丁的 named/SRG 选择器与 10,000 返回值。游戏退出后已备份并部署原运行目录，运行 JAR SHA-256 为 `0e867a19e8bf2408df64e3ed8cc9dbabdf4994bfb9fb82dd1e70ff16425b0bab`，旧 JAR 位于 `tmp-opencode/damage-diagnostics-runtime-backup/predation-before/`，`logNonFiniteDamage = true`。这些是构建/部署验证，不代替真实启动与战斗回归。

10,000 是明确选定的测试值，最高阶段装备和减伤组合下的一击击杀仍须验证。诊断探针与本地开关继续保留，等用户确认修复通过后再移除；有限的蟾蜍→绯红蚊伤害样本也进入既有限流日志，避免新数值低于原极值阈值后失去成功证据。

启动先核对 `[CDCore][PredationDamage] Applied ... 10000` 与抗性修复成功标记，再检查普通捕食 10,000、默认单次暴击 15,000、TetraWear/AttributesLib 与后续数值有限、正常死亡且没有 Neruina 新暂停。保持原运行目录测试，不更新发行载荷或合并 PR。以下为历史调查记录，以本节为最新实施范围。

状态：单入口修正版抗性补丁已在真实游戏命中，6 条已记录非暴击捕食的后续管线未观察到非有限值；另一次捕食触发 CDC 叠加暴击，MAX 加上半个 MAX 溢出，经 TetraWear/AttributesLib 复现原反馈相同的 BigDecimal 异常与 Neruina 暂停。当前已定位 main 基线的第二个生产点，尚未修改暴击或捕食规则，MMT 适用范围调整未实施。

## 当前实施状态（2026-09-18）

- 配套源码与测试见 [CDC PR #126](https://github.com/Jasons-impart/Create-Delight-Core/pull/126)，诊断第一版为 `ea26197`，补充版为 `5fde0d2`，首版抗性修复为 `cc8bdc6`，执行顺序修正为 `a095011`。接手时先核对 PR 最新提交与验证状态。
- 用户选择基于父仓 `main`（`72a5eb1`）与 CDC 最新 `1.20.1`（`7113664`），在原运行目录 `CD-master-dev` 的 `codex/damage-overflow-runtime` 分支工作；不使用独立工作树承担测试。
- 已增加 Forge 伤害阶段跟踪、事件实际写入观察、MMT 效果贡献调用者、MMT / TetraWear 实际浮点指令观察，以及 AttributesLib 入参检查点。没有启用玩家范围过滤或数值钳制。
- 完整构建和浮点字节码回归通过；诊断 JAR 已部署至本地 `mods/`，`logNonFiniteDamage = true`。Packwiz 发布载荷未变。原运行 JAR 与配置已备份。
- 首版失败 JAR SHA-256 为 `20f1d7fd7ab9f038c577d70a958bad465384227e2bee8b3308714e3b1739a641`。修正组合入口后的新构建 SHA-256 为 `34f029cfb6027d26c213a3aa08255f7d5d4bdb62be79fdab8ab990a22d446d1b`，来自非 `-all` reobf 构建；配置位置为 `config/createdelightcore-common.toml`。原主线备份位于 `tmp-opencode/damage-diagnostics-runtime-backup/`，第一版诊断备份在其 `pipeline-before/`，修复前的完整诊断版备份在 `resistance-before/`。新构建已在游戏退出后替换原运行 JAR，旧包备份在 composition-before/；接手者重新构建后应记录自己的哈希。
- 操作说明及覆盖边界见 [CDC 修复与诊断说明](https://github.com/Jasons-impart/Create-Delight-Core/blob/codex/damage-overflow-runtime/docs/damage-diagnostics.md)。CDR 本轮只交接文档，未更新子模块引用，直接读取当前子模块基线不会包含修复。下一步获取 CDC 分支最新提交，在当前实例重启并复现，检查修复命中及是否存在后续非有限值。
- 下方 050x 快照保留为调查历史；以本节为当前实施基线。尚未完成原下界异常的复现或最终修复，不能认定根因已经闭环。

### 2026-09-18 00:34 最新实测：抗性通过，暴击溢出复现异常链

运行 CDC `a095011`，哈希与上节一致。00:31:49 启动成功标记确认抗性修复命中；父 Trace #4、#12、#15、#18、#21、#24 记录先 `25 / 25 = 1` 后 `MAX * 1 = MAX`，Damage 入口仍有限，零吸收计算未出现 NaN，生命减法有限后由原有 clamp 归零。

00:34:29 父 Trace #10 / Hurt #11 首次观察到 `EVENT_FINITE_TO_NONFINITE MAX -> Infinity`，写入者为 CDC `AttributeEventsMixin.createdelightcore$useAdditiveMulticrit`，此前 MMT 运算保持有限。攻击者暴击率返回 0.05、暴伤返回 1.5；结合源码 `modifiedDamage += originalDamage * (critDamage - 1)`，确定首次暴击执行 `MAX + MAX * 0.5` 超出 float 上限。内部加法来自源码与事件/属性证据推导，当前未逐指令观察此方法。

随后 TetraWear.ArmorHoning 与 AttributesLib.getAValue 都收到 Infinity，BigDecimal 构造抛出 `NumberFormatException: Infinite or NaN`，Neruina 暂停攻击者蟾蜍。该次 Hurt 监听器内已抛错，尚未到达抗性阶段。当前 main 样本复现了原反馈的异常类型、消费端调用链和暂停对象；未重跑原 0.5.0.11，不断言其生产者与当前 CDC 相同。

暴击溢出是第二个独立问题，数学结果本身超出 float 范围，不能像抗性一样仅调整运算顺序。下一步应评估特殊捕食极值的定向处理，或暴击输出的局部有限饱和策略；保留事件、减伤、取消与死亡语义，并考虑 MMT/Sundering 等其他增伤。尚未选择或实施新数值政策，不因本轮发现直接增加全局 clamp。

本地完整证据为 `tmp-opencode/damage-diagnostics-repro-20260918-0034/`，不随 Git 分发。以下较早阶段的“尚未复现”描述均为历史状态，以本节为最新结论。

### 两次捕食的新证据与补充探针

2026-09-16 22:29:15（Trace #7/#8）和 22:29:25（#9/#10），主世界同一诡异蟾蜍捕食不同绯红蚊。第一版 CDC 探针启动数量为 MMT 10 / TetraWear 1，实际日志一致：

| 位置 | 两次观察值 |
| --- | --- |
| Hurt 输入、MMT `MAX + 0` / `0 + 1` / `MAX * 1` | 有限 `Float.MAX_VALUE` |
| TetraWear / AttributesLib.getAValue 入参 | 有限 `Float.MAX_VALUE` |
| TetraWear 差值 | `MAX - MAX = 0` |
| ForgeHooks.onLivingHurt 返回 | `Float.MAX_VALUE`，`0x7f7fffff` |
| ForgeHooks.onLivingDamage 入参和返回 | `Infinity`，`0x7f800000` |

这两次没有 BigDecimal 异常或独立的 Neruina 暂停异常记录；诊断的 observation stack 不能当作游戏抛错。两次场景不是原下界现场，不能用此结果证明原报告已完全复现。作者本地日志快照保存在 `tmp-opencode/damage-diagnostics-repro-20260916-2229/`，不随 Git 分发。

同次启动导出的 LivingEntity（22:15）有一个强候选：AttributesLib 的 `apoth_sunderingHasEffect` 重定向恒真，空抗性效果时 `apoth_sunderingGetAmplifier` 返回 -1，使原抗性路径仍计算 `damage * 25 / 25`。`Float.MAX_VALUE * 25` 必然溢出，但旧探针未记录这条实际指令，下一次仍要用运算日志验证，不直接把候选宣布为原 BigDecimal 异常的根因。

补充版新增 LivingEntity/Player.actuallyHurt 父作用域和低优先级合并类观察，覆盖两个事件之间的护甲、抗性、附魔保护、吸收，以及同类可达 Mixin/lambda；记录 float/double 运算、D2F、方法返回值与可取得的 Mixin 来源，并覆盖 CombatRules/ALCombatRules。新一轮验证首先检查 `[DamageDiagnostics] Pipeline` 覆盖清单，再找 `FIRST_NONFINITE_OBSERVED` 中具体操作数与指令位置。

Java 17 完整构建、mapped/SRG 实际类、上次导出的合并 LivingEntity 的 ASM 栈校验，以及 JVM fixture 的数值、提前退出、异常与 lambda 回归通过。补充版随后完成真实启动和多次捕食，结果见下节。另一个开发辅助模组 `damage_trace` 在旧启动中因 `IEventListener[]` 强转 `AtomicReference` 失败而未安装监听器包装，其空日志不能作为没有异常的证据；该问题独立于有效的 CDC 记录，本轮未修改该模组。

### 2026-09-17 第二轮结果：抗性乘法已被运行证据确认

补充版已成功启动，新 Pipeline 清单为 LivingEntity 59 / Player 18 / CombatRules 6 / ALCombatRules 46 个探针。23:07:33—23:07:48，父 Trace #1、#4、#7、#10、#13、#16、#19 均在护甲方法返回有限 MAX 之后首次记录：

```text
LivingEntity.getDamageAfterMagicAbsorb / m_6515_
LivingEntity.java:1587, insn=39
3.4028235E38 [0x7f7fffff] * 25.0 [0x41c80000] = Infinity [0x7f800000]
LivingEntity.java:1589, insn=45
Infinity [0x7f800000] / 25.0 [0x41c80000] = Infinity [0x7f800000]
```

此前静态候选已转为本轮捕食的已确认数值生产点：AttributesLib 重定向使无抗性时仍执行该路径，MAX 在中间乘法溢出。MMT/TetraWear 不是这些样本的首个异常生产者。后续吸收计算出现 `Infinity - Infinity = NaN`，吸收值 getter 返回 NaN；原有健康值 clamp 最终使生命为 0，不能以“正常吃掉”判定数值安全。

本轮未出现 `ORIGINAL_EXCEPTION` 或 BigDecimal `NumberFormatException`，仍是主世界样本；原下界截图的异常发生得更早，不能宣称已完整解释。下一步应优先评审抗性算术的定点修复，检查普通数值精度、抗性等级、Sundering、旁路伤害及极值行为，再决定阶段 B/C 是否仍需额外兼容措施。当前只更新诊断结论，不实施规则修改。

本地完整证据快照为 `tmp-opencode/damage-diagnostics-repro-20260917-2307/`（日志及导出类，不随 Git 分发）。日志受限频约束，上述是已记录的独立父 Trace，不代表用户实际捕食总次数。

### 已批准并实施：先算抗性比例

用户选择直接将 `damage * factor / 25.0F` 改为 `damage * (factor / 25.0F)`，接受运算顺序改变带来的微小舍入差异。CDC `ResistanceDamageTransformer` 精确匹配抗性方法唯一的乘除指令对，移动浮点除法并删除原后置除法；不改变系数、原始伤害副本、旁路标签、Sundering 和后续处理。当前由 `LivingDamagePipelineArithmeticMixin` 的单个 postApply 调用 `DamagePipelinePreparation`，先修复再安装探针，不依赖两个 marker 的相对优先级或诊断开关。

完整 build、实际 mapped/SRG 与上一轮合并类校验通过，JVM 执行改写 fixture 覆盖 MAX、抗性等级、旁路、Sundering、非有限及异常等级。5000 个普通伤害采样的最大相对舍入差约 `1.59E-7`，不是全输入域上界。无抗性到抗性 V 的 MAX 与零吸收路径保持有限。

首版部署后的真实启动失败，详情见下节。新版本验收首先检查 `[CDCore][ResistanceDamage] Applied ratio-first ... before probes`，再用新绯红蚊捕食确认 `25 / 25 = 1`、`MAX * 1 = MAX`，继续检查 Damage 入参、吸收和生命阶段的首个异常值。Sundering 后续增伤等仍可能放大极值，当前保留诊断并逐项确认，不提前修改其他公式或宣称原下界异常已闭环。

### 2026-09-18 第三轮：发现补丁与探针顺序错误

00:09:14 启动先安装 LivingEntity 探针，再应用独立 `ResistanceDamageMixin`，导致 `Expected exactly one resistance damage*factor/25 sequence ... found 0`。非 required Mixin 失败后游戏继续运行。00:13:10—00:13:24 的 7 个独立父 Trace（#1、#4、#7、#10、#13、#16、#19）仍记录旧公式的 `MAX * 25 = Infinity`，没有 `ORIGINAL_EXCEPTION` 或 `NumberFormatException`。这是修复未命中，不是新发现的后续溢出点。

首版用 priority 2/1 推断 postApply 顺序不成立；旧测试单独先修复再插桩，没有覆盖生产入口组合。现删除独立修复 marker，改为同一个入口顺序执行。新增回归复现错误顺序的零匹配，并直接执行生产组合生成的 JVM fixture；完整 build、实际 SRG 和本轮导出类的栈校验通过。真实启动及捕食验证仍待完成。

本地失败证据保存在 `tmp-opencode/damage-diagnostics-repro-20260918-0013/`，不随 Git 分发。进入游戏或目标死亡都不能作为修复命中的判断标准。

## 1. 目标与范围

修复诡异蟾蜍攻击绯红蚊时使用浮点极值、进而可能导致下游伤害链出现非有限值的问题，避免 TetraWear / AttributesLib 抛出 `NumberFormatException: Infinite or NaN`，同时保留正常战斗、护甲研磨和 MMT 饰品效果。

本计划分开处理两个问题：特殊捕食攻击使用浮点极值的兼容风险，以及护甲研磨对不适用实体和异常输入的处理。最终修复范围由伤害链证据决定，不能仅凭截图断言 MMT 是溢出来源。

原先仅交付计划；后续用户已授权上述运行时诊断与本地测试部署。最终兼容修复仍按本计划的证据边界推进，不执行发布或 Git 合并。

## 2. 调查基线与证据边界

| 项目 | 本轮事实 |
| --- | --- |
| 用户报告 | 整合包 `0.5.0.11`，本地单人，传送到下界常用传送点后 Neruina 暂停异常实体 |
| 本地版本快照 | `modpack.toml` 为 `v0.5.0.11-test`；这是调查时快照，版本唯一来源仍为 `modpack.toml` |
| 父仓基线 | `7146672200a5947d97109963fd20ffa510080862`，分支 `release-v050x` |
| CDC 源码基线 | `5623ce2d050f320a4ea6a33daea32bd676fc8360` |
| 050x 历史产物核对 | 调查时源码 `gradle.properties` 与运行 JAR 内 `META-INF/mods.toml` 均为 `2.2.16j`；当时 `mods/` 与 `packwiz-files/mods/` 的 CDC JAR SHA-256 均为 `de9e0ddad0b13bc34a9f1a7caaa79256d4403af9af0488e9dcef15e5800d9e36`，与当时 Packwiz 元数据一致；尚未证明该历史 JAR 恰好由该源码提交构建 |
| 截图相关模组 | Alex's Mobs `1.22.9`、TetraWear `1.0.0`、AttributesLib `1.3.7`、Neruina `3.3.3`、Forge `47.4.16` |
| 原始记录 | 已读取截图；本地 `logs/`、`crash-reports/` 的 `.log` / `.txt` 定向检索未找到匹配调用链，未检索压缩历史日志 |
| 现场状态 | 尚无该次异常的实体 NBT、完整伤害事件值、加载模组清单和确切配置快照 |
| 初始调查验证 | 当时只做静态源码、文档和 JAR 字节码核对；后续真实测试见顶部更新 |

工作区已有与本问题无关的修改，实施时应保留。不能因本地模组版本号相同，就默认用户现场与当前源码、配置、打包 CDC 完全一致。

### 2.1 050x 与 main 的 CDC 维护基线

后续 review 中通过 `gh api` 查询远端提交树与 CDC compare，确认以下快照（不执行 fetch、切换分支或同步）：

| 对象 | 父仓提交 | 引用的 CDC 提交 | 打包 CDC JAR 的 Git blob |
| --- | --- | --- | --- |
| 远端 `release-v050x` | `5da4c58d3545c425a88b9ea264d2fe4c049b366f` | `5623ce2d050f320a4ea6a33daea32bd676fc8360` | `f14e36ccba1c580800413d072d51f9f537e24387` |
| 远端 `main` | `72a5eb1d84ee0ffa0d9d8213f85feffee22b7656` | `7113664517d5e35c873792a8b10b4db39ec577a8` | `6dc80e6547ce0cbda8537db2238f13baf4d238bc` |

切换 main 前的历史本地运行 JAR 的 Git blob 为 `f14e36ccba1c580800413d072d51f9f537e24387`，与上表 050x 产物相同；不代表当前临时诊断 JAR。Packwiz 下载 URL 虽指向 `main`，但不能用 URL 推断实际加载内容；应以文件哈希及分支提交树为准。

查询时 CDC 远端 `1.20.1` 也为 `7113664`，相对 050x 的 `5623ce2` 领先 5 个提交、没有反向落后：#120 恢复燃烧室流体燃料 JEI、#121 流体包裹兼容、#122 冷却室流体燃料 JEI、#123 CMR 可选依赖、#124 回滚 #121。不能把 5 个提交都当作最终保留的功能；#121/#124 存在回滚关系。

历史候选为从 050x 基线定向维护；用户随后选择在 main 修复，现已采用最新 CDC 主线基线，不再实施该维护分支提案。上表仅为当时快照，不能作为永久最新状态。

截图的关键调用链按执行方向为：

```text
EntityWarpedToad.tick:429
  -> EntityCrimsonMosquito.hurt:225
  -> LivingEntity / ForgeHooks.onLivingHurt
  -> TetraWear ArmorHoning.onLivingHurt:24
  -> CombatRules.getDamageAfterAbsorb
  -> AttributesLib ALCombatRules.getArmorDamageReduction:128
  -> ALCombatRules.getAValue:109
  -> BigDecimal.<init>: Infinite or NaN
```

Neruina 捕获的是实体 tick 中传播出的异常，不是截图已证明的故障起点。暂停对象从调用栈推测为诡异蟾蜍，仍需 Neruina 实体详情确认。传送和岩浆湖位置只属于触发现象，当前没有证据指向传送点或岩浆方块损坏。

## 3. 已确认的数值风险

Alex's Mobs `EntityWarpedToad.tick` 对 `EntityCrimsonMosquito` 的特殊攻击使用 `Float.MAX_VALUE`（约 `3.4028235E38`）。蚊子的 `hurt` 将此值继续交给原版受伤流程。

`Float.MAX_VALUE` 本身有限，转换为 `double` 后仍有限；不能直接把它称为 `Infinity`。但它几乎没有浮点放大余量：以 IEEE 754 单精度计算，乘 `1.01` 即溢出为正无穷。该算术例子说明风险，不证明现场真的经过了这一倍率。

TetraWear 将事件伤害交给护甲公式。AttributesLib 在 `getAValue` 的表达式路径中用伤害构造 `BigDecimal`；截图表明此处输入已经非有限。`CombatRules` 在护甲减伤方法返回后才执行的乘法，不能解释同一次调用中更早抛出的异常。

必须继续区分：

- 首个产生非有限数值的位置，与最后拒绝该数值的位置。
- MMT、其他模组或自定义监听器参与伤害计算的可能性，与已经证明的实际参与。
- 跳过研磨后异常消失，与整条伤害流程都能安全完成。

### 3.1 本轮深入核对的字节码事实

| 类 / 方法 | 证据与影响 |
| --- | --- |
| `EntityWarpedToad.tick`，源码约 413–429 | 收舌阶段先对绯红蚊 `setShrink(true)` 并更新目标运动，在 `attackProgress == 0.5F` 时调用一次 `hurt`；普通目标使用攻击属性，绯红蚊分支替换为 `Float.MAX_VALUE` |
| 同一攻击调用后 | `hurt` 的布尔返回值被丢弃，之后继续舌头与动画状态更新；该调用附近没有额外 `kill`、`discard` 或治疗。因此降低伤害到不足以击杀时，不能假设动画会自动完成击杀 |
| `EntityCrimsonMosquito.hurt`，源码 219–225 | 存在按骑乘关系乘 `0.333F` 的分支；截图命中的是 225 行原样调用父类的分支，不是该缩减分支。缩小标志本身也不立即移除目标 |
| `ArmorHoning.onLivingHurt`，源码 22–29 | 监听优先级为 `LOWEST`；先检查非 `BYPASSES_ARMOR` 且 `amount > 0`，再计算护甲减伤，最后才选择装备。`LOWEST` 不代表可以推断所有同优先级监听器之间的顺序 |
| `ArmorHoning.tickProgressionForRandomEquipment`，源码 49–57 | 先在四个护甲槽中随机选择一个，再检查该槽物品非空且实现 `IModularItem`；并非从所有有效装备中随机选一个 |
| `MMTDamageCalculate.hurt`，MMT `2.4.15` | 监听优先级为 `HIGHEST`；解析到生物攻击者后创建并发布效果事件。非 DENY 分支使用单精度计算 `(amount + fixedDamage) * (1 + normalMulti)`，随后乘独立倍率；目标没有 `diamond_guard` 效果时才将该结果通过 `event.setAmount(max(result, 0))` 写回 |
| `EffectLevelEvent` 默认值 | `fixedDamage = 0`、`normalMulti = 0`、独立倍率列表为空。默认值不会放大 `Float.MAX_VALUE`；目前未证明现场有哪一个效果监听器为本次攻击增加了倍率 |

MMT 原始方法还有两条必须保留的分支：效果事件结果为 `DENY` 时伤害写为零；目标存在 `diamond_guard` 时，按效果等级（最多 80）及最大生命计算伤害上限，不采用前述普通乘积的最终写回。其 `onLivingDamage` 还会在另一个事件阶段应用对应上限。因此诊断投影出现 Infinity 时，真实事件可能已经被其他分支处理，不能仅据投影判定失败。这里记录的是上游现状，不在本次计划中重构这些规则。

研磨点数的现有公式为：

```text
blocked = ceil(amount - CombatRules.getDamageAfterAbsorb(amount, armor, toughness))
honeAmount = (int) max(1, blocked / 2)
```

这揭示了两个独立问题：无适用装备的实体也会先调用护甲公式；极大的有限结果即使避开 `BigDecimal` 异常，也可能在转换为 `int` 时饱和为 `Integer.MAX_VALUE`，形成异常研磨输入。后者是边界风险分析，尚未在游戏中注入验证。

在当前未修改的 TetraWear 方法中，NaN 无法通过 `amount > 0` 条件，因此本次更符合正无穷在更早阶段进入事件的情况；截图的异常消息本身仍不区分 Infinity 与 NaN，现场应记录实际浮点位。

目前已把待定位范围收敛到：截图 225 行的有限值传递之后、`ArmorHoning` 使用事件值之前，包括原版/其他 Mixin 的伤害处理、MMT 的真实写回及其他事件监听器。不能因为 MMT 处于 HIGHEST，就将 HIGHEST 到 LOWEST 之间的一切变化都归因于 MMT。

## 4. 与现有设计的关系

- [Tetrawear 开发说明](../dev-knowledge/tetrawear/README.md)保留现有护甲体系，交叉问题优先定向修补，避免修改全部材料或模块数值。
- [护甲公式分析](../attributeslib-armor-balance-analysis.md)中的 `0–500` 是拟合与平衡验证范围，不是允许直接写入全局伤害截断的上限。此前 EvalEx `SQRT` 问题与本次非有限输入异常应分开记录。
- [MMT 饰品阶段成长设计](mmt-curios-stage-progression-plan.md)规定成长、独立乘区和减伤预算。阶段规划不能作为已经落地的运行行为，也不能据此削弱全部伤害以掩盖异常。

保留当前 AttributesLib 公式、Tetra 材料数值和正常 MMT 效果。只有静态或运行证据指向某一数值生产者时，才将该生产者纳入修复。

### 4.1 当前护甲公式并非天然无法接受有限极值

`config/attributeslib.cfg:47,64` 当前配置为：

```text
A = 12 + 2.5*d/(d+0.2) + 15*d/(d+18) + 125*d/(d+750)
taken = a / (a + (armor/(1+armor/120))*(0.7+0.3*min(1,toughness/10)))
```

对极大的有限正数 `d`，有理式的 `A` 趋近 `154.5`；护甲为 `100`、韧性为 `10` 时，公式级承伤比例约为 `0.73907`。这是数学边界分析，尚未作为游戏中 EvalEx 的运行复现。它说明不应把有限极值本身与 `BigDecimal` 构造失败等同，也不支持先更换全局护甲公式。

### 4.2 已有诊断与补丁现状

以下路径均相对于 `CDC-mod-src/`：

| 位置 | 已有职责与复用边界 |
| --- | --- |
| `src/main/java/io/github/jasonsimpart/createdelightcore/CDConfig.java:39` | `logMoreModTetraIndependentDamageMultipliers` 默认关闭；现有日志仅在 MMT 报告独立倍率时输出，不能用“没有日志”证明 MMT 没有运行 |
| `.../mixin/mmt/MMTDamageCalculateMixin.java:11` | 在 MMT `hurt` 的 HEAD / RETURN 建立、结束诊断上下文；未覆盖其他事件监听器 |
| `.../compat/mmt/MmtDamageLogContext.java:24` | 记录初始伤害、各贡献、`projectedBeforeMMTExtraCaps` 与 `eventAmountAfterMMT`；投影数值和真实事件数值须分别标注 |
| `.../mixin/mmt/EffectLevelEventMixin.java:25` | 在 setter / adder 的 RETURN 处记录 fixed / normal / independent 变化；`product()` 只供诊断，不修改真实伤害 |
| `.../mixin/mmt/MMTEffectRecursionGuardMixin.java:10` | 处理护甲反伤的嵌套递归；不能解决非有限伤害 |
| `.../mixin/combat/LivingHurtEventMixin.java` | 保存事件构造时的原始伤害供回响使用；当前诊断分支另包装 `setAmount` 观察实际写入，仍不做数值防护 |
| `build.gradle` | 原调查基线仅有通用 GameTestServer 配置；当前诊断分支新增 `src/test` 浮点字节码测试，但仍无真实游戏战斗用例 |

复用 MMT 内部贡献追踪器时，不将它升级成所有模组共用的伤害上下文。异常关联诊断应独立、默认关闭并限频；异常退出也要清理上下文，避免上一笔失败攻击污染下一笔日志。

已核对 `EffectLevelEventMixin.product()` 和 `MmtDamageLogContext.log()` 的单精度乘积均只用于诊断，后者没有调用 `event.setAmount`。诊断投影本身可溢出，但它不是已确认的真实伤害生产者；实际写回需核对 MMT 原始方法或其他监听器。

`projectedBeforeMMTExtraCaps` 是日志投影，`eventAmountAfterMMT` 才是读取的事件值。当前诊断分支已接入事件、研磨和 AttributesLib 入口观察，尚待真实日志归因。

### 4.3 待评估方向：MMT 仅处理玩家相关战斗

用户认可这是值得记录的修改方向；当前仅记录，尚未批准实施或确定宠物/召唤物归属策略。它调整 MMT 的适用范围，可减少普通生物互殴中的效果事件与装备查询；实际性能收益仍需测量，不能作为数值安全修复的替代。

候选边界为攻击者或受击者是玩家；玩家投射物按伤害源归属判断，宠物/召唤物是否纳入需单独确定。若纳入，识别主人仅用于决定是否进入原计算，不赋予宠物继承玩家饰品属性的能力。只在 MMT 自己的 `hurt` / `onLivingDamage` 入口提前返回，不取消 Forge 原始伤害事件；玩家环境伤害仍保留原有适用的防御处理。

上游 `MMTEffectHelper` 接受任意 `LivingEntity` 并读取手持及护甲，`Assassinate.hurt(EffectLevelEvent)` 也没有玩家限定。因此，采纳该方向会让非玩家之间战斗中的相关模块效果不再结算，属于需要明确 review 的玩法范围调整。当前计划对正常 MMT 效果的保留要求，在该可选方向单独通过 review 前不变。

数值安全与范围筛选必须分别验收：

- 过滤掉蟾蜍捕食场景，至多避开一条潜在处理路径；TetraWear 与其他伤害监听器仍独立运行。
- 涉及玩家的战斗仍会进入 MMT。如果输入已异常，或参与运算的值在计算中溢出，玩家筛选无法提供数值安全保证。
- 但蟾蜍对玩家的普通攻击并不使用 `Float.MAX_VALUE`。极值赋值只在目标为 `EntityCrimsonMosquito` 时发生；不能推断蟾蜍打玩家会因同一特殊伤害机制自然溢出。普通攻击仍可能受异常属性、其他模组或错误运算影响，这是需要防护的一般风险，当前没有此场景的实测故障证据。

若后续采纳，追加验证玩家近战/投射物、玩家受怪物或环境伤害、宠物归属、普通怪物互殴及非玩家模块装备行为；并在仍保留计算的玩家相关路径注入极值和非有限输入。不能仅以“怪物互殴不再触发异常”判定数值修复完成。首次溢出定位、特殊捕食修复与研磨防护仍按下述阶段推进。

## 5. 实施顺序与方案选择

### 阶段 A：确认首次溢出位置

第一版实测发现两个事件之间的缺口；补充版已运行并确认抗性乘法为本轮首个溢出操作，剩余工作是保留原下界现场差异并评审定点修复。主要入口为 `compat/combat/diagnostics/DamageDiagnostics`、`DamageArithmeticTransformer`、`DamagePipelineTransformer`，`CombatMixinPlugin.postApply` 负责插桩；`LivingDamagePipelineScopeMixin` 与低优先级算术探针新增跨事件覆盖。测试入口为 `DamageDiagnosticsTest` / `DamagePipelineTest`。

1. 按用户要求在原运行目录测试，可使用独立测试存档；记录完整模组版本、CDC 源码提交与实际加载 JAR、AttributesLib 配置，不使用另一工作树代替运行目录。
2. 当前探针从 ForgeHooks 入参开始，已覆盖事件实际 `setAmount` 写入、`ArmorHoning` 和 `getAValue` 入口；MMT 关键方法记录真实浮点运算和效果贡献。使用独立 `logNonFiniteDamage` 开关，默认关闭。必要时再补蟾蜍调用前与未覆盖监听器探针，不能把诊断投影溢出当作真实事件溢出。
3. Forge hurt/damage 子记录现在通过 `parentTrace` 关联到 actuallyHurt 父记录；记录实体、位置、伤害源、数值及浮点位，异常或极大值限频输出。第三方不调用基类的覆写、外部 helper 内部运算、事件取消状态及任意监听器完整输入/输出尚未全面覆盖，按证据补充。
4. 确认 Forge 实际监听器顺序。同一优先级不能仅凭源码文件顺序推定；事件前后两个总探针也不能单独确定是哪一个监听器修改了数值。
5. 对首个有限值变为非有限值的操作记录输入、倍率、输出及完整调用位置。若默认属性无法复现，按原始现场配置、属性和其他监听器逐项缩小差异。
6. 同时区分护甲前入射伤害、护甲后伤害、保护/抗性后伤害和实际生命差，避免以单个入口日志证明击杀或最终减伤结果。

阶段出口：明确可重复的触发条件与首个异常值生产者，或将无法复现的现场缺失条件明确保留。不得把“能避开截图中的异常”当作已确认根因。

诊断判定规则：

| 观测结果 | 下一步 |
| --- | --- |
| 蟾蜍传出 MAX，MMT 入口已非有限 | 检查两点之间的原版处理、Mixin 和实际更早监听器，不能直接归因于 MMT |
| MMT 入口有限、RETURN 读取的事件值非有限 | 审计该次效果事件的实际监听器贡献及写回，定位具体运算 |
| MMT 返回有限、ArmorHoning 入口非有限 | 检查其间其他监听器和同优先级实际执行顺序 |
| ArmorHoning 入口有限、getAValue 入口非有限 | 核对实际加载 JAR 与运行时 Mixin，不能用当前静态链强行解释 |
| 默认捕食始终有限 | 补齐现场配置/属性差异；不把“默认无法复现”当作用户报告无效 |

### 阶段 B：特殊捕食攻击定向修复

推荐由 CDC 承载兼容代码，限定到 Alex's Mobs 的诡异蟾蜍攻击绯红蚊分支，保留原攻击调用及其正常死亡流程。

候选方案是在这一调用位置替换极值伤害；具体数值策略必须结合完整捕食实现与实际减伤链选择，并证明其既不会溢出，又保留正常目标的一击捕食效果。不能直接采用全局 `500` 上限、另一个任意超大常数，或仅以目标当前生命值作为未经验证的致死伤害。

实施约束：

- 不改变蟾蜍对其他目标的普通攻击。
- 不直接调用 `discard`、`kill` 或清除生命以绕过正常受伤、死亡、战利品和击杀归属。
- 不反复补打来强行击杀，不绕过其他模组取消伤害或无敌规则。
- 若有限伤害方案无法同时满足语义和兼容性，先修订本节并提交 review，不把未经证明的“安全常数”作为最终方案。
- 保留缩小标志、拉拽和单次伤害调用时机；测试必须检查目标是否存活但持续缩小，而不只是观察动画播放。
- Mixin 精确匹配目标方法和调用点，校验匹配数量；上游版本变化导致失配时应可发现，避免静默失效。

### 阶段 C：TetraWear 研磨局部防护

研磨监听器应仅对确实存在适用装备的实体执行相关计算。按照上游真实装备判定逻辑提前过滤，避免自行缩小到玩家而破坏其他可装备实体的行为。

在研磨计算和成长数据写入前分别检查输入与结果：

- 对非有限伤害，跳过本次研磨；不修改原始事件伤害、不取消攻击。
- 对不适用装备的实体，不调用仅供研磨使用的护甲计算。
- 对非有限结果或无法安全转换成原成长计数类型的结果，不写入成长数据；保留可定位的限频诊断。
- 保持普通有限值的研磨量、取整规则、装备分配和耐久行为一致，具体边界按上游方法核对。

提前筛选只用于判断“四个护甲槽是否至少存在一个非空 `IModularItem`”；随后仍调用上游原有随机选槽逻辑，不重新随机、不改成从有效装备集合中抽取。例如只穿一件模块化护甲时，原本每次只有选中该槽才成长，不能在修复后变成每次都成长。对于有适用装备的普通伤害，不新增随机数消耗。

有限但超过安全整数转换范围的研磨量同样跳过，不能先转 `int` 再判断。只在本监听器的受伤成长路径加防护，不顺带改变击杀、挖掘成长入口。

该防护解决研磨入口的问题，不保证后续真实伤害计算安全。必须与阶段 B / 已确认生产者修复共同验证。

### 阶段 D：仅在证据支持时修复其他生产者

若首个非有限值由 MMT 或其他伤害倍率产生，将有限性处理放在该生产者的实际运算边界，并区分特殊击杀数值与普通玩家伤害。中间计算使用 `double` 只能增加余量，转回 `float` 仍需检查，不能单独视作修复。

不默认增加 AttributesLib 全局 clamp，不把 NaN 统一转为零，不用捕获全部异常并继续运行替代数值处理。任何会改变所有正常攻击的规则都需要单独评估和 review。

### 预期改动位置

以下是计划中的新增文件名，实际实施需按确认的注入点微调；路径相对于 CDC 的 Java 包 `src/main/java/io/github/jasonsimpart/createdelightcore/`。

| 位置 | 计划职责 |
| --- | --- |
| `mixin/alexsmobs/WarpedToadPredationDamageMixin.java` | 只处理捕食目标分支的特殊伤害，不覆盖整段 tick |
| `compat/alexsmobs/PredationDamagePolicy.java` | 若需独立数值策略，集中边界、适用条件和测试入口，避免散落常数 |
| `mixin/tetrawear/ArmorHoningMixin.java` | 提前判定适用装备、阻止异常研磨结算，保持上游正常结果 |
| `compat/combat/` 与 `mixin/combat/` 中的临时诊断 | 记录首次非有限输入与相关监听器前后值；默认关闭，回归后决定是否保留最小诊断 |
| `CDConfig.java`、`src/main/resources/mixins.createdelightcore.json`（后者相对于 CDC 根） | 仅登记实际需要的开关与 Mixin；遵守对应目录 `AGENTS.md` 和可选模组加载约束 |

只有确认某个生产者需要改动时才增加其补丁文件。诊断代码可先作为独立提交，避免把诊断重算与实际规则修改混在一起。

## 6. 验证与验收

| 场景 | 必须验证的结果 |
| --- | --- |
| 默认属性的蟾蜍捕食绯红蚊 | 伤害链无非有限值，无 Neruina 新暂停；捕食效果、动画和死亡流程符合原语义 |
| 蟾蜍攻击普通目标 | 攻击值与效果不变 |
| 目标有减伤、吸收、无敌或事件取消 | 不绕过原有规则，不循环补伤害；边界行为有明确记录 |
| 无适用 TetraWear 装备的实体受伤 | 不进入无用途的研磨护甲计算；正常伤害仍执行 |
| 普通 TetraWear 装备受伤 | 覆盖零护甲、高护甲、韧性、各装备槽与正常研磨边界；结果与修复前有限值基线一致 |
| MMT 饰品组合 | 无饰品、增伤、减伤、暴击、穿透、`DENY`、`diamond_guard` 的 hurt/damage 两阶段处理及现有反伤递归保护均无回归 |
| 特殊数值注入 | `0`、负值、普通有限值、`Float.MAX_VALUE`、`+Infinity`、`NaN`；不把无效值写入成长数据，明确每层处理边界 |
| 传送后区块恢复更新 | 在独立测试存档中重复触发捕食，验证恢复更新不会重新暂停 |
| 生产环境映射 | 对 reobf JAR 验证 Mixin 实际命中；单人集成服务器与专用服务器都能加载并执行相应路径 |

静态/单元验证只覆盖数值策略与状态写入边界；真实游戏回归覆盖事件顺序、死亡副作用和生产映射。不能只测试 helper 或只确认构建通过。

上表真实游戏验收均待执行。当前已通过诊断字节码的五种浮点运算、边界值与随机输入等价性测试，并核对安装 JAR 中 MMT 10 次、TetraWear 1 次目标运算；这些不等于游戏内特殊数值注入或完整战斗测试。

## 7. 交付、维护与 review

本轮 CDC PR 交接诊断源码、已注册 Mixin、测试和说明；CDR PR 仅交接调查文档。真实启动与回归完成后，再按 Packwiz 资产工作流更新父仓引用和实际产物，保证源码提交与打包 JAR 对应。本地测试覆盖不代表已更新发行载荷。

功能分支已采用 main / CDC 1.20.1 基线；没有安排向 050x 回填。若未来另做回填，需单独核对差异。

补丁完成后，兼容记录写入 `docs/dev-knowledge/compatibility-patches.md`，关联外部模组版本、补丁位置、验证证据及上游升级后的复核/移除条件。调查未结束前，不将假设登记为已修复事实。

用户 review 重点：

1. 是否接受“特殊捕食定向修复 + 研磨局部防护”的范围。
2. 是否认可保留正常伤害事件、死亡和取消语义，不用全局伤害上限解决该问题。
3. 是否认可先完成首次溢出定位，再决定是否扩展到 MMT 或其他生产者。
4. 是否另行采纳第 4.3 节的玩家相关战斗范围调整，以及如何处理宠物/召唤物；该方向与数值安全修复分别 review、分别验收。
5. 首次溢出证据是否足够支撑最终补丁；main 基线与原运行目录测试方式已由用户确定。

诊断交接不代表已经完成修复或批准发布。接手者应先验证真实启动与复现，再提交根因结论和最终修复方案。
