<#
.SYNOPSIS
    Read-only release-note preview, including already-published tags. Never invokes publish.
#>
[CmdletBinding()]
param(
    [Parameter(Mandatory=$true)][string]$Version,
    [string]$PreviousVersion = '',
    [ValidateSet('正式','测试')][string]$ReleaseType = '正式',
    [string]$NotesFile = '',
    # Offline snapshot: array of tagName/isDraft/isPrerelease/publishedAt objects.
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
} elseif (-not $PreviousVersion) { throw 'Preview of a test release requires explicit -PreviousVersion' }
Assert-ReleaseRange -Version $Version -PreviousVersion $PreviousVersion -RepoRoot $root
if (-not $NotesFile -and (Test-Path -LiteralPath "$root/docs/release-notes-$Version.md")) {
    $NotesFile = "$root/docs/release-notes-$Version.md"
}
$curated = ''
if ($NotesFile) {
    $curated = Get-Content -LiteralPath $NotesFile -Raw -Encoding utf8
    if (-not $curated.Trim()) { throw "Curated notes file is empty: $NotesFile" }
}
$commits = @(Get-ReleaseCommits -PreviousVersion $PreviousVersion -Version $Version -RepoRoot $root)
$notes = New-ReleaseNotes -Version $Version -PreviousVersion $PreviousVersion -ReleaseType $ReleaseType `
    -Repository $Repository -Commits $commits -CuratedContent $curated
Write-Output $notes
