[CmdletBinding(DefaultParameterSetName = "BySlug")]
param(
    [Parameter(ParameterSetName = "BySlug")]
    [ValidateSet("mods", "resourcepacks", "shaderpacks")]
    [string]$Category = "mods",

    [Parameter(ParameterSetName = "BySlug", Mandatory = $true)]
    [string]$Slug,

    [Parameter(ParameterSetName = "ByPath", Mandatory = $true)]
    [string]$Path,

    [string]$PackwizUrl = "https://github.com/Jasons-impart/packwiz/releases/latest/download/packwiz.exe",
    [string]$Proxy = "",
    [switch]$SkipSync,
    [switch]$DryRun
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

$RepoRoot = Split-Path -Parent $PSScriptRoot
$WorkBaseRoot = Join-Path $RepoRoot ".cache\packwiz-sync\target-update"
$WorkRoot = Join-Path $WorkBaseRoot ([System.Guid]::NewGuid().ToString("N"))
$ToolsRoot = Join-Path $RepoRoot ".cache\packwiz-sync\tools"
$PackwizExe = Join-Path $ToolsRoot "packwiz.exe"
$GeneratePackwizScript = Join-Path $PSScriptRoot "generate-packwiz-files.py"
$SyncPackwizAssetsScript = Join-Path $PSScriptRoot "sync-packwiz-assets.ps1"

function Write-Status {
    param([string]$Message)
    Write-Host "[target-update] $Message" -ForegroundColor Cyan
}

function Resolve-PythonCommand {
    $pythonCmd = Get-Command python -ErrorAction SilentlyContinue
    if ($pythonCmd) {
        return $pythonCmd.Source
    }

    $pythonLauncher = Get-Command py -ErrorAction SilentlyContinue
    if ($pythonLauncher) {
        $resolvedPython = & $pythonLauncher.Source -3 -c "import sys; print(sys.executable)"
        if ($LASTEXITCODE -eq 0 -and $resolvedPython) {
            return $resolvedPython.Trim()
        }
    }

    throw "Python was not found. Install Python so generate-packwiz-files.py can run."
}

function Ensure-Tool {
    param(
        [string]$Url,
        [string]$Destination
    )

    if (Test-Path -LiteralPath $Destination) {
        return
    }

    New-Item -ItemType Directory -Force -Path (Split-Path -Parent $Destination) | Out-Null
    Write-Status ("Downloading {0}..." -f (Split-Path -Leaf $Destination))
    Invoke-WithProxy { Invoke-WebRequest -Uri $Url -OutFile $Destination -UseBasicParsing }
}

function Write-Utf8NoBomFile {
    param(
        [string]$LiteralPath,
        [string]$Content
    )

    $utf8NoBom = [System.Text.UTF8Encoding]::new($false)
    [System.IO.File]::WriteAllText($LiteralPath, $Content, $utf8NoBom)
}

function Get-RelativeUnixPath {
    param(
        [string]$Root,
        [string]$FilePath
    )

    $fullRoot = [System.IO.Path]::GetFullPath($Root)
    $fullPath = [System.IO.Path]::GetFullPath($FilePath)
    $rootWithSlash = $fullRoot.TrimEnd('\', '/') + [System.IO.Path]::DirectorySeparatorChar
    if (-not $fullPath.StartsWith($rootWithSlash, [System.StringComparison]::OrdinalIgnoreCase)) {
        throw "Path '$FilePath' is outside repo root '$Root'."
    }

    return $fullPath.Substring($rootWithSlash.Length).Replace('\', '/')
}

function Get-PwTomlValue {
    param(
        [string]$Content,
        [string]$Key
    )

    $pattern = '(?m)^{0}\s*=\s*"([^"]*)"\s*$' -f [regex]::Escape($Key)
    if ($Content -match $pattern) {
        return $Matches[1]
    }
    return $null
}

function Normalize-PwSide {
    param([string]$Side)

    if ([string]::IsNullOrWhiteSpace($Side)) { return "both" }
    $normalized = $Side.Trim().ToLowerInvariant()
    if (@("both", "client", "server") -contains $normalized) { return $normalized }
    return "both"
}

function Set-PwTomlSide {
    param(
        [string]$Content,
        [string]$Side
    )

    $sideValue = Normalize-PwSide -Side $Side
    if ($Content -match '(?m)^side\s*=\s*".*"$') {
        return [regex]::Replace($Content, '(?m)^side\s*=\s*".*"$', "side = `"$sideValue`"", 1)
    }
    if ($Content -match '(?m)^filename\s*=') {
        return [regex]::Replace($Content, '(?m)^(filename\s*=\s*".*"\s*)$', "`$1`nside = `"$sideValue`"", 1)
    }
    return "side = `"$sideValue`"`n$Content"
}

function Invoke-WithProxy {
    param(
        [scriptblock]$Script
    )

    if ([string]::IsNullOrWhiteSpace($Proxy)) {
        return & $Script
    }

    $oldHttpProxy = $env:HTTP_PROXY
    $oldHttpsProxy = $env:HTTPS_PROXY
    $oldAllProxy = $env:ALL_PROXY
    try {
        $env:HTTP_PROXY = $Proxy
        $env:HTTPS_PROXY = $Proxy
        $env:ALL_PROXY = $Proxy
        return & $Script
    }
    finally {
        $env:HTTP_PROXY = $oldHttpProxy
        $env:HTTPS_PROXY = $oldHttpsProxy
        $env:ALL_PROXY = $oldAllProxy
    }
}

function Invoke-GeneratePackwizFiles {
    param([string]$OutputDir)

    $pythonExe = Resolve-PythonCommand
    & $pythonExe $GeneratePackwizScript --source (Join-Path $RepoRoot "modpack.toml") --output-dir $OutputDir
    if ($LASTEXITCODE -ne 0) {
        throw "generate-packwiz-files.py exited with code $LASTEXITCODE."
    }
}

function Invoke-Packwiz {
    param(
        [string[]]$Arguments,
        [string]$WorkingDirectory
    )

    Push-Location $WorkingDirectory
    try {
        Invoke-WithProxy { & $PackwizExe @Arguments }
        if ($LASTEXITCODE -ne 0) {
            throw "packwiz $($Arguments -join ' ') exited with code $LASTEXITCODE."
        }
    }
    finally {
        Pop-Location
    }
}

function Resolve-TargetPath {
    if ($PSCmdlet.ParameterSetName -eq "ByPath") {
        $candidate = if ([System.IO.Path]::IsPathRooted($Path)) {
            $Path
        }
        else {
            Join-Path $RepoRoot $Path
        }

        if (-not (Test-Path -LiteralPath $candidate)) {
            throw "Target metadata file was not found: $candidate"
        }
        return (Resolve-Path -LiteralPath $candidate).Path
    }

    $categoryRoot = Join-Path $RepoRoot $Category
    $candidate = Join-Path $categoryRoot $Slug
    if (-not $candidate.EndsWith(".pw.toml", [System.StringComparison]::OrdinalIgnoreCase)) {
        $candidate = Join-Path $categoryRoot "$Slug.pw.toml"
    }

    if (-not (Test-Path -LiteralPath $candidate)) {
        throw "Target metadata file was not found: $candidate"
    }
    return (Resolve-Path -LiteralPath $candidate).Path
}

$targetPath = Resolve-TargetPath
$relativeTargetPath = Get-RelativeUnixPath -Root $RepoRoot -FilePath $targetPath
$originalContent = Get-Content -LiteralPath $targetPath -Raw
$originalSide = Normalize-PwSide -Side (Get-PwTomlValue -Content $originalContent -Key "side")
$updateSlug = [System.IO.Path]::GetFileNameWithoutExtension([System.IO.Path]::GetFileNameWithoutExtension($targetPath))

if ($originalContent -notmatch '(?m)^\[update\.curseforge\]\s*$') {
    throw "Target metadata is not a CurseForge-managed .pw.toml: $relativeTargetPath"
}

New-Item -ItemType Directory -Force -Path $WorkRoot | Out-Null

try {
    Write-Status "Generating temporary packwiz pack..."
    Invoke-GeneratePackwizFiles -OutputDir $WorkRoot

    $tempTargetPath = Join-Path $WorkRoot $relativeTargetPath
    New-Item -ItemType Directory -Force -Path (Split-Path -Parent $tempTargetPath) | Out-Null
    Copy-Item -LiteralPath $targetPath -Destination $tempTargetPath -Force

    if ($DryRun) {
        Write-Status "Dry run: would update $relativeTargetPath and preserve side = `"$originalSide`"."
        return
    }

    Ensure-Tool -Url $PackwizUrl -Destination $PackwizExe

    Write-Status "Refreshing temporary pack..."
    Invoke-Packwiz -Arguments @("refresh") -WorkingDirectory $WorkRoot

    Write-Status "Updating $updateSlug..."
    Invoke-Packwiz -Arguments @("update", $updateSlug, "--yes") -WorkingDirectory $WorkRoot

    if (-not (Test-Path -LiteralPath $tempTargetPath)) {
        throw "packwiz update did not leave the expected target metadata file: $relativeTargetPath"
    }

    $updatedContent = Get-Content -LiteralPath $tempTargetPath -Raw
    $updatedContent = Set-PwTomlSide -Content $updatedContent -Side $originalSide
    $updatedSide = Normalize-PwSide -Side (Get-PwTomlValue -Content $updatedContent -Key "side")
    if ($updatedSide -ne $originalSide) {
        throw "Refusing to write $relativeTargetPath because side changed from '$originalSide' to '$updatedSide'."
    }

    Write-Utf8NoBomFile -LiteralPath $targetPath -Content $updatedContent
    Write-Status "Updated $relativeTargetPath and preserved side = `"$originalSide`"."
}
finally {
    if (Test-Path -LiteralPath $WorkRoot) {
        Remove-Item -LiteralPath $WorkRoot -Recurse -Force -ErrorAction SilentlyContinue
    }
}

if (-not $SkipSync) {
    Write-Status "Syncing local Packwiz assets..."
    & $SyncPackwizAssetsScript
    if ($LASTEXITCODE -ne 0) {
        throw "sync-packwiz-assets.ps1 exited with code $LASTEXITCODE."
    }
}
