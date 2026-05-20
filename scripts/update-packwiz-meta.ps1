[CmdletBinding()]
param(
    [string]$Category = "mods",
    [string]$PackwizUrl = "https://github.com/Jasons-impart/packwiz/releases/latest/download/packwiz.exe"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$RepoRoot = Split-Path -Parent $PSScriptRoot
$ToolsRoot = Join-Path $RepoRoot ".cache\packwiz-sync\tools"
$PackwizExe = Join-Path $ToolsRoot "packwiz.exe"

function Write-Status { param([string]$M) Write-Host "[meta] $M" -ForegroundColor Cyan }
function Write-Warn   { param([string]$M) Write-Host "[warn] $M" -ForegroundColor Yellow }

function Get-ToolEnsured {
    param([string]$Url, [string]$Path)

    if (Test-Path $Path) { return }

    New-Item -ItemType Directory -Force -Path (Split-Path $Path -Parent) | Out-Null
    Write-Status ("Downloading {0}..." -f (Split-Path $Path -Leaf))
    Invoke-WebRequest -Uri $Url -OutFile $Path -UseBasicParsing
}

function Get-AssetFiles {
    param([string]$Directory)

    $files = @{}
    if (-not (Test-Path $Directory)) { return $files }

    Get-ChildItem -LiteralPath $Directory -File |
        Where-Object { $_.Extension -match '^\.(jar|zip)$' } |
        ForEach-Object {
            $files[$_.Name] = $_.FullName
        }

    return $files
}

function Derive-BaseName {
    param([string]$Filename)

    if (-not $Filename) { return "" }

    $name = [IO.Path]::GetFileNameWithoutExtension($Filename)
    $parts = $name -split '[-_]'
    $baseParts = @()

    foreach ($p in $parts) {
        if ($p -match '^v?\d') { break }
        if ($p -match '^(forge|fabric|neoforge|quilt|mc\d|release|alpha|beta|for|neo)$') { continue }
        $baseParts += $p
    }

    if (-not $baseParts) { return $name.ToLowerInvariant() }
    return ($baseParts -join '_').ToLowerInvariant()
}

function Get-NaturalSortKey {
    param([string]$Value)

    if (-not $Value) { return "" }

    return [regex]::Replace($Value.ToLowerInvariant(), '\d+', {
        param($Match)
        $Match.Value.PadLeft(20, '0')
    })
}

function Get-PreferredFilename {
    param([string[]]$Filenames)

    $candidates = @($Filenames | Where-Object { -not [string]::IsNullOrWhiteSpace($_) } | Select-Object -Unique)
    if ($candidates.Count -eq 0) { return $null }

    $sortedCandidates = @($candidates | Sort-Object { Get-NaturalSortKey -Value $_ })
    return $sortedCandidates[-1]
}

function Write-Utf8NoBomFile {
    param([string]$Path, [string]$Content)

    $enc = [Text.UTF8Encoding]::new($false)
    [IO.File]::WriteAllText($Path, $Content, $enc)
}

function Parse-PwToml {
    param([string]$Path)

    $content = Get-Content -LiteralPath $Path -Raw
    $result = @{}

    if ($content -match '(?m)^name\s*=\s*"(.+)"')      { $result['Name'] = $Matches[1] }
    if ($content -match '(?m)^filename\s*=\s*"(.+)"')  { $result['Filename'] = $Matches[1] }

    $hasMetadataMode = $content -match 'mode\s*=\s*"metadata:(curseforge|modrinth)"'
    $hasUpdateBlock = $content -match '\[update\.(curseforge|modrinth)\]'
    $result['IsManaged'] = ($hasMetadataMode -or $hasUpdateBlock)

    return $result
}

function Get-TomlVal {
    param([hashtable]$Data, [string]$Key)

    if ($Data -and $Data.ContainsKey($Key)) { return $Data[$Key] }
    return $null
}

function Invoke-PackwizCommand {
    param([string[]]$Arguments)

    Push-Location $RepoRoot
    try {
        & $PackwizExe @Arguments 2>&1 | Out-Null
        return $LASTEXITCODE
    }
    finally {
        Pop-Location
    }
}

try {
    if ($Category -ne "mods") {
        throw "This script currently only supports the 'mods' category."
    }

    Get-ToolEnsured -Url $PackwizUrl -Path $PackwizExe

    $modsDir = Join-Path $RepoRoot $Category
    if (-not (Test-Path $modsDir)) {
        Write-Status "No '$Category' directory found."
        exit 0
    }

    Write-Status "Scanning category: $Category"

    $sourceFiles = Get-AssetFiles -Directory $modsDir
    $pwTomls = @(Get-ChildItem -LiteralPath $modsDir -Filter *.pw.toml -File)

    $pwData = @{}
    $newFilesByBase = @{}
    foreach ($sourceName in $sourceFiles.Keys) {
        $base = Derive-BaseName -Filename $sourceName
        if (-not $base) { continue }
        if (-not $newFilesByBase.ContainsKey($base)) {
            $newFilesByBase[$base] = @()
        }
        $newFilesByBase[$base] += $sourceName
    }

    $updates = @()
    foreach ($pwToml in $pwTomls) {
        $data = Parse-PwToml -Path $pwToml.FullName
        $pwData[$pwToml.FullName] = $data

        if (-not (Get-TomlVal -Data $data -Key 'IsManaged')) { continue }

        $currentFilename = Get-TomlVal -Data $data -Key 'Filename'
        if (-not $currentFilename) { continue }
        if ($sourceFiles.ContainsKey($currentFilename)) { continue }

        $base = Derive-BaseName -Filename $currentFilename
        if (-not $base) { continue }
        if (-not $newFilesByBase.ContainsKey($base)) { continue }

        $newFilename = Get-PreferredFilename -Filenames $newFilesByBase[$base]
        if (-not $newFilename) { continue }

        $updates += [pscustomobject]@{
            PwTomlPath = $pwToml.FullName
            Slug = [IO.Path]::GetFileNameWithoutExtension($pwToml.Name) -replace '\.pw$'
            OldFilename = $currentFilename
            NewFilename = $newFilename
        }
    }

    if ($updates.Count -eq 0) {
        Write-Status "No CurseForge metadata changes detected."
        exit 0
    }

    $updatedCount = 0
    foreach ($update in $updates) {
        $originalContent = Get-Content -LiteralPath $update.PwTomlPath -Raw

        Write-Status "  ~ packwiz update: $($update.Slug)"
        $exitCode = Invoke-PackwizCommand -Arguments @("update", $update.Slug, "--yes")
        if ($exitCode -ne 0) {
            Write-Utf8NoBomFile -Path $update.PwTomlPath -Content $originalContent
            Write-Warn "  ! packwiz update failed for $($update.Slug)"
            continue
        }

        $updatedData = Parse-PwToml -Path $update.PwTomlPath
        $updatedFilename = Get-TomlVal -Data $updatedData -Key 'Filename'
        if ($updatedFilename -ne $update.NewFilename) {
            Write-Utf8NoBomFile -Path $update.PwTomlPath -Content $originalContent
            Write-Warn "  ! packwiz update for $($update.Slug) resolved to '$updatedFilename', expected '$($update.NewFilename)'"
            continue
        }

        Write-Status "  ~ Updated (CurseForge): $($updatedData['Name'])"
        $updatedCount++
    }

    if ($updatedCount -eq 0) {
        Write-Status "No CurseForge metadata changes detected."
        exit 0
    }

    Write-Status "Updated: $updatedCount"
    Write-Status "Running packwiz refresh..."

    $refreshExitCode = Invoke-PackwizCommand -Arguments @("refresh")
    if ($refreshExitCode -ne 0) {
        throw "packwiz refresh exited with code $refreshExitCode."
    }

    Write-Status "Done. Mod pw.toml files refreshed from CurseForge metadata."
}
finally {}
