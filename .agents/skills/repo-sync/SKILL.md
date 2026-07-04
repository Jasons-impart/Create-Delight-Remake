---
name: repo-sync
description: Apply Create-Delight Remake branch-specific checks after Git updates. Use when switching branches, pulling latest changes, rebasing, merging, or updating release/main branches where asset-path changes, local runtime JARs, or release-v048x packwiz rules may matter.
---

# Repo Sync

Use normal non-interactive Git commands for branch switches, pulls, rebases, and merges. This skill only records repository-specific checks.

## Project Checks

- After updating a branch, inspect whether the changed range touched `mods/`, `resourcepacks/`, `shaderpacks/`, `pack.toml`, or `index.toml`.
- On `release-v048x`, never run `packwiz refresh`; `mods/` uses direct JARs, while `resourcepacks/` and `shaderpacks/` may carry packwiz metadata for Actions.
- Treat untracked local `mods/*.jar` files as local instance state unless the user explicitly asked to manage mod assets.
- Report whether asset paths changed and whether the final worktree has tracked changes.

Useful path diff:

```powershell
git diff --name-only $oldHead $newHead -- mods resourcepacks shaderpacks pack.toml index.toml
```
