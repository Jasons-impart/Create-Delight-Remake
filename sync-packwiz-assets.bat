@echo off
setlocal EnableExtensions
cd /d "%~dp0"

set "PYEXE="

REM Resolve Python 3.11+: python, then py -3, then python3. Skip the Microsoft Store stub.
for /f "delims=" %%I in ('where python 2^>nul') do (
    echo %%I | find /I "\WindowsApps\" >nul
    if errorlevel 1 (
        "%%I" -c "import sys; raise SystemExit(0 if sys.version_info >= (3, 11) else 1)" >nul 2>&1
        if not errorlevel 1 (
            set "PYEXE=%%I"
            goto :run
        )
    )
)

where py >nul 2>&1
if not errorlevel 1 (
    py -3 -c "import sys; raise SystemExit(0 if sys.version_info >= (3, 11) else 1)" >nul 2>&1
    if not errorlevel 1 (
        for /f "delims=" %%I in ('py -3 -c "import sys; print(sys.executable)" 2^>nul') do (
            set "PYEXE=%%I"
            goto :run
        )
    )
)

for /f "delims=" %%I in ('where python3 2^>nul') do (
    echo %%I | find /I "\WindowsApps\" >nul
    if errorlevel 1 (
        "%%I" -c "import sys; raise SystemExit(0 if sys.version_info >= (3, 11) else 1)" >nul 2>&1
        if not errorlevel 1 (
            set "PYEXE=%%I"
            goto :run
        )
    )
)

echo Python was not found. Install Python 3.11+ and ensure python, py -3, or python3 is available.
exit /b 1

:run
"%PYEXE%" "%~dp0scripts\sync-packwiz-assets.py" %*
set "EXIT_CODE=%ERRORLEVEL%"

echo.
if "%EXIT_CODE%"=="0" (
    echo Sync completed.
) else (
    echo Sync failed with exit code %EXIT_CODE%.
)

pause
exit /b %EXIT_CODE%
