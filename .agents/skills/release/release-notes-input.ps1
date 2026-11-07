<#
.SYNOPSIS
    Export commit/PR evidence for the release agent to read and write release notes.
.DESCRIPTION
    Reads Git and GitHub only. Writes local JSON; never creates tags, branches or Releases.
    Use -TargetRef origin/release-v050x before a new tag exists; existing tags default to Version.
#>
[CmdletBinding()]
param(
    [Parameter(Mandatory=$true)][string]$Version,
    [Parameter(Mandatory=$true)][string]$OutputFile,
    [string]$TargetRef = $Version,
    [string]$PreviousVersion = '',
    [ValidateSet('正式','测试')][string]$ReleaseType = '正式',
    [string]$ReleaseHistoryFile = '',
    [string]$Repository = 'Jasons-impart/Create-Delight-Remake'
)
$ErrorActionPreference = 'Stop'
. "$PSScriptRoot/release-notes.ps1"
$root = Split-Path -Parent (Split-Path -Parent (Split-Path -Parent $PSScriptRoot))
if ($ReleaseType -eq '正式') {
    $history = if ($ReleaseHistoryFile) {
        @(Get-Content -LiteralPath $ReleaseHistoryFile -Raw -Encoding utf8 | ConvertFrom-Json)
    } else { @(Get-ReleaseHistory -Repository $Repository) }
    $PreviousVersion = Resolve-PreviousFormalTag -Version $Version -Releases $history -PreviousVersion $PreviousVersion
} elseif (-not $PreviousVersion) { throw 'Test-release evidence requires explicit -PreviousVersion from release-plan.ps1' }
$inputData = Get-ReleaseNotesInput -Version $Version -PreviousVersion $PreviousVersion -TargetRef $TargetRef -RepoRoot $root -Repository $Repository
$inputData | ConvertTo-Json -Depth 20 | Set-Content -LiteralPath $OutputFile -Encoding utf8
Write-Host "Notes evidence exported: $OutputFile ($PreviousVersion..$($inputData.targetCommit))"
