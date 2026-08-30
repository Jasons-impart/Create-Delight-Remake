<#
.SYNOPSIS
    Resolve a read-only Create-Delight Remake release plan.

.DESCRIPTION
    Derives the release version, target branch, previous stable version, and
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
$VersionPattern = '^v(\d+)\.(\d+)\.(\d+)\.(\d+)(-test)?$'
$StableVersionPattern = '^v\d+\.\d+\.\d+\.\d+$'

function Invoke-GitReadOnly {
    param([string[]]$Arguments)

    $output = & git -C $RepoRoot @Arguments 2>$null
    if ($LASTEXITCODE -ne 0) {
        return @()
    }
    return @($output | Where-Object { $_ })
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

function Get-LatestTag {
    $tags = Invoke-GitReadOnly -Arguments @("tag", "-l", "v*", "--sort=-version:refname")
    foreach ($tag in $tags) {
        if ($tag -match $VersionPattern) {
            return $tag
        }
    }
    throw "No release tag matching $VersionPattern was found"
}

function Get-LatestStableTag {
    $tags = Invoke-GitReadOnly -Arguments @("tag", "-l", "v*", "--sort=-version:refname")
    foreach ($tag in $tags) {
        if ($tag -match $StableVersionPattern) {
            return $tag
        }
    }
    throw "No stable release tag was found"
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
    $Version = Get-IncrementedVersion -BaseVersion (Get-LatestTag) -Type $effectiveType
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

$previousVersion = Get-LatestStableTag
$matchingStableTags = Invoke-GitReadOnly -Arguments @("tag", "-l", "v$subVersion.*") |
    Where-Object { $_ -match "^v$([regex]::Escape($subVersion))\.\d+$" -and $_ -ne $Version }
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
