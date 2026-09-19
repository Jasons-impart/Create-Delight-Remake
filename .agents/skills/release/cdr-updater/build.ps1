$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$Jdk = $env:JAVA_HOME
$javacProbe = if ($Jdk) { Join-Path $Jdk "bin\javac.exe" } else { "" }
if (-not $Jdk -or -not (Test-Path $javacProbe)) {
    $candidates = @(
        "C:\Program Files\Eclipse Adoptium\jdk-17.0.19.10-hotspot",
        "C:\Program Files\Java\jdk-17"
    )
    foreach ($candidate in $candidates) {
        if (Test-Path (Join-Path $candidate "bin\javac.exe")) {
            $Jdk = $candidate
            break
        }
    }
}
if (-not $Jdk) {
    throw "Java 17+ is required to build the updater."
}

$Javac = Join-Path $Jdk "bin\javac.exe"
$JarTool = Join-Path $Jdk "bin\jar.exe"
$Java = Join-Path $Jdk "bin\java.exe"
$Out = Join-Path $Root "out"
$Dist = Join-Path $Root "dist"

if (Test-Path $Out) { Remove-Item $Out -Recurse -Force }
New-Item -ItemType Directory -Path $Out, $Dist -Force | Out-Null

$sources = Get-ChildItem -Path (Join-Path $Root "src") -Filter *.java -Recurse | Where-Object { $_.Name -ne "Boot.java" } | ForEach-Object { $_.FullName }
$boot = Join-Path $Root "src\com\jsi\cdr\updater\Boot.java"
& $Javac -encoding UTF-8 --release 8 -d $Out $boot
if ($LASTEXITCODE -ne 0) { throw "javac Boot.java failed" }
& $Javac -encoding UTF-8 --release 17 -d $Out @sources
if ($LASTEXITCODE -ne 0) { throw "javac failed" }

Copy-Item (Join-Path $Root "resources\META-INF") $Out -Recurse -Force
$web = Join-Path $Root "resources\web"
if (Test-Path $web) {
    Copy-Item $web (Join-Path $Out "web") -Recurse -Force
}
$coremods = Join-Path $Root "resources\coremods"
if (Test-Path $coremods) {
    Copy-Item $coremods (Join-Path $Out "coremods") -Recurse -Force
}
$forgeStub = Join-Path $Out "net\minecraftforge"
if (Test-Path $forgeStub) {
    Remove-Item $forgeStub -Recurse -Force
}
$modLauncherStub = Join-Path $Out "cpw\mods"
if (Test-Path $modLauncherStub) {
    Remove-Item $modLauncherStub -Recurse -Force
}
$manifest = Join-Path $Root "resources\MANIFEST.MF"
$jarFile = Join-Path $Dist "cdr-updater.jar"
if (Test-Path $jarFile) { Remove-Item $jarFile -Force }
Push-Location $Out
try {
    & $JarTool cfm $jarFile $manifest .
} finally {
    Pop-Location
}

Copy-Item (Join-Path $Root "launchers\*") $Dist -Force
Copy-Item (Join-Path $Root "config.example.toml") $Dist -Force
$privateExample = Join-Path $Root "private.example"
$privateExampleDest = Join-Path $Dist "private.example"
if (Test-Path $privateExample) {
    if (Test-Path $privateExampleDest) { Remove-Item $privateExampleDest -Recurse -Force }
    Copy-Item $privateExample $privateExampleDest -Recurse -Force
}

Write-Host "Running tests..."
& $Java -jar $jarFile test
if ($LASTEXITCODE -ne 0) { throw "tests failed" }

Write-Host "Built $jarFile"
Write-Host "Run dist\start-client.bat or dist\start-server.bat"
