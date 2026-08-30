[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$CurseForgeUrl,

    [ValidateSet("mods", "resourcepacks", "shaderpacks", "tacz")]
    [string]$Category = "mods",

    [Parameter(Mandatory = $true)]
    [ValidateSet("both", "client", "server")]
    [string]$Side,

    [string]$PackwizUrl = "https://github.com/Jasons-impart/packwiz/releases/latest/download/packwiz.exe",
    [string]$Proxy = $env:PACKWIZ_PROXY,
    [switch]$SkipSync,
    [switch]$DryRun
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

$RepoRoot = Split-Path -Parent $PSScriptRoot
$WorkBaseRoot = Join-Path $RepoRoot ".cache\packwiz-sync\target-add"
$WorkRoot = Join-Path $WorkBaseRoot ([System.Guid]::NewGuid().ToString("N"))
$ToolsRoot = Join-Path $RepoRoot ".cache\packwiz-sync\tools"
$PackwizExe = Join-Path $ToolsRoot "packwiz.exe"
$GeneratePackwizScript = Join-Path $PSScriptRoot "generate-packwiz-files.py"
$SyncPackwizAssetsScript = Join-Path $PSScriptRoot "sync-packwiz-assets.ps1"

function Write-Status {
    param([string]$Message)
    Write-Host "[target-add] $Message" -ForegroundColor Cyan
}

function Resolve-PythonCommand {
    $pythonCmd = Get-Command python -ErrorAction SilentlyContinue
    if ($pythonCmd) {
        return $pythonCmd.Source
    }

    $pythonLauncher = Get-Command py -ErrorAction SilentlyContinue
    if ($pythonLauncher) {
        $resolvedPython = & $pythonLauncher.Source -3 -c "import sys; print(sys.executable)"
        if (($LASTEXITCODE -eq 0) -and $resolvedPython) {
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

function Set-PwTomlSide {
    param(
        [string]$Content,
        [string]$Side
    )

    if ($Content -match '(?m)^side\s*=\s*".*"$') {
        return [regex]::Replace($Content, '(?m)^side\s*=\s*".*"$', "side = `"$Side`"", 1)
    }
    if ($Content -match '(?m)^filename\s*=') {
        return [regex]::Replace($Content, '(?m)^(filename\s*=\s*".*"\s*)$', "`$1`nside = `"$Side`"", 1)
    }
    throw "packwiz metadata is missing a filename field."
}

function Remove-PackwizLoaderVersions {
    param([string]$PackFilePath)

    $lines = @(Get-Content -LiteralPath $PackFilePath)
    $updatedLines = [System.Collections.Generic.List[string]]::new()
    $inVersions = $false
    $changed = $false

    foreach ($line in $lines) {
        if ($line -match '^\s*\[([^]]+)\]\s*$') {
            $inVersions = ($Matches[1] -eq "versions")
            $updatedLines.Add($line) | Out-Null
            continue
        }

        if ($inVersions -and $line -match '^\s*(forge|neoforge|fabric|quilt|liteloader)\s*=') {
            $changed = $true
            continue
        }

        $updatedLines.Add($line) | Out-Null
    }

    if ($changed) {
        Write-Utf8NoBomFile -LiteralPath $PackFilePath -Content (($updatedLines -join "`n") + "`n")
    }
}

function Get-AddedProjectFilename {
    param([object[]]$Output)

    foreach ($line in $Output) {
        $text = [string]$line
        if ($text -match '^Project ".+" successfully added! \((.+)\)$') {
            return $Matches[1]
        }
    }

    return $null
}

function Get-PwTomlFilename {
    param([string]$Path)

    $content = Get-Content -LiteralPath $Path -Raw
    if ($content -match '(?m)^filename\s*=\s*"(.+)"\s*$') {
        return $Matches[1]
    }

    return $null
}

function Invoke-WithProxy {
    param([scriptblock]$Script)

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
        $output = @(Invoke-WithProxy { & $PackwizExe @Arguments 2>&1 })
        $exitCode = $LASTEXITCODE
        foreach ($line in $output) {
            Write-Host ([string]$line)
        }
        if ($exitCode -ne 0) {
            throw "packwiz $($Arguments -join ' ') exited with code $exitCode."
        }

        return [pscustomobject]@{
            ExitCode = $exitCode
            Output = $output
        }
    }
    finally {
        Pop-Location
    }
}

New-Item -ItemType Directory -Force -Path $WorkRoot | Out-Null

try {
    Write-Status "Generating temporary packwiz pack..."
    Invoke-GeneratePackwizFiles -OutputDir $WorkRoot
    if ($Category -ne "mods") {
        Write-Status "Removing mod-loader filters from the temporary $Category pack..."
        Remove-PackwizLoaderVersions -PackFilePath (Join-Path $WorkRoot "pack.toml")
    }
    Ensure-Tool -Url $PackwizUrl -Destination $PackwizExe

    Write-Status "Adding the requested CurseForge file in the temporary pack..."
    $addResult = Invoke-Packwiz -Arguments @(
        "curseforge", "add", $CurseForgeUrl,
        "--meta-folder", $Category,
        "--meta-folder-base", ".",
        "--yes"
    ) -WorkingDirectory $WorkRoot

    $tempCategoryRoot = Join-Path $WorkRoot $Category
    $generatedMetadata = @(Get-ChildItem -LiteralPath $tempCategoryRoot -Filter "*.pw.toml" -File -ErrorAction SilentlyContinue)
    $mainProjectFilename = Get-AddedProjectFilename -Output $addResult.Output
    if (-not $mainProjectFilename) {
        throw "Packwiz did not report the requested project's generated filename."
    }

    $targetMetadata = @(
        $generatedMetadata | Where-Object { (Get-PwTomlFilename -Path $_.FullName) -eq $mainProjectFilename }
    )
    if ($targetMetadata.Count -ne 1) {
        throw "Expected exactly one metadata file for '$mainProjectFilename', found $($targetMetadata.Count)."
    }

    $tempTargetPath = $targetMetadata[0].FullName
    $content = Get-Content -LiteralPath $tempTargetPath -Raw
    $content = Set-PwTomlSide -Content $content -Side $Side
    Write-Utf8NoBomFile -LiteralPath $tempTargetPath -Content $content

    Write-Status "Refreshing the temporary pack..."
    $null = Invoke-Packwiz -Arguments @("refresh") -WorkingDirectory $WorkRoot

    $targetPath = Join-Path (Join-Path $RepoRoot $Category) $targetMetadata[0].Name
    if (Test-Path -LiteralPath $targetPath) {
        if ($DryRun) {
            Write-Status "Dry run: metadata is valid, but $targetPath already exists and would not be replaced."
            return
        }
        throw "Refusing to replace existing metadata: $targetPath. Use update-packwiz-target.ps1 for existing CurseForge metadata."
    }

    if ($DryRun) {
        Write-Status "Dry run: would add $($targetMetadata[0].Name) with side = `"$Side`"."
        return
    }

    Write-Utf8NoBomFile -LiteralPath $targetPath -Content $content
    Write-Status "Added $Category/$($targetMetadata[0].Name) with side = `"$Side`"."
}
finally {
    if (Test-Path -LiteralPath $WorkRoot) {
        Remove-Item -LiteralPath $WorkRoot -Recurse -Force -ErrorAction SilentlyContinue
    }
}

if (-not $SkipSync) {
    Write-Status "Syncing local Packwiz assets..."
    & $SyncPackwizAssetsScript -Proxy $Proxy
    if ($LASTEXITCODE -ne 0) {
        throw "sync-packwiz-assets.ps1 exited with code $LASTEXITCODE."
    }
}
