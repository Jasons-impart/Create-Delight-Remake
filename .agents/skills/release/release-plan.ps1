<#
.SYNOPSIS
    Resolve a read-only Create-Delight Remake release plan.

.DESCRIPTION
    Derives the release version, target branch, previous release tag, and
    first-stable candidate without changing Git state or remote state.
#>
[CmdletBinding()]
param(
    [string]$Version = "",
    [string]$TargetBranch = "",
    [ValidateSet("正式", "测试")][string]$ReleaseType = "",
    [switch]$AsJson
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$RepoRoot = Split-Path -Parent (Split-Path -Parent (Split-Path -Parent $PSScriptRoot))
$GitHubRepo = "Jasons-impart/Create-Delight-Remake"
$VersionPattern = '^v(\d+)\.(\d+)\.(\d+)\.(\d+)(-test)?$'

function Invoke-GitReadOnly {
    param([string[]]$Arguments)

    $output = & git -C $RepoRoot @Arguments 2>$null
    if ($LASTEXITCODE -ne 0) {
        return @()
    }
    return @($output | Where-Object { $_ })
}

function Invoke-GhJson {
    param([string[]]$Arguments)

    if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
        throw "gh CLI is required to resolve the latest GitHub release"
    }

    $output = & gh @Arguments 2>$null
    if ($LASTEXITCODE -ne 0 -or -not $output) {
        throw "Could not query GitHub releases"
    }

    try {
        return $output | ConvertFrom-Json -ErrorAction Stop
    } catch {
        throw "GitHub release query returned invalid JSON"
    }
}

function Get-ModpackVersion {
    $modpackPath = Join-Path $RepoRoot "modpack.toml"
    if (-not (Test-Path -LiteralPath $modpackPath)) {
        throw "modpack.toml not found: $modpackPath"
    }

    $content = Get-Content -LiteralPath $modpackPath -Raw
    $match = [regex]::Match($content, '(?m)^version\s*=\s*"([^"]+)"\s*$')
    if (-not $match.Success) {
        throw "Cannot read version from modpack.toml"
    }
    return $match.Groups[1].Value
}

function Test-HeadChangedModpack {
    $changedPaths = Invoke-GitReadOnly -Arguments @("diff-tree", "--no-commit-id", "--name-only", "-r", "HEAD")
    return $changedPaths -contains "modpack.toml"
}

function Get-LatestPublishedRelease {
    $releases = @(Invoke-GhJson -Arguments @(
        "release", "list", "--repo", $GitHubRepo, "--limit", "1",
        "--exclude-drafts", "--json", "tagName,publishedAt,isPrerelease"
    ))
    if ($releases.Count -eq 0 -or -not $releases[0].tagName) {
        throw "No published GitHub release was found"
    }
    return $releases[0]
}

function Get-LatestPublishedReleaseTag {
    $release = Get-LatestPublishedRelease
    if ($release.tagName -notmatch $VersionPattern) {
        throw "Latest published GitHub release has invalid tag: $($release.tagName)"
    }
    return $release.tagName
}

function Get-LatestReleaseTag {
    # gh release view without a tag follows GitHub's latest release semantics:
    # the latest published non-prerelease release.
    $release = Invoke-GhJson -Arguments @(
        "release", "view", "--repo", $GitHubRepo, "--json", "tagName,publishedAt,isPrerelease"
    )
    if (-not $release.tagName -or $release.isPrerelease) {
        throw "GitHub latest release is missing or marked as a prerelease"
    }
    if ($release.tagName -notmatch $VersionPattern) {
        throw "GitHub latest release has invalid tag: $($release.tagName)"
    }
    return $release.tagName
}

function Get-PublishedReleases {
    return @(Invoke-GhJson -Arguments @(
        "release", "list", "--repo", $GitHubRepo, "--limit", "100",
        "--exclude-drafts", "--json", "tagName,publishedAt,isPrerelease"
    ))
}

function Get-IncrementedVersion {
    param(
        [Parameter(Mandatory = $true)][string]$BaseVersion,
        [Parameter(Mandatory = $true)][string]$Type
    )

    if ($BaseVersion -notmatch $VersionPattern) {
        throw "Cannot increment invalid version: $BaseVersion"
    }

    $major = $Matches[1]
    $minor = $Matches[2]
    $patch = $Matches[3]
    $build = ([int]$Matches[4]) + 1
    $suffix = if ($Type -eq "测试") { "-test" } else { "" }
    return "v$major.$minor.$patch.$build$suffix"
}

function Test-BranchExists {
    param([Parameter(Mandatory = $true)][string]$Branch)

    $remote = Invoke-GitReadOnly -Arguments @("ls-remote", "--heads", "origin", $Branch)
    if (@($remote).Count -gt 0) {
        return $true
    }

    & git -C $RepoRoot show-ref --verify --quiet "refs/remotes/origin/$Branch" 2>$null
    return $LASTEXITCODE -eq 0
}

$currentModpackVersion = Get-ModpackVersion
if ($Version) {
    if ($Version -notmatch $VersionPattern) {
        throw "Invalid version: $Version"
    }
} elseif (Test-HeadChangedModpack) {
    $Version = $currentModpackVersion
} else {
    $effectiveType = if ($ReleaseType) { $ReleaseType } else { "正式" }
    $Version = Get-IncrementedVersion -BaseVersion (Get-LatestPublishedReleaseTag) -Type $effectiveType
}

$inferredType = if ($Version.EndsWith("-test")) { "测试" } else { "正式" }
if ($ReleaseType -and $ReleaseType -ne $inferredType) {
    throw "ReleaseType '$ReleaseType' conflicts with version '$Version'"
}
$ReleaseType = $inferredType

if ($Version -notmatch $VersionPattern) {
    throw "Invalid resolved version: $Version"
}
$major = $Matches[1]
$minor = $Matches[2]
$patch = $Matches[3]
$subVersion = "$major.$minor.$patch"

if (-not $TargetBranch) {
    $releaseBranch = "release-v$major$minor$patch`x"
    $TargetBranch = if (Test-BranchExists -Branch $releaseBranch) { $releaseBranch } else { "main" }
}

$previousVersion = if ($ReleaseType -eq "测试") {
    Get-LatestPublishedReleaseTag
} else {
    Get-LatestReleaseTag
}
$matchingStableTags = @(Get-PublishedReleases |
    Where-Object {
        (-not $_.isPrerelease) -and
        ($_.tagName -match "^v$([regex]::Escape($subVersion))\.\d+$") -and
        ($_.tagName -ne $Version)
    } |
    Select-Object -ExpandProperty tagName)
$firstStableCandidate = $ReleaseType -eq "正式" -and @($matchingStableTags).Count -eq 0

$commitRange = "$previousVersion..HEAD"
$commitSubjects = Invoke-GitReadOnly -Arguments @("log", $commitRange, "--pretty=format:%s")
$plan = [ordered]@{
    version = $Version
    releaseType = $ReleaseType
    targetBranch = $TargetBranch
    previousVersion = $previousVersion
    currentModpackVersion = $currentModpackVersion
    headChangedModpack = Test-HeadChangedModpack
    firstStableCandidate = $firstStableCandidate
    updateSummaryPath = "docs/update-summary-$Version.md"
    announcementRequired = $ReleaseType -eq "正式"
    commitRange = $commitRange
    commitSubjects = @($commitSubjects)
}

if ($AsJson) {
    $plan | ConvertTo-Json -Depth 4
    exit 0
}

Write-Output "Version: $($plan.version)"
Write-Output "Release type: $($plan.releaseType)"
Write-Output "Target branch: $($plan.targetBranch)"
Write-Output "Previous stable version: $($plan.previousVersion)"
Write-Output "HEAD changed modpack.toml: $($plan.headChangedModpack)"
Write-Output "First stable candidate: $($plan.firstStableCandidate)"
Write-Output "Update summary path: $($plan.updateSummaryPath)"
Write-Output "Commit range: $($plan.commitRange)"
Write-Output "Commit subjects: $($plan.commitSubjects.Count)"
