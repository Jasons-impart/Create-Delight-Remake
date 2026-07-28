param(
    [string]$Root = "",
    [string]$DetailsPath = "",
    [switch]$Check
)

$ErrorActionPreference = "Stop"

if ([string]::IsNullOrWhiteSpace($Root)) {
    $Root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
}

if ([string]::IsNullOrWhiteSpace($DetailsPath)) {
    $DetailsPath = Join-Path $Root "docs/hotai-badiff-details.md"
}

function Get-RelativePath([string]$Path) {
    return $Path.Replace($Root, "").TrimStart("\", "/") -replace "\\", "/"
}

function Get-HotaiModule([string]$InternalName) {
    if ($InternalName -like "com/simibubi/create/*") { return "Create" }
    if ($InternalName -like "com/forsteri/createliquidfuel/*") { return "Create Liquid Fuel" }
    if ($InternalName -like "com/mrh0/createaddition/*") { return "Create Addition" }
    if ($InternalName -like "com/negodya1/vintageimprovements/*") { return "Vintage Improvements" }
    if ($InternalName -like "com/oierbravo/create_mechanical_spawner/*") { return "Create Mechanical Spawner" }
    if ($InternalName -like "com/tacz/guns/*") { return "TACZ" }
    if ($InternalName -like "com/teamabnormals/neapolitan/*") { return "Neapolitan" }
    if ($InternalName -like "dev/wuffs/bcc/*") { return "Better Compatibility Checker" }
    if ($InternalName -like "de/cadentem/quality_food/*") { return "Quality Food" }
    if ($InternalName -like "org/antarcticgardens/newage/*" -or $InternalName -like "org/antarcticgardens/cna/*") { return "Create New Age" }
    if ($InternalName -like "com/renyigesai/bakeries/*") { return "Bakeries" }
    return "Unknown"
}

function Get-GeneratedBlock([array]$Rows, [int]$FoundCount, [int]$MissingCount) {
    $lines = New-Object System.Collections.Generic.List[string]
    $lines.Add("<!-- HOTAI_STATUS:BEGIN -->") | Out-Null
    $lines.Add("> 本区块由 ``scripts/update-hotai-docs.ps1`` 生成。修改 ``hotai/**/*.badiff`` 后运行该脚本；人工解释写在区块外。") | Out-Null
    $lines.Add("") | Out-Null
    $lines.Add("当前扫描到 $($Rows.Count) 个 ``.badiff``；目标 class 命中 $FoundCount 个，未命中 $MissingCount 个。") | Out-Null
    $lines.Add("") | Out-Null
    $lines.Add("| 模组/领域 | 补丁文件 | 目标 class | 当前目标 class |") | Out-Null
    $lines.Add("|---|---|---|---|") | Out-Null
    foreach ($row in $Rows) {
        $status = if ($row.JarName) { "命中 ``$($row.JarName)``" } else { "未命中当前 JAR" }
        $lines.Add("| $($row.Module) | ``$($row.BadiffPath)`` | ``$($row.InternalName)`` | $status |") | Out-Null
    }
    $lines.Add("<!-- HOTAI_STATUS:END -->") | Out-Null
    return ($lines -join "`n")
}

$hotaiPath = Join-Path $Root "hotai"
if (-not (Test-Path -LiteralPath $hotaiPath)) {
    throw "HotAI directory not found: $hotaiPath"
}

if (-not (Test-Path -LiteralPath $DetailsPath)) {
    throw "HotAI details document not found: $DetailsPath"
}

Add-Type -AssemblyName System.IO.Compression.FileSystem

$badiffFiles = @(Get-ChildItem -LiteralPath $hotaiPath -Recurse -File -Filter "*.badiff" | Sort-Object FullName)
$rows = New-Object System.Collections.Generic.List[object]
$targetClasses = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::Ordinal)
$targetToRow = @{}

foreach ($file in $badiffFiles) {
    $relativePath = Get-RelativePath $file.FullName
    $internalName = $relativePath.Substring("hotai/".Length)
    $internalName = $internalName.Substring(0, $internalName.Length - ".badiff".Length)
    $targetClass = "$internalName.class"
    $row = [pscustomobject]@{
        Module = Get-HotaiModule $internalName
        BadiffPath = $relativePath
        InternalName = $internalName
        TargetClass = $targetClass
        JarName = ""
    }
    $rows.Add($row) | Out-Null
    $targetClasses.Add($targetClass) | Out-Null
    $targetToRow[$targetClass] = $row
}

$jarRoots = @(
    Join-Path $Root "mods"
    Join-Path $Root "packwiz-files/mods"
)

$jarFiles = @()
foreach ($jarRoot in $jarRoots) {
    if (Test-Path -LiteralPath $jarRoot) {
        $jarFiles += @(Get-ChildItem -LiteralPath $jarRoot -File -Filter "*.jar" | Sort-Object FullName)
    }
}

foreach ($jar in $jarFiles) {
    $zip = $null
    try {
        $zip = [System.IO.Compression.ZipFile]::OpenRead($jar.FullName)
        foreach ($entry in $zip.Entries) {
            if ($targetClasses.Contains($entry.FullName)) {
                $row = $targetToRow[$entry.FullName]
                if ([string]::IsNullOrWhiteSpace($row.JarName)) {
                    $row.JarName = $jar.Name
                }
            }
        }
    } catch {
        Write-Warning "Cannot scan jar '$($jar.FullName)': $($_.Exception.Message)"
    } finally {
        if ($zip) {
            $zip.Dispose()
        }
    }
}

$foundCount = @($rows | Where-Object { -not [string]::IsNullOrWhiteSpace($_.JarName) }).Count
$missingCount = $rows.Count - $foundCount
$generatedBlock = Get-GeneratedBlock -Rows $rows -FoundCount $foundCount -MissingCount $missingCount

$detailsText = Get-Content -Raw -LiteralPath $DetailsPath -Encoding UTF8
$begin = "<!-- HOTAI_STATUS:BEGIN -->"
$end = "<!-- HOTAI_STATUS:END -->"

if ($detailsText.Contains($begin) -and $detailsText.Contains($end)) {
    $pattern = "(?s)<!-- HOTAI_STATUS:BEGIN -->.*?<!-- HOTAI_STATUS:END -->"
    $updatedText = [regex]::Replace($detailsText, $pattern, [System.Text.RegularExpressions.MatchEvaluator]{ param($m) $generatedBlock }, 1)
} else {
    $heading = "## 代码化改动索引"
    if (-not $detailsText.Contains($heading)) {
        throw "Cannot find insertion point '$heading' in $DetailsPath"
    }
    $updatedText = $detailsText.Replace($heading, "$generatedBlock`n`n$heading")
}

if ($Check) {
    if ($updatedText -ne $detailsText) {
        throw "HotAI generated documentation is out of date. Run scripts/update-hotai-docs.ps1."
    }
    Write-Host "HotAI generated documentation is up to date." -ForegroundColor Green
    return
}

$utf8NoBom = [System.Text.UTF8Encoding]::new($false)
[System.IO.File]::WriteAllText($DetailsPath, $updatedText, $utf8NoBom)
Write-Host "Updated HotAI generated documentation in $(Get-RelativePath $DetailsPath)"
