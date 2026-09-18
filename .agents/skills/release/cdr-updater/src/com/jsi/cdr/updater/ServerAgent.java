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
}
