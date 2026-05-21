@echo off
setlocal enabledelayedexpansion
chcp 65001

rem files to be deleted
set "pathFile=deleted_files.txt"

rem Check if the file exists
if not exist "%pathFile%" (
    echo File %pathFile% doesn't exist.
    exit /b 1
)

rem read line by line and remove files
for /f "usebackq delims=" %%a in ("%pathFile%") do (
    rem Convert Linux-style to Windows-style path
    set "path=%%a"
    set "path=!path:/=\!"
    
    rem Check if file exists and delete it
    if exist "!path!" (
        echo Deleting: !path!
        del "!path!"
        if errorlevel 1 (
            echo Error when delete !path!
        )
    ) else (
        echo File !path! doesn't exist.
    )
)

rem move patched files to right place
%SystemRoot%\System32\xcopy /E /I /Y "patch" "."
rd /S /Q "patch"
rd deleted_files.txt

endlocal
