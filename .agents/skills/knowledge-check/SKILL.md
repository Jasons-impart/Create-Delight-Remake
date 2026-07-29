---
name: knowledge-check
description: 实现后知识检查、知识库维护、项目经验沉淀。用于代码、配置、脚本、文档或流程变更完成后，判断是否需要记录项目知识，并将知识路由到 AGENTS、docs/dev-knowledge、docs/plan、docs/lessons-learned 或项目 skill。
---

# 知识检查

本 skill 用于在实现工作结束后，判断是否学到了值得未来会话复用的项目知识，并把它写到正确位置。

## 何时使用

在以下情况调用本 skill：

- 刚完成代码改动、bug 修复或配置更新。
- 发现了非显而易见的项目模式、坑点或约束。
- 修正了未来 agent 可能再次犯的错误。
- 当前任务明确要求维护或整理知识库。

以下情况不要调用：

- 纯研究或探索，且没有代码/配置/文档改动。
- 完全按既有文档执行的琐碎改动。
- 与本项目无关的通用知识。

## 流程

### 第 1 步：判断是否值得记录

先问：“我是否学到了未来会话会受益的项目特定知识？”

如果存在 `tmp-opencode/knowledge-candidate-report.md`，先读取它再决定；除非当前任务明确要求维护知识库，否则 process note 候选需要用户接受后再落库。

Codex Stop hook 会运行 `scripts/validate-knowledge-base.ps1`，并写入 `tmp-opencode/knowledge-candidate-report.md`；该报告只提供建议，不会自动修改知识文件。

如果任务中途遇到非显而易见的失败或绕路做法，但最终还没决定是否落库，可用 `scripts/add-knowledge-note.ps1` 追加临时 note，让候选报告把它路由到这里。

通常值得记录的知识分为：

- **可复用的项目事实或位置** → 按 `.agents/skills/dev-knowledge/SKILL.md` 的存放表路由。
- **内容改动（feat）** → `docs/dev-knowledge/content-map.md`，记录新增或有意调整的玩家体验、实现位置和验证状态。
- **兼容与问题修复（bugfix/compat）** → `docs/dev-knowledge/compatibility-patches.md`，记录问题、上游变化、补丁位置、验证与复核条件。
- **bug、坑点或历史教训** → 优先写入 `docs/lessons-learned.md`。
- **知识路由或 skill 行为变化** → 更新受影响的 skill。
- **成组项目技术资料或其生成脚本** → 以 `docs/dev-knowledge/<专题>/README.md` 作为专题入口；内容/兼容台账只保留分类与入口链接，不复制专题事实与操作流程。
- **没有可复用项目价值** → 不记录。

### 第 2 步：选择知识形态

读取 `.agents/skills/dev-knowledge/SKILL.md`，以其中的存放表作为知识落点的唯一来源。

### 第 3 步：选择目标文件

应用 dev-knowledge 存放表后，再检查这些覆盖规则：

- 新增或有意调整配方、平衡、NPC、剧情、任务、物品、机器或系统 → `docs/dev-knowledge/content-map.md`；不因实现位于 KubeJS、配置、hotai、CDC 或 mixin 而改变分类。
- 恢复预期行为、修复错误或回归、适配上游版本变更 → `docs/dev-knowledge/compatibility-patches.md`；不因补丁目录而将其误归为 feat。
- 候选报告会对可能改变玩法的整合包文件同时列出两种台账；依据改动目的选择，不确定时先检查玩家可见结果与问题描述。
- 与具体补丁无关、未来会反复遇到的根因或非显而易见的 workaround → `docs/lessons-learned.md`。
- 新的 KubeJS helper/API 参考 → 内容很短时写入 `kubejs/AGENTS.md` 的 UNIQUE STYLES；否则写入 dev-knowledge how-to 或提升为 skill。
- `hotai/` 补丁、`docs/dev-knowledge/hotai/` 专题资料或 `scripts/update-hotai-docs.ps1` → 使用 `/hotai` skill；逐文件语义和生成状态写入 `docs/dev-knowledge/hotai/`，玩家体验与兼容修复仍按目的分别登记到对应台账。
- knowledge-check prompt、候选报告路由或触发时机 → `.agents/skills/knowledge-check/SKILL.md`。
- dev-knowledge 存放规则 → `.agents/skills/dev-knowledge/SKILL.md`。

### 第 4 步：写入更新

更新知识文件时遵守这些规则：

1. **保持简洁**：每个事实尽量一句话，不写长篇说明。
2. **说明原因**：非显而易见的规则必须写出失败模式或原因。
3. **避免重复**：如果信息已存在于其他文件，改用引用，不要复制。
4. **控制 AGENTS 行数**：根 `AGENTS.md` 不超过 150 行，子目录 `AGENTS.md` 不超过 80 行；超限先精简。
5. **lessons 条目**：包含 Problem、Fix/Lesson 和日期。
6. **skill 条目**：触发条件写进 YAML `description`；正文聚焦可执行流程。
7. **dev-knowledge 条目**：使用表格行、路径和链接；不要复制长篇设计理由。
8. **迭代式维护**：只有出现重复错误或具体发现后才新增规则；删除 agent 已稳定遵守的规则。

允许的知识维护动作：

- 编辑根或模块级 `AGENTS.md`。
- 编辑 `docs/lessons-learned.md`。
- 编辑 `docs/dev-knowledge/`。
- 编辑 `.agents/skills/` 或 `.opencode/plugins/`。

作为 knowledge-check 调用时禁止：

- 修改与知识维护无关的代码、配方或配置。
- 运行 build/test 命令。
- 执行 Git 操作。

### 第 5 步：输出总结

如果应用或拒绝候选报告，决策后运行 `scripts/resolve-knowledge-candidate.ps1 -Status applied|rejected`，避免临时 process note 重复出现。

最后输出：

```text
Knowledge Check
- Learned: [1-3 条，或 “nothing significant”]
- Updated: [文件路径，或 “no update needed”]
- Reason: [一句话说明]
```

如果没有值得记录的内容，只输出：`Knowledge: no update needed`。

## 反模式

- 记录与本项目无关的通用编程知识。
- 在多个 AGENTS 或知识文件中复制同一事实。
- 文件超出行数限制时继续追加，而不是先精简。
- 用长篇散文替代简洁条目。
- 把知识维护流程规则放回根 `AGENTS.md`，而不是放在本 skill。

## 最终自检

保存任何 `AGENTS.md` 或 `docs/lessons-learned.md` 更新前，必须确认：

1. **行数**：根 `AGENTS.md` 是否 ≤150 行，子目录 `AGENTS.md` 是否 ≤80 行？超限先精简。
2. **无重复**：同一事实是否已存在于其他知识文件？如果存在，改为引用。
3. **简洁**：每个条目是否能继续删字而不丢信息？
4. **原因**：非显而易见的规则是否写清失败模式或理由？
5. **过期检查**：正在追加的文件是否已有过期条目？如有，标记或删除。
6. **skill 检查**：这是 workflow、checklist 或工具序列吗？如果是，应写入 skill，而不是常驻 AGENTS。
7. **位置检查**：目标文件是否符合 dev-knowledge 存放表和本 skill 的覆盖规则？

任何一项失败，都先修正再保存；这一步是长期保持知识库质量的主要机制。
