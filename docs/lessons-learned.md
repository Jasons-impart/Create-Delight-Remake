# Lessons Learned

本文件只记录历史坑、根因和修复经验；当前操作流程、内容实现地图和轻量 how-to 分别写入 `.agents/skills/`、`docs/dev-knowledge/content-map.md` 和 `docs/dev-knowledge/how-to-index.md`。

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

## IAF Dragon Fix overrides Ice and Fire dragon placement

**Date**: 2026-06-23

- **Problem**: `iafdragonfix` disables Ice and Fire dragon cave/roost placed features and re-registers them as structures with its own biome tags, so the pack's Northstar-only dragon placement can be bypassed.
- **Fix/Lesson**: Override `data/iafdragonfix/tags/worldgen/biome/has_*_dragon_*.json` with `replace: true` and tune `data/iafdragonfix/worldgen/structure_set/*.json`, because Ice and Fire `config/iceandfire/*_dragon*_biomes.json` no longer controls the replacement structures.

## Northstar custom planet biomes need consistent feature order

**Date**: 2026-06-24

- **Problem**: Europa chunk generation crashed with `Feature order cycle found` because `europan_ridge_fields` and `europan_blue_ice_chasms` listed shared placed features in conflicting relative order.
- **Fix/Lesson**: Keep shared placed features in the same generation step ordered consistently across all custom planet biomes, varying biome decoration by subsets rather than reordered lists.

## Northstar fluid freezing uses planet-dimension temperature

**Date**: 2026-06-24

- **Problem**: Europa subsurface ocean water froze even after raising biome temperature because Northstar `FluidStateMixin` checks `NorthstarTemperature.getTemperatureAt`, which reads `planet_dimension.temperature`, not the biome JSON temperature.
- **Fix/Lesson**: For cold Northstar dimensions with liquid water, use a `planet_dimension.temperature` LevelFunction such as `northstar:block` to keep default terrain cold while returning above-freezing temperature for `minecraft:water`.
## Packwiz-files same-name replacements must compare hashes

**Date**: 2026-06-29

- **Problem**: `scripts/update-packwiz-meta.ps1` skipped raw-URL local assets when the referenced filename still existed, so replacing `packwiz-files` payloads with the same filename left stale `.pw.toml` SHA256 hashes.
- **Fix/Lesson**: Compare existing `.pw.toml` SHA256 values against same-name local files and refresh packwiz-files metadata on mismatch, because filename presence alone does not prove the payload is current.

## Order header packages must not count as ingredient packages

**Date**: 2026-07-02

- **Problem**: Requester automation can send the order itself as a Create package, but including that header package in `Order.checkAllPackages()` makes order identity and ingredient settlement share one package pool.
- **Fix/Lesson**: Let `order_deliverer.js` read orders from naked order items or package contents, but exclude any package containing an order from the ingredient package transfer.

## Order deliverer leading empty table cloths must not become segment starts

**Date**: 2026-07-02

- **Problem**: `order_deliverer.js` kept leading empty table cloths as the segment start, so rewards for a later order could be placed back on the first empty table cloth and look like the later segment was ignored.
- **Fix/Lesson**: Missing `create:table_cloth` remains the scan boundary, but each order segment should start at the table cloth containing its order.

## Duplicate order categories need per-entry keys

**Date**: 2026-07-02

- **Problem**: Order requester selections and reward scoring used category id as the entry identity, so orders containing repeated categories such as multiple tea entries mixed their counts and estimates.
- **Fix/Lesson**: Keep ratio rules keyed by category id, but key generated/fixed selections and per-entry scoring by stable occurrence keys such as `tea`, `tea#2`, and `tea#3`.

## CDC generated lang can be shadowed by hand-written lang

**Date**: 2026-07-02

- **Problem**: CDC `processResources` uses `DuplicatesStrategy.EXCLUDE`, so `src/main/resources/assets/createdelightcore/lang/*.json` with the same path as datagen output can make the final jar keep only the smaller hand-written file.
- **Fix/Lesson**: Put CDC lang additions in `EnglishLangHandler`/`ChineseLangHandler` and regenerate `src/generated/resources`, because `src/generated/resources` is already included as a main resource source set.

## TerraBlender bypasses Citadel surface rules in custom Alex cave dimensions

**Date**: 2026-07-02

- **Problem**: Youkai's Homecoming embeds TerraBlender, making Citadel skip its direct `NoiseGeneratorSettings` surface-rule merge, so custom fixed/non-TerraBlender Alex cave dimensions can fall back to vanilla dirt/stone/deepslate surfaces.
- **Fix/Lesson**: Put required Alex's Caves surface rules directly in the custom dimension noise settings, because TerraBlender only applies Citadel's compat rules to initialized TerraBlender region dimensions.

## Northstar Europa bulk ice features can overwrite generated content

**Date**: 2026-07-03

- **Problem**: Europa's `ice_cluster`, `blue_ice_cluster`, `ice_column`, and `icicles` placed features run as biome decoration after structures and earlier features, so surface-height placements can cover or intersect generated content.
- **Fix/Lesson**: Override the placed features with a `surface_relative_threshold_filter` below `OCEAN_FLOOR_WG`, because their built-in placement ranges sample the full 0-256 height band.

## Integrated API jigsaw structures can reject liquid starts

**Date**: 2026-07-03

- **Problem**: Integrated API jigsaw structures projected with `WORLD_SURFACE_WG` can choose water as the surface and spawn large structures on liquid.
- **Fix/Lesson**: Add `"cannot_spawn_in_liquid": true` to the structure JSON when using `integrated_api:jigsaw_structure` or `integrated_api:optional_dependency_structure`, because the codec checks the generated surface fluid before accepting the start chunk.

## Alex's Caves placement must use pack dimension data

**Date**: 2026-07-05

- **Problem**: Player-facing tips can incorrectly say every Alex's Caves biome is an independent dimension if they ignore the pack's Northstar dimension biome sources.
- **Fix/Lesson**: Check `kubejs/data/northstar/dimension/` and `kubejs/data/createdelight/dimension/` before updating Alex's Caves access text, because `config/alexscaves_biome_generation/*.json` is disabled and still points at vanilla overworld generation.

## Dynamic Create mixing recipes must not keep static duplicates

**Date**: 2026-07-06

- **Problem**: CDC dynamic berry syrup fluid mixing can appear to always output sweet syrup if CDR still has a KubeJS `create.mixing` recipe with the same berry/base-syrup inputs and static `cosmopolitan:berry_syrup` output.
- **Fix/Lesson**: Remove or override the old static KubeJS recipe when moving an output to a CDC dynamic Basin recipe, because Create may match the static recipe before the dynamic serializer runs.

## Addon mixins must not ship classes in dependency packages

**Date**: 2026-07-07

- **Problem**: A Quality Food Fluids mixin class placed under `com.simibubi.create.*` caused ModLauncher module resolution to fail with both Create and the addon exporting the same package.
- **Fix/Lesson**: Keep addon mixin classes in the addon's own package and use `@Coerce`, accessors, invokers, or access transformers for non-public dependency types, because Forge's module layer rejects split packages before mixins can run.

## Quality Food Create recipe hook can overwrite addon result NBT

**Date**: 2026-07-07

- **Problem**: Quality Food Fluids applied sequenced assembly final quality inside `SequencedAssemblyRecipe.advance`, but Quality Food's own `RecipeApplierMixin` later recalculated the Create output from the transitional item and removed the addon quality result.
- **Fix/Lesson**: For Create `RecipeApplier` paths, mark sequenced assembly final outputs as pending and reapply addon quality at `RecipeApplier.applyRecipeOn` return with lower mixin priority than Quality Food, then clear the internal pending tag.

## KubeJS foodProperties edits should be applied once per item

**Date**: 2026-07-07

- **Problem**: After updating from KubeJS build.16 to build.26, `item.foodProperties = food => { ... }` could enter the new `FoodBuilder.of` conversion path and build from an empty builder, so any food property not rewritten by the callback—including hunger, saturation, effects, and fast/always-edible flags—could disappear.
- **Fix/Lesson**: Restore the pre-build.26 direct food-property helpers and keep later intentional food ID/effect/property changes separate. Build.24 is currently being tested as the least disruptive rollback, but it still contains the `FoodProperties` type wrapper; do not call it a confirmed fix until a full restart regression passes. An effect-only workaround is not sufficient because the regression affects the whole `FoodProperties` object.

## Optional compat mixins should use LoadingModList

**Date**: 2026-07-07

- **Problem**: A Mixin config plugin can run before normal runtime mod-list helpers are safe, so optional third-party compat mixins may crash while deciding whether to apply.
- **Fix/Lesson**: Gate optional compat mixins with `LoadingModList.get().getModFileById(modid) != null` in `IMixinConfigPlugin.shouldApplyMixin`, and avoid loading the optional target class before that check.

## Created Diesel Generators bulk fermenter output checks ignore passed output lists

**Date**: 2026-07-07

- **Problem**: `BulkFermentingRecipe#applyOutputs` receives rolled item/fluid output lists, but its capacity checks read the recipe's original rollable/fluid outputs again, so mutating only the method arguments does not make NBT-qualified quality outputs safe.
- **Fix/Lesson**: Quality compat for `createdieselgenerators:bulk_fermenting` must intercept `applyOutputs` at HEAD and own both capacity simulation and insertion for quality-capable outputs, while storing a processing ticket before the run starts to avoid blocked-output rerolls.

## Optional Forge dependency ranges still reject installed mismatches

**Date**: 2026-07-08

- **Problem**: Quality Food Fluids marked Brewin' and Chewin' and Farmer's Respite as optional, but strict ranges such as `[3.2.1,)` rejected installed versions reported as `1.20.1-3.2.1` and put the mod into a broken state.
- **Fix/Lesson**: For optional compat dependencies whose mod versions include loader or Minecraft prefixes, use a permissive `mods.toml` range and gate behavior with runtime mod checks/mixin plugins instead of relying on Forge's version range.

## Jade addon components must not read Jade internal storage payloads

**Date**: 2026-07-08

- **Problem**: Quality Food Fluids read Jade's internal `JadeFluidStorage` payload from a broad `Block.class` provider, which could interfere with Jade's normal fluid container display.
- **Fix/Lesson**: Jade addons should register their own `IServerDataProvider` key for extra data and append only addon-specific tooltip lines, leaving Jade's universal fluid storage payload untouched.

## Fluid quality tags can break third-party FluidStack matching

**Date**: 2026-07-08

- **Problem**: Brewin' And Chewin' and Farmer's Respite compare recipe fluids with `FluidStack.isFluidEqual` or `areFluidStackTagsEqual`, so adding QFF quality NBT to the stored input fluid made otherwise valid recipes stop matching.
- **Fix/Lesson**: For third-party machine compat, strip only QFF's own quality tag during fluid equality checks while leaving other fluid NBT and the stored tank contents intact.

## Brewin' And Chewin' GUI extraction flag is not simulation

**Date**: 2026-07-08

- **Problem**: QFF treated the third boolean in `KegBlockEntity#fluidExtract(ItemStack, int, boolean, boolean)` as `simulate`, so the GUI path (`extractInGui` passes `true`) skipped quality post-processing while right-click extraction worked.
- **Fix/Lesson**: Treat that boolean as the in-GUI path flag and still apply tank/container quality on return; only actual `IFluidHandler.FluidAction.SIMULATE` calls should be skipped.

## Terralith dispenser_alt already covers the vanilla dispenser recipe

**Date**: 2026-07-12

- **Problem**: `terralith:dispenser_alt` outputs `minecraft:dispenser` with `#minecraft:stone_crafting_materials`; the vanilla tag already contains `minecraft:cobblestone`, and Terralith appends extra stone variants with `replace: false`, so keeping `minecraft:dispenser` leaves duplicate recipes.
- **Fix/Lesson**: Remove the vanilla `minecraft:dispenser` recipe ID in KubeJS and keep Terralith's broader recipe.

## Client-only mods must not enter server artifacts

**Date**: 2026-07-18

- **Problem**: The `v0.5.0.3` server artifact crashed during Forge `CONSTRUCT` because `ExtraHoloPage` loaded `net.minecraft.client.Options` and `ShoulderSurfing` mixed into Create's `ContraptionHandlerClient` on `DEDICATED_SERVER`.
- **Fix/Lesson**: Mark client-only Packwiz metadata such as `mods/ExtraHoloPage.pw.toml` and `mods/ShoulderSurfing.pw.toml` with `side = "client"` and smoke-test the server artifact until it reaches `Done`.

## Tetra material improvement previews do not retain material glyph tint

**Date**: 2026-07-16

- **Problem**: `ConfigSchematic#getPreviews` uses the schematic glyph for improvement outcomes, so `OutcomePreview.glyph` remains identical across material candidates even though `MaterialImprovementData.combine` generated tinted improvement data.
- **Fix/Lesson**: Resolve material-improvement colors by matching `OutcomePreview.materials` against the schematic-scoped material candidates and use the captured `MaterialData.tints.glyph`; do not assume module-variant and improvement previews preserve glyph tint in the same way.

## Tetra fixed-consumable outcomes are collapsed before HoloImprovementGui

**Date**: 2026-07-16

- **Problem**: Toolbelt schematics such as potion storage define several raw outcomes for different fixed consumables, but `ConfigSchematic#getPreviews` deduplicates them by `OutcomePreview.variantKey`; `HoloImprovementGui` therefore receives one preview and never creates the per-outcome buttons that a Shift overlay expected.
- **Fix/Lesson**: Capture fixed consumables from raw `SchematicDefinition.outcomes[].material`, preserve `keySuffixes` aliases, and resolve tag-backed items after tag synchronization; do not infer visible GUI variants from the number of JSON outcomes or use `OutcomePreview.materials` as the only fixed-consumable source。缺失耗材过滤只能用于已捕获原始定义的 `ConfigSchematic`；附魔等自定义 Java schematic 即使声明材料槽，也可能不在预览阶段提供材料栈，按空 `OutcomePreview.materials` 过滤会令整类改进消失。

## Tetra honing is filtered before the improvement list

**Date**: 2026-07-16

- **Problem**: `HoloVariantDetailGui.updateVariant` only forwards `SchematicType.improvement` to `HoloImprovementListGui`, while normal honing schematics use `isHoning() == true` with `SchematicType.major`; changing only the improvement-list layout therefore cannot make honing visible.
- **Fix/Lesson**: Capture honing from the unfiltered `SchematicRegistry.getPreviewSchematics` result and give it a separate Tetra-styled entry/list; keep `isHoning()` schematics out of the ordinary improvement count and selection stack.

## Tetra improvement discovery must preserve module ownership

**Date**: 2026-07-17

- **Problem**: MMT 的太刀、胁差专属打磨以及战争铸造、纷争铸造等普通改进会声明通用槽位或共用 improvement key，再通过正向 `tetra:module` requirement 限定模块；若为了展示完整候选而只检查 slot、preview 输出或 `acceptsImprovementLevel`，这些路径会出现在其他模块上。
- **Fix/Lesson**: 扫描隐藏打磨和补全普通改进时都要递归解析正向 module/improvement requirements：模块约束不匹配的路径直接排除；正向 improvement 前置若由当前模块可用的普通改进提供，也必须作为打磨根节点，再沿 improvement key 扩展全部等级与分支。不要把模块归属约束与锁定、材料或等级等可预览条件合并成一个 availability 布尔值。

## Tetra dynamic improvement widths require absolute extents and parent relayout

**Date**: 2026-07-16

- **Problem**: A `HoloImprovementGui` can grow after insertion into a `GuiHorizontalLayoutGroup`, and custom honing rendering cancels `updateVariants` at HEAD; a width correction injected at RETURN therefore never runs for honing, while the branch's old `header.getWidth()` formula also omits the title group's local offset and dynamic child extents. CDR 的 ExtraHoloPage 还会在同一方法的 RETURN 阶段按 `preview 数量 × 固定间距` 再次覆盖卡片宽度，因此开发环境正常的动态布局在整合包中即使只有少量改进也会重叠。
- **Fix/Lesson**: Route normal and cancelled rendering branches through one width helper, compute bounds from local absolute extents such as `child.getX() + child.getWidth()`, and set the variants container width explicitly. 在列表完成所有卡片更新后再次校正每张卡片，再对 owning horizontal group 执行 `forceLayout()` 并标记 scroll container dirty；跨模组同时注入目标方法时，不要依赖同级 RETURN 注入的执行顺序。

## Mixin 0.8.5 cannot transform array clone calls in a handler

**Date**: 2026-07-16

- **Problem**: Calling an array's `clone()` inside a Mixin handler (seen with both `UpgradeSchematic[]` and `IStatSorter[]`) compiles successfully, but Mixin 0.8.5 may treat the array descriptor as a class during runtime transformation, causing `ClassInfo.forName` to return null and crashing only when the target class is first loaded.
- **Fix/Lesson**: Use `System.arraycopy` or another copy path that does not emit an array-owner `clone()` invocation, inspect the reobfuscated JAR with `javap -c`, and open every affected screen in the production client because Gradle compilation cannot detect this transformer failure.

## Mixin injectors cannot target inherited mutil input handlers

**Date**: 2026-07-16

- **Problem**: `VerticalTabButtonGui` inherits `onMouseClick` from `GuiClickable`; an `@Inject(method = "onMouseClick")` targeting the subclass compiled successfully but failed when the workbench first constructed the class, preventing its screen from opening.
- **Fix/Lesson**: Inject only methods declared by the Mixin target; for inherited mutil input behavior, target the declaring superclass with strict instance scoping or preserve the native handler and implement state through declared focus, styling, group callback, or child GUI hooks. Always open the affected screen during `runClient` regression because Gradle compilation cannot validate injection ownership.

## Tetra array data stores cannot be disabled with replace objects

**Date**: 2026-07-17

- **Problem**: `ImprovementStore` 与 `SynergyStore` 直接把资源解析为数组，使用 `{"replace":true}` 覆盖会产生解析错误；`ModuleStore`、`SchematicStore` 等合并型 Store 虽接受该对象，但缺少类型或槽位的空定义会在注册阶段持续报警。MMT 的 Biomancy 联动旧覆盖同时触发了两种失败模式。
- **Fix/Lesson**: 数组型 Store 可在相同资源路径覆盖为 `[]`；已有未安装模组条件的资源应删除多余覆盖，让 `MergingDataStore` 直接跳过原资源，但必须逐文件核对，不能假设同一联动目录条件一致。MMT 的 Biomancy 模块、材料和升级链有 `forge:mod_loaded`，根级的 7 个固定耗材改进 schematic 却没有，需在相同资源路径用 `forge:false` 覆盖。只有缺少条件保护的 module 才使用 `replace:true`、有效 type、不可达槽位和空 variants。不要用字段不完整的假 `MaterialData` 禁用材料：`hiddenOutcomes` 不会阻止 `ImprovementStore` 展开材料，缺失的 `primary/secondary/tertiary` 会在 `MaterialImprovementData.combineWrap` 中触发空指针并阻止世界加载。

## Tetra sorter pagination implementations cannot coexist independently

**Date**: 2026-07-16

- **Problem**: TetraClip and Tetra Insight both paginated `HoloSortPopover`, but TetraClip's item `isVisible()` checked only its own page field; changing the Tetra Insight page label therefore left TetraClip on page 1 and made every later page blank.
- **Fix/Lesson**: Keep one owner for sorter pagination or explicitly synchronize both page states; when replacing TetraClip, remove its Packwiz metadata, packaged payload and runtime JAR before judging the replacement UI.

## Tetra material overrides must replace the complete upstream entry

**Date**: 2026-07-18

- **Problem**: 在相同资源路径放置新的 Tetra `materials` JSON 时，`MaterialStore` 会按合并式数据存储处理；只改三值而不声明完整替换，MMT 上游字段可能继续并入，导致静态文件看似正确但运行时材料结果与设计不一致。
- **Fix/Lesson**: 覆盖现有材料时使用当前目标 Tetra 版本可识别的完整 `MaterialData`，保留需要的原效果、物品和条件，并显式加入 `"replace": true`；修改后应逐项对照运行 JAR，确认除计划调整的数值外没有误删有效字段。不要延续已从目标版本反序列化器移除的旧字段。

## GeoTetraArmor armor contexts are version-specific legacy data

**Date**: 2026-07-19

- **Problem**: GeoTetraArmor `1.0.4-fix` 会请求 `armor` 与具体部位 context，因此 Tetra `6.9` 时必须重复声明护甲效果；但 Tetra `6.17` 的 `MaterialData` 已不读取 `contexts`，Tetrawear 也没有复刻该机制，继续保留这些 JSON 只会制造错误预期。
- **Fix/Lesson**: 材料上下文必须按目标 Tetra 与护甲附属的真实反序列化器复核，不能跨版本照搬。Tetrawear 使用护甲物品自身的模块数据和 `ArmorHelper` 汇总效果；护甲专属属性若没有明确玩法需求，不要机械移到材料根级，也不要为旧 Geo 行为重新实现一套上下文模拟。

## Black Knight Armor removes externally applied Solar Shield

**Date**: 2026-07-20

- **Problem**: `SolarFlareArmorEffects` 每个玩家 tick 都检查原生日耀套装；未穿齐时会主动移除 `blackknightarmor:solar_shield`，因此 KubeJS 为 Tetra 护甲添加该 Buff 后会在同一 tick 被清理。
- **Fix/Lesson**: Tetra 日耀材料改用独立的 `createdelight:solar_guard` 状态效果显示蓄积层数，不要与原模组的套装 tick 逻辑竞争；新增 mob effect 必须完整重启才能注册。

## Tetra schematic material previews must match module extract data

**Date**: 2026-07-19

- **Problem**: MMT 饰品 schematic 的 `translation` 可能复制错误属性；若审计时只读取原 MMT JAR，还会忽略 `kubejs/data/tetra/modules/` 已把暴击等效果覆盖为 AttributesLib 属性，导致工作台预览重新指回不再生效的原模组 effect。
- **Fix/Lesson**: 先读取工作区同路径 module 覆盖，缺失时才回退到 JAR，再按有效 variant 的 `extract.primary/secondary/tertiaryAttributes` 与 `Effects` 逐维核对 translation；只有暴击与固定护甲穿透等完全同语义效果才能归并到 AttributesLib，并同步 schematic 与 module 两层 description，所有覆盖继续保留 `replace: true`。

## Tetra replacements bypass schematic requirements

**Date**: 2026-07-19

- **Problem**: MMT 普通饰品基底通过 `data/tetra/replacements` 转换时会直接预装模块；`ReplacementDeserializer` 调用 `ItemModule.addModule()`，不会检查对应 schematic 的 `tetra:locked` requirement，因此仅给图纸加卷轴锁仍可通过首次转换取得被锁模块。
- **Fix/Lesson**: 审计阶段锁时必须同时检查同一物品的 replacement；普通基底只预装默认开放结构或不含独立乘区、减伤、追踪、神威、复活和状态触发的低收益初始模块，把主要能力留到玩家取得卷轴后再安装。多主模块物品还必须逐一填满决定本体外观的必需结构槽；只留下手套腕带或项链链条会让 `base_glove`/`pendant` 模型层缺失。

## Stage scroll recipes should not consume progression objects

**Date**: 2026-07-20

- **Problem**: MMT 阶段卷轴曾消耗蜜蜂精华、完整磁力手套、灾变 Boss 召唤物和利维坦唯一掉落，导致同级卷轴造价悬殊，并迫使玩家在永久能力、装备或再次挑战 Boss 之间做无关取舍。
- **Fix/Lesson**: 卷轴配方使用“单份阶段证明 + 双份可重复材料 + 单份主题材料”；永久奖励、完整装备、召唤物和可孵化唯一掉落只适合作为非消耗任务条件。Black Knight Armor 主题锭与终结龙锭均由悚怖钢二次处理，只能进入悚怖钢阶段后的卷轴；较早阶段优先使用 IAF 战利品等可重复材料。

## Tetra module selection must not repeatedly expand the full schematic registry

**Date**: 2026-07-16

- **Problem**: CDR loaded 938 schematics, while Tetra Insight scanned the registry multiple times, repeatedly called `getPreviews`, linearly searched captured snapshots and exhaustively tested all registered attributes/effects whenever a module material was selected; even modules with no improvements stalled, and large improvement sets amplified the cost.
- **Fix/Lesson**: Build one preview snapshot per selection, index captured data by key, derive contextual sorters from effects/attributes actually present on current outcomes, and construct only the current improvement page; log discovery/render timings in the production client.

## Tetra 加工台槽位视觉与容器点击区域相互独立

**Date**: 2026-07-17

- **Problem**: 移动 `SchemaSlotGui` 的 placeholder、border 和 quantity 子元素只会改变单材料槽的画面位置；`WorkbenchContainer.materialSlots` 仍保留原来的 `ToggleableSlot.x`，导致点击与物品放置区域偏离可见槽位。
- **Fix/Lesson**: 调整 Tetra 加工台材料槽时，必须同时移动 GUI 子元素，并在 `WorkbenchContainer.updateSlots` 完成后修正客户端容器槽位坐标；两边使用同一条单材料布局条件，多材料槽继续保留 Tetra 原生位置。

## 灾变沉没城的周边群系预检不同于实际落点标签

**Date**: 2026-07-19

- **Problem**: `Sunken_City_Structure` 会在区块生成器最低高度附近检查半径 29 格内的全部群系是否属于 `cataclysm:required_sunken_city_surrounding`；只填写土卫二地下海洋群系时，最低高度可能解析为冰原、山脊或蓝冰裂谷，导致 `/locate` 的所有候选点被拒绝。
- **Fix/Lesson**: `required_sunken_city_surrounding` 应引用完整的 `#northstar:europa_biomes` 以通过预检，同时保持 `has_structure/sunken_city_biomes` 只包含地下海洋与深渊裂谷，从而不扩大实际结构落点。

## 自定义洞穴群系需要同步底材 surface rule

**Date**: 2026-07-19

- **Problem**: 只把 Alex's Caves 或深暗群系加入 Northstar 维度的 `multi_noise` 只会改变群系归属，洞壁和洞底仍由目标 `noise_settings.default_block` 与 `surface_rule` 生成；月岩底材还会让只替换 `alexscaves:galena_gen_replaceables` 的磁化洞穴矿物和碎屑失去生成目标。
- **Fix/Lesson**: 将外来洞穴群系接入 Northstar 星球时必须同时核对其底材和 placed feature target；为对应星球覆盖或新增专用 noise settings，并在 bedrock 后、星球通用石材规则前加入 biome-conditioned surface rule。

## Northstar 的字符串 renderer 是贴图快捷写法

**Date**: 2026-07-19

- **Problem**: 在 planet JSON 中写入 `"renderer": "northstar:no_op"` 会按简单星体贴图解析，而不是创建 `NoopPlanetRenderer`，因此目标星体仍会进入望远镜和天空渲染流程。
- **Fix/Lesson**: 无绘制星体必须使用带类型的对象形式 `"renderer": { "type": "northstar:no_op" }`；字符串形式只用于贴图资源位置。

## 灾变诅咒金字塔按中心地表统一放置全部分块

**Date**: 2026-07-19

- **Problem**: `Cursed_Pyramid_Structure` 自行读取中心点的 `WORLD_SURFACE_WG` 高度，并把 48×48 的四块地下模板统一下移 39 格；它不使用结构 JSON 的 `start_height`，在起伏地形上会让整片地下外墙裸露为直角断面。
- **Fix/Lesson**: 不能用调整 `start_height` 或增加 `beard_box` 修复金字塔截断；应在生成入口对占地角、边与中心采样，坡度超过阈值时拒绝候选位置。

## 大型地表结构的 beard_box 会制造包围盒尺度断崖

**Date**: 2026-07-19

- **Problem**: Integrated API 的水星炎魔竞技场体积很大，使用 `terrain_adaptation: beard_box` 会围绕完整结构包围盒重塑密度，在起伏地形上形成大面积垂直石墙。
- **Fix/Lesson**: 大型地表建筑优先使用 `beard_thin` 并配合占地坡度预检；`beard_box` 只适合确实需要整块地基填充且包围盒较小的结构。

## 外星结构生物抗性不能只按结构模板枚举

**Date**: 2026-07-19

- **Problem**: 土卫二沉没城的低温与缺氧抗性只覆盖结构模板直接关联的深潜者和利维坦，遗漏了在深渊裂谷自然生成的珊瑚傀儡，以及由同生态玩法产生的珊瑚巨兽、蓑鲉、紫晶蟹和幼年利维坦。
- **Fix/Lesson**: 为外星结构补环境抗性时应同时审计 NBT/拼图池、群系生成配置、祭坛召唤物、Boss 衍生物与可携带幼体，再统一加入对应 Northstar 实体标签。

## Tetra Insight 中锁定图纸需要 revealable 才会显示

**Date**: 2026-07-20

- **Problem**: 带 `tetra:locked` 的 MMT 泰坦 schematic 使用默认 `preview=applicable` 时，未放置卷轴会从 Tetra Insight 全息球改良总览完全消失，而不是显示为锁定。
- **Fix/Lesson**: 希望玩家能提前查看并看到所需卷轴的锁定图纸必须设置 `"preview": "revealable"`；`tetra:locked` 继续负责实际安装权限。

## Tetra improvement requirement 只检查目标主模块

**Date**: 2026-07-20

- **Problem**: `tetra:improvement` requirement 调用 `CraftingContext.targetMajorModule.getImprovement()`，不会扫描整件武器的其他主模块；若同一类互斥强化开放在多个槽位，玩家可在各槽分别安装并绕过武器级上限。
- **Fix/Lesson**: 纯数据实现武器级互斥时必须让相关 schematic 对每种武器共用唯一主槽；若确实要跨多个槽位安装，则需自定义整件物品检查，不能只依赖 `tetra:improvement`。

## Tetra Insight 会过滤含不可接受 outcome key 的整张图纸

**Date**: 2026-07-20

- **Problem**: 为四组泰坦互斥在 schematic outcome 中追加仅作判定的 `titan_*_attunement` / `cyrene_attunement` 后，Tetra Insight 会调用目标模块的 `acceptsImprovementLevel()` 检查每个预览 key；辅助 key 不被接受时，整张图纸在 `preview: revealable` 生效前就被候选过滤，导致 12 首颂歌和泰坦方案消失。
- **Fix/Lesson**: outcome 只写实际生效且模块已接受的 improvement；纯互斥应在 requirement 中枚举真实泰坦、`strife_forged` 或 `ode_to_*` key，不要追加隐藏辅助 improvement。

## T.O 6.3.0 不兼容 Iron's Spells 3.16.x 的 Dead King 包路径

**Date**: 2026-07-20

- **Problem**: T.O Magic 'n Extras 6.3.0 直接引用 `dead_king_boss.DeadKingAnimatedWarlockAttackGoal`；Iron's Spells 从 3.16.0 起把该类移动到 `dead_king_boss.goals`，实例化 `EnragedDeadKingBoss` 时会触发 `NoClassDefFoundError`。
- **Fix/Lesson**: 1.20.1 使用 T.O 6.3.0 时固定 Iron's Spells 3.15.6 与 Iron's Lib 1.0.2；不要只按 T.O 声明的 `[3.15.0,)` 版本范围升级到 3.16.x，更新前应检查闭源附属直接引用的类路径。

## AE2 自定义线缆部件模型必须在预初始化阶段注册

**Date**: 2026-07-25

- **Problem**: 自定义 `IPart` 只覆盖 `getStaticModels()` 并返回附属命名空间模型时，JSON 即使存在也不会进入 AE2 的部件模型集合，渲染 CableBus 区块会因 `Trying to use an unregistered part model` 崩溃；附属注册的 `PartItem` 也不在 AE2 的物品着色遍历中，未单独注册颜色处理器时终端发光遮罩会显示为实心白色。
- **Fix/Lesson**: 在模组构造阶段、AE2 冻结模型集合前调用 `appeng.api.parts.PartModels.registerModels(...)` 注册全部自定义部件模型，并通过 `RegisterColorHandlersEvent.Item` 为附属 `PartItem` 注册 `AEColor.TRANSPARENT.getVariantByTintIndex(...)`；`models/item` 既不能代替 CableBus 模型注册，也不会自动获得 AE2 物品 tint。

## KubeJS Rhino 的 JSON.stringify 可能保留裸 NaN

**Date**: 2026-07-28

- **Problem**: KubeJS 服务端脚本把不存在的属性转为数值后会得到 `NaN`；Rhino 的 `JSON.stringify` 可能输出裸 `NaN` 而不是标准 JSON 的 `null`，字符串能写入 persistent data，但下次 `JSON.parse` 会让整条记录失效。
- **Fix/Lesson**: 写入 JSON 字符串前必须把计时器等外部值转换为有限数值并提供 fallback，同时在 stringify replacer 中拦截非有限数；对已发布数据增加一次兼容解析，将裸 `NaN` 修为 `null` 后再规范化并回写。

## 双格作物重置必须分别恢复上下半格状态

**Date**: 2026-07-30

- **Problem**: 收割兼容若把当前 `BlockState` 同时写回双格作物的两个位置，会把 `DoublePlantBlock.HALF` 一并复制，形成两个 `LOWER` 或两个 `UPPER`，随后邻居更新会把无效结构整株清除。
- **Fix/Lesson**: 先归一化到底部坐标，再分别构造并写回 `LOWER` 与 `UPPER` 状态；年龄等共享属性可以同步，但不能复用未经修正的半格状态。

## ProcessingRecipe 的 toolNotConsumed 不会自动保留机械手工具

**Date**: 2026-07-30

- **Problem**: `ProcessingRecipeBuilder.toolNotConsumed()` 只写入配方参数；Create `6.0.8` 的机械手执行路径只从 `ItemApplicationRecipe.shouldKeepHeldItem()` 读取该语义，普通 `ProcessingRecipe` 即使声明不消耗仍会扣数量或耐久。
- **Fix/Lesson**: 第三方机械手配方应继承 Create 的保留工具配方类型，或在 Create 消耗点按明确配方类型兼容；修补时必须区分传送带原料的第一次 `shrink` 与手持工具的第二次 `shrink`。

## 第三方方块覆盖原版方法时仍需生成 Minecraft 方法映射

**Date**: 2026-07-30

- **Problem**: 对第三方方块类使用类级 `@Mixin(..., remap = false)` 会连带禁止 `use` 等原版方法名生成 refmap，开发环境可以编译，但生产 JAR 中目标已是 `m_6227_`，注入可能失效。
- **Fix/Lesson**: Mixin 类保持默认 remap，让原版覆盖方法映射到 SRG；仅对第三方自定义调用点（如 `dropFruit`）在对应 `@At` 上单独设置 `remap = false`，并检查最终 refmap。

## Better Combat 前摇倍率必须保持严格正数

**Date**: 2026-08-04

- **Problem**: Better Combat `1.9.0` 的动画速度路径会除以 `upswing_multiplier`；即使 Mixin 放开服务端原有的 `0.2` 下限，配置为 `0.0` 仍会把 `Infinity` 传给 Player Animator，并可能造成攻击动画冻结。
- **Fix/Lesson**: 零前摇不能只靠放宽配置夹取实现；本包必须使用严格大于 `0` 的倍率，修改后完整重启并实测攻击动画。当前 `0.1` 仅完成配置与静态检查，仍需玩家回归。

## 按住式径向菜单不能依赖 GUI 中的逻辑 KeyMapping 状态

**Date**: 2026-08-04

- **Problem**: 构形模块轮盘打开后用 `KeyMapping.isDown()` 判断 Create 工具箱键是否仍被按住；屏幕切换会使逻辑按键状态失真，轮盘立即关闭，并被系统按键重复事件反复打开，表现为长按时界面闪现循环。
- **Fix/Lesson**: 按住后松键确认的 GUI 应按当前键绑定直接查询 GLFW 物理状态，并分别处理键盘键与鼠标键；`consumeClick()` 只用于首次打开，随后要锁定到物理松键并持续清除按键重复点击，避免左键确认后在同一次长按中再次呼出。

## Create 工具箱轮盘槽必须按实际纹理尺寸定位

**Date**: 2026-08-05

- **Problem**: `TOOLBELT_SLOT` 实际为 `22×22`、高亮为 `24×24`；把二者按同一整数中心定位会让物品相对槽位偏移一像素，动画路径再取整还会在高帧率下表现为逐像素卡顿。
- **Fix/Lesson**: 以普通槽左上角为浮点 Pose 锚点，高亮放在 `(-1,-1)`、`GuiGameElement` 放在 `(3,3)`；径向展开使用浮点平移和缓动曲线，不要先把圆周坐标取整。

## FTB Quests 新 ID 应限制在正 signed-long 范围

**Date**: 2026-08-13

- **Problem**: 离线生成的 16 位十六进制任务 ID 若最高位为 `8-F`，运行中的 FTB Quests 会将其自动重编号，却不会同步修正文档中手写的 `autofocus_id` 和 `change_page` 目标，导致章节入口或跨章跳转失效。
- **Fix/Lesson**: 新 ID 应限制在 `0000000000000001` 至 `7FFFFFFFFFFFFFFF`；任务重载后重新读取实际 SNBT，并校验根节点、`autofocus_id` 与全部跨章引用。

## CDC 读取 KubeJS 玩家持久数据不能猜测 NBT 子键

**Date**: 2026-08-17

- **Problem**: KubeJS 的 `player.persistentData` 在玩家存档中由 `KubeJSPersistentData` 管理；CDC 若从 Forge persistent data 猜测 `kubejs:persistent_data` 子键，会始终读到默认值，使订单声望被误判为 1 级。
- **Fix/Lesson**: Java 侧通过玩家对象的 `kjs$getPersistentData()` 读取 KubeJS 权威数据，并仅在方法不可用时回退到 Forge persistent data；新增跨层状态读取时应先核对真实存档与现有桥接方法。

## Crash Assistant 基线不能只从手动 JAR 文件名推断版本

**Date**: 2026-08-26

- **Problem**: `packwiz-files/mods/` 中为兼容性或分发目的重命名的 JAR，文件名版本可能包含 Minecraft、loader 或内部构建后缀；Crash Assistant 若只按文件名生成基线，就会把 Forge `mods.toml` 中的真实版本误报为模组升级。
- **Fix/Lesson**: `scripts/generate-crash-assistant-modlist.py` 对本地手动 JAR 优先读取 `META-INF/mods.toml` / `META-INF/neoforge.mods.toml`，遇到缺少载荷、损坏元数据或 `${...}` 未解析占位符时才回退到文件名解析；新增手动 JAR 时同时检查 Forge 内部版本与 Packwiz 文件名是否一致。

## CF manifest 条目不带安装路径，非 mods 内容必须走 overrides

**Date**: 2026-08-28

- **Problem**: `tacz/` 下的 Armorer 枪包改用 `mode = "metadata:curseforge"` 后，`packwiz curseforge export` 把它们写入 CF manifest 的 `files[]`（export 只看 `[update.curseforge]` 是否存在，对文件路径和分类无过滤无警告）；而 CF 格式（manifestVersion 1）文件条目只有 projectID/fileID/required，不含安装位置，启动器按项目 classId 固定映射落位——HMCL 只分流资源包/数据包/光影包，其余一律装进 mods。v0.5.0.8-test 起 Client 包导入后枪包被下载到 `mods/` 而非 `.minecraft/tacz/`，TaCZ 扫描不到，枪包不生效。
- **Fix/Lesson**: 非 mods 目录的 CF 托管内容必须用直链 URL 元数据（`https://edge.forgecdn.net/files/<file-id/1000>/<file-id%1000>/<文件名>`，空格用 %20）并移除 `[update.curseforge]` 段，export 才会把文件下载后打进 `overrides/<原目录>`，由安装器解压到实例根目录；CF 格式中这是唯一保证任意位置正确落位的通道（官方文档也只描述 manifest 引用 + overrides 两种机制）。
