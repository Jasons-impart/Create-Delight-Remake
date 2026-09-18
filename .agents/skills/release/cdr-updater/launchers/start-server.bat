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
echo Using %JAVA_EXE%
"%JAVA_EXE%" -jar "%~dp0cdr-updater.jar" serve --config "%~dp0config.toml"
if errorlevel 1 echo Failed to start updater server.
pause
