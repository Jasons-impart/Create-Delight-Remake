# hotai 补丁文档

本目录是整合包 `hotai/` 二进制补丁的唯一开发知识专题入口。上游加载器项目名为 [Hotai](https://github.com/friendlyhj/Hotai)，本文档中以运行目录和包内资产名 `hotai` 指代整合包侧补丁系统。

## 文档分工

| 文档 | 负责内容 | 维护方式 |
|---|---|---|
| [patch-map.md](patch-map.md) | 运行机制、按领域归纳的行为变化、跨目录依赖与维护边界。 | 人工维护；不逐个复制 class 状态。 |
| [badiff-details.md](badiff-details.md) | 每个 `.badiff` 的方法级语义、历史依据与适用性。 | 人工维护；其中 `HOTAI_STATUS` 区块由脚本生成。 |

## 与开发知识的关系

- `content-map.md` 只记录玩家可见的 `hotai` 内容改动，并链接到本目录。
- `compatibility-patches.md` 只在某项补丁属于修复、回归恢复或上游适配时登记；补丁所在目录不决定分类。
- `how-to-index.md` 只保留 `/hotai` skill 的入口，不复制操作步骤或补丁明细。
- 变更 `hotai/**/*.badiff` 时遵循 [.agents/skills/hotai/SKILL.md](../../../.agents/skills/hotai/SKILL.md)，并运行 `scripts/update-hotai-docs.ps1`。
