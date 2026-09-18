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

echo 正在导出 PCL2 可直接导入的客户端 zip...
echo 不会修改 PCL2，安装请用：下载 - 整合包 - 安装整合包。
"%JAVA_CMD%" -jar "%~dp0cdr-updater.jar" export-pcl2 --config "%~dp0config.toml"
pause
