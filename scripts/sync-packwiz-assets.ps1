[CmdletBinding()]
param(
    [string[]]$MetadataRoots = @("mods", "resourcepacks", "shaderpacks"),
    [ValidateSet("client", "server", "all")]
    [string]$Side = "client",
    [string]$PackwizUrl = "https://github.com/Jasons-impart/packwiz/releases/latest/download/packwiz.exe",
    [string]$InstallerUrl = "https://github.com/packwiz/packwiz-installer/releases/latest/download/packwiz-installer.jar",
    [string]$PackwizFilesRef = $env:PACKWIZ_FILES_REF,
    [string]$PackwizFilesRawPrefix = $env:PACKWIZ_FILES_RAW_PREFIX,
    [string]$Proxy = $env:PACKWIZ_PROXY,
    [switch]$IfGitChanged,
    [string]$OldRev,
    [string]$NewRev = "HEAD",
    [string]$HookName = "sync-packwiz-assets",
    [switch]$Force,
    [switch]$DryRun
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

$RepoRoot = Split-Path -Parent $PSScriptRoot
$WorkRoot = Join-Path $RepoRoot ".cache\packwiz-sync"
$ToolsRoot = Join-Path $WorkRoot "tools"
$PackRoot = Join-Path $WorkRoot "pack"
$PackwizExe = Join-Path $ToolsRoot "packwiz.exe"
$InstallerJarPath = Join-Path $ToolsRoot "packwiz-installer.jar"
$ServeLog = Join-Path $WorkRoot "serve.log"
$ServeErrLog = Join-Path $WorkRoot "serve.err.log"
$SyncStatePath = Join-Path $WorkRoot "sync-state.json"
$SyncLockPath = Join-Path $WorkRoot "sync.lock"
$PackwizFilesRoot = Join-Path $RepoRoot "packwiz-files"
$PackwizFilesRawUrlPattern = 'https://raw\.githubusercontent\.com/Jasons-impart/Create-Delight-Remake/.+/packwiz-files/'
$StaticServerScript = Join-Path $PSScriptRoot "packwiz-static-server.py"
$GeneratePackwizScript = Join-Path $PSScriptRoot "generate-packwiz-files.py"
$PackwizSideScript = Join-Path $PSScriptRoot "packwiz-side.py"
$ServeProcess = $null
$script:SyncOldCommit = $null
$script:SyncNewCommit = $null
$script:SyncLockStream = $null

function Write-Status {
    param([string]$Message)
    Write-Host "[sync] $Message" -ForegroundColor Cyan
}

function Resolve-GitCommit {
    param([string]$Rev)

    if ([string]::IsNullOrWhiteSpace($Rev)) {
        return $null
    }

    $commit = & git -C $RepoRoot rev-parse --verify "$Rev^{commit}" 2>$null
    if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($commit)) {
        return $null
    }

    return $commit.Trim()
}

function Test-PackwizGitChanges {
    param(
        [string]$Old,
        [string]$New,
        [string]$Name
    )

    $oldCommit = Resolve-GitCommit $Old
    $newCommit = Resolve-GitCommit $New

    if ($null -eq $newCommit) {
        Write-Warning "[$Name] Could not resolve new revision '$New'; skipping Packwiz sync."
        return $false
    }

    if ($null -eq $oldCommit) {
        Write-Warning "[$Name] Could not resolve old revision '$Old'; skipping Packwiz sync."
        return $false
    }

    $script:SyncOldCommit = $oldCommit
    $script:SyncNewCommit = $newCommit

    if ($oldCommit -eq $newCommit) {
        Write-Host "[$Name] HEAD did not change; Packwiz sync not required."
        return $false
    }

    $changedPaths = @(& git -C $RepoRoot diff --name-only $oldCommit $newCommit -- mods resourcepacks shaderpacks packwiz-files 2>$null)
    if ($LASTEXITCODE -ne 0) {
        Write-Warning "[$Name] Could not diff $oldCommit..$newCommit; skipping Packwiz sync."
        return $false
    }

    $packwizChanges = @(
        $changedPaths |
            Where-Object {
                $_ -like "packwiz-files/*" -or
                $_ -match "^(mods|resourcepacks|shaderpacks)/.+\.pw\.toml$"
            } |
            Select-Object -Unique
    )

    if ($packwizChanges.Count -eq 0) {
        Write-Host "[$Name] No Packwiz asset changes detected; sync not required."
        return $false
    }

    Write-Host "[$Name] Packwiz asset changes detected; syncing local runtime assets..."
    $packwizChanges | ForEach-Object { Write-Host "  $_" }
    return $true
}

$ShouldSync = $true
if ($IfGitChanged) {
    $ShouldSync = Test-PackwizGitChanges -Old $OldRev -New $NewRev -Name $HookName
    if (-not $ShouldSync -and $Force -and -not [string]::IsNullOrWhiteSpace($script:SyncNewCommit)) {
        Write-Host "[$HookName] Force mode enabled; running Packwiz sync despite Git change detection."
        $ShouldSync = $true
    }
} else {
    $script:SyncNewCommit = Resolve-GitCommit $NewRev
}

if (-not $ShouldSync) {
    exit 0
}

function Get-SyncStateKey {
    param([string]$Commit)

    if ([string]::IsNullOrWhiteSpace($Commit)) {
        return $null
    }

    $rootKey = @(
        $MetadataRoots |
            ForEach-Object { ($_ -replace '^[\\/]+|[\\/]+$', '').ToLowerInvariant() } |
            Sort-Object
    ) -join '|'
    $scriptHash = (Get-FileHash -LiteralPath $PSCommandPath -Algorithm SHA256).Hash.ToLowerInvariant()
    $proxyKey = if ([string]::IsNullOrWhiteSpace($Proxy)) { "direct" } else { $Proxy.Trim().ToLowerInvariant() }
    $packwizFilesRefKey = if ([string]::IsNullOrWhiteSpace($PackwizFilesRef)) { "auto" } else { $PackwizFilesRef.Trim() }
    $packwizFilesRawPrefixKey = if ([string]::IsNullOrWhiteSpace($PackwizFilesRawPrefix)) { "auto" } else { $PackwizFilesRawPrefix.Trim() }

    return "v4|$Commit|$Side|$rootKey|$proxyKey|$packwizFilesRefKey|$packwizFilesRawPrefixKey|$PackwizUrl|$InstallerUrl|$scriptHash"
}

function Test-SyncStateCompleted {
    param([string]$StateKey)

    if ([string]::IsNullOrWhiteSpace($StateKey) -or -not (Test-Path -LiteralPath $SyncStatePath)) {
        return $false
    }

    try {
        $state = Get-Content -Raw -LiteralPath $SyncStatePath | ConvertFrom-Json
        return [string]$state.key -eq $StateKey
    }
    catch {
        Write-Warning "Could not read Packwiz sync state; running a fresh sync."
        return $false
    }
}

function Write-SyncState {
    param([string]$StateKey)

    if ([string]::IsNullOrWhiteSpace($StateKey)) {
        return
    }

    try {
        New-Item -ItemType Directory -Force -Path $WorkRoot | Out-Null
        $state = [ordered]@{
            schemaVersion = 1
            key = $StateKey
            oldCommit = $script:SyncOldCommit
            newCommit = $script:SyncNewCommit
            side = $Side
            metadataRoots = @($MetadataRoots)
            proxy = if ([string]::IsNullOrWhiteSpace($Proxy)) { "direct" } else { $Proxy.Trim() }
            packwizFilesRef = if ([string]::IsNullOrWhiteSpace($PackwizFilesRef)) { "auto" } else { $PackwizFilesRef.Trim() }
            packwizFilesRawPrefix = if ([string]::IsNullOrWhiteSpace($PackwizFilesRawPrefix)) { "auto" } else { $PackwizFilesRawPrefix.Trim() }
            completedAtUtc = (Get-Date).ToUniversalTime().ToString("o")
        }
        $stateJson = $state | ConvertTo-Json -Depth 4
        Write-Utf8NoBomFile -Path $SyncStatePath -Content $stateJson
    }
    catch {
        Write-Warning "Packwiz sync succeeded, but the duplicate-run state could not be saved: $($_.Exception.Message)"
    }
}

function Resolve-ProxyUri {
    param([string]$ProxyValue)

    if ([string]::IsNullOrWhiteSpace($ProxyValue)) {
        return $null
    }

    try {
        $proxyUri = [Uri]::new($ProxyValue.Trim())
    }
    catch {
        throw "Invalid proxy URL '$ProxyValue'. Use an absolute HTTP URL such as http://127.0.0.1:7890."
    }

    if (-not $proxyUri.IsAbsoluteUri -or $proxyUri.Scheme -notin @("http", "https")) {
        throw "Unsupported proxy URL '$ProxyValue'. Use an absolute HTTP or HTTPS proxy URL."
    }
    if ([string]::IsNullOrWhiteSpace($proxyUri.Host) -or $proxyUri.UserInfo) {
        throw "Proxy URL must contain only a host and port; proxy credentials are not supported by this sync path."
    }
    if ($proxyUri.AbsolutePath -ne "/" -or $proxyUri.Query -or $proxyUri.Fragment) {
        throw "Proxy URL '$ProxyValue' must not contain a path, query, or fragment."
    }

    return [pscustomobject]@{
        Uri = $proxyUri
        Host = $proxyUri.Host
        Port = $proxyUri.Port
    }
}

function Invoke-WithProxy {
    param([scriptblock]$Script)

    if ($null -eq $script:ProxyConfig) {
        return & $Script
    }

    $oldHttpProxy = $env:HTTP_PROXY
    $oldHttpsProxy = $env:HTTPS_PROXY
    $oldAllProxy = $env:ALL_PROXY
    try {
        $env:HTTP_PROXY = $script:ProxyConfig.Uri.AbsoluteUri
        $env:HTTPS_PROXY = $script:ProxyConfig.Uri.AbsoluteUri
        $env:ALL_PROXY = $script:ProxyConfig.Uri.AbsoluteUri
        return & $Script
    }
    finally {
        $env:HTTP_PROXY = $oldHttpProxy
        $env:HTTPS_PROXY = $oldHttpsProxy
        $env:ALL_PROXY = $oldAllProxy
    }
}

$script:ProxyConfig = Resolve-ProxyUri -ProxyValue $Proxy
if ($null -ne $script:ProxyConfig) {
    Write-Status ("Using proxy {0}:{1} for Packwiz downloads." -f $script:ProxyConfig.Host, $script:ProxyConfig.Port)
}

if ($DryRun) {
    Write-Host "[$HookName] Dry run enabled; Packwiz runtime sync was not executed."
    exit 0
}

$syncStateKey = Get-SyncStateKey -Commit $script:SyncNewCommit

function Enter-SyncLock {
    New-Item -ItemType Directory -Force -Path $WorkRoot | Out-Null
    for ($attempt = 0; $attempt -lt 600; $attempt++) {
        try {
            $script:SyncLockStream = [System.IO.FileStream]::new(
                $SyncLockPath,
                [System.IO.FileMode]::OpenOrCreate,
                [System.IO.FileAccess]::ReadWrite,
                [System.IO.FileShare]::None
            )
            return
        }
        catch [System.IO.IOException] {
            Start-Sleep -Milliseconds 200
        }
    }

    throw "Timed out waiting for another Packwiz sync to finish: $SyncLockPath"
}

function Exit-SyncLock {
    if ($null -ne $script:SyncLockStream) {
        $script:SyncLockStream.Dispose()
        $script:SyncLockStream = $null
    }
}

function Get-GitRefForPackwizFiles {
    if (-not [string]::IsNullOrWhiteSpace($PackwizFilesRef)) {
        return $PackwizFilesRef.Trim()
    }

    $branch = $null
    try {
        $branch = (& git -C $RepoRoot branch --show-current 2>$null)
        if ($LASTEXITCODE -ne 0) { $branch = $null }
    }
    catch {
        $branch = $null
    }

    if (-not [string]::IsNullOrWhiteSpace($branch)) {
        return $branch.Trim()
    }

    try {
        $commit = (& git -C $RepoRoot rev-parse HEAD 2>$null)
        if ($LASTEXITCODE -eq 0 -and -not [string]::IsNullOrWhiteSpace($commit)) {
            return $commit.Trim()
        }
    }
    catch {}

    return "main"
}

function Resolve-PackwizFilesRawPrefix {
    if (-not [string]::IsNullOrWhiteSpace($PackwizFilesRawPrefix)) {
        return $PackwizFilesRawPrefix.TrimEnd('/') + '/'
    }

    $ref = Get-GitRefForPackwizFiles
    $escapedRef = ([Uri]::EscapeDataString($ref)).Replace('%2F', '/')
    return "https://raw.githubusercontent.com/Jasons-impart/Create-Delight-Remake/$escapedRef/packwiz-files/"
}

function Replace-PackwizFilesRawUrls {
    param(
        [string]$Content,
        [string]$Replacement
    )

    return [regex]::Replace($Content, $PackwizFilesRawUrlPattern, {
        param($Match)
        return $Replacement
    })
}

$PackwizFilesRawPrefix = Resolve-PackwizFilesRawPrefix

function Resolve-JavaCommand {
    $javaFromJavaHome = $null
    if ($env:JAVA_HOME) {
        $candidate = Join-Path $env:JAVA_HOME "bin\java.exe"
        if (Test-Path $candidate) {
            $javaFromJavaHome = $candidate
        }
    }
    if ($javaFromJavaHome) {
        return $javaFromJavaHome
    }

    $variablesPath = Join-Path $RepoRoot "variables.txt"
    if (Test-Path $variablesPath) {
        foreach ($line in Get-Content $variablesPath) {
            if ($line -match '^\s*JAVA\s*=\s*(.+?)\s*$') {
                $raw = $Matches[1].Trim()
                $trimmed = $raw.Trim('"')
                if ($trimmed -and (Test-Path $trimmed)) {
                    return $trimmed
                }
            }
        }
    }

    $javaCmd = Get-Command java -ErrorAction SilentlyContinue
    if ($javaCmd) {
        return $javaCmd.Source
    }

    throw "Java 17 was not found. Set JAVA_HOME, install java on PATH, or update variables.txt."
}

function Resolve-PythonCommand {
    $pythonCmd = Get-Command python -ErrorAction SilentlyContinue
    if ($pythonCmd) {
        return $pythonCmd.Source
    }

    $pythonLauncher = Get-Command py -ErrorAction SilentlyContinue
    if ($pythonLauncher) {
        $resolvedPython = & $pythonLauncher.Source -3 -c "import sys; print(sys.executable)"
        if ($LASTEXITCODE -eq 0 -and $resolvedPython) {
            return $resolvedPython.Trim()
        }
    }

    throw "Python was not found. Install Python so the local static server can run."
}

function Get-FreePort {
    $listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, 0)
    $listener.Start()
    try {
        return ([System.Net.IPEndPoint]$listener.LocalEndpoint).Port
    }
    finally {
        $listener.Stop()
    }
}

function Get-RelativeUnixPath {
    param(
        [string]$Root,
        [string]$Path
    )

    $fullRoot = [System.IO.Path]::GetFullPath($Root)
    $fullPath = [System.IO.Path]::GetFullPath($Path)
    $rootWithSlash = $fullRoot.TrimEnd('\', '/') + [System.IO.Path]::DirectorySeparatorChar
    if (-not $fullPath.StartsWith($rootWithSlash, [System.StringComparison]::OrdinalIgnoreCase)) {
        throw "Path '$Path' is outside repo root '$Root'."
    }

    return $fullPath.Substring($rootWithSlash.Length).Replace('\', '/')
}

function Ensure-Tool {
    param(
        [string]$Url,
        [string]$Destination
    )

    if (Test-Path $Destination) {
        return
    }

    New-Item -ItemType Directory -Force -Path (Split-Path $Destination -Parent) | Out-Null
    Write-Status ("Downloading {0}..." -f (Split-Path $Destination -Leaf))
    Invoke-WithProxy { Invoke-WebRequest -Uri $Url -OutFile $Destination -UseBasicParsing }
}

function Write-Utf8NoBomFile {
    param(
        [string]$Path,
        [string]$Content
    )

    $utf8NoBom = [System.Text.UTF8Encoding]::new($false)
    [System.IO.File]::WriteAllText($Path, $Content, $utf8NoBom)
}

function Invoke-GeneratePackwizFiles {
    param([string]$OutputDir)

    $pythonExe = Resolve-PythonCommand
    & $pythonExe $GeneratePackwizScript --source (Join-Path $RepoRoot "modpack.toml") --output-dir $OutputDir
    if ($LASTEXITCODE -ne 0) {
        throw "generate-packwiz-files.py exited with code $LASTEXITCODE."
    }
}

try {
    Enter-SyncLock
    if ($IfGitChanged -and -not $Force -and (Test-SyncStateCompleted -StateKey $syncStateKey)) {
        Write-Host "[$HookName] Packwiz sync already completed for this revision; skipping duplicate run."
        return
    }

    Set-Location $RepoRoot

    $metadataFiles = @()
    foreach ($root in $MetadataRoots) {
        $fullRoot = Join-Path $RepoRoot $root
        if (Test-Path $fullRoot) {
            $metadataFiles += Get-ChildItem $fullRoot -Recurse -Filter *.pw.toml -File
        }
    }
    $metadataFiles = @($metadataFiles | Sort-Object FullName -Unique)

    if ($metadataFiles.Count -eq 0) {
        Write-Status "No *.pw.toml files were found. Nothing to sync."
        exit 0
    }

    $javaCommand = Resolve-JavaCommand
    $pythonExe = Resolve-PythonCommand
    Ensure-Tool -Url $PackwizUrl -Destination $PackwizExe
    Ensure-Tool -Url $InstallerUrl -Destination $InstallerJarPath

    if (Test-Path $PackRoot) {
        Remove-Item $PackRoot -Recurse -Force
    }
    New-Item -ItemType Directory -Force -Path $PackRoot | Out-Null
    $packwizIgnorePath = Join-Path $RepoRoot ".packwizignore"
    if (Test-Path $packwizIgnorePath) {
        Copy-Item $packwizIgnorePath (Join-Path $PackRoot ".packwizignore") -Force
    }
    Invoke-GeneratePackwizFiles -OutputDir $PackRoot

    $copiedMetadataPaths = @()
    foreach ($metadataFile in $metadataFiles) {
        $relativePath = Get-RelativeUnixPath -Root $RepoRoot -Path $metadataFile.FullName
        $destinationPath = Join-Path $PackRoot $relativePath
        $destinationDir = Split-Path $destinationPath -Parent
        New-Item -ItemType Directory -Force -Path $destinationDir | Out-Null
        Copy-Item $metadataFile.FullName $destinationPath -Force
        $copiedMetadataPaths += $destinationPath
    }

    if (Test-Path $PackwizFilesRoot) {
        Copy-Item $PackwizFilesRoot (Join-Path $PackRoot "packwiz-files") -Recurse -Force
    }

    $port = Get-FreePort
    $localPackwizFilesPrefix = "http://127.0.0.1:$port/packwiz-files/"
    foreach ($metadataPath in $copiedMetadataPaths) {
        $content = Get-Content $metadataPath -Raw
        if ($content -match $PackwizFilesRawUrlPattern) {
            Write-Utf8NoBomFile -Path $metadataPath -Content (Replace-PackwizFilesRawUrls -Content $content -Replacement $localPackwizFilesPrefix)
        }
    }

    if ($Side -ne "all") {
        Write-Status "Pruning temporary metadata for side: $Side"
        & $pythonExe $PackwizSideScript prune-metadata --base $PackRoot --target $Side
        if ($LASTEXITCODE -ne 0) {
            throw "packwiz-side.py prune-metadata exited with code $LASTEXITCODE."
        }
    }

    Write-Status ("Building temporary packwiz pack from {0} metadata file(s)..." -f $metadataFiles.Count)
    Push-Location $PackRoot
    try {
        Invoke-WithProxy { & $PackwizExe refresh }
        if ($LASTEXITCODE -ne 0) {
            throw "packwiz refresh exited with code $LASTEXITCODE."
        }
    }
    finally {
        Pop-Location
    }

    Remove-Item $ServeLog, $ServeErrLog -Force -ErrorAction SilentlyContinue
    $pythonExe = Resolve-PythonCommand
    $pythonArgs = @(
        ('"{0}"' -f $StaticServerScript),
        $port.ToString(),
        ('"{0}"' -f $PackRoot)
    )
    Write-Status ("Starting local static server on port {0}..." -f $port)
    $ServeProcess = Start-Process -FilePath $pythonExe -ArgumentList $pythonArgs -WorkingDirectory $PackRoot -WindowStyle Hidden -RedirectStandardOutput $ServeLog -RedirectStandardError $ServeErrLog -PassThru

    $packUrl = "http://127.0.0.1:$port/pack.toml"
    $serverReady = $false
    for ($i = 0; $i -lt 50; $i++) {
        try {
            Invoke-WebRequest -Uri $packUrl -UseBasicParsing | Out-Null
            $serverReady = $true
            break
        }
        catch {
            Start-Sleep -Milliseconds 200
        }
    }
    if (-not $serverReady) {
        throw "Local packwiz server did not start in time. Check $ServeErrLog."
    }

    Write-Status "Running packwiz-installer..."
    $javaArguments = @()
    if ($null -ne $script:ProxyConfig) {
        $javaArguments += "-Dhttp.proxyHost=$($script:ProxyConfig.Host)"
        $javaArguments += "-Dhttp.proxyPort=$($script:ProxyConfig.Port)"
        $javaArguments += "-Dhttps.proxyHost=$($script:ProxyConfig.Host)"
        $javaArguments += "-Dhttps.proxyPort=$($script:ProxyConfig.Port)"
        $javaArguments += "-Dhttp.nonProxyHosts=localhost|127.*|[::1]"
        $javaArguments += "-Dhttps.nonProxyHosts=localhost|127.*|[::1]"
    }
    $javaArguments += @(
        "-cp",
        $InstallerJarPath,
        "link.infra.packwiz.installer.Main",
        "--bootstrap-no-update",
        "-g",
        $packUrl
    )
    & $javaCommand @javaArguments
    if ($LASTEXITCODE -ne 0) {
        throw "packwiz-installer exited with code $LASTEXITCODE."
    }

    Write-Status "Sync finished successfully."
    Write-SyncState -StateKey $syncStateKey
}
finally {
    if ($ServeProcess -and -not $ServeProcess.HasExited) {
        Stop-Process -Id $ServeProcess.Id -Force -ErrorAction SilentlyContinue
    }
    Exit-SyncLock
}
