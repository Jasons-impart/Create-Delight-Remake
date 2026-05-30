[CmdletBinding()]
param(
    [string]$Category = "mods",
    [string]$PackwizUrl = "https://github.com/Jasons-impart/packwiz/releases/latest/download/packwiz.exe",
    [string]$InstallerUrl = "https://github.com/packwiz/packwiz-installer/releases/latest/download/packwiz-installer.jar"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

$RepoRoot = Split-Path -Parent $PSScriptRoot
$ToolsRoot = Join-Path $RepoRoot ".cache\packwiz-sync\tools"
$PackwizExe = Join-Path $ToolsRoot "packwiz.exe"
$InstallerJarPath = Join-Path $ToolsRoot "packwiz-installer.jar"
$PackwizFilesModsRoot = Join-Path $RepoRoot "packwiz-files\mods"
$PackwizFilesRawPrefix = "https://raw.githubusercontent.com/Jasons-impart/Create-Delight-Remake/main/packwiz-files/"
$TempDetectRoot = Join-Path $RepoRoot ".cache\packwiz-sync\cf-add"
$StaticServerScript = Join-Path $PSScriptRoot "packwiz-static-server.py"
$GeneratePackwizScript = Join-Path $PSScriptRoot "generate-packwiz-files.py"
$CurseForgeProbeCachePath = Join-Path $RepoRoot ".cache\packwiz-sync\cf-downloadability-cache.json"
$script:CurseForgeProbeCache = $null
$script:CurseForgeProbeTools = $null

function Write-Status { param([string]$M) Write-Host "[meta] $M" -ForegroundColor Cyan }
function Write-Warn   { param([string]$M) Write-Host "[warn] $M" -ForegroundColor Yellow }

function Get-ToolEnsured {
    param([string]$Url, [string]$Path)

    if (Test-Path $Path) { return }

    New-Item -ItemType Directory -Force -Path (Split-Path $Path -Parent) | Out-Null
    Write-Status ("Downloading {0}..." -f (Split-Path $Path -Leaf))
    Invoke-WebRequest -Uri $Url -OutFile $Path -UseBasicParsing
}

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

function Invoke-GeneratePackwizFiles {
    param([string]$OutputDir = $RepoRoot)

    $pythonExe = Resolve-PythonCommand
    & $pythonExe $GeneratePackwizScript --source (Join-Path $RepoRoot "modpack.toml") --output-dir $OutputDir
    if ($LASTEXITCODE -ne 0) {
        throw "generate-packwiz-files.py exited with code $LASTEXITCODE."
    }
}

function Get-AssetFiles {
    param([string]$Directory)

    $files = @{}
    if (-not (Test-Path $Directory)) { return $files }

    Get-ChildItem -LiteralPath $Directory -File |
        Where-Object { $_.Extension -match '^\.(jar|zip)$' } |
        ForEach-Object {
            $files[$_.Name] = $_.FullName
        }

    return $files
}

function Derive-BaseName {
    param([string]$Filename)

    if (-not $Filename) { return "" }

    $name = [IO.Path]::GetFileNameWithoutExtension($Filename)
    $parts = $name -split '[-_]'
    $baseParts = @()

    foreach ($p in $parts) {
        if ($p -match '^v?\d') { break }
        if ($p -match '^(forge|fabric|neoforge|quilt|mc\d|release|alpha|beta|for|neo)$') { continue }
        $baseParts += $p
    }

    if (-not $baseParts) { return $name.ToLowerInvariant() }
    return ($baseParts -join '_').ToLowerInvariant()
}

function Get-SearchStemFromFilename {
    param([string]$Filename)

    if (-not $Filename) { return "" }

    $name = [IO.Path]::GetFileNameWithoutExtension($Filename)
    $parts = $name -split '[-_]'
    $kept = @()

    foreach ($part in $parts) {
        $trimmed = $part.Trim()
        if (-not $trimmed) { continue }
        if ($trimmed -match '^v?\d') { break }
        if ($trimmed -match '^(forge|fabric|neoforge|quilt|release|alpha|beta|snapshot|universal|all)$') { continue }
        if ($trimmed -match '^mc\d') { continue }
        $kept += $trimmed
    }

    if ($kept.Count -gt 0) {
        return ($kept -join ' ')
    }

    return $name
}

function Get-NaturalSortKey {
    param([string]$Value)

    if (-not $Value) { return "" }

    return [regex]::Replace($Value.ToLowerInvariant(), '\d+', {
        param($Match)
        $Match.Value.PadLeft(20, '0')
    })
}

function Get-PreferredFilename {
    param([string[]]$Filenames)

    $candidates = @($Filenames | Where-Object { -not [string]::IsNullOrWhiteSpace($_) } | Select-Object -Unique)
    if ($candidates.Count -eq 0) { return $null }

    $sortedCandidates = @($candidates | Sort-Object { Get-NaturalSortKey -Value $_ })
    return $sortedCandidates[-1]
}

function Split-IdentifierWords {
    param([string]$Text)

    if (-not $Text) { return @() }

    $normalized = $Text
    $normalized = $normalized -creplace '([a-z0-9])([A-Z])', '$1 $2'
    $normalized = $normalized -creplace '([A-Z]+)([A-Z][a-z])', '$1 $2'
    $normalized = $normalized -replace '[_\-.]+', ' '
    $normalized = $normalized -replace '\s+', ' '
    $normalized = $normalized.Trim()

    if (-not $normalized) { return @() }
    return @($normalized -split ' ')
}

function Join-IdentifierWords {
    param(
        [string]$Text,
        [string]$Separator = " "
    )

    $words = @(Split-IdentifierWords -Text $Text)
    if ($words.Count -eq 0) { return $null }

    return (($words | ForEach-Object { $_.ToLowerInvariant() }) -join $Separator)
}

function Write-Utf8NoBomFile {
    param([string]$Path, [string]$Content)

    $enc = [Text.UTF8Encoding]::new($false)
    [IO.File]::WriteAllText($Path, $Content, $enc)
}

function Escape-TomlString {
    param([string]$Value)

    if ($null -eq $Value) { return "" }

    return ($Value -replace '\\', '\\\\' -replace '"', '\"')
}

function Convert-ToMetaSlug {
    param([string]$Value)

    if ([string]::IsNullOrWhiteSpace($Value)) { return $null }

    $slug = $Value.Trim().ToLowerInvariant()
    $slug = $slug -replace '[^a-z0-9]+', '-'
    $slug = $slug.Trim('-')

    if (-not $slug) { return $null }
    return $slug
}

function Parse-PwToml {
    param([string]$Path)

    $content = Get-Content -LiteralPath $Path -Raw
    $result = @{}

    if ($content -match '(?m)^name\s*=\s*"(.+)"')     { $result['Name'] = $Matches[1] }
    if ($content -match '(?m)^filename\s*=\s*"(.+)"') { $result['Filename'] = $Matches[1] }
    if ($content -match '(?m)^side\s*=\s*"(.+)"')     { $result['Side'] = $Matches[1] }
    if ($content -match '(?m)^url\s*=\s*"(.+)"')      { $result['DownloadUrl'] = $Matches[1] }

    $hasMetadataMode = $content -match 'mode\s*=\s*"metadata:(curseforge|modrinth)"'
    $hasUpdateBlock = $content -match '\[update\.(curseforge|modrinth)\]'
    $result['IsManaged'] = ($hasMetadataMode -or $hasUpdateBlock)

    return $result
}

function Get-PwMetadataState {
    param([string]$ModsDirectory)

    $pwTomls = @(Get-ChildItem -LiteralPath $ModsDirectory -Filter *.pw.toml -File)
    $pwEntries = @()
    $filenameOwners = @{}
    $referencedFilenames = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::OrdinalIgnoreCase)

    foreach ($pwToml in $pwTomls) {
        $data = Parse-PwToml -Path $pwToml.FullName
        $currentFilename = Get-TomlVal -Data $data -Key 'Filename'
        $name = Get-TomlVal -Data $data -Key 'Name'
        $entry = [pscustomobject]@{
            PwTomlPath = $pwToml.FullName
            PwTomlName = $pwToml.Name
            Slug = [IO.Path]::GetFileNameWithoutExtension($pwToml.Name) -replace '\.pw$'
            Filename = $currentFilename
            Name = $name
            Side = Normalize-PwSide -Side (Get-TomlVal -Data $data -Key 'Side')
            Data = $data
            IsManaged = [bool](Get-TomlVal -Data $data -Key 'IsManaged')
        }

        $pwEntries += $entry

        if ($currentFilename) {
            $referencedFilenames.Add($currentFilename) | Out-Null
            if (-not $filenameOwners.ContainsKey($currentFilename)) {
                $filenameOwners[$currentFilename] = @()
            }
            $filenameOwners[$currentFilename] += $entry
        }
    }

    return [pscustomobject]@{
        PwTomls = $pwTomls
        PwEntries = $pwEntries
        FilenameOwners = $filenameOwners
        ReferencedFilenames = $referencedFilenames
    }
}

function Get-TomlVal {
    param([hashtable]$Data, [string]$Key)

    if ($Data -and $Data.ContainsKey($Key)) { return $Data[$Key] }
    return $null
}

function Normalize-PwSide {
    param([string]$Side)

    if ([string]::IsNullOrWhiteSpace($Side)) { return "both" }
    $normalized = $Side.Trim().ToLowerInvariant()
    if (@("both", "client", "server") -contains $normalized) { return $normalized }
    return "both"
}

function Set-PwTomlSide {
    param(
        [string]$Content,
        [string]$Side
    )

    $sideValue = Normalize-PwSide -Side $Side
    if ($Content -match '(?m)^side\s*=\s*".*"$') {
        return [regex]::Replace($Content, '(?m)^side\s*=\s*".*"$', "side = `"$sideValue`"", 1)
    }
    if ($Content -match '(?m)^filename\s*=') {
        return [regex]::Replace($Content, '(?m)^(filename\s*=\s*".*"\s*)$', "`$1`nside = `"$sideValue`"", 1)
    }
    return "side = `"$sideValue`"`n$Content"
}

function Get-CurseForgeMetadataIdentity {
    param([string]$Content)

    if (-not $Content) { return $null }
    if ($Content -notmatch '(?m)^project-id\s*=\s*(\d+)\s*$') { return $null }
    $projectId = [int64]$Matches[1]
    if ($Content -notmatch '(?m)^file-id\s*=\s*(\d+)\s*$') { return $null }
    $fileId = [int64]$Matches[1]

    return [pscustomobject]@{
        ProjectId = $projectId
        FileId = $fileId
        CacheKey = "{0}:{1}" -f $projectId, $fileId
    }
}

function Get-CurseForgeProbeCache {
    if ($null -ne $script:CurseForgeProbeCache) {
        return $script:CurseForgeProbeCache
    }

    $cache = @{}
    if (Test-Path $CurseForgeProbeCachePath) {
        try {
            $raw = Get-Content -LiteralPath $CurseForgeProbeCachePath -Raw
            if (-not [string]::IsNullOrWhiteSpace($raw)) {
                $data = ConvertFrom-Json -InputObject $raw
                if ($data) {
                    foreach ($property in $data.PSObject.Properties) {
                        $entry = [ordered]@{}
                        if ($property.Value) {
                            foreach ($entryProperty in $property.Value.PSObject.Properties) {
                                $entry[$entryProperty.Name] = $entryProperty.Value
                            }
                        }
                        $cache[$property.Name] = $entry
                    }
                }
            }
        }
        catch {
            Write-Warn "  ! Failed to read CurseForge downloadability cache; rebuilding it this run."
        }
    }

    $script:CurseForgeProbeCache = $cache
    return $script:CurseForgeProbeCache
}

function Save-CurseForgeProbeCache {
    $cache = Get-CurseForgeProbeCache
    $cacheDir = Split-Path $CurseForgeProbeCachePath -Parent
    New-Item -ItemType Directory -Force -Path $cacheDir | Out-Null

    $orderedCache = [ordered]@{}
    foreach ($key in @($cache.Keys | Sort-Object)) {
        $orderedCache[$key] = $cache[$key]
    }

    $json = $orderedCache | ConvertTo-Json -Depth 6
    Write-Utf8NoBomFile -Path $CurseForgeProbeCachePath -Content $json
}

function Initialize-CurseForgeProbeTools {
    if ($script:CurseForgeProbeTools) {
        return $script:CurseForgeProbeTools
    }

    Get-ToolEnsured -Url $InstallerUrl -Path $InstallerJarPath
    if (-not (Test-Path $StaticServerScript)) {
        throw "Static server script was not found at '$StaticServerScript'."
    }

    $script:CurseForgeProbeTools = [pscustomobject]@{
        JavaCommand = Resolve-JavaCommand
        PythonCommand = Resolve-PythonCommand
    }
    return $script:CurseForgeProbeTools
}

function Get-FirstMeaningfulOutputLine {
    param([object[]]$Lines)

    foreach ($line in $Lines) {
        $text = [string]$line
        if ([string]::IsNullOrWhiteSpace($text)) { continue }

        $trimmed = $text.Trim()
        if (-not $trimmed) { continue }
        if ($trimmed -match '^\d+\s+mods? to install') { continue }
        if ($trimmed -match '^Loading modpack') { continue }
        if ($trimmed -match '^Refreshing index') { continue }
        if ($trimmed -match '^Updating your files') { continue }
        if ($trimmed -match '^Starting install') { continue }

        return $trimmed
    }

    return $null
}

function Invoke-NativeCapture {
    param([scriptblock]$Command)

    $previousErrorActionPreference = $ErrorActionPreference
    $nativePreferenceVariable = Get-Variable -Name PSNativeCommandUseErrorActionPreference -ErrorAction SilentlyContinue
    $hasNativePreference = $null -ne $nativePreferenceVariable
    $previousNativePreference = $null

    if ($hasNativePreference) {
        $previousNativePreference = $nativePreferenceVariable.Value
        $script:PSNativeCommandUseErrorActionPreference = $false
    }

    $script:ErrorActionPreference = "Continue"
    try {
        return & $Command 2>&1
    }
    finally {
        $script:ErrorActionPreference = $previousErrorActionPreference
        if ($hasNativePreference) {
            $script:PSNativeCommandUseErrorActionPreference = $previousNativePreference
        }
    }
}

function New-CurseForgeProbeWorkspace {
    $root = Join-Path $TempDetectRoot ("probe-" + [guid]::NewGuid().Guid)
    $packRoot = Join-Path $root "pack"
    $modsRoot = Join-Path $packRoot "mods"
    $installRoot = Join-Path $root "install"

    New-Item -ItemType Directory -Force -Path $modsRoot | Out-Null
    New-Item -ItemType Directory -Force -Path $installRoot | Out-Null

    $packwizIgnorePath = Join-Path $RepoRoot ".packwizignore"
    if (Test-Path $packwizIgnorePath) {
        Copy-Item $packwizIgnorePath (Join-Path $packRoot ".packwizignore") -Force
    }

    Invoke-GeneratePackwizFiles -OutputDir $packRoot

    return [pscustomobject]@{
        Root = $root
        PackRoot = $packRoot
        ModsRoot = $modsRoot
        InstallRoot = $installRoot
        ServeLog = Join-Path $root "serve.log"
        ServeErrLog = Join-Path $root "serve.err.log"
    }
}

function Get-CurseForgeDownloadability {
    param(
        [string]$Content,
        [string]$MetaFileName,
        [string]$Name
    )

    $identity = Get-CurseForgeMetadataIdentity -Content $Content
    if (-not $identity) {
        return [pscustomobject]@{
            Status = "unknown"
            UsedCache = $false
            Reason = "Metadata is missing a CurseForge project-id or file-id."
        }
    }

    $cache = Get-CurseForgeProbeCache
    if ($cache.ContainsKey($identity.CacheKey)) {
        $cached = $cache[$identity.CacheKey]
        $cachedStatus = $cached['status']
        if ($cachedStatus -in @("downloadable", "restricted")) {
            return [pscustomobject]@{
                Status = $cachedStatus
                UsedCache = $true
                Reason = $(if ($cachedStatus -eq "downloadable") { "Cached as third-party downloadable." } else { "Cached as manual-download only." })
            }
        }
    }

    try {
        $tools = Initialize-CurseForgeProbeTools
    }
    catch {
        return [pscustomobject]@{
            Status = "unknown"
            UsedCache = $false
            Reason = $_.Exception.Message
        }
    }

    $workspace = New-CurseForgeProbeWorkspace
    $serveProcess = $null
    try {
        $probeMetaName = $MetaFileName
        if ([string]::IsNullOrWhiteSpace($probeMetaName)) {
            $probeMetaName = "probe-{0}-{1}.pw.toml" -f $identity.ProjectId, $identity.FileId
        }

        Write-Utf8NoBomFile -Path (Join-Path $workspace.ModsRoot $probeMetaName) -Content $Content

        $refreshResult = Invoke-PackwizCommand -WorkingDirectory $workspace.PackRoot -Arguments @("refresh")
        if ($refreshResult.ExitCode -ne 0) {
            $reason = Get-FirstMeaningfulOutputLine -Lines $refreshResult.Output
            if (-not $reason) {
                $reason = "packwiz refresh exited with code $($refreshResult.ExitCode)."
            }

            return [pscustomobject]@{
                Status = "unknown"
                UsedCache = $false
                Reason = $reason
            }
        }

        Remove-Item $workspace.ServeLog, $workspace.ServeErrLog -Force -ErrorAction SilentlyContinue
        $port = Get-FreePort
        $packUrl = "http://127.0.0.1:$port/pack.toml"
        $pythonArgs = @(
            ('"{0}"' -f $StaticServerScript),
            $port.ToString(),
            ('"{0}"' -f $workspace.PackRoot)
        )
        $serveProcess = Start-Process -FilePath $tools.PythonCommand -ArgumentList $pythonArgs -WorkingDirectory $workspace.PackRoot -WindowStyle Hidden -RedirectStandardOutput $workspace.ServeLog -RedirectStandardError $workspace.ServeErrLog -PassThru

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
            $serveError = $null
            if (Test-Path $workspace.ServeErrLog) {
                $serveError = Get-Content -LiteralPath $workspace.ServeErrLog -Raw
            }

            return [pscustomobject]@{
                Status = "unknown"
                UsedCache = $false
                Reason = $(if ($serveError) { $serveError.Trim() } else { "Local probe server did not start in time." })
            }
        }

        Push-Location $workspace.InstallRoot
        try {
            $installerOutput = Invoke-NativeCapture { & $tools.JavaCommand -cp $InstallerJarPath "link.infra.packwiz.installer.Main" "--bootstrap-no-update" "-g" $packUrl }
            $installerExitCode = $LASTEXITCODE
        }
        finally {
            Pop-Location
        }

        $installerText = (@($installerOutput) | ForEach-Object { [string]$_ }) -join "`n"
        if ($installerText -match 'excluded from the CurseForge API and must be downloaded manually') {
            $cache[$identity.CacheKey] = [ordered]@{
                projectId = $identity.ProjectId
                fileId = $identity.FileId
                status = "restricted"
                name = $Name
                checkedAt = [DateTime]::UtcNow.ToString("o")
            }
            Save-CurseForgeProbeCache

            return [pscustomobject]@{
                Status = "restricted"
                UsedCache = $false
                Reason = "CurseForge marks this file as manual-download only."
            }
        }

        if ($installerExitCode -eq 0) {
            $cache[$identity.CacheKey] = [ordered]@{
                projectId = $identity.ProjectId
                fileId = $identity.FileId
                status = "downloadable"
                name = $Name
                checkedAt = [DateTime]::UtcNow.ToString("o")
            }
            Save-CurseForgeProbeCache

            return [pscustomobject]@{
                Status = "downloadable"
                UsedCache = $false
                Reason = "packwiz-installer completed successfully."
            }
        }

        $reason = Get-FirstMeaningfulOutputLine -Lines $installerOutput
        if (-not $reason) {
            $reason = "packwiz-installer exited with code $installerExitCode."
        }

        return [pscustomobject]@{
            Status = "unknown"
            UsedCache = $false
            Reason = $reason
        }
    }
    finally {
        if ($serveProcess -and -not $serveProcess.HasExited) {
            Stop-Process -Id $serveProcess.Id -Force -ErrorAction SilentlyContinue
        }
        if ($workspace) {
            Remove-Item -LiteralPath $workspace.Root -Recurse -Force -ErrorAction SilentlyContinue
        }
    }
}

function Invoke-PackwizCommand {
    param(
        [string[]]$Arguments,
        [string]$WorkingDirectory = $RepoRoot
    )

    Push-Location $WorkingDirectory
    try {
        $output = Invoke-NativeCapture { & $PackwizExe @Arguments }
        return [pscustomobject]@{
            ExitCode = $LASTEXITCODE
            Output = @($output)
        }
    }
    finally {
        Pop-Location
    }
}

function Add-UniqueCandidate {
    param(
        [System.Collections.Generic.List[string]]$Candidates,
        [System.Collections.Generic.HashSet[string]]$Seen,
        [string]$Value
    )

    if ([string]::IsNullOrWhiteSpace($Value)) { return }

    $trimmed = $Value.Trim()
    if ($trimmed.Length -lt 2) { return }

    $key = $trimmed.ToLowerInvariant()
    if ($Seen.Add($key)) {
        $Candidates.Add($trimmed) | Out-Null
    }
}

function Read-ZipEntryText {
    param(
        [System.IO.Compression.ZipArchive]$Archive,
        [string]$EntryPath
    )

    $entry = $Archive.GetEntry($EntryPath)
    if (-not $entry) { return $null }

    $stream = $entry.Open()
    try {
        $reader = [System.IO.StreamReader]::new($stream)
        try {
            return $reader.ReadToEnd()
        }
        finally {
            $reader.Dispose()
        }
    }
    finally {
        $stream.Dispose()
    }
}

function Get-JarMetadata {
    param([string]$Path)

    $result = @{
        DisplayName = $null
        ModId = $null
    }

    if (-not (Test-Path $Path)) { return $result }

    try {
        Add-Type -AssemblyName System.IO.Compression.FileSystem -ErrorAction SilentlyContinue
        $archive = [System.IO.Compression.ZipFile]::OpenRead($Path)
        try {
            $modsToml = Read-ZipEntryText -Archive $archive -EntryPath "META-INF/mods.toml"
            if (-not $modsToml) {
                $modsToml = Read-ZipEntryText -Archive $archive -EntryPath "META-INF/neoforge.mods.toml"
            }

            if ($modsToml) {
                if ($modsToml -match '(?ms)\[\[mods\]\].*?modId\s*=\s*"([^"]+)"') {
                    $result['ModId'] = $Matches[1]
                }
                if ($modsToml -match '(?ms)\[\[mods\]\].*?displayName\s*=\s*"([^"]+)"') {
                    $result['DisplayName'] = $Matches[1]
                }
            }

            if (-not $result['DisplayName'] -or -not $result['ModId']) {
                $fabricMeta = Read-ZipEntryText -Archive $archive -EntryPath "fabric.mod.json"
                if ($fabricMeta) {
                    if (-not $result['ModId'] -and $fabricMeta -match '"id"\s*:\s*"([^"]+)"') {
                        $result['ModId'] = $Matches[1]
                    }
                    if (-not $result['DisplayName'] -and $fabricMeta -match '"name"\s*:\s*"([^"]+)"') {
                        $result['DisplayName'] = $Matches[1]
                    }
                }
            }

            if (-not $result['DisplayName'] -or -not $result['ModId']) {
                $quiltMeta = Read-ZipEntryText -Archive $archive -EntryPath "quilt.mod.json"
                if ($quiltMeta) {
                    if (-not $result['ModId'] -and $quiltMeta -match '"id"\s*:\s*"([^"]+)"') {
                        $result['ModId'] = $Matches[1]
                    }
                    if (-not $result['DisplayName'] -and $quiltMeta -match '"name"\s*:\s*"([^"]+)"') {
                        $result['DisplayName'] = $Matches[1]
                    }
                }
            }
        }
        finally {
            $archive.Dispose()
        }
    }
    catch {}

    return $result
}

function Get-DisplayNameFromSource {
    param(
        [string]$Filename,
        [hashtable]$JarMetadata
    )

    $displayName = Get-TomlVal -Data $JarMetadata -Key 'DisplayName'
    if ($displayName) { return $displayName }

    $searchStem = Get-SearchStemFromFilename -Filename $Filename
    if ($searchStem) {
        $words = @(Split-IdentifierWords -Text $searchStem)
        if ($words.Count -gt 0) {
            return ($words -join ' ')
        }
    }

    return [IO.Path]::GetFileNameWithoutExtension($Filename)
}

function Get-CurseForgeCandidates {
    param(
        [string]$Filename,
        [hashtable]$JarMetadata
    )

    $candidates = [System.Collections.Generic.List[string]]::new()
    $seen = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::OrdinalIgnoreCase)
    $fullStem = [IO.Path]::GetFileNameWithoutExtension($Filename)
    $searchStem = Get-SearchStemFromFilename -Filename $Filename
    $baseName = Derive-BaseName -Filename $Filename

    $preferredValues = @(
        (Get-TomlVal -Data $JarMetadata -Key 'ModId'),
        $baseName,
        ($baseName -replace '_', '-'),
        $fullStem,
        $searchStem,
        (Get-TomlVal -Data $JarMetadata -Key 'DisplayName')
    )

    foreach ($value in $preferredValues) {
        Add-UniqueCandidate -Candidates $candidates -Seen $seen -Value (Join-IdentifierWords -Text $value -Separator "-")
        Add-UniqueCandidate -Candidates $candidates -Seen $seen -Value $value
        Add-UniqueCandidate -Candidates $candidates -Seen $seen -Value (Join-IdentifierWords -Text $value -Separator "")
        Add-UniqueCandidate -Candidates $candidates -Seen $seen -Value (Join-IdentifierWords -Text $value -Separator " ")
    }

    return @($candidates)
}

function New-DetectionWorkspace {
    $workspace = Join-Path $TempDetectRoot ([guid]::NewGuid().Guid)
    New-Item -ItemType Directory -Force -Path (Join-Path $workspace "mods") | Out-Null
    Invoke-GeneratePackwizFiles -OutputDir $workspace
    return $workspace
}

function Try-ResolveCurseForgeMetadata {
    param(
        [string]$SourcePath,
        [string]$SourceFilename,
        [string[]]$Candidates
    )

    $detectWorkspace = New-DetectionWorkspace
    try {
        Copy-Item -LiteralPath $SourcePath -Destination (Join-Path $detectWorkspace "mods\$SourceFilename") -Force
        $detectResult = Invoke-PackwizCommand -WorkingDirectory $detectWorkspace -Arguments @("curseforge", "detect", "--yes")
        if ($detectResult.ExitCode -eq 0) {
            $detectedPwTomls = @(Get-ChildItem -LiteralPath (Join-Path $detectWorkspace "mods") -Filter *.pw.toml -File)
            foreach ($pwToml in $detectedPwTomls) {
                $data = Parse-PwToml -Path $pwToml.FullName
                $resolvedFilename = Get-TomlVal -Data $data -Key 'Filename'
                if ($resolvedFilename -ne $SourceFilename) { continue }
                if (-not (Get-TomlVal -Data $data -Key 'IsManaged')) { continue }

                return [pscustomobject]@{
                    IsExactMatch = $true
                    Candidate = "curseforge-detect"
                    Name = Get-TomlVal -Data $data -Key 'Name'
                    MetaFileName = $pwToml.Name
                    Content = Get-Content -LiteralPath $pwToml.FullName -Raw
                    ResolvedFilename = $resolvedFilename
                }
            }
        }
    }
    finally {
        Remove-Item -LiteralPath $detectWorkspace -Recurse -Force -ErrorAction SilentlyContinue
    }

    $bestMismatch = $null
    foreach ($candidate in $Candidates) {
        $workspace = New-DetectionWorkspace
        try {
            $result = Invoke-PackwizCommand -WorkingDirectory $workspace -Arguments @("curseforge", "add", $candidate, "--yes")
            if ($result.ExitCode -ne 0) { continue }

            $mainProjectName = $null
            $mainProjectFilename = $null
            foreach ($line in $result.Output) {
                $text = [string]$line
                if ($text -match '^Project "(.+)" successfully added! \((.+)\)$') {
                    $mainProjectName = $Matches[1]
                    $mainProjectFilename = $Matches[2]
                    break
                }
            }

            if (-not $mainProjectFilename) { continue }

            $generatedPwTomls = @(Get-ChildItem -LiteralPath (Join-Path $workspace "mods") -Filter *.pw.toml -File)
            $generatedPwToml = $null
            foreach ($pwToml in $generatedPwTomls) {
                $pwData = Parse-PwToml -Path $pwToml.FullName
                $pwFilename = Get-TomlVal -Data $pwData -Key 'Filename'
                if ($pwFilename -eq $mainProjectFilename) {
                    $generatedPwToml = $pwToml
                    break
                }
            }

            if (-not $generatedPwToml) { continue }
            $data = Parse-PwToml -Path $generatedPwToml.FullName
            $resolvedFilename = Get-TomlVal -Data $data -Key 'Filename'

            if (-not (Get-TomlVal -Data $data -Key 'IsManaged')) { continue }
            if ($resolvedFilename -ne $SourceFilename) {
                if (-not $bestMismatch) {
                    $bestMismatch = [pscustomobject]@{
                        IsExactMatch = $false
                        Candidate = $candidate
                        Name = $(if ($mainProjectName) { $mainProjectName } else { Get-TomlVal -Data $data -Key 'Name' })
                        MetaFileName = $generatedPwToml.Name
                        Content = Get-Content -LiteralPath $generatedPwToml.FullName -Raw
                        ResolvedFilename = $resolvedFilename
                    }
                }
                continue
            }

            return [pscustomobject]@{
                IsExactMatch = $true
                Candidate = $candidate
                Name = $(if ($mainProjectName) { $mainProjectName } else { Get-TomlVal -Data $data -Key 'Name' })
                MetaFileName = $generatedPwToml.Name
                Content = Get-Content -LiteralPath $generatedPwToml.FullName -Raw
                ResolvedFilename = $resolvedFilename
            }
        }
        finally {
            Remove-Item -LiteralPath $workspace -Recurse -Force -ErrorAction SilentlyContinue
        }
    }

    return $bestMismatch
}

function Get-UniqueMetaName {
    param(
        [string]$PreferredName,
        [string]$Directory
    )

    $baseName = Convert-ToMetaSlug -Value $PreferredName
    if (-not $baseName) {
        $baseName = "mod"
    }

    $candidate = $baseName
    $suffix = 2
    while (Test-Path (Join-Path $Directory ($candidate + ".pw.toml"))) {
        $candidate = "{0}-{1}" -f $baseName, $suffix
        $suffix++
    }

    return $candidate
}

function Add-PackwizFilesMetadata {
    param(
        [string]$SourcePath,
        [string]$SourceFilename,
        [hashtable]$JarMetadata,
        [string]$ModsDirectory,
        [string]$PwTomlPath = $null,
        [string]$DisplayName = $null,
        [string]$Side = $null
    )

    New-Item -ItemType Directory -Force -Path $PackwizFilesModsRoot | Out-Null

    $packwizFilePath = Join-Path $PackwizFilesModsRoot $SourceFilename
    Copy-Item -LiteralPath $SourcePath -Destination $packwizFilePath -Force

    if (-not $DisplayName) {
        $DisplayName = Get-DisplayNameFromSource -Filename $SourceFilename -JarMetadata $JarMetadata
    }
    if (-not $PwTomlPath) {
        $metaName = Get-UniqueMetaName -PreferredName $DisplayName -Directory $ModsDirectory
        $PwTomlPath = Join-Path $ModsDirectory ($metaName + ".pw.toml")
    }

    $hash = (Get-FileHash -LiteralPath $packwizFilePath -Algorithm SHA256).Hash.ToLowerInvariant()
    $escapedName = Escape-TomlString -Value $DisplayName
    $escapedFilename = Escape-TomlString -Value $SourceFilename
    $url = $PackwizFilesRawPrefix + "mods/" + [Uri]::EscapeDataString($SourceFilename)
    if (-not $Side -and $PwTomlPath -and (Test-Path $PwTomlPath)) {
        $existingData = Parse-PwToml -Path $PwTomlPath
        $Side = Get-TomlVal -Data $existingData -Key 'Side'
    }
    $sideValue = Normalize-PwSide -Side $Side

    $content = @"
name = "$escapedName"
filename = "$escapedFilename"
side = "$sideValue"

[download]
url = "$url"
hash-format = "sha256"
hash = "$hash"
"@

    Write-Utf8NoBomFile -Path $PwTomlPath -Content $content

    return [pscustomobject]@{
        Name = $DisplayName
        PwTomlPath = $PwTomlPath
    }
}

function Remove-PackwizFilesAssetIfOwned {
    param(
        [string]$Filename,
        [hashtable]$FilenameOwners
    )

    if (-not $Filename) { return }

    $assetPath = Join-Path $PackwizFilesModsRoot $Filename
    if (-not (Test-Path $assetPath)) { return }

    $owners = @()
    if ($FilenameOwners.ContainsKey($Filename)) {
        $owners = @($FilenameOwners[$Filename])
    }

    if ($owners.Count -gt 1) {
        Write-Warn "  ! Local asset '$Filename' is referenced by multiple metadata files; skipping asset deletion."
        return
    }

    Remove-Item -LiteralPath $assetPath -Force
}

function Get-LocalMetadataSourcePath {
    param(
        [pscustomobject]$Entry,
        [hashtable]$SourceFiles,
        [hashtable]$PackwizFiles
    )

    $filename = $Entry.Filename
    if (-not $filename) { return $null }

    $downloadUrl = Get-TomlVal -Data $Entry.Data -Key 'DownloadUrl'
    if ($downloadUrl -and $downloadUrl.StartsWith($PackwizFilesRawPrefix, [System.StringComparison]::OrdinalIgnoreCase)) {
        if ($PackwizFiles.ContainsKey($filename)) {
            return $PackwizFiles[$filename]
        }
    }

    if ($SourceFiles.ContainsKey($filename)) {
        return $SourceFiles[$filename]
    }

    if ($PackwizFiles.ContainsKey($filename)) {
        return $PackwizFiles[$filename]
    }

    return $null
}

try {
    if ($Category -ne "mods") {
        throw "This script currently only supports the 'mods' category."
    }

    Get-ToolEnsured -Url $PackwizUrl -Path $PackwizExe
    Invoke-GeneratePackwizFiles -OutputDir $RepoRoot

    $modsDir = Join-Path $RepoRoot $Category
    if (-not (Test-Path $modsDir)) {
        Write-Status "No '$Category' directory found."
        exit 0
    }

    Write-Status "Scanning category: $Category"

    $sourceFiles = Get-AssetFiles -Directory $modsDir
    $packwizFiles = Get-AssetFiles -Directory $PackwizFilesModsRoot
    $metadataState = Get-PwMetadataState -ModsDirectory $modsDir
    $pwEntries = @($metadataState.PwEntries)
    $filenameOwners = $metadataState.FilenameOwners
    $referencedFilenames = $metadataState.ReferencedFilenames
    $newFilesByBase = @{}

    foreach ($sourceName in $sourceFiles.Keys) {
        $base = Derive-BaseName -Filename $sourceName
        if (-not $base) { continue }
        if (-not $newFilesByBase.ContainsKey($base)) {
            $newFilesByBase[$base] = @()
        }
        $newFilesByBase[$base] += $sourceName
    }

    $migratedToCurseForgeCount = 0
    foreach ($entry in $pwEntries) {
        if ($entry.IsManaged) { continue }

        $currentFilename = $entry.Filename
        if (-not $currentFilename) { continue }

        $sourcePath = Get-LocalMetadataSourcePath -Entry $entry -SourceFiles $sourceFiles -PackwizFiles $packwizFiles
        if (-not $sourcePath) { continue }

        $jarMetadata = Get-JarMetadata -Path $sourcePath
        $candidates = @(Get-CurseForgeCandidates -Filename $currentFilename -JarMetadata $jarMetadata)
        if ($candidates.Count -eq 0) { continue }

        $cfMetadata = Try-ResolveCurseForgeMetadata -SourcePath $sourcePath -SourceFilename $currentFilename -Candidates $candidates
        if (-not $cfMetadata) { continue }

        if (-not $cfMetadata.IsExactMatch) {
            Write-Warn "  ! CurseForge project '$($cfMetadata.Name)' was found for '$currentFilename', but it resolved to '$($cfMetadata.ResolvedFilename)'. Keeping packwiz-files metadata."
            continue
        }

        $downloadability = Get-CurseForgeDownloadability -Content $cfMetadata.Content -MetaFileName $cfMetadata.MetaFileName -Name $cfMetadata.Name
        if ($downloadability.Status -eq "restricted") {
            Write-Status "  ~ Keeping packwiz-files (CurseForge requires manual download): $($cfMetadata.Name)"
            continue
        }
        if ($downloadability.Status -ne "downloadable") {
            Write-Warn "  ! Could not verify third-party download for '$($cfMetadata.Name)'; keeping packwiz-files metadata. $($downloadability.Reason)"
            continue
        }

        Write-Utf8NoBomFile -Path $entry.PwTomlPath -Content (Set-PwTomlSide -Content $cfMetadata.Content -Side $entry.Side)

        $downloadUrl = Get-TomlVal -Data $entry.Data -Key 'DownloadUrl'
        if ($downloadUrl -and $downloadUrl.StartsWith($PackwizFilesRawPrefix, [System.StringComparison]::OrdinalIgnoreCase)) {
            Remove-PackwizFilesAssetIfOwned -Filename $currentFilename -FilenameOwners $filenameOwners
            if ($packwizFiles.ContainsKey($currentFilename)) {
                $packwizFiles.Remove($currentFilename) | Out-Null
            }
        }

        Write-Status "  ~ Migrated to CurseForge: $($cfMetadata.Name)"
        $migratedToCurseForgeCount++
    }

    if ($migratedToCurseForgeCount -gt 0) {
        $metadataState = Get-PwMetadataState -ModsDirectory $modsDir
        $pwEntries = @($metadataState.PwEntries)
        $filenameOwners = $metadataState.FilenameOwners
        $referencedFilenames = $metadataState.ReferencedFilenames
    }

    $managedUpdates = @()
    $localUpdates = @()
    $removals = @()
    foreach ($entry in $pwEntries) {
        $currentFilename = $entry.Filename
        if (-not $currentFilename) { continue }
        if ($sourceFiles.ContainsKey($currentFilename)) { continue }

        $base = Derive-BaseName -Filename $currentFilename
        if (-not $base) { continue }
        if (-not $newFilesByBase.ContainsKey($base)) {
            $removals += $entry
            continue
        }

        $newFilename = Get-PreferredFilename -Filenames $newFilesByBase[$base]
        if (-not $newFilename) {
            $removals += $entry
            continue
        }

        if ($entry.IsManaged) {
            $managedUpdates += [pscustomobject]@{
            Entry = $entry
            OldFilename = $currentFilename
            NewFilename = $newFilename
        }
        }
        else {
            $localUpdates += [pscustomobject]@{
                Entry = $entry
                OldFilename = $currentFilename
                NewFilename = $newFilename
            }
        }
    }

    $plannedUpdateFilenames = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::OrdinalIgnoreCase)
    foreach ($update in @($managedUpdates + $localUpdates)) {
        $plannedUpdateFilenames.Add($update.NewFilename) | Out-Null
    }

    $newSources = @(
        $sourceFiles.Keys |
            Where-Object {
                (-not $referencedFilenames.Contains($_)) -and
                (-not $plannedUpdateFilenames.Contains($_))
            } |
            Sort-Object { Get-NaturalSortKey -Value $_ }
    )

    $skipRemovals = $false
    if ($removals.Count -gt 0) {
        if ($sourceFiles.Count -eq 0 -and $pwEntries.Count -gt 20) {
            $skipRemovals = $true
        }
        elseif ($removals.Count -gt [Math]::Max(10, [Math]::Ceiling($pwEntries.Count * 0.25))) {
            $skipRemovals = $true
        }
    }

    if ($skipRemovals) {
        Write-Warn "  ! Detected $($removals.Count) missing mod file(s); this looks like an unsynced or partial local mods folder, so automatic removals were skipped."
        $removals = @()
    }

    if ($migratedToCurseForgeCount -eq 0 -and $managedUpdates.Count -eq 0 -and $localUpdates.Count -eq 0 -and $newSources.Count -eq 0 -and $removals.Count -eq 0) {
        Write-Status "No CurseForge metadata changes detected."
        exit 0
    }

    $updatedCount = 0
    $updatedLocalCount = 0
    $removedCount = 0
    foreach ($update in $managedUpdates) {
        $entry = $update.Entry
        $originalContent = Get-Content -LiteralPath $entry.PwTomlPath -Raw

        Write-Status "  ~ packwiz update: $($entry.Slug)"
        $result = Invoke-PackwizCommand -Arguments @("update", $entry.Slug, "--yes")
        if ($result.ExitCode -ne 0) {
            Write-Utf8NoBomFile -Path $entry.PwTomlPath -Content $originalContent
            Write-Warn "  ! packwiz update failed for $($entry.Slug)"
            continue
        }

        $updatedContentWithSide = Set-PwTomlSide -Content (Get-Content -LiteralPath $entry.PwTomlPath -Raw) -Side $entry.Side
        Write-Utf8NoBomFile -Path $entry.PwTomlPath -Content $updatedContentWithSide

        $updatedData = Parse-PwToml -Path $entry.PwTomlPath
        $updatedFilename = Get-TomlVal -Data $updatedData -Key 'Filename'
        if ($updatedFilename -ne $update.NewFilename) {
            Write-Utf8NoBomFile -Path $entry.PwTomlPath -Content $originalContent
            Write-Warn "  ! packwiz update for $($entry.Slug) resolved to '$updatedFilename', expected '$($update.NewFilename)'"
            continue
        }

        $updatedName = Get-TomlVal -Data $updatedData -Key 'Name'
        $updatedContent = Get-Content -LiteralPath $entry.PwTomlPath -Raw
        $downloadability = Get-CurseForgeDownloadability -Content $updatedContent -MetaFileName $entry.PwTomlName -Name $updatedName
        if ($downloadability.Status -eq "restricted") {
            $sourcePath = $sourceFiles[$update.NewFilename]
            $jarMetadata = Get-JarMetadata -Path $sourcePath
            Add-PackwizFilesMetadata -SourcePath $sourcePath -SourceFilename $update.NewFilename -JarMetadata $jarMetadata -ModsDirectory $modsDir -PwTomlPath $entry.PwTomlPath -DisplayName $updatedName | Out-Null
            Write-Status "  ~ Updated (packwiz-files): $updatedName"
            $updatedLocalCount++
            continue
        }
        if ($downloadability.Status -ne "downloadable") {
            Write-Utf8NoBomFile -Path $entry.PwTomlPath -Content $originalContent
            Write-Warn "  ! Could not verify third-party download for '$updatedName'; reverted update. $($downloadability.Reason)"
            continue
        }

        Write-Status "  ~ Updated (CurseForge): $($updatedData['Name'])"
        $updatedCount++
    }

    foreach ($update in $localUpdates) {
        $entry = $update.Entry
        $sourcePath = $sourceFiles[$update.NewFilename]
        $jarMetadata = Get-JarMetadata -Path $sourcePath
        $displayName = $entry.Name
        if (-not $displayName) {
            $displayName = Get-DisplayNameFromSource -Filename $update.NewFilename -JarMetadata $jarMetadata
        }

        $candidates = @(Get-CurseForgeCandidates -Filename $update.NewFilename -JarMetadata $jarMetadata)
        $cfMetadata = $null
        if ($candidates.Count -gt 0) {
            $cfMetadata = Try-ResolveCurseForgeMetadata -SourcePath $sourcePath -SourceFilename $update.NewFilename -Candidates $candidates
        }

        if ($cfMetadata -and $cfMetadata.IsExactMatch) {
            $downloadability = Get-CurseForgeDownloadability -Content $cfMetadata.Content -MetaFileName $cfMetadata.MetaFileName -Name $cfMetadata.Name
            if ($downloadability.Status -eq "downloadable") {
                Remove-PackwizFilesAssetIfOwned -Filename $update.OldFilename -FilenameOwners $filenameOwners
                Write-Utf8NoBomFile -Path $entry.PwTomlPath -Content (Set-PwTomlSide -Content $cfMetadata.Content -Side $entry.Side)
                Write-Status "  ~ Updated (CurseForge): $($cfMetadata.Name)"
                $updatedCount++
                continue
            }

            if ($downloadability.Status -eq "restricted") {
                Write-Status "  ~ Keeping packwiz-files for update (CurseForge requires manual download): $($cfMetadata.Name)"
            }
            else {
                Write-Warn "  ! Could not verify third-party download for '$($cfMetadata.Name)'; keeping packwiz-files metadata. $($downloadability.Reason)"
            }
        }
        elseif ($cfMetadata -and -not $cfMetadata.IsExactMatch) {
            Write-Warn "  ! CurseForge project '$($cfMetadata.Name)' was found for '$($update.NewFilename)', but it resolved to '$($cfMetadata.ResolvedFilename)'. Keeping packwiz-files metadata."
        }

        if ($update.OldFilename -ne $update.NewFilename) {
            Remove-PackwizFilesAssetIfOwned -Filename $update.OldFilename -FilenameOwners $filenameOwners
        }
        Add-PackwizFilesMetadata -SourcePath $sourcePath -SourceFilename $update.NewFilename -JarMetadata $jarMetadata -ModsDirectory $modsDir -PwTomlPath $entry.PwTomlPath -DisplayName $displayName | Out-Null
        Write-Status "  ~ Updated (packwiz-files): $displayName"
        $updatedLocalCount++
    }

    $addedCurseForgeCount = 0
    $addedPackwizFilesCount = 0
    foreach ($sourceName in $newSources) {
        $sourcePath = $sourceFiles[$sourceName]
        $jarMetadata = Get-JarMetadata -Path $sourcePath
        $candidates = @(Get-CurseForgeCandidates -Filename $sourceName -JarMetadata $jarMetadata)

        Write-Status "  ~ New mod detected: $sourceName"
        $cfMetadata = $null
        if ($candidates.Count -gt 0) {
            $cfMetadata = Try-ResolveCurseForgeMetadata -SourcePath $sourcePath -SourceFilename $sourceName -Candidates $candidates
        }

        if ($cfMetadata -and $cfMetadata.IsExactMatch) {
            $downloadability = Get-CurseForgeDownloadability -Content $cfMetadata.Content -MetaFileName $cfMetadata.MetaFileName -Name $cfMetadata.Name
            if ($downloadability.Status -eq "restricted") {
                Write-Status "  ~ CurseForge requires manual download, keeping packwiz-files: $($cfMetadata.Name)"
                $localMetadata = Add-PackwizFilesMetadata -SourcePath $sourcePath -SourceFilename $sourceName -JarMetadata $jarMetadata -ModsDirectory $modsDir
                Write-Status "  ~ Added (packwiz-files): $($localMetadata.Name)"
                $addedPackwizFilesCount++
                continue
            }
            if ($downloadability.Status -ne "downloadable") {
                Write-Warn "  ! Could not verify third-party download for '$($cfMetadata.Name)'; falling back to packwiz-files. $($downloadability.Reason)"
                $localMetadata = Add-PackwizFilesMetadata -SourcePath $sourcePath -SourceFilename $sourceName -JarMetadata $jarMetadata -ModsDirectory $modsDir
                Write-Status "  ~ Added (packwiz-files): $($localMetadata.Name)"
                $addedPackwizFilesCount++
                continue
            }

            $generatedMetaStem = [IO.Path]::GetFileNameWithoutExtension($cfMetadata.MetaFileName) -replace '\.pw$', ''
            $preferredMetaName = Get-TomlVal -Data $jarMetadata -Key 'ModId'
            if (-not $preferredMetaName) {
                $preferredMetaName = $generatedMetaStem
            }

            $metaName = Get-UniqueMetaName -PreferredName $preferredMetaName -Directory $modsDir
            $pwTomlPath = Join-Path $modsDir ($metaName + ".pw.toml")
            Write-Utf8NoBomFile -Path $pwTomlPath -Content (Set-PwTomlSide -Content $cfMetadata.Content -Side "both")
            Write-Status "  ~ Added (CurseForge): $($cfMetadata.Name)"
            $addedCurseForgeCount++
            continue
        }

        if ($cfMetadata -and -not $cfMetadata.IsExactMatch) {
            Write-Warn "  ! CurseForge project '$($cfMetadata.Name)' was found, but it resolved to '$($cfMetadata.ResolvedFilename)' instead of local file '$sourceName'. Falling back to packwiz-files."
        }
        else {
            Write-Warn "  ! Could not confirm CurseForge metadata for $sourceName, falling back to packwiz-files."
        }
        $localMetadata = Add-PackwizFilesMetadata -SourcePath $sourcePath -SourceFilename $sourceName -JarMetadata $jarMetadata -ModsDirectory $modsDir
        Write-Status "  ~ Added (packwiz-files): $($localMetadata.Name)"
        $addedPackwizFilesCount++
    }

    foreach ($entry in $removals) {
        Remove-Item -LiteralPath $entry.PwTomlPath -Force
        if (-not $entry.IsManaged) {
            Remove-PackwizFilesAssetIfOwned -Filename $entry.Filename -FilenameOwners $filenameOwners
        }

        $displayName = $entry.Name
        if (-not $displayName) { $displayName = $entry.Slug }
        Write-Status "  ~ Removed: $displayName"
        $removedCount++
    }

    if ($updatedCount -eq 0 -and $updatedLocalCount -eq 0 -and $addedCurseForgeCount -eq 0 -and $addedPackwizFilesCount -eq 0 -and $removedCount -eq 0) {
        Write-Status "No CurseForge metadata changes detected."
        exit 0
    }

    if ($updatedCount -gt 0) {
        Write-Status "Updated: $updatedCount"
    }
    if ($updatedLocalCount -gt 0) {
        Write-Status "Updated via packwiz-files: $updatedLocalCount"
    }
    if ($migratedToCurseForgeCount -gt 0) {
        Write-Status "Migrated to CurseForge: $migratedToCurseForgeCount"
    }
    if ($addedCurseForgeCount -gt 0) {
        Write-Status "Added via CurseForge: $addedCurseForgeCount"
    }
    if ($addedPackwizFilesCount -gt 0) {
        Write-Status "Added via packwiz-files: $addedPackwizFilesCount"
    }
    if ($removedCount -gt 0) {
        Write-Status "Removed: $removedCount"
    }

    Write-Status "Running packwiz refresh..."
    $refreshResult = Invoke-PackwizCommand -Arguments @("refresh")
    if ($refreshResult.ExitCode -ne 0) {
        throw "packwiz refresh exited with code $($refreshResult.ExitCode)."
    }

    Write-Status "Done. Mod pw.toml files refreshed from CurseForge or packwiz-files metadata."
}
finally {}
