@echo off
set "JAVA_EXE="

if exist "C:\Program Files\Eclipse Adoptium\jdk-17.0.19.10-hotspot\bin\java.exe" (
  call :check "C:\Program Files\Eclipse Adoptium\jdk-17.0.19.10-hotspot\bin\java.exe"
  if defined JAVA_EXE goto ok
)

for /d %%J in ("C:\Program Files\Eclipse Adoptium\jdk-17*" "C:\Program Files\Java\jdk-17*" "C:\Program Files\Java\jdk-21*" "C:\Program Files\Eclipse Adoptium\jdk-21*") do (
  if exist "%%~J\bin\java.exe" (
    set "JAVA_EXE=%%~J\bin\java.exe"
    goto ok
  )
)

if defined JAVA_HOME (
  if exist "%JAVA_HOME%\bin\java.exe" (
    call :check "%JAVA_HOME%\bin\java.exe"
    if defined JAVA_EXE goto ok
  )
)

where java >nul 2>nul
if not errorlevel 1 (
  for /f "delims=" %%P in ('where java') do (
    call :check "%%P"
    if defined JAVA_EXE goto ok
  )
)

echo Java 17+ not found. JAVA_HOME/PATH java 8 cannot start this updater.
pause
exit /b 1

:ok
exit /b 0

:check
"%~1" -version 2>&1 | findstr /C:"version \"17" /C:"version \"21" /C:"version \"22" /C:"version \"25" >nul
if not errorlevel 1 set "JAVA_EXE=%~1"
goto :eof
