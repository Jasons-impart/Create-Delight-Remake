package com.jsi.cdr.updater;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.function.Consumer;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

final class ServerPack {
    private ServerPack() {}

    static Path export(Pack.Config config, Path updaterJar, Path output, Consumer<String> log) throws Exception {
        if (!Files.isRegularFile(config.manifestsDir().resolve("server.json"))) {
            Pack.buildRepos(config, log);
        }
        Files.createDirectories(output.getParent() == null ? Path.of(".") : output.getParent());
        log.accept("正在打包服务端 " + output.getFileName());
        try (ZipOutputStream zip = new ZipOutputStream(Files.newOutputStream(output))) {
            Path serverRoot = config.serverDir;
            if (Files.exists(serverRoot)) {
                for (Path file : Fs.files(serverRoot)) {
                    String rel = Fs.posix(serverRoot, file);
                    if ("mods/cdr-updater.jar".equals(rel) || "cdr-updater.toml".equals(rel)
                            || "cdr-updater-state.json".equals(rel)
                            || "start.bat".equals(rel) || "启动游戏服务端.bat".equals(rel)
                            || "start.sh".equals(rel) || "启动游戏服务端.sh".equals(rel)
                            || "run.bat".equals(rel) || "run.sh".equals(rel)
                            || "eula.txt".equals(rel) || "user_jvm_args.txt".equals(rel)) {
                        continue;
                    }
                    putFile(zip, rel, file);
                }
            }
            if (Files.isRegularFile(updaterJar)) {
                putFile(zip, "mods/cdr-updater.jar", updaterJar);
            }
            putText(zip, "cdr-updater.toml", Pack.instanceToml(config, "server"));
            putText(zip, "eula.txt", "eula=true\n");
            putText(zip, "user_jvm_args.txt", jvmArgs(config, serverRoot));
            String launcher = crlf(startBat(config));
            putText(zip, "启动游戏服务端.bat", launcher);
            putText(zip, "start.bat", launcher);
            String unix = lf(startSh(config));
            putText(zip, "启动游戏服务端.sh", unix);
            putText(zip, "start.sh", unix);
        }
        log.accept("已导出服务端: " + output.toAbsolutePath());
        return output;
    }

    private static String jvmArgs(Pack.Config config, Path serverRoot) throws Exception {
        String agent = "-javaagent:mods/cdr-updater.jar=" + config.updateServerUrl;
        String memory = "-Xms4G -Xmx8G";
        Path variables = serverRoot == null ? null : serverRoot.resolve("variables.txt");
        if (variables != null && Files.isRegularFile(variables)) {
            for (String line : Files.readString(variables).split("\n")) {
                String trimmed = line.trim();
                if (trimmed.startsWith("JVM_ARGS=")) {
                    String value = trimmed.substring("JVM_ARGS=".length()).trim();
                    if (!value.isBlank()) {
                        memory = value.replace("\"", "").trim();
                    }
                }
            }
        }
        return memory + System.lineSeparator()
                + "-Djavax.net.ssl.trustStoreType=Windows-ROOT" + System.lineSeparator()
                + agent + System.lineSeparator();
    }

    static String startBat(Pack.Config config) {
        String forgeId = config.minecraft + "-" + config.forge;
        return """
                @echo off
                setlocal EnableExtensions
                cd /d "%~dp0"

                set "JAVA_EXE="
                if exist "C:\\Program Files\\Eclipse Adoptium\\jdk-17.0.19.10-hotspot\\bin\\java.exe" set "JAVA_EXE=C:\\Program Files\\Eclipse Adoptium\\jdk-17.0.19.10-hotspot\\bin\\java.exe"
                if not defined JAVA_EXE if exist "C:\\Program Files\\Java\\jdk-17\\bin\\java.exe" set "JAVA_EXE=C:\\Program Files\\Java\\jdk-17\\bin\\java.exe"
                if not defined JAVA_EXE if exist "C:\\Program Files\\Eclipse Adoptium\\jdk-17\\bin\\java.exe" set "JAVA_EXE=C:\\Program Files\\Eclipse Adoptium\\jdk-17\\bin\\java.exe"
                if not defined JAVA_EXE if defined JAVA_HOME if exist "%JAVA_HOME%\\bin\\java.exe" set "JAVA_EXE=%JAVA_HOME%\\bin\\java.exe"
                if not defined JAVA_EXE (
                  echo Java 17 not found. Install Temurin or Oracle JDK 17.
                  pause
                  exit /b 1
                )

                >eula.txt echo eula=true

                set "WIN_ARGS=libraries\\net\\minecraftforge\\forge\\FORGE_ID\\win_args.txt"
                if not exist "%WIN_ARGS%" (
                  echo Installing Forge server via BMCLAPI...
                  "%JAVA_EXE%" -Djavax.net.ssl.trustStoreType=Windows-ROOT -jar forge.jar --installServer --mirror https://bmclapi2.bangbang93.com
                  if not exist "%WIN_ARGS%" (
                    echo Forge install failed. Disable Steam++ Mojang hosts hijack and retry.
                    pause
                    exit /b 1
                  )
                )

                echo Starting dedicated server...
                "%JAVA_EXE%" @"user_jvm_args.txt" @"%WIN_ARGS%" nogui
                echo Server exited with code %ERRORLEVEL%
                pause
                exit /b %ERRORLEVEL%
                """.replace("FORGE_ID", forgeId);
    }

    static String startSh(Pack.Config config) {
        String forgeId = config.minecraft + "-" + config.forge;
        return """
                #!/bin/sh
                cd "$(dirname "$0")" || exit 1

                JAVA_EXE=""
                if [ -n "$JAVA_HOME" ] && [ -x "$JAVA_HOME/bin/java" ]; then
                  JAVA_EXE="$JAVA_HOME/bin/java"
                fi
                if [ -z "$JAVA_EXE" ] && command -v java >/dev/null 2>&1; then
                  JAVA_EXE="$(command -v java)"
                fi
                if [ -z "$JAVA_EXE" ] && [ -x /usr/lib/jvm/temurin-17-jdk/bin/java ]; then
                  JAVA_EXE="/usr/lib/jvm/temurin-17-jdk/bin/java"
                fi
                if [ -z "$JAVA_EXE" ] && [ -x /usr/lib/jvm/java-17-openjdk/bin/java ]; then
                  JAVA_EXE="/usr/lib/jvm/java-17-openjdk/bin/java"
                fi
                if [ -z "$JAVA_EXE" ]; then
                  echo "Java 17 not found. Install Temurin or OpenJDK 17."
                  exit 1
                fi

                printf 'eula=true\\n' > eula.txt

                UNIX_ARGS="libraries/net/minecraftforge/forge/FORGE_ID/unix_args.txt"
                if [ ! -f "$UNIX_ARGS" ]; then
                  echo "Installing Forge server via BMCLAPI..."
                  "$JAVA_EXE" -jar forge.jar --installServer --mirror https://bmclapi2.bangbang93.com
                  if [ ! -f "$UNIX_ARGS" ]; then
                    echo "Forge install failed."
                    exit 1
                  fi
                fi

                JVM_ARGS="user_jvm_args.txt"
                if grep -q "Windows-ROOT" user_jvm_args.txt 2>/dev/null; then
                  grep -v "Windows-ROOT" user_jvm_args.txt > .user_jvm_args.unix.txt
                  JVM_ARGS=".user_jvm_args.unix.txt"
                fi

                echo "Starting dedicated server..."
                exec "$JAVA_EXE" @"$JVM_ARGS" @"$UNIX_ARGS" nogui
                """.replace("FORGE_ID", forgeId);
    }

    static String crlf(String text) {
        return lf(text).replace("\n", "\r\n");
    }

    static String lf(String text) {
        return text.replace("\r\n", "\n").replace("\r", "\n");
    }

    private static void putText(ZipOutputStream zip, String name, String text) throws Exception {
        zip.putNextEntry(new ZipEntry(name.replace('\\', '/')));
        zip.write(text.getBytes(StandardCharsets.UTF_8));
        zip.closeEntry();
    }

    private static void putFile(ZipOutputStream zip, String name, Path file) throws Exception {
        zip.putNextEntry(new ZipEntry(name.replace('\\', '/')));
        try (var in = Files.newInputStream(file)) {
            in.transferTo(zip);
        }
        zip.closeEntry();
    }
}
