param(
    [string]$Root = "",
    [switch]$StrictWarnings
)

$ErrorActionPreference = "Stop"

if ([string]::IsNullOrWhiteSpace($Root)) {
    $Root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
}

$failures = New-Object System.Collections.Generic.List[string]
$warnings = New-Object System.Collections.Generic.List[string]

function Add-Failure([string]$Message) {
    $script:failures.Add($Message) | Out-Null
}

function Add-Warning([string]$Message) {
    $script:warnings.Add($Message) | Out-Null
}

function Get-RelPath([string]$Path) {
    return $Path.Replace($Root, "").TrimStart("\", "/")
}

function Test-ProjectPath([string]$RelativePath) {
    return Test-Path -LiteralPath (Join-Path $Root $RelativePath)
}

function Get-LineCount([string]$Path) {
    if (-not (Test-Path -LiteralPath $Path)) {
        return 0
    }
    return (Get-Content -LiteralPath $Path).Count
}

function Get-FileText([string]$RelativePath) {
    $path = Join-Path $Root $RelativePath
    if (-not (Test-Path -LiteralPath $path)) {
        return ""
    }
    return Get-Content -Raw -LiteralPath $path
}

$knowledgeFiles = @(
    @{ Path = "AGENTS.md"; MaxLines = 150; Required = $true },
    @{ Path = "kubejs/AGENTS.md"; MaxLines = 80; Required = $true },
    @{ Path = "CDC-mod-src/AGENTS.md"; MaxLines = 80; Required = $true }
)

foreach ($file in $knowledgeFiles) {
    $path = Join-Path $Root $file.Path
    if (-not (Test-Path -LiteralPath $path)) {
        if ($file.Required) {
            Add-Failure "Missing knowledge file: $($file.Path)"
        }
        continue
    }

    $lineCount = Get-LineCount $path
    if ($lineCount -gt $file.MaxLines) {
        Add-Failure "$($file.Path) has $lineCount lines; limit is $($file.MaxLines)."
    }
}

$requiredPaths = @(
    "AGENTS.md",
    "kubejs/AGENTS.md",
    "CDC-mod-src/AGENTS.md",
    "lessons-learned.md",
    ".agents/skills/knowledge-check/SKILL.md",
    ".github/workflows/release.yml",
    "scripts/sync-packwiz-assets.ps1",
    "scripts/update-packwiz-meta.ps1",
    "kubejs/data/oei/replacements",
    "pack.toml"
)

foreach ($relativePath in $requiredPaths) {
    if (-not (Test-ProjectPath $relativePath)) {
        Add-Failure "Documented path does not exist: $relativePath"
    }
}

$allAgentsText = ($knowledgeFiles | ForEach-Object { Get-FileText $_.Path }) -join "`n"
$duplicateChecks = @(
    @{
        Name = "pack.toml version source";
        Pattern = 'pack\.toml.*ONLY version source|Version ONLY in `pack\.toml`';
        Max = 2
    },
    @{
        Name = "release workflow guidance";
        Pattern = "/release|release workflow";
        Max = 3
    },
    @{
        Name = "lessons-learned routing";
        Pattern = "lessons-learned\.md";
        Max = 5
    }
)

foreach ($check in $duplicateChecks) {
    $matches = [regex]::Matches($allAgentsText, $check.Pattern, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
    if ($matches.Count -gt $check.Max) {
        Add-Warning "Possible duplicated knowledge: $($check.Name) appears $($matches.Count) times; expected <= $($check.Max)."
    }
}

$antiPatterns = @(
    @{ Pattern = "e\.remove\(\) or e\.removeById\(\).*e\.remove\(\) or e\.removeById\(\)"; Message = "Recipe removal anti-pattern appears duplicated." },
    @{ Pattern = "PowerShell.*反引号.*AGENTS\.md"; Message = "Long historical lesson appears to be in AGENTS.md; move history to lessons-learned.md." }
)

foreach ($antiPattern in $antiPatterns) {
    if ($allAgentsText -match $antiPattern.Pattern) {
        Add-Warning $antiPattern.Message
    }
}

$lessonsPath = Join-Path $Root "lessons-learned.md"
if (Test-Path -LiteralPath $lessonsPath) {
    $lessonsText = Get-Content -Raw -LiteralPath $lessonsPath
    $sections = [regex]::Split($lessonsText, "(?m)^##\s+").Where({ $_.Trim().Length -gt 0 })
    foreach ($section in $sections) {
        $firstLine = ($section -split "`r?`n", 2)[0].Trim()
        if ($firstLine -eq "# Lessons Learned") {
            continue
        }
        if ($section -notmatch "\d{4}-\d{2}-\d{2}") {
            Add-Warning "Lesson '$firstLine' has no YYYY-MM-DD date."
        }
        if ($section -notmatch "(?i)(Problem|Fix|Lesson|场景|根因|正确做法|规则)") {
            Add-Warning "Lesson '$firstLine' may lack problem/fix structure."
        }
    }
}

if ($warnings.Count -gt 0) {
    Write-Host "Knowledge base validation warnings:" -ForegroundColor Yellow
    foreach ($warning in $warnings) {
        Write-Host "WARN: $warning" -ForegroundColor Yellow
    }
}

if ($failures.Count -gt 0) {
    Write-Host "Knowledge base validation failed:" -ForegroundColor Red
    foreach ($failure in $failures) {
        Write-Host "FAIL: $failure" -ForegroundColor Red
    }
    exit 1
}

if ($StrictWarnings -and $warnings.Count -gt 0) {
    Write-Host "Knowledge base validation failed because -StrictWarnings was set." -ForegroundColor Red
    exit 1
}

Write-Host "Knowledge base validation passed." -ForegroundColor Green
exit 0
