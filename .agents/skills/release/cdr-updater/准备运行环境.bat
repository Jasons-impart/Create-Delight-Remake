@echo off
setlocal EnableExtensions
cd /d "%~dp0"

if exist "%~dp0dist\find-java.bat" (
  call "%~dp0dist\find-java.bat"
) else (
  call "%~dp0launchers\find-java.bat"
)
if errorlevel 1 exit /b 1

for %%I in ("%JAVA_EXE%") do set "JAVA_CMD=%%~dpIjava.exe"
if not exist "%JAVA_CMD%" set "JAVA_CMD=%JAVA_EXE%"

if not exist "%~dp0dist\cdr-updater.jar" (
  echo 未找到 dist\cdr-updater.jar，正在编译...
  powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0build.ps1"
  if errorlevel 1 (
    pause
    exit /b 1
  )
)

echo 正在从 GitHub 拉取官方 Client/Server 包，并由程序自行区分端侧与私货...
echo 首次下载服务端 zip 约 800MB+，请耐心等待。
"%JAVA_CMD%" -jar "%~dp0dist\cdr-updater.jar" prepare-env --config "%~dp0config.toml" --runtime "%~dp0runtime"
if errorlevel 1 (
  echo 准备运行环境失败。
  pause
  exit /b 1
)
echo.
echo 完成。下一步：
echo 1. 双击 启动更新服务器.bat
echo 2. 客户端：把 runtime 目录下的 *-PCL2.zip 导入 PCL2
echo 3. 服务端：运行 runtime\server\启动游戏服务端.bat
pause
