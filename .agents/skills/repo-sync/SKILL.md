---
name: repo-sync
description: Keep the Create-Delight Remake checkout current and locally runnable after Git updates. Use when the user asks to pull latest changes, switch to main, rebase on main, merge upstream changes, update a branch, or otherwise run Git operations that may bring in packwiz metadata, packwiz-files payloads, or CDC submodule pointer changes.
---

# Repo Sync

## Workflow

Use this workflow for repository update tasks before reporting completion.

1. Ensure local Git hook shims are installed, confirm status, and record the pre-update commit:

```powershell
./scripts/install-git-hooks.ps1
git status --short --branch
$oldHead = git rev-parse HEAD
```

When switching to `main` before pulling, record `main` before checkout:

```powershell
$oldHead = git rev-parse main
git checkout main
```

2. Perform the requested Git operation with non-interactive commands, then let the shared helper handle Packwiz runtime sync:

```powershell
git pull --ff-only origin main
git rebase origin/main
git diff --quiet $oldHead HEAD -- scripts/install-git-hooks.ps1 scripts/.githooks
if ($LASTEXITCODE -eq 1) {
    ./scripts/install-git-hooks.ps1
}
./scripts/sync-packwiz-assets.ps1 -IfGitChanged -OldRev $oldHead -NewRev HEAD -HookName repo-sync
```

`-IfGitChanged` checks `mods|resourcepacks|shaderpacks/**/*.pw.toml` and `packwiz-files/**`; it runs the full runtime sync only when needed. Git hooks perform the same check for regular local Git operations, but still run this command here so agent-managed updates have a visible result.

The post-update hook installation only runs when the installer or tracked hooks changed. This makes newly added hooks available immediately, while ordinary repository updates do not rewrite local hook shims.

3. If `CDC-mod-src` changed or `git status` reports the submodule modified after update, run:

```powershell
git submodule update --init --recursive
```

4. Finish with:

```powershell
git status --short --branch
```

Report whether packwiz sync was required, whether it succeeded, and whether the final worktree is clean.

## Notes

- Runtime JARs are local development payloads and are normally not tracked.
- Do not commit local sync side effects unless they are intentional source changes.
- If sync leaves tracked config changes, inspect them before deciding whether to keep or restore them.
