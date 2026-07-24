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

function Test-ModpackOverridePath([string]$Path) {
    $normalized = $Path -replace "\\", "/"
    return $normalized -match '^kubejs/(server_scripts|startup_scripts|client_scripts|config)/' -or
        $normalized -match '^kubejs/assets/(?!createdelight/)' -or
        $normalized -match '^kubejs/data/(?!createdelight/)' -or
        $normalized -match '^(config|defaultconfigs)/' -or
        $normalized -match '^CDC-mod-src/src/main/java/.+/(compat|mixin)/' -or
        $normalized -match '^CDC-mod-src/src/main/resources/(assets|data)/(?!createdelightcore/)'
}

function Test-IntentDependentPath([string]$Path) {
    $normalized = $Path -replace "\\", "/"
    return $normalized -match '^hotai/'
}

function Test-ContentImplementationPath([string]$Path) {
    $normalized = $Path -replace "\\", "/"
    return $normalized -match '^kubejs/(assets|data)/(createdelight|createdelightcore)/' -or
        $normalized -match '^CDC-mod-src/src/main/java/.+/(content|registry|eventhandlers|network)/' -or
        $normalized -match '^CDC-mod-src/src/main/(resources/(assets|data)/createdelightcore|generated/resources)/'
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
    if ($normalized -like "docs/dev-knowledge/*") { return $normalized }
    if ($normalized -eq "docs/development.md") { return "docs/dev-knowledge/how-to-index.md" }
    if ($normalized -like "docs/*design*.md" -or $normalized -like "docs/*plan.md" -or $normalized -like "docs/*strategy.md") { return "docs/dev-knowledge/content-map.md" }
    if (Test-ModpackOverridePath $normalized) { return "docs/dev-knowledge/compatibility-patches.md" }
    if (Test-ContentImplementationPath $normalized) { return "docs/dev-knowledge/content-map.md" }
    if ($normalized -like "kubejs/*") { return "docs/dev-knowledge/content-map.md" }
    if ($normalized -eq "CDC-mod-src" -or $normalized -like "CDC-mod-src/*") { return "docs/dev-knowledge/content-map.md" }
    if ($normalized -eq ".codex/hooks.json" -or $normalized -like "scripts/*knowledge*" -or $normalized -like "scripts/add-knowledge-note.ps1" -or $normalized -like "scripts/resolve-knowledge-candidate.ps1") { return ".agents/skills/knowledge-check/SKILL.md" }
    if ($normalized -like "scripts/sync-packwiz-assets.ps1" -or $normalized -like "scripts/add-packwiz-target.ps1" -or $normalized -like "scripts/update-packwiz-meta.ps1" -or $normalized -like "scripts/update-packwiz-target.ps1" -or $normalized -like "scripts/test-packwiz-files-ref.ps1" -or $normalized -like "mods/*" -or $normalized -like "resourcepacks/*" -or $normalized -like "shaderpacks/*" -or $normalized -like "packwiz-files/*") { return ".agents/skills/packwiz-assets/SKILL.md" }
    if ($normalized -eq "modpack.toml") { return "AGENTS.md" }
    if ($normalized -like ".github/workflows/release*" -or $normalized -like ".agents/skills/release/*") { return ".agents/skills/release/SKILL.md" }
    if ($normalized -like ".github/*" -or $normalized -like "scripts/*") { return "AGENTS.md" }
    return ""
}

function ConvertTo-Reason([string]$Path) {
    $normalized = $Path -replace "\\", "/"
    if ($normalized -like ".agents/skills/*") { return "Skill instructions changed; verify trigger wording, workflow scope, and AGENTS duplication." }
    if ($normalized -eq "GettingStarted.md") { return "Pre-clone development setup entry changed; keep it self-contained because project skills are unavailable before clone." }
    if ($normalized -like "docs/dev-knowledge/*") { return "Development knowledge index changed; verify entries stay short and point to source files." }
    if ($normalized -eq "docs/development.md") { return "Development guide changed; check whether a compact how-to entry should be indexed." }
    if ($normalized -like "docs/*design*.md" -or $normalized -like "docs/*plan.md" -or $normalized -like "docs/*strategy.md") { return "Design or plan doc changed; update content-map only if implemented behavior or code locations changed." }
    if (Test-IntentDependentPath $normalized) { return "HotAI may add CD content or override existing AI behavior; decide from player intent whether content map, override registry, or both are needed." }
    if (Test-ModpackOverridePath $normalized) { return "Active modpack override may change third-party behavior; record intent, affected versions, validation, and review condition." }
    if (Test-ContentImplementationPath $normalized) { return "Implemented CD content may need a content-map entry with player intent, source locations, and verification state." }
    if ($normalized -like "kubejs/*") { return "KubeJS behavior changed; record it in the override ledger or content map according to whether it changes an upstream mod or adds CD content." }
    if ($normalized -eq "CDC-mod-src" -or $normalized -like "CDC-mod-src/*") { return "CDC implementation changed; record it in the override ledger for compat/mixin work or content map for CD-owned features." }
    if ($normalized -eq ".codex/hooks.json" -or $normalized -like "scripts/*knowledge*" -or $normalized -like "scripts/add-knowledge-note.ps1" -or $normalized -like "scripts/resolve-knowledge-candidate.ps1") { return "Knowledge maintenance automation changed; update knowledge-check skill if the prompt or routing changed." }
    if ($normalized -like "scripts/sync-packwiz-assets.ps1" -or $normalized -like "scripts/add-packwiz-target.ps1" -or $normalized -like "scripts/update-packwiz-meta.ps1" -or $normalized -like "scripts/update-packwiz-target.ps1" -or $normalized -like "scripts/test-packwiz-files-ref.ps1") { return "Packwiz asset automation changed; update packwiz-assets skill if the workflow changed." }
    if ($normalized -like "scripts/*") { return "Project automation changed; decide whether this is an always-on AGENTS pointer or a task-specific skill workflow." }
    if ($normalized -like ".github/*") { return "CI/release workflow changed; root knowledge may need an update." }
    if ($normalized -like "mods/*" -or $normalized -like "resourcepacks/*" -or $normalized -like "shaderpacks/*" -or $normalized -like "packwiz-files/*") { return "Packwiz asset metadata changed; record only reusable workflow changes in packwiz-assets skill." }
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
$recentFiles = @()
if (-not $hasCurrentChanges -and $head -and $head -ne $lastReportedHead) {
    $recentFiles = Invoke-Git -GitArgs @("diff-tree", "--no-commit-id", "--name-only", "-r", "HEAD")
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

    $targetsForFile = if (Test-IntentDependentPath $file) {
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
        } elseif ($target -eq "docs/dev-knowledge/compatibility-patches.md") {
            Add-Unique $forms "Modpack override registry - active KubeJS/config/HotAI/CDC compatibility or behavior override, with intent, verification, and review condition."
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
$lines.Add("- Scope: working tree, index, and HEAD commit") | Out-Null
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

if ($head) {
    $stateObject = [ordered]@{
        lastReportedHead = $head
        lastReportTime = $timestamp
    }
    $stateObject | ConvertTo-Json | Set-Content -LiteralPath $StatePath -Encoding UTF8
}

Write-Host "Knowledge candidate report written to $(Resolve-Path -LiteralPath $OutputPath)"
