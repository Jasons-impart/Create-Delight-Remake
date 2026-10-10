# hotai 补丁文档

本目录是整合包 `hotai/` 二进制补丁的开发知识专题入口。上游加载器项目名为 [Hotai](https://github.com/friendlyhj/Hotai)，本文档中以运行目录和包内资产名 `hotai` 指代整合包侧补丁系统。

## 文档分工

| 文档 | 负责内容 | 维护方式 |
|---|---|---|
| [patch-map.md](patch-map.md) | 运行机制、按领域归纳的行为变化、跨目录依赖与维护边界。 | 人工维护；不逐个复制 class 状态。 |
| [badiff-details.md](badiff-details.md) | 每个 `.badiff` 的方法级语义、历史依据与适用性。 | 人工维护；其中 `HOTAI_STATUS` 区块由脚本生成。 |
| [品质存储修复-逐指令说明.md](品质存储修复-逐指令说明.md) | 五个跨模组品质继承补丁的目标方法、描述符、局部变量和逐指令栈效果；包含 Hotai 白盒与运行时验证记录。 | 人工维护；目标模组版本变化时必须重新生成并重放 `.badiff`。 |
| [品质存储修复-白盒测试记录.md](品质存储修复-白盒测试记录.md) | 品质继承真实回调的白盒断言输出，以及本次五个补丁的 SHA-256。 | 本批测试的固定记录。 |
| [空指针补丁-仓库位置与核心解析.md](空指针补丁-仓库位置与核心解析.md) | 本批空指针补丁在 `hotai/` 的路径、根因与修补语义。 | 人工维护。 |
| [空指针补丁-全部代码解释.md](空指针补丁-全部代码解释.md) | 生成器、HotAI 套补丁路径与各方法指令级解释。 | 人工维护。 |

## 与开发知识的关系

- `content-map.md` 只记录玩家可见的 `hotai` 内容改动，并链接到本目录。
- `compatibility-patches.md` 只在某项补丁属于修复、回归恢复或上游适配时登记；补丁所在目录不决定分类。
- `how-to-index.md` 只保留 `/hotai` skill 的入口，不复制操作步骤或补丁明细。
- 变更 `hotai/**/*.badiff` 时遵循 [.agents/skills/hotai/SKILL.md](../../../.agents/skills/hotai/SKILL.md)，并运行 `scripts/update-hotai-docs.ps1`。
