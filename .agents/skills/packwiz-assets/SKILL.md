---
name: packwiz-assets
description: Maintain Create-Delight Remake release-v048x asset files. Use when adding, updating, removing, or reviewing direct mod JARs, resourcepack/shaderpack packwiz metadata, pack.toml, index.toml, client/server mod lists, or local runtime JAR side effects.
---

# Packwiz Assets

Use this skill for release-v048x asset changes under `mods/`, `resourcepacks/`, `shaderpacks/`, `pack.toml`, and `index.toml`.

## Rules

- On `release-v048x`, never run `.\packwiz.exe refresh` locally; packwiz refresh/export is reserved for GitHub Actions.
- `mods/` tracks mod JARs directly on this branch; add, update, or remove the exact JAR files requested.
- `resourcepacks/` and `shaderpacks/` may use packwiz metadata; inspect and edit their files deliberately.
- `pack.toml` is the only version source on `release-v048x`; do not duplicate version numbers elsewhere.
- `index.toml` and generated packwiz outputs are action-facing; do not regenerate them locally for ordinary development.
- Use `.clientonlymodlist` and `.serveronlymodlist` for side-specific release defaults.
- Do not delete local runtime JARs in bulk; inspect exact paths first.

## Workflow

1. Identify whether the request changes direct mod JARs, resourcepack/shaderpack metadata, or only ordinary project files.
2. For mod changes, add/update/remove only the intended `mods/*.jar` files.
3. For resourcepack or shaderpack changes, edit the intended metadata or payload files without running local refresh.
4. Review the diff before summarizing.

```powershell
git diff -- mods resourcepacks shaderpacks pack.toml index.toml .clientonlymodlist .serveronlymodlist
```

5. If a branch switch or pull leaves untracked `mods/*.jar`, treat them as local instance payloads unless they correspond to the asset change requested by the user.

## Anti-Patterns

- Do not run `packwiz refresh` on `release-v048x`.
- Do not overwrite `index.toml` for local development tasks.
- Do not use broad deletes in `mods/`, `resourcepacks/`, or `shaderpacks`.
- Do not stage unrelated local runtime JARs just because they appear in `git status`.
