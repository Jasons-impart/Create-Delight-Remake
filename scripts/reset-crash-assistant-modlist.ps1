[CmdletBinding()]
param([switch]$DryRun)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"
$repoRoot = Split-Path -Parent $PSScriptRoot
$baseline = Join-Path $repoRoot "config/modpack_defaults/config/crash_assistant/modlist.json"
$runtime = Join-Path $repoRoot "config/crash_assistant/modlist.json"

# Crash Assistant copies defaults only when the runtime file is absent.
# Never remove other runtime settings or the user's warning preferences.
if (-not (Test-Path -LiteralPath $baseline -PathType Leaf) -or
    -not (Test-Path -LiteralPath $runtime -PathType Leaf)) {
    return
}
$null = Get-Content -LiteralPath $baseline -Raw | ConvertFrom-Json
if ($DryRun) {
    Write-Host "[sync] Would reset Crash Assistant runtime modlist from managed defaults on next launch."
    return
}
Remove-Item -LiteralPath $runtime
Write-Host "[sync] Reset Crash Assistant runtime modlist; managed defaults will be loaded on next launch."
