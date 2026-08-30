[CmdletBinding()]
param(
    [string]$PackwizFilesRawPrefix = $env:PACKWIZ_FILES_RAW_PREFIX,
    [switch]$SkipPackaging
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

$RepoRoot = Split-Path -Parent $PSScriptRoot
$TaczRoot = Join-Path $RepoRoot "tacz"
$PayloadRoot = Join-Path $RepoRoot "packwiz-files\tacz"

function Write-Utf8NoBomFile {
    param(
        [string]$Path,
        [string]$Content
    )

    $encoding = [System.Text.UTF8Encoding]::new($false)
    [System.IO.File]::WriteAllText($Path, $Content, $encoding)
}

function Get-RawPrefix {
    if (-not [string]::IsNullOrWhiteSpace($PackwizFilesRawPrefix)) {
        return $PackwizFilesRawPrefix.TrimEnd('/') + '/'
    }

    $branch = (& git -C $RepoRoot branch --show-current 2>$null).Trim()
    if ([string]::IsNullOrWhiteSpace($branch) -or $branch -ne "main") {
        $branch = "main"
    }
    $escapedBranch = [Uri]::EscapeDataString($branch).Replace('%2F', '/')
    return "https://raw.githubusercontent.com/Jasons-impart/Create-Delight-Remake/$escapedBranch/packwiz-files/"
}

function Get-UrlPath([string]$Value) {
    return [Uri]::EscapeDataString($Value).Replace('%2F', '/')
}

function Write-PackMetadata {
    param(
        [System.IO.DirectoryInfo]$PackDirectory,
        [System.IO.FileInfo]$Payload
    )

    $hash = (Get-FileHash -LiteralPath $Payload.FullName -Algorithm SHA256).Hash.ToLowerInvariant()
    $filename = $Payload.Name
    $url = (Get-RawPrefix) + "tacz/" + (Get-UrlPath $filename)
    $metadataPath = Join-Path $TaczRoot ($PackDirectory.Name + ".pw.toml")
    $content = @"
name = "$($PackDirectory.Name.Replace('\', '\\').Replace('"', '\"'))"
filename = "$($filename.Replace('\', '\\').Replace('"', '\"'))"
side = "both"

[download]
url = "$url"
hash-format = "sha256"
hash = "$hash"
"@
    Write-Utf8NoBomFile -Path $metadataPath -Content $content.TrimStart()
}

if (-not (Test-Path -LiteralPath $TaczRoot -PathType Container)) {
    throw "TACZ root does not exist: $TaczRoot"
}
New-Item -ItemType Directory -Force -Path $PayloadRoot | Out-Null

$packDirectories = @(Get-ChildItem -LiteralPath $TaczRoot -Directory | Where-Object { $_.Name -notlike '.cache*' })
if ($packDirectories.Count -eq 0) {
    $metadataFiles = @(Get-ChildItem -LiteralPath $TaczRoot -Filter '*.pw.toml' -File)
    if ($metadataFiles.Count -eq 0) {
        throw "No TACZ gun-pack directories or metadata files found under $TaczRoot."
    }
    Write-Host "TACZ directories are already converted; keeping existing payloads and metadata."
    exit 0
}

foreach ($packDirectory in $packDirectories) {
    $payloadPath = Join-Path $PayloadRoot ($packDirectory.Name + '.zip')
    if (-not $SkipPackaging) {
        $temporaryPath = $payloadPath + '.tmp'
        Remove-Item -LiteralPath $temporaryPath -Force -ErrorAction SilentlyContinue
        Compress-Archive -Path (Join-Path $packDirectory.FullName '*') -DestinationPath $temporaryPath -CompressionLevel Optimal
        Move-Item -LiteralPath $temporaryPath -Destination $payloadPath -Force
    }
    if (-not (Test-Path -LiteralPath $payloadPath -PathType Leaf)) {
        throw "Missing TACZ payload after packaging: $payloadPath"
    }
    Write-PackMetadata -PackDirectory $packDirectory -Payload (Get-Item -LiteralPath $payloadPath)
    Write-Host "Generated TACZ Packwiz metadata: $($packDirectory.Name)"
}
