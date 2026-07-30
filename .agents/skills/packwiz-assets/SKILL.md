---
name: packwiz-assets
description: Manage Create-Delight Remake Packwiz assets. Use when adding, updating, removing, syncing, validating, or packaging mods/resourcepacks/shaderpacks, packwiz-files payloads, CurseForge/manual-download metadata, or the Create Delight Core packaged jar.
---

# Packwiz Assets

Use this workflow for modpack asset operations that touch `mods/`, `resourcepacks/`, `shaderpacks/`, `packwiz-files/`, `pack.toml`, `index.toml`, or the packaged CDC jar.

## Rules

- `mods/`, `resourcepacks/`, and `shaderpacks/` contain `.pw.toml` metadata only; do not track runtime jars there.
- CF-restricted, manual-download, and custom payloads belong in `packwiz-files/{mods,resourcepacks,shaderpacks}/` with matching raw-URL metadata.
- For a `packwiz-files` mod that also exists on CurseForge, keep its `[release.curseforge]` project/file hint accurate. Client export must convert these hints to `metadata:curseforge` before best-effort detection; a failed hinted conversion is a release error, not permission to bundle the JAR under `overrides/mods`.
- Add a known CurseForge asset through `scripts/add-packwiz-target.ps1`; update an existing CurseForge asset through `scripts/update-packwiz-target.ps1`; use `scripts/update-packwiz-meta.ps1 -FullReconcile` only for category-wide local-asset reconciliation. Avoid manual metadata edits unless repairing generated output.
- Do not run `scripts/update-packwiz-meta.ps1 -FullReconcile` on short-lived feature/PR branches because it derives `packwiz-files` raw URLs from the current branch and can rewrite unrelated `.pw.toml` files to branch URLs that disappear after merge.
- Branch-derived raw URLs are intended only for `main` and long-lived LTS/release-maintenance branches that must serve their own Packwiz payloads.
- `pack.toml` and `index.toml` are generated from `modpack.toml`; do not commit them.
- Shaderpack files containing `Clrwl` are generated locally and must not be tracked.
- Set `side = "client"` or `side = "server"` explicitly for client-only or server-only mods.
- Set top-level `stable = false` for assets allowed in local development and test releases but excluded from formal releases. Formal workflows pass stable-pruning mode for Client, Server, integrity manifests, and release patches; test workflows and ordinary `sync-packwiz-assets.ps1` runs must not.
- Do not refresh GitHub Pages mod classification data (`docs/mods-data.js`) as part of normal asset changes; it is an expensive manual task and requires an explicit user request.

## Add Or Update Assets

1. For one known CurseForge project/file, run `./scripts/add-packwiz-target.ps1 -CurseForgeUrl <project-or-file-URL> -Category mods|resourcepacks|shaderpacks -Side client|server|both`. It identifies the requested project's metadata even when Packwiz also generates temporary dependency entries, refuses to overwrite an existing target, and synchronizes local runtime assets by default. Resourcepack and shaderpack probes ignore the pack's mod-loader filter.
2. For an existing CurseForge metadata file, run `./scripts/update-packwiz-target.ps1 -Category mods|resourcepacks|shaderpacks -Slug <metadata-name>`, or use `-Path <relative .pw.toml path>`.
3. Put custom/restricted payloads under the matching `packwiz-files/<category>/` directory. To inventory local JARs, reconcile many changed assets, or repair metadata drift, run `./scripts/update-packwiz-meta.ps1 -Category mods|resourcepacks|shaderpacks -FullReconcile` only on `main` or a long-lived LTS/release-maintenance branch. Non-mod reconciliation removes loader filtering, strips trailing parenthesized version suffixes when searching CurseForge, and defaults new metadata to `side = "client"`.
4. For slow overseas services, retry once with `-Proxy "http://127.0.0.1:7890"`.
5. Inspect the generated `.pw.toml` plus `packwiz-files` changes before staging, especially that existing `side = "client"` or `side = "server"` entries were not reset to `both`.
6. Run `./scripts/sync-packwiz-assets.ps1` when local runtime files must match metadata.

When old and new runtime JARs coexist, `update-packwiz-meta.ps1` selects the preferred newer filename and updates the existing metadata entry instead of creating a duplicate. Missing runtime JARs do not remove metadata by default; remove the `.pw.toml` explicitly, or use `-AllowRemovals` only when bulk removal is intentional and the runtime directory is complete.

### 短期 PR 分支上的 CurseForge 定向更新

1. 不要在仓库根目录直接运行 `packwiz update`，因为 `pack.toml` 和 `index.toml` 是生成文件且通常不存在。
2. 运行 `./scripts/update-packwiz-target.ps1 -Category mods|resourcepacks|shaderpacks -Slug <metadata-name>`，或用 `-Path <relative .pw.toml path>` 精确指定目标。
3. 该脚本会生成临时 pack、只回写目标 `.pw.toml`、保留原始 `side`，并默认运行 `scripts/sync-packwiz-assets.ps1`；仅在明确不需要同步运行态文件时使用 `-SkipSync`，需要无网络预检时使用 `-DryRun`。
4. 检查 diff，确认没有生成文件、无关元数据改动，且没有把 `client` 或 `server` 退回 `both`。

## Remove Assets

1. On `main`, remove an asset by deleting its `.pw.toml` metadata.
2. Remove matching `packwiz-files` payloads only when the committed payload is intentionally retired.
3. Do not treat synced runtime jars as source; they are local development payloads.

## Pack Integrity Warning

The client has a mod list integrity warning for added or removed mods. Keep these files together:

- `scripts/generate-pack-integrity-manifest.py`: scans managed `mods/**/*.pw.toml`, records expected managed JAR filenames, and writes the expected manifest without requiring downloaded JARs.
- `kubejs/config/createdelight_pack_integrity_expected.json`: generated expected filename manifest; regenerate it after intended mod additions/removals.
- `kubejs/config/createdelight_pack_integrity.json`: runtime config, including `allowedMissingFiles` and `allowedExtraFiles`; both accept exact filenames or narrow `*`/`?` glob patterns.
- `kubejs/client_scripts/pack_integrity_check.js`: client-side title-screen warning and JSON report writer for mod list changes and Java major-version mismatches.

Only add a managed JAR to `allowedMissingFiles` when it is intentionally optional. For client-only candidates, check both reverse mandatory dependencies in runtime JAR metadata and direct project-script/config integration; `side = "client"` alone does not make removal safe. Prefer a version-independent but narrow filename pattern, then verify it matches only the intended entry in `createdelight_pack_integrity_expected.json`.

The runtime warning compares managed JAR filenames only. Do not use Forge/KubeJS runtime mod ids for this check because embedded library jars and JarJar metadata do not map reliably to actual files users add or remove.

Generation workflow:

```powershell
./scripts/sync-packwiz-assets.ps1
python scripts/generate-pack-integrity-manifest.py
```

CI generates the integrity manifest before exporting the no-mod CurseForge pack, so the manifest comes from Packwiz metadata and does not require downloading runtime JARs. Patch artifacts also regenerate and copy `createdelight_pack_integrity_expected.json` into `patch/kubejs/config/`, so patch releases pick up changed filenames even if the generated file was stale before CI.

## CDC Packaged Jar

1. Prefer published CurseForge metadata when a CDC release exists.
2. For unpublished builds, keep the filename `packwiz-files/mods/Create-Delight-Core-1.20.1-dev.jar`.
3. On short-lived feature branches, update only `mods/create-delight-core.pw.toml` hash for the new jar and keep its raw URL pointing at `main`; do not run the full metadata update script.
4. If a full metadata update is unavoidable off `main`, first set `PACKWIZ_FILES_RAW_PREFIX=https://raw.githubusercontent.com/Jasons-impart/Create-Delight-Remake/main/packwiz-files/`, then inspect and revert unrelated `.pw.toml` URL rewrites before committing.
5. Before staging or summarizing CDC artifact changes, fetch `CDC-mod-src` `origin/1.20.1`; if it fast-forwards, include the submodule pointer in the same commit so source matches the packaged jar.

## After Git Updates

For pull, rebase, merge, or branch updates, use `repo-sync`: it installs local `.git/hooks` shims that call tracked `scripts/.githooks`, then calls `scripts/sync-packwiz-assets.ps1 -IfGitChanged` so Packwiz runtime sync logic stays in one script.
