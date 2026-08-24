---
name: mekanism-integration
description: 将通用机械四件套（Mekanism / Generators / Tools / Additions）按"翻译不平行"原则深度融合进 Create-Delight Remake 的操作流程。用于装包与版本跟进、矿务配置、机器与升级模块的机械手序列化重铺、五系融合机器落地；设计事实与数值门槛见 docs/plan/mekanism-integration-plan.md。
---

# 通用机械深度融合

全家桶 = Mekanism + Mekanism Generators + Mekanism Tools + Mekanism Additions 四件套，1.20.1 线且四件版本号一致。定位：Create 产线的气相化学精炼层。设计事实、映射表与门槛数值统一在 `docs/plan/mekanism-integration-plan.md`；本 skill 只定义可重复的操作流程与硬规则。

## 硬规则

- 装包/更新只用 `scripts/add-packwiz-target.ps1` / `update-packwiz-target.ps1`，`side = "both"`；首版 `stable = false` 走测试通道。
- 四件套之外不加任何 Mek 社区附属（More Mekanism Processing、Mekanism Tweaks 等）。
- KubeJS 插件只用 CurseForge 的 KubeJS Mekanism UNOFFICIAL（官方无 1.20.1 版）；首启即冒烟 `event.recipes.mekanism*`，报错立即移除并全量回退 `event.custom()`，不修非官方插件源码。
- 内容移除（数字矿机、地震仪等）一律 `remove_recipes_id` + `StartupEvents.modifyCreativeTab(...).remove(...)`（无效再 `JEIEvents.hideItems`）；禁止用 Mek 配置禁用机器。
- 矿务配置写 `defaultconfigs/Mekanism/world.toml`（tracked source）：锡/铀 `shouldGenerate = false`；铅默认密度；锇 perChunk 压至默认 1/3~1/2。不做种子矿脉结构。
- 材料统一映射：Mek bronze/steel/tin 产物标签统一到 `createdelightcore:bronze_ingot` / `createdelight:forged_steel_ingot` / `createdelightcore:tin_ingot`，删除 Mek 自产双轨配方；四级控制电路按 plan 文档 §二 重铺。
- 新配方命名空间一律 `createdelight`；删除配方只用 `remove_recipes_*` 工具函数族；新脚本放 `server_scripts/Mekanism/`（目录名含空格时 shell 加引号）。
- 机器合成 = 每台机器独立序列组装：起手件用 Mek 原版语义件（钢制机壳/熔炉/电解芯/能量板），步骤注入电路与包内门槛材料；不新增通用中间物（基座/基片方案已否决）；过渡物 `createdelight:incomplete_<机器名>` 注册于 `startup_scripts/registry_item_mekanism.js`（需重启）；大机器走 MBD2 装配线。
- 升级模块 = 七类各自独立短序列（锇锭起手 + 基础电路 + 终步分化材料）；单价必须低（单机可叠 8 个）。
- 装备红线：MekaSuit 逐模块按 plan §四 消耗包内材料；MekaTool 锁 `#more_mod_tetra:over_core`；Mek 全装备数值纳入 OED 审查。
- 五系融合机器用 MBD2 化学槽部件实现（`multiblocked2` 已内置 `integration/mekanism`），不写 Java；先做一台最小模板机验证集成类，再复制设计。
- Mek 机器 FE 消耗保留默认，只调门槛与产线归属；custom JSON 化学配料字段名以 `/kubejs hand` 实测为准。
- 每阶段收尾：Crash Assistant 基线（pre-commit hook 自动；未装 hook 手动 `python3 scripts/generate-crash-assistant-modlist.py`）+ 游戏内验证（可用 `/minecraft-mcp`）；注册类改动需重启。
- 玩家可见新内容落地后走 `/knowledge-check` 记账；数值与门槛调整只改 plan 文档，不改本 skill。

## 工作流程

### P0 地基（1 个 PR）

1. `git checkout main && git pull && git checkout -b feat/mekanism-p0`。
2. add-packwiz-target 加装四件套与 UNOFFICIAL 插件（插件 `stable = false`），运行 `sync-packwiz-assets.ps1`。
3. 写 `defaultconfigs/Mekanism/world.toml` 矿生配置；按 plan §一 清理杂项自动配方。
4. 首启验证 plan §十二"装包"行 + P0 实测确认清单全项；结论写入 PR body。
5. Commit `[mod] 添加通用机械四件套与地基配置 (#PR)`，中文 body 含影响范围与验证结论。

### P1 翻译（2-3 个 PR）

1. 材料统一与电路重铺（plan §二），`server_scripts/Mekanism/tag.js` + `recipes.js`。
2. 基座序列 + 过渡物注册 + 机器特征件表落地（plan §三）。
3. 升级基片与七类模块；装备门槛与 OED 审查（plan §四）。
4. 验证 plan §十二"基座/平衡"两行。

### P2 融合（3-5 个 PR）

1. 先做聚合反应器最小模板机验证 MBD2 化学槽，再铺开 plan §六 全部机器与配方层扩展。
2. 核循环、乙烯桥、氧气/推进剂、订单 machine 类目与条款、回礼表。
3. 验证 plan §十二"矿务/融合机器/经济"三行。

### P3 收尾（2-3 个 PR）

任务章节「气相革命」、难度与战利品接入、lang/JEI 信息页；文案遵守 AGENTS 玩家文案条款；验证 plan §十二剩余行。

## 边界

- 不用 hotai 补 Mek；确需算法级改造时先评估 CDC 可选依赖（CombatMixinPlugin 式条件加载先例），且仅在有明确阻塞时启动。
- Mekanism 版本升级时：四件套同步升、重跑 P0 矿生配置 diff、全配方走查、Crash Assistant 基线重建。
- 数字矿机移除后检查任务书与 JEI 无死引用（虚空采矿体系已覆盖该职能）。
- 本 skill 只随流程固化变化更新；机器清单、数值表、门槛材料的演变只进 plan 文档。
