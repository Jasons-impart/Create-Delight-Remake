param(
    [Parameter(Mandatory = $true)]
    [string]$Summary,

    [string]$Problem = "",
    [string]$Fix = "",
    [string]$Target = "lessons-learned.md",
    [string]$Root = "",
    [string]$NotesPath = ""
)

$ErrorActionPreference = "Stop"

if ([string]::IsNullOrWhiteSpace($Root)) {
    $Root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
}

if ([string]::IsNullOrWhiteSpace($NotesPath)) {
    $NotesPath = Join-Path $Root "tmp-opencode/knowledge-notes.md"
}

$notesDir = Split-Path -Parent $NotesPath
if (-not (Test-Path -LiteralPath $notesDir)) {
    New-Item -ItemType Directory -Path $notesDir -Force | Out-Null
}

$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss zzz"
$lines = @(
    "## $timestamp",
    "",
    "- Target: $Target",
    "- Summary: $Summary"
)

if (-not [string]::IsNullOrWhiteSpace($Problem)) {
    $lines += "- Problem: $Problem"
}

if (-not [string]::IsNullOrWhiteSpace($Fix)) {
    $lines += "- Fix: $Fix"
}

$lines += ""

Add-Content -LiteralPath $NotesPath -Value $lines -Encoding UTF8
Write-Host "Knowledge note appended to $(Resolve-Path -LiteralPath $NotesPath)"
