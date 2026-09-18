package com.jsi.cdr.updater;

import com.sun.net.httpserver.HttpServer;

import java.net.InetSocketAddress;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Base64;
import java.util.Map;
import java.util.Set;

final class Tests {
    private static int failed;

    static int run() throws Exception {
        failed = 0;
        policyTests();
        sideSplitTests();
        syncTests();
        adminTests();
        securityTests();
        adminWebTests();
        if (failed == 0) {
            System.out.println("全部测试通过");
        } else {
            System.out.println("失败 " + failed + " 项");
        }
        return failed;
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
        write(official.resolve("kubejs/server_scripts/main.js"), "console.log('v1')\n");
        write(official.resolve("resourcepacks/pack.zip"), "rp");
        Pack.Config config = config(tmp, official, privateDir);
        Pack.buildRepos(config, line -> {});
        HttpServer server = ApiServer.start(config);
        try {
            String url = "http://127.0.0.1:" + server.getAddress().getPort();
            Path clientInstance = tmp.resolve("client-instance");
            write(clientInstance.resolve("mods/player-extra.jar"), "i-installed-this");
            write(clientInstance.resolve("config/generated-by-mod.toml"), "auto=true\n");
            Sync.Result clientResult = Sync.apply(clientInstance, "client", new Sync.Client(url), line -> {});
            check("客户端保留玩家模组", Files.readString(clientInstance.resolve("mods/player-extra.jar")).equals("i-installed-this"));
            check("客户端下载官方模组", Files.isRegularFile(clientInstance.resolve("mods/create-1.0.jar")));
            check("客户端包含 JEI", Files.isRegularFile(clientInstance.resolve("mods/jei-1.0.jar")));
            check("客户端包含资源包", Files.isRegularFile(clientInstance.resolve("resourcepacks/pack.zip")));
            check("客户端不删除玩家模组", clientResult.applied.stream().noneMatch(item -> "mods/player-extra.jar".equals(item.get("path"))));
            check("客户端保留模组生成的配置", Files.readString(clientInstance.resolve("config/generated-by-mod.toml")).equals("auto=true\n"));
            write(clientInstance.resolve("config/server.toml"), "motd=client-generated\n");
            Sync.apply(clientInstance, "client", new Sync.Client(url), line -> {});
            check("客户端不覆盖模组已生成配置", Files.readString(clientInstance.resolve("config/server.toml")).equals("motd=client-generated\n"));
            Sync.Check noUpdate = Sync.inspect(clientInstance, "client", new Sync.Client(url));
            check("无改动时不需要更新", !noUpdate.needed);

            Path serverInstance = tmp.resolve("server-instance");
            Sync.Client client = new Sync.Client(url);
            Sync.apply(serverInstance, "server", client, line -> {});
            check("服务端不含 JEI", !Files.exists(serverInstance.resolve("mods/jei-1.0.jar")));
            check("服务端不含资源包", !Files.exists(serverInstance.resolve("resourcepacks/pack.zip")));
            Path localConfig = serverInstance.resolve("config/server.toml");
            check("服务端写入默认配置", Files.readString(localConfig).equals("motd=default\n"));
            Files.writeString(localConfig, "motd=admin-changed\n");
            write(official.resolve("config/server.toml"), "motd=new-official\n");
            write(official.resolve("kubejs/server_scripts/main.js"), "console.log('v2')\n");
            Pack.buildRepos(config, line -> {});
            Sync.Result kept = Sync.apply(serverInstance, "server", client, line -> {});
            check("管理员改动被保留", Files.readString(localConfig).equals("motd=admin-changed\n"));
            check("记录保留的本地改动", kept.keptLocal.contains("config/server.toml"));
            check("未改脚本仍更新", Files.readString(serverInstance.resolve("kubejs/server_scripts/main.js")).equals("console.log('v2')\n"));
            write(official.resolve("mods/pack-extra.jar"), "extra-v1");
            Pack.buildRepos(config, line -> {});
            Sync.apply(serverInstance, "server", client, line -> {});
            check("服务端下载可管理模组", Files.readString(serverInstance.resolve("mods/pack-extra.jar")).equals("extra-v1"));
            Files.delete(official.resolve("mods/pack-extra.jar"));
            Pack.buildRepos(config, line -> {});
            Sync.Result removed = Sync.apply(serverInstance, "server", client, line -> {});
            check("远程删除后移除本地文件", !Files.exists(serverInstance.resolve("mods/pack-extra.jar")));
            check("删除动作已记录", removed.applied.stream().anyMatch(item ->
                    "mods/pack-extra.jar".equals(item.get("path")) && "delete".equals(item.get("action"))));
            Files.delete(official.resolve("config/server.toml"));
            Pack.buildRepos(config, line -> {});
            Sync.apply(serverInstance, "server", client, line -> {});
            check("远程删除也不改模组配置", Files.exists(localConfig));

            write(official.resolve("mods/create-1.0.jar"), "create-1.1");
            Pack.buildRepos(config, line -> {});
            Sync.Check hasUpdate = Sync.inspect(clientInstance, "client", new Sync.Client(url));
            check("模组文件变化时需要更新", hasUpdate.needed);
            check("模组变化标记正确", hasUpdate.modsChanged);

            Path dummyJar = tmp.resolve("cdr-updater.jar");
            Files.write(dummyJar, new byte[]{1, 2, 3});
            Path zip = Pcl2Pack.export(config, dummyJar, tmp.resolve("client-pcl2.zip"));
            try (java.util.zip.ZipFile zipped = new java.util.zip.ZipFile(zip.toFile())) {
                check("PCL2 zip 含 CurseForge manifest", zipped.getEntry("manifest.json") != null);
                check("PCL2 zip 含 mcbbs.packmeta", zipped.getEntry("mcbbs.packmeta") != null);
                check("PCL2 zip 含更新器 jar", zipped.getEntry("overrides/mods/cdr-updater.jar") != null);
                check("PCL2 zip 含实例配置", zipped.getEntry("overrides/cdr-updater.toml") != null);
                check("PCL2 zip 文件在 overrides 下", zipped.getEntry("overrides/mods/create-1.0.jar") != null);
                check("PCL2 zip 不套额外根目录", zipped.getEntry("Create-Delight-Remake/manifest.json") == null);
                check("zip 不写入 PCL 配置", zipped.getEntry("PCL/Setup.ini") == null);
                Map<String, Object> manifest = Json.object(Json.parse(new String(zipped.getInputStream(zipped.getEntry("manifest.json")).readAllBytes(), java.nio.charset.StandardCharsets.UTF_8)));
                check("CurseForge 清单类型正确", "minecraftModpack".equals(Json.str(manifest, "manifestType")));
                check("CurseForge 覆盖目录为 overrides", "overrides".equals(Json.str(manifest, "overrides")));
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
            Pack.Config config = config(tmp, official, privateDir).withAccessToken("web-token");
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
                check("网页含连接地址", page.body().contains("开放外网访问") && page.body().contains("访问令牌"));
                check("网页含 GitHub 版本", page.body().contains("应用并重新拉取")
                        && page.body().contains("<select id=\"versionTag\">")
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

                HttpResponse<String> login = http.send(
                        HttpRequest.newBuilder(java.net.URI.create(url + "/admin/api/login"))
                                .header("Content-Type", "application/json")
                                .POST(HttpRequest.BodyPublishers.ofString("{\"token\":\"web-token\"}")).build(),
                        HttpResponse.BodyHandlers.ofString());
                check("正确令牌可以登录网页", login.statusCode() == 200);

                HttpResponse<String> state = http.send(
                        HttpRequest.newBuilder(java.net.URI.create(url + "/admin/api/state"))
                                .header("X-CDR-Token", "web-token").GET().build(),
                        HttpResponse.BodyHandlers.ofString());
                check("登录后可读管理状态", state.statusCode() == 200 && state.body().contains("official_version"));
                check("管理状态含服务端列表", state.body().contains("\"servers\""));
                check("管理状态含私货列表", state.body().contains("\"privates\""));

                String encoded = Base64.getEncoder().encodeToString("web-private-bytes".getBytes(StandardCharsets.UTF_8));
                HttpResponse<String> added = http.send(
                        HttpRequest.newBuilder(java.net.URI.create(url + "/admin/api/private"))
                                .header("X-CDR-Token", "web-token")
                                .header("Content-Type", "application/json")
                                .POST(HttpRequest.BodyPublishers.ofString(
                                        "{\"dest\":\"mods/web-private.jar\",\"side\":\"server\",\"filename\":\"web-private.jar\",\"data_base64\":\""
                                                + encoded + "\"}")).build(),
                        HttpResponse.BodyHandlers.ofString());
                check("网页可添加私货", added.statusCode() == 200);
                check("网页添加的私货已落地", Files.isRegularFile(privateDir.resolve("files/mods/web-private.jar")));

                HttpResponse<String> removed = http.send(
                        HttpRequest.newBuilder(java.net.URI.create(url + "/admin/api/private/remove"))
                                .header("X-CDR-Token", "web-token")
                                .header("Content-Type", "application/json")
                                .POST(HttpRequest.BodyPublishers.ofString("{\"path\":\"mods/web-private.jar\"}")).build(),
                        HttpResponse.BodyHandlers.ofString());
                check("网页可删除私货", removed.statusCode() == 200
                        && !Files.exists(privateDir.resolve("files/mods/web-private.jar")));

                int port = server.getAddress().getPort();
                HttpResponse<String> saved = http.send(
                        HttpRequest.newBuilder(java.net.URI.create(url + "/admin/api/connection"))
                                .header("X-CDR-Token", "web-token")
                                .header("Content-Type", "application/json")
                                .POST(HttpRequest.BodyPublishers.ofString(
                                        "{\"listen\":\"127.0.0.1\",\"port\":" + port
                                                + ",\"public_url\":\"http://127.0.0.1:" + port
                                                + "\",\"access_token\":\"web-token\"}")).build(),
                        HttpResponse.BodyHandlers.ofString());
                check("网页可保存连接地址", saved.statusCode() == 200);

                HttpResponse<String> export = http.send(
                        HttpRequest.newBuilder(java.net.URI.create(url + "/admin/api/export"))
                                .header("X-CDR-Token", "web-token")
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
