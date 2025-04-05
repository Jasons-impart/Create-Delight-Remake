@echo off
setlocal enabledelayedexpansion

@REM 配置文件路径
set "filePath=variables.txt"

@REM 检查文件是否存在
if not exist "%filePath%" (
    echo Error: Config file %filePath% not exists!
    echo Please check if you have downloaded the correct modpack
    exit /b 1
)

@REM 逐行读取配置文件内容
for /f "usebackq delims=" %%a in ("%filePath%") do (
    set "line=%%a"

    @REM 拆分变量名和变量值（按第一个 = 拆分）
    @REM 别问为啥跳过空行和#写的这么奇怪，因为goto的奇怪bug+bat各种限制
    @REM 所以只能这样写了，如果你有更好的写法，加油改，我摆了
    for /f "tokens=1,* delims==" %%b in ("!line!") do (
        set "varName=%%b"
        set "varValue=%%c"
        @REM 设置环境变量，跳过空行和#开头的行
        if "!varValue!" neq "" (
            if "!line:~0,1!" neq "#" (
                set "!varName!=!varValue!"
                echo !varName!=!varValue!
            )
        )
    )
)

@REM 检查Java是否存在
echo Checking Java existence...
%JAVA% -version >nul 2>&1
if %errorlevel% equ 0 (
    echo Java Found
) else (
    echo Java Not Found, please install Java 17 and set JAVA variable in this script
    pause
    exit /b 1
)

@REM 检查Java版本
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

@REM 检测生成的服务器JAR文件，如果没有则调用Forge安装服务器
if not exist server.jar (
    echo No server.jar found, installing Forge server...
    %JAVA% -jar forge.jar --installServer
    if errorlevel 1 (
        echo Forge install error, please check error message above
        pause
        exit /b 1
    )
    if not exist server.jar (
       echo Forge install succeed but server.jar not found, please check if server.jar exists in current directory
       pause
       exit /b 1 
    )
)

@REM 检查EULA
findstr /i "eula=true" eula.txt >nul 2>&1
if errorlevel 1 (
    echo Mojang's EULA has not yet been accepted. In order to run a Minecraft server, you must accept Mojang's EULA.
    echo Mojang's EULA is available to read at https://aka.ms/MinecraftEULA
    echo If you agree to Mojang's EULA then type 'I agree' below and press Enter.
    set /p input="Enter your response: "
    if /i "!input!"=="I agree" (
        echo You have agreed to Mojang's EULA. The server will now start.
        echo eula=true > eula.txt
    ) else (
        echo You did not agree to the EULA. The server cannot start.
        pause
        exit /b 1
    )
)

@REM 写入默认配置
if not exist server.properties (
    echo !JVM_ARGS! > user_jvm_args.txt
    echo allow-flight=true >> server.properties
    echo motd=Create Delight Remake !MODPACK_VERSION! >> server.properties
    echo max-players=8 >> server.properties
)

@REM @REM 启动服务器
@REM echo Launching server...
@REM call ./run.bat

endlocal