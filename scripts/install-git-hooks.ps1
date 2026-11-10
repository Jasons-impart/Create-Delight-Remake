# Temporary compatibility shim.
# Remaining PowerShell callers keep invoking this path until they are ported.
# All behavior lives in install-git-hooks.py; do not add logic here.
$ErrorActionPreference = "Stop"

function Resolve-ShimPython {
    $pythonCmd = Get-Command python -ErrorAction SilentlyContinue
    if ($pythonCmd -and ($pythonCmd.Source -notmatch '[\\/]WindowsApps[\\/]')) {
        & $pythonCmd.Source -c "import sys; raise SystemExit(0 if sys.version_info >= (3, 11) else 1)" 2>$null | Out-Null
        if ($LASTEXITCODE -eq 0) {
            return $pythonCmd.Source
        }
    }

    $pythonLauncher = Get-Command py -ErrorAction SilentlyContinue
    if ($pythonLauncher) {
        $resolved = & $pythonLauncher.Source -3 -c "import sys; print(sys.executable)" 2>$null
        if ($LASTEXITCODE -eq 0 -and $resolved) {
            return ([string]$resolved).Trim()
        }
    }

    $python3Cmd = Get-Command python3 -ErrorAction SilentlyContinue
    if ($python3Cmd -and ($python3Cmd.Source -notmatch '[\\/]WindowsApps[\\/]')) {
        & $python3Cmd.Source -c "import sys; raise SystemExit(0 if sys.version_info >= (3, 11) else 1)" 2>$null | Out-Null
        if ($LASTEXITCODE -eq 0) {
            return $python3Cmd.Source
        }
    }

    throw "Python was not found. Install Python 3.11+ so install-git-hooks.py can run."
}

$python = Resolve-ShimPython
$script = Join-Path $PSScriptRoot "install-git-hooks.py"
& $python $script @args
exit $LASTEXITCODE
