@echo off
setlocal EnableExtensions DisableDelayedExpansion
cd /d "%~dp0" || (
    echo Failed to switch to the modpack directory.
    pause
    exit /b 1
)

set "REPO_ROOT=%~dp0"
set "SCRIPT=%REPO_ROOT%scripts\update-packwiz-meta.ps1"
set "PS_EXE=%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe"
if not exist "%PS_EXE%" set "PS_EXE=powershell.exe"

if not exist "%SCRIPT%" (
    echo PowerShell script not found: "%SCRIPT%"
    pause
    exit /b 1
)

rem Keep command-line use compatible with the old launcher.
if not "%~1"=="" (
    if /i "%~1"=="/?" goto :usage
    if /i "%~1"=="-?" goto :usage
    if /i "%~1"=="-h" goto :usage
    if /i "%~1"=="--help" goto :usage
    goto :passthrough
)

:menu
echo.
echo ==============================================
echo   Create-Delight Remake - Packwiz meta update
echo ==============================================
echo.
echo Select the asset category:
echo   [1] Mods
echo   [2] Resourcepacks
echo   [3] Shaderpacks
echo   [4] All categories
echo   [Q] Cancel
choice /C 1234Q /N /M "Choice: "
if errorlevel 5 goto :cancelled
if errorlevel 4 (
    set "CATEGORY=all"
    goto :removal_mode
)
if errorlevel 3 (
    set "CATEGORY=shaderpacks"
    goto :removal_mode
)
if errorlevel 2 (
    set "CATEGORY=resourcepacks"
    goto :removal_mode
)
set "CATEGORY=mods"

:removal_mode
echo.
echo Missing local files are normally kept in metadata for safety.
echo   [1] Keep missing entries (recommended)
echo   [2] Allow automatic removals
echo   [Q] Cancel
choice /C 12Q /N /M "Choice: "
if errorlevel 3 goto :cancelled
set "REMOVAL_ARGS="
if errorlevel 2 set "REMOVAL_ARGS=-AllowRemovals"

:raw_ref
for /f "delims=" %%B in ('git -C "%REPO_ROOT%." branch --show-current 2^>nul') do if not defined CURRENT_BRANCH set "CURRENT_BRANCH=%%B"
if not defined CURRENT_BRANCH set "CURRENT_BRANCH=main"

echo.
echo Packwiz-files raw URL ref (current branch: %CURRENT_BRANCH%):
echo   [1] main (recommended for feature branches)
echo   [2] Current branch
echo   [3] Enter another ref
echo   [Q] Cancel
choice /C 123Q /N /M "Choice: "
if errorlevel 4 goto :cancelled
if errorlevel 3 goto :custom_ref
if errorlevel 2 (
    set "REF_ARGS=-PackwizFilesRef "%CURRENT_BRANCH%""
) else (
    set "REF_ARGS=-PackwizFilesRef main"
)
goto :run

:custom_ref
set "CUSTOM_REF="
set /p "CUSTOM_REF=Enter the branch, tag, or commit ref: "
if not defined CUSTOM_REF goto :raw_ref
set "REF_ARGS=-PackwizFilesRef "%CUSTOM_REF%""

:run
echo.
echo Running category: %CATEGORY%
if defined REMOVAL_ARGS echo Automatic removals: ENABLED
if not defined REMOVAL_ARGS echo Automatic removals: disabled
echo.

set "EXIT_CODE=0"
if /i "%CATEGORY%"=="all" (
    call :run_category mods
    if errorlevel 1 set "EXIT_CODE=1"
    call :run_category resourcepacks
    if errorlevel 1 set "EXIT_CODE=1"
    call :run_category shaderpacks
    if errorlevel 1 set "EXIT_CODE=1"
) else (
    call :run_category "%CATEGORY%"
    set "EXIT_CODE=%ERRORLEVEL%"
)
goto :finish

:run_category
echo --- %~1 ---
"%PS_EXE%" -NoProfile -ExecutionPolicy Bypass -File "%SCRIPT%" -Category "%~1" -FullReconcile %REMOVAL_ARGS% %REF_ARGS%
set "CATEGORY_EXIT_CODE=%ERRORLEVEL%"
if "%CATEGORY_EXIT_CODE%"=="0" (
    echo Category completed: %~1
) else (
    echo Category failed: %~1 ^(exit code %CATEGORY_EXIT_CODE%^)
)
echo.
exit /b %CATEGORY_EXIT_CODE%

:passthrough
"%PS_EXE%" -NoProfile -ExecutionPolicy Bypass -File "%SCRIPT%" %*
set "EXIT_CODE=%ERRORLEVEL%"
goto :finish

:finish
echo.
if "%EXIT_CODE%"=="0" (
    echo Update completed.
) else (
    echo Update failed with exit code %EXIT_CODE%.
)
pause
exit /b %EXIT_CODE%

:cancelled
echo.
echo Update cancelled.
pause
exit /b 0

:usage
echo Usage:
echo   update-packwiz-meta.bat
echo       Open the interactive menu.
echo   update-packwiz-meta.bat ^<PowerShell arguments^>
echo       Pass arguments directly to scripts\update-packwiz-meta.ps1.
echo.
echo Example:
echo   update-packwiz-meta.bat -Category mods -FullReconcile
exit /b 0
