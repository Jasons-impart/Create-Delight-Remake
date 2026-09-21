package com.jsi.cdr.updater;

import java.lang.instrument.Instrumentation;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;

public final class ServerAgent {
    public static void premain(String args, Instrumentation instrumentation) {
        run(args);
    }

    public static void agentmain(String args, Instrumentation instrumentation) {
        run(args);
    }

    private static void run(String args) {
        try {
            System.setProperty("cdr.updater.agent", "true");
            Path instance = LaunchHook.instanceDir();
            Path configFile = instance.resolve("cdr-updater.toml");
            String server = args == null || args.isBlank() ? LaunchHook.updateServer(instance) : args;
            String side = "server";
            String token = "";
            if (Files.isRegularFile(configFile)) {
                Map<String, Object> config = Toml.load(configFile);
                server = Toml.str(config, "update_server", server);
                side = Toml.str(config, "side", side);
                token = Toml.str(config, "update_token", "");
            }
            if ("client".equals(side)) {
                LaunchHook.markEarly();
                LaunchHook.clientGate();
                return;
            }
            Path logFile = instance.resolve("logs").resolve("cdr-updater.log");
            Files.createDirectories(logFile.getParent());
            StringBuilder log = new StringBuilder();
            Sync.Result result = Sync.apply(instance, "server", new Sync.Client(server, "server", instance, token), line -> {
                System.out.println("[CDR Updater] " + line);
                log.append(line).append(System.lineSeparator());
            });
            log.append(result.changelogText).append(System.lineSeparator());
            pinServerProperties(instance, result, log);
            Files.writeString(logFile, log.toString());
            if (result.changed) {
                System.out.println("[CDR Updater] 已同步文件，Forge 将继续加载当前 mods 目录。");
            }
        } catch (Exception error) {
            String message = error.getMessage() == null ? error.getClass().getSimpleName() : error.getMessage();
            System.err.println("[CDR Updater] 服务端更新失败: " + message);
            error.printStackTrace();
        }
    }

    private static void pinServerProperties(Path instance, Sync.Result result, StringBuilder log) {
        Path file = instance.resolve("server.properties");
        if (!Files.isRegularFile(file) || Files.isRegularFile(instance.resolve(PackPaths.SERVER_KEEP))) {
            return;
        }
        boolean shouldPin = result != null && result.applied.stream()
                .anyMatch(item -> "server.properties".equals(item.get("path")));
        if (!shouldPin) {
            return;
        }
        final byte[] expected;
        try {
            expected = Files.readAllBytes(file);
        } catch (Exception error) {
            return;
        }
        Thread pin = new Thread(() -> {
            long deadline = System.currentTimeMillis() + 120_000L;
            boolean restored = false;
            while (System.currentTimeMillis() < deadline) {
                try {
                    Thread.sleep(250L);
                    if (Files.isRegularFile(instance.resolve(PackPaths.SERVER_KEEP))) {
                        return;
                    }
                    if (!Files.isRegularFile(file)) {
                        Files.write(file, expected);
                        continue;
                    }
                    byte[] now = Files.readAllBytes(file);
                    if (java.util.Arrays.equals(expected, now)) {
                        continue;
                    }
                    if (PackPaths.hasManagedTag(new String(now, java.nio.charset.StandardCharsets.UTF_8))) {
                        Path keep = instance.resolve(PackPaths.SERVER_KEEP);
                        Files.createDirectories(keep.getParent());
                        Files.writeString(keep, "keep\n");
                        System.out.println("[CDR Updater] 检测到手动修改 server.properties，停止覆盖。");
                        return;
                    }
                    Files.write(file, expected);
                    if (!restored) {
                        restored = true;
                        System.out.println("[CDR Updater] 已再次写入 server.properties，覆盖 Forge 启动时生成的默认文件。");
                    }
                } catch (InterruptedException interrupted) {
                    Thread.currentThread().interrupt();
                    return;
                } catch (Exception ignored) {
                    // keep trying until the boot window ends
                }
            }
        }, "cdr-pin-server-properties");
        pin.setDaemon(true);
        pin.start();
        log.append("已盯住 server.properties，防止 Forge 启动时改回默认文件").append(System.lineSeparator());
    }
}
