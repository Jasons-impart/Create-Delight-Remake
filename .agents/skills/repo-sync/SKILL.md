---
name: repo-sync
description: Keep the Create-Delight Remake checkout current and locally runnable after Git updates. Use when the user asks to pull latest changes, switch to main, rebase on main, merge upstream changes, update a branch, or otherwise run Git operations that may bring in packwiz metadata, packwiz-files payloads, or CDC submodule pointer changes.
---

# Repo Sync

## Workflow

Use this workflow for repository update tasks before reporting completion.

1. Ensure local Git hook shims are installed without rewriting existing shims, confirm status, and record the pre-update commit:

```powershell
./scripts/install-git-hooks.ps1 -IfUnset -Quiet
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
    ./scripts/install-git-hooks.ps1 -Quiet
}
./scripts/sync-packwiz-assets.ps1 -IfGitChanged -OldRev $oldHead -NewRev HEAD -HookName repo-sync
```

`-IfGitChanged` checks `mods|resourcepacks|shaderpacks/**/*.pw.toml` and `packwiz-files/**`; it runs the full runtime sync only when needed. Git hooks perform the same check for regular local Git operations, but still run this command here so agent-managed updates have a visible result.

The sync script records the last successful revision in the ignored `.cache/packwiz-sync/sync-state.json`. This makes the hook and the explicit workflow call idempotent: the second call for the same revision, side, metadata roots, and sync-script version exits without downloading again. Use `-Force` when repairing a known local runtime mismatch. For slow overseas downloads, set `PACKWIZ_PROXY=http://127.0.0.1:7890`; the hooks inherit this environment variable.

客户端同步成功（含命中同步缓存）后，共享脚本会删除 `config/crash_assistant/modlist.json`；Crash Assistant 只在运行时文件缺失时复制受管默认表，因此下次启动才能应用当前分支基线。仅默认 `modlist.json` 变化时也会清理，不触发资源下载；同步失败、`-DryRun` 和服务端同步不删除。只处理这一个文件，保留其他配置和“不再提示”记录；默认表缺失时不清理，损坏时报告错误。需要单独修复旧运行时表时可运行 `scripts/reset-crash-assistant-modlist.ps1`，支持 `-DryRun`。关闭游戏后操作，下次重新启动验证。

The installer is idempotent: `-IfUnset` exits when all four shims already exist and are managed, while a full install only rewrites a shim when its generated content differs. The post-update hook installation only runs when the installer or tracked hooks changed. This makes newly added hooks available immediately, while ordinary repository updates do not rewrite local hook shims.

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
