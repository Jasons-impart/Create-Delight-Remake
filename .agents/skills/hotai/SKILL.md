---
name: hotai
description: 维护、分析、迁移或验证 Create-Delight Remake 的 `hotai/**/*.badiff` 二进制补丁及其开发知识专题文档。用于新增或替换补丁、目标模组升级后复核、动态创建 class 诊断，或更新 `docs/dev-knowledge/hotai/`。
---

# hotai 补丁维护

`hotai/` 是整合包侧二进制补丁目录；上游加载器项目名为 Hotai。专题事实统一写在 `docs/dev-knowledge/hotai/`，本 skill 只定义可重复的操作流程。

## 文档职责

| 位置 | 负责内容 |
|---|---|
| `docs/dev-knowledge/hotai/README.md` | 专题入口、文档边界及与开发知识的关系。 |
| `docs/dev-knowledge/hotai/patch-map.md` | 运行机制、按领域归纳的行为变化、跨目录依赖和维护注意。 |
| `docs/dev-knowledge/hotai/badiff-details.md` | 每个 `.badiff` 的方法级语义、历史依据和适用性；`HOTAI_STATUS` 区块由脚本生成。 |
| `docs/dev-knowledge/content-map.md` | 仅记录玩家可见的内容调整，并链接专题入口。 |
| `docs/dev-knowledge/compatibility-patches.md` | 仅记录修复、回归恢复或上游适配；不要因文件位于 `hotai/` 而自动归类。 |

不要在 `docs/dev-knowledge/how-to-index.md` 复制补丁机制、逐文件状态或操作步骤。

## 工作流程

1. 先阅读 `docs/dev-knowledge/hotai/README.md` 和相关的 `patch-map.md` / `badiff-details.md`，确认要改的是专题事实、补丁语义还是操作流程。
2. 从 `.badiff` 相对路径推导目标 class internal name；例如 `hotai/a/b/C.badiff` 对应 `a/b/C`。
3. 更新或分析补丁后，运行 `scripts/update-hotai-docs.ps1` 刷新 `HOTAI_STATUS` 区块。不要手改该区块。
4. 在 `badiff-details.md` 的生成区块外记录方法级语义和证据；在 `patch-map.md` 只更新领域级摘要与跨目录依赖。
5. 运行 `scripts/update-hotai-docs.ps1 -Check`，它只校验受版本控制的 `.badiff` 路径与目标 class 映射；需要复核某一参考运行环境的 JAR/日志状态时，运行 `scripts/update-hotai-docs.ps1 -Check -StrictRuntimeStatus`。通用 `scripts/validate-knowledge-base.ps1` 默认不读取本地 JAR 或日志；仅传入 `-CheckHotaiRuntimeStatus` 时才执行严格运行时状态校验。

## 状态判定

- 目标 class 在当前受管 JAR 中存在：标为静态 JAR 命中。
- 静态 JAR 未命中，但 `logs/latest.log` 包含该 internal name 的 `Patched class:`：标为运行时已确认动态创建。
- 两者都没有：仅标为当前启动日志未确认，可能按需加载；不得直接判为失效或多余补丁。

Forge ModLauncher 会为声明的缺失目标提供空 `ClassNode`，所以 `hotai` 可以由 `.badiff` 创建 class。超导连接器匿名内部类等按需加载目标必须在实际触发相应功能后再依据日志确认。

## 边界

- `.badiff` 与目标模组版本强绑定；升级上游模组后必须重新扫描目标 class 和启动日志。
- 优先提交 `.badiff`，不要将完整目标 class 当作长期源文件；加载器可将 `.class` 转存为 `.badiff`。
- 涉及配套资源、配方、掉落或注册时，同时检查 `patch-map.md` 指向的 KubeJS 文件；类成功 patch 不等于玩家侧功能完整。
- 若本次变更形成新的玩家体验或修复，按 `.agents/skills/dev-knowledge/SKILL.md` 的分类更新台账，而不是在专题文档中重复记账。
