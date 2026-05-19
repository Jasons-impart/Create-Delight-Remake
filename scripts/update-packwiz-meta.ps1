[CmdletBinding()]
param(
    [string[]]$Categories = @("mods", "resourcepacks", "shaderpacks"),
    [string]$PackwizUrl = "https://github.com/Jasons-impart/packwiz/releases/latest/download/packwiz.exe"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$RepoRoot = Split-Path -Parent $PSScriptRoot
$PackwizFilesRoot = Join-Path $RepoRoot "packwiz-files"
$PackwizFilesRawPrefix = "https://raw.githubusercontent.com/Jasons-impart/Create-Delight-Remake/main/packwiz-files/"
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

function Derive-DisplayName {
    param([string]$Filename)
    if (-not $Filename) { return "" }
    $name = [IO.Path]::GetFileNameWithoutExtension($Filename)
    $parts = $name -split '[-_]'
    $displayParts = @()
    foreach ($p in $parts) {
        if ($p -match '^v?\d') { break }
        if ($p -match '^(forge|fabric|neoforge|quilt|mc\d|release|alpha|beta|for|neo)$') { continue }
        $words = [regex]::Split($p, '(?<=[a-z])(?=[A-Z])|(?<=[A-Z])(?=[A-Z][a-z])')
        foreach ($w in $words) {
            if ($w.Length -gt 0 -and $w -notmatch '^(forge|fabric|neoforge|quilt|mc|release|alpha|beta|for|neo)$') {
                $displayParts += [Globalization.CultureInfo]::CurrentCulture.TextInfo.ToTitleCase($w.ToLower())
            }
        }
    }
    if (-not $displayParts) { return $name }
    return ($displayParts -join ' ')
}

function Get-DisplaySlug {
    param([string]$DisplayName)
    $slug = $DisplayName.ToLowerInvariant() -replace '[^a-z0-9\s-]', '' -replace '\s+', '-' -replace '-+', '-'
    return $slug.Trim('-')
}

function Write-Utf8NoBomFile {
    param([string]$Path, [string]$Content)
    $enc = [Text.UTF8Encoding]::new($false)
    [IO.File]::WriteAllText($Path, $Content, $enc)
}

function New-UrlToml {
    param([string]$OutPath, [string]$ModName, [string]$Filename, [string]$DownloadUrl)
    $c = @"
name = "$ModName"
filename = "$Filename"
side = "both"

[download]
url = "$DownloadUrl"
hash-format = "sha256"
hash = ""
"@
    Write-Utf8NoBomFile -Path $OutPath -Content $c
    Write-Status "  + Created: $(Split-Path $OutPath -Leaf)"
}

function ConvertTo-UrlToml {
    param([string]$PwTomlPath, [string]$ModName, [string]$NewFilename, [string]$NewUrl)
    $c = @"
name = "$ModName"
filename = "$NewFilename"
side = "both"

[download]
url = "$NewUrl"
hash-format = "sha256"
hash = ""
"@
    Write-Utf8NoBomFile -Path $PwTomlPath -Content $c
    Write-Status "  ~ Converted: $(Split-Path $PwTomlPath -Leaf) -> $NewFilename"
}

function Update-UrlToml {
    param([string]$PwTomlPath, [string]$OldFilename, [string]$NewFilename, [string]$NewUrl)
    $content = Get-Content $PwTomlPath -Raw
    $newContent = $content -replace [regex]::Escape("filename = `"$OldFilename`""), "filename = `"$NewFilename`""
    $newContent = $newContent -replace '(?m)^url\s*=\s*".*"$', "url = `"$NewUrl`""
    Write-Utf8NoBomFile -Path $PwTomlPath -Content $newContent
    Write-Status "  ~ Updated: $(Split-Path $PwTomlPath -Leaf) ($OldFilename -> $NewFilename)"
}

function Parse-PwToml {
    param([string]$Path)
    $content = Get-Content $Path -Raw
    $r = @{}
    if ($content -match '(?m)^name\s*=\s*"(.+)"')              { $r['Name'] = $Matches[1] }
    if ($content -match '(?m)^filename\s*=\s*"(.+)"')           { $r['Filename'] = $Matches[1] }
    if ($content -match '(?m)^\s*url\s*=\s*"(.+)"')             { $r['Url'] = $Matches[1] }
    if ($content -match 'mode\s*=\s*"metadata:(\w+)"')           { $r['Mode'] = $Matches[1] }
    $hasCfOrMr = ($content -match '\[update\.(curseforge|modrinth)\]')
    $r['IsUrlType'] = ($r.ContainsKey('Url') -and -not $r.ContainsKey('Mode') -and -not $hasCfOrMr)
    $r['IsManaged'] = ($r.ContainsKey('Mode') -or $hasCfOrMr)
    return $r
}

function Get-TomlVal {
    param([hashtable]$D, [string]$K)
    if ($D -and $D.ContainsKey($K)) { return $D[$K] } else { return $null }
}

try {
    Set-Location $RepoRoot
    Get-ToolEnsured -Url $PackwizUrl -Path $PackwizExe

    $createdCount = 0
    $updatedCount = 0
    $convertedCount = 0

    foreach ($category in $Categories) {
        $catDir  = Join-Path $RepoRoot $category
        $pfDir   = Join-Path $PackwizFilesRoot $category

        Write-Status "Scanning category: $category"

        $allJars = @{}
        if (Test-Path $catDir) {
            Get-ChildItem $catDir -File | Where-Object { $_.Extension -match '\.(jar|zip)$' } | ForEach-Object {
                $allJars[$_.Name] = $_.FullName
            }
        }
        if (Test-Path $pfDir) {
            Get-ChildItem $pfDir -File | Where-Object { $_.Extension -match '\.(jar|zip)$' } | ForEach-Object {
                if (-not $allJars.ContainsKey($_.Name)) {
                    $allJars[$_.Name] = $_.FullName
                }
            }
        }

        $pwTomls = @()
        if (Test-Path $catDir) {
            $pwTomls = @(Get-ChildItem $catDir -Filter *.pw.toml -File)
        }

        $pwData = @{}
        $fnameToPwPath = @{}
        foreach ($pt in $pwTomls) {
            $d = Parse-PwToml -Path $pt.FullName
            $pwData[$pt.FullName] = $d
            $fn = Get-TomlVal -D $d -K 'Filename'
            if ($fn) { $fnameToPwPath[$fn] = $pt.FullName }
        }

        $newJars = @{}
        foreach ($jarName in $allJars.Keys) {
            if (-not $fnameToPwPath.ContainsKey($jarName)) {
                $newJars[$jarName] = $allJars[$jarName]
            }
        }

        $orphaned = @()
        foreach ($pt in $pwTomls) {
            $d = $pwData[$pt.FullName]
            $fn = Get-TomlVal -D $d -K 'Filename'
            if ($fn -and -not $allJars.ContainsKey($fn)) {
                $orphaned += $pt
            }
        }

        $matched = @{}
        if ($orphaned.Count -gt 0 -and $newJars.Count -gt 0) {
            $orphanBases = @{}
            foreach ($orp in $orphaned) {
                $fn = Get-TomlVal -D $pwData[$orp.FullName] -K 'Filename'
                $base = Derive-BaseName -Filename $fn
                if ($base) { $orphanBases[$base] = $orp }
            }
            $jarBases = @{}
            foreach ($jname in $newJars.Keys) {
                $base = Derive-BaseName -Filename $jname
                if ($base) { $jarBases[$base] = $jname }
            }
            foreach ($base in $orphanBases.Keys) {
                if ($jarBases.ContainsKey($base)) {
                    $matched[$orphanBases[$base]] = $jarBases[$base]
                }
            }
        }

        $processedJars = @()
        foreach ($orpPath in $matched.Keys) {
            $newJarName = $matched[$orpPath]
            $newJarPath = $allJars[$newJarName]
            $oldData = $pwData[$orpPath]
            $oldFname = Get-TomlVal -D $oldData -K 'Filename'
            $modName  = Get-TomlVal -D $oldData -K 'Name'
            $isUrl    = Get-TomlVal -D $oldData -K 'IsUrlType'

            $pfDestDir = Join-Path $PackwizFilesRoot $category
            New-Item -ItemType Directory -Force -Path $pfDestDir | Out-Null
            $pfDestPath = Join-Path $pfDestDir $newJarName
            $rawUrl = "${PackwizFilesRawPrefix}${category}/$newJarName"

            if ($isUrl) {
                Copy-Item $newJarPath $pfDestPath -Force
                Update-UrlToml -PwTomlPath $orpPath -OldFilename $oldFname -NewFilename $newJarName -NewUrl $rawUrl
                $updatedCount++
            }
            else {
                Copy-Item $newJarPath $pfDestPath -Force
                ConvertTo-UrlToml -PwTomlPath $orpPath -ModName $modName -NewFilename $newJarName -NewUrl $rawUrl
                $convertedCount++
            }
            $processedJars += $newJarName
        }

        foreach ($jname in $newJars.Keys) {
            if ($processedJars -contains $jname) { continue }
            $jpath = $allJars[$jname]
            $displayName = Derive-DisplayName -Filename $jname
            $slug = Get-DisplaySlug -DisplayName $displayName

            $pfDestDir = Join-Path $PackwizFilesRoot $category
            New-Item -ItemType Directory -Force -Path $pfDestDir | Out-Null
            $pfDestPath = Join-Path $pfDestDir $jname
            if ($jpath -ne $pfDestPath) {
                Copy-Item $jpath $pfDestPath -Force
            }
            $rawUrl = "${PackwizFilesRawPrefix}${category}/$jname"

            $pwTomlPath = Join-Path $catDir "${slug}.pw.toml"
            if (Test-Path $pwTomlPath) {
                Write-Warn "  ! Skipping ${jname}: ${slug}.pw.toml already exists (name collision)"
                continue
            }
            New-UrlToml -OutPath $pwTomlPath -ModName $displayName -Filename $jname -DownloadUrl $rawUrl
            $createdCount++
        }
    }

    foreach ($category in $Categories) {
        $catDir = Join-Path $RepoRoot $category
        $pfDir  = Join-Path $PackwizFilesRoot $category
        if (-not (Test-Path $catDir)) { continue }
        $pts = @(Get-ChildItem $catDir -Filter *.pw.toml -File)
        foreach ($pt in $pts) {
            $d = Parse-PwToml -Path $pt.FullName
            $fn = Get-TomlVal -D $d -K 'Filename'
            if (-not $fn) { continue }
            $inCategory = Test-Path (Join-Path $catDir $fn)
            $inPf      = Test-Path (Join-Path $pfDir $fn)
            if (-not $inCategory -and -not $inPf) {
                Write-Warn "  ? Orphaned: $($pt.Name) references missing $fn"
            }
        }
    }

    $total = $createdCount + $updatedCount + $convertedCount
    if ($total -eq 0) {
        Write-Status "No changes detected. Nothing to refresh."
        exit 0
    }

    Write-Status "Created: $createdCount, Updated: $updatedCount, Converted: $convertedCount"
    Write-Status "Running packwiz refresh..."

    & $PackwizExe refresh
    if ($LASTEXITCODE -ne 0) {
        throw "packwiz refresh exited with code $LASTEXITCODE."
    }

    Write-Status "Done. Metadata updated and index refreshed."
}
finally {}
