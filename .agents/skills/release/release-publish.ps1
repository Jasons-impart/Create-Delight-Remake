<#
.SYNOPSIS
    Create-Delight Remake post-merge release workflow script.

.DESCRIPTION
    Handles the full release pipeline after PR merge:
    - Tags the target branch and pushes the tag
    - Waits for GitHub Actions CI to complete
    - Downloads build artifacts (Client, Server, and optionally Patch)
    - Re-compresses artifacts into zip files
    - Copies to bracket-free paths (PowerShell [] glob workaround)
    - Generates release notes from git log
    - Creates GitHub Release with artifacts
    - Verifies all assets uploaded

.PARAMETER Version
    The version tag to create (e.g. "v0.4.7.15").

.PARAMETER TargetBranch
    The branch to tag on (e.g. "release-v047x").

.PARAMETER PreviousVersion
    The previous version for release notes and patch artifact names (e.g. "v0.4.7.14").

.PARAMETER ReleaseType
    "正式" for full release, "测试" for prerelease. Default: "正式".

.PARAMETER Proxy
    Optional HTTP proxy (e.g. "http://127.0.0.1:7890").

.PARAMETER CIPollIntervalSeconds
    How often to poll CI status. Default: 30.

.PARAMETER CITimeoutMinutes
    Max wait for CI. Default: 15.

.EXAMPLE
    .\release-publish.ps1 -Version v0.4.7.15 -TargetBranch release-v047x -PreviousVersion v0.4.7.14

.EXAMPLE
    .\release-publish.ps1 -Version v0.4.7.15 -TargetBranch release-v047x -PreviousVersion v0.4.7.14 -ReleaseType 测试 -Proxy http://127.0.0.1:7890
#>
[CmdletBinding()]
param(
    [Parameter(Mandatory=$true)][string]$Version,
    [Parameter(Mandatory=$true)][string]$TargetBranch,
    [Parameter(Mandatory=$true)][string]$PreviousVersion,
    [ValidateSet("正式","测试")][string]$ReleaseType = "正式",
    [string]$Proxy = "",
    [int]$CIPollIntervalSeconds = 30,
    [int]$CITimeoutMinutes = 15
)

$ErrorActionPreference = "Stop"
$OutputEncoding = [System.Text.UTF8Encoding]::new($false)
[Console]::OutputEncoding = $OutputEncoding
$env:LANG = "C.UTF-8"
$env:LC_ALL = "C.UTF-8"

# --- State for cleanup ---
$script:OriginalBranch = $null
$script:Stashed = $false

function Restore-State {
    <# Restore original branch and unstash if needed #>
    if ($script:OriginalBranch -and $script:OriginalBranch -ne $TargetBranch) {
        Write-Host "🔄 Restoring original branch: $script:OriginalBranch"
        $checkoutOutput = & git switch --quiet $script:OriginalBranch 2>&1
        if ($LASTEXITCODE -ne 0) {
            throw "Failed to restore original branch $script:OriginalBranch`n$checkoutOutput"
        }
    }
    if ($script:Stashed) {
        Write-Host "🔄 Restoring stashed changes"
        git stash pop 2>$null
    }
}

function Fail {
    param([string]$Message)
    Write-Host "❌ $Message"
    Restore-State
    Write-Error $Message
    exit 1
}

# ============================================================
# Phase A: Tag
# ============================================================
Write-Host "🏷️ Phase A: Creating and pushing tag $Version"

# Set proxy
if ($Proxy) {
    $env:HTTPS_PROXY = $Proxy
    $env:HTTP_PROXY = $Proxy
    Write-Host "🌐 Proxy set: $Proxy"
}

# Set git env vars for non-interactive operation
$env:CI = 'true'
$env:GIT_TERMINAL_PROMPT = '0'
$env:GCM_INTERACTIVE = 'never'
$env:GIT_EDITOR = ':'
$env:EDITOR = ':'
$env:GIT_PAGER = 'cat'

# Record original branch
$script:OriginalBranch = git branch --show-current
if ($LASTEXITCODE -ne 0) { Fail "Cannot determine current branch" }

# Stash uncommitted changes if any
$dirty = git status --porcelain
if ($dirty) {
    Write-Host "📦 Stashing uncommitted changes"
    git stash push -u -m "release-publish-$Version"
    if ($LASTEXITCODE -ne 0) { Fail "git stash failed" }
    $script:Stashed = $true
}

# Checkout target branch
git checkout $TargetBranch
if ($LASTEXITCODE -ne 0) { Fail "Cannot checkout branch $TargetBranch" }

# Pull latest
git pull
if ($LASTEXITCODE -ne 0) { Fail "git pull failed on $TargetBranch" }

# Pop stash after pull to avoid conflicts with incoming changes
if ($script:Stashed) {
    git stash pop 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "⚠️ stash pop had conflicts, continuing anyway"
    }
    $script:Stashed = $false
}

# Record commit SHA for CI matching (before tagging, so it matches the commit CI will run on)
$commitSha = git rev-parse HEAD
if ($LASTEXITCODE -ne 0) { Fail "Cannot determine HEAD commit SHA" }
Write-Host "   Commit SHA: $commitSha"

# Create tag, or resume if this script was interrupted after a successful tag push.
$existingTagSha = git rev-parse -q --verify "$Version^{commit}" 2>$null
if ($LASTEXITCODE -eq 0 -and $existingTagSha) {
    if ($existingTagSha.Trim() -ne $commitSha.Trim()) {
        Fail "Existing tag $Version points to $existingTagSha, expected $commitSha"
    }
    Write-Host "✅ Tag $Version already exists locally at expected commit"
} else {
    git tag $Version
    if ($LASTEXITCODE -ne 0) { Fail "Cannot create tag $Version" }
}

$remoteTag = git ls-remote --tags origin "refs/tags/$Version" 2>$null
if ($LASTEXITCODE -eq 0 -and $remoteTag -match [regex]::Escape($commitSha.Trim())) {
    Write-Host "✅ Tag $Version already exists on origin"
} else {
    git push origin $Version
    if ($LASTEXITCODE -ne 0) { Fail "Cannot push tag $Version" }
    Write-Host "✅ Tag $Version pushed"
}

# ============================================================
# Phase B: Wait for CI
# ============================================================
Write-Host "⏳ Phase B: Waiting for GitHub Actions CI"

$repo = "Jasons-impart/Create-Delight-Remake"
$timeout = [TimeSpan]::FromMinutes($CITimeoutMinutes)
$stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
$RunId = $null

# Wait for the workflow run triggered by our tag to appear.
# Match by head_sha. Avoid comparing the Chinese workflow name here because
# Windows PowerShell can mis-decode gh's UTF-8 JSON when stdout is redirected.
$workflowName = "发布版本"
while ($stopwatch.Elapsed -lt $timeout) {
    # First get all runs, then filter in PowerShell to avoid jq quoting hell
    $allRuns = gh run list --repo $repo --limit 50 --json databaseId,status,conclusion,name,headSha 2>$null
    if ($LASTEXITCODE -eq 0 -and $allRuns) {
        $runs = $allRuns | ConvertFrom-Json -ErrorAction SilentlyContinue
        $matchingRun = $runs | Where-Object { $_.headSha -eq $commitSha } | Select-Object -First 1
        if ($matchingRun -and $matchingRun.databaseId) {
            $RunId = $matchingRun.databaseId
            break
        }
    }
    Write-Host "   Waiting for workflow run (SHA $commitSha) to appear..."
    Start-Sleep -Seconds $CIPollIntervalSeconds
}

if (-not $RunId) {
    Fail "CI workflow run not found within $CITimeoutMinutes minutes"
}

Write-Host "   Found workflow run: $RunId"

# Poll until completed
$stopwatch.Restart()
while ($stopwatch.Elapsed -lt $timeout) {
    $statusJson = gh run view $RunId --repo $repo --json status,conclusion 2>$null
    if ($LASTEXITCODE -ne 0) {
        Fail "Cannot query CI run status"
    }
    $runStatus = $statusJson | ConvertFrom-Json -ErrorAction SilentlyContinue
    $status = $runStatus.status
    $conclusion = $runStatus.conclusion

    if ($status -eq "completed") {
        if ($conclusion -eq "success") {
            Write-Host "✅ CI completed successfully (run $RunId)"
            break
        } else {
            $runUrl = "https://github.com/$repo/actions/runs/$RunId"
            Fail "CI failed with conclusion: $conclusion. See: $runUrl"
        }
    }

    Write-Host "   CI status: $status (elapsed: $($stopwatch.Elapsed.ToString('mm\:ss')))"
    Start-Sleep -Seconds $CIPollIntervalSeconds
}

if ($stopwatch.Elapsed -ge $timeout) {
    Fail "CI timed out after $CITimeoutMinutes minutes"
}

# ============================================================
# Phase C: Download Artifacts
# ============================================================
Write-Host "📥 Phase C: Downloading artifacts"

$tmpDir = Join-Path $env:TEMP "opencode\$Version"
New-Item -ItemType Directory -Path "$tmpDir\client" -Force | Out-Null
New-Item -ItemType Directory -Path "$tmpDir\clientpatch" -Force | Out-Null
New-Item -ItemType Directory -Path "$tmpDir\server" -Force | Out-Null
New-Item -ItemType Directory -Path "$tmpDir\serverpatch" -Force | Out-Null

# Artifact name patterns
$clientName = "[Client]Create-Delight-Remake-$Version"
$clientPatchName = "[ClientPatch]Create-Delight-Remake-$PreviousVersion-to-$Version"
$serverName = "Server-Create-Delight-Remake-$Version"
$serverPatchName = "[ServerPatch]Create-Delight-Remake-$PreviousVersion-to-$Version"

# List available artifacts and filter in PowerShell (avoids jq quoting issues)
$artifactsRaw = gh api "repos/$repo/actions/runs/$RunId/artifacts" --jq '.artifacts[]' 2>$null
if ($LASTEXITCODE -ne 0) {
    Fail "Cannot list artifacts"
}

$artifacts = @()
$artifactsRaw -split "`n" | Where-Object { $_.Trim() } | ForEach-Object {
    $obj = $_ | ConvertFrom-Json -ErrorAction SilentlyContinue
    if ($obj -and $obj.name -notmatch 'ClickToUse' -and $obj.name -notmatch 'manifest') {
        $artifacts += $obj
    }
}

function New-CurlConfigLine {
    param(
        [Parameter(Mandatory=$true)][string]$Name,
        [Parameter(Mandatory=$true)][string]$Value
    )

    $escaped = $Value.Replace('\', '\\').Replace('"', '\"')
    return "$Name = `"$escaped`""
}

function New-CurlHeaderConfig {
    param([Parameter(Mandatory=$true)][string[]]$Headers)

    $lines = @()
    foreach ($header in $Headers) {
        $lines += New-CurlConfigLine -Name "header" -Value $header
    }
    return ($lines -join "`n") + "`n"
}

function Invoke-CurlWithConfigStdin {
    param(
        [Parameter(Mandatory=$true)][string[]]$Arguments,
        [Parameter(Mandatory=$true)][string]$Config
    )

    $psi = [System.Diagnostics.ProcessStartInfo]::new()
    $psi.FileName = "curl.exe"
    $psi.UseShellExecute = $false
    $psi.RedirectStandardInput = $true
    $psi.CreateNoWindow = $true
    foreach ($arg in $Arguments) {
        [void]$psi.ArgumentList.Add($arg)
    }

    $proc = [System.Diagnostics.Process]::Start($psi)
    $proc.StandardInput.Write($Config)
    if (-not $Config.EndsWith("`n")) {
        $proc.StandardInput.WriteLine()
    }
    $proc.StandardInput.Close()
    $proc.WaitForExit()
    return $proc.ExitCode
}

function Get-CurlProxyArgs {
    param([ValidateSet("direct","proxy")][string]$Mode)

    if ($Mode -eq "proxy" -and $env:HTTPS_PROXY) {
        return @("--proxy", $env:HTTPS_PROXY)
    }
    return @("--noproxy", "*")
}

function Get-FastestDownloadMode {
    param(
        [Parameter(Mandatory=$true)][string]$ArtifactId,
        [Parameter(Mandatory=$true)][string]$Token
    )

    if (-not $env:HTTPS_PROXY) {
        return "direct"
    }

    Write-Host "   ✅ Download route selected: proxy"
    return "proxy"

    Write-Host "   🔍 Benchmarking artifact download route"
    $config = New-CurlHeaderConfig -Headers @(
        "Authorization: Bearer $Token",
        "Accept: application/vnd.github+json"
    )
    $results = @()
    foreach ($mode in @("proxy", "direct")) {
        $benchFile = Join-Path $env:TEMP "opencode\$Version\download-benchmark-$ArtifactId-$mode.bin"
        Remove-Item $benchFile -Force -ErrorAction SilentlyContinue
        $args = (Get-CurlProxyArgs -Mode $mode) + @(
            "--config", "-",
            "--fail",
            "--location",
            "--silent",
            "--show-error",
            "--range", "0-1048575",
            "--connect-timeout", "15",
            "--max-time", "90",
            "-o", $benchFile,
            "https://api.github.com/repos/$repo/actions/artifacts/$ArtifactId/zip"
        )
        $sw = [System.Diagnostics.Stopwatch]::StartNew()
        $code = Invoke-CurlWithConfigStdin -Arguments $args -Config $config
        $sw.Stop()
        $bytes = if (Test-Path $benchFile) { (Get-Item $benchFile).Length } else { 0 }
        Remove-Item $benchFile -Force -ErrorAction SilentlyContinue
        if ($code -eq 0 -and $bytes -gt 0) {
            $results += [pscustomobject]@{ Mode = $mode; Seconds = $sw.Elapsed.TotalSeconds; Bytes = $bytes }
            Write-Host "      ${mode}: $([math]::Round($bytes / 1MB, 2)) MB in $([math]::Round($sw.Elapsed.TotalSeconds, 2))s"
        } else {
            Write-Host "      ${mode}: failed"
        }
    }

    $best = $results | Sort-Object Seconds | Select-Object -First 1
    if (-not $best) {
        Write-Host "   ⚠️ Download benchmark failed; using proxy because -Proxy was provided"
        return "proxy"
    }
    Write-Host "   ✅ Download route selected: $($best.Mode)"
    return $best.Mode
}

$script:DownloadProxyMode = $null

# Download function
function Download-Artifact {
    param([string]$Name, [string]$DestDir)
    $found = $artifacts | Where-Object { $_.name -eq $Name } | Select-Object -First 1
    if (-not $found) {
        Fail "Artifact not found: $Name. Available: $($artifacts.name -join ', ')"
    }
    $sizeInBytes = $found.size_in_bytes
    $sizeMB = if ($sizeInBytes) { [math]::Round($sizeInBytes / 1MB, 1) } else { "?" }
    Write-Host "   📥 Downloading $Name ($sizeMB MB) -> $DestDir"

    if (Test-Path $DestDir) {
        Get-ChildItem -LiteralPath $DestDir -Force | Remove-Item -Recurse -Force
    } else {
        New-Item -ItemType Directory -Path $DestDir -Force | Out-Null
    }

    $artifactId = $found.id
    $zipFile = Join-Path $env:TEMP "opencode\$Version\artifacts\$Name.zip"
    New-Item -ItemType Directory -Path (Split-Path $zipFile) -Force | Out-Null

    $downloaded = $false
    for ($downloadAttempt = 1; $downloadAttempt -le 5; $downloadAttempt++) {
        $curlConfigPath = $null
        try {
            $token = gh auth token
            if ($LASTEXITCODE -ne 0 -or -not $token) {
                throw "Cannot get gh auth token"
            }

            if (Test-Path -LiteralPath $zipFile) {
                Remove-Item -LiteralPath $zipFile -Force -ErrorAction SilentlyContinue
            }

            $curlConfig = New-CurlHeaderConfig -Headers @(
                "Authorization: Bearer $token",
                "Accept: application/vnd.github+json"
            )
            $curlConfigPath = Join-Path $env:TEMP "opencode\$Version\curl-download-$artifactId.conf"
            [System.IO.File]::WriteAllText($curlConfigPath, $curlConfig, [System.Text.UTF8Encoding]::new($false))

            if (-not $script:DownloadProxyMode) {
                $script:DownloadProxyMode = Get-FastestDownloadMode -ArtifactId $artifactId -Token $token
            }

            $curlArgs = (Get-CurlProxyArgs -Mode $script:DownloadProxyMode) + @(
                "--config", $curlConfigPath,
                "--fail",
                "--location",
                "--retry", "3",
                "--retry-delay", "5",
                "--connect-timeout", "30",
                "--max-time", "900",
                "-o", $zipFile,
                "https://api.github.com/repos/$repo/actions/artifacts/$artifactId/zip"
            )
            & curl.exe @curlArgs
            $curlExitCode = $LASTEXITCODE
            Remove-Item $curlConfigPath -Force -ErrorAction SilentlyContinue
            $curlConfigPath = $null

            if ($curlExitCode -eq 0 -and (Test-Path -LiteralPath $zipFile) -and ((Get-Item -LiteralPath $zipFile).Length -gt 0)) {
                Expand-Archive -LiteralPath $zipFile -DestinationPath $DestDir -Force
                Remove-Item -LiteralPath $zipFile -Force -ErrorAction SilentlyContinue
                Write-Host "   ✅ Downloaded $Name ($sizeMB MB)"
                $downloaded = $true
                break
            }
            throw "curl artifact download returned empty or failed"
        } catch {
            if ($curlConfigPath -and (Test-Path $curlConfigPath)) {
                Remove-Item $curlConfigPath -Force -ErrorAction SilentlyContinue
            }
            Write-Host "   ⚠️ curl download failed, falling back to gh run download ($downloadAttempt/5): $_"
            if (Test-Path -LiteralPath $zipFile) {
                Remove-Item -LiteralPath $zipFile -Force -ErrorAction SilentlyContinue
            }
            if (Test-Path $DestDir) {
                Get-ChildItem -LiteralPath $DestDir -Force | Remove-Item -Recurse -Force
            }

            $stdoutFile = Join-Path $env:TEMP "opencode\$Version\gh-download-$artifactId.out"
            $stderrFile = Join-Path $env:TEMP "opencode\$Version\gh-download-$artifactId.err"
            $ghArgs = @("run", "download", $RunId, "--repo", $repo, "-n", $Name, "-D", $DestDir)
            $proc = Start-Process -FilePath "gh" -ArgumentList $ghArgs -PassThru -WindowStyle Hidden -RedirectStandardOutput $stdoutFile -RedirectStandardError $stderrFile
            if (-not $proc.WaitForExit(900 * 1000)) {
                Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
                Write-Host "   ⚠️ gh run download timed out: $Name"
            } elseif ($proc.ExitCode -eq 0) {
                Remove-Item $stdoutFile, $stderrFile -Force -ErrorAction SilentlyContinue
                Write-Host "   ✅ Downloaded $Name (via gh run download)"
                $downloaded = $true
                break
            } else {
                $stderr = Get-Content $stderrFile -Raw -ErrorAction SilentlyContinue
                if ($stderr) {
                    Write-Host "   ⚠️ gh run download failed: $stderr"
                }
            }
            Start-Sleep -Seconds 10
        }
    }

    if (-not $downloaded) {
        Fail "Failed to download artifact: $Name"
    }
}

# Always download Client and Server
Download-Artifact -Name $clientName -DestDir "$tmpDir\client"
Download-Artifact -Name $serverName -DestDir "$tmpDir\server"

# Only download patches for 正式版
if ($ReleaseType -eq "正式") {
    Download-Artifact -Name $clientPatchName -DestDir "$tmpDir\clientpatch"
    Download-Artifact -Name $serverPatchName -DestDir "$tmpDir\serverpatch"
}

Write-Host "✅ All artifacts downloaded"

# ============================================================
# Phase D: Compress Artifacts
# ============================================================
Write-Host "📦 Phase D: Compressing artifacts"

# Client
$clientZip = "$tmpDir\$clientName.zip"
Write-Host "   📦 Compressing client -> $clientZip"
Compress-Archive -Path "$tmpDir\client\*" -DestinationPath $clientZip -Force

# Server
$serverZip = "$tmpDir\$serverName.zip"
Write-Host "   📦 Compressing server -> $serverZip"
Compress-Archive -Path "$tmpDir\server\*" -DestinationPath $serverZip -Force

# Patches (正式版 only)
if ($ReleaseType -eq "正式") {
    $clientPatchZip = "$tmpDir\$clientPatchName.zip"
    Write-Host "   📦 Compressing clientpatch -> $clientPatchZip"
    Compress-Archive -Path "$tmpDir\clientpatch\*" -DestinationPath $clientPatchZip -Force

    $serverPatchZip = "$tmpDir\$serverPatchName.zip"
    Write-Host "   📦 Compressing serverpatch -> $serverPatchZip"
    Compress-Archive -Path "$tmpDir\serverpatch\*" -DestinationPath $serverPatchZip -Force
}

Write-Host "✅ All artifacts compressed"

# ============================================================
# Phase E: Bracket-free copy
# ============================================================
Write-Host "📋 Phase E: Copying to bracket-free paths"

$uploadDir = "$tmpDir\upload"
New-Item -ItemType Directory -Path $uploadDir -Force | Out-Null

# Client: [Client]xxx -> Client-xxx
$uploadClient = "$uploadDir\Client-Create-Delight-Remake-$Version.zip"
Copy-Item -LiteralPath $clientZip -Destination $uploadClient

# Server: no brackets but copy for consistency
$uploadServer = "$uploadDir\Server-Create-Delight-Remake-$Version.zip"
Copy-Item -LiteralPath $serverZip -Destination $uploadServer

if ($ReleaseType -eq "正式") {
    # ClientPatch: [ClientPatch]xxx -> ClientPatch-xxx
    $uploadClientPatch = "$uploadDir\ClientPatch-Create-Delight-Remake-$PreviousVersion-to-$Version.zip"
    Copy-Item -LiteralPath $clientPatchZip -Destination $uploadClientPatch

    # ServerPatch: [ServerPatch]xxx -> ServerPatch-xxx
    $uploadServerPatch = "$uploadDir\ServerPatch-Create-Delight-Remake-$PreviousVersion-to-$Version.zip"
    Copy-Item -LiteralPath $serverPatchZip -Destination $uploadServerPatch
}

Write-Host "✅ Bracket-free copies created in $uploadDir"

# ============================================================
# Phase F: Generate Release Notes
# ============================================================
Write-Host "📝 Phase F: Generating release notes"

# Get commits between versions
$commits = git -c i18n.logOutputEncoding=utf-8 log "$PreviousVersion..$Version" --pretty=format:'%s' 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "   ⚠️ Cannot get git log, using empty release notes"
    $commits = @()
}

# Filter out version bump commits
$commits = $commits | Where-Object { $_ -notmatch '^v.*发布' -and $_ -notmatch '版本更新' }

# Categorize
$categories = [ordered]@{
    '[mod]'   = "模组更新"
    '[feat]'  = "新功能"
    '[fix]'   = "Bug修复"
    '[quest]' = "任务相关"
    '[conf]'  = "配置调整"
}
$uncategorized = "其他"

$grouped = @{}
foreach ($key in $categories.Keys) { $grouped[$key] = @() }
$grouped[$uncategorized] = @()

foreach ($commit in $commits) {
    $matched = $false
    foreach ($prefix in $categories.Keys) {
        $escaped = [regex]::Escape($prefix)
        if ($commit -match "^$escaped") {
            # Strip the [xxx] prefix
            $msg = $commit -replace "^$escaped\s*", ""
            $grouped[$prefix] += $msg
            $matched = $true
            break
        }
    }
    if (-not $matched) {
        $grouped[$uncategorized] += $commit
    }
}

# Build markdown
$sb = [System.Text.StringBuilder]::new()
[void]$sb.AppendLine("## 更新内容 (AI自动生成)")
[void]$sb.AppendLine("")

foreach ($prefix in $categories.Keys) {
    $items = $grouped[$prefix]
    if ($items.Count -gt 0) {
        [void]$sb.AppendLine("**$($categories[$prefix])**")
        foreach ($item in $items) {
            [void]$sb.AppendLine("- $item")
        }
        [void]$sb.AppendLine("")
    }
}

# Uncategorized
$uncatItems = $grouped[$uncategorized]
if ($uncatItems.Count -gt 0) {
    [void]$sb.AppendLine("**$uncategorized**")
    foreach ($item in $uncatItems) {
        [void]$sb.AppendLine("- $item")
    }
    [void]$sb.AppendLine("")
}

# For 测试版, add patch note
if ($ReleaseType -eq "测试") {
    [void]$sb.AppendLine("**增量更新**: 测试版不提供Patch文件，请下载完整包。")
    [void]$sb.AppendLine("")
}

# For 正式版, add incremental update note
if ($ReleaseType -eq "正式") {
    [void]$sb.AppendLine("**增量更新**")
    [void]$sb.AppendLine("从 $PreviousVersion 更新只需下载 ClientPatch 和 ServerPatch 文件。")
    [void]$sb.AppendLine("")
}

# Add compare link
[void]$sb.AppendLine("**详细更新**: https://github.com/$repo/compare/$PreviousVersion...$Version")

$ReleaseNotes = $sb.ToString()
$ReleaseNotesFile = Join-Path $env:TEMP "opencode\release-notes-$Version.md"
New-Item -ItemType Directory -Path (Split-Path $ReleaseNotesFile) -Force | Out-Null
[System.IO.File]::WriteAllText($ReleaseNotesFile, $ReleaseNotes, [System.Text.UTF8Encoding]::new($false))
Write-Host "📝 Release notes generated"

# ============================================================
# Phase G: Create Release
# ============================================================
Write-Host "🚀 Phase G: Creating GitHub Release"

if ($ReleaseType -eq "正式") {
    $title = "$Version 正式版"
    gh release create $Version --repo $repo --title $title --notes-file $ReleaseNotesFile `
        "$uploadClient" `
        "$uploadClientPatch" `
        "$uploadServer" `
        "$uploadServerPatch"
} else {
    $title = "$Version 测试版"
    gh release create $Version --repo $repo --title $title --prerelease --notes-file $ReleaseNotesFile `
        "$uploadClient" `
        "$uploadServer"
}

if ($LASTEXITCODE -ne 0) {
    Fail "Failed to create GitHub release"
}

Write-Host "✅ Release created: $title"

# ============================================================
# Phase H: Verify
# ============================================================
Write-Host "🔍 Phase H: Verifying uploaded assets"

$assetsJson = gh release view $Version --repo $repo --json assets --jq '.assets[] | .name' 2>$null
if ($LASTEXITCODE -ne 0) {
    Fail "Cannot verify release assets"
}

$uploadedAssets = $assetsJson -split "`n" | Where-Object { $_.Trim() }
$assetCount = @($uploadedAssets).Count

$expectedCount = if ($ReleaseType -eq "正式") { 4 } else { 2 }

Write-Host "   Uploaded assets ($assetCount/$expectedCount):"
foreach ($a in $uploadedAssets) {
    Write-Host "     - $a"
}

if ($assetCount -ne $expectedCount) {
    # Build expected list
    $expectedAssets = @(
        "Client-Create-Delight-Remake-$Version.zip",
        "Server-Create-Delight-Remake-$Version.zip"
    )
    if ($ReleaseType -eq "正式") {
        $expectedAssets += @(
            "ClientPatch-Create-Delight-Remake-$PreviousVersion-to-$Version.zip",
            "ServerPatch-Create-Delight-Remake-$PreviousVersion-to-$Version.zip"
        )
    }
    $missing = $expectedAssets | Where-Object { $uploadedAssets -notcontains $_ }
    Fail "Asset count mismatch: expected $expectedCount, got $assetCount. Missing: $($missing -join ', ')"
}

Write-Host "✅ All $assetCount assets verified"

# ============================================================
# Phase I: Cleanup
# ============================================================
Write-Host "🧹 Phase I: Cleanup"

Restore-State

# Output release URL
$releaseUrl = gh release view $Version --repo $repo --json url --jq '.url' 2>$null
if ($LASTEXITCODE -ne 0) {
    $releaseUrl = "https://github.com/$repo/releases/tag/$Version"
}

Write-Host ""
Write-Host "🎉 Release published successfully!"
Write-Host "🔗 $releaseUrl"
Write-Host "📁 Temp directory preserved: $tmpDir"
