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
- `pack.toml` and `index.toml` are generated from `modpack.toml`; do not commit them.
- Shaderpack files containing `Clrwl` are generated locally and must not be tracked.
- Set `side = "client"` or `side = "server"` explicitly for client-only or server-only mods.

## Add Or Update Assets

1. Put custom or restricted payloads under the matching `packwiz-files/<category>/` directory.
2. Run `./scripts/update-packwiz-meta.ps1 -Category mods|resourcepacks|shaderpacks`.
3. For slow overseas services, retry once with `-Proxy "http://127.0.0.1:7890"`.
4. Inspect the generated `.pw.toml` plus `packwiz-files` changes before staging.
5. Run `./scripts/sync-packwiz-assets.ps1` when local runtime files must match metadata.

## Remove Assets

1. On `main`, remove an asset by deleting its `.pw.toml` metadata.
2. Remove matching `packwiz-files` payloads only when the committed payload is intentionally retired.
3. Do not treat synced runtime jars as source; they are local development payloads.

## CDC Packaged Jar

1. Prefer published CurseForge metadata when a CDC release exists.
2. For unpublished builds, keep the filename `packwiz-files/mods/Create-Delight-Core-1.20.1-dev.jar`.
3. Run `scripts/update-packwiz-meta.ps1 -Category mods` so `mods/create-delight-core.pw.toml` hash changes with the jar.
4. On short-lived feature branches, set `PACKWIZ_FILES_RAW_PREFIX=https://raw.githubusercontent.com/Jasons-impart/Create-Delight-Remake/main/packwiz-files/` before running metadata updates unless the branch itself must serve the payload; PR branches are normally deleted after merge, so branch raw URLs can break downloads.
5. Before staging or summarizing CDC artifact changes, fetch `CDC-mod-src` `origin/1.20.1`; if it fast-forwards, include the submodule pointer in the same commit so source matches the packaged jar.

## After Git Updates

For pull, rebase, merge, or branch updates, use `repo-sync`: it installs local `.git/hooks` shims that call tracked `scripts/.githooks`, then calls `scripts/sync-packwiz-assets.ps1 -IfGitChanged` so Packwiz runtime sync logic stays in one script.
