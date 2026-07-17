---
name: packwiz-assets
description: Manage Create-Delight Remake Packwiz assets. Use when adding, updating, removing, syncing, validating, or packaging mods/resourcepacks/shaderpacks, packwiz-files payloads, CurseForge/manual-download metadata, or the Create Delight Core packaged jar.
---

# Packwiz Assets

Use this workflow for modpack asset operations that touch `mods/`, `resourcepacks/`, `shaderpacks/`, `packwiz-files/`, `pack.toml`, `index.toml`, or the packaged CDC jar.

## Rules

- `mods/`, `resourcepacks/`, and `shaderpacks/` contain `.pw.toml` metadata only; do not track runtime jars there.
- CF-restricted, manual-download, and custom payloads belong in `packwiz-files/{mods,resourcepacks,shaderpacks}/` with matching raw-URL metadata.
- Add, update, or remove assets through `scripts/update-packwiz-meta.ps1 -Category ...`; avoid manual metadata edits unless repairing generated output.
- Do not run `scripts/update-packwiz-meta.ps1` on short-lived feature/PR branches because it derives `packwiz-files` raw URLs from the current branch and can rewrite unrelated `.pw.toml` files to branch URLs that disappear after merge.
- Branch-derived raw URLs are intended only for `main` and long-lived LTS/release-maintenance branches that must serve their own Packwiz payloads.
- `pack.toml` and `index.toml` are generated from `modpack.toml`; do not commit them.
- Shaderpack files containing `Clrwl` are generated locally and must not be tracked.
- Set `side = "client"` or `side = "server"` explicitly for client-only or server-only mods.
- Do not refresh GitHub Pages mod classification data (`docs/mods-data.js`) as part of normal asset changes; it is an expensive manual task and requires an explicit user request.

## Add Or Update Assets

1. Put custom or restricted payloads under the matching `packwiz-files/<category>/` directory.
2. Run `./scripts/update-packwiz-meta.ps1 -Category mods|resourcepacks|shaderpacks` only on `main` or a long-lived LTS/release-maintenance branch.
3. For slow overseas services, retry once with `-Proxy "http://127.0.0.1:7890"`.
4. Inspect the generated `.pw.toml` plus `packwiz-files` changes before staging, especially that existing `side = "client"` or `side = "server"` entries were not reset to `both`.
5. Run `./scripts/sync-packwiz-assets.ps1` when local runtime files must match metadata.

### 短期 PR 分支上的 CurseForge 定向更新

1. 不要在仓库根目录直接运行 `packwiz update`，因为 `pack.toml` 和 `index.toml` 是生成文件且通常不存在。
2. 运行 `./scripts/update-packwiz-target.ps1 -Category mods|resourcepacks|shaderpacks -Slug <metadata-name>`，或用 `-Path <relative .pw.toml path>` 精确指定目标。
3. 该脚本会生成临时 pack、只回写目标 `.pw.toml`、保留原始 `side`，并默认运行 `scripts/sync-packwiz-assets.ps1`；仅在明确不需要同步运行态文件时使用 `-SkipSync`，需要无网络预检时使用 `-DryRun`。
4. 检查 diff，确认没有生成文件、无关元数据改动，且没有把 `client` 或 `server` 退回 `both`。

## Remove Assets

1. On `main`, remove an asset by deleting its `.pw.toml` metadata.
2. Remove matching `packwiz-files` payloads only when the committed payload is intentionally retired.
3. Do not treat synced runtime jars as source; they are local development payloads.

## CDC Packaged Jar

1. Prefer published CurseForge metadata when a CDC release exists.
2. For unpublished builds, keep the filename `packwiz-files/mods/Create-Delight-Core-1.20.1-dev.jar`.
3. On short-lived feature branches, update only `mods/create-delight-core.pw.toml` hash for the new jar and keep its raw URL pointing at `main`; do not run the full metadata update script.
4. If a full metadata update is unavoidable off `main`, first set `PACKWIZ_FILES_RAW_PREFIX=https://raw.githubusercontent.com/Jasons-impart/Create-Delight-Remake/main/packwiz-files/`, then inspect and revert unrelated `.pw.toml` URL rewrites before committing.
5. Before staging or summarizing CDC artifact changes, fetch `CDC-mod-src` `origin/1.20.1`; if it fast-forwards, include the submodule pointer in the same commit so source matches the packaged jar.

## After Git Updates

For pull, rebase, merge, or branch updates, use `repo-sync`: it installs local `.git/hooks` shims that call tracked `scripts/.githooks`, then calls `scripts/sync-packwiz-assets.ps1 -IfGitChanged` so Packwiz runtime sync logic stays in one script.
