param(
    [string]$Root = "",
    [string]$OutputPath = "",
    [string]$StatePath = "",
    [string]$NotesPath = "",
    [string]$DecisionPath = "",
    [int]$RecentCommits = 1
)

$ErrorActionPreference = "Stop"

if ([string]::IsNullOrWhiteSpace($Root)) {
    $Root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
}

if ([string]::IsNullOrWhiteSpace($OutputPath)) {
    $OutputPath = Join-Path $Root "tmp-opencode/knowledge-candidate-report.md"
}

if ([string]::IsNullOrWhiteSpace($StatePath)) {
    $StatePath = Join-Path $Root "tmp-opencode/knowledge-candidate-state.json"
}

if ([string]::IsNullOrWhiteSpace($NotesPath)) {
    $NotesPath = Join-Path $Root "tmp-opencode/knowledge-notes.md"
}

if ([string]::IsNullOrWhiteSpace($DecisionPath)) {
    $DecisionPath = Join-Path $Root "tmp-opencode/knowledge-candidate-decision.json"
}

function Invoke-Git([string[]]$GitArgs) {
    $output = & git -C $Root @GitArgs 2>$null
    if ($LASTEXITCODE -ne 0) {
        return @()
    }
    return @($output)
}

function Add-Unique([System.Collections.Generic.List[string]]$List, [string]$Value) {
    if (-not [string]::IsNullOrWhiteSpace($Value) -and -not $List.Contains($Value)) {
        $List.Add($Value) | Out-Null
    }
}

function Get-SubmoduleChangedFiles([string]$RelativePath) {
    $submoduleRoot = Join-Path $Root $RelativePath
    if (-not (Test-Path -LiteralPath $submoduleRoot)) {
        return @()
    }

    $results = New-Object System.Collections.Generic.List[string]
    $gitArgumentSets = @(
        @("diff", "--name-only"),
        @("diff", "--cached", "--name-only"),
        @("ls-files", "--others", "--exclude-standard")
    )
    foreach ($gitArgumentSet in $gitArgumentSets) {
        $output = & git -C $submoduleRoot @gitArgumentSet 2>$null
        if ($LASTEXITCODE -ne 0) {
            continue
        }
        foreach ($file in @($output)) {
            if (-not [string]::IsNullOrWhiteSpace($file)) {
                Add-Unique $results ("$RelativePath/" + ($file -replace "\\", "/"))
            }
        }
    }
    return $results.ToArray()
}

function Test-ModpackBehaviorChangePath([string]$Path) {
    $normalized = $Path -replace "\\", "/"
    return $normalized -match '^kubejs/(server_scripts|startup_scripts|client_scripts|config|assets|data)/' -or
        $normalized -match '^(config|defaultconfigs|hotai)/' -or
        $normalized -eq 'CDC-mod-src' -or
        $normalized -match '^CDC-mod-src/src/(main|generated)/'
}

function ConvertTo-Target([string]$Path) {
    $normalized = $Path -replace "\\", "/"
    if ($normalized -eq "AGENTS.md") { return "AGENTS.md" }
    if ($normalized -eq "docs/lessons-learned.md") { return "docs/lessons-learned.md" }
    if ($normalized -like ".agents/skills/*") {
        $parts = $normalized -split "/"
        if ($parts.Count -ge 3 -and -not [string]::IsNullOrWhiteSpace($parts[2])) {
            return ".agents/skills/$($parts[2])/SKILL.md"
        }
    }
    if ($normalized -eq "GettingStarted.md") { return "GettingStarted.md" }
    if ($normalized -like "hotai/*" -or $normalized -eq "scripts/update-hotai-docs.ps1" -or $normalized -eq "docs/hotai-badiff-details.md") { return "docs/dev-knowledge/hotai/badiff-details.md" }
    if ($normalized -eq "docs/hotai-patch-map.md") { return "docs/dev-knowledge/hotai/patch-map.md" }
    if ($normalized -like "docs/hotai/*") {
        $legacyPath = $normalized.Substring("docs/hotai/".Length)
        return "docs/dev-knowledge/hotai/$legacyPath"
    }
    if ($normalized -like "docs/dev-knowledge/*") { return $normalized }
    if ($normalized -eq "docs/development.md") { return "docs/dev-knowledge/how-to-index.md" }
    if ($normalized -like "docs/*design*.md" -or $normalized -like "docs/*plan.md" -or $normalized -like "docs/*strategy.md") { return "docs/dev-knowledge/content-map.md" }
    if ($normalized -eq ".codex/hooks.json" -or $normalized -like "scripts/*knowledge*" -or $normalized -like "scripts/add-knowledge-note.ps1" -or $normalized -like "scripts/resolve-knowledge-candidate.ps1") { return ".agents/skills/knowledge-check/SKILL.md" }
    if ($normalized -like "scripts/sync-packwiz-assets.ps1" -or $normalized -like "scripts/add-packwiz-target.ps1" -or $normalized -like "scripts/update-packwiz-meta.ps1" -or $normalized -like "scripts/update-packwiz-target.ps1" -or $normalized -like "scripts/test-packwiz-files-ref.ps1" -or $normalized -like "mods/*" -or $normalized -like "resourcepacks/*" -or $normalized -like "shaderpacks/*" -or $normalized -like "tacz/*" -or $normalized -like "packwiz-files/*") { return ".agents/skills/packwiz-assets/SKILL.md" }
    if ($normalized -eq "modpack.toml") { return "AGENTS.md" }
    if ($normalized -like ".github/workflows/release*" -or $normalized -like ".agents/skills/release/*") { return ".agents/skills/release/SKILL.md" }
    if ($normalized -like ".github/*" -or $normalized -like "scripts/*") { return "AGENTS.md" }
    return ""
}

function ConvertTo-Reason([string]$Path) {
    $normalized = $Path -replace "\\", "/"
    if ($normalized -like ".agents/skills/*") { return "Skill instructions changed; verify trigger wording, workflow scope, and AGENTS duplication." }
    if ($normalized -eq "GettingStarted.md") { return "Pre-clone development setup entry changed; keep it self-contained because project skills are unavailable before clone." }
    if ($normalized -like "hotai/*") { return "hotai patch set changed; run scripts/update-hotai-docs.ps1 and update the manual badiff explanation if behavior changed." }
    if ($normalized -like "docs/dev-knowledge/hotai/*" -or $normalized -like "docs/hotai/*" -or $normalized -like "docs/hotai-*.md") { return "hotai development knowledge changed; keep generated status, manual semantics, and domain summary in their assigned files." }
    if ($normalized -like "docs/dev-knowledge/*") { return "Development knowledge index changed; verify entries stay short and point to source files." }
    if ($normalized -eq "scripts/update-hotai-docs.ps1") { return "hotai documentation automation changed; verify validation still checks generated status." }
    if ($normalized -eq "docs/development.md") { return "Development guide changed; check whether a compact how-to entry should be indexed." }
    if ($normalized -like "docs/*design*.md" -or $normalized -like "docs/*plan.md" -or $normalized -like "docs/*strategy.md") { return "Design or plan doc changed; update content-map only if implemented behavior or code locations changed." }
    if (Test-ModpackBehaviorChangePath $normalized) { return "Modpack behavior may be a feature or a bugfix/compat change; classify by intended player result, not by file path." }
    if ($normalized -eq ".codex/hooks.json" -or $normalized -like "scripts/*knowledge*" -or $normalized -like "scripts/add-knowledge-note.ps1" -or $normalized -like "scripts/resolve-knowledge-candidate.ps1") { return "Knowledge maintenance automation changed; update knowledge-check skill if the prompt or routing changed." }
    if ($normalized -like "scripts/sync-packwiz-assets.ps1" -or $normalized -like "scripts/add-packwiz-target.ps1" -or $normalized -like "scripts/update-packwiz-meta.ps1" -or $normalized -like "scripts/update-packwiz-target.ps1" -or $normalized -like "scripts/test-packwiz-files-ref.ps1") { return "Packwiz asset automation changed; update packwiz-assets skill if the workflow changed." }
    if ($normalized -like "scripts/*") { return "Project automation changed; decide whether this is an always-on AGENTS pointer or a task-specific skill workflow." }
    if ($normalized -like ".github/*") { return "CI/release workflow changed; root knowledge may need an update." }
    if ($normalized -like "mods/*" -or $normalized -like "resourcepacks/*" -or $normalized -like "shaderpacks/*" -or $normalized -like "tacz/*" -or $normalized -like "packwiz-files/*") { return "Packwiz asset metadata changed; record only reusable workflow changes in packwiz-assets skill." }
    if ($normalized -eq "modpack.toml") { return "Modpack metadata changed; check version rules." }
    if ($normalized -like "*AGENTS.md" -or $normalized -eq "docs/lessons-learned.md") { return "Knowledge base changed; run validation and check for duplicate facts." }
    return "Changed file may encode a reusable project pattern."
}

$dirtyFiles = Invoke-Git -GitArgs @("diff", "--name-only")
$stagedFiles = Invoke-Git -GitArgs @("diff", "--cached", "--name-only")
$untrackedFiles = Invoke-Git -GitArgs @("ls-files", "--others", "--exclude-standard")
$head = (Invoke-Git -GitArgs @("rev-parse", "HEAD") | Select-Object -First 1)
$lastReportedHead = ""
if (Test-Path -LiteralPath $StatePath) {
    try {
        $state = Get-Content -Raw -LiteralPath $StatePath | ConvertFrom-Json
        $lastReportedHead = [string]$state.lastReportedHead
    } catch {
        $lastReportedHead = ""
    }
}

$hasCurrentChanges = (@($dirtyFiles + $stagedFiles + $untrackedFiles).Count -gt 0)
# 检查自上次报告以来未报告过的最近提交；lastReportedHead 缺失或不再是 HEAD 祖先（如 rebase）时只看 HEAD，
# 避免一次性扫入大量历史提交。没有这个回溯窗口，漏记的知识候选会在下一个提交后永久不可见。
$recentFiles = @()
$scannedCommits = @()
if ($head -and $RecentCommits -gt 0) {
    $lastReportedHeadIsAncestor = $false
    if (-not [string]::IsNullOrWhiteSpace($lastReportedHead)) {
        & git -C $Root merge-base --is-ancestor $lastReportedHead $head 2>$null
        $lastReportedHeadIsAncestor = ($LASTEXITCODE -eq 0)
    }
    $commitShas = @(Invoke-Git -GitArgs @("rev-list", "--max-count=$RecentCommits", $head))
    foreach ($commit in $commitShas) {
        if ($lastReportedHeadIsAncestor -and $commit -eq $lastReportedHead) { break }
        if (-not $lastReportedHeadIsAncestor -and $scannedCommits.Count -gt 0) { break }
        $scannedCommits += $commit
        $recentFiles += @(Invoke-Git -GitArgs @("diff-tree", "--no-commit-id", "--name-only", "-r", $commit))
    }
}

$allFiles = New-Object System.Collections.Generic.List[string]
$submoduleFiles = Get-SubmoduleChangedFiles "CDC-mod-src"
foreach ($file in @($dirtyFiles + $stagedFiles + $untrackedFiles + $recentFiles + $submoduleFiles)) {
    Add-Unique $allFiles $file
}

$knowledgeFiles = New-Object System.Collections.Generic.List[string]
foreach ($file in @("AGENTS.md", "kubejs/AGENTS.md", "CDC-mod-src/AGENTS.md", "docs/lessons-learned.md")) {
    Add-Unique $knowledgeFiles $file
}
$skillsDir = Join-Path $Root ".agents/skills"
if (Test-Path -LiteralPath $skillsDir) {
    foreach ($skillFile in Get-ChildItem -LiteralPath $skillsDir -Recurse -Filter "SKILL.md") {
        $relativeSkillPath = $skillFile.FullName.Replace($Root, "").TrimStart("\", "/")
        Add-Unique $knowledgeFiles ($relativeSkillPath -replace "\\", "/")
    }
}
$changedKnowledge = New-Object System.Collections.Generic.List[string]
$targets = New-Object System.Collections.Generic.List[string]
$signals = New-Object System.Collections.Generic.List[string]
$forms = New-Object System.Collections.Generic.List[string]

foreach ($file in $allFiles) {
    if ($knowledgeFiles -contains ($file -replace "\\", "/")) {
        Add-Unique $changedKnowledge $file
    }

    $targetsForFile = if (Test-ModpackBehaviorChangePath $file) {
        @("docs/dev-knowledge/content-map.md", "docs/dev-knowledge/compatibility-patches.md")
    } else {
        @(ConvertTo-Target $file)
    }
    foreach ($target in $targetsForFile) {
        if ([string]::IsNullOrWhiteSpace($target)) {
            continue
        }
        Add-Unique $targets $target
        if ($target -like ".agents/skills/*") {
            Add-Unique $forms "Skill - procedural workflow, checklist, tool sequence, or task-specific prompt."
        } elseif ($target -eq "docs/lessons-learned.md") {
            Add-Unique $forms "Lesson - historical pitfall, root cause, or non-obvious side effect."
        } elseif ($target -eq "docs/dev-knowledge/content-map.md") {
            Add-Unique $forms "Content change (feat) map - intended player-facing gameplay, balance, or content change."
        } elseif ($target -eq "docs/dev-knowledge/compatibility-patches.md") {
            Add-Unique $forms "Compatibility and bugfix registry - expected-behavior restoration, regression fix, or upstream adaptation with verification and review condition."
        } elseif ($target -like "docs/dev-knowledge/hotai/*") {
            Add-Unique $forms "Dev knowledge topic - stable hotai reference or generated patch inventory."
        } elseif ($target -like "docs/dev-knowledge/*") {
            Add-Unique $forms "Dev knowledge - content implementation map or lightweight technical how-to index."
        } elseif ($target -like "*AGENTS.md") {
            Add-Unique $forms "AGENTS - always-on constraint, routing pointer, or stable convention."
        }
    }

    $reason = ConvertTo-Reason $file
    Add-Unique $signals "$file - $reason"
}

$recommendation = "No candidate knowledge update detected."
$hasProcessNotes = Test-Path -LiteralPath $NotesPath
$processNotes = ""
if ($hasProcessNotes) {
    $processNotes = (Get-Content -Raw -LiteralPath $NotesPath).Trim()
}

if ($hasProcessNotes -and -not [string]::IsNullOrWhiteSpace($processNotes)) {
    $recommendation = "Process notes found; review them for docs/lessons-learned.md or the relevant AGENTS.md."
    Add-Unique $targets "docs/lessons-learned.md"
} elseif ($allFiles.Count -eq 0) {
    $recommendation = "No git changes or recent commit files were found."
} elseif ($changedKnowledge.Count -gt 0) {
    $recommendation = "Knowledge files changed; validate structure and avoid duplicate facts."
} elseif ($targets.Count -gt 0) {
    $recommendation = "Review whether these changes introduced reusable project-specific knowledge, and route procedural details to skills instead of AGENTS."
}

$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss zzz"
$reportDir = Split-Path -Parent $OutputPath
if (-not (Test-Path -LiteralPath $reportDir)) {
    New-Item -ItemType Directory -Path $reportDir -Force | Out-Null
}

$decisionStatus = "none"
if ($recommendation -ne "No git changes or recent commit files were found." -and $recommendation -ne "No candidate knowledge update detected.") {
    $decisionStatus = "pending"
    $decisionObject = [ordered]@{
        status = "pending"
        createdAt = $timestamp
        target = @($targets)
        recommendation = $recommendation
        reportPath = $OutputPath
    }
    $decisionObject | ConvertTo-Json | Set-Content -LiteralPath $DecisionPath -Encoding UTF8
}

$lines = New-Object System.Collections.Generic.List[string]
$lines.Add("# Knowledge Candidate Report") | Out-Null
$lines.Add("") | Out-Null
$lines.Add("- Generated: $timestamp") | Out-Null
$lines.Add("- Scope: working tree, index, and unreported recent commits") | Out-Null
if ($scannedCommits.Count -gt 0) {
    foreach ($commit in $scannedCommits) {
        $subject = (Invoke-Git -GitArgs @("show", "-s", "--format=%h %s", $commit) | Select-Object -First 1)
        $lines.Add("- Scanned commit: $subject") | Out-Null
    }
}
$lines.Add("- Mode: report only; no knowledge files were edited") | Out-Null
$lines.Add("- Decision: $decisionStatus") | Out-Null
$lines.Add("") | Out-Null
$lines.Add("## Recommendation") | Out-Null
$lines.Add("") | Out-Null
$lines.Add($recommendation) | Out-Null
$lines.Add("") | Out-Null
$lines.Add("## Suggested Targets") | Out-Null
$lines.Add("") | Out-Null
if ($targets.Count -eq 0) {
    $lines.Add("- none") | Out-Null
} else {
    foreach ($target in $targets) {
        $lines.Add("- $target") | Out-Null
    }
}
$lines.Add("") | Out-Null
$lines.Add("## Suggested Knowledge Form") | Out-Null
$lines.Add("") | Out-Null
if ($forms.Count -eq 0) {
    $lines.Add("- none") | Out-Null
} else {
    foreach ($form in $forms) {
        $lines.Add("- $form") | Out-Null
    }
}
$lines.Add("") | Out-Null
$lines.Add("## Signals") | Out-Null
$lines.Add("") | Out-Null
if ($signals.Count -eq 0) {
    $lines.Add("- none") | Out-Null
} else {
    foreach ($signal in $signals) {
        $lines.Add("- $signal") | Out-Null
    }
}
$lines.Add("") | Out-Null
$lines.Add("## Process Notes") | Out-Null
$lines.Add("") | Out-Null
if ([string]::IsNullOrWhiteSpace($processNotes)) {
    $lines.Add("- none") | Out-Null
} else {
    $lines.Add($processNotes) | Out-Null
}
$lines.Add("") | Out-Null
$lines.Add("## Next Step") | Out-Null
$lines.Add("") | Out-Null
$lines.Add('If the recommendation is actionable, ask the user to accept it unless the current task explicitly authorized knowledge maintenance.') | Out-Null
$lines.Add('After applying or rejecting it, run `scripts/resolve-knowledge-candidate.ps1 -Status applied|rejected` to clear temporary notes.') | Out-Null

Set-Content -LiteralPath $OutputPath -Value $lines -Encoding UTF8

# 报告同时按时间戳归档，避免下一轮报告覆盖后候选历史丢失；只保留最新 50 份。
$archiveDir = Join-Path (Split-Path -Parent $OutputPath) "knowledge-candidate-history"
if (-not (Test-Path -LiteralPath $archiveDir)) {
    New-Item -ItemType Directory -Path $archiveDir -Force | Out-Null
}
$archiveName = "knowledge-candidate-" + (Get-Date -Format "yyyyMMdd-HHmmss") + ".md"
Set-Content -LiteralPath (Join-Path $archiveDir $archiveName) -Value $lines -Encoding UTF8
$existingArchives = @(Get-ChildItem -LiteralPath $archiveDir -Filter "knowledge-candidate-*.md" | Sort-Object Name -Descending)
if ($existingArchives.Count -gt 50) {
    $existingArchives | Select-Object -Skip 50 | Remove-Item -Force
}

if ($head) {
    $stateObject = [ordered]@{
        lastReportedHead = $head
        lastReportTime = $timestamp
    }
    $stateObject | ConvertTo-Json | Set-Content -LiteralPath $StatePath -Encoding UTF8
}

Write-Host "Knowledge candidate report written to $(Resolve-Path -LiteralPath $OutputPath)"
