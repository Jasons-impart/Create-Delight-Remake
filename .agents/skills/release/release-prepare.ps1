<#
.SYNOPSIS
    Create-Delight Remake modpack release prepare script (pre-merge phase).

.DESCRIPTION
    Updates pack.toml version, docs/announcement.md, creates a version-bump
    branch, commits, pushes, and opens a PR to the target branch.

.PARAMETER Version
    The new version string, e.g. "v0.4.7.15".

.PARAMETER TargetBranch
    The base branch for the PR, e.g. "release-v047x" or "main".

.PARAMETER Announcement
    Comma-separated announcement bullet points, e.g. "修复BUG,新增物品,优化性能".
    If omitted, generated from the latest git commit message.

.PARAMETER Proxy
    Optional HTTPS proxy, e.g. "http://127.0.0.1:7890".

.PARAMETER ReleaseType
    "正式" for full release, "测试" for prerelease. Default: "正式".

.EXAMPLE
    .\release-prepare.ps1 -Version "v0.4.7.16" -TargetBranch "main" -Announcement "修复BUG,新增物品,优化性能"

.EXAMPLE
    .\release-prepare.ps1 -Version "v0.4.7.16" -TargetBranch "release-v047x" -ReleaseType 测试 -Proxy "http://127.0.0.1:7890"
#>
[CmdletBinding()]
param(
    [Parameter(Mandatory=$true)][string]$Version,
    [Parameter(Mandatory=$true)][string]$TargetBranch,
    [string]$Announcement,                                 # Comma-separated, e.g. "修复BUG,新增物品,优化性能"
    [ValidateSet("正式","测试")][string]$ReleaseType = "正式",
    [string]$Proxy = "",
    [switch]$WhatIf
)

$utf8NoBom = [System.Text.UTF8Encoding]::new($false)
$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# Non-interactive git environment
$env:CI = 'true'
$env:GIT_TERMINAL_PROMPT = '0'
$env:GCM_INTERACTIVE = 'never'
$env:GIT_EDITOR = ':'
$env:EDITOR = ':'
$env:GIT_PAGER = 'cat'

# NOTE: Proxy is set AFTER Test-Prerequisites to avoid breaking gh auth keyring.
# See SKILL.md "PowerShell + gh CLI Pitfalls" #5.

$Stashed = $false
$OriginalBranch = ""
$script:PrepareSucceeded = $false
$VersionBranch = "codex/release-$Version"

function Restore-State {
    # Clean up version-bump branch if script failed after creating it
    $versionBranchExists = git branch --list $VersionBranch 2>$null
    if ($versionBranchExists -and -not $script:PrepareSucceeded) {
        Write-Host "📦 Cleaning up local branch $VersionBranch"
        git checkout $OriginalBranch 2>$null | Out-Null
        git branch -D $VersionBranch 2>$null | Out-Null
    }
    if ($OriginalBranch) {
        Write-Host "📦 Restoring branch: $OriginalBranch"
        git checkout $OriginalBranch 2>$null | Out-Null
    }
    if ($Stashed) {
        Write-Host "📦 Unstashing changes"
        git stash pop 2>$null | Out-Null
    }
}

function Test-Prerequisites {
    $errors = @()
    
    # Check pack.toml exists
    if (-not (Test-Path "pack.toml")) {
        $errors += "pack.toml not found in current directory"
    }
    
    # Check Version format
    if ($Version -notmatch '^v\d+\.\d+\.\d+\.\d+$') {
        $errors += "Version format invalid: '$Version'. Expected format: v0.4.8.10"
    }
    
    # Check gh CLI available
    $ghAvailable = Get-Command gh -ErrorAction SilentlyContinue
    if (-not $ghAvailable) {
        $errors += "gh CLI not found. Install GitHub CLI first."
    }
    
    # Check gh auth
    if ($ghAvailable) {
        gh auth status 2>$null | Out-Null
        if ($LASTEXITCODE -ne 0) {
            $errors += "gh CLI not authenticated. Run 'gh auth login' first."
        }
    }

    # gh auth status must run before proxy env vars are set on Windows, but the
    # remote checks below may still need the configured proxy.
    if ($Proxy) {
        $env:HTTPS_PROXY = $Proxy
        $env:HTTP_PROXY = $Proxy
        $env:ALL_PROXY = $Proxy
    }
    
    # Check TargetBranch exists on remote
    $remoteBranch = git ls-remote --heads origin $TargetBranch 2>$null
    if (-not $remoteBranch) {
        $errors += "Target branch '$TargetBranch' not found on remote"
    }
    
    # Check no existing release for this version
    if ($ghAvailable) {
        $existingRelease = gh release view $Version --repo Jasons-impart/Create-Delight-Remake --json tagName 2>$null
        if ($LASTEXITCODE -eq 0 -and $existingRelease) {
            $errors += "Release '$Version' already exists on GitHub"
        }
    }
    
    if ($errors.Count -gt 0) {
        Write-Host "❌ Pre-flight validation failed:"
        foreach ($err in $errors) {
            Write-Host "   - $err"
        }
        return $false
    }
    
    Write-Host "✅ Pre-flight validation passed"
    return $true
}

# Verify working directory and run pre-flight checks
if (-not (Test-Prerequisites)) {
    exit 1
}

if ($WhatIf) {
    Write-Host "🔍 DRY RUN - No changes will be made"
    Write-Host "   Version: $Version"
    Write-Host "   TargetBranch: $TargetBranch"
    Write-Host "   ReleaseType: $ReleaseType"
    Write-Host "   Announcement: $Announcement"
    Write-Host "   Proxy: $(if($Proxy){$Proxy}else{'(none)'})"
    Write-Host ""
    Write-Host "   Would:"
    Write-Host "   1. Update pack.toml version to $Version"
    Write-Host "   2. Update docs/announcement.md"
    Write-Host "   3. Auto-stage update-summary file (if present)"
    Write-Host "   4. Create branch $VersionBranch from $TargetBranch"
    Write-Host "   5. Commit and push"
    Write-Host "   6. Create PR to $TargetBranch"
    exit 0
}

# Set proxy AFTER Test-Prerequisites (gh auth keyring fails with proxy env vars)
if ($Proxy) {
    $env:HTTPS_PROXY = $Proxy
    $env:HTTP_PROXY = $Proxy
    $env:ALL_PROXY = $Proxy
    Write-Host "📦 Proxy set: $Proxy"
}

# Capture original branch
$OriginalBranch = git rev-parse --abbrev-ref HEAD 2>$null
if (-not $OriginalBranch) {
    $OriginalBranch = git rev-parse HEAD 2>$null
}
Write-Host "📦 Current branch: $OriginalBranch"

# Check for uncommitted changes
$StatusOutput = git status --porcelain 2>$null
if ($StatusOutput) {
    Write-Host "📦 Stashing uncommitted changes"
    git stash | Out-Null
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to stash changes"
        exit 1
    }
    $Stashed = $true
}

# Update pack.toml
Write-Host "📦 Updating pack.toml version to $Version"
try {
    $Content = Get-Content "pack.toml" -Raw
    $NewContent = $Content -replace 'version = "v[\d.]+"', "version = `"$Version`""
    if ($NewContent -eq $Content) {
        Write-Error "Failed to update version in pack.toml - pattern not matched"
        Restore-State
        exit 1
    }
    [System.IO.File]::WriteAllText((Join-Path $PWD "pack.toml"), $NewContent, $utf8NoBom)
    Write-Host "✅ pack.toml updated"
} catch {
    Write-Error "Failed to update pack.toml: $_"
    Restore-State
    exit 1
}

# Build announcement content
Write-Host "📦 Building announcement"
$AnnLines = @()
if ($Announcement -and $Announcement.Trim()) {
    # Split by comma (handles both "a,b,c" string and string[] array)
    $Items = $Announcement -split ','
    foreach ($Item in $Items) {
        $Item = $Item.Trim()
        if ($Item) {
            $AnnLines += "- $Item"
        }
    }
} else {
    # Generate from git log
    $LastMsg = git log -1 --pretty=format:'%s' 2>$null
    if ($LastMsg) {
        $AnnLines += "- $LastMsg"
    }
}

$AnnContent = "### $Version 已发布"
if ($AnnLines.Count -gt 0) {
    $AnnContent += "`n" + ($AnnLines -join "`n")
}

# Write announcement.md (use WriteAllText to avoid BOM)
$AnnPath = "docs/announcement.md"
if (-not (Test-Path "docs")) {
    New-Item -ItemType Directory -Path "docs" | Out-Null
}
[System.IO.File]::WriteAllText((Join-Path $PWD $AnnPath), $AnnContent, $utf8NoBom)
Write-Host "✅ announcement.md updated"

# Create version-bump branch
Write-Host "📦 Fetching remote branches"
git fetch origin 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️ git fetch failed, continuing anyway"
}

Write-Host "📦 Creating branch $VersionBranch from $TargetBranch"

# Check if branch already exists locally
$existingBranch = git branch --list $VersionBranch 2>$null
if ($existingBranch) {
    Write-Host "⚠️ Branch $VersionBranch already exists locally, deleting"
    git branch -D $VersionBranch 2>$null | Out-Null
}

# Check if branch already exists remotely
$existingRemoteBranch = git ls-remote --heads origin $VersionBranch 2>$null
if ($existingRemoteBranch) {
    Write-Host "⚠️ Branch $VersionBranch already exists remotely, deleting"
    git push origin --delete $VersionBranch 2>$null | Out-Null
}

git checkout -b $VersionBranch $TargetBranch 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to create branch $VersionBranch"
    Restore-State
    exit 1
}

# Stage and commit
Write-Host "📦 Staging and committing"
git add pack.toml $AnnPath
if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to stage files"
    Restore-State
    exit 1
}

# Auto-stage update-summary file if present (needed for first stable release)
$summaryFiles = Get-ChildItem -Path "docs" -Filter "update-summary-*.md" -ErrorAction SilentlyContinue
if ($summaryFiles) {
    foreach ($sf in $summaryFiles) {
        $relPath = "docs/$($sf.Name)"
        Write-Host "📦 Auto-staging update summary: $relPath"
        git add $relPath 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Staged $relPath"
        }
    }
}

git commit -m "[feat] $Version $(if($ReleaseType -eq '正式'){'正式版'}else{'测试版'})版本更新"
if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to commit"
    Restore-State
    exit 1
}
Write-Host "✅ Committed"

# Push
Write-Host "📦 Pushing to origin"
git push -u origin $VersionBranch 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to push branch $VersionBranch"
    Restore-State
    exit 1
}
Write-Host "✅ Pushed"

# Create PR (use --body-file to handle multiline content)
Write-Host "📦 Creating PR"

# Check if PR already exists
$existingPr = gh pr list --repo Jasons-impart/Create-Delight-Remake --head $VersionBranch --base $TargetBranch --json url --jq '.[0].url' 2>$null
if ($LASTEXITCODE -eq 0 -and $existingPr) {
    Write-Host "✅ PR already exists: $existingPr"
    $script:PrepareSucceeded = $true
    Restore-State
    Write-Host "✅ Done! PR already exists: $existingPr"
    Write-Output $existingPr
    exit 0
}

$AnnText = $AnnLines -replace '^- ', ''
$PrBody = "版本号更新: → $Version`n`n**更新内容**:`n- $($AnnText -join "`n- ")"
$PrBodyFile = Join-Path $env:TEMP "opencode\pr-body-$Version.md"
New-Item -ItemType Directory -Path (Split-Path $PrBodyFile) -Force | Out-Null
[System.IO.File]::WriteAllText($PrBodyFile, $PrBody, $utf8NoBom)
$PrUrl = gh pr create --base $TargetBranch --head $VersionBranch --title "[feat] $Version 版本更新" --body-file $PrBodyFile 2>$null
Remove-Item $PrBodyFile -Force -ErrorAction SilentlyContinue
if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to create PR"
    Restore-State
    exit 1
}
Write-Host "✅ PR created"

# Restore original branch and unstash
$script:PrepareSucceeded = $true
Restore-State

# Output PR URL
Write-Host "✅ Done! PR URL: $PrUrl"
Write-Output $PrUrl
