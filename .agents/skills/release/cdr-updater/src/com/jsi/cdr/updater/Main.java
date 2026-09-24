package com.jsi.cdr.updater;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public final class Main {
    public static void main(String[] args) throws Exception {
        Net.installJvmDefaults();
        try {
            run(args);
        } catch (javax.net.ssl.SSLHandshakeException error) {
            System.err.println("无法连接 GitHub：证书校验失败。");
            System.err.println("若使用了代理/加速器，请把它的证书装进 Windows，或设置 HTTPS_PROXY=http://127.0.0.1:端口");
            System.err.println("本地调试可在启动前设置环境变量 CDR_SSL_INSECURE=1");
            throw error;
        }
    }

    private static void run(String[] args) throws Exception {
        if (args.length == 0 || "client".equals(args[0])) {
            ClientApp.launch();
            return;
        }
        switch (args[0]) {
            case "serve" -> serve(args);
            case "build" -> build(configPath(args));
            case "export-pcl2" -> exportPcl2(args);
            case "export-server" -> exportServer(args);
            case "prepare-env" -> prepareEnv(args);
            case "sync" -> sync(args);
            case "fetch-job" -> fetchJob();
            case "test" -> {
                int failed = Tests.run();
                if (failed != 0) {
                    System.exit(1);
                }
            }
            default -> {
                System.err.println("用法:");
                System.err.println("  双击运行 / client     打开客户端更新界面");
                System.err.println("  serve [--config 文件] [--rebuild]   启动更新服务器（含管理界面）");
                System.err.println("  export-pcl2 [--config 文件] [--out 文件]  导出 PCL2 可导入的客户端 zip");
                System.err.println("  export-server [--config 文件] [--out 文件]  导出可解压运行的服务端 zip");
                System.err.println("  prepare-env [--config 文件] [--runtime 目录]  拉取 GitHub 并生成客户端/服务端运行环境");
                System.err.println("  sync --side client|server --instance 目录 [--server URL]");
                System.err.println("  test                                 运行本地测试");
                System.exit(2);
            }
        }
    }

    private static void build(Path configPath) throws Exception {
        Pack.Config config = Pack.Config.load(configPath);
        Pack.buildRepos(config, System.out::println);
    }

    private static void exportPcl2(String[] args) throws Exception {
        Pack.Config config = Pack.Config.load(configPath(args));
        Path jar = Path.of(Main.class.getProtectionDomain().getCodeSource().getLocation().toURI());
        if (!Files.isRegularFile(jar) || !jar.getFileName().toString().endsWith(".jar")) {
            jar = Path.of("dist/cdr-updater.jar").toAbsolutePath();
        }
        Path output = Path.of(option(args, "--out", "dist/" + config.packName + "-" + config.officialVersion + "-PCL2.zip")).toAbsolutePath();
        Path zip = Pcl2Pack.export(config, jar, output);
        System.out.println("已导出 PCL2 客户端整合包: " + zip);
        System.out.println("在 PCL2 中：下载 → 整合包 → 安装整合包，选择该 zip。不要改启动器设置。");
    }

    private static void exportServer(String[] args) throws Exception {
        Pack.Config config = Pack.Config.load(configPath(args));
        Path output = Path.of(option(args, "--out", "dist/" + config.packName + "-" + config.officialVersion + "-Server.zip")).toAbsolutePath();
        Path zip = ServerPack.export(config, Env.updaterJar(), output, System.out::println);
        System.out.println("已导出服务端: " + zip);
        System.out.println("解压后先开更新服务器。Windows 运行 启动游戏服务端.bat，Linux 运行 sh start.sh。");
    }

    private static void prepareEnv(String[] args) throws Exception {
        Pack.Config config = Pack.Config.load(configPath(args));
        Path runtime = Env.runtimeDir(config, option(args, "--runtime", ""));
        Env.prepare(config, Env.updaterJar(), runtime);
    }

    private static void serve(String[] args) throws Exception {
        Path configPath = configPath(args);
        boolean rebuild = hasFlag(args, "--rebuild");
        Pack.Config config = Pack.Config.load(configPath);
        ServerRuntime runtime = new ServerRuntime(configPath, config);
        int cleaned = Pack.purgeIncomplete(runtime.config(), System.out::println);
        if (cleaned == 0) {
            System.out.println("没有发现不完整的下载包");
        }
        if (rebuild || !Files.isRegularFile(runtime.config().manifestsDir().resolve("meta.json"))) {
            try {
                Pack.buildRepos(runtime.config(), System.out::println);
            } finally {
                Progress.end();
            }
        }
        runtime.http = ApiServer.start(runtime);
        Pack.Config started = runtime.config();
        String adminHost = "0.0.0.0".equals(started.listen) || "::".equals(started.listen) ? "127.0.0.1" : started.listen;
        System.out.println("更新服务器已启动 http://" + started.listen + ":" + started.port);
        System.out.println("网页管理 http://" + adminHost + ":" + started.port + "/admin");
        System.out.println("管理只在网页上进行。关闭本窗口将停止更新服务。");
        Thread.currentThread().join();
        if (runtime.http != null) {
            runtime.http.stop(0);
        }
    }

    private static void fetchJob() throws Exception {
        String text = new String(System.in.readAllBytes(), java.nio.charset.StandardCharsets.UTF_8);
        Map<String, Object> job = Json.object(Json.parse(text));
        if ("pack".equals(Json.str(job, "mode"))) {
            List<Map<String, Object>> jobs = new ArrayList<>();
            for (Object item : Json.array(job.get("jobs"))) {
                jobs.add(Json.object(item));
            }
            String label = Json.str(job, "label");
            ClientApp.showPackWindow(label.isBlank() ? "压缩包下载" : label, (int) Json.lng(job, "index"));
            int code = 0;
            try {
                Sync.Client client = new Sync.Client(Json.str(job, "server"), Json.str(job, "side"),
                        Path.of(Json.str(job, "instance")), Json.str(job, "token"));
                client.savePack(Path.of(Json.str(job, "instance")), Json.str(job, "sha256"), Json.lng(job, "size"),
                        jobs, line -> {
                            System.out.println(line);
                            ClientApp.packLine(line);
                        }, Json.bool(job, "parallel"), label);
            } catch (Exception error) {
                System.err.println(error.getMessage());
                code = 1;
            } finally {
                ClientApp.closePackWindow();
            }
            System.exit(code);
        }
        String url = Json.str(job, "url");
        Path dest = Path.of(Json.str(job, "dest"));
        String label = Json.str(job, "label");
        long size = Json.lng(job, "size");
        java.net.http.HttpRequest.Builder request = java.net.http.HttpRequest.newBuilder(java.net.URI.create(url))
                .header("User-Agent", "cdr-updater-client")
                .timeout(java.time.Duration.ofMinutes(30));
        Path partial = dest.resolveSibling(dest.getFileName() + ".cdrtmp");
        try {
            Net.toFile(java.net.http.HttpClient.newHttpClient(), request, partial, size, label, System.out::println, true);
            Files.createDirectories(dest.getParent());
            Files.move(partial, dest, java.nio.file.StandardCopyOption.REPLACE_EXISTING);
        } catch (Exception error) {
            Files.deleteIfExists(partial);
            throw error;
        }
    }

    private static void sync(String[] args) throws Exception {
        String side = option(args, "--side", "");
        String instance = option(args, "--instance", "");
        String server = option(args, "--server", "http://127.0.0.1:8765");
        if (!"client".equals(side) && !"server".equals(side) || instance.isBlank()) {
            throw new IllegalArgumentException("sync 需要 --side client|server 和 --instance 目录");
        }
        Sync.Result result = Sync.apply(Path.of(instance), side,
                new Sync.Client(server, side, Path.of(instance), LaunchHook.updateToken(Path.of(instance))),
                System.out::println);
        System.out.println(result.changelogText);
    }

    private static Path configPath(String[] args) {
        return Path.of(option(args, "--config", "config.toml")).toAbsolutePath();
    }

    private static boolean hasFlag(String[] args, String flag) {
        for (String arg : args) {
            if (flag.equals(arg)) {
                return true;
            }
        }
        return false;
    }

    private static String option(String[] args, String name, String fallback) {
        for (int i = 0; i < args.length - 1; i++) {
            if (name.equals(args[i])) {
                return args[i + 1];
            }
        }
        return fallback;
    }
}
