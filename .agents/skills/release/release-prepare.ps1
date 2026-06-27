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
    [string]$Proxy = ""
)

$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# Non-interactive git environment
$env:CI = 'true'
$env:GIT_TERMINAL_PROMPT = '0'
$env:GCM_INTERACTIVE = 'never'
$env:GIT_EDITOR = ':'
$env:EDITOR = ':'
$env:GIT_PAGER = 'cat'

# Set proxy if provided
if ($Proxy) {
    $env:HTTPS_PROXY = $Proxy
    Write-Host "📦 Proxy set: $Proxy"
}

$Stashed = $false
$OriginalBranch = ""

function Restore-State {
    if ($OriginalBranch) {
        Write-Host "📦 Restoring branch: $OriginalBranch"
        git checkout $OriginalBranch 2>$null | Out-Null
    }
    if ($Stashed) {
        Write-Host "📦 Unstashing changes"
        git stash pop 2>$null | Out-Null
    }
}

# Verify working directory
if (-not (Test-Path "pack.toml")) {
    Write-Error "pack.toml not found in current directory. Run from repo root."
    exit 1
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
    $utf8NoBom = [System.Text.UTF8Encoding]::new($false)
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

$AnnContent = "### 最新版本! $Version!已推出"
if ($AnnLines.Count -gt 0) {
    $AnnContent += "`n" + ($AnnLines -join "`n")
}

# Write announcement.md (use WriteAllText to avoid BOM)
$AnnPath = "docs/announcement.md"
if (-not (Test-Path "docs")) {
    New-Item -ItemType Directory -Path "docs" | Out-Null
}
$utf8NoBom = [System.Text.UTF8Encoding]::new($false)
[System.IO.File]::WriteAllText((Join-Path $PWD $AnnPath), $AnnContent, $utf8NoBom)
Write-Host "✅ announcement.md updated"

# Create version-bump branch
Write-Host "📦 Creating branch release/$Version from $TargetBranch"
git checkout -b "release/$Version" $TargetBranch 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to create branch release/$Version"
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

git commit -m "[feat] $Version $(if($ReleaseType -eq '正式'){'正式版'}else{'测试版'})版本更新"
if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to commit"
    Restore-State
    exit 1
}
Write-Host "✅ Committed"

# Push
Write-Host "📦 Pushing to origin"
git push -u origin "release/$Version" 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to push branch release/$Version"
    Restore-State
    exit 1
}
Write-Host "✅ Pushed"

# Create PR (use --body-file to handle multiline content)
Write-Host "📦 Creating PR"
$AnnText = $AnnLines -replace '^- ', ''
$PrBody = "版本号更新: → $Version`n`n**更新内容**:`n- $($AnnText -join "`n- ")"
$PrBodyFile = Join-Path $env:TEMP "cdr-agent-release\pr-body-$Version.md"
New-Item -ItemType Directory -Path (Split-Path $PrBodyFile) -Force | Out-Null
[System.IO.File]::WriteAllText($PrBodyFile, $PrBody, [System.Text.UTF8Encoding]::new($false))
$PrUrl = gh pr create --base $TargetBranch --head "release/$Version" --title "[feat] $Version 版本更新" --body-file $PrBodyFile 2>$null
Remove-Item $PrBodyFile -Force -ErrorAction SilentlyContinue
if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to create PR"
    Restore-State
    exit 1
}
Write-Host "✅ PR created"

# Restore original branch and unstash
Restore-State

# Output PR URL
Write-Host "✅ Done! PR URL: $PrUrl"
Write-Output $PrUrl
