---
name: release
description: Create-Delight Remake modpack release workflow - version bump, tag, artifacts download, and GitHub release creation
license: MIT
compatibility: opencode
metadata:
  audience: maintainers
  workflow: github-actions
  project: create-delight-remake
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

The agent only needs to make **5 decisions**; everything else is scripted:

### Decision 0: Target Branch

**Rules**:
- If the version is a patch release on an existing release line (e.g. v0.4.7.15 on v0.4.7.x) → target the release branch (e.g. `release-v047x`)
- If the version is a new sub-version's first release (e.g. first v0.4.9.x) → target `main`
- If user specifies a branch → use specified branch

**How to detect**: Check if a remote branch matching `release-v{major}{minor}x` exists for the version's prefix.

### Decision 1: Version Number

**Rules**:
- User specifies → use specified version
- User says "发布新版本" without specifying → auto-detect:
  1. Check if `pack.toml` was modified in the latest commit (`git log -1 --name-only | grep pack.toml`)
  2. If YES → the developer already bumped the version in pack.toml, use the current version from pack.toml
  3. If NO → increment the last digit of the latest version (e.g. v0.4.7.14 → v0.4.7.15). Find the latest version from the most recent git tag matching `v*`.

```bash
git log -1 --name-only | grep pack.toml
```

### Decision 2: Release Type

- 正式版 → 4 artifacts (Client + ClientPatch + Server + ServerPatch)
- 测试版 → 2 artifacts (Client + Server only, no patches)

### Decision 3: Announcement Content

Summarize changes into **≤3 bullet points, each ≤20 characters**, separated by commas. Example:
- "机械动力6.0升级,北极星太空探索,核反应堆实装"

**Format**: announcement.md uses `### {版本}已发布` as the title line, followed by the bullet points.

**For first stable of a sub-version**: Derive the 3 points from the update-summary file (`docs/update-summary-{Version}.md`), picking the 3 most impactful changes.

**For other stable releases**: Extract from the latest git log or user input.

If user doesn't specify, extract from latest git log.

### Decision 4: Update Summary (First Stable Release Only)

When the sub-version's **first stable release** is being published (e.g. v0.4.8.9 is the first stable of 0.4.8.x, after v0.4.8.0-v0.4.8.8 were all pre-releases), the agent must generate an update summary markdown file **before** running release-publish.ps1.

**Detection**: release-publish.ps1 automatically detects this by checking if no prior stable (non-prerelease) GitHub release exists for the sub-version prefix.

**Agent responsibility**: Before Phase 2 (publish), generate `docs/update-summary-{Version}.md` covering all changes from the previous sub-version to this one. The file must:
- Use Chinese (简体中文)
- Group changes into categories with emoji headers
- Include PR numbers (e.g. #1234) for each change
- Start with a brief one-line summary of the update scope
- End with an "升级须知" section recommending new saves

**Release notes behavior**: release-publish.ps1 will automatically prepend the summary file content to the GitHub release body (above the per-commit auto-generated notes) when it detects a first stable release.

**Example**: For v0.4.8.9 (first stable of 0.4.8.x), generate `docs/update-summary-v0.4.8.9.md` summarizing all changes from v0.4.7.0 onward.

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
    -ReleaseType "正式" `
    -Proxy "http://127.0.0.1:7890"
```

Note: `-PreviousVersion` is now optional. It auto-detects from the previous git tag. Override manually if needed:

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

**What it does**: Update pack.toml → Update announcement.md → Auto-stage update-summary files → Create branch → Commit → Push → Create PR → Restore original branch

### release-publish.ps1

| Parameter | Required | Description |
|-----------|----------|-------------|
| `-Version` | ✅ | Version tag to create (e.g. "v0.4.7.15") |
| `-TargetBranch` | ✅ | Branch to tag on (e.g. "release-v047x") |
| `-PreviousVersion` | ❌ | Previous version for release notes and patch names (e.g. "v0.4.7.14"). Auto-detected via `git describe --tags --abbrev=0 HEAD^` if omitted |
| `-ReleaseType` | ❌ | "正式" (default, 4 artifacts) or "测试" (2 artifacts, prerelease) |
| `-Proxy` | ❌ | HTTPS proxy |
| `-CIPollIntervalSeconds` | ❌ | CI poll interval (default: 30) |
| `-CITimeoutMinutes` | ❌ | CI timeout (default: 15) |

**What it does**: Tag+Push → Wait CI → Download artifacts → Compress → Generate notes (+ prepend update summary if first stable) → Create release → Verify → Announcement PR to main (stable only)

## Script Safety Features

Both scripts include:

- **Pre-flight validation**: Checks prerequisites (pack.toml exists, version format, gh auth, TargetBranch exists on remote, no existing release) before any changes. Fails fast with clear error messages.
- **Dry-run mode**: Pass `-WhatIf` to preview what the script would do without making any changes. Useful for validating parameters.
- **Idempotency**: Scripts handle re-runs gracefully:
  - Existing tags on the correct commit → skipped
  - Existing branches → cleaned up and recreated
  - Existing PRs → existing URL returned
  - Existing releases → fail with clear message (cannot recreate)

---

## ⚠️ CDC Mod Release (Separate Workflow)

The following is a **separate** workflow for the custom Java mod, NOT part of the main modpack release pipeline. Only use this when specifically asked to update the CDC mod.

CDC mod in `CDC-mod-src/`, separate repo: `Jasons-impart/Create-Delight-Core`

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
- **Release notes**: Auto-generated from commit messages, appended with `(AI自动生成)`. For the first stable release of a sub-version, the update summary file (`docs/update-summary-{Version}.md`) is automatically prepended.
- **Announcement PR**: For stable releases, release-publish.ps1 automatically creates a PR to main with the updated `docs/announcement.md`. The agent only needs to inform the user about this PR — no need to wait for merge.
- **`[]` in filenames**: Handled by release-publish.ps1 using `-LiteralPath` copy
- **Proxy**: Pass `-Proxy` parameter if direct GitHub access is slow
- **Temp directory**: release-publish.ps1 preserves temp dir at `$env:TEMP\opencode\<version>` for debugging

## PowerShell + gh CLI Pitfalls

These bugs were discovered during releases. DO NOT reintroduce them:

1. **`-Announcement` is `[string]` not `[string[]]`** — bash→powershell comma-separated args become 1 string. Script splits on `,` internally.
2. **Never use `Set-Content -Encoding utf8`** — PS5.x writes UTF-8 BOM which breaks TOML parsers. Use `[System.IO.File]::WriteAllText()` with `UTF8Encoding($false)`.
3. **Never use `gh pr create --body $multiline`** — PowerShell truncates multiline args to external commands. Use `--body-file` with a temp file. Same applies to `gh release create --notes` — use `--notes-file` instead.
4. **Never use `--jq` with double quotes** — PowerShell's string interpolation breaks `contains("...")` etc. Use PowerShell's `ConvertFrom-Json` + `Where-Object` instead.
5. **Set proxy AFTER Test-Prerequisites** — Setting `$env:HTTPS_PROXY` before `gh auth status` breaks keyring authentication on Windows. Always run prerequisite checks (which include gh auth) WITHOUT proxy env vars, then set proxy afterwards for actual network operations.
6. **Set ALL_PROXY alongside HTTPS_PROXY/HTTP_PROXY** — Some tools (git, gh) respect ALL_PROXY more reliably. When `-Proxy` is provided, set all three env vars.
7. **Auto-stage update-summary files** — release-prepare.ps1 must auto-detect and `git add` any `docs/update-summary-*.md` files in the working directory. Otherwise, the agent must manually add them to the PR branch after the script runs (error-prone).
