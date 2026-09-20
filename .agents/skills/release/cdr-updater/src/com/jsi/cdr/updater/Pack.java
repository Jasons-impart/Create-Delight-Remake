package com.jsi.cdr.updater;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.file.DirectoryStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.time.Duration;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Consumer;

final class Pack {
    static final class PrivateFile {
        final String path;
        final String side;
        final Path source;

        PrivateFile(String path, String side, Path source) {
            this.path = path;
            this.side = side;
            this.source = source;
        }
    }

    static final class Config {
        final String listen;
        final int port;
        final Path dataDir;
        final String githubRepo;
        final String officialVersion;
        final String githubApi;
        final Path officialDir;
        final Path privateDir;
        final Path unifiedDir;
        final Path clientDir;
        final Path serverDir;
        final Path objectsDir;
        final String minecraft;
        final String forge;
        final String packName;
        final String updateServerUrl;
        final String accessToken;
        final String adminToken;

        Config(String listen, int port, Path dataDir, String githubRepo, String officialVersion, String githubApi,
               Path officialDir, Path privateDir, Path unifiedDir, Path clientDir, Path serverDir, Path objectsDir) {
            this(listen, port, dataDir, githubRepo, officialVersion, githubApi, officialDir, privateDir, unifiedDir,
                    clientDir, serverDir, objectsDir, "1.20.1", "47.4.16", "Create-Delight-Remake",
                    "http://" + listen + ":" + port, "", "");
        }

        Config(String listen, int port, Path dataDir, String githubRepo, String officialVersion, String githubApi,
               Path officialDir, Path privateDir, Path unifiedDir, Path clientDir, Path serverDir, Path objectsDir,
               String minecraft, String forge, String packName, String updateServerUrl) {
            this(listen, port, dataDir, githubRepo, officialVersion, githubApi, officialDir, privateDir, unifiedDir,
                    clientDir, serverDir, objectsDir, minecraft, forge, packName, updateServerUrl, "", "");
        }

        Config(String listen, int port, Path dataDir, String githubRepo, String officialVersion, String githubApi,
               Path officialDir, Path privateDir, Path unifiedDir, Path clientDir, Path serverDir, Path objectsDir,
               String minecraft, String forge, String packName, String updateServerUrl, String accessToken) {
            this(listen, port, dataDir, githubRepo, officialVersion, githubApi, officialDir, privateDir, unifiedDir,
                    clientDir, serverDir, objectsDir, minecraft, forge, packName, updateServerUrl, accessToken, "");
        }

        Config(String listen, int port, Path dataDir, String githubRepo, String officialVersion, String githubApi,
               Path officialDir, Path privateDir, Path unifiedDir, Path clientDir, Path serverDir, Path objectsDir,
               String minecraft, String forge, String packName, String updateServerUrl, String accessToken,
               String adminToken) {
            this.listen = listen;
            this.port = port;
            this.dataDir = dataDir;
            this.githubRepo = githubRepo;
            this.officialVersion = officialVersion;
            this.githubApi = githubApi;
            this.officialDir = officialDir;
            this.privateDir = privateDir;
            this.unifiedDir = unifiedDir;
            this.clientDir = clientDir;
            this.serverDir = serverDir;
            this.objectsDir = objectsDir;
            this.minecraft = minecraft;
            this.forge = forge;
            this.packName = packName;
            this.updateServerUrl = updateServerUrl;
            this.accessToken = accessToken == null ? "" : accessToken.trim();
            this.adminToken = adminToken == null ? "" : adminToken.trim();
        }

        Config withOfficialVersion(String version) {
            return new Config(listen, port, dataDir, githubRepo, version, githubApi, officialDir, privateDir,
                    unifiedDir, clientDir, serverDir, objectsDir, minecraft, forge, packName, updateServerUrl,
                    accessToken, adminToken);
        }

        Config withConnection(String listen, int port, String publicUrl) {
            return new Config(listen, port, dataDir, githubRepo, officialVersion, githubApi, officialDir, privateDir,
                    unifiedDir, clientDir, serverDir, objectsDir, minecraft, forge, packName, publicUrl, accessToken,
                    adminToken);
        }

        Config withAccessToken(String token) {
            return new Config(listen, port, dataDir, githubRepo, officialVersion, githubApi, officialDir, privateDir,
                    unifiedDir, clientDir, serverDir, objectsDir, minecraft, forge, packName, updateServerUrl,
                    normalizeAccessToken(token), adminToken);
        }

        Config withAdminToken(String token) {
            return new Config(listen, port, dataDir, githubRepo, officialVersion, githubApi, officialDir, privateDir,
                    unifiedDir, clientDir, serverDir, objectsDir, minecraft, forge, packName, updateServerUrl,
                    accessToken, normalizeAccessToken(token));
        }

        Path manifestsDir() {
            return dataDir.resolve("manifests");
        }

        static Config load(Path file) throws Exception {
            Path base = file.toAbsolutePath().getParent();
            Map<String, Object> data = Toml.load(file);
            Map<String, Object> server = Json.object(data.get("server"));
            Map<String, Object> official = Json.object(data.get("official"));
            Map<String, Object> privateSection = Json.object(data.get("private"));
            Map<String, Object> repos = Json.object(data.get("repos"));
            Path dataDir = resolve(base, Toml.str(server, "data_dir", "./data"));
            String local = Toml.str(official, "local_dir", Toml.str(official, "official_dir", ""));
            String listen = Toml.str(server, "listen", "127.0.0.1");
            int port = Toml.num(server, "port", 8765);
            Config config = new Config(
                    listen,
                    port,
                    dataDir,
                    Toml.str(official, "github_repo", "Jasons-impart/Create-Delight-Remake"),
                    Toml.str(official, "version", ""),
                    Toml.str(official, "github_api", "https://api.github.com"),
                    local.isBlank() ? null : resolve(base, local),
                    resolve(base, Toml.str(privateSection, "overlay_dir", "./private")),
                    resolve(base, Toml.str(repos, "unified", dataDir.resolve("repos/unified").toString())),
                    resolve(base, Toml.str(repos, "client", dataDir.resolve("repos/client").toString())),
                    resolve(base, Toml.str(repos, "server", dataDir.resolve("repos/server").toString())),
                    resolve(base, Toml.str(repos, "objects", dataDir.resolve("objects").toString())),
                    Toml.str(official, "minecraft", "1.20.1"),
                    Toml.str(official, "forge", "47.4.16"),
                    Toml.str(official, "pack_name", Toml.str(official, "name", "Create-Delight-Remake")),
                    Toml.str(server, "public_url", "http://" + listen + ":" + port),
                    Toml.str(server, "access_token", ""),
                    Toml.str(server, "admin_token", "")
            );
            Packwiz.configure(Toml.str(official, "curseforge_api_key", Toml.str(official, "cf_api_key", "")));
            return config;
        }

        static String normalizeListen(String listen) {
            String value = listen == null ? "" : listen.trim();
            if (value.isBlank()) {
                throw new IllegalArgumentException("监听地址不能为空");
            }
            if (value.contains("://")) {
                throw new IllegalArgumentException("监听地址填 IP 或主机名，例如 0.0.0.0 或 127.0.0.1，不要带 http://");
            }
            return value;
        }

        static int normalizePort(int port) {
            if (port < 1 || port > 65535) {
                throw new IllegalArgumentException("端口必须在 1–65535");
            }
            return port;
        }

        static String normalizeAccessToken(String raw) {
            String value = raw == null ? "" : raw.trim();
            if (value.contains("\"") || value.contains("\n") || value.contains("\r") || value.contains("\t")) {
                throw new IllegalArgumentException("访问令牌不能包含引号、空白或换行");
            }
            if (value.length() > 128) {
                throw new IllegalArgumentException("访问令牌最多 128 个字符");
            }
            return value;
        }

        static void requireDistinctTokens(String accessToken, String adminToken) {
            String access = accessToken == null ? "" : accessToken.trim();
            String admin = adminToken == null ? "" : adminToken.trim();
            if (!access.isBlank() && access.equals(admin)) {
                throw new IllegalArgumentException("网页管理令牌不能和客户端同步令牌相同");
            }
        }

        static String normalizePublicUrl(String raw, String listen, int port) {
            String value = raw == null ? "" : raw.trim();
            while (value.endsWith("/")) {
                value = value.substring(0, value.length() - 1);
            }
            if (value.isBlank()) {
                if (wildcardListen(listen)) {
                    throw new IllegalArgumentException("监听 0.0.0.0 时必须填写玩家能访问的对外地址，例如 http://192.168.1.8:" + port);
                }
                return "http://" + listen + ":" + port;
            }
            URI uri;
            try {
                uri = URI.create(value);
            } catch (IllegalArgumentException error) {
                throw new IllegalArgumentException("对外地址无效: " + value);
            }
            String scheme = uri.getScheme() == null ? "" : uri.getScheme().toLowerCase();
            if (!"http".equals(scheme) && !"https".equals(scheme)) {
                throw new IllegalArgumentException("对外地址必须以 http:// 或 https:// 开头");
            }
            if (uri.getHost() == null || uri.getHost().isBlank()) {
                throw new IllegalArgumentException("对外地址缺少主机名");
            }
            return value;
        }

        static boolean wildcardListen(String listen) {
            return "0.0.0.0".equals(listen) || "::".equals(listen) || "[::]".equals(listen);
        }

        private static Path resolve(Path base, String value) {
            Path path = Path.of(value);
            return path.isAbsolute() ? path : base.resolve(path).normalize().toAbsolutePath();
        }
    }

    static List<PrivateFile> loadPrivate(Path root, Map<String, String> officialSides) throws Exception {
        List<PrivateFile> result = new ArrayList<>();
        if (!Files.exists(root)) {
            return result;
        }
        Map<String, String> declared = new LinkedHashMap<>();
        Path index = root.resolve("index.toml");
        if (Files.isRegularFile(index)) {
            for (Object item : Json.array(Toml.load(index).get("files"))) {
                Map<String, Object> row = Json.object(item);
                declared.put(Fs.posix(Json.str(row, "path")), Toml.str(row, "side", "").toLowerCase());
            }
        }
        Path filesRoot = root.resolve("files");
        if (!Files.exists(filesRoot)) {
            return result;
        }
        for (Path source : Fs.files(filesRoot)) {
            String rel = Fs.posix(filesRoot, source);
            if (rel.endsWith(".side") || rel.endsWith(".pw.toml")) {
                continue;
            }
            String[] prefixed = Sides.splitPrivatePrefix(rel);
            String path = prefixed[1].isBlank() ? rel : prefixed[1];
            if (path.isBlank()) {
                continue;
            }
            String side;
            Path sideFile = source.resolveSibling(source.getFileName() + ".side");
            Path pwMeta = source.resolveSibling(source.getFileName() + ".pw.toml");
            if (prefixed[0] != null) {
                side = prefixed[0];
            } else if (Files.isRegularFile(sideFile)) {
                side = Sides.normalize(Files.readString(sideFile).trim());
            } else if (declared.containsKey(path) && !declared.get(path).isBlank()) {
                side = Sides.normalize(declared.get(path));
            } else if (declared.containsKey(rel) && !declared.get(rel).isBlank()) {
                side = Sides.normalize(declared.get(rel));
            } else if (Files.isRegularFile(pwMeta)) {
                side = Sides.normalize(Toml.str(Toml.load(pwMeta), "side", "both"));
            } else {
                side = Sides.overlay(path, source, officialSides);
            }
            result.add(new PrivateFile(path, side, source));
        }
        return result;
    }

    static List<PrivateFile> loadPrivate(Path root) throws Exception {
        return loadPrivate(root, Map.of());
    }

    static void applyOverlay(Path destination, List<PrivateFile> files, String side) throws Exception {
        Files.createDirectories(destination);
        for (PrivateFile file : files) {
            if (!(file.side.equals(side) || "both".equals(file.side))) {
                continue;
            }
            Fs.copyFile(file.source, destination.resolve(file.path));
        }
    }

    private record OverlayIndex(String side, String sha256) {}

    static boolean canRefresh(Config config) {
        try {
            if (config == null || config.officialVersion.isBlank()) {
                return false;
            }
            Path manifests = config.manifestsDir();
            if (!Files.isRegularFile(manifests.resolve("meta.json"))
                    || !Files.isRegularFile(manifests.resolve("client.json"))
                    || !Files.isRegularFile(manifests.resolve("server.json"))
                    || !Files.isDirectory(config.clientDir)
                    || !Files.isDirectory(config.serverDir)) {
                return false;
            }
            Map<String, Object> meta = Json.object(Json.parse(Files.readString(manifests.resolve("meta.json"))));
            if (!config.officialVersion.equals(Json.str(meta, "official_version"))) {
                return false;
            }
            if (config.officialDir != null) {
                return Files.isDirectory(config.officialDir);
            }
            Path cache = config.dataDir.resolve("cache").resolve(config.officialVersion);
            return Files.isDirectory(cache.resolve("client-raw")) && Files.isDirectory(cache.resolve("server-raw"));
        } catch (Exception ignored) {
            return false;
        }
    }

    static Map<String, Manifests.Manifest> buildRepos(Config config, Consumer<String> log) throws Exception {
        return buildRepos(config, log, Set.of());
    }

    static Map<String, Manifests.Manifest> buildRepos(Config config, Consumer<String> log, Set<String> removedOverlay)
            throws Exception {
        try {
            if (canRefresh(config)) {
                try {
                    return refreshReposInner(config, log, removedOverlay);
                } catch (Exception error) {
                    log.accept("增量更新失败，改为完整重建: " + error.getMessage());
                    Progress.end();
                }
            }
            return buildReposInner(config, log);
        } finally {
            Progress.end();
        }
    }

    private static Map<String, Manifests.Manifest> refreshReposInner(Config config, Consumer<String> log,
                                                                     Set<String> removedOverlay) throws Exception {
        log.accept("仓库已存在，只更新有改动的文件");
        Progress.begin("更新改动", 1);
        Progress.ensure("比对改动", -1);
        Map<String, String> officialSides = loadOfficialSides(config);
        List<PrivateFile> privateFiles = loadPrivate(config.privateDir, officialSides);
        Map<String, OverlayIndex> previous = loadPrivateIndex(config);
        Map<String, PrivateFile> current = new LinkedHashMap<>();
        for (PrivateFile file : privateFiles) {
            current.put(file.path, file);
        }
        Manifests.Manifest clientMan = loadManifest(config, "client");
        Manifests.Manifest serverMan = loadManifest(config, "server");
        Map<String, Manifests.FileEntry> clientUpsert = new LinkedHashMap<>();
        Map<String, Manifests.FileEntry> serverUpsert = new LinkedHashMap<>();
        Set<String> clientRemove = new LinkedHashSet<>();
        Set<String> serverRemove = new LinkedHashSet<>();
        int changed = 0;

        Set<String> gone = new LinkedHashSet<>(previous.keySet());
        gone.removeAll(current.keySet());
        if (removedOverlay != null) {
            for (String path : removedOverlay) {
                String rel = Fs.posix(path);
                if (!rel.isBlank() && !current.containsKey(rel)) {
                    gone.add(rel);
                }
            }
        }
        for (String path : gone) {
            OverlayIndex old = previous.get(path);
            String side = old == null ? "both" : old.side;
            changed += unapplyOverlay(config, path, side, officialSides, clientUpsert, serverUpsert,
                    clientRemove, serverRemove, log);
        }

        for (PrivateFile file : privateFiles) {
            OverlayIndex old = previous.get(file.path);
            if (old != null && !old.side.equals(file.side)) {
                changed += unapplyOverlay(config, file.path, old.side, officialSides, clientUpsert, serverUpsert,
                        clientRemove, serverRemove, log);
            }
            changed += applyPrivate(config, file, clientUpsert, serverUpsert, clientRemove, serverRemove);
        }

        if (config.officialDir != null) {
            Map<String, String> newOfficial = sideMapFromTree(config.officialDir);
            for (String path : officialSides.keySet()) {
                if (newOfficial.containsKey(path) || current.containsKey(path)) {
                    continue;
                }
                changed += restoreOrDelete(config, path, "client", officialSides, clientUpsert, clientRemove);
                changed += restoreOrDelete(config, path, "server", officialSides, serverUpsert, serverRemove);
            }
            officialSides = newOfficial;
            for (Path path : Fs.files(config.officialDir)) {
                String rel = Fs.posix(config.officialDir, path);
                if (PackPaths.skipUnified(rel) || rel.endsWith(".pw.toml")) {
                    continue;
                }
                String side = officialSides.getOrDefault(rel, PackPaths.defaultSide(rel));
                PrivateFile overlay = current.get(rel);
                if (allowed(side, "client") && !covers(overlay, "client")
                        && Fs.copyIfChanged(path, config.clientDir.resolve(rel))) {
                    touchEntry(config.clientDir.resolve(rel), rel, config.objectsDir, clientUpsert, clientRemove);
                    changed++;
                }
                if (allowed(side, "server") && !covers(overlay, "server")
                        && Fs.copyIfChanged(path, config.serverDir.resolve(rel))) {
                    touchEntry(config.serverDir.resolve(rel), rel, config.objectsDir, serverUpsert, serverRemove);
                    changed++;
                }
            }
        }

        writePrivateIndex(config, privateFiles);
        if (changed == 0) {
            if (!Files.isRegularFile(config.manifestsDir().resolve("official-side-map.json"))) {
                Files.writeString(config.manifestsDir().resolve("official-side-map.json"), Json.stringify(officialSides));
            }
            log.accept("没有文件需要改动");
            Map<String, Manifests.Manifest> manifests = new LinkedHashMap<>();
            manifests.put("client", clientMan);
            manifests.put("server", serverMan);
            return manifests;
        }

        Manifests.Manifest client = Manifests.patch(clientMan, config.officialVersion, clientUpsert, clientRemove);
        Manifests.Manifest server = Manifests.patch(serverMan, config.officialVersion, serverUpsert, serverRemove);
        String releaseBody = Json.str(loadMeta(config), "release_body");
        log.accept("已更新 " + changed + " 处，不重新拉取官方包");
        return writeRepoState(config, client, server, releaseBody, officialSides, privateFiles, log);
    }

    private static boolean covers(PrivateFile overlay, String target) {
        return overlay != null && allowed(overlay.side, target);
    }

    private static int applyPrivate(Config config, PrivateFile file, Map<String, Manifests.FileEntry> clientUpsert,
                                    Map<String, Manifests.FileEntry> serverUpsert, Set<String> clientRemove,
                                    Set<String> serverRemove) throws Exception {
        int changed = 0;
        if (allowed(file.side, "client")
                && Fs.copyIfChanged(file.source, config.clientDir.resolve(file.path))) {
            touchEntry(config.clientDir.resolve(file.path), file.path, config.objectsDir, clientUpsert, clientRemove);
            changed++;
        }
        if (allowed(file.side, "server")
                && Fs.copyIfChanged(file.source, config.serverDir.resolve(file.path))) {
            touchEntry(config.serverDir.resolve(file.path), file.path, config.objectsDir, serverUpsert, serverRemove);
            changed++;
        }
        return changed;
    }

    private static int unapplyOverlay(Config config, String path, String overlaySide, Map<String, String> officialSides,
                                      Map<String, Manifests.FileEntry> clientUpsert,
                                      Map<String, Manifests.FileEntry> serverUpsert, Set<String> clientRemove,
                                      Set<String> serverRemove, Consumer<String> log) throws Exception {
        int changed = 0;
        if (allowed(overlaySide, "client")) {
            int n = restoreOrDelete(config, path, "client", officialSides, clientUpsert, clientRemove);
            if (n > 0) {
                log.accept("客户端恢复 " + path);
            }
            changed += n;
        }
        if (allowed(overlaySide, "server")) {
            int n = restoreOrDelete(config, path, "server", officialSides, serverUpsert, serverRemove);
            if (n > 0) {
                log.accept("服务端恢复 " + path);
            }
            changed += n;
        }
        return changed;
    }

    private static int restoreOrDelete(Config config, String rel, String repoSide, Map<String, String> officialSides,
                                       Map<String, Manifests.FileEntry> upsert, Set<String> remove) throws Exception {
        Path dest = ("server".equals(repoSide) ? config.serverDir : config.clientDir).resolve(rel);
        Path official = officialSource(config, rel, repoSide, officialSides);
        if (official != null && Files.isRegularFile(official)) {
            if (Fs.copyIfChanged(official, dest)) {
                touchEntry(dest, rel, config.objectsDir, upsert, remove);
                return 1;
            }
            return 0;
        }
        if (Files.deleteIfExists(dest)) {
            remove.add(rel);
            upsert.remove(rel);
            return 1;
        }
        return 0;
    }

    private static Path officialSource(Config config, String rel, String repoSide, Map<String, String> officialSides)
            throws Exception {
        String side = officialSides.get(rel);
        if (side != null && !allowed(side, repoSide)) {
            return null;
        }
        if (config.officialDir != null) {
            Path path = config.officialDir.resolve(rel);
            return Files.isRegularFile(path) ? path : null;
        }
        Path cache = config.dataDir.resolve("cache").resolve(config.officialVersion);
        Path extract = cache.resolve("client".equals(repoSide) ? "client-raw" : "server-raw");
        if (!Files.isDirectory(extract)) {
            return null;
        }
        Path path = Fs.packRoot(extract).resolve(rel);
        return Files.isRegularFile(path) ? path : null;
    }

    private static void touchEntry(Path file, String rel, Path objectsDir, Map<String, Manifests.FileEntry> upsert,
                                   Set<String> remove) throws Exception {
        materializeFile(file, objectsDir);
        upsert.put(rel, new Manifests.FileEntry(rel, Fs.sha256(file), Files.size(file), PackPaths.kind(rel)));
        remove.remove(rel);
    }

    static void materializeFile(Path file, Path objectsDir) throws Exception {
        if (!Files.isRegularFile(file)) {
            return;
        }
        String digest = Fs.sha256(file);
        Path object = objectsDir.resolve(digest.substring(0, 2)).resolve(digest);
        if (!Files.exists(object)) {
            Fs.copyFile(file, object);
        }
    }

    private static Map<String, OverlayIndex> loadPrivateIndex(Config config) {
        Map<String, OverlayIndex> result = new LinkedHashMap<>();
        Path path = config.manifestsDir().resolve("private-index.json");
        try {
            if (!Files.isRegularFile(path)) {
                return result;
            }
            Map<String, Object> data = Json.object(Json.parse(Files.readString(path)));
            for (Map.Entry<String, Object> entry : data.entrySet()) {
                Map<String, Object> row = Json.object(entry.getValue());
                result.put(Fs.posix(entry.getKey()), new OverlayIndex(Json.str(row, "side"), Json.str(row, "sha256")));
            }
        } catch (Exception ignored) {
            return result;
        }
        return result;
    }

    private static void writePrivateIndex(Config config, List<PrivateFile> files) throws Exception {
        Map<String, Object> index = Json.map();
        if (files != null) {
            for (PrivateFile file : files) {
                Map<String, Object> row = Json.map();
                row.put("side", file.side);
                row.put("sha256", Fs.sha256(file.source));
                index.put(file.path, row);
            }
        }
        Files.createDirectories(config.manifestsDir());
        Files.writeString(config.manifestsDir().resolve("private-index.json"), Json.stringify(index));
    }

    private static Map<String, String> loadOfficialSides(Config config) throws Exception {
        Path path = config.manifestsDir().resolve("official-side-map.json");
        if (Files.isRegularFile(path)) {
            Map<String, String> sides = new LinkedHashMap<>();
            Map<String, Object> raw = Json.object(Json.parse(Files.readString(path)));
            for (Map.Entry<String, Object> entry : raw.entrySet()) {
                sides.put(Fs.posix(entry.getKey()), String.valueOf(entry.getValue()));
            }
            if (!sides.isEmpty()) {
                return sides;
            }
        }
        if (config.officialDir != null) {
            return sideMapFromTree(config.officialDir);
        }
        Path cache = config.dataDir.resolve("cache").resolve(config.officialVersion);
        Path clientRoot = Fs.packRoot(cache.resolve("client-raw"));
        Path serverRoot = Fs.packRoot(cache.resolve("server-raw"));
        Map<String, Path> clientSources = indexTree(clientRoot);
        Map<String, Path> serverSources = indexTree(serverRoot);
        Map<String, String> packwiz = new LinkedHashMap<>();
        packwiz.putAll(readSideMap(clientRoot));
        packwiz.putAll(readSideMap(serverRoot));
        Map<String, String> sides = new LinkedHashMap<>();
        Set<String> all = new LinkedHashSet<>();
        all.addAll(clientSources.keySet());
        all.addAll(serverSources.keySet());
        for (String rel : all) {
            if (PackPaths.skipUnified(rel) || rel.endsWith(".pw.toml")) {
                continue;
            }
            sides.put(rel, Sides.official(rel, clientSources.containsKey(rel), serverSources.containsKey(rel),
                    packwiz.get(rel)));
        }
        return sides;
    }

    private static Map<String, Manifests.Manifest> writeRepoState(Config config, Manifests.Manifest client,
                                                                 Manifests.Manifest server, String releaseBody,
                                                                 Map<String, String> officialSides,
                                                                 List<PrivateFile> privateFiles,
                                                                 Consumer<String> log) throws Exception {
        Files.createDirectories(config.manifestsDir());
        Map<String, String> combined = new LinkedHashMap<>(officialSides);
        for (PrivateFile file : privateFiles) {
            combined.put(file.path, file.side);
        }
        Files.writeString(config.manifestsDir().resolve("client.json"), Json.stringify(client.toMap()));
        Files.writeString(config.manifestsDir().resolve("server.json"), Json.stringify(server.toMap()));
        Files.writeString(config.manifestsDir().resolve("official-side-map.json"), Json.stringify(officialSides));
        Files.writeString(config.manifestsDir().resolve("side-map.json"), Json.stringify(combined));
        writePrivateIndex(config, privateFiles);
        Map<String, Object> meta = Json.map();
        meta.put("official_version", config.officialVersion);
        meta.put("release_body", releaseBody == null ? "" : releaseBody);
        meta.put("client_fingerprint", client.fingerprint());
        meta.put("server_fingerprint", server.fingerprint());
        meta.put("client_files", client.files.size());
        meta.put("server_files", server.files.size());
        Files.writeString(config.manifestsDir().resolve("meta.json"), Json.stringify(meta));
        log.accept("客户端仓库 " + client.files.size() + " 个文件，服务端仓库 " + server.files.size() + " 个文件");
        Map<String, Manifests.Manifest> manifests = new LinkedHashMap<>();
        manifests.put("client", client);
        manifests.put("server", server);
        return manifests;
    }

    static Map<String, String> readSideMap(Path packRoot) throws Exception {
        Map<String, String> mapping = new LinkedHashMap<>();
        for (String assetDir : PackPaths.ASSET_DIRS) {
            Path metaRoot = packRoot.resolve(assetDir);
            if (!Files.exists(metaRoot)) {
                continue;
            }
            for (Path meta : Fs.files(metaRoot)) {
                if (!meta.getFileName().toString().endsWith(".pw.toml")) {
                    continue;
                }
                Map<String, Object> data = Toml.load(meta);
                String filename = Toml.str(data, "filename", "");
                if (filename.isBlank()) {
                    continue;
                }
                mapping.put(Fs.posix(assetDir + "/" + filename), Toml.str(data, "side", "both").toLowerCase());
            }
        }
        return mapping;
    }

    static boolean allowed(String fileSide, String target) {
        if ("all".equals(target)) {
            return true;
        }
        if ("client".equals(target)) {
            return List.of("both", "client").contains(fileSide);
        }
        if ("server".equals(target)) {
            return List.of("both", "server").contains(fileSide);
        }
        throw new IllegalArgumentException("未知端侧: " + target);
    }

    static void split(Path unified, Path output, String side, Map<String, String> sideMap) throws Exception {
        Fs.deleteTree(output);
        Files.createDirectories(output);
        for (Path path : Fs.files(unified)) {
            String rel = Fs.posix(unified, path);
            if (PackPaths.skipUnified(rel) || rel.endsWith(".pw.toml")) {
                continue;
            }
            String fileSide = sideMap.getOrDefault(rel, PackPaths.defaultSide(rel));
            if (!allowed(fileSide, side)) {
                continue;
            }
            Fs.copyFile(path, output.resolve(rel));
        }
    }

    static void mergeTrees(List<Path> sources, Path destination) throws Exception {
        Fs.deleteTree(destination);
        Files.createDirectories(destination);
        for (Path source : sources) {
            if (!Files.exists(source)) {
                continue;
            }
            for (Path path : Fs.files(source)) {
                String rel = Fs.posix(source, path);
                if (PackPaths.skipUnified(rel)) {
                    continue;
                }
                Fs.copyFile(path, destination.resolve(rel));
            }
        }
    }

    static void materialize(Path root, Path objectsDir) throws Exception {
        Files.createDirectories(objectsDir);
        for (Path path : Fs.files(root)) {
            String digest = Fs.sha256(path);
            Path object = objectsDir.resolve(digest.substring(0, 2)).resolve(digest);
            if (!Files.exists(object)) {
                Fs.copyFile(path, object);
            }
        }
    }

    private static Map<String, Manifests.Manifest> buildReposInner(Config config, Consumer<String> log) throws Exception {
        if (config.officialVersion.isBlank()) {
            throw new IllegalArgumentException("official.version 未配置，例如 v0.5.0.13-test");
        }
        Path cache = config.dataDir.resolve("cache").resolve(config.officialVersion);
        Files.createDirectories(cache);
        Path releaseMeta = cache.resolve("release.json");
        String releaseBody = "";
        Map<String, String> officialSides;
        if (config.officialDir != null) {
            log.accept("使用本地官方目录 " + config.officialDir);
            mergeTrees(List.of(config.officialDir), config.unifiedDir);
            officialSides = sideMapFromTree(config.unifiedDir);
            split(config.unifiedDir, config.clientDir, "client", officialSides);
            split(config.unifiedDir, config.serverDir, "server", officialSides);
            Packwiz.pullClientAssets(config.unifiedDir, config.unifiedDir, config.clientDir, cache, log);
            if (Files.isRegularFile(releaseMeta)) {
                releaseBody = Json.str(Json.object(Json.parse(Files.readString(releaseMeta))), "body");
            }
        } else {
            purgeIncomplete(config, log);
            log.accept("读取 GitHub Release " + config.officialVersion);
            HttpClient http = Net.http();
            HttpRequest request = HttpRequest.newBuilder(URI.create(config.githubApi + "/repos/" + config.githubRepo + "/releases/tags/" + config.officialVersion))
                    .header("Accept", "application/vnd.github+json")
                    .header("User-Agent", "cdr-updater")
                    .timeout(Duration.ofMinutes(2))
                    .build();
            HttpResponse<String> response = http.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() >= 400) {
                throw new IllegalStateException("GitHub API 失败: " + response.statusCode());
            }
            Files.writeString(releaseMeta, response.body());
            Map<String, Object> release = Json.object(Json.parse(response.body()));
            releaseBody = Json.str(release, "body");
            Path clientZip = cache.resolve("Client-" + config.officialVersion + ".zip");
            Path serverZip = cache.resolve("Server-" + config.officialVersion + ".zip");
            Map<String, Object> clientAsset = findZipAsset(release, "Client-");
            Map<String, Object> serverAsset = findZipAsset(release, "Server-");
            Progress.begin("下载官方包", 2);
            downloadAsset(http, clientAsset, clientZip, log);
            downloadAsset(http, serverAsset, serverZip, log);
            Progress.end();
            Path clientExtract = cache.resolve("client-raw");
            Path serverExtract = cache.resolve("server-raw");
            if (!extractReady(clientExtract, clientZip, Json.lng(clientAsset, "size"))
                    || !extractReady(serverExtract, serverZip, Json.lng(serverAsset, "size"))) {
                Progress.begin("解压官方包", 2);
            }
            if (!extractReady(clientExtract, clientZip, Json.lng(clientAsset, "size"))) {
                log.accept("解压官方客户端包");
                Fs.deleteTree(clientExtract);
                Fs.extractZip(clientZip, clientExtract, log);
                writeExtractMarker(clientExtract, Files.size(clientZip));
            } else {
                log.accept("沿用已解压的客户端包");
            }
            if (!extractReady(serverExtract, serverZip, Json.lng(serverAsset, "size"))) {
                log.accept("解压官方服务端包");
                Fs.deleteTree(serverExtract);
                Fs.extractZip(serverZip, serverExtract, log);
                writeExtractMarker(serverExtract, Files.size(serverZip));
            } else {
                log.accept("沿用已解压的服务端包");
            }
            Progress.end();
            Path clientRoot = Fs.packRoot(clientExtract);
            Path serverRoot = Fs.packRoot(serverExtract);
            log.accept("按 GitHub 客户端/服务端包自动区分文件");
            officialSides = ingestReleaseTrees(clientRoot, serverRoot, config.clientDir, config.serverDir, log);
            log.accept("按 packwiz / CurseForge 清单为客户端拉取资源包");
            Packwiz.pullClientAssets(clientRoot, serverRoot, config.clientDir, cache, log);
            Packwiz.pullGithubResourcePacks(config, config.clientDir, cache, log);
        }

        List<PrivateFile> privateFiles = loadPrivate(config.privateDir, officialSides);
        int clientPrivate = 0;
        int serverPrivate = 0;
        int bothPrivate = 0;
        for (PrivateFile file : privateFiles) {
            switch (file.side) {
                case "client" -> clientPrivate++;
                case "server" -> serverPrivate++;
                default -> bothPrivate++;
            }
        }
        log.accept("私货 " + privateFiles.size() + " 个（程序自行区分：client " + clientPrivate
                + " / server " + serverPrivate + " / both " + bothPrivate + "）");
        Progress.begin("构建仓库", 3);
        Progress.ensure("写入私货", -1);
        applyOverlay(config.clientDir, privateFiles, "client");
        applyOverlay(config.serverDir, privateFiles, "server");
        Progress.ensure("生成清单", -1);
        Manifests.Manifest client = Manifests.build(config.clientDir, config.officialVersion, "client");
        Manifests.Manifest server = Manifests.build(config.serverDir, config.officialVersion, "server");
        Progress.ensure("校验对象库", -1);
        materialize(config.clientDir, config.objectsDir);
        materialize(config.serverDir, config.objectsDir);
        log.accept("本地仓库构建完成");
        return writeRepoState(config, client, server, releaseBody, officialSides, privateFiles, log);
    }

    static Map<String, String> ingestReleaseTrees(Path clientRoot, Path serverRoot, Path clientDir, Path serverDir,
                                                  java.util.function.Consumer<String> log) throws Exception {
        Map<String, Path> clientSources = indexTree(clientRoot);
        Map<String, Path> serverSources = indexTree(serverRoot);
        Map<String, String> packwiz = new LinkedHashMap<>();
        packwiz.putAll(readSideMap(clientRoot));
        packwiz.putAll(readSideMap(serverRoot));
        Map<String, String> sides = new LinkedHashMap<>();
        java.util.LinkedHashSet<String> all = new java.util.LinkedHashSet<>();
        all.addAll(clientSources.keySet());
        all.addAll(serverSources.keySet());
        Fs.deleteTree(clientDir);
        Fs.deleteTree(serverDir);
        Files.createDirectories(clientDir);
        Files.createDirectories(serverDir);
        int clientOnly = 0;
        int serverOnly = 0;
        int shared = 0;
        for (String rel : all) {
            if (PackPaths.skipUnified(rel) || rel.endsWith(".pw.toml")) {
                continue;
            }
            boolean inClient = clientSources.containsKey(rel);
            boolean inServer = serverSources.containsKey(rel);
            if (inClient && inServer) {
                shared++;
            } else if (inClient) {
                clientOnly++;
            } else {
                serverOnly++;
            }
            String side = Sides.official(rel, inClient, inServer, packwiz.get(rel));
            sides.put(rel, side);
            if (allowed(side, "client")) {
                Path source = inClient ? clientSources.get(rel) : serverSources.get(rel);
                Fs.copyFile(source, clientDir.resolve(rel));
            }
            if (allowed(side, "server")) {
                Path source = inServer ? serverSources.get(rel) : clientSources.get(rel);
                Fs.copyFile(source, serverDir.resolve(rel));
            }
        }
        log.accept("GitHub 包内文件：仅客户端 " + clientOnly + "，仅服务端 " + serverOnly + "，两端都有 " + shared);
        return sides;
    }

    private static Map<String, Path> indexTree(Path root) throws Exception {
        Map<String, Path> files = new LinkedHashMap<>();
        if (root == null || !Files.exists(root)) {
            return files;
        }
        for (Path path : Fs.files(root)) {
            String rel = Fs.posix(root, path);
            files.put(rel, path);
        }
        return files;
    }

    static Map<String, String> sideMapFromTree(Path packRoot) throws Exception {
        Map<String, String> mapping = readSideMap(packRoot);
        if (!Files.exists(packRoot)) {
            return mapping;
        }
        for (Path path : Fs.files(packRoot)) {
            String rel = Fs.posix(packRoot, path);
            if (PackPaths.skipUnified(rel) || rel.endsWith(".pw.toml")) {
                continue;
            }
            mapping.putIfAbsent(rel, PackPaths.defaultSide(rel));
        }
        return mapping;
    }

    static int purgeIncomplete(Config config, Consumer<String> log) throws Exception {
        Path cacheRoot = config.dataDir.resolve("cache");
        if (!Files.isDirectory(cacheRoot)) {
            return 0;
        }
        int deleted = 0;
        try (DirectoryStream<Path> versions = Files.newDirectoryStream(cacheRoot)) {
            for (Path versionDir : versions) {
                if (!Files.isDirectory(versionDir)) {
                    continue;
                }
                deleted += deleteJunk(versionDir, log);
                Path packwiz = versionDir.resolve("packwiz");
                if (Files.isDirectory(packwiz)) {
                    deleted += deleteJunk(packwiz, log);
                }
                Path releaseMeta = versionDir.resolve("release.json");
                if (!Files.isRegularFile(releaseMeta)) {
                    continue;
                }
                Map<String, Object> release = Json.object(Json.parse(Files.readString(releaseMeta)));
                deleted += purgeCachedZip(versionDir, release, "Client-", "client-raw", log);
                deleted += purgeCachedZip(versionDir, release, "Server-", "server-raw", log);
            }
        }
        if (deleted > 0) {
            log.accept("已清理 " + deleted + " 个不完整下载");
        }
        return deleted;
    }

    private static int deleteJunk(Path dir, Consumer<String> log) throws Exception {
        int deleted = 0;
        try (DirectoryStream<Path> files = Files.newDirectoryStream(dir)) {
            for (Path file : files) {
                String name = file.getFileName().toString();
                if (!Files.isRegularFile(file)) {
                    continue;
                }
                if (name.endsWith(".partial") || name.endsWith(".cdrtmp")) {
                    log.accept("删除不完整文件 " + file.getFileName());
                    Files.deleteIfExists(file);
                    deleted++;
                }
            }
        }
        return deleted;
    }

    static List<String> listReleaseTags(Config config) throws Exception {
        HttpRequest request = HttpRequest.newBuilder(URI.create(config.githubApi + "/repos/" + config.githubRepo + "/releases?per_page=50"))
                .header("Accept", "application/vnd.github+json")
                .header("User-Agent", "cdr-updater")
                .timeout(Duration.ofSeconds(30))
                .build();
        HttpResponse<String> response = Net.http().send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() >= 400) {
            throw new IllegalStateException("GitHub API 失败: " + response.statusCode());
        }
        List<String> tags = new ArrayList<>();
        for (Object item : Json.array(Json.parse(response.body()))) {
            String tag = Json.str(Json.object(item), "tag_name");
            if (!tag.isBlank()) {
                tags.add(tag);
            }
        }
        return tags;
    }

    private static int purgeCachedZip(Path versionDir, Map<String, Object> release, String prefix, String extractName,
                                      Consumer<String> log) throws Exception {
        Map<String, Object> asset;
        try {
            asset = findZipAsset(release, prefix);
        } catch (IllegalStateException ignored) {
            return 0;
        }
        long expected = Json.lng(asset, "size");
        Path zip = versionDir.resolve(prefix + versionDir.getFileName() + ".zip");
        Path extract = versionDir.resolve(extractName);
        Path marker = versionDir.resolve(extractName + ".complete");
        if (!Files.isRegularFile(zip) || expected <= 0) {
            return 0;
        }
        if (Files.size(zip) == expected) {
            return 0;
        }
        log.accept("删除不完整包 " + zip.getFileName() + "（" + Files.size(zip) + "/" + expected + " 字节）");
        Files.deleteIfExists(zip);
        if (Files.exists(extract)) {
            log.accept("删除不完整解压目录 " + extract.getFileName());
            Fs.deleteTree(extract);
        }
        Files.deleteIfExists(marker);
        return 1;
    }

    private static Map<String, Object> findZipAsset(Map<String, Object> release, String prefix) {
        for (Object item : Json.array(release.get("assets"))) {
            Map<String, Object> row = Json.object(item);
            String name = Json.str(row, "name");
            if (name.startsWith(prefix) && name.endsWith(".zip")) {
                return row;
            }
        }
        throw new IllegalStateException("Release 没有匹配 " + prefix + "*.zip 的资产");
    }

    private static void downloadAsset(HttpClient http, Map<String, Object> asset, Path destination, Consumer<String> log) throws Exception {
        long expected = Json.lng(asset, "size");
        String name = Json.str(asset, "name");
        String sha = assetSha256(asset);
        if (completeFile(destination, expected, sha)) {
            log.accept("已缓存 " + name);
            Progress.ensure(name, expected);
            Progress.bytes(expected);
            return;
        }
        if (Files.isRegularFile(destination)) {
            log.accept("删除不完整包 " + destination.getFileName() + "（" + Files.size(destination) + "/" + expected + " 字节）");
            Files.deleteIfExists(destination);
        }
        Path partial = destination.resolveSibling(destination.getFileName() + ".partial");
        if (completeFile(partial, expected, sha)) {
            Files.move(partial, destination, StandardCopyOption.REPLACE_EXISTING);
            log.accept("已缓存 " + name);
            Progress.ensure(name, expected);
            Progress.bytes(expected);
            return;
        }
        Files.createDirectories(destination.getParent());
        try (java.nio.file.DirectoryStream<Path> leftovers = Files.newDirectoryStream(partial.getParent(), partial.getFileName() + ".p*")) {
            for (Path leftover : leftovers) {
                Files.deleteIfExists(leftover);
            }
        } catch (Exception ignored) {
            // ignore leftover part files
        }
        Files.deleteIfExists(partial);
        HttpRequest.Builder request = HttpRequest.newBuilder(URI.create(Json.str(asset, "browser_download_url")))
                .header("User-Agent", "cdr-updater")
                .timeout(Duration.ofHours(2));
        try {
            Net.toFile(http, request, partial, expected, name, log, true);
        } catch (Exception error) {
            Files.deleteIfExists(partial);
            throw error;
        }
        if (!completeFile(partial, expected, sha)) {
            long got = Files.isRegularFile(partial) ? Files.size(partial) : 0;
            Files.deleteIfExists(partial);
            throw new IllegalStateException("下载不完整 " + name + "（" + got + "/" + expected + " 字节）");
        }
        Files.move(partial, destination, StandardCopyOption.REPLACE_EXISTING);
    }

    private static String assetSha256(Map<String, Object> asset) {
        String digest = Json.str(asset, "digest");
        int colon = digest.indexOf(':');
        if (colon >= 0 && digest.regionMatches(true, 0, "sha256", 0, 6)) {
            return digest.substring(colon + 1).trim();
        }
        return "";
    }

    private static boolean completeFile(Path path, long expected, String sha256) throws Exception {
        if (!Files.isRegularFile(path) || expected <= 0 || Files.size(path) != expected) {
            return false;
        }
        if (sha256 == null || sha256.isBlank()) {
            return true;
        }
        return sha256.equalsIgnoreCase(Fs.sha256(path));
    }

    private static boolean extractReady(Path extract, Path zip, long expected) throws Exception {
        if (!Files.isRegularFile(zip) || expected <= 0 || Files.size(zip) != expected || !Files.isDirectory(extract)) {
            return false;
        }
        Path marker = extract.resolveSibling(extract.getFileName() + ".complete");
        if (Files.isRegularFile(marker) && Files.readString(marker).trim().equals(Long.toString(expected))) {
            return true;
        }
        try (DirectoryStream<Path> stream = Files.newDirectoryStream(extract)) {
            if (stream.iterator().hasNext()) {
                writeExtractMarker(extract, expected);
                return true;
            }
        }
        return false;
    }

    private static void writeExtractMarker(Path extract, long expected) throws Exception {
        Files.writeString(extract.resolveSibling(extract.getFileName() + ".complete"), Long.toString(expected));
    }

    static Manifests.Manifest loadManifest(Config config, String side) throws Exception {
        Path path = config.manifestsDir().resolve(side + ".json");
        if (!Files.isRegularFile(path)) {
            throw new IllegalStateException("尚未构建 " + side + " 清单，请先构建仓库");
        }
        return Manifests.Manifest.from(Json.object(Json.parse(Files.readString(path))));
    }

    static Map<String, Object> loadMeta(Config config) throws Exception {
        Path path = config.manifestsDir().resolve("meta.json");
        if (!Files.isRegularFile(path)) {
            return Json.map();
        }
        return Json.object(Json.parse(Files.readString(path)));
    }

    static Path objectPath(Config config, String digest) {
        String hex = Fs.sha256Hex(digest);
        Path root = config.objectsDir.toAbsolutePath().normalize();
        Path object = root.resolve(hex.substring(0, 2)).resolve(hex).normalize();
        if (!object.startsWith(root) || !hex.equals(object.getFileName().toString())) {
            throw new IllegalArgumentException("无效文件哈希");
        }
        return object;
    }

    static String instanceToml(Config config, String side) {
        StringBuilder out = new StringBuilder();
        out.append("update_server = \"").append(config.updateServerUrl).append("\"\n");
        out.append("side = \"").append(side).append("\"\n");
        out.append("instance_dir = \".\"\n");
        if (!config.accessToken.isBlank()) {
            out.append("update_token = \"").append(config.accessToken).append("\"\n");
        }
        return out.toString();
    }
}
