@echo off
setlocal EnableExtensions
cd /d "%~dp0"

call "%~dp0find-java.bat"
if errorlevel 1 exit /b 1

for %%I in ("%JAVA_EXE%") do set "JAVA_CMD=%%~dpIjava.exe"
if not exist "%JAVA_CMD%" set "JAVA_CMD=%JAVA_EXE%"

if not exist "%~dp0config.toml" (
  copy /Y "%~dp0config.example.toml" "%~dp0config.toml" >nul
)

echo 正在从 GitHub 拉取官方包并区分客户端/服务端文件...
echo 服务端 zip 约 800MB+，首次可能需要较长时间。
"%JAVA_CMD%" -jar "%~dp0cdr-updater.jar" prepare-env --config "%~dp0config.toml" --runtime "%~dp0runtime"
if errorlevel 1 (
  echo 准备运行环境失败。
  pause
  exit /b 1
)
echo.
echo 接下来请再双击 启动更新服务器.bat
echo 客户端：把 runtime 里的 PCL2 zip 导入 PCL2
echo 服务端：运行 runtime\server\启动游戏服务端.bat
pause
