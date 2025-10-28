@echo off
setlocal enabledelayedexpansion
chcp 65001

@REM config file path
set "filePath=variables.txt"

if not exist "%filePath%" (
    echo Error: Config file %filePath% not exists!
    echo Please check if you have downloaded the correct modpack
    exit /b 1
)

@REM parse line by line and set var
for /f "usebackq delims=" %%a in ("%filePath%") do (
    set "line=%%a"

    @REM I know this looks tricky. But it won't work if I use goto.
    for /f "tokens=1,* delims==" %%b in ("!line!") do (
        set "varName=%%b"
        set "varValue=%%c"
        @REM skip empty line and comment line (starting with #)
        if "!varValue!" neq "" (
            if "!line:~0,1!" neq "#" (
                set "!varName!=!varValue!"
                echo !varName!=!varValue!
            )
        )
    )
)

echo Checking Java existence...
%JAVA% -version >nul 2>&1
if %errorlevel% equ 0 (
    echo Java Found
) else (
    echo Java Not Found, please install Java 17 and set JAVA variable in this script
    pause
    exit /b 1
)

@REM check java major version
for /f "tokens=3 delims= " %%i in ('powershell -Command "& '%JAVA%' -version 2>&1 | Select-String -Pattern 'version' | ForEach-Object { $_.Line }"') do (
    set "JAVA_VER=%%i"
)
set "JAVA_VER=!JAVA_VER:"=!"
for /f "delims=. tokens=1" %%a in ("!JAVA_VER!") do set "MAJOR_VER=%%a"
echo Detected Java version: !JAVA_VER!, major version: !MAJOR_VER!

if not "!MAJOR_VER!"=="!RECOMMENDED_JAVA_VER!" (
    echo Error: Detected Java version !MAJOR_VER!, but Java!RECOMMENDED_JAVA_VER! is recommended to run this modpack
    echo If you have installed Java!RECOMMENDED_JAVA_VER!, please set JAVA variable in this script to the correct path
    echo Or if you DO KNOW WHAT YOUR ARE DOING, you can modify this script and remove this check, but we can't guarantee it will work
    pause
    exit /b 1
)

@REM check if forge server installed, if not install it
echo Checking run.bat server existence...
if not exist run.bat (
    echo No run.bat found, installing Forge server...
    %JAVA% -jar forge.jar --installServer
    if errorlevel 1 (
        echo Forge install error, please check error message above
        pause
        exit /b 1
    )
    if not exist run.bat (
       echo Forge install succeed but run.bat not found, please check if run.bat exists in current directory
       pause
       exit /b 1 
    )
)

@REM write default config
echo Writing default config...
if not exist server.properties (
    echo !JVM_ARGS! > user_jvm_args.txt
    @REM tried to write server.properties & eula.txt, will be overwritten.
)

@REM launch server
@REM MC_VERSION & FORGE_VERSION will be replaced by github action
echo Launching server...
%JAVA% @user_jvm_args.txt @libraries/net/minecraftforge/forge/!MC_VERSION!-!FORGE_VERSION!/win_args.txt %*
pause

endlocal