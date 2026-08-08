param(
    [string]$Root = "",
    [string]$DetailsPath = "",
    [switch]$Check,
    [switch]$StrictRuntimeStatus
)

$ErrorActionPreference = "Stop"

if ([string]::IsNullOrWhiteSpace($Root)) {
    $Root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
}

if ([string]::IsNullOrWhiteSpace($DetailsPath)) {
    $DetailsPath = Join-Path $Root "docs/dev-knowledge/hotai/badiff-details.md"
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
    if ($InternalName -like "com/mafuyu404/taczaddon/*") { return "TACZ-addon" }
    if ($InternalName -like "com/teamabnormals/neapolitan/*") { return "Neapolitan" }
    if ($InternalName -like "com/iafdragonfix/*") { return "IAF Dragon Fix" }
    if ($InternalName -like "dev/wuffs/bcc/*") { return "Better Compatibility Checker" }
    if ($InternalName -like "de/cadentem/quality_food/*") { return "Quality Food" }
    if ($InternalName -like "org/antarcticgardens/newage/*" -or $InternalName -like "org/antarcticgardens/cna/*") { return "Create New Age" }
    if ($InternalName -like "com/renyigesai/bakeries/*") { return "Bakeries" }
    return "Unknown"
}

function Get-GeneratedBlock([array]$Rows, [int]$StaticFoundCount, [int]$RuntimeCreatedCount, [int]$UnverifiedCount) {
    $lines = New-Object System.Collections.Generic.List[string]
    $lines.Add("<!-- HOTAI_STATUS:BEGIN -->") | Out-Null
    $lines.Add("> 本区块由 ``scripts/update-hotai-docs.ps1`` 生成。修改 ``hotai/**/*.badiff`` 后运行该脚本；人工解释写在区块外。") | Out-Null
    $lines.Add("") | Out-Null
    $lines.Add("当前扫描到 $($Rows.Count) 个 ``.badiff``；静态 JAR 命中 $StaticFoundCount 个，静态未命中但已由当前启动日志确认动态创建 $RuntimeCreatedCount 个，尚未由当前启动日志确认 $UnverifiedCount 个。") | Out-Null
    $lines.Add("") | Out-Null
    $lines.Add("| 模组/领域 | 补丁文件 | 目标 class | 静态 JAR / 运行时状态 |") | Out-Null
    $lines.Add("|---|---|---|---|") | Out-Null
    foreach ($row in $Rows) {
        $status = if ($row.JarName) {
            "静态命中 ``$($row.JarName)``"
        } elseif ($row.RuntimePatched) {
            "运行时已确认动态创建（静态 JAR 无此 class）"
        } else {
            "静态 JAR 无此 class；当前启动日志未确认（可能按需加载）"
        }
        $lines.Add("| $($row.Module) | ``$($row.BadiffPath)`` | ``$($row.InternalName)`` | $status |") | Out-Null
    }
    $lines.Add("<!-- HOTAI_STATUS:END -->") | Out-Null
    return ($lines -join "`n")
}

$hotaiPath = Join-Path $Root "hotai"
if (-not (Test-Path -LiteralPath $hotaiPath)) {
    throw "hotai directory not found: $hotaiPath"
}

if (-not (Test-Path -LiteralPath $DetailsPath)) {
    throw "hotai details document not found: $DetailsPath"
}

Add-Type -AssemblyName System.IO.Compression.FileSystem

$badiffFiles = @(Get-ChildItem -LiteralPath $hotaiPath -Recurse -File -Filter "*.badiff" | Sort-Object FullName)
$rows = New-Object System.Collections.Generic.List[object]
$targetClasses = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::Ordinal)
$targetToRow = @{}
$internalNameToRow = @{}

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
        RuntimePatched = $false
    }
    $rows.Add($row) | Out-Null
    $targetClasses.Add($targetClass) | Out-Null
    $targetToRow[$targetClass] = $row
    $internalNameToRow[$internalName] = $row
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

$latestLogPath = Join-Path $Root "logs/latest.log"
if (Test-Path -LiteralPath $latestLogPath) {
    $latestLogText = Get-Content -LiteralPath $latestLogPath -Raw
    foreach ($match in [regex]::Matches($latestLogText, "(?m)Patched class:\s+([^\r\n]+)")) {
        $internalName = $match.Groups[1].Value.Trim()
        if ($internalNameToRow.ContainsKey($internalName)) {
            $internalNameToRow[$internalName].RuntimePatched = $true
        }
    }
}

$staticFoundCount = @($rows | Where-Object { -not [string]::IsNullOrWhiteSpace($_.JarName) }).Count
$runtimeCreatedCount = @($rows | Where-Object { -not $_.JarName -and $_.RuntimePatched }).Count
$unverifiedCount = @($rows | Where-Object { -not $_.JarName -and -not $_.RuntimePatched }).Count
$generatedBlock = Get-GeneratedBlock -Rows $rows -StaticFoundCount $staticFoundCount -RuntimeCreatedCount $runtimeCreatedCount -UnverifiedCount $unverifiedCount

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
    if ($StrictRuntimeStatus) {
        if ($updatedText -ne $detailsText) {
            throw "hotai runtime status is out of date for the current local JARs and logs. Run scripts/update-hotai-docs.ps1 from the reference runtime."
        }
        Write-Host "hotai patch map and current runtime status are up to date." -ForegroundColor Green
        return
    }

    $statusBlockMatch = [regex]::Match($detailsText, "(?s)<!-- HOTAI_STATUS:BEGIN -->.*?<!-- HOTAI_STATUS:END -->")
    if (-not $statusBlockMatch.Success) {
        throw "hotai status block is missing from $DetailsPath. Run scripts/update-hotai-docs.ps1."
    }

    $documentedTargets = @(
        [regex]::Matches($statusBlockMatch.Value, '(?m)^\|\s*[^|]+\|\s*`([^`]+\.badiff)`\s*\|\s*`([^`]+)`\s*\|') |
            ForEach-Object { "$($_.Groups[1].Value)|$($_.Groups[2].Value)" } |
            Sort-Object
    )
    $expectedTargets = @(
        $rows |
            ForEach-Object { "$($_.BadiffPath)|$($_.InternalName)" } |
            Sort-Object
    )
    $targetDiff = Compare-Object -ReferenceObject $expectedTargets -DifferenceObject $documentedTargets
    if ($targetDiff) {
        $diffText = ($targetDiff | ForEach-Object { $_.InputObject }) -join ", "
        throw "hotai patch map is out of date: $diffText. Run scripts/update-hotai-docs.ps1."
    }

    Write-Host "hotai patch map is up to date; local runtime status was not compared." -ForegroundColor Green
    return
}

$utf8NoBom = [System.Text.UTF8Encoding]::new($false)
[System.IO.File]::WriteAllText($DetailsPath, $updatedText, $utf8NoBom)
Write-Host "Updated hotai generated documentation in $(Get-RelativePath $DetailsPath)"
