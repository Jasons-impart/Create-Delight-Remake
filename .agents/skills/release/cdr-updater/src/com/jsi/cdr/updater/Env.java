package com.jsi.cdr.updater;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

final class Env {
    private Env() {}

    static Path prepare(Pack.Config config, Path updaterJar, Path runtime) throws Exception {
        Files.createDirectories(runtime);
        Pack.buildRepos(config, System.out::println);
        Path client = runtime.resolve("client");
        Path server = runtime.resolve("server");
        copyRepo(config.clientDir, client);
        copyRepo(config.serverDir, server);
        installUpdater(client, updaterJar, config, "client");
        installUpdater(server, updaterJar, config, "server");
        writeEula(server);
        writeServerJvmArgs(server, config.updateServerUrl);
        writeServerStart(server, config);
        Path zip = runtime.resolve(config.packName + "-" + config.officialVersion + "-PCL2.zip");
        Pcl2Pack.export(config, updaterJar, zip);
        Files.writeString(runtime.resolve("README.txt"), """
                本目录是本地真实运行环境。

                客户端：把 %s 导入 PCL2（下载 → 整合包 → 安装整合包）。不要改 PCL2。
                也可把 client 目录当作已同步的游戏实例。

                服务端：先开更新服务器。Windows 运行 server\\启动游戏服务端.bat，Linux 运行 sh server/start.sh。
                更新器会在 Forge 扫描 mods 之前按文件哈希同步服务端。
                """.formatted(zip.getFileName()));
        System.out.println("运行环境已准备: " + runtime.toAbsolutePath());
        System.out.println("客户端实例: " + client.toAbsolutePath());
        System.out.println("服务端实例: " + server.toAbsolutePath());
        System.out.println("PCL2 整合包: " + zip.toAbsolutePath());
        return runtime;
    }

    private static void copyRepo(Path source, Path destination) throws Exception {
        Fs.deleteTree(destination);
        Files.createDirectories(destination);
        if (!Files.exists(source)) {
            return;
        }
        for (Path file : Fs.files(source)) {
            Fs.copyFile(file, destination.resolve(Fs.posix(source, file)));
        }
    }

    private static void installUpdater(Path instance, Path jar, Pack.Config config, String side) throws Exception {
        if (Files.isRegularFile(jar)) {
            Fs.copyFile(jar, instance.resolve("mods/cdr-updater.jar"));
        }
        Files.writeString(instance.resolve("cdr-updater.toml"), Pack.instanceToml(config, side), StandardCharsets.UTF_8);
    }

    private static void writeEula(Path server) throws Exception {
        Files.writeString(server.resolve("eula.txt"), "eula=true\n");
    }

    private static void writeServerJvmArgs(Path server, String serverUrl) throws Exception {
        Path args = server.resolve("user_jvm_args.txt");
        String agent = "-javaagent:mods/cdr-updater.jar=" + serverUrl;
        String trust = "-Djavax.net.ssl.trustStoreType=Windows-ROOT";
        String text = Files.isRegularFile(args) ? Files.readString(args) : "";
        StringBuilder out = new StringBuilder();
        if (!text.isBlank()) {
            out.append(text.stripTrailing()).append(System.lineSeparator());
        } else {
            out.append("-Xms4G -Xmx8G").append(System.lineSeparator());
        }
        if (!text.contains("trustStoreType=Windows-ROOT")) {
            out.append(trust).append(System.lineSeparator());
        }
        if (!text.contains("-javaagent:mods/cdr-updater.jar")) {
            out.append(agent).append(System.lineSeparator());
        }
        Files.writeString(args, out.toString());
    }

    private static void writeServerStart(Path server, Pack.Config config) throws Exception {
        String launcher = ServerPack.crlf(ServerPack.startBat(config));
        byte[] bytes = launcher.getBytes(StandardCharsets.US_ASCII);
        Files.write(server.resolve("启动游戏服务端.bat"), bytes);
        Files.write(server.resolve("start.bat"), bytes);
        byte[] unix = ServerPack.lf(ServerPack.startSh(config)).getBytes(StandardCharsets.US_ASCII);
        Files.write(server.resolve("启动游戏服务端.sh"), unix);
        Files.write(server.resolve("start.sh"), unix);
    }

    static Path runtimeDir(Pack.Config config, String override) {
        if (override != null && !override.isBlank()) {
            Path path = Path.of(override);
            return path.isAbsolute() ? path : Path.of("").toAbsolutePath().resolve(path).normalize();
        }
        return config.dataDir.toAbsolutePath().getParent().resolve("runtime");
    }

    static Path updaterJar() throws Exception {
        Path jar = Path.of(Env.class.getProtectionDomain().getCodeSource().getLocation().toURI());
        if (Files.isRegularFile(jar) && jar.getFileName().toString().endsWith(".jar")) {
            return jar;
        }
        return Path.of("dist/cdr-updater.jar").toAbsolutePath();
    }
}
