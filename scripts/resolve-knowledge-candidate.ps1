param(
    [ValidateSet("accepted", "rejected", "applied")]
    [string]$Status = "applied",

    [string]$Reason = "",
    [string]$Root = "",
    [string]$DecisionPath = "",
    [string]$NotesPath = ""
)

$ErrorActionPreference = "Stop"

if ([string]::IsNullOrWhiteSpace($Root)) {
    $Root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
}

if ([string]::IsNullOrWhiteSpace($DecisionPath)) {
    $DecisionPath = Join-Path $Root "tmp-opencode/knowledge-candidate-decision.json"
}

if ([string]::IsNullOrWhiteSpace($NotesPath)) {
    $NotesPath = Join-Path $Root "tmp-opencode/knowledge-notes.md"
}

$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss zzz"
$decision = [ordered]@{
    status = $Status
    decidedAt = $timestamp
    reason = $Reason
}

if (Test-Path -LiteralPath $DecisionPath) {
    try {
        $existing = Get-Content -Raw -LiteralPath $DecisionPath | ConvertFrom-Json
        foreach ($property in $existing.PSObject.Properties) {
            if (-not $decision.Contains($property.Name)) {
                $decision[$property.Name] = $property.Value
            }
        }
        $decision["status"] = $Status
        $decision["decidedAt"] = $timestamp
        $decision["reason"] = $Reason
    } catch {
    }
}

$decisionDir = Split-Path -Parent $DecisionPath
if (-not (Test-Path -LiteralPath $decisionDir)) {
    New-Item -ItemType Directory -Path $decisionDir -Force | Out-Null
}

$decision | ConvertTo-Json | Set-Content -LiteralPath $DecisionPath -Encoding UTF8

if (($Status -eq "rejected" -or $Status -eq "applied") -and (Test-Path -LiteralPath $NotesPath)) {
    try {
        Remove-Item -LiteralPath $NotesPath -Force
    } catch {
        Set-Content -LiteralPath $NotesPath -Value "" -Encoding UTF8
    }
}

Write-Host "Knowledge candidate marked as $Status."
