# Lessons Learned

## 多分支 PR 时必须基于各自目标分支创建特性分支

**日期**: 2026-05-18
**场景**: 将 `Introduction.snbt` 的改动同时 PR 到 `main` 和 `release-v048x`

### 错误做法

从一个分支（如 `main`）创建特性分支，然后用同一分支向两个目标分支发起 PR：

```
main ──→ feat/branch ──PR──→ main       ✅ 只有1个commit
                      ──PR──→ release-v048x  ❌ 包含main比048x多的14个commit
```

**原因**: PR 包含的是特性分支与目标分支之间的全部差异。如果特性分支基于 `main`，而 `main` 比 `release-v048x` 多了 N 个 commit，PR 到 048x 时就会带上这 N 个无关 commit。

### 正确做法

**方案一（推荐）: 从各目标分支分别创建特性分支，cherry-pick 同一个 commit**

```
main ──→ feat/branch-main ──PR──→ main         ✅ 1 commit
release-v048x ──→ feat/branch-048x ──PR──→ release-v048x  ✅ 1 commit
# 两个分支各自 cherry-pick 同一个 commit
```

**方案二: 从一个分支创建，另一个用 cherry-pick 分支补充**

先从 `main` 创建分支 PR 到 `main`，再从 `release-v048x` 创建新分支 cherry-pick 同一 commit PR 到 048x。

### 规则

> **向多个分支发 PR 时，每个目标分支必须有独立的、基于该目标分支创建的特性分支。** 绝不能复用同一个特性分支。

## PowerShell 中反引号 `` ` `` 是转义字符，不能直接用于 Markdown 行内代码

**日期**: 2026-05-19
**场景**: 用 `gh pr create --body "..."` 创建 PR 时，PR 正文中 `ad_astra` 的 `a` 变成未知字符

### 根因

PowerShell 双引号字符串中，反引号 `` ` `` 是转义前缀（等价于 bash 的 `\`）：

| 转义序列 | 含义 |
|----------|------|
| `` `a `` | BEL（响铃，0x07） |
| `` `n `` | 换行 |
| `` `t `` | 制表符 |
| `` `" `` | 转义双引号 |
| `` `` `` | 转义反引号本身 |

所以 Markdown 行内代码写法 `` `ad_astra` `` 在双引号字符串中，`` `a `` 被解析为 BEL 字符（不可见），导致 `ad_astra` 显示为乱码。

### 错误做法

```powershell
# ❌ 反引号 + a 被解析为 BEL
gh pr create --body "... `ad_astra:xxx` ..."
```

### 正确做法

**方案一（推荐）：用 `--body-file` 从文件读取 body，避免 PowerShell 字符串解析**

```powershell
# 写入临时文件，内容无需转义
Set-Content -Path $tmpFile -Value "更新: ``ad_astra:xxx`` → ``yyy``"
gh pr create --body-file $tmpFile
```

**方案二：双引号字符串中用双反引号 `` `` `` 转义**

```powershell
# ✅ ``  表示字面反引号
gh pr create --body "... ``ad_astra:xxx`` ..."
```

**方案三：使用单引号字符串（无插值，反引号无需转义）**

```powershell
# ✅ 单引号内反引号是字面量，但无法插入变量
gh pr create --body '... `ad_astra:xxx` ...'
```

### 规则

> **在 PowerShell 双引号字符串中使用 Markdown 反引号语法时，必须转义为双反引号 `` `` ``，或改用 `--body-file` / 单引号避免转义问题。**

## Packwiz 在 CI 中获取 mod JAR 的正确方式

**日期**: 2026-05-20
**场景**: Packwiz 迁移后，release.yml 的 server-tasks 和 patch-tasks 无法获取 CF 可下载的 mod JAR

### 关键行为（容易被误解）

| 命令 | 实际行为 | 常见误解 |
|------|---------|---------|
| `packwiz curseforge detect` | 只修改 `.pw.toml` 的 `mode` 为 `metadata:curseforge`，**不下载 JAR** | ❌ 以为会下载 JAR 到 `mods/` |
| `packwiz curseforge export` | CF 可下载 mod 只在 `manifest.json` 中记录 project-id/file-id，**JAR 不在 zip 中**；非 CF mod（有 `url`）的 JAR 在 `overrides/` | ❌ 以为所有 JAR 都在 zip 中 |

### 迁移前 vs 迁移后

- **迁移前**: `mods/` 中既有 `.pw.toml` 又有 JAR（git 跟踪），`detect` 只是标记哪些可从 CF 下载
- **迁移后**: `mods/` 中只有 `.pw.toml`，JAR 不在仓库中。CF mod 的 JAR 必须通过其他方式获取

### 正确做法：packwiz-installer + 本地静态服务器

参考 `scripts/sync-packwiz-assets.ps1` 的流程：

1. 创建临时 pack 目录，复制 `.pw.toml` 元数据 + `packwiz-files/`
2. 将 `.pw.toml` 中的 GitHub raw URL 替换为 `http://127.0.0.1:{PORT}/packwiz-files/`
3. 在临时目录中 `packwiz refresh`
4. 启动 Python 静态服务器：`python3 -m http.server $PORT --directory "$PACK_DIR" &`
5. 运行 `packwiz-installer`：`java -jar packwiz-installer.jar --bootstrap-no-update -g http://127.0.0.1:$PORT/pack.toml`
6. installer 会将所有 mod JAR 下载到 `mods/`，资源包到 `resourcepacks/`，光影到 `shaderpacks/`
7. 清理：kill server，删除临时目录

### 规则

> **CI 中获取 mod JAR 必须用 `packwiz-installer`，不能依赖 `detect` 或 `export`。Release 产物中不得包含 `packwiz-files/` 目录，所有 JAR/资源包/光影必须在标准目录（`mods/`、`resourcepacks/`、`shaderpacks/`）中。**

## Packwiz-files 发布前需净化 CurseForge metadata

**日期**: 2026-05-21

- **Problem**: `packwiz-files` 可兜底第三方下载受限文件，但 CurseForge 上已有的文件若以 direct URL/override 发布会被判定为应使用 manifest 引用。
- **Fix/Lesson**: 客户端 CurseForge 包和补丁包发布前先用本地 `packwiz-files` payload 跑 `packwiz curseforge detect`，能识别为 CF metadata 的文件只进入 manifest，无法识别的自定义/非 CF 文件才作为实际 payload 保留。

## PowerShell helper 函数不要使用 `$Args` 作为参数名

**日期**: 2026-05-21

- **Problem**: `write-knowledge-candidate-report.ps1` 使用 `[string[]]$Args` 作为 helper 参数名后，调用 `Invoke-Git -Args ...` 时 git 文件发现结果为空，候选报告误判为无改动。
- **Fix/Lesson**: helper 参数改名为 `$GitArgs` 并用 `-GitArgs` 调用；项目脚本避免把 PowerShell 自动变量名当作自定义参数名。

## PR 前不要在原始运行目录直接全量 `packwiz refresh`

**日期**: 2026-05-23

- **Problem**: 在原始游戏运行目录为普通 `config/` 或 `kubejs/assets/` 改动直接执行 `packwiz refresh`，会重算大量无关 `index.toml` 条目并让 PR 带入数千行噪音。
- **Fix/Lesson**: `pack.toml`/`index.toml` 已改为由 `modpack.toml` 生成且不跟踪；PR 前仍只对 mod JAR / `.pw.toml` / `packwiz-files` 变更运行 `scripts/update-packwiz-meta.ps1`。

## KubeJS BlockContainerJS property placement can reject custom states

**Date**: 2026-05-25

- **Problem**: `BlockContainerJS.set(id, props)` threw `No value present` when placing a custom KubeJS block with `facing`/`slice` properties from a right-click handler.
- **Fix/Lesson**: For placement-first interactions, call `targetBlock.set(id)` and let the startup-registered default state apply; set custom state values later with native `BlockState.setValue` only when needed.

## Release publish script must tolerate transient GitHub failures

**Date**: 2026-05-30

- **Problem**: `release-publish.ps1` can abort after tag push when PowerShell treats expected native-command failures or transient GitHub EOF/TLS errors as terminating errors.
- **Fix/Lesson**: Keep release steps idempotent, pass `-PreviousVersion`, use HTTP proxy only after `gh auth status`, create a draft release before uploading assets one-by-one with retries, and fail closed for first-stable summary detection so later stable releases do not reuse stale `docs/update-summary-*` content.
