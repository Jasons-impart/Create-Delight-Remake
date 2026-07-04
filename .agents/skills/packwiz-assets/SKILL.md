---
name: packwiz-assets
description: Maintain Create-Delight Remake packwiz-managed assets. Use when adding, updating, removing, refreshing, or reviewing mods, resourcepacks, shaderpacks, pack.toml, index.toml, client/server mod lists, or local runtime JAR side effects.
---

# Packwiz Assets

Use this skill for asset changes under `mods/`, `resourcepacks/`, `shaderpacks/`, `pack.toml`, and `index.toml`.

## Rules

- Packwiz-managed areas are `mods/`, `resourcepacks/`, and `shaderpacks/`.
- `pack.toml` is the only version source on `release-v048x`; do not duplicate version numbers elsewhere.
- Run `.\packwiz.exe refresh` only after intentional changes in packwiz-managed areas.
- Do not run packwiz refresh for KubeJS scripts, configs, docs, lang files, quests, or ordinary knowledge-base edits.
- Use `.clientonlymodlist` and `.serveronlymodlist` for side-specific release defaults.
- Do not delete local runtime JARs in bulk; inspect exact paths first.

## Workflow

1. Identify whether the request changes packwiz-managed assets or only ordinary project files.
2. For add/update/remove work, make the minimal asset and metadata changes.
3. Run refresh only when the managed asset set changed.

```powershell
.\packwiz.exe refresh
```

4. Review the diff before summarizing.

```powershell
git diff -- mods resourcepacks shaderpacks pack.toml index.toml .clientonlymodlist .serveronlymodlist
```

5. If a branch switch or pull leaves untracked `mods/*.jar`, treat them as local instance payloads unless they correspond to the asset change requested by the user.

## Anti-Patterns

- Do not overwrite `index.toml` for non-packwiz tasks.
- Do not use broad deletes in `mods/`, `resourcepacks/`, or `shaderpacks`.
- Do not stage unrelated local runtime JARs just because they appear in `git status`.
