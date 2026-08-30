---
name: release
description: 管理 Create-Delight Remake 整合包的正式版或测试版发布。用于用户要求发布版本、创建测试版、更新 modpack.toml 版本、打 tag、创建 GitHub Release 或处理发布产物时；先用 release-plan.ps1 解析版本、目标分支和上一版本，再按 Prepare、人工合并、Publish 流程执行。
---

# Create-Delight Remake 发布

发布脚本负责 Git 分支、版本写入、标签、CI 等待、说明、公开 Release、公告 PR 和重试；标签 CI 的 `release-assets` job 负责下载同一次运行的 artifact、压缩并上传 Release 资产。agent 只判断发布意图与玩家可读的文案。

## 先生成只读计划

从仓库根目录运行：

```powershell
.\.agents\skills\release\release-plan.ps1
```

传入用户已明确的值覆盖自动推导：

```powershell
.\.agents\skills\release\release-plan.ps1 -Version 'v0.5.0.6-test' -ReleaseType '测试' -AsJson
```

计划会推导版本、目标分支、上一稳定版本和首个正式版候选。用户明确指定版本、分支或发布类型时，以用户指定为准。

## Agent 必须完成的判断

1. 确认是正式版还是测试版；版本带 `-test` 时必须是测试版。
2. 正式版提供 1–3 条公告，逗号分隔、每条不超过 20 个中文字符。多个提交时不要采用脚本的“最近一条提交”兜底文案。
3. 若计划显示可能是子版本首个正式版，在 Prepare 前撰写 `docs/update-summary-{Version}.md`：中文、按主题分组、含 PR 号、一句范围摘要，并以“升级须知”结束。Publish 会以 GitHub Release 状态再次确认，缺少精确文件时会停止。

## 执行流程

### 1. Prepare

```powershell
.\.agents\skills\release\release-prepare.ps1 `
    -Version '<Version>' `
    -TargetBranch '<TargetBranch>' `
    -ReleaseType '<正式|测试>' `
    -Announcement '<正式版公告，可省略>' `
    -WhatIf
```

确认 dry run 后移除 `-WhatIf`。脚本会创建版本 PR；它会在稳定版时仅暂存与当前版本匹配的更新摘要文件。

### 2. 人工合并关卡

必须等待用户手动合并版本 PR。不得自动合并或启用 auto-merge。

### 3. Publish

用户确认 PR 已合并后，先预览再正式执行：

```powershell
.\.agents\skills\release\release-publish.ps1 `
    -Version '<Version>' `
    -TargetBranch '<TargetBranch>' `
    -ReleaseType '<正式|测试>' `
    -WhatIf
```

`PreviousVersion` 默认自动推导；只有推导错误时才传入覆盖值。确认 dry run 后移除 `-WhatIf`。脚本会发布 4 个正式版产物或 2 个测试版产物，并在正式版时创建公告更新 PR；只报告该 PR，不要合并它。

## 不可违反的约束

- 不编辑生成的 `pack.toml` 或 `index.toml`。
- 不直接发布或复制 CDC JAR；CDC 源码与 Packwiz 资产分别遵循 `CDC-mod-src/AGENTS.md` 和 `/packwiz-assets`。
- 脚本可恢复中断的草稿 Release；已公开的同名 Release 不可重建。
- 运行脚本前需要 PowerShell 7、Git、GitHub CLI 登录和干净或可安全暂存的工作树。

## 按需参考

- Windows 下的代理、`gh` 认证和大文件传输细节：读 [release-windows-github.md](references/release-windows-github.md)。
- 仅当用户明确要求“标签与 `modpack.toml` 版本不同”的历史过渡发布时：读 [transitional-test-tags.md](references/transitional-test-tags.md)。
- 参数和脚本内部步骤以当前实现为准：运行 `Get-Help .\.agents\skills\release\release-prepare.ps1 -Full` 或 `Get-Help .\.agents\skills\release\release-publish.ps1 -Full`。
