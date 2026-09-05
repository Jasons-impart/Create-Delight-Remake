---
name: packwiz-assets
description: Manage Create-Delight Remake Packwiz assets. Use when adding, updating, removing, syncing, validating, or packaging mods/resourcepacks/shaderpacks/TACZ gun packs, packwiz-files payloads, CurseForge/manual-download metadata, or the Create Delight Core packaged jar.
---

# Packwiz Assets

Use this workflow for modpack asset operations that touch `mods/`, `resourcepacks/`, `shaderpacks/`, `tacz/`, `packwiz-files/`, `pack.toml`, `index.toml`, or the packaged CDC jar.

## Rules

- `mods/`, `resourcepacks/`, and `shaderpacks/` contain `.pw.toml` metadata only; do not track runtime jars there.
- CF-restricted, manual-download, and custom payloads belong in `packwiz-files/{mods,resourcepacks,shaderpacks}/` with matching raw-URL metadata.
- `tacz/` contains TACZ gun-pack `.pw.toml` metadata. Its downloaded `.zip` payloads are runtime files and are ignored by Git; committed source payloads live in `packwiz-files/tacz/`.
- TACZ gun packs are ZIP archives whose root is the pack content (`assets/`, `data/`, `gunpack.meta.json`, etc.); do not add an extra enclosing directory when packaging them.
- CF-hosted content outside `mods/` (e.g. `tacz/` gun packs) must use direct CDN URL metadata and must not carry `[update.curseforge]`: its presence makes `packwiz curseforge export` list the file in the CF manifest `files[]`, which has no install path, so launchers place it in the mods folder instead of `tacz/`. See `docs/lessons-learned.md` "CF manifest 条目不带安装路径，非 mods 内容必须走 overrides".
- When adding a new `packwiz-files/<category>/`, update both the parent and child `.gitignore`; the parent whitelist alone does not make payload files trackable.
- For a `packwiz-files` mod that also exists on CurseForge, keep its `[release.curseforge]` project/file hint accurate. Client export must convert these hints to `metadata:curseforge` before best-effort detection; a failed hinted conversion is a release error, not permission to bundle the JAR under `overrides/mods`.
- Add a known CurseForge asset through `scripts/add-packwiz-target.ps1`; update an existing CurseForge asset through `scripts/update-packwiz-target.ps1`; use `scripts/update-packwiz-meta.ps1 -FullReconcile` only for category-wide local-asset reconciliation. Avoid manual metadata edits unless repairing generated output.
- Do not run `scripts/update-packwiz-meta.ps1 -FullReconcile` on short-lived feature/PR branches because it derives `packwiz-files` raw URLs from the current branch and can rewrite unrelated `.pw.toml` files to branch URLs that disappear after merge.
- Branch-derived raw URLs are intended only for `main` and long-lived LTS/release-maintenance branches that must serve their own Packwiz payloads.
- `pack.toml` and `index.toml` are generated from `modpack.toml`; do not commit them.
- Do not narrow `sync-packwiz-assets.ps1 -MetadataRoots` when syncing a populated live instance: packwiz-installer treats omitted categories as removed from the temporary pack and deletes their local files. Use the default roots for live sync; limit roots only in an isolated disposable directory.
- Shaderpack files containing `Clrwl` are generated locally and must not be tracked.
- Set `side = "client"` or `side = "server"` explicitly for client-only or server-only mods.
- Use top-level `distribution = "development"` for assets that stay in local development only, or `distribution = "testing"` for assets that also enter test packages. Omit it (equivalent to `distribution = "release"`) for player-facing assets. All GitHub Actions exclude development assets; formal releases also exclude testing assets from Client, Server, integrity manifests, and release patches.
- Do not refresh GitHub Pages mod classification data (`docs/mods-data.js`) as part of normal asset changes; it is an expensive manual task and requires an explicit user request.

## Add Or Update Assets

1. For one known CurseForge project/file, run `./scripts/add-packwiz-target.ps1 -CurseForgeUrl <project-or-file-URL> -Category mods|resourcepacks|shaderpacks|tacz -Side client|server|both`. If CurseForge slug lookup fails, use `-CurseForgeProjectId <id>` and, for an exact build, `-CurseForgeFileId <id>` instead. It identifies the requested project's metadata even when Packwiz also generates temporary dependency entries, refuses to overwrite an existing target, and synchronizes local runtime assets by default. Resourcepack and shaderpack probes ignore the pack's mod-loader filter.
2. For an existing CurseForge metadata file, run `./scripts/update-packwiz-target.ps1 -Category mods|resourcepacks|shaderpacks|tacz -Slug <metadata-name>`, or use `-Path <relative .pw.toml path>`.
3. Put custom/restricted payloads under the matching `packwiz-files/<category>/` directory. Before adding one, check whether CurseForge already hosts the same build; if it does, attach an accurate `[release.curseforge]` project/file hint so release exports serve it from CurseForge instead of bundling it under `overrides/mods`. TACZ gun packs use the dedicated `scripts/update-tacz-packwiz-meta.ps1` conversion script because their source directories must be packaged as root-content ZIPs. To inventory local JARs, reconcile many changed assets, or repair metadata drift, run `./scripts/update-packwiz-meta.ps1 -Category mods|resourcepacks|shaderpacks|tacz -FullReconcile` only on `main` or a long-lived LTS/release-maintenance branch. Non-mod reconciliation removes loader filtering, strips trailing parenthesized version suffixes when searching CurseForge, and defaults new metadata to `side = "client"`; the `tacz` category defaults to `side = "both"`.
4. For slow overseas services, run `./scripts/sync-packwiz-assets.ps1 -Proxy "http://127.0.0.1:7890"`, or set `PACKWIZ_PROXY` so Git hooks and the repo sync workflow inherit the proxy. The sync script applies it to tool downloads and Packwiz installer requests.
5. Inspect the generated `.pw.toml` plus `packwiz-files` changes before staging, especially that existing `side = "client"` or `side = "server"` entries were not reset to `both`. TACZ packs normally use `side = "both"`.
6. Run `./scripts/sync-packwiz-assets.ps1` when local runtime files must match metadata. Repeated hook/workflow calls for the same revision are skipped after a successful sync; use `-Force` to repair local runtime files.
7. When a resource pack should be enabled for new clients by default, add its exact `file/<filename>` entry to `.options.txt` `resourcePacks`; release packaging renames this tracked file to `options.txt`. Verify its `pack.mcmeta` format before adding it to `incompatibleResourcePacks`.

Packwiz's side pruning, local sync, release patch builder, server export, and CurseForge export all include `tacz/`. Keep that root in sync when changing the asset workflow; otherwise TACZ metadata may refresh locally but be omitted from CI artifacts.

When old and new runtime JARs coexist, `update-packwiz-meta.ps1` selects the preferred newer filename and updates the existing metadata entry instead of creating a duplicate. Missing runtime JARs do not remove metadata by default; remove the `.pw.toml` explicitly, or use `-AllowRemovals` only when bulk removal is intentional and the runtime directory is complete.

### 短期 PR 分支上的 CurseForge 定向更新

1. 不要在仓库根目录直接运行 `packwiz update`，因为 `pack.toml` 和 `index.toml` 是生成文件且通常不存在。
2. 运行 `./scripts/update-packwiz-target.ps1 -Category mods|resourcepacks|shaderpacks|tacz -Slug <metadata-name>`，或用 `-Path <relative .pw.toml path>` 精确指定目标。
3. 该脚本会生成临时 pack、只回写目标 `.pw.toml`、保留原始 `side`，并默认运行 `scripts/sync-packwiz-assets.ps1`；仅在明确不需要同步运行态文件时使用 `-SkipSync`，需要无网络预检时使用 `-DryRun`。
4. 检查 diff，确认没有生成文件、无关元数据改动，且没有把 `client` 或 `server` 退回 `both`。

## Remove Assets

1. On `main`, remove an asset by deleting its `.pw.toml` metadata.
2. Remove matching `packwiz-files` payloads only when the committed payload is intentionally retired.
3. Do not treat synced runtime jars as source; they are local development payloads.

## Crash Assistant 模组变更提醒

客户端通过 Crash Assistant 在启动时提醒 Mod 文件变更。以下文件必须保持一致：

- `scripts/generate-crash-assistant-modlist.py`：扫描受管理的 `mods/**/*.pw.toml`，生成客户端可用 JAR 的文件标识和末尾数字版本基线。
- `config/modpack_defaults/config/crash_assistant/modlist.json`：生成的对象基线，包含从 JAR 文件名推断的 Mod ID、显示名和版本；不要写入 CurseForge/Modrinth 指纹，以维持回退/恢复功能关闭。
- `config/modpack_defaults/config/crash_assistant/scripts/startup/20_modlist_changes_warning.jexl`：按可选客户端 Mod 白名单统计新增、移除和更新；无法按运行时 Mod ID 匹配的更新会以文件标识与末尾数字版本段配对，并分段显示详情。
- `config/modpack_defaults/config/crash_assistant/crash_assistant_localization_overrides/zh_cn.json`：提示的中文文本。

仅当 Mod 确实可选时才加入脚本白名单；除 `side = "client"` 外，还要检查反向强制依赖及直接脚本/配置集成。白名单应使用与目标 JAR 对应的窄文件名前缀，并同时覆盖新增、移除和更新。文件名不带末尾数字版本段时不能可靠识别为一次版本变化，应保留为独立新增/移除项。

提交 `mods/**/*.pw.toml` 变动时，已通过 `scripts/install-git-hooks.ps1` 安装的 `pre-commit` hook 会自动重建并暂存该基线；PR 校验会再次生成并检查文件是否已提交。未安装 hook 或明确使用 `--no-verify` 时，手动执行以下流程：

```powershell
./scripts/sync-packwiz-assets.ps1
python scripts/generate-crash-assistant-modlist.py
```

CI 会在 Client 与 Patch 构建前重新生成基线；Patch 也会包含 Crash Assistant 默认配置、基线、启动脚本与本地化文件。Crash Assistant 内置 `too_many_changes_warning` 必须保持 `count = -1`，因为它不支持白名单。

Crash Assistant 的 JEXL 使用严格词法作用域：不要以 `var` 声明与后续 `for (...)` 迭代变量同名；提交前应使用模组 JAR 内置的 JEXL3 编译启动脚本，避免游戏启动时才暴露解析错误。

## CDC Packaged Jar

1. Prefer published CurseForge metadata when a CDC release exists.
2. For unpublished builds, keep the filename `packwiz-files/mods/Create-Delight-Core-1.20.1-dev.jar`.
3. On short-lived feature branches, update only `mods/create-delight-core.pw.toml` hash for the new jar and keep its raw URL pointing at `main`; do not run the full metadata update script.
4. If a full metadata update is unavoidable off `main`, first set `PACKWIZ_FILES_RAW_PREFIX=https://raw.githubusercontent.com/Jasons-impart/Create-Delight-Remake/main/packwiz-files/`, then inspect and revert unrelated `.pw.toml` URL rewrites before committing.
5. Before staging or summarizing CDC artifact changes, fetch `CDC-mod-src` `origin/1.20.1`; if it fast-forwards, include the submodule pointer in the same commit so source matches the packaged jar.

## After Git Updates

For pull, rebase, merge, or branch updates, use `repo-sync`: it installs local `.git/hooks` shims that call tracked `scripts/.githooks`, then calls `scripts/sync-packwiz-assets.ps1 -IfGitChanged` so Packwiz runtime sync logic stays in one script.
