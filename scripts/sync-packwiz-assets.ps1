[CmdletBinding()]
param(
    [string[]]$MetadataRoots = @("mods", "resourcepacks", "shaderpacks"),
    [string]$PackwizUrl = "https://github.com/Jasons-impart/packwiz/releases/latest/download/packwiz.exe",
    [string]$InstallerUrl = "https://github.com/packwiz/packwiz-installer/releases/latest/download/packwiz-installer.jar"
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
$PackwizFilesRoot = Join-Path $RepoRoot "packwiz-files"
$PackwizFilesRawPrefix = "https://raw.githubusercontent.com/Jasons-impart/Create-Delight-Remake/main/packwiz-files/"
$StaticServerScript = Join-Path $PSScriptRoot "packwiz-static-server.py"
$ServeProcess = $null

function Write-Status {
    param([string]$Message)
    Write-Host "[sync] $Message" -ForegroundColor Cyan
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
    Invoke-WebRequest -Uri $Url -OutFile $Destination -UseBasicParsing
}

function Write-Utf8NoBomFile {
    param(
        [string]$Path,
        [string]$Content
    )

    $utf8NoBom = [System.Text.UTF8Encoding]::new($false)
    [System.IO.File]::WriteAllText($Path, $Content, $utf8NoBom)
}

try {
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
    Ensure-Tool -Url $PackwizUrl -Destination $PackwizExe
    Ensure-Tool -Url $InstallerUrl -Destination $InstallerJarPath

    if (Test-Path $PackRoot) {
        Remove-Item $PackRoot -Recurse -Force
    }
    New-Item -ItemType Directory -Force -Path $PackRoot | Out-Null
    Copy-Item (Join-Path $RepoRoot "pack.toml") (Join-Path $PackRoot "pack.toml") -Force
    $packwizIgnorePath = Join-Path $RepoRoot ".packwizignore"
    if (Test-Path $packwizIgnorePath) {
        Copy-Item $packwizIgnorePath (Join-Path $PackRoot ".packwizignore") -Force
    }
    New-Item -ItemType File -Force -Path (Join-Path $PackRoot "index.toml") | Out-Null

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
        if ($content.Contains($PackwizFilesRawPrefix)) {
            Write-Utf8NoBomFile -Path $metadataPath -Content ($content.Replace($PackwizFilesRawPrefix, $localPackwizFilesPrefix))
        }
    }

    Write-Status ("Building temporary packwiz pack from {0} metadata file(s)..." -f $metadataFiles.Count)
    Push-Location $PackRoot
    try {
        & $PackwizExe refresh
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
    & $javaCommand -cp $InstallerJarPath "link.infra.packwiz.installer.Main" "--bootstrap-no-update" "-g" $packUrl
    if ($LASTEXITCODE -ne 0) {
        throw "packwiz-installer exited with code $LASTEXITCODE."
    }

    Write-Status "Sync finished successfully."
}
finally {
    if ($ServeProcess -and -not $ServeProcess.HasExited) {
        Stop-Process -Id $ServeProcess.Id -Force -ErrorAction SilentlyContinue
    }
}
