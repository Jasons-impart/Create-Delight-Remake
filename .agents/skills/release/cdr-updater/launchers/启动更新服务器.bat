@echo off
setlocal EnableExtensions
cd /d "%~dp0"
call "%~dp0find-java.bat"
if errorlevel 1 exit /b 1
if not defined JAVA_EXE (
  echo Java 17 not found.
  pause
  exit /b 1
)
if not exist "%~dp0config.toml" copy /Y "%~dp0config.example.toml" "%~dp0config.toml" >nul
echo Using Java: %JAVA_EXE%
echo Starting update server http://127.0.0.1:8765
echo First start may download official packs from GitHub.
"%JAVA_EXE%" -jar "%~dp0cdr-updater.jar" serve --config "%~dp0config.toml"
if errorlevel 1 echo Update server failed. See errors above.
pause
