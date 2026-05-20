@echo off
setlocal
cd /d "%~dp0"

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\sync-packwiz-assets.ps1"
set "EXIT_CODE=%ERRORLEVEL%"

echo.
if "%EXIT_CODE%"=="0" (
    echo Sync completed.
) else (
    echo Sync failed with exit code %EXIT_CODE%.
)

pause
exit /b %EXIT_CODE%
