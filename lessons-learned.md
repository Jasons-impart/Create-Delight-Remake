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

## Test release prepare must not update stable announcement files

**Date**: 2026-05-31

- **Problem**: `release-prepare.ps1 -ReleaseType 测试` updated `docs/announcement.md`, causing prerelease PRs to overwrite the stable announcement.
- **Fix/Lesson**: Only stable prepare runs write `docs/announcement.md` or auto-stage `docs/update-summary-*.md`; test releases may use `-Announcement` only for the PR body.

## Release artifact transfer needs measured proxy behavior on Windows

**Date**: 2026-05-31

- **Problem**: `gh run download` and `gh release upload` hung during v0.5.0.0, while proxied release upload was an order of magnitude slower than direct upload.
- **Fix/Lesson**: Use authenticated `curl --config -` for large transfers, benchmark proxy vs direct routes when `-Proxy` is provided, and clear artifact extraction directories before retrying.

## Functional Storage controller extensions must avoid blocking capability lookup

**Date**: 2026-06-04

- **Problem**: FTB Chunks login force-loading can deadlock when Lightman's Currency probes a Functional Storage controller extension and `getCapability()` resolves the controller through `Level#getBlockEntity`, which may enter `ServerChunkCache#getChunkBlocking`.
- **Fix/Lesson**: CDC mixins should keep player/UI paths unchanged but redirect Functional Storage controller extension `getCapability()` to read only `ServerChunkCache#getChunkNow` + `LevelChunk.EntityCreationType.CHECK`, extending the same helper to `getStorage()`/`getOptional()` only if future stacks move there.

## KubeJS Rhino try blocks can hide function declarations

**Date**: 2026-06-07

- **Problem**: A helper declared as `function calculateValueDistribution(...)` inside a `try` block passed `node --check` but was `undefined` in-game under Rhino, causing OEV to skip thousands of recipe value setters.
- **Fix/Lesson**: Keep reusable KubeJS helper functions at script top level or assign them before guarded blocks; use in-game reload logs as the source of truth for Rhino scoping behavior.

## Release config edits need tracked source files

**Date**: 2026-06-07

- **Problem**: `update-modpack-config` can edit ignored KubeJS config files during release, but patch generation diffs only tracked `HEAD` paths and can miss generated-only files.
- **Fix/Lesson**: Release-mutated config files such as `kubejs/config/probejs.json` must be committed as source files before workflows copy them into client/server/patch artifacts.


## Use packwiz-files for CurseForge-restricted shaderpacks

**Date**: 2026-06-11

- **Problem**: `sync-packwiz-assets.ps1` failed when `I Like Vanilla` was excluded from the CurseForge API and required manual download.
- **Fix/Lesson**: Shaderpacks blocked from CurseForge third-party download should use `packwiz-files/shaderpacks/` raw URL metadata with `[release.curseforge]`, while shaderpacks not on CurseForge omit the release hint and stay as payloads.

## Butchercraft animal head blocks need KubeJS resource overlays

**Date**: 2026-06-11


- **Problem**: Butchercraft 2.4.1 registers animal head/skull floor and wall blocks without blockstates, and skull renderers look for `butchercraft:textures/entity/*.png` while the JAR stores those textures under `textures/block/entity/`.
- **Fix/Lesson**: Add KubeJS `blockstates/*_head*.json` overlays using `minecraft:block/skull` and copy the six skull textures into `kubejs/assets/butchercraft/textures/entity/` so placed heads do not render as missing purple-black blocks.

## Vintage Delight fermenting jar consumes duplicate ingredients from one slot

**Date**: 2026-06-16

- **Problem**: Vintage Delight 0.1.6 `FermentingJarBlockEntity#consumeIngredient` scans input slots from 0 for every `Ingredient`, so recipes with repeated matching ingredients consume multiple items from the first matching slot.
- **Fix/Lesson**: CDC patches the jar with a pseudo mixin that tracks consumed input slots during `craftItem`, because the mod is not a compile dependency and repeated ingredients must be distributed across distinct matched slots.

## Create Addition spool recipes must match connector drop economics

**Date**: 2026-06-17

- **Problem**: `createaddition:*_spool` sequenced assembly at `.loops(2)` let players craft a spool with 2 wires, place/break connectors, and recover 4 wires through link drops.
- **Fix/Lesson**: Keep spool sequenced assembly at `.loops(4)` so wire input matches connector-link recovery and cannot duplicate metals.

## Planet migration must include quest dimension tasks

**Date**: 2026-06-17

- **Problem**: After migrating from Ad Astra to Northstar, FTB Quests and tips still pointed players to old `ad_astra:*` dimensions such as removed Glacio.
- **Fix/Lesson**: When changing planet systems, search `config/ftbquests` and player-facing lang/tip files for old dimension IDs and planet names so quest gates remain reachable.

## Restored recipes may be blocked by removal lists

**Date**: 2026-06-17

- **Problem**: ExtendedAE's `expatternprovider:ex_drive` recipe existed upstream but was hidden because `kubejs/server_scripts/AE2/machine.js` removed its recipe ID.
- **Fix/Lesson**: Before adding replacement recipes, search KubeJS `remove_recipes_id` lists for the missing recipe ID so original mod recipes can be restored by removing stale deletes.

## Quest dependencies must match actual crafting prerequisites

**Date**: 2026-06-17

- **Problem**: The mechanical craft encoder quest depended on the molecular assembler quest even though the encoder only needs earlier mechanical crafting progression.
- **Fix/Lesson**: When editing FTB Quest dependencies, compare each dependency ID against the item's real recipe path so optional downstream machines do not gate unrelated tools.

## KubeJS Java class governance needs explicit facade reads

**Date**: 2026-06-19

- **Problem**: Java-reference scans catch literal `Packages\.` substrings such as `rewardPackages`, and `order_deliverer.js` used `$PackageItem` through a cross-file top-level leak.
- **Fix/Lesson**: Keep Java classes in `00_java_classes.js` facades, read needed classes explicitly in each script, and avoid `Packages` in KubeJS variable/function names used near governance scans.

## Moonlight soft fluid conversion must preserve original Forge fluid IDs

**Date**: 2026-06-19

- **Problem**: Supplementaries faucets convert Forge `FluidStack`s through Moonlight `SoftFluidStack`; tag-equivalent fluids such as `createdelight:soya_milk` in `#forge:milk` can round-trip back as the soft fluid default `minecraft:milk`.
- **Fix/Lesson**: CDC preserves the original Forge fluid id in the soft stack tag during Moonlight Forge conversion and restores it when converting back, because soft fluid `equivalent_fluids` mappings are many-to-one.

## Ice and Fire missing Tabula models need classloader fallback

**Date**: 2026-06-20

- **Problem**: `iceandfire-2.1.13-1.20.1-beta-5` lacks `firedragon_swimming.tbl` and `firedragon_swim5.tbl`, causing client resource reload NPE stack traces just before the title screen.
- **Fix/Lesson**: Patch CDC to redirect Ice and Fire `TabulaModelHandlerHelper` classloader resource lookups to existing firedragon model fallbacks, because KubeJS resource-pack assets do not satisfy `ClassLoader#getResourceAsStream`.

## Virtual fluid buckets need FluidType bucket mappings

**Date**: 2026-06-20

- **Problem**: Northstar virtual fluids could be inserted from custom buckets but empty buckets could not extract them from Forge-standard containers such as Functional Storage fluid drawers because the fluids had no native `FluidType#getBucket` result.
- **Fix/Lesson**: Register plain CDC `BucketItem`s with `FluidEntry#getSource()` and patch `FluidType#getBucket` after normalizing flowing fluids to source; virtual fluids already cannot place in-world, and Create basin-specific fill patches stay separate because Create checks its own item-filling path.

## Ratatouille squeezing fluid matches need amount checks

**Date**: 2026-06-21

- **Problem**: Ratatouille 1.3.8 `SqueezingRecipe#matches` and `#match` call `FluidIngredient#test` without checking `getRequiredAmount`, so recipes like `createdelight:squeezing/raw_sausage` can run with 1 mB of a matching fluid.
- **Fix/Lesson**: CDC patches both recipe matching entry points to require matching fluid type and amount before the press starts, because `process` drains the configured amount only after the recipe has already passed matching.

## OEV fluid input costs need explicit recipe extra value

**Date**: 2026-06-22

- **Problem**: OneEnoughValue only prices `ItemStack`/`Ingredient` inputs natively, so Create fluid ingredients and hidden machine fluids such as `casualness_delight:deep_frying` oil cost can be ignored and make processed foods price like raw inputs.
- **Fix/Lesson**: Add fluid costs through OEV recipe extra value using a per-1000 mB fluid value table, and mirror hidden fluid consumption by recipe type so alternate recipes cannot undercut the explicit-fluid path.

## OEV Create processing outputs may be rollable results

**Date**: 2026-06-22

- **Problem**: Create processing recipes such as mixing can expose their outputs through `getRollableResults()` while `getResultItem(registryAccess)` is empty, so OEV may skip recipe-derived values and fall back to food nutrition pricing.
- **Fix/Lesson**: OEV output getters should fall back to extracted `getRollableResults()` stacks and avoid counting the same item ID twice when value setters also inspect rollable outputs.

