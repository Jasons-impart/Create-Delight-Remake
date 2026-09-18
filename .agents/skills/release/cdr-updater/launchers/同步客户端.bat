@echo off
setlocal EnableExtensions
cd /d "%~dp0"

call "%~dp0find-java.bat"
if errorlevel 1 exit /b 1

for %%I in ("%JAVA_EXE%") do set "JAVA_CMD=%%~dpIjava.exe"
if not exist "%JAVA_CMD%" set "JAVA_CMD=%JAVA_EXE%"

if not exist "%~dp0runtime\client" (
  echo 请先运行 准备运行环境.bat
  pause
  exit /b 1
)

"%JAVA_CMD%" -jar "%~dp0cdr-updater.jar" sync --side client --instance "%~dp0runtime\client" --server http://127.0.0.1:8765
pause
