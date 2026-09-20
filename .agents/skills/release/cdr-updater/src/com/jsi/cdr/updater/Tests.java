package com.jsi.cdr.updater;

import com.sun.net.httpserver.HttpServer;

import java.net.InetSocketAddress;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Duration;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.Set;

final class Tests {
    private static int failed;

    static int run() throws Exception {
        failed = 0;
        bootClassTests();
        policyTests();
        privateViewsTests();
        overlayRefreshTests();
        sideSplitTests();
        syncTests();
        liveRunningServerSyncTests();
        adminTests();
        securityTests();
        adminWebTests();
        progressTests();
        if (failed == 0) {
            System.out.println("全部测试通过");
        } else {
            System.out.println("失败 " + failed + " 项");
        }
        return failed;
    }

    private static void bootClassTests() throws Exception {
        check("Boot 可被 Java 8 加载", classMajor("com/jsi/cdr/updater/Boot.class") == 52);
        check("Main 仍是 Java 17", classMajor("com/jsi/cdr/updater/Main.class") == 61);
    }

    private static int classMajor(String resource) throws Exception {
        try (java.io.InputStream in = Tests.class.getClassLoader().getResourceAsStream(resource)) {
            if (in == null) {
                return -1;
            }
            byte[] header = in.readNBytes(8);
            if (header.length < 8) {
                return -1;
            }
            return ((header[6] & 0xff) << 8) | (header[7] & 0xff);
        }
    }

    private static void policyTests() {
        check("客户端玩家文件不删除", !Policy.shouldDeleteLocal("mods/my-extra.jar", Set.of("mods/create-1.0.jar")));
        check("客户端官方模组可删除", Policy.shouldDeleteLocal("mods/create-1.0.jar", Set.of("mods/create-1.0.jar")));
        check("服务端管理员改动不覆盖", !Policy.shouldOverwriteLocal(
                "kubejs/server_scripts/main.js", "server", "admin-edit", "new-official",
                Map.of("kubejs/server_scripts/main.js", "old-official")));
        check("服务端未改文件可更新", Policy.shouldOverwriteLocal(
                "kubejs/server_scripts/main.js", "server", "old-official", "new-official",
                Map.of("kubejs/server_scripts/main.js", "old-official")));
        check("服务端首次已存在文件保留", !Policy.shouldOverwriteLocal(
                "kubejs/server_scripts/main.js", "server", "already-there", "official", Map.of()));
        check("服务端缺失文件可下载", Policy.shouldOverwriteLocal(
                "mods/new.jar", "server", null, "abc", Map.of()));
        check("远程删除则删除服务端文件", Policy.shouldDeleteLocal(
                "kubejs/server_scripts/main.js", Set.of("kubejs/server_scripts/main.js", "mods/create-1.0.jar")));
        check("世界文件永不删除", !Policy.shouldDeleteLocal("world/level.dat", Set.of("world/level.dat")));
        check("模组生成的配置不覆盖", !Policy.shouldOverwriteLocal(
                "config/create-stuff-additions.toml", "client", "generated", "official",
                Map.of("config/create-stuff-additions.toml", "official")));
        check("模组生成的配置不删除", !Policy.shouldDeleteLocal(
                "config/create-stuff-additions.toml", Set.of("config/create-stuff-additions.toml")));
        check("本地没有配置时可写入默认", Policy.shouldOverwriteLocal(
                "config/create-stuff-additions.toml", "client", null, "official", Map.of()));
        check("客户端官方模组哈希不同则覆盖", Policy.shouldOverwriteLocal(
                "mods/create-1.0.jar", "client", "old", "new", Map.of("mods/create-1.0.jar", "old")));
        check("哈希相同不覆盖", !Policy.shouldOverwriteLocal(
                "mods/create-1.0.jar", "client", "same", "same", Map.of()));
        check("远程哈希为空不覆盖", !Policy.shouldOverwriteLocal(
                "mods/create-1.0.jar", "client", "old", "", Map.of()));
        check("options.txt 已存在不覆盖", !Policy.shouldOverwriteLocal(
                "options.txt", "client", "local", "official", Map.of("options.txt", "official")));
        check("options.txt 缺失可写入", Policy.shouldOverwriteLocal(
                "options.txt", "client", null, "official", Map.of()));
        check("eula.txt 已存在不覆盖", !Policy.shouldOverwriteLocal(
                "eula.txt", "server", "false", "true", Map.of("eula.txt", "true")));
        check("server.properties 已存在不覆盖", !Policy.shouldOverwriteLocal(
                "server.properties", "server", "local", "official", Map.of()));
        check("存档不删除", !Policy.shouldDeleteLocal("saves/New World/level.dat", Set.of("saves/New World/level.dat")));
        check("logs 不删除", !Policy.shouldDeleteLocal("logs/latest.log", Set.of("logs/latest.log")));
        check("libraries 不删除", !Policy.shouldDeleteLocal(
                "libraries/net/minecraftforge/forge.jar", Set.of("libraries/net/minecraftforge/forge.jar")));
        check("截图不删除", !Policy.shouldDeleteLocal("screenshots/a.png", Set.of("screenshots/a.png")));
        check("defaultconfigs 不覆盖", !Policy.shouldOverwriteLocal(
                "defaultconfigs/forge-server.toml", "server", "local", "official", Map.of()));
        check("状态文件不删除", !Policy.shouldDeleteLocal("cdr-updater-state.json", Set.of("cdr-updater-state.json")));
        check("非托管路径不删除", !Policy.shouldDeleteLocal("mods/player-extra.jar", Set.of("mods/create-1.0.jar")));
    }

    private static void privateViewsTests() {
        check("私货目录归类", "mods".equals(PrivateViews.folderOf("mods/a.jar")));
        check("私货嵌套目录", "config/ItemBan".equals(PrivateViews.folderOf("config/ItemBan/x.json")));
        check("私货根目录", ".".equals(PrivateViews.folderOf("eula.txt")));
        check("空路径走默认", "mods/a.jar".equals(PrivateViews.resolveDest("", "a.jar", 1)));
        check("目录加斜杠", "mods/a.jar".equals(PrivateViews.resolveDest("mods/", "a.jar", 1)));
        check("完整路径保留", "mods/web-private.jar".equals(PrivateViews.resolveDest("mods/web-private.jar", "upload.bin", 1)));
        check("多文件用目录", "kubejs/server_scripts/a.js".equals(PrivateViews.resolveDest("kubejs/server_scripts", "a.js", 2)));
        Pack.PrivateFile a = new Pack.PrivateFile("mods/a.jar", "both", Path.of("a"));
        Pack.PrivateFile b = new Pack.PrivateFile("mods/b.jar", "server", Path.of("b"));
        Pack.PrivateFile c = new Pack.PrivateFile("config/x.toml", "both", Path.of("c"));
        List<PrivateViews.Row> rows = PrivateViews.grouped(List.of(c, b, a), "");
        check("先按目录分组", rows.get(0).group && "config".equals(rows.get(0).folder) && rows.get(0).count == 1);
        check("mods 两份一组", rows.stream().anyMatch(row -> row.group && "mods".equals(row.folder) && row.count == 2));
        check("搜索端侧", PrivateViews.grouped(List.of(a, b, c), "仅服务端").stream()
                .anyMatch(row -> row.file != null && "mods/b.jar".equals(row.file.path)));
        List<String> folders = PrivateViews.destFolders(List.of(c));
        check("推送目录含默认 mods", folders.contains("mods/"));
        check("推送目录含已有 config", folders.contains("config/"));
        check("目录名去斜杠", "config/ItemBan".equals(PrivateViews.normalizeFolder("config/ItemBan/")));
        check("目录名去掉端侧前缀", "kubejs/custom".equals(PrivateViews.normalizeFolder("both/kubejs/custom")));
    }

    private static void overlayRefreshTests() throws Exception {
        Path tmp = Files.createTempDirectory("cdr-overlay-refresh");
        try {
            Path official = tmp.resolve("official");
            Path privateDir = tmp.resolve("private");
            Files.createDirectories(privateDir);
            write(official.resolve("mods/create-1.0.jar"), "create-1.0");
            write(official.resolve("config/keep.toml"), "keep=1\n");
            Pack.Config config = config(tmp, official, privateDir);
            Pack.buildRepos(config, line -> {});
            Path marker = config.clientDir.resolve("cdr-keep-marker.txt");
            Files.writeString(marker, "keep-me");

            List<String> logs = new ArrayList<>();
            Pack.buildRepos(config, logs::add);
            check("无改动时增量重建", logs.stream().anyMatch(line -> line.contains("只更新有改动")));
            check("增量重建不清空仓库", "keep-me".equals(Files.readString(marker)));

            Path extra = tmp.resolve("extra.jar");
            Files.writeString(extra, "extra-private");
            Privates.add(config, extra, "mods/extra-private.jar", "both");
            logs.clear();
            Pack.buildRepos(config, logs::add);
            check("添加私货走增量", logs.stream().anyMatch(line -> line.contains("只更新有改动")));
            check("增量写入新私货", "extra-private".equals(Files.readString(config.clientDir.resolve("mods/extra-private.jar"))));
            check("添加私货不重建整个仓库", "keep-me".equals(Files.readString(marker)));

            write(official.resolve("config/keep.toml"), "keep=2\n");
            logs.clear();
            Pack.buildRepos(config, logs::add);
            check("官方改动被增量写入", "keep=2\n".equals(Files.readString(config.clientDir.resolve("config/keep.toml"))));
            check("官方改动不重建整个仓库", "keep-me".equals(Files.readString(marker)));

            Privates.remove(config, "mods/extra-private.jar");
            logs.clear();
            Pack.buildRepos(config, logs::add, Set.of("mods/extra-private.jar"));
            check("删除私货走增量", logs.stream().anyMatch(line -> line.contains("只更新有改动")));
            check("删除私货后仓库去掉文件", !Files.exists(config.clientDir.resolve("mods/extra-private.jar")));
            check("删除私货不重建整个仓库", "keep-me".equals(Files.readString(marker)));

            write(tmp.resolve("overlay-create.jar"), "overlay-create");
            Privates.add(config, tmp.resolve("overlay-create.jar"), "mods/create-1.0.jar", "both");
            Pack.buildRepos(config, line -> {});
            check("私货覆盖官方", "overlay-create".equals(Files.readString(config.clientDir.resolve("mods/create-1.0.jar"))));
            Privates.remove(config, "mods/create-1.0.jar");
            Pack.buildRepos(config, line -> {}, Set.of("mods/create-1.0.jar"));
            check("删除覆盖后恢复官方", "create-1.0".equals(Files.readString(config.clientDir.resolve("mods/create-1.0.jar"))));

            String folder = Privates.createFolder(config, "config/ItemBan");
            check("可新建目录", "config/ItemBan/".equals(folder)
                    && Files.isDirectory(privateDir.resolve("files/config/ItemBan")));
            check("新建目录出现在推送列表",
                    PrivateViews.destFolders(privateDir, Privates.list(config)).contains("config/ItemBan/"));

            write(privateDir.resolve("files/server/mods/side-only.jar"), "side-only");
            Pack.buildRepos(config, line -> {});
            check("目录前缀仅服务端不到客户端", !Files.exists(config.clientDir.resolve("mods/side-only.jar")));
            Privates.setSide(config, "mods/side-only.jar", "both");
            Pack.buildRepos(config, line -> {});
            check("改端侧不删文件", Files.isRegularFile(privateDir.resolve("files/mods/side-only.jar"))
                    && "side-only".equals(Files.readString(privateDir.resolve("files/mods/side-only.jar"))));
            check("改端侧写出 .side", "both".equals(Files.readString(privateDir.resolve("files/mods/side-only.jar.side")).trim()));
            check("改端侧离开 server/ 前缀", !Files.exists(privateDir.resolve("files/server/mods/side-only.jar")));
            check("改成两端后客户端有文件", "side-only".equals(Files.readString(config.clientDir.resolve("mods/side-only.jar"))));
            check("改成两端后服务端有文件", "side-only".equals(Files.readString(config.serverDir.resolve("mods/side-only.jar"))));
        } finally {
            Fs.deleteTree(tmp);
        }
    }

    private static void sideSplitTests() throws Exception {
        Path tmp = Files.createTempDirectory("cdr-side-test");
        try {
            Path clientSrc = tmp.resolve("gh-client");
            Path serverSrc = tmp.resolve("gh-server");
            write(clientSrc.resolve("mods/jei.jar"), "jei");
            write(clientSrc.resolve("mods/jei.jar.pw.toml"), "filename = \"jei.jar\"\nside = \"client\"\n");
            write(clientSrc.resolve("resourcepacks/pack.zip"), "rp");
            write(clientSrc.resolve("options.txt"), "lang=zh");
            write(serverSrc.resolve("mods/create.jar"), "create");
            write(serverSrc.resolve("mods/create.jar.pw.toml"), "filename = \"create.jar\"\nside = \"both\"\n");
            write(serverSrc.resolve("libraries/net/minecraftforge/forge.jar"), "lib");
            write(serverSrc.resolve("kubejs/server_scripts/main.js"), "console.log('s')\n");
            Path clientDir = tmp.resolve("out-client");
            Path serverDir = tmp.resolve("out-server");
            Map<String, String> sides = Pack.ingestReleaseTrees(clientSrc, serverSrc, clientDir, serverDir, line -> {});
            check("仅客户端资源包不到服务端", !Files.exists(serverDir.resolve("resourcepacks/pack.zip")));
            check("客户端有资源包", Files.isRegularFile(clientDir.resolve("resourcepacks/pack.zip")));
            check("JEI 不到服务端", !Files.exists(serverDir.resolve("mods/jei.jar")));
            check("客户端有 JEI", Files.isRegularFile(clientDir.resolve("mods/jei.jar")));
            check("Create 两端都有", Files.isRegularFile(clientDir.resolve("mods/create.jar")) && Files.isRegularFile(serverDir.resolve("mods/create.jar")));
            check("libraries 只在服务端", Files.isRegularFile(serverDir.resolve("libraries/net/minecraftforge/forge.jar"))
                    && !Files.exists(clientDir.resolve("libraries/net/minecraftforge/forge.jar")));
            check("options 只在客户端", Files.isRegularFile(clientDir.resolve("options.txt")) && !Files.exists(serverDir.resolve("options.txt")));
            check("服务端脚本在服务端", Files.isRegularFile(serverDir.resolve("kubejs/server_scripts/main.js")));
            check("服务端脚本不到客户端", !Files.exists(clientDir.resolve("kubejs/server_scripts/main.js")));

            Path privateRoot = tmp.resolve("private");
            write(privateRoot.resolve("files/resourcepacks/private.zip"), "private-rp");
            write(privateRoot.resolve("files/kubejs/server_scripts/extra.js"), "private-s");
            write(privateRoot.resolve("files/config/shared.toml"), "a=1\n");
            write(privateRoot.resolve("files/client/mods/minimap.jar"), "map");
            java.util.List<Pack.PrivateFile> privates = Pack.loadPrivate(privateRoot, sides);
            Map<String, String> privateSides = new java.util.LinkedHashMap<>();
            for (Pack.PrivateFile file : privates) {
                privateSides.put(file.path, file.side);
            }
            check("私货资源包自动判定为客户端", "client".equals(privateSides.get("resourcepacks/private.zip")));
            check("私货服务端脚本自动判定为服务端", "server".equals(privateSides.get("kubejs/server_scripts/extra.js")));
            check("私货配置自动判定为两端", "both".equals(privateSides.get("config/shared.toml")));
            check("私货 client/ 目录前缀生效", "client".equals(privateSides.get("mods/minimap.jar")));

            Path wrapped = tmp.resolve("cf-zip");
            write(wrapped.resolve("manifest.json"), "{\"manifestType\":\"minecraftModpack\"}");
            write(wrapped.resolve("overrides/mods/a.jar"), "a");
            check("CurseForge zip 使用 overrides 为包根", wrapped.resolve("overrides").equals(Fs.packRoot(wrapped)));

            HttpServer files = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
            byte[] packBytes = "resource-pack-bytes".getBytes(StandardCharsets.UTF_8);
            files.createContext("/extra.zip", exchange -> {
                exchange.sendResponseHeaders(200, packBytes.length);
                exchange.getResponseBody().write(packBytes);
                exchange.close();
            });
            byte[] html = "<html>not a pack</html>".getBytes(StandardCharsets.UTF_8);
            files.createContext("/fake.zip", exchange -> {
                exchange.sendResponseHeaders(200, html.length);
                exchange.getResponseBody().write(html);
                exchange.close();
            });
            files.start();
            try {
                int port = files.getAddress().getPort();
                Path pwClient = tmp.resolve("pw-client");
                Path pwServer = tmp.resolve("pw-server");
                Files.createDirectories(pwServer);
                write(pwClient.resolve("config/keep.toml"), "a=1\n");
                write(pwClient.resolve("resourcepacks/extra.pw.toml"),
                        "filename = \"extra.zip\"\nside = \"client\"\n\n[download]\nurl = \"http://127.0.0.1:" + port + "/extra.zip\"\n");
                write(pwClient.resolve("resourcepacks/fake.pw.toml"),
                        "filename = \"fake.zip\"\nside = \"client\"\n\n[download]\nurl = \"http://127.0.0.1:" + port + "/fake.zip\"\n");
                Path outC = tmp.resolve("pw-out-c");
                Path outS = tmp.resolve("pw-out-s");
                Pack.ingestReleaseTrees(pwClient, pwServer, outC, outS, line -> {});
                Packwiz.pullClientAssets(pwClient, pwServer, outC, tmp.resolve("pw-cache"), line -> {});
                check("客户端从清单拉取资源包", Files.isRegularFile(outC.resolve("resourcepacks/extra.zip"))
                        && Files.readString(outC.resolve("resourcepacks/extra.zip")).equals("resource-pack-bytes"));
                check("服务端不拉取该资源包", !Files.exists(outS.resolve("resourcepacks/extra.zip")));
                check("HTML 响应不当成资源包", !Files.exists(outC.resolve("resourcepacks/fake.zip")));
                Packwiz.pullClientAssets(pwClient, pwServer, outC, tmp.resolve("pw-cache"), line -> {});
                check("资源已齐后进度结束", !Progress.get().active);
            } finally {
                files.stop(0);
            }
        } finally {
            Fs.deleteTree(tmp);
        }
    }

    private static void syncTests() throws Exception {
        Path tmp = Files.createTempDirectory("cdr-updater-test");
        Path official = tmp.resolve("official");
        Path privateDir = tmp.resolve("private");
        Files.createDirectories(privateDir);
            write(official.resolve("mods/create-1.0.jar"), "create-1.0");
            write(official.resolve("mods/jei-1.0.jar"), "jei-client");
            write(official.resolve("mods/jei-1.0.jar.pw.toml"), "filename = \"jei-1.0.jar\"\nside = \"client\"\n");
            write(official.resolve("config/server.toml"), "motd=default\n");
            write(official.resolve("config/keep.toml"), "keep=1\n");
        write(official.resolve("kubejs/server_scripts/main.js"), "console.log('v1')\n");
        write(official.resolve("resourcepacks/pack.zip"), "rp");
        write(official.resolve("shaderpacks/pack.zip"), "sp");
        write(official.resolve("options.txt"), "lang=en\n");
        write(official.resolve("libraries/net/minecraftforge/forge.jar"), "lib");
        write(official.resolve("server.properties"), "motd=official\n");
        write(official.resolve("eula.txt"), "eula=false\n");
        write(official.resolve("start.bat"), "java -jar forge.jar\n");
        write(privateDir.resolve("files/mods/ItemBan-2.2.0.jar"), "itemban");
        write(privateDir.resolve("files/mods/ItemBan-2.2.0.jar.side"), "server");
        write(privateDir.resolve("files/mods/maid.jar"), "maid");
        Pack.Config config = config(tmp, official, privateDir);
        Pack.buildRepos(config, line -> {});
        check("仓库构建后进度结束", !Progress.get().active);
        ServerRuntime runtime = new ServerRuntime(null, config);
        HttpServer server = ApiServer.start(runtime);
        try {
            String url = "http://127.0.0.1:" + server.getAddress().getPort();
            Path clientInstance = tmp.resolve("client-instance");
            write(clientInstance.resolve("mods/player-extra.jar"), "i-installed-this");
            write(clientInstance.resolve("config/generated-by-mod.toml"), "auto=true\n");
            write(clientInstance.resolve("saves/New World/level.dat"), "player-world");
            write(clientInstance.resolve("screenshots/a.png"), "shot");
            write(clientInstance.resolve("options.txt"), "lang=zh-player\n");
            Sync.Result clientResult = Sync.apply(clientInstance, "client", new Sync.Client(url, "client", clientInstance), line -> {});
            check("客户端保留玩家模组", Files.readString(clientInstance.resolve("mods/player-extra.jar")).equals("i-installed-this"));
            check("客户端下载官方模组", Files.isRegularFile(clientInstance.resolve("mods/create-1.0.jar")));
            check("客户端包含 JEI", Files.isRegularFile(clientInstance.resolve("mods/jei-1.0.jar")));
            check("客户端包含资源包", Files.isRegularFile(clientInstance.resolve("resourcepacks/pack.zip")));
            check("客户端包含光影", Files.isRegularFile(clientInstance.resolve("shaderpacks/pack.zip")));
            check("客户端包含两端私货", Files.readString(clientInstance.resolve("mods/maid.jar")).equals("maid"));
            check("客户端不含服务端私货 ItemBan", !Files.exists(clientInstance.resolve("mods/ItemBan-2.2.0.jar")));
            check("客户端不含 libraries", !Files.exists(clientInstance.resolve("libraries/net/minecraftforge/forge.jar")));
            check("客户端不含 start.bat", !Files.exists(clientInstance.resolve("start.bat")));
            check("客户端不删除玩家模组", clientResult.applied.stream().noneMatch(item -> "mods/player-extra.jar".equals(item.get("path"))));
            check("客户端保留模组生成的配置", Files.readString(clientInstance.resolve("config/generated-by-mod.toml")).equals("auto=true\n"));
            check("客户端保留存档", Files.readString(clientInstance.resolve("saves/New World/level.dat")).equals("player-world"));
            check("客户端保留截图", Files.readString(clientInstance.resolve("screenshots/a.png")).equals("shot"));
            check("客户端不覆盖已有 options.txt", Files.readString(clientInstance.resolve("options.txt")).equals("lang=zh-player\n"));
            write(clientInstance.resolve("config/server.toml"), "motd=client-generated\n");
            Sync.apply(clientInstance, "client", new Sync.Client(url, "client", clientInstance), line -> {});
            check("客户端不覆盖模组已生成配置", Files.readString(clientInstance.resolve("config/server.toml")).equals("motd=client-generated\n"));
            Sync.Check noUpdate = Sync.inspect(clientInstance, "client", new Sync.Client(url, "client", clientInstance));
            check("无改动时不需要更新", !noUpdate.needed);
            check("客户端同步不记连接", Connections.list(config).isEmpty());

            Path serverInstance = tmp.resolve("server-instance");
            Sync.Client serverClient = new Sync.Client(url, "server", serverInstance);
            Sync.apply(serverInstance, "server", serverClient, line -> {});
            check("服务端不含 JEI", !Files.exists(serverInstance.resolve("mods/jei-1.0.jar")));
            check("服务端不含资源包", !Files.exists(serverInstance.resolve("resourcepacks/pack.zip")));
            check("服务端不含光影", !Files.exists(serverInstance.resolve("shaderpacks/pack.zip")));
            check("服务端不含 options.txt", !Files.exists(serverInstance.resolve("options.txt")));
            check("服务端含 libraries", Files.isRegularFile(serverInstance.resolve("libraries/net/minecraftforge/forge.jar")));
            check("服务端含 ItemBan 私货", Files.readString(serverInstance.resolve("mods/ItemBan-2.2.0.jar")).equals("itemban"));
            check("服务端含两端私货", Files.readString(serverInstance.resolve("mods/maid.jar")).equals("maid"));
            Path localConfig = serverInstance.resolve("config/server.toml");
            check("服务端写入默认配置", Files.readString(localConfig).equals("motd=default\n"));
            check("服务端缺失 eula 可写入", Files.readString(serverInstance.resolve("eula.txt")).equals("eula=false\n"));
            Files.writeString(localConfig, "motd=admin-changed\n");
            write(official.resolve("config/server.toml"), "motd=new-official\n");
            write(official.resolve("kubejs/server_scripts/main.js"), "console.log('v2')\n");
            Pack.buildRepos(config, line -> {});
            Sync.Result kept = Sync.apply(serverInstance, "server", serverClient, line -> {});
            check("管理员改动被保留", Files.readString(localConfig).equals("motd=admin-changed\n"));
            check("记录保留的本地改动", kept.keptLocal.contains("config/server.toml"));
            check("未改脚本仍更新", Files.readString(serverInstance.resolve("kubejs/server_scripts/main.js")).equals("console.log('v2')\n"));
            write(official.resolve("mods/pack-extra.jar"), "extra-v1");
            Pack.buildRepos(config, line -> {});
            Sync.apply(serverInstance, "server", serverClient, line -> {});
            check("服务端下载可管理模组", Files.readString(serverInstance.resolve("mods/pack-extra.jar")).equals("extra-v1"));
            Files.delete(official.resolve("mods/pack-extra.jar"));
            Pack.buildRepos(config, line -> {});
            Sync.Result removed = Sync.apply(serverInstance, "server", serverClient, line -> {});
            check("远程删除后移除本地文件", !Files.exists(serverInstance.resolve("mods/pack-extra.jar")));
            check("删除动作已记录", removed.applied.stream().anyMatch(item ->
                    "mods/pack-extra.jar".equals(item.get("path")) && "delete".equals(item.get("action"))));
            Files.delete(official.resolve("config/server.toml"));
            Pack.buildRepos(config, line -> {});
            Sync.apply(serverInstance, "server", serverClient, line -> {});
            check("远程删除也不改模组配置", Files.exists(localConfig));
            write(serverInstance.resolve("mods/admin-extra.jar"), "admin-keep");
            write(serverInstance.resolve("world/level.dat"), "world-bytes");
            write(serverInstance.resolve("eula.txt"), "eula=true\n");
            write(serverInstance.resolve("server.properties"), "motd=admin\n");
            Map<String, Object> serverState = Sync.loadState(serverInstance);
            List<Object> managed = new ArrayList<>(Json.array(serverState.get("managed_paths")));
            managed.add("world/level.dat");
            serverState.put("managed_paths", managed);
            Files.writeString(serverInstance.resolve("cdr-updater-state.json"), Json.stringify(serverState));
            Sync.apply(serverInstance, "server", serverClient, line -> {});
            check("服务端不删除管理员额外模组", Files.readString(serverInstance.resolve("mods/admin-extra.jar")).equals("admin-keep"));
            check("服务端不删除世界", Files.readString(serverInstance.resolve("world/level.dat")).equals("world-bytes"));
            check("服务端不覆盖已有 eula", Files.readString(serverInstance.resolve("eula.txt")).equals("eula=true\n"));
            check("服务端不覆盖已有 server.properties", Files.readString(serverInstance.resolve("server.properties")).equals("motd=admin\n"));
            Files.delete(serverInstance.resolve("mods/create-1.0.jar"));
            Sync.apply(serverInstance, "server", serverClient, line -> {});
            check("服务端缺失文件会补回", Files.readString(serverInstance.resolve("mods/create-1.0.jar")).equals("create-1.0"));
            write(serverInstance.resolve("mods/create-1.0.jar"), "admin-mod-edit");
            write(official.resolve("mods/create-1.0.jar"), "create-1.2");
            Pack.buildRepos(config, line -> {});
            Sync.apply(serverInstance, "server", serverClient, line -> {});
            check("服务端管理员改模组不覆盖", Files.readString(serverInstance.resolve("mods/create-1.0.jar")).equals("admin-mod-edit"));
            check("服务端同步记连接", Connections.list(config).size() == 1);

            Path firstServer = tmp.resolve("server-first-existing");
            write(firstServer.resolve("kubejs/server_scripts/main.js"), "pre-existing\n");
            write(firstServer.resolve("mods/create-1.0.jar"), "already-there");
            Sync.apply(firstServer, "server", new Sync.Client(url, "server", firstServer), line -> {});
            check("服务端首次已有脚本保留", Files.readString(firstServer.resolve("kubejs/server_scripts/main.js")).equals("pre-existing\n"));
            check("服务端首次已有模组保留", Files.readString(firstServer.resolve("mods/create-1.0.jar")).equals("already-there"));
            check("服务端首次仍补缺失文件", Files.isRegularFile(firstServer.resolve("mods/maid.jar")));

            write(official.resolve("mods/create-1.0.jar"), "create-1.1");
            Files.deleteIfExists(official.resolve("mods/jei-1.0.jar"));
            Files.deleteIfExists(official.resolve("mods/jei-1.0.jar.pw.toml"));
            Pack.buildRepos(config, line -> {});
            Sync.Check hasUpdate = Sync.inspect(clientInstance, "client", new Sync.Client(url, "client", clientInstance));
            check("模组文件变化时需要更新", hasUpdate.needed);
            check("模组变化标记正确", hasUpdate.modsChanged);
            Sync.apply(clientInstance, "client", new Sync.Client(url, "client", clientInstance), line -> {});
            check("客户端官方模组变化会覆盖", Files.readString(clientInstance.resolve("mods/create-1.0.jar")).equals("create-1.1"));
            check("客户端远程删除官方 JEI", !Files.exists(clientInstance.resolve("mods/jei-1.0.jar")));
            check("客户端远程删除仍保留玩家模组", Files.readString(clientInstance.resolve("mods/player-extra.jar")).equals("i-installed-this"));
            check("客户端远程删除仍保留存档", Files.readString(clientInstance.resolve("saves/New World/level.dat")).equals("player-world"));
            Sync.Check afterClient = Sync.inspect(clientInstance, "client", new Sync.Client(url, "client", clientInstance));
            check("客户端再次检查无需更新", !afterClient.needed);

            write(official.resolve("mods/create-1.0.jar.pw.toml"),
                    "filename = \"create-1.0.jar\"\nside = \"both\"\n\n[update.curseforge]\nproject-id = 328085\nfile-id = 6123456\n");
            Path dummyJar = tmp.resolve("cdr-updater.jar");
            Files.write(dummyJar, new byte[]{1, 2, 3});
            Path zip = Pcl2Pack.export(config, dummyJar, tmp.resolve("client-pcl2.zip"));
            try (java.util.zip.ZipFile zipped = new java.util.zip.ZipFile(zip.toFile())) {
                check("PCL2 zip 含 CurseForge manifest", zipped.getEntry("manifest.json") != null);
                check("PCL2 zip 含 mcbbs.packmeta", zipped.getEntry("mcbbs.packmeta") != null);
                check("PCL2 zip 含更新器 jar", zipped.getEntry("overrides/mods/cdr-updater.jar") != null);
                check("PCL2 zip 含实例配置", zipped.getEntry("overrides/cdr-updater.toml") != null);
                check("PCL2 zip 含配置文件", zipped.getEntry("overrides/config/keep.toml") != null);
                check("PCL2 zip 不含模组 jar", zipped.getEntry("overrides/mods/create-1.0.jar") == null);
                check("PCL2 zip 不含 JEI jar", zipped.getEntry("overrides/mods/jei-1.0.jar") == null);
                check("PCL2 zip 不含私货模组", zipped.getEntry("overrides/mods/maid.jar") == null);
                check("PCL2 zip 仍含资源包", zipped.getEntry("overrides/resourcepacks/pack.zip") != null);
                check("PCL2 zip 不套额外根目录", zipped.getEntry("Create-Delight-Remake/manifest.json") == null);
                check("zip 不写入 PCL 配置", zipped.getEntry("PCL/Setup.ini") == null);
                Map<String, Object> manifest = Json.object(Json.parse(new String(zipped.getInputStream(zipped.getEntry("manifest.json")).readAllBytes(), java.nio.charset.StandardCharsets.UTF_8)));
                check("CurseForge 清单类型正确", "minecraftModpack".equals(Json.str(manifest, "manifestType")));
                check("CurseForge 覆盖目录为 overrides", "overrides".equals(Json.str(manifest, "overrides")));
                List<Object> curseFiles = Json.array(manifest.get("files"));
                check("CurseForge 清单写入带编号的模组", curseFiles.size() == 1);
                Map<String, Object> createFile = Json.object(curseFiles.get(0));
                check("CurseForge projectID 正确", Json.lng(createFile, "projectID") == 328085);
                check("CurseForge fileID 正确", Json.lng(createFile, "fileID") == 6123456);
                Map<String, Object> packmeta = Json.object(Json.parse(new String(zipped.getInputStream(zipped.getEntry("mcbbs.packmeta")).readAllBytes(), java.nio.charset.StandardCharsets.UTF_8)));
                check("MCBBS 清单含 game 与 forge", Json.array(packmeta.get("addons")).size() == 2);
            }
        } finally {
            server.stop(0);
            Fs.deleteTree(tmp);
        }
    }

    private static void adminTests() throws Exception {
        Path tmp = Files.createTempDirectory("cdr-admin-test");
        try {
            Path official = tmp.resolve("official");
            Path privateDir = tmp.resolve("private");
            Files.createDirectories(privateDir);
            write(official.resolve("mods/create-1.0.jar"), "create-1.0");
            write(official.resolve("kubejs/server_scripts/main.js"), "console.log('v1')\n");
            Pack.Config config = config(tmp, official, privateDir);
            Pack.buildRepos(config, line -> {});

            Path cache = config.dataDir.resolve("cache").resolve("v-broken");
            Files.createDirectories(cache);
            Files.writeString(cache.resolve("release.json"),
                    "{\"assets\":[{\"name\":\"Client-v-broken.zip\",\"size\":1000},{\"name\":\"Server-v-broken.zip\",\"size\":2000}]}");
            Files.write(cache.resolve("Client-v-broken.zip"), new byte[]{1, 2, 3});
            Files.write(cache.resolve("Server-v-broken.zip"), new byte[]{1, 2, 3, 4});
            Files.write(cache.resolve("Client-v-broken.zip.partial"), new byte[]{9});
            Files.createDirectories(cache.resolve("client-raw"));
            write(cache.resolve("client-raw/keep.txt"), "x");
            int cleaned = Pack.purgeIncomplete(config, line -> {});
            check("不完整客户端包被删除", !Files.exists(cache.resolve("Client-v-broken.zip")));
            check("不完整服务端包被删除", !Files.exists(cache.resolve("Server-v-broken.zip")));
            check("partial 文件被删除", !Files.exists(cache.resolve("Client-v-broken.zip.partial")));
            check("不完整包对应解压目录被删除", !Files.exists(cache.resolve("client-raw")));
            check("清理计数大于 0", cleaned >= 2);

            Path configFile = tmp.resolve("config.toml");
            Files.writeString(configFile, """
                    [server]
                    listen = "127.0.0.1"
                    port = 8765
                    data_dir = "./data"
                    public_url = "http://127.0.0.1:8765"

                    [official]
                    github_repo = "Jasons-impart/Create-Delight-Remake"
                    version = "v0.5.0.13-test"

                    [private]
                    overlay_dir = "./private"
                    """);
            Toml.setTableString(configFile, "official", "version", "v9.9.9");
            Map<String, Object> officialTable = Json.object(Toml.load(configFile).get("official"));
            check("可改 config.toml 的 GitHub 版本", "v9.9.9".equals(Toml.str(officialTable, "version", "")));
            Toml.setTableString(configFile, "server", "listen", "0.0.0.0");
            Toml.setTableInt(configFile, "server", "port", 9000);
            Toml.setTableString(configFile, "server", "public_url", "http://10.0.0.8:9000");
            Pack.Config loaded = Pack.Config.load(configFile);
            check("可改监听地址", "0.0.0.0".equals(loaded.listen));
            check("可改端口", loaded.port == 9000);
            check("可改对外连接地址", "http://10.0.0.8:9000".equals(loaded.updateServerUrl));
            Toml.setTableString(configFile, "server", "access_token", "gui-token-1");
            Pack.Config withToken = Pack.Config.load(configFile);
            check("可改访问令牌", "gui-token-1".equals(withToken.accessToken));
            check("实例配置会写入令牌", Pack.instanceToml(withToken, "client").contains("update_token = \"gui-token-1\""));
            Toml.setTableString(configFile, "server", "admin_token", "web-admin-1");
            Pack.Config withAdmin = Pack.Config.load(configFile);
            check("可改网页管理令牌", "web-admin-1".equals(withAdmin.adminToken));
            check("实例配置不写入网页令牌", !Pack.instanceToml(withAdmin, "client").contains("web-admin-1"));
            ServerRuntime guiRuntime = new ServerRuntime(null, withAdmin);
            guiRuntime.setAdminToken("from-gui", line -> {});
            check("图形化可改网页令牌", "from-gui".equals(guiRuntime.config().adminToken));
            boolean guiSameRejected = false;
            try {
                guiRuntime.setAdminToken("gui-token-1", line -> {});
            } catch (IllegalArgumentException error) {
                guiSameRejected = error.getMessage() != null && error.getMessage().contains("不能和客户端");
            }
            check("图形化拒绝两令牌相同", guiSameRejected);
            boolean sameRejected = false;
            try {
                Pack.Config.requireDistinctTokens("same-token", "same-token");
            } catch (IllegalArgumentException error) {
                sameRejected = error.getMessage() != null && error.getMessage().contains("不能和客户端");
            }
            check("网页令牌不能和同步令牌相同", sameRejected);
            boolean needsPublic = false;
            try {
                Pack.Config.normalizePublicUrl("", "0.0.0.0", 8765);
            } catch (IllegalArgumentException error) {
                needsPublic = error.getMessage() != null && error.getMessage().contains("对外地址");
            }
            check("0.0.0.0 必须填对外地址", needsPublic);
            check("公网 IPv4 判定", Wan.isPublicIpv4("223.15.46.113"));
            check("局域网不是公网", !Wan.isPublicIpv4("192.168.1.8"));
            check("CGNAT 不是公网", !Wan.isPublicIpv4("100.93.158.55"));
            check("CurseForge jar 进 mods", "mods".equals(Packwiz.folderForClientFile("embeddium-0.3.31+mc1.20.1.jar", "")));
            check("CurseForge 光影 zip 进 shaderpacks", "shaderpacks".equals(Packwiz.folderForClientFile("complementary.zip", "shader")));
            check("CurseForge 资源包进 resourcepacks", "resourcepacks".equals(Packwiz.folderForClientFile("lang.zip", "")));
            Path saveName = AdminApp.realPath(tmp.resolve("pack.zip").toFile(), tmp.toFile());
            check("导出路径用真实目录", tmp.resolve("pack.zip").equals(saveName));
            Path relativeSave = AdminApp.realPath(new java.io.File("pack.zip"), tmp.toFile());
            check("相对文件名拼到当前目录", tmp.resolve("pack.zip").equals(relativeSave));

            Path extra = tmp.resolve("extra-private.jar");
            write(extra, "private-mod");
            Privates.add(config, extra, "mods/extra-private.jar", "client");
            Pack.buildRepos(config, line -> {});
            boolean listed = Privates.list(config).stream().anyMatch(file -> "mods/extra-private.jar".equals(file.path) && "client".equals(file.side));
            check("可一键添加私货", listed && Files.isRegularFile(config.clientDir.resolve("mods/extra-private.jar")));
            Privates.remove(config, "mods/extra-private.jar");
            Pack.buildRepos(config, line -> {});
            check("可一键删除私货", Privates.list(config).stream().noneMatch(file -> "mods/extra-private.jar".equals(file.path))
                    && !Files.exists(config.privateDir.resolve("files/mods/extra-private.jar")));

            check("CurseForge 特殊文件名会编码", Packwiz.encodePath("【1.20.1】§l.zip").contains("%C2%A7"));
            check("CDN 空格会编码", Packwiz.forgeCdn(8094407, "a b.zip").contains("%20"));
            check("走官方 API 而不是网页", Packwiz.officialFileUrl(238222, 8419086).startsWith("https://api.curseforge.com/"));
            check("官方下载地址带 download", Packwiz.officialDownloadUrl(238222, 8419086).endsWith("/download"));
            check("网页 CurseForge 会被丢掉", Packwiz.isWebsiteCurseForge("https://www.curseforge.com/api/v1/mods/1/files/2"));
            check("官方 API 不需要人机验证域名", !Packwiz.isWebsiteCurseForge(Packwiz.officialFileUrl(1, 2)));
            check("CDN 下载要带 API Key", Packwiz.needsApiKey("https://edge.forgecdn.net/files/1/2/a.jar"));
            Packwiz.ingestFilesJson("{\"data\":{\"id\":4596285,\"modId\":704584,\"fileName\":\"real-mod.jar\",\"downloadUrl\":\"https://edge.forgecdn.net/files/4596/285/real-mod.jar\"}}");
            Packwiz.Asset resolved = Packwiz.resolve(null, new Packwiz.Asset("mods/cf-4596285.jar", "client", "cf-4596285.jar", "", 704584, 4596285), line -> {});
            check("官方 API 能解析真实文件名", "real-mod.jar".equals(resolved.filename));
            check("官方 API 提供直链", resolved.url.contains("edge.forgecdn.net"));
            Path html = tmp.resolve("not-a-pack.zip");
            Files.writeString(html, "<html>login</html>");
            check("HTML 页面不当成资源包", Packwiz.looksLikeHtml(html));

            Path dummyJar = tmp.resolve("cdr-updater.jar");
            Files.write(dummyJar, new byte[]{1, 2, 3});
            Path serverZip = ServerPack.export(config, dummyJar, tmp.resolve("server-export.zip"), line -> {});
            try (java.util.zip.ZipFile zipped = new java.util.zip.ZipFile(serverZip.toFile())) {
                check("服务端 zip 含启动脚本", zipped.getEntry("启动游戏服务端.bat") != null);
                check("服务端 zip 含 eula", zipped.getEntry("eula.txt") != null);
                check("服务端 zip 含更新器", zipped.getEntry("mods/cdr-updater.jar") != null);
                check("服务端 zip 含模组", zipped.getEntry("mods/create-1.0.jar") != null);
                String args = new String(zipped.getInputStream(zipped.getEntry("user_jvm_args.txt")).readAllBytes(), java.nio.charset.StandardCharsets.UTF_8);
                check("服务端 zip 含 javaagent", args.contains("-javaagent:mods/cdr-updater.jar="));
                String start = new String(zipped.getInputStream(zipped.getEntry("启动游戏服务端.bat")).readAllBytes(), java.nio.charset.StandardCharsets.UTF_8);
                check("服务端启动脚本会安装 Forge", start.contains("--installServer"));
                check("服务端启动不转调官方 start.bat", !start.contains("call start.bat"));
                check("启动脚本是 ASCII", start.chars().allMatch(ch -> ch < 128));
                check("启动脚本不用 UTF-8 代码页", !start.contains("chcp 65001"));
                check("服务端 zip 含 Linux 启动脚本", zipped.getEntry("start.sh") != null);
                check("服务端 zip 含中文名 Linux 脚本", zipped.getEntry("启动游戏服务端.sh") != null);
                byte[] unixBytes = zipped.getInputStream(zipped.getEntry("start.sh")).readAllBytes();
                String unix = new String(unixBytes, java.nio.charset.StandardCharsets.UTF_8);
                check("Linux 启动脚本是 LF", unixBytes.length > 0 && unix.indexOf('\r') < 0);
                check("Linux 启动脚本会装 Forge", unix.contains("--installServer") && unix.contains("unix_args.txt"));
                check("Linux 启动走 BMCLAPI", unix.contains("bmclapi2.bangbang93.com"));
                check("Linux 启动不转调官方 run.sh", !unix.contains("./run.sh") && !unix.contains("variables.nix.txt"));
                check("Linux 启动脚本是 ASCII", unix.chars().allMatch(ch -> ch < 128));
            }

            HttpServer server = ApiServer.start(config);
            try {
                String url = "http://127.0.0.1:" + server.getAddress().getPort();
                Path clientInstance = tmp.resolve("client-conn");
                Sync.apply(clientInstance, "client", new Sync.Client(url), line -> {});
                check("客户端连接不记录", Connections.list(config).isEmpty());

                Path serverA = tmp.resolve("server-a");
                Path serverB = tmp.resolve("server-b");
                Sync.apply(serverA, "server", new Sync.Client(url, "server", serverA), line -> {});
                Sync.apply(serverA, "server", new Sync.Client(url, "server", serverA), line -> {});
                Sync.apply(serverB, "server", new Sync.Client(url, "server", serverB), line -> {});
                java.util.List<Connections.Record> records = Connections.list(config);
                check("两台服务端各记一次", records.size() == 2);
                long repeats = records.stream().filter(row -> row.instancePath.contains("server-a")).mapToLong(row -> row.syncCount).findFirst().orElse(0);
                check("同一服务端重复连接会累计次数", repeats >= 2);
            } finally {
                server.stop(0);
            }
        } finally {
            Fs.deleteTree(tmp);
        }
    }

    private static void securityTests() throws Exception {
        check("上级目录路径不安全", Fs.unsafePath("mods/../secret.txt"));
        check("正常模组路径安全", !Fs.unsafePath("mods/create.jar"));
        check("空路径不安全", Fs.unsafePath(""));
        boolean badHash = false;
        try {
            Fs.sha256Hex("not-a-hash");
        } catch (IllegalArgumentException ignored) {
            badHash = true;
        }
        check("非哈希被拒绝", badHash);
        Path tmp = Files.createTempDirectory("cdr-sec");
        try {
            Path zip = tmp.resolve("bad.zip");
            try (java.util.zip.ZipOutputStream out = new java.util.zip.ZipOutputStream(Files.newOutputStream(zip))) {
                out.putNextEntry(new java.util.zip.ZipEntry("../escape.txt"));
                out.write("no".getBytes(StandardCharsets.UTF_8));
                out.closeEntry();
            }
            boolean rejected = false;
            try {
                Fs.extractZip(zip, tmp.resolve("out"));
            } catch (Exception ignored) {
                rejected = true;
            }
            check("解压拒绝跳出目录的条目", rejected);
            check("跳出目录的文件未写出", !Files.exists(tmp.resolve("escape.txt")));

            Pack.Config config = config(tmp, tmp.resolve("official"), tmp.resolve("private"));
            boolean badObject = false;
            try {
                Pack.objectPath(config, "zzzz");
            } catch (IllegalArgumentException ignored) {
                badObject = true;
            }
            check("对象路径拒绝非法哈希", badObject);

            HttpServer server = ApiServer.start(config);
            try {
                String url = "http://127.0.0.1:" + server.getAddress().getPort();
                java.net.http.HttpClient http = java.net.http.HttpClient.newHttpClient();
                java.net.http.HttpResponse<String> put = http.send(
                        java.net.http.HttpRequest.newBuilder(java.net.URI.create(url + "/api/status"))
                                .PUT(java.net.http.HttpRequest.BodyPublishers.noBody()).build(),
                        java.net.http.HttpResponse.BodyHandlers.ofString());
                check("status 拒绝非 GET", put.statusCode() == 405);
                java.net.http.HttpResponse<String> badFile = http.send(
                        java.net.http.HttpRequest.newBuilder(java.net.URI.create(url + "/api/file/not-a-hash")).GET().build(),
                        java.net.http.HttpResponse.BodyHandlers.ofString());
                check("文件接口拒绝非法哈希", badFile.statusCode() == 400);
            } finally {
                server.stop(0);
            }

            Pack.Config locked = new Pack.Config(
                    "127.0.0.1", 0, tmp.resolve("data2"), "Jasons-impart/Create-Delight-Remake",
                    "v0.5.0.13-test", "https://api.github.com", tmp.resolve("official"),
                    tmp.resolve("private"), tmp.resolve("u"), tmp.resolve("c"), tmp.resolve("s"),
                    tmp.resolve("o"), "1.20.1", "47.4.16", "Create-Delight-Remake",
                    "http://127.0.0.1:0", "secret-token");
            HttpServer gated = ApiServer.start(locked);
            try {
                String url = "http://127.0.0.1:" + gated.getAddress().getPort();
                java.net.http.HttpClient http = java.net.http.HttpClient.newHttpClient();
                java.net.http.HttpResponse<String> denied = http.send(
                        java.net.http.HttpRequest.newBuilder(java.net.URI.create(url + "/api/status")).GET().build(),
                        java.net.http.HttpResponse.BodyHandlers.ofString());
                check("无令牌不能读状态", denied.statusCode() == 401);
                java.net.http.HttpResponse<String> allowed = http.send(
                        java.net.http.HttpRequest.newBuilder(java.net.URI.create(url + "/api/status"))
                                .header("X-CDR-Token", "secret-token").GET().build(),
                        java.net.http.HttpResponse.BodyHandlers.ofString());
                check("正确令牌可以访问", allowed.statusCode() == 200 || allowed.statusCode() == 409);
                java.net.http.HttpResponse<String> adminPage = http.send(
                        java.net.http.HttpRequest.newBuilder(java.net.URI.create(url + "/admin")).GET().build(),
                        java.net.http.HttpResponse.BodyHandlers.ofString());
                check("无令牌也能打开登录页", adminPage.statusCode() == 200);
            } finally {
                gated.stop(0);
            }
        } finally {
            Fs.deleteTree(tmp);
        }
    }

    private static void adminWebTests() throws Exception {
        Path tmp = Files.createTempDirectory("cdr-web-admin");
        try {
            Path official = tmp.resolve("official");
            Path privateDir = tmp.resolve("private");
            Files.createDirectories(privateDir);
            write(official.resolve("mods/create-1.0.jar"), "create-1.0");
            Pack.Config config = config(tmp, official, privateDir).withAccessToken("client-token").withAdminToken("admin-token");
            Pack.buildRepos(config, line -> {});
            ServerRuntime runtime = new ServerRuntime(null, config);
            HttpServer server = ApiServer.start(runtime);
            try {
                String url = "http://127.0.0.1:" + server.getAddress().getPort();
                HttpClient http = HttpClient.newHttpClient();
                HttpResponse<String> page = http.send(
                        HttpRequest.newBuilder(java.net.URI.create(url + "/admin")).GET().build(),
                        HttpResponse.BodyHandlers.ofString());
                check("管理网页可打开", page.statusCode() == 200 && page.body().contains("网页远程管理"));
                check("网页风格是暗色面板", page.body().contains("data-theme=\"dark\"") && page.body().contains("--panel"));
                check("网页含已连接服务端", page.body().contains("已连接的服务端"));
                check("网页含私货", page.body().contains("添加私货"));
                check("网页含私货搜索", page.body().contains("id=\"privateSearch\""));
                check("网页含推送目录", page.body().contains("id=\"privateDestFolder\"") && page.body().contains("可多选"));
                check("网页含新建目录", page.body().contains("id=\"privateNewFolder\"") && page.body().contains("id=\"newFolderBtn\""));
                check("网页可直接改端侧", page.body().contains("data-side-path") && page.body().contains("side-select"));
                check("网页改动点保存才写入", page.body().contains("点保存后才会写入")
                        && page.body().contains("id=\"discardBtn\"")
                        && page.body().contains("不保存"));
                check("网页用自绘弹窗确认", page.body().contains("id=\"modal\"")
                        && page.body().contains("id=\"modalOk\"")
                        && !page.body().contains("window.confirm"));
                check("网页超长文本省略", page.body().contains("text-overflow: ellipsis")
                        && page.body().contains("table-layout: fixed"));
                check("网页含连接地址", page.body().contains("开放外网访问") && page.body().contains("同步令牌"));
                check("网页含下载进度条", page.body().contains("id=\"xfer\"") && page.body().contains("id=\"xferFill\""));
                check("网页登录指向本机窗口", page.body().contains("本机更新服务器窗口") && page.body().contains("网页管理"));
                check("网页不设置网页令牌", !page.body().contains("id=\"adminToken\"") && !page.body().contains("genAdminTokenBtn"));
                check("网页含 GitHub 版本", page.body().contains("应用并重新拉取")
                        && page.body().contains("id=\"versionTag\"")
                        && page.body().contains("id=\"versionTagDrop\"")
                        && !page.body().contains("<datalist"));
                check("网页含运行日志", page.body().contains("运行日志"));
                check("网页不含导出 PCL2", !page.body().contains("导出 PCL2"));
                check("网页不含导出服务端", !page.body().contains("导出服务端"));

                HttpResponse<String> denied = http.send(
                        HttpRequest.newBuilder(java.net.URI.create(url + "/admin/api/state")).GET().build(),
                        HttpResponse.BodyHandlers.ofString());
                check("未登录不能读管理状态", denied.statusCode() == 401);

                HttpResponse<String> badLogin = http.send(
                        HttpRequest.newBuilder(java.net.URI.create(url + "/admin/api/login"))
                                .header("Content-Type", "application/json")
                                .POST(HttpRequest.BodyPublishers.ofString("{\"token\":\"wrong\"}")).build(),
                        HttpResponse.BodyHandlers.ofString());
                check("错误令牌不能登录", badLogin.statusCode() == 400);

                HttpResponse<String> clientLogin = http.send(
                        HttpRequest.newBuilder(java.net.URI.create(url + "/admin/api/login"))
                                .header("Content-Type", "application/json")
                                .POST(HttpRequest.BodyPublishers.ofString("{\"token\":\"client-token\"}")).build(),
                        HttpResponse.BodyHandlers.ofString());
                check("客户端令牌不能登录网页", clientLogin.statusCode() == 400);

                HttpResponse<String> login = http.send(
                        HttpRequest.newBuilder(java.net.URI.create(url + "/admin/api/login"))
                                .header("Content-Type", "application/json")
                                .POST(HttpRequest.BodyPublishers.ofString("{\"token\":\"admin-token\"}")).build(),
                        HttpResponse.BodyHandlers.ofString());
                check("正确令牌可以登录网页", login.statusCode() == 200);

                HttpResponse<String> clientHeader = http.send(
                        HttpRequest.newBuilder(java.net.URI.create(url + "/admin/api/state"))
                                .header("X-CDR-Token", "client-token").GET().build(),
                        HttpResponse.BodyHandlers.ofString());
                check("同步令牌不能读管理接口", clientHeader.statusCode() == 401);

                HttpResponse<String> state = http.send(
                        HttpRequest.newBuilder(java.net.URI.create(url + "/admin/api/state"))
                                .header("X-CDR-Admin-Token", "admin-token").GET().build(),
                        HttpResponse.BodyHandlers.ofString());
                check("登录后可读管理状态", state.statusCode() == 200 && state.body().contains("official_version"));
                check("管理状态含进度", state.body().contains("\"progress\""));
                check("管理状态含服务端列表", state.body().contains("\"servers\""));
                check("管理状态含私货列表", state.body().contains("\"privates\""));
                check("管理状态含推送目录", state.body().contains("\"private_folders\""));

                HttpResponse<String> created = http.send(
                        HttpRequest.newBuilder(java.net.URI.create(url + "/admin/api/private/folder"))
                                .header("X-CDR-Admin-Token", "admin-token")
                                .header("Content-Type", "application/json")
                                .POST(HttpRequest.BodyPublishers.ofString("{\"path\":\"config/ItemBan\"}")).build(),
                        HttpResponse.BodyHandlers.ofString());
                check("网页可新建目录", created.statusCode() == 200
                        && Files.isDirectory(privateDir.resolve("files/config/ItemBan"))
                        && created.body().contains("config/ItemBan"));

                String encoded = Base64.getEncoder().encodeToString("web-private-bytes".getBytes(StandardCharsets.UTF_8));
                HttpResponse<String> added = http.send(
                        HttpRequest.newBuilder(java.net.URI.create(url + "/admin/api/private"))
                                .header("X-CDR-Admin-Token", "admin-token")
                                .header("Content-Type", "application/json")
                                .POST(HttpRequest.BodyPublishers.ofString(
                                        "{\"dest\":\"mods/web-private.jar\",\"side\":\"server\",\"filename\":\"web-private.jar\",\"data_base64\":\""
                                                + encoded + "\"}")).build(),
                        HttpResponse.BodyHandlers.ofString());
                check("网页可添加私货", added.statusCode() == 200);
                check("网页添加的私货已落地", Files.isRegularFile(privateDir.resolve("files/mods/web-private.jar")));

                HttpResponse<String> sided = http.send(
                        HttpRequest.newBuilder(java.net.URI.create(url + "/admin/api/private/side"))
                                .header("X-CDR-Admin-Token", "admin-token")
                                .header("Content-Type", "application/json")
                                .POST(HttpRequest.BodyPublishers.ofString(
                                        "{\"path\":\"mods/web-private.jar\",\"side\":\"both\"}")).build(),
                        HttpResponse.BodyHandlers.ofString());
                check("网页可改端侧", sided.statusCode() == 200
                        && Files.isRegularFile(privateDir.resolve("files/mods/web-private.jar"))
                        && "both".equals(Files.readString(privateDir.resolve("files/mods/web-private.jar.side")).trim()));

                HttpResponse<String> removed = http.send(
                        HttpRequest.newBuilder(java.net.URI.create(url + "/admin/api/private/remove"))
                                .header("X-CDR-Admin-Token", "admin-token")
                                .header("Content-Type", "application/json")
                                .POST(HttpRequest.BodyPublishers.ofString("{\"path\":\"mods/web-private.jar\"}")).build(),
                        HttpResponse.BodyHandlers.ofString());
                check("网页可删除私货", removed.statusCode() == 200
                        && !Files.exists(privateDir.resolve("files/mods/web-private.jar")));

                int port = server.getAddress().getPort();
                HttpResponse<String> saved = http.send(
                        HttpRequest.newBuilder(java.net.URI.create(url + "/admin/api/connection"))
                                .header("X-CDR-Admin-Token", "admin-token")
                                .header("Content-Type", "application/json")
                                .POST(HttpRequest.BodyPublishers.ofString(
                                        "{\"listen\":\"127.0.0.1\",\"port\":" + port
                                                + ",\"public_url\":\"http://127.0.0.1:" + port
                                                + "\",\"access_token\":\"client-token\"}")).build(),
                        HttpResponse.BodyHandlers.ofString());
                check("网页可保存连接地址", saved.statusCode() == 200);

                HttpResponse<String> hijack = http.send(
                        HttpRequest.newBuilder(java.net.URI.create(url + "/admin/api/connection"))
                                .header("X-CDR-Admin-Token", "admin-token")
                                .header("Content-Type", "application/json")
                                .POST(HttpRequest.BodyPublishers.ofString(
                                        "{\"listen\":\"127.0.0.1\",\"port\":" + port
                                                + ",\"public_url\":\"http://127.0.0.1:" + port
                                                + "\",\"access_token\":\"client-token\",\"admin_token\":\"stolen-token\"}")).build(),
                        HttpResponse.BodyHandlers.ofString());
                check("网页不能改网页令牌", hijack.statusCode() == 200);
                HttpResponse<String> stolenLogin = http.send(
                        HttpRequest.newBuilder(java.net.URI.create(url + "/admin/api/login"))
                                .header("Content-Type", "application/json")
                                .POST(HttpRequest.BodyPublishers.ofString("{\"token\":\"stolen-token\"}")).build(),
                        HttpResponse.BodyHandlers.ofString());
                check("网页提交的新令牌无效", stolenLogin.statusCode() == 400);
                HttpResponse<String> stillAdmin = http.send(
                        HttpRequest.newBuilder(java.net.URI.create(url + "/admin/api/state"))
                                .header("X-CDR-Admin-Token", "admin-token").GET().build(),
                        HttpResponse.BodyHandlers.ofString());
                check("原网页令牌仍然有效", stillAdmin.statusCode() == 200);

                HttpResponse<String> sameTokens = http.send(
                        HttpRequest.newBuilder(java.net.URI.create(url + "/admin/api/connection"))
                                .header("X-CDR-Admin-Token", "admin-token")
                                .header("Content-Type", "application/json")
                                .POST(HttpRequest.BodyPublishers.ofString(
                                        "{\"listen\":\"127.0.0.1\",\"port\":" + port
                                                + ",\"public_url\":\"http://127.0.0.1:" + port
                                                + "\",\"access_token\":\"admin-token\"}")).build(),
                        HttpResponse.BodyHandlers.ofString());
                check("网页不能把同步令牌改成网页令牌", sameTokens.statusCode() == 400);

                HttpResponse<String> export = http.send(
                        HttpRequest.newBuilder(java.net.URI.create(url + "/admin/api/export"))
                                .header("X-CDR-Admin-Token", "admin-token")
                                .POST(HttpRequest.BodyPublishers.noBody()).build(),
                        HttpResponse.BodyHandlers.ofString());
                check("网页没有导出接口", export.statusCode() == 404);
            } finally {
                server.stop(0);
            }
        } finally {
            Fs.deleteTree(tmp);
        }
    }

    private static void progressTests() throws Exception {
        Progress.end();
        Progress.begin("拉取", 2);
        Progress.ensure("Client.zip", 800);
        Progress.bytes(400);
        check("进度百分比", Progress.get().percent() == 50);
        check("进度文本", Progress.get().text().contains("50%") && Progress.get().text().contains("Client.zip"));
        check("多文件序号", Progress.get().index == 1 && Progress.get().count == 2);
        Progress.ensure("Server.zip", 1000);
        check("下一文件序号", Progress.get().index == 2);
        check("体积格式", "1.0 MB".equals(Progress.formatSize(1048576)));
        Progress.end();
        check("结束后无进度", !Progress.get().active);
        check("GitHub 会套加速源", Net.downloadUrls("https://github.com/a/b/releases/download/v/f.zip").size() > 1);
        check("GitHub 优先走加速源", Net.downloadUrls("https://github.com/a/b/releases/download/v/f.zip")
                .get(0).startsWith("https://ghfast.top/"));
        check("GitHub 加速源带原地址", Net.downloadUrls("https://github.com/a/b/releases/download/v/f.zip")
                .get(0).contains("https://github.com/a/b/releases/download/v/f.zip"));
        check("GitHub 直连放最后", "https://github.com/a/b/releases/download/v/f.zip"
                .equals(Net.downloadUrls("https://github.com/a/b/releases/download/v/f.zip")
                        .get(Net.downloadUrls("https://github.com/a/b/releases/download/v/f.zip").size() - 1)));
        check("CurseForge 不套加速源", Net.downloadUrls("https://edge.forgecdn.net/files/1/2/a.jar").size() == 1);
        check("已加速不再套一层", Net.downloadUrls("https://ghfast.top/https://github.com/a/b/file.zip").size() == 1);
        check("重定向仍走加速源", "https://ghfast.top/https://objects.githubusercontent.com/x"
                .equals(Net.keepProxied("https://ghfast.top/", "https://objects.githubusercontent.com/x")));
        check("加速地址能还原 GitHub", "https://github.com/a/b/file.zip"
                .equals(Net.officialGithub("https://ghfast.top/https://github.com/a/b/file.zip")));

        Path tmp = Files.createTempDirectory("cdr-progress");
        HttpServer server = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
        byte[] payload = new byte[180_000];
        java.util.Arrays.fill(payload, (byte) 7);
        server.createContext("/blob", exchange -> {
            exchange.sendResponseHeaders(200, payload.length);
            exchange.getResponseBody().write(payload);
            exchange.close();
        });
        server.start();
        try {
            Path dest = tmp.resolve("blob.bin");
            java.util.List<String> lines = new java.util.ArrayList<>();
            HttpRequest.Builder req = HttpRequest.newBuilder(
                    java.net.URI.create("http://127.0.0.1:" + server.getAddress().getPort() + "/blob"))
                    .timeout(java.time.Duration.ofSeconds(30));
            long got = Net.toFile(HttpClient.newHttpClient(), req, dest, payload.length, "blob.bin", lines::add);
            check("带进度下载完整", got == payload.length && Files.size(dest) == payload.length);
            check("下载日志有完成", lines.stream().anyMatch(line -> line.contains("下载完成")));
            check("进度不刷屏", lines.stream().noneMatch(line -> line.contains("%")));
            check("下载后进度为完成", Progress.get().active && Progress.get().done == payload.length);
        } finally {
            server.stop(0);
            Progress.end();
            Fs.deleteTree(tmp);
        }

        Path rangeTmp = Files.createTempDirectory("cdr-range");
        HttpServer ranged = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
        byte[] big = new byte[400_000];
        java.util.Arrays.fill(big, (byte) 9);
        java.util.concurrent.ExecutorService pool = java.util.concurrent.Executors.newCachedThreadPool();
        ranged.setExecutor(pool);
        ranged.createContext("/ranged", exchange -> {
            String header = exchange.getRequestHeaders().getFirst("Range");
            int start = 0;
            int end = big.length - 1;
            int code = 200;
            if (header != null && header.startsWith("bytes=")) {
                String spec = header.substring(6);
                int dash = spec.indexOf('-');
                if (dash >= 0) {
                    if (dash > 0) {
                        start = Integer.parseInt(spec.substring(0, dash));
                    }
                    if (dash + 1 < spec.length()) {
                        end = Integer.parseInt(spec.substring(dash + 1));
                    }
                }
                end = Math.min(end, big.length - 1);
                code = 206;
                exchange.getResponseHeaders().add("Content-Range", "bytes " + start + "-" + end + "/" + big.length);
            }
            int length = end - start + 1;
            exchange.sendResponseHeaders(code, length);
            exchange.getResponseBody().write(big, start, length);
            exchange.close();
        });
        ranged.start();
        try {
            Path dest = rangeTmp.resolve("ranged.bin");
            java.util.List<String> lines = new java.util.ArrayList<>();
            HttpRequest.Builder req = HttpRequest.newBuilder(
                    java.net.URI.create("http://127.0.0.1:" + ranged.getAddress().getPort() + "/ranged"))
                    .timeout(java.time.Duration.ofSeconds(30));
            long got = Net.toFile(HttpClient.newHttpClient(), req, dest, big.length, "ranged.bin", lines::add);
            check("多线程下载完整", got == big.length && Files.size(dest) == big.length && java.util.Arrays.equals(big, Files.readAllBytes(dest)));
            check("日志标明多线程", lines.stream().anyMatch(line -> line.contains("16 线程")));
        } finally {
            ranged.stop(0);
            pool.shutdownNow();
            Progress.end();
            Fs.deleteTree(rangeTmp);
        }
    }

    private static void liveRunningServerSyncTests() throws Exception {
        String url = "http://127.0.0.1:8765";
        HttpClient http = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(3))
                .build();
        HttpResponse<String> statusResp;
        try {
            statusResp = http.send(
                    HttpRequest.newBuilder(URI.create(url + "/api/status"))
                            .timeout(Duration.ofSeconds(5))
                            .GET()
                            .build(),
                    HttpResponse.BodyHandlers.ofString());
        } catch (Exception error) {
            check("运行中的更新服务器可连", false);
            return;
        }
        String token = "";
        if (statusResp.statusCode() == 401) {
            token = "111";
            statusResp = http.send(
                    HttpRequest.newBuilder(URI.create(url + "/api/status"))
                            .header("X-CDR-Token", token)
                            .timeout(Duration.ofSeconds(5))
                            .GET()
                            .build(),
                    HttpResponse.BodyHandlers.ofString());
        }
        check("运行中的更新服务器可连", statusResp.statusCode() == 200);
        if (statusResp.statusCode() != 200) {
            return;
        }
        Map<String, Object> status = Json.object(Json.parse(statusResp.body()));
        check("运行中的更新服务器版本为当前 tag", "v0.5.0.13-test".equals(Json.str(status, "official_version")));

        Sync.Client probe = new Sync.Client(url, "client", null, token);
        Map<String, Object> clientManifest = probe.json("GET", "api/manifest?side=client", null);
        Map<String, Object> serverManifest = new Sync.Client(url, "server", null, token)
                .json("GET", "api/manifest?side=server", null);
        Set<String> clientPaths = pathSet(clientManifest);
        Set<String> serverPaths = pathSet(serverManifest);
        check("真实客户端清单含资源包", clientPaths.stream().anyMatch(path -> path.startsWith("resourcepacks/")));
        check("真实服务端清单不含资源包", serverPaths.stream().noneMatch(path -> path.startsWith("resourcepacks/")));
        check("真实客户端清单含光影", clientPaths.stream().anyMatch(path -> path.startsWith("shaderpacks/")));
        check("真实服务端清单不含光影", serverPaths.stream().noneMatch(path -> path.startsWith("shaderpacks/")));
        check("真实客户端清单含 options.txt", clientPaths.contains("options.txt"));
        check("真实服务端清单不含 options.txt", !serverPaths.contains("options.txt"));
        check("真实服务端清单含 start.bat/start.sh", serverPaths.contains("start.bat") || serverPaths.contains("start.sh"));
        check("真实客户端清单不含 start.bat", !clientPaths.contains("start.bat"));
        check("真实客户端有仅客户端模组", clientPaths.stream().anyMatch(path -> path.startsWith("mods/") && !serverPaths.contains(path)));

        Map<String, Object> clientDiff = probe.json("POST", "api/diff", liveDiffBody(
                "client",
                List.of(
                        fileRow("mods/player-extra.jar", "player-extra"),
                        fileRow("saves/New World/level.dat", "world"),
                        fileRow("world/level.dat", "world2"),
                        fileRow("screenshots/a.png", "shot"),
                        fileRow("options.txt", "lang=player"),
                        fileRow("config/generated-by-mod.toml", "auto=true")
                ),
                List.of("saves/New World/level.dat", "world/level.dat",
                        "options.txt", "config/generated-by-mod.toml"),
                Map.of()
        ));
        check("真实客户端 diff 不删玩家模组", noneRemove(clientDiff, "mods/player-extra.jar"));
        check("真实客户端 diff 不删存档", noneRemove(clientDiff, "saves/New World/level.dat"));
        check("真实客户端 diff 不删世界", noneRemove(clientDiff, "world/level.dat"));
        check("真实客户端 diff 不删截图", noneRemove(clientDiff, "screenshots/a.png"));
        check("真实客户端 diff 保留 options.txt", Json.array(clientDiff.get("kept_local")).contains("options.txt")
                || noneDownload(clientDiff, "options.txt"));
        check("真实客户端 diff 保留已有配置", Json.array(clientDiff.get("kept_local")).contains("config/generated-by-mod.toml")
                || noneDownload(clientDiff, "config/generated-by-mod.toml"));
        check("真实空客户端会下载官方文件", !Json.array(clientDiff.get("download")).isEmpty());

        String kubejs = serverPaths.stream()
                .filter(path -> path.startsWith("kubejs/server_scripts/") && path.endsWith(".js"))
                .findFirst()
                .orElse("");
        String serverMod = serverPaths.stream()
                .filter(path -> path.startsWith("mods/") && path.endsWith(".jar"))
                .findFirst()
                .orElse("");
        Map<String, String> hashes = fileHashes(serverManifest);
        Map<String, Object> serverDiff = new Sync.Client(url, "server", null, token).json("POST", "api/diff", liveDiffBody(
                "server",
                List.of(
                        fileRow("mods/admin-extra.jar", "admin-keep"),
                        fileRow("world/level.dat", "world-bytes"),
                        kubejs.isBlank() ? fileRow("mods/dummy.jar", "x") : fileRow(kubejs, "admin-edit"),
                        fileRow("eula.txt", "eula=true"),
                        fileRow("server.properties", "motd=admin")
                ),
                List.of("world/level.dat", kubejs, "eula.txt", "server.properties", serverMod),
                kubejs.isBlank() ? Map.of() : Map.of(kubejs, hashes.getOrDefault(kubejs, "old-official"))
        ));
        check("真实服务端 diff 不删额外模组", noneRemove(serverDiff, "mods/admin-extra.jar"));
        check("真实服务端 diff 不删世界", noneRemove(serverDiff, "world/level.dat"));
        if (!kubejs.isBlank()) {
            check("真实服务端 diff 保留管理员脚本", Json.array(serverDiff.get("kept_local")).contains(kubejs));
        }
        check("真实服务端缺失官方模组会下载", serverMod.isBlank() || !noneDownload(serverDiff, serverMod));

        Path repoRoot = Path.of("D:\\桌面\\更新器\\cdr-updater\\dist\\data\\repos");
        Path clientRepo = repoRoot.resolve("client");
        Path serverRepo = repoRoot.resolve("server");
        Path work = Path.of("D:\\桌面\\更新器\\cdr-updater\\tmp-live-sync");
        Path connections = Path.of("D:\\桌面\\更新器\\cdr-updater\\dist\\data\\server-connections.json");
        byte[] connectionsBackup = Files.isRegularFile(connections) ? Files.readAllBytes(connections) : null;
        if (!Files.isDirectory(clientRepo) || !Files.isDirectory(serverRepo)) {
            check("真实仓库可用于同步应用", false);
            return;
        }
        Pack.Config applyConfig = liveConfigHint();
        HttpServer applyServer = ApiServer.start(applyConfig);
        String applyUrl = "http://127.0.0.1:" + applyServer.getAddress().getPort();
        Fs.deleteTree(work);
        try {
            Path liveClient = work.resolve("client");
            Path liveServer = work.resolve("server");
            System.out.println("正在硬链接真实客户端仓库以测试同步...");
            hardlinkTree(clientRepo, liveClient);
            write(liveClient.resolve("mods/player-extra.jar"), "i-installed-this");
            write(liveClient.resolve("saves/New World/level.dat"), "player-world");
            write(liveClient.resolve("screenshots/live.png"), "shot");
            replaceFile(liveClient.resolve("options.txt"), "lang=zh-player\n");
            write(liveClient.resolve("config/generated-by-live.toml"), "auto=true\n");
            Sync.Result liveClientFirst = Sync.apply(liveClient, "client", new Sync.Client(applyUrl, "client", liveClient), line -> {});
            check("真实客户端首次同步完成", liveClientFirst != null);
            check("真实客户端同步后仍保留玩家模组", Files.readString(liveClient.resolve("mods/player-extra.jar")).equals("i-installed-this"));
            check("真实客户端同步后仍保留存档", Files.readString(liveClient.resolve("saves/New World/level.dat")).equals("player-world"));
            check("真实客户端同步后仍保留截图", Files.readString(liveClient.resolve("screenshots/live.png")).equals("shot"));
            if (Files.isRegularFile(liveClient.resolve("options.txt"))) {
                check("真实客户端同步后不覆盖 options.txt", Files.readString(liveClient.resolve("options.txt")).equals("lang=zh-player\n"));
            }
            check("真实客户端同步后保留生成配置", Files.readString(liveClient.resolve("config/generated-by-live.toml")).equals("auto=true\n"));
            String clientOnlyMod = clientPaths.stream()
                    .filter(path -> path.startsWith("mods/") && path.endsWith(".jar") && !serverPaths.contains(path)
                            && Files.isRegularFile(liveClient.resolve(path)))
                    .findFirst()
                    .orElse("");
            if (!clientOnlyMod.isBlank()) {
                byte[] original = Files.readAllBytes(liveClient.resolve(clientOnlyMod));
                replaceFile(liveClient.resolve(clientOnlyMod), "tampered-client-mod");
                Sync.apply(liveClient, "client", new Sync.Client(applyUrl, "client", liveClient), line -> {});
                check("真实客户端改官方模组会被覆盖",
                        java.util.Arrays.equals(original, Files.readAllBytes(liveClient.resolve(clientOnlyMod))));
            }
            Sync.Check liveClientInspect = Sync.inspect(liveClient, "client", new Sync.Client(applyUrl, "client", liveClient));
            check("真实客户端对齐后无需更新", !liveClientInspect.needed);

            System.out.println("正在硬链接真实服务端仓库以测试同步...");
            hardlinkTree(serverRepo, liveServer);
            Sync.Client liveServerClient = new Sync.Client(applyUrl, "server", liveServer);
            Sync.apply(liveServer, "server", liveServerClient, line -> {});
            write(liveServer.resolve("mods/admin-extra.jar"), "admin-keep");
            write(liveServer.resolve("world/level.dat"), "world-bytes");
            if (Files.isRegularFile(liveServer.resolve("eula.txt"))) {
                replaceFile(liveServer.resolve("eula.txt"), "eula=true\n");
            } else {
                write(liveServer.resolve("eula.txt"), "eula=true\n");
            }
            if (!kubejs.isBlank() && Files.isRegularFile(liveServer.resolve(kubejs))) {
                replaceFile(liveServer.resolve(kubejs), "admin-edit\n");
            }
            String smallManaged = serverPaths.stream()
                    .filter(path -> path.startsWith("kubejs/") && path.endsWith(".js") && !path.equals(kubejs)
                            && Files.isRegularFile(liveServer.resolve(path)))
                    .findFirst()
                    .orElse("");
            byte[] missingOriginal = smallManaged.isBlank() ? null : Files.readAllBytes(liveServer.resolve(smallManaged));
            if (!smallManaged.isBlank()) {
                Files.delete(liveServer.resolve(smallManaged));
            }
            Sync.Result liveServerSecond = Sync.apply(liveServer, "server", liveServerClient, line -> {});
            check("真实服务端不删额外模组", Files.readString(liveServer.resolve("mods/admin-extra.jar")).equals("admin-keep"));
            check("真实服务端不删世界", Files.readString(liveServer.resolve("world/level.dat")).equals("world-bytes"));
            check("真实服务端不覆盖 eula", Files.readString(liveServer.resolve("eula.txt")).equals("eula=true\n"));
            if (!kubejs.isBlank() && Files.isRegularFile(liveServer.resolve(kubejs))) {
                check("真实服务端保留管理员脚本", Files.readString(liveServer.resolve(kubejs)).equals("admin-edit\n"));
                check("真实服务端记录保留脚本", liveServerSecond.keptLocal.contains(kubejs));
            }
            if (!smallManaged.isBlank()) {
                check("真实服务端缺失文件会补回", Files.isRegularFile(liveServer.resolve(smallManaged))
                        && java.util.Arrays.equals(missingOriginal, Files.readAllBytes(liveServer.resolve(smallManaged))));
            }
            List<Connections.Record> liveRecords = Connections.list(applyConfig);
            final String liveMark = "tmp-live-sync";
            check("真实客户端同步仍不记连接", liveRecords.stream().noneMatch(row ->
                    row.instancePath != null && row.instancePath.replace('/', '\\').contains(liveMark + "\\client")));
            check("真实服务端同步记连接", liveRecords.stream().anyMatch(row ->
                    row.instancePath != null && row.instancePath.replace('/', '\\').contains(liveMark)));
        } finally {
            applyServer.stop(0);
            if (connectionsBackup == null) {
                Files.deleteIfExists(connections);
            } else {
                Files.write(connections, connectionsBackup);
            }
            Fs.deleteTree(work);
        }
    }

    private static Pack.Config liveConfigHint() {
        Path data = Path.of("D:\\桌面\\更新器\\cdr-updater\\dist\\data");
        return new Pack.Config(
                "127.0.0.1",
                0,
                data,
                "Jasons-impart/Create-Delight-Remake",
                "v0.5.0.13-test",
                "https://api.github.com",
                data,
                data,
                data.resolve("repos/unified"),
                data.resolve("repos/client"),
                data.resolve("repos/server"),
                data.resolve("objects")
        );
    }

    private static Set<String> pathSet(Map<String, Object> manifest) {
        java.util.LinkedHashSet<String> paths = new java.util.LinkedHashSet<>();
        for (Object item : Json.array(manifest.get("files"))) {
            paths.add(Fs.posix(Json.str(Json.object(item), "path")));
        }
        return paths;
    }

    private static Map<String, String> fileHashes(Map<String, Object> manifest) {
        Map<String, String> hashes = new java.util.LinkedHashMap<>();
        for (Object item : Json.array(manifest.get("files"))) {
            Map<String, Object> row = Json.object(item);
            hashes.put(Fs.posix(Json.str(row, "path")), Json.str(row, "sha256"));
        }
        return hashes;
    }

    private static Map<String, Object> fileRow(String path, String content) throws Exception {
        Map<String, Object> row = Json.map();
        row.put("path", path);
        byte[] bytes = content.getBytes(StandardCharsets.UTF_8);
        Path tmp = Files.createTempFile("cdr-sync-row-", ".bin");
        try {
            Files.write(tmp, bytes);
            row.put("sha256", Fs.sha256(tmp));
            row.put("size", bytes.length);
        } finally {
            Files.deleteIfExists(tmp);
        }
        return row;
    }

    private static Map<String, Object> liveDiffBody(
            String side,
            List<Map<String, Object>> files,
            List<String> managed,
            Map<String, String> synced
    ) {
        Map<String, Object> request = Json.map();
        request.put("side", side);
        request.put("files", files);
        request.put("previous_version", "v0.5.0.13-test");
        request.put("managed_paths", managed);
        request.put("synced_hashes", synced);
        return request;
    }

    private static boolean noneRemove(Map<String, Object> diff, String path) {
        for (Object item : Json.array(diff.get("changes"))) {
            Map<String, Object> change = Json.object(item);
            if ("remove".equals(Json.str(change, "action")) && path.equals(Fs.posix(Json.str(change, "path")))) {
                return false;
            }
        }
        return true;
    }

    private static boolean noneDownload(Map<String, Object> diff, String path) {
        for (Object item : Json.array(diff.get("download"))) {
            if (path.equals(Fs.posix(Json.str(Json.object(item), "path")))) {
                return false;
            }
        }
        return true;
    }

    private static void hardlinkTree(Path source, Path destination) throws Exception {
        Files.createDirectories(destination);
        try (var walk = Files.walk(source)) {
            for (Path path : (Iterable<Path>) walk::iterator) {
                Path dest = destination.resolve(source.relativize(path).toString());
                if (Files.isDirectory(path)) {
                    Files.createDirectories(dest);
                    continue;
                }
                Files.createDirectories(dest.getParent());
                Files.createLink(dest, path);
            }
        }
    }

    private static void replaceFile(Path path, String content) throws Exception {
        Files.deleteIfExists(path);
        write(path, content);
    }

    private static Pack.Config config(Path tmp, Path official, Path privateDir) {
        Path dataDir = tmp.resolve("data");
        return new Pack.Config(
                "127.0.0.1",
                0,
                dataDir,
                "Jasons-impart/Create-Delight-Remake",
                "v0.5.0.13-test",
                "https://api.github.com",
                official,
                privateDir,
                dataDir.resolve("repos/unified"),
                dataDir.resolve("repos/client"),
                dataDir.resolve("repos/server"),
                dataDir.resolve("objects")
        );
    }

    private static void write(Path path, String content) throws Exception {
        Files.createDirectories(path.getParent());
        Files.writeString(path, content);
    }

    private static void check(String name, boolean ok) {
        if (ok) {
            System.out.println("OK  " + name);
        } else {
            failed++;
            System.out.println("FAIL  " + name);
        }
    }
}
