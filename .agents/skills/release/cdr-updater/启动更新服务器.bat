@echo off
setlocal EnableExtensions
cd /d "%~dp0"

if exist "%~dp0dist\find-java.bat" (
  call "%~dp0dist\find-java.bat"
) else (
  call "%~dp0launchers\find-java.bat"
)
if errorlevel 1 exit /b 1
if not defined JAVA_EXE (
  echo Java 17 not found.
  pause
  exit /b 1
)

if not exist "%~dp0config.toml" copy /Y "%~dp0config.example.toml" "%~dp0config.toml" >nul
if not exist "%~dp0dist\cdr-updater.jar" (
  echo Missing dist\cdr-updater.jar. Run build.ps1 first.
  pause
  exit /b 1
)

echo Using Java: %JAVA_EXE%
echo Starting update server http://127.0.0.1:8765
echo First start may download official packs from GitHub.
"%JAVA_EXE%" -jar "%~dp0dist\cdr-updater.jar" serve --config "%~dp0config.toml"
if errorlevel 1 echo Update server failed. See errors above.
pause
