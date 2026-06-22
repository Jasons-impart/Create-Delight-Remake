[CmdletBinding()]
param()

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$RawUrlPattern = 'https://raw\.githubusercontent\.com/Jasons-impart/Create-Delight-Remake/.+/packwiz-files/'

function Assert-Equal {
    param(
        [string]$Name,
        [object]$Actual,
        [object]$Expected
    )

    if ($Actual -ne $Expected) {
        throw "$Name failed. Expected '$Expected', got '$Actual'."
    }
}

function Resolve-TestRawPrefix {
    param(
        [string]$Ref,
        [string]$RawPrefix
    )

    if (-not [string]::IsNullOrWhiteSpace($RawPrefix)) {
        return $RawPrefix.TrimEnd('/') + '/'
    }

    if ([string]::IsNullOrWhiteSpace($Ref)) {
        $Ref = "main"
    }

    $escapedRef = ([Uri]::EscapeDataString($Ref)).Replace('%2F', '/')
    return "https://raw.githubusercontent.com/Jasons-impart/Create-Delight-Remake/$escapedRef/packwiz-files/"
}

function Replace-TestRawUrls {
    param(
        [string]$Content,
        [string]$Replacement
    )

    return [regex]::Replace($Content, $RawUrlPattern, {
        param($Match)
        return $Replacement
    })
}

Assert-Equal `
    -Name "branch ref keeps slash" `
    -Actual (Resolve-TestRawPrefix -Ref "release/stable" -RawPrefix "") `
    -Expected "https://raw.githubusercontent.com/Jasons-impart/Create-Delight-Remake/release/stable/packwiz-files/"

Assert-Equal `
    -Name "ref escapes spaces" `
    -Actual (Resolve-TestRawPrefix -Ref "test branch" -RawPrefix "") `
    -Expected "https://raw.githubusercontent.com/Jasons-impart/Create-Delight-Remake/test%20branch/packwiz-files/"

Assert-Equal `
    -Name "explicit raw prefix wins and adds slash" `
    -Actual (Resolve-TestRawPrefix -Ref "ignored" -RawPrefix "https://example.invalid/raw") `
    -Expected "https://example.invalid/raw/"

$inputContent = @'
url = "https://raw.githubusercontent.com/Jasons-impart/Create-Delight-Remake/main/packwiz-files/mods/A.jar"
url = "https://raw.githubusercontent.com/Jasons-impart/Create-Delight-Remake/release/stable/packwiz-files/resourcepacks/B.zip"
url = "https://example.invalid/Create-Delight-Remake/main/packwiz-files/mods/C.jar"
'@

$expectedContent = @'
url = "http://127.0.0.1:8080/packwiz-files/mods/A.jar"
url = "http://127.0.0.1:8080/packwiz-files/resourcepacks/B.zip"
url = "https://example.invalid/Create-Delight-Remake/main/packwiz-files/mods/C.jar"
'@

Assert-Equal `
    -Name "replace repository raw URLs only" `
    -Actual (Replace-TestRawUrls -Content $inputContent -Replacement "http://127.0.0.1:8080/packwiz-files/") `
    -Expected $expectedContent

Write-Host "packwiz-files ref tests passed"
