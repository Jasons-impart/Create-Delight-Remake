---
name: repo-sync
description: Keep the Create-Delight Remake checkout current and locally runnable after Git updates. Use when the user asks to pull latest changes, switch to main, rebase on main, merge upstream changes, update a branch, or otherwise run Git operations that may bring in packwiz metadata, packwiz-files payloads, or CDC submodule pointer changes.
---

# Repo Sync

## Workflow

Use this workflow for repository update tasks before reporting completion.

1. Confirm the worktree is clean enough to switch or update:

```powershell
git status --short --branch
```

2. Record the pre-update target commit before pull, rebase, or merge.

For updating the current branch:

```powershell
$oldHead = git rev-parse HEAD
```

For switching to `main` and pulling, record `main` before updating it:

```powershell
$oldHead = git rev-parse main
git checkout main
```

3. Perform the requested Git operation. Prefer non-interactive commands such as:

```powershell
git pull --ff-only origin main
git rebase origin/main
```

4. Record the ending commit and inspect changed pack metadata paths:

```powershell
$newHead = git rev-parse HEAD
git diff --name-only $oldHead $newHead -- mods resourcepacks shaderpacks packwiz-files
```

5. If any changed file is under `packwiz-files/` or ends with `.pw.toml` under `mods/`, `resourcepacks/`, or `shaderpacks/`, run:

```powershell
./scripts/sync-packwiz-assets.ps1
```

6. If `CDC-mod-src` changed or `git status` reports the submodule modified after update, run:

```powershell
git submodule update --init --recursive
```

7. Finish with:

```powershell
git status --short --branch
```

Report whether packwiz sync was required, whether it succeeded, and whether the final worktree is clean.

## Notes

- Runtime JARs are local development payloads and are normally not tracked.
- Do not commit local sync side effects unless they are intentional source changes.
- If sync leaves tracked config changes, inspect them before deciding whether to keep or restore them.
