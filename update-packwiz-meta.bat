@echo off
setlocal
cd /d "%~dp0"

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\update-packwiz-meta.ps1"
set "EXIT_CODE=%ERRORLEVEL%"

echo.
if "%EXIT_CODE%"=="0" (
    echo Update completed.
) else (
    echo Update failed with exit code %EXIT_CODE%.
)

pause
exit /b %EXIT_CODE%
