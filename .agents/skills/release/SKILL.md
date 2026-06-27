---
name: release
description: Create-Delight Remake modpack release workflow - version bump, tag, artifacts download, and GitHub release creation
---

## What I do

Automate the full release pipeline using two PowerShell scripts:
1. **release-prepare.ps1** — Version bump + PR creation (pre-merge)
2. **release-publish.ps1** — Tag + CI + Download + Release (post-merge)

## When to use me

- "发布版本" / "发布新版本" / "release"
- Version-related tasks like bumping `pack.toml`
- Creating GitHub releases

## Agent Decision Points

The agent only needs to make **3 decisions**; everything else is scripted:

### Decision 1: Version Number

**Branch rules**:
- `main` branch → PR to main, tag on main after merge
- `release-v047x` → PR to release-v047x, tag on that branch after merge

**Version rules**:
- User specifies → use specified version
- User says "发布新版本" → check if `pack.toml` changed in latest commit
  - Changed → use current version from pack.toml
  - Not changed → increment last digit (v0.4.7.14 → v0.4.7.15)

```bash
git log -1 --name-only | grep pack.toml
```

### Decision 2: Release Type

- 正式版 → 4 artifacts (Client + ClientPatch + Server + ServerPatch)
- 测试版 → 2 artifacts (Client + Server only, no patches)

### Decision 3: Announcement Content

Summarize changes into ≤3 bullet points, separated by commas. Example:
- "更新TrueUUID修复旁观穿墙,补充zstd联机教学视频"

If user doesn't specify, extract from latest git log.

## Release Workflow

### Phase 1: Prepare (Pre-merge)

```powershell
.\.agents\skills\release\release-prepare.ps1 `
    -Version "v0.4.7.15" `
    -TargetBranch "release-v047x" `
    -ReleaseType "正式" `
    -Announcement "更新TrueUUID修复旁观穿墙,补充zstd联机教学视频" `
    -Proxy "http://127.0.0.1:7890"
```

Output: PR URL

### ⚠️ Human Gate: Merge the PR

**Must wait for user to manually merge the PR.** Never auto-merge.

### Phase 2: Publish (Post-merge)

After user confirms PR is merged:

```powershell
.\.agents\skills\release\release-publish.ps1 `
    -Version "v0.4.7.15" `
    -TargetBranch "release-v047x" `
    -PreviousVersion "v0.4.7.14" `
    -ReleaseType "正式" `
    -Proxy "http://127.0.0.1:7890"
```

Output: Release URL

## Script Reference

### release-prepare.ps1

| Parameter | Required | Description |
|-----------|----------|-------------|
| `-Version` | ✅ | New version string (e.g. "v0.4.7.15") |
| `-TargetBranch` | ✅ | Base branch for PR (e.g. "release-v047x") |
| `-ReleaseType` | ❌ | "正式" (default) or "测试" |
| `-Announcement` | ❌ | Comma-separated bullet points, e.g. "修复BUG,新增物品,优化性能". Auto-generated from git log if omitted |
| `-Proxy` | ❌ | HTTPS proxy (e.g. "http://127.0.0.1:7890") |

**What it does**: Update pack.toml → Update announcement.md → Create branch → Commit → Push → Create PR → Restore original branch

### release-publish.ps1

| Parameter | Required | Description |
|-----------|----------|-------------|
| `-Version` | ✅ | Version tag to create (e.g. "v0.4.7.15") |
| `-TargetBranch` | ✅ | Branch to tag on (e.g. "release-v047x") |
| `-PreviousVersion` | ✅ | Previous version for release notes and patch names (e.g. "v0.4.7.14") |
| `-ReleaseType` | ❌ | "正式" (default, 4 artifacts) or "测试" (2 artifacts, prerelease) |
| `-Proxy` | ❌ | HTTPS proxy |
| `-CIPollIntervalSeconds` | ❌ | CI poll interval (default: 30) |
| `-CITimeoutMinutes` | ❌ | CI timeout (default: 15) |

**What it does**: Tag+Push → Wait CI → Download artifacts → Compress → Generate notes → Create release → Verify

## Optional CDC Mod Release

Only use this section if `CDC-mod-src/` exists locally; this workspace currently may not include the separate `Jasons-impart/Create-Delight-Core` repo.

```bash
cd CDC-mod-src
git checkout 1.20.1 && git pull
git checkout -b fix/xxx
./gradlew build --no-daemon
git add -A && git commit -m "[fix] 描述"
git push -u origin fix/xxx
gh pr create --base 1.20.1 --title "[fix] 描述" --body "..."
```

After merge, update CDR mods:
```bash
cd ..
Remove-Item mods/Create-Delight-Core-*.jar
Copy-Item CDC-mod-src/build/libs/CDC-mod-src-*.jar mods/
```

## Important Notes

- **PR merge**: Must wait for user to manually merge, cannot auto-merge
- **Release notes**: Auto-generated from commit messages, appended with `(AI自动生成)`
- **`[]` in filenames**: Handled by release-publish.ps1 using `-LiteralPath` copy
- **Proxy**: Pass `-Proxy` parameter if direct GitHub access is slow
- **Temp directory**: release-publish.ps1 preserves temp dir at `$env:TEMP\opencode\<version>` for debugging

## PowerShell + gh CLI Pitfalls

These bugs were discovered during v0.4.8.9 release. DO NOT reintroduce them:

1. **`-Announcement` is `[string]` not `[string[]]`** — bash→powershell comma-separated args become 1 string. Script splits on `,` internally.
2. **Never use `Set-Content -Encoding utf8`** — PS5.x writes UTF-8 BOM which breaks TOML parsers. Use `[System.IO.File]::WriteAllText()` with `UTF8Encoding($false)`.
3. **Never use `gh pr create --body $multiline`** — PowerShell truncates multiline args to external commands. Use `--body-file` with a temp file.
4. **Never use `--jq` with double quotes** — PowerShell's string interpolation breaks `contains("...")` etc. Use PowerShell's `ConvertFrom-Json` + `Where-Object` instead.
5. **Release publish must be resumable after interruption** — If the tag already exists locally/remotely and points to the target commit, reuse it instead of failing on `git tag`.
6. **Stash untracked files too** — `git status --porcelain` sees untracked docs, but plain `git stash` does not save them. Use `git stash push -u` before checkout/pull.
7. **Do not depend on Chinese workflow-name matching in redirected Windows PowerShell** — `gh` JSON can be mis-decoded when stdout is redirected. Match Actions runs by `headSha`, and use a wider `gh run list --limit` window.
8. **Artifact transfer on Windows** — `gh run download` can hang for large artifacts. Prefer authenticated `curl.exe` artifact downloads through the configured proxy, write curl config as UTF-8 no-BOM temp files and delete them immediately, and always use `-LiteralPath` for artifact filenames containing `[]`.
9. **Release notes must be UTF-8 file based** — Set PowerShell console/output encoding to UTF-8 before `git log`, call `git -c i18n.logOutputEncoding=utf-8 log`, write notes with `UTF8Encoding($false)`, and pass them to `gh release create/edit` with `--notes-file`. Passing multiline Chinese via `--notes $ReleaseNotes` can publish mojibake.
10. **Cleanup branch restore should be quiet** — In Windows PowerShell, successful `git checkout` branch messages can still appear as `NativeCommandError` noise when stderr is redirected. Use `git switch --quiet`, check `$LASTEXITCODE`, and only throw on real failure.
