param(
    [switch]$IfUnset,
    [switch]$Quiet
)

$ErrorActionPreference = "Stop"

function Write-InstallMessage {
    param([string]$Message)

    if (-not $Quiet) {
        Write-Host $Message
    }
}

$repoRoot = (& git rev-parse --show-toplevel 2>$null)
if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($repoRoot)) {
    throw "Not inside a Git worktree."
}

$repoRoot = $repoRoot.Trim()
$hooksPath = Join-Path $repoRoot "scripts/.githooks"
$gitCommonDir = (& git rev-parse --git-common-dir 2>$null)
if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($gitCommonDir)) {
    throw "Could not resolve Git common directory."
}

if (-not [System.IO.Path]::IsPathRooted($gitCommonDir)) {
    $gitCommonDir = Join-Path $repoRoot $gitCommonDir
}

$gitHooksPath = Join-Path $gitCommonDir "hooks"

$currentHooksPath = (& git config --local --get core.hooksPath 2>$null)
if ($LASTEXITCODE -ne 0) {
    $currentHooksPath = $null
}

$currentHooksPath = "$currentHooksPath".Trim()
if ($currentHooksPath -eq ".githooks") {
    git config --local --unset core.hooksPath
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to migrate core.hooksPath from .githooks to .git/hooks shims."
    }

    $currentHooksPath = ""
}

if (-not [string]::IsNullOrWhiteSpace($currentHooksPath)) {
    Write-InstallMessage "Git hooks already configured: core.hooksPath=$currentHooksPath"
    Write-InstallMessage "Skipped installing .git/hooks shims because a custom hooksPath would ignore them."
    exit 0
}

if (-not (Test-Path -LiteralPath $hooksPath)) {
    throw "Missing tracked hooks directory: $hooksPath"
}

New-Item -ItemType Directory -Force -Path $gitHooksPath | Out-Null

function Install-HookShim {
    param([string]$Name)

    $trackedHook = Join-Path $hooksPath $Name
    if (-not (Test-Path -LiteralPath $trackedHook)) {
        throw "Missing tracked hook: $trackedHook"
    }

    $targetHook = Join-Path $gitHooksPath $Name
    $localHook = Join-Path $gitHooksPath "$Name.local"
    $marker = "Create-Delight managed hook shim"

    if (Test-Path -LiteralPath $targetHook) {
        $existing = Get-Content -LiteralPath $targetHook -Raw -ErrorAction SilentlyContinue
        if ($existing -notmatch [regex]::Escape($marker)) {
            if (Test-Path -LiteralPath $localHook) {
                Write-InstallMessage "Skipped $Name because $targetHook is custom and $localHook already exists."
                return
            }

            Move-Item -LiteralPath $targetHook -Destination $localHook
            Write-InstallMessage "Preserved existing $Name as $Name.local"
        }
    }

    $shim = @"
#!/bin/sh
# $marker. Edit scripts/.githooks/$Name for project behavior.
hook_dir=`$(dirname "`$0")
local_hook="`$hook_dir/$Name.local"
if [ -x "`$local_hook" ]; then
  "`$local_hook" "`$@" || exit `$?
elif [ -f "`$local_hook" ]; then
  sh "`$local_hook" "`$@" || exit `$?
fi

repo_root=`$(git rev-parse --show-toplevel 2>/dev/null) || exit 0
tracked_hook="`$repo_root/scripts/.githooks/$Name"
if [ -x "`$tracked_hook" ]; then
  "`$tracked_hook" "`$@"
elif [ -f "`$tracked_hook" ]; then
  sh "`$tracked_hook" "`$@"
fi
"@

    $utf8NoBom = [System.Text.UTF8Encoding]::new($false)
    [System.IO.File]::WriteAllText($targetHook, $shim, $utf8NoBom)
}

$isWindowsPlatform = $env:OS -eq "Windows_NT"
$isWindowsVariable = Get-Variable -Name IsWindows -ErrorAction SilentlyContinue
if ($null -ne $isWindowsVariable) {
    $isWindowsPlatform = [bool]$isWindowsVariable.Value
}

foreach ($hookName in @("post-merge", "post-checkout", "post-rewrite")) {
    Install-HookShim -Name $hookName
}

if (-not $isWindowsPlatform) {
    Get-ChildItem -LiteralPath $gitHooksPath -File | Where-Object { $_.Name -in @("post-merge", "post-checkout", "post-rewrite") } | ForEach-Object {
        chmod +x $_.FullName
    }
}

Write-InstallMessage "Git hooks installed in .git/hooks"
Write-InstallMessage "Packwiz assets will sync automatically after relevant merge, rebase, or branch checkout changes."
