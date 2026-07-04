---
name: repo-sync
description: Keep the Create-Delight Remake checkout current after Git updates. Use when switching branches, pulling latest changes, rebasing, merging, or updating release/main branches so the agent checks branch state, changed packwiz paths, and final worktree cleanliness.
---

# Repo Sync

Use this workflow before reporting that a branch switch, pull, rebase, or merge is complete.

## Workflow

1. Check the current branch and local changes.

```powershell
git status --short --branch
```

2. Record the old target commit before the update.

```powershell
$oldHead = git rev-parse HEAD
```

When switching first, record the destination branch instead:

```powershell
$oldHead = git rev-parse release-v048x
git switch release-v048x
```

3. Run the requested Git operation with non-interactive commands.

```powershell
git pull --ff-only
git rebase origin/main
```

4. Inspect whether the update touched packwiz-managed assets.

```powershell
$newHead = git rev-parse HEAD
git diff --name-only $oldHead $newHead -- mods resourcepacks shaderpacks pack.toml index.toml
```

5. If `mods/`, `resourcepacks/`, `shaderpacks/`, `pack.toml`, or `index.toml` changed, report that packwiz-managed files changed. Run `packwiz refresh` only when the actual task changed packwiz-managed assets; do not refresh after ordinary KubeJS, config, docs, or lang-only updates.

6. Finish with status.

```powershell
git status --short --branch
```

Report the ending branch, whether the pull/rebase/merge succeeded, whether packwiz-managed files changed, and whether the final worktree has tracked changes. Treat untracked local runtime JARs as local instance state unless the user explicitly asked to manage mod assets.
