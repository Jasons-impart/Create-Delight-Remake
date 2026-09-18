@echo off
setlocal EnableExtensions
cd /d "%~dp0"
call "%~dp0find-java.bat"
if errorlevel 1 exit /b 1
start "" "%JAVA_EXE%" -jar "%~dp0cdr-updater.jar" client
