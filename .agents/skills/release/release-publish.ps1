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
    .\release-publish.ps1 -Version v0.4.7.15 -TargetBranch release-v047x

.EXAMPLE
    .\release-publish.ps1 -Version v0.4.7.15 -TargetBranch release-v047x -PreviousVersion v0.4.7.14 -ReleaseType 测试 -Proxy http://127.0.0.1:7890
#>
[CmdletBinding()]
param(
    [Parameter(Mandatory=$true)][string]$Version,
    [Parameter(Mandatory=$true)][string]$TargetBranch,
    [Parameter(Mandatory=$false)][string]$PreviousVersion = "",
    [ValidateSet("正式","测试")][string]$ReleaseType = "正式",
    [string]$Proxy = "",
    [int]$CIPollIntervalSeconds = 30,
    [int]$CITimeoutMinutes = 15,
    [switch]$WhatIf
)

$ErrorActionPreference = "Continue"

# --- State for cleanup ---
$script:OriginalBranch = $null
$script:Stashed = $false

function Restore-State {
    <# Restore original branch and unstash if needed #>
    if ($script:OriginalBranch -and $script:OriginalBranch -ne $TargetBranch) {
        Write-Host "🔄 Restoring original branch: $script:OriginalBranch"
        git checkout $script:OriginalBranch 2>$null
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

function Test-Prerequisites {
    $errors = @()
    
    # Check Version format
    if ($Version -notmatch '^v\d+\.\d+\.\d+\.\d+$') {
        $errors += "Version format invalid: '$Version'. Expected format: v0.4.8.10"
    }
    
    # Check modpack.toml exists
    if (-not (Test-Path "modpack.toml")) {
        $errors += "modpack.toml not found in current directory"
    }
    
    # Check gh CLI available
    $ghAvailable = Get-Command gh -ErrorAction SilentlyContinue
    if (-not $ghAvailable) {
        $errors += "gh CLI not found. Install GitHub CLI first."
    }
    
    # Check gh auth
    if ($ghAvailable) {
        try {
            gh auth status 2>$null | Out-Null
            if ($LASTEXITCODE -ne 0) {
                $errors += "gh CLI not authenticated. Run 'gh auth login' first."
            }
        } catch {
            $errors += "gh CLI not authenticated. Run 'gh auth login' first."
        }
    }

    # gh auth status must run before proxy env vars are set on Windows, but the
    # remote checks below may still need the configured proxy.
    if ($Proxy) {
        $env:HTTPS_PROXY = $Proxy
        $env:HTTP_PROXY = $Proxy
        $env:ALL_PROXY = $Proxy
    }
    
    # Check TargetBranch exists on remote. If GitHub has a transient TLS failure,
    # fall back to the fetched remote-tracking ref so reruns can continue.
    $remoteBranch = $null
    try {
        $remoteBranch = git ls-remote --heads origin $TargetBranch 2>$null
    } catch {
        $remoteBranch = $null
    }
    if (-not $remoteBranch) {
        git show-ref --verify --quiet "refs/remotes/origin/$TargetBranch"
        if ($LASTEXITCODE -eq 0) {
            $remoteBranch = "refs/remotes/origin/$TargetBranch"
            Write-Host "⚠️ Remote branch check used local origin/$TargetBranch fallback"
        }
    }
    if (-not $remoteBranch) {
        $errors += "Target branch '$TargetBranch' not found on remote"
    }
    
    # Check no existing published release for this version. Existing drafts are
    # allowed so an interrupted upload can be resumed idempotently.
    if ($ghAvailable) {
        try {
            $existingRelease = gh release view $Version --repo Jasons-impart/Create-Delight-Remake --json tagName,isDraft 2>$null
            if ($LASTEXITCODE -eq 0 -and $existingRelease) {
                $existingReleaseObj = $existingRelease | ConvertFrom-Json -ErrorAction SilentlyContinue
                if ($existingReleaseObj -and $existingReleaseObj.isDraft) {
                    Write-Host "⚠️ Draft release '$Version' already exists; publish will resume uploads"
                } else {
                    $errors += "Release '$Version' already exists on GitHub. Cannot recreate a release."
                }
            }
        } catch {
            # gh release view returns error for non-existent releases, which is expected
        }
    }
    
    if ($errors.Count -gt 0) {
        Write-Host "❌ Pre-flight validation failed:"
        foreach ($err in $errors) {
            Write-Host "   - $err"
        }
        return $false
    }
    
    Write-Host "✅ Pre-flight validation passed"
    return $true
}

if (-not (Test-Prerequisites)) {
    exit 1
}

# Auto-detect PreviousVersion if not provided (matches CI's patch-tasks logic)
if (-not $PreviousVersion) {
    Write-Host "🔍 Auto-detecting PreviousVersion..."
    # After checkout & pull in Phase A, HEAD will have the tag.
    # Use same logic as CI: if HEAD has exact tag, look at HEAD^; otherwise HEAD.
    # But we're running before Phase A checkout, so use remote tags.
    $autoPrev = git describe --tags --abbrev=0 "$Version^" 2>$null
    if ($LASTEXITCODE -eq 0 -and $autoPrev) {
        $PreviousVersion = $autoPrev
        Write-Host "   ✅ Auto-detected PreviousVersion: $PreviousVersion"
    } else {
        # Fallback: list tags and find the one before $Version
        $allTags = git tag -l 'v*' --sort=-version:refname 2>$null
        $found = $false
        foreach ($tag in $allTags) {
            if ($tag -eq $Version) { continue }
            if ($tag -match '^v\d+\.\d+\.\d+\.\d+$') {
                $PreviousVersion = $tag
                $found = $true
                Write-Host "   ✅ Auto-detected PreviousVersion from tag list: $PreviousVersion"
                break
            }
        }
        if (-not $found) {
            Fail "Cannot auto-detect PreviousVersion. Please provide -PreviousVersion parameter."
        }
    }
}

# Validate PreviousVersion format (now that it may be auto-detected)
if ($PreviousVersion -notmatch '^v\d+\.\d+\.\d+\.\d+$') {
    Fail "PreviousVersion format invalid: '$PreviousVersion'. Expected format: v0.4.7.15"
}

# Verify PreviousVersion tag exists
$prevTag = git tag -l $PreviousVersion 2>$null
if (-not $prevTag) {
    Fail "PreviousVersion tag '$PreviousVersion' not found locally. Available tags: $(git tag -l 'v*' | Select-Object -Last 5)"
}

if ($WhatIf) {
    Write-Host ""
    Write-Host "🔍 DRY RUN - No changes will be made"
    Write-Host "   Version: $Version"
    Write-Host "   TargetBranch: $TargetBranch"
    Write-Host "   PreviousVersion: $PreviousVersion"
    Write-Host "   ReleaseType: $ReleaseType"
    Write-Host ""
    Write-Host "   Would:"
    Write-Host "   A. Create tag $Version on $TargetBranch and push"
    Write-Host "   B. Wait for CI (timeout: $CITimeoutMinutes min)"
    Write-Host "   C. Download artifacts (Client, Server$(if($ReleaseType -eq '正式'){', ClientPatch, ServerPatch'}))"
    Write-Host "   D. Compress and prepare for upload"
    Write-Host "   E. Generate release notes from $PreviousVersion..$Version"
    Write-Host "   F. Create draft GitHub release"
    Write-Host "   G. Upload assets one by one with retries, then publish"
    Write-Host "   H. Verify assets"
    if ($ReleaseType -eq "正式") {
        Write-Host "   I. Create announcement PR to main"
    }
    exit 0
}

# ============================================================
# Phase A: Tag
# ============================================================
Write-Host "🏷️ Phase A: Creating and pushing tag $Version"

# Set proxy AFTER Test-Prerequisites (gh auth keyring fails with proxy env vars)
# See SKILL.md "PowerShell + gh CLI Pitfalls" #5.
if ($Proxy) {
    $env:HTTPS_PROXY = $Proxy
    $env:HTTP_PROXY = $Proxy
    $env:ALL_PROXY = $Proxy
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
    git stash
    if ($LASTEXITCODE -ne 0) { Fail "git stash failed" }
    $script:Stashed = $true
}

# Checkout target branch
git checkout $TargetBranch
if ($LASTEXITCODE -ne 0) { Fail "Cannot checkout branch $TargetBranch" }

# Pull latest explicitly from the target branch to avoid user-level pull.rebase
# settings changing release behavior.
git pull --ff-only origin $TargetBranch
if ($LASTEXITCODE -ne 0) {
    $headShaAfterPullFailure = git rev-parse HEAD
    $originShaAfterPullFailure = git rev-parse "origin/$TargetBranch"
    if ($headShaAfterPullFailure -eq $originShaAfterPullFailure) {
        Write-Host "⚠️ git pull failed, but HEAD already matches origin/$TargetBranch; continuing"
    } else {
        Fail "git pull failed on $TargetBranch"
    }
}

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

# Create tag (idempotent: skip if already exists on correct commit)
# Missing tags are expected on the first run; do not let ErrorActionPreference=Stop
# turn git's non-zero exit into a terminating NativeCommandError.
$oldErrorActionPreference = $ErrorActionPreference
$ErrorActionPreference = "Continue"
$existingTagCommit = git rev-list -n 1 $Version 2>$null
$ErrorActionPreference = $oldErrorActionPreference
if ($LASTEXITCODE -eq 0 -and $existingTagCommit) {
    if ($existingTagCommit -eq $commitSha) {
        Write-Host "   Tag $Version already exists on current commit, skipping tag creation"
    } else {
        Fail "Tag $Version already exists on different commit ($existingTagCommit). Current commit is $commitSha. Delete the tag first or use a different version."
    }
} else {
    git tag $Version
    if ($LASTEXITCODE -ne 0) { Fail "Cannot create tag $Version" }

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
# Match by workflow name AND head_sha to avoid picking up a previous run.
# Use single quotes for --jq to avoid PowerShell string interpolation issues.
$workflowName = "发布版本"
while ($stopwatch.Elapsed -lt $timeout) {
    # First get all runs, then filter in PowerShell to avoid jq quoting hell
    $allRuns = gh run list --repo $repo --limit 10 --json databaseId,status,conclusion,name,headSha 2>$null
    if ($LASTEXITCODE -eq 0 -and $allRuns) {
        $runs = $allRuns | ConvertFrom-Json -ErrorAction SilentlyContinue
        $matchingRun = $runs | Where-Object { $_.name -eq $workflowName -and $_.headSha -eq $commitSha } | Select-Object -First 1
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
        Write-Host "   Cannot query CI run status, retrying..."
        Start-Sleep -Seconds $CIPollIntervalSeconds
        continue
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
$artifactsResponse = $null
for ($artifactListAttempt = 1; $artifactListAttempt -le 5; $artifactListAttempt++) {
    $artifactsResponse = gh api "repos/$repo/actions/runs/$RunId/artifacts" 2>$null
    if ($LASTEXITCODE -eq 0 -and $artifactsResponse) {
        break
    }
    Write-Host "   Cannot list artifacts, retrying ($artifactListAttempt/5)..."
    Start-Sleep -Seconds 10
}
if (-not $artifactsResponse) {
    Fail "Cannot list artifacts"
}
$artifactsObj = $artifactsResponse | ConvertFrom-Json -ErrorAction SilentlyContinue
$artifacts = @()
if ($artifactsObj -and $artifactsObj.artifacts) {
    $artifacts = @($artifactsObj.artifacts | Where-Object { 
        $_.name -notmatch 'ClickToUse' -and $_.name -notmatch 'manifest' 
    })
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

# Download function with progress display
function Download-Artifact {
    param([string]$Name, [string]$DestDir)
    $found = $artifacts | Where-Object { $_.name -eq $Name }
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

    # Download via curl so GitHub's artifact redirect is followed reliably, with fallback to gh run download.
    $artifactId = $found.id
    $zipFile = Join-Path $env:TEMP "opencode\$Version\artifacts\$Name.zip"
    New-Item -ItemType Directory -Path (Split-Path $zipFile) -Force | Out-Null

    $downloaded = $false
    for ($downloadAttempt = 1; $downloadAttempt -le 5; $downloadAttempt++) {
        try {
            $token = gh auth token
            if ($LASTEXITCODE -ne 0 -or -not $token) {
                throw "Cannot get gh auth token"
            }
            if (Test-Path $zipFile) { Remove-Item $zipFile -Force -ErrorAction SilentlyContinue }

            $curlConfig = New-CurlHeaderConfig -Headers @(
                "Authorization: Bearer $token",
                "Accept: application/vnd.github+json"
            )

            if (-not $script:DownloadProxyMode) {
                $script:DownloadProxyMode = Get-FastestDownloadMode -ArtifactId $artifactId -Token $token
            }

            $curlArgs = (Get-CurlProxyArgs -Mode $script:DownloadProxyMode) + @(
                "--config", "-",
                "--fail",
                "--location",
                "--retry", "3",
                "--retry-delay", "5",
                "--connect-timeout", "30",
                "--max-time", "900",
                "-o", $zipFile,
                "https://api.github.com/repos/$repo/actions/artifacts/$artifactId/zip"
            )
            $curlExitCode = Invoke-CurlWithConfigStdin -Arguments $curlArgs -Config $curlConfig

            if ($curlExitCode -eq 0 -and (Test-Path $zipFile) -and ((Get-Item $zipFile).Length -gt 0)) {
                # Extract the zip to destination
                Expand-Archive -LiteralPath $zipFile -DestinationPath $DestDir -Force
                Remove-Item $zipFile -Force -ErrorAction SilentlyContinue
                Write-Host "   ✅ Downloaded $Name ($sizeMB MB)"
                $downloaded = $true
                break
            } else {
                throw "curl artifact download returned empty or failed"
            }
        } catch {
            # Fallback to gh run download, guarded by a timeout because it can hang on Windows.
            Write-Host "   ⚠️ Direct download failed, falling back to gh run download ($downloadAttempt/5)..."
            if (Test-Path $zipFile) { Remove-Item $zipFile -Force -ErrorAction SilentlyContinue }
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

function Compress-CleanArchive {
    param(
        [Parameter(Mandatory=$true)][string]$SourceGlob,
        [Parameter(Mandatory=$true)][string]$DestinationPath
    )

    # Compress-Archive -Force can update an existing zip instead of rebuilding it;
    # repeated release reruns then create duplicate central-directory entries.
    if (Test-Path -LiteralPath $DestinationPath) {
        Remove-Item -LiteralPath $DestinationPath -Force
    }
    Compress-Archive -Path $SourceGlob -DestinationPath $DestinationPath
}

# ============================================================
# Phase D: Compress Artifacts
# ============================================================
Write-Host "📦 Phase D: Compressing artifacts"

# Client
$clientZip = "$tmpDir\$clientName.zip"
Write-Host "   📦 Compressing client -> $clientZip"
Compress-CleanArchive -SourceGlob "$tmpDir\client\*" -DestinationPath $clientZip

# Server
$serverZip = "$tmpDir\$serverName.zip"
Write-Host "   📦 Compressing server -> $serverZip"
Compress-CleanArchive -SourceGlob "$tmpDir\server\*" -DestinationPath $serverZip

# Patches (正式版 only)
if ($ReleaseType -eq "正式") {
    $clientPatchZip = "$tmpDir\$clientPatchName.zip"
    Write-Host "   📦 Compressing clientpatch -> $clientPatchZip"
    Compress-CleanArchive -SourceGlob "$tmpDir\clientpatch\*" -DestinationPath $clientPatchZip

    $serverPatchZip = "$tmpDir\$serverPatchName.zip"
    Write-Host "   📦 Compressing serverpatch -> $serverPatchZip"
    Compress-CleanArchive -SourceGlob "$tmpDir\serverpatch\*" -DestinationPath $serverPatchZip
}

Write-Host "✅ All artifacts compressed"

# ============================================================
# Phase E: Bracket-free copy
# ============================================================
Write-Host "📋 Phase E: Copying to bracket-free paths"

$uploadDir = "$tmpDir\upload"
New-Item -ItemType Directory -Path $uploadDir -Force | Out-Null
Get-ChildItem -LiteralPath $uploadDir -Force | Remove-Item -Recurse -Force

# Client: [Client]xxx -> Client-xxx
$uploadClient = "$uploadDir\Client-Create-Delight-Remake-$Version.zip"
Copy-Item -LiteralPath $clientZip -Destination $uploadClient -Force

# Server: no brackets but copy for consistency
$uploadServer = "$uploadDir\Server-Create-Delight-Remake-$Version.zip"
Copy-Item -LiteralPath $serverZip -Destination $uploadServer -Force

if ($ReleaseType -eq "正式") {
    # ClientPatch: [ClientPatch]xxx -> ClientPatch-xxx
    $uploadClientPatch = "$uploadDir\ClientPatch-Create-Delight-Remake-$PreviousVersion-to-$Version.zip"
    Copy-Item -LiteralPath $clientPatchZip -Destination $uploadClientPatch -Force

    # ServerPatch: [ServerPatch]xxx -> ServerPatch-xxx
    $uploadServerPatch = "$uploadDir\ServerPatch-Create-Delight-Remake-$PreviousVersion-to-$Version.zip"
    Copy-Item -LiteralPath $serverPatchZip -Destination $uploadServerPatch -Force
}

Write-Host "✅ Bracket-free copies created in $uploadDir"

# ============================================================
# Phase F: Generate Release Notes
# ============================================================
Write-Host "📝 Phase F: Generating release notes"

# --- Check if this is the first stable release of the sub-version ---
# Extract sub-version prefix, e.g. "v0.4.8" from "v0.4.8.9"
$subVersionPrefix = ""
if ($Version -match '^(v\d+\.\d+\.\d+)') {
    $subVersionPrefix = $Matches[1]
}
$isFirstStable = $false
$summaryFilePath = ""

if ($subVersionPrefix -and $ReleaseType -eq "正式") {
    # Check if any existing tag with this sub-version prefix is a stable (non-prerelease) release.
    # Fail closed: if GitHub cannot be queried reliably, do not prepend a broad
    # sub-version summary to avoid publishing stale notes on later stable releases.
    $existingTags = git tag -l "$subVersionPrefix*" 2>$null
    $hasStableRelease = $false
    $stableCheckHadUnknown = $false
    foreach ($tag in $existingTags) {
        if ($tag -eq $Version) { continue }  # Skip the tag we just created
        $releaseInfo = gh release view $tag --repo $repo --json isPrerelease 2>$null
        if ($LASTEXITCODE -eq 0 -and $releaseInfo) {
            $relObj = $releaseInfo | ConvertFrom-Json -ErrorAction SilentlyContinue
            if ($relObj -and -not $relObj.isPrerelease) {
                $hasStableRelease = $true
                Write-Host "   Found existing stable release: $tag"
                break
            }
        } else {
            $stableCheckHadUnknown = $true
            Write-Host "   ⚠️ Cannot verify release status for $tag"
        }
    }
    if ($hasStableRelease) {
        $isFirstStable = $false
    } elseif ($stableCheckHadUnknown) {
        Write-Host "   ⚠️ Could not verify all prior $subVersionPrefix releases; skipping first-stable summary"
    } else {
        $isFirstStable = $true
        Write-Host "   🎉 This is the first stable release of $subVersionPrefix"
    }
}

# --- Prepend update summary if this is the first stable release ---
$summaryContent = ""
if ($isFirstStable) {
    # Look for update summary file: docs/update-summary-{version}.md
    $summaryFilePath = "docs/update-summary-$Version.md"
    if (Test-Path $summaryFilePath) {
        $summaryContent = Get-Content $summaryFilePath -Raw
        Write-Host "   📄 Found update summary: $summaryFilePath"
    } else {
        Write-Host "   ⚠️ No exact update summary file found (expected docs/update-summary-$Version.md)"
    }
}

# Get commits between versions
$commits = git log "$PreviousVersion..$Version" --pretty=format:'%s' 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "   ⚠️ Cannot get git log, using empty release notes"
    $commits = @()
}

# Filter out version bump commits - only filter the specific format used by prepare script
$commits = $commits | Where-Object { $_ -notmatch '^\[feat\]\s*v\d[\d.]+\s+(正式版|测试版)版本更新$' }

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

# Prepend update summary if available (before the per-commit notes)
if ($summaryContent) {
    [void]$sb.AppendLine($summaryContent.TrimEnd())
    [void]$sb.AppendLine("")
    [void]$sb.AppendLine("---")
    [void]$sb.AppendLine("")
}

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
Write-Host "📝 Release notes generated"

# ============================================================
# Phase G: Create Release
# ============================================================
Write-Host "🚀 Phase G: Creating GitHub Release"

if ($ReleaseType -eq "正式") {
    $title = "$Version 正式版"
    $uploadAssets = @($uploadClient, $uploadClientPatch, $uploadServer, $uploadServerPatch)
} else {
    $title = "$Version 测试版"
    $uploadAssets = @($uploadClient, $uploadServer)
}

$notesFile = Join-Path $env:TEMP "opencode\release-notes-$Version.md"
New-Item -ItemType Directory -Path (Split-Path $notesFile) -Force | Out-Null
[System.IO.File]::WriteAllText($notesFile, $ReleaseNotes, [System.Text.UTF8Encoding]::new($false))

# Create the release as a draft without assets, then upload assets one by one.
# A single `gh release create <assets...>` can hang for large server zips and
# leaves a partial draft that is harder to resume.
$releaseViewJson = gh release view $Version --repo $repo --json isDraft 2>$null
if ($LASTEXITCODE -eq 0 -and $releaseViewJson) {
    $releaseViewForCreate = $releaseViewJson | ConvertFrom-Json -ErrorAction SilentlyContinue
    if ($releaseViewForCreate -and -not $releaseViewForCreate.isDraft) {
        Remove-Item $notesFile -Force -ErrorAction SilentlyContinue
        Fail "Release $Version already exists and is not a draft"
    }
    Write-Host "   Draft release $Version already exists, resuming uploads"
    gh release edit $Version --repo $repo --title $title --notes-file $notesFile
    if ($LASTEXITCODE -ne 0) {
        Remove-Item $notesFile -Force -ErrorAction SilentlyContinue
        Fail "Failed to update draft release metadata"
    }
} else {
    if ($ReleaseType -eq "正式") {
        gh release create $Version --repo $repo --title $title --notes-file $notesFile --draft
    } else {
        gh release create $Version --repo $repo --title $title --prerelease --notes-file $notesFile --draft
    }
    if ($LASTEXITCODE -ne 0) {
        Remove-Item $notesFile -Force -ErrorAction SilentlyContinue
        Fail "Failed to create draft GitHub release"
    }
}

Remove-Item $notesFile -Force -ErrorAction SilentlyContinue
Write-Host "✅ Draft release ready: $title"

function Get-ReleaseForUpload {
    $releaseListJson = gh api "repos/$repo/releases" --paginate 2>$null
    if ($LASTEXITCODE -ne 0 -or -not $releaseListJson) {
        throw "Cannot list releases"
    }
    $releaseForUpload = @($releaseListJson | ConvertFrom-Json -ErrorAction Stop) | Where-Object { $_.tag_name -eq $Version } | Select-Object -First 1
    if (-not $releaseForUpload) {
        throw "Cannot find draft release for $Version"
    }
    return $releaseForUpload
}

function Remove-ReleaseAssetByName {
    param(
        [Parameter(Mandatory=$true)]$Release,
        [Parameter(Mandatory=$true)][string]$AssetName
    )

    $existingAssetsJson = gh api "repos/$repo/releases/$($Release.id)/assets" 2>$null
    if ($LASTEXITCODE -eq 0 -and $existingAssetsJson) {
        $existingAsset = @($existingAssetsJson | ConvertFrom-Json -ErrorAction SilentlyContinue) | Where-Object { $_.name -eq $AssetName } | Select-Object -First 1
        if ($existingAsset) {
            gh api -X DELETE "repos/$repo/releases/assets/$($existingAsset.id)" 2>$null | Out-Null
        }
    }
}

function Invoke-CurlReleaseAssetUpload {
    param(
        [Parameter(Mandatory=$true)]$Release,
        [Parameter(Mandatory=$true)][string]$AssetPath,
        [Parameter(Mandatory=$true)][string]$AssetName,
        [Parameter(Mandatory=$true)][string]$Token,
        [ValidateSet("direct","proxy")][string]$Mode,
        [int]$TimeoutSeconds = 3600,
        [string]$ContentType = "application/zip"
    )

    $curlConfig = New-CurlHeaderConfig -Headers @(
        "Authorization: Bearer $Token",
        "Accept: application/vnd.github+json",
        "Content-Type: $ContentType"
    )
    $encodedName = [System.Uri]::EscapeDataString($AssetName)
    $curlArgs = (Get-CurlProxyArgs -Mode $Mode) + @(
        "--config", "-",
        "--fail",
        "--location",
        "--retry", "3",
        "--retry-delay", "5",
        "--connect-timeout", "30",
        "--max-time", "$TimeoutSeconds",
        "--data-binary", "@$AssetPath",
        "--output", "NUL",
        "https://uploads.github.com/repos/$repo/releases/$($Release.id)/assets?name=$encodedName"
    )
    return Invoke-CurlWithConfigStdin -Arguments $curlArgs -Config $curlConfig
}

function Get-FastestUploadMode {
    param(
        [Parameter(Mandatory=$true)]$Release,
        [Parameter(Mandatory=$true)][string]$Token
    )

    if (-not $env:HTTPS_PROXY) {
        return "direct"
    }

    Write-Host "   🔍 Benchmarking release upload route"
    $benchFile = Join-Path $env:TEMP "opencode\$Version\upload-benchmark.bin"
    $bytes = New-Object byte[] (1MB)
    [System.IO.File]::WriteAllBytes($benchFile, $bytes)
    $results = @()
    try {
        foreach ($mode in @("direct", "proxy")) {
            $assetName = "upload-benchmark-$Version-$mode.bin"
            Remove-ReleaseAssetByName -Release $Release -AssetName $assetName
            $sw = [System.Diagnostics.Stopwatch]::StartNew()
            $code = Invoke-CurlReleaseAssetUpload -Release $Release -AssetPath $benchFile -AssetName $assetName -Token $Token -Mode $mode -TimeoutSeconds 120 -ContentType "application/octet-stream"
            $sw.Stop()
            if ($code -eq 0) {
                $results += [pscustomobject]@{ Mode = $mode; Seconds = $sw.Elapsed.TotalSeconds }
                Write-Host "      ${mode}: 1 MB in $([math]::Round($sw.Elapsed.TotalSeconds, 2))s"
                Remove-ReleaseAssetByName -Release $Release -AssetName $assetName
            } else {
                Write-Host "      ${mode}: failed"
            }
        }
    } finally {
        Remove-Item $benchFile -Force -ErrorAction SilentlyContinue
    }

    $best = $results | Sort-Object Seconds | Select-Object -First 1
    if (-not $best) {
        Write-Host "   ⚠️ Upload benchmark failed; using direct upload"
        return "direct"
    }
    Write-Host "   ✅ Upload route selected: $($best.Mode)"
    return $best.Mode
}

$script:UploadProxyMode = $null

function Upload-ReleaseAsset {
    param(
        [Parameter(Mandatory=$true)][string]$AssetPath,
        [int]$Attempts = 5,
        [int]$TimeoutSeconds = 3600
    )

    $assetName = Split-Path $AssetPath -Leaf
    for ($attempt = 1; $attempt -le $Attempts; $attempt++) {
        Write-Host "   ⬆️ Uploading $assetName ($attempt/$Attempts)"

        try {
            $token = gh auth token
            if ($LASTEXITCODE -ne 0 -or -not $token) {
                throw "Cannot get gh auth token"
            }

            $releaseForUpload = Get-ReleaseForUpload

            if (-not $script:UploadProxyMode) {
                $script:UploadProxyMode = Get-FastestUploadMode -Release $releaseForUpload -Token $token
            }

            Remove-ReleaseAssetByName -Release $releaseForUpload -AssetName $assetName
            $curlExitCode = Invoke-CurlReleaseAssetUpload -Release $releaseForUpload -AssetPath $AssetPath -AssetName $assetName -Token $token -Mode $script:UploadProxyMode -TimeoutSeconds $TimeoutSeconds
            if ($curlExitCode -eq 0) {
                Write-Host "   ✅ Uploaded $assetName"
                return
            }
            throw "curl upload failed with exit code $curlExitCode"
        } catch {
            Write-Host "   ⚠️ curl upload failed: $_"
        }

        Start-Sleep -Seconds 15
    }

    Fail "Failed to upload release asset after $Attempts attempts: $assetName"
}

foreach ($asset in $uploadAssets) {
    $assetName = Split-Path $asset -Leaf
    $uploadedBeforeRetry = @()
    $assetViewJson = gh release view $Version --repo $repo --json assets 2>$null
    if ($LASTEXITCODE -eq 0 -and $assetViewJson) {
        $assetView = $assetViewJson | ConvertFrom-Json -ErrorAction SilentlyContinue
        if ($assetView -and $assetView.assets) {
            $uploadedBeforeRetry = @($assetView.assets | Where-Object { $_.state -eq "uploaded" } | ForEach-Object { $_.name })
        }
    }
    if ($uploadedBeforeRetry -contains $assetName) {
        Write-Host "   ✅ Asset already uploaded, skipping $assetName"
        continue
    }
    Upload-ReleaseAsset -AssetPath $asset
}

Write-Host "✅ Release assets uploaded"

if ($ReleaseType -eq "正式") {
    gh release edit $Version --repo $repo --draft=false --prerelease=false
} else {
    gh release edit $Version --repo $repo --draft=false --prerelease=true
}
if ($LASTEXITCODE -ne 0) {
    Fail "Failed to publish draft release"
}

Write-Host "✅ Release published: $title"

# ============================================================
# Phase H: Verify
# ============================================================
Write-Host "🔍 Phase H: Verifying uploaded assets"

$releaseViewJson = gh release view $Version --repo $repo --json assets 2>$null
if ($LASTEXITCODE -ne 0) {
    Fail "Cannot verify release assets"
}
$releaseView = $releaseViewJson | ConvertFrom-Json -ErrorAction SilentlyContinue
$uploadedAssets = @()
if ($releaseView -and $releaseView.assets) {
    $uploadedAssets = @($releaseView.assets | ForEach-Object { $_.name })
}
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
# Phase I: Announcement PR to main
# ============================================================
# For stable releases, create a separate PR to main with docs/announcement.md update.
# Best-effort: if this fails, the release is still complete.
$announcementPrUrl = ""

if ($ReleaseType -eq "正式") {
    Write-Host "📢 Phase I: Creating announcement PR to main"

    try {
        # Read announcement.md content BEFORE any branch switching.
        # The $Version tag is on $TargetBranch, not main, so we must read
        # while still checked out on $TargetBranch. If we've drifted to
        # another branch somehow, ensure we're back on $TargetBranch first.
        $currentForAnn = git branch --show-current 2>$null
        if ($currentForAnn -ne $TargetBranch) {
            Write-Host "   Ensuring we're on $TargetBranch before reading announcement"
            git checkout $TargetBranch 2>$null
        }
        $annFromTag = git show "$Version:docs/announcement.md" 2>$null
        if ($LASTEXITCODE -ne 0 -or -not $annFromTag) {
            Write-Host "   ⚠️ Cannot read docs/announcement.md from tag $Version, skipping announcement PR"
        } else {
            # Create a branch from main for the announcement update
            $annBranch = "announcement/$Version"
            git fetch origin main 2>$null
            git checkout -b $annBranch origin/main 2>$null
            if ($LASTEXITCODE -ne 0) {
                Write-Host "   ⚠️ Cannot create branch $annBranch from origin/main, skipping announcement PR"
            } else {
                # Ensure docs directory exists
                if (-not (Test-Path "docs")) {
                    New-Item -ItemType Directory -Path "docs" | Out-Null
                }

                # Write announcement.md (UTF-8 no BOM)
                $annPath = "docs/announcement.md"
                $utf8NoBom = [System.Text.UTF8Encoding]::new($false)
                [System.IO.File]::WriteAllText((Join-Path $PWD $annPath), $annFromTag, $utf8NoBom)

                # Stage, commit, push
                git add $annPath
                git commit -m "[docs] 更新公告至$Version版本" 2>$null
                if ($LASTEXITCODE -eq 0) {
                    git push -u origin $annBranch 2>$null
                    if ($LASTEXITCODE -eq 0) {
                        # Create PR to main
                        $prBody = "自动更新 docs/announcement.md 至 $Version 正式版。"
                        $prBodyFile = Join-Path $env:TEMP "opencode\ann-pr-body-$Version.md"
                        New-Item -ItemType Directory -Path (Split-Path $prBodyFile) -Force | Out-Null
                        [System.IO.File]::WriteAllText($prBodyFile, $prBody, [System.Text.UTF8Encoding]::new($false))
                        $announcementPrUrl = gh pr create --base main --head $annBranch --title "[docs] 更新公告至$Version版本" --body-file $prBodyFile 2>$null
                        Remove-Item $prBodyFile -Force -ErrorAction SilentlyContinue
                        if ($LASTEXITCODE -eq 0) {
                            Write-Host "   ✅ Announcement PR created: $announcementPrUrl"
                        } else {
                            Write-Host "   ⚠️ Failed to create announcement PR (gh pr create failed)"
                        }
                    } else {
                        Write-Host "   ⚠️ Failed to push announcement branch"
                    }
                } else {
                    Write-Host "   ⚠️ No changes to commit (announcement.md may be unchanged on main)"
                }

                # Return to target branch
                git checkout $TargetBranch 2>$null
            }
        }
    } catch {
        Write-Host "   ⚠️ Announcement PR failed: $_"
    } finally {
        # Always ensure we're back on the target branch after Phase I
        $currentBranch = git branch --show-current 2>$null
        if ($currentBranch -ne $TargetBranch) {
            Write-Host "   Restoring branch to $TargetBranch"
            git checkout $TargetBranch 2>$null
        }
    }
} else {
    Write-Host "📢 Phase I: Skipped (测试版 does not need announcement PR)"
}

# ============================================================
# Phase J: Cleanup
# ============================================================
Write-Host "🧹 Phase J: Cleanup"

Restore-State

# Output release URL
$releaseUrlJson = gh release view $Version --repo $repo --json url 2>$null
if ($LASTEXITCODE -eq 0 -and $releaseUrlJson) {
    $urlObj = $releaseUrlJson | ConvertFrom-Json -ErrorAction SilentlyContinue
    $releaseUrl = $urlObj.url
}
if (-not $releaseUrl) {
    $releaseUrl = "https://github.com/$repo/releases/tag/$Version"
}

Write-Host ""
Write-Host "🎉 Release published successfully!"
Write-Host "🔗 $releaseUrl"
if ($announcementPrUrl) {
    Write-Host "📢 Announcement PR: $announcementPrUrl"
}
Write-Host "📁 Temp directory preserved: $tmpDir"
