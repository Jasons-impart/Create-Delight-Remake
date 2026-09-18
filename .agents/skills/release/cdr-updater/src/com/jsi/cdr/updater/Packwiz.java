package com.jsi.cdr.updater;

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
import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.function.Consumer;

final class Packwiz {
    private static final Map<String, String> CF_NAMES = new LinkedHashMap<>();
    private static final Map<Long, CfFile> CF_FILES = new LinkedHashMap<>();
    private static final String PACKWIZ_API_KEY = new String(Base64.getDecoder().decode(
            "JDJhJDEwJHNBWVhqblU1N0EzSmpzcmJYM3JVdk92UWk2NHBLS3BnQ2VpbGc1TUM1UGNKL0RYTmlGWWxh"),
            StandardCharsets.UTF_8);
    private static String configuredApiKey = "";

    private Packwiz() {}

    static final class CfFile {
        final long fileId;
        final long projectId;
        final String fileName;
        final String downloadUrl;

        CfFile(long fileId, long projectId, String fileName, String downloadUrl) {
            this.fileId = fileId;
            this.projectId = projectId;
            this.fileName = fileName == null ? "" : fileName;
            this.downloadUrl = downloadUrl == null ? "" : downloadUrl;
        }
    }

    static final class Asset {
        final String path;
        final String side;
        final String filename;
        final String url;
        final String hashFormat;
        final String hash;
        final long projectId;
        final long fileId;

        Asset(String path, String side, String filename, String url, long projectId, long fileId) {
            this(path, side, filename, url, "", "", projectId, fileId);
        }

        Asset(String path, String side, String filename, String url, String hashFormat, String hash,
              long projectId, long fileId) {
            this.path = path;
            this.side = side;
            this.filename = filename;
            this.url = url;
            this.hashFormat = hashFormat == null ? "" : hashFormat;
            this.hash = hash == null ? "" : hash;
            this.projectId = projectId;
            this.fileId = fileId;
        }
    }

    static void pullClientAssets(Path clientRoot, Path serverRoot, Path clientDir, Path cache,
                                 Consumer<String> log) throws Exception {
        HttpClient http = Net.http();
        Map<String, Asset> assets = new LinkedHashMap<>();
        for (Asset asset : readAssets(clientRoot)) {
            assets.put(asset.path, asset);
        }
        for (Asset asset : readAssets(serverRoot)) {
            assets.putIfAbsent(asset.path, asset);
        }
        for (Asset asset : readCurseForgeManifest(clientRoot)) {
            assets.putIfAbsent(asset.path, asset);
        }
        Path downloadCache = cache.resolve("packwiz");
        Files.createDirectories(downloadCache);
        prefetch(http, assets.values(), log);
        int pulled = 0;
        for (Asset raw : new ArrayList<>(assets.values())) {
            Asset asset = resolve(http, raw, log);
            if (!Pack.allowed(asset.side, "client")) {
                continue;
            }
            Path destination = clientDir.resolve(asset.path);
            if (Files.isRegularFile(destination)) {
                continue;
            }
            Path source = locateExisting(asset, clientRoot, serverRoot);
            if (source == null) {
                source = download(http, asset, downloadCache, log);
            }
            if (source == null) {
                log.accept("跳过无法下载的客户端资源 " + asset.path);
                continue;
            }
            Fs.copyFile(source, destination);
            pulled++;
        }
        log.accept("客户端补拉资源包/光影等 " + pulled + " 个");
    }

    static void pullGithubResourcePacks(Pack.Config config, Path clientDir, Path cache, Consumer<String> log) throws Exception {
        HttpClient http = Net.http();
        Path downloadCache = cache.resolve("packwiz");
        Files.createDirectories(downloadCache);
        int pulled = 0;
        for (String dir : new String[]{"resourcepacks", "shaderpacks"}) {
            List<Asset> assets = readGithubAssets(http, config, dir);
            prefetch(http, assets, log);
            for (Asset asset : assets) {
                if (!Pack.allowed(asset.side, "client")) {
                    continue;
                }
                Path destination = clientDir.resolve(asset.path);
                if (Files.isRegularFile(destination)) {
                    continue;
                }
                Path source = download(http, asset, downloadCache, log);
                if (source == null) {
                    log.accept("跳过无法下载的 " + asset.path);
                    continue;
                }
                Fs.copyFile(source, destination);
                pulled++;
            }
        }
        log.accept("从 GitHub 元数据为客户端拉取资源包/光影 " + pulled + " 个");
    }

    static List<Asset> readGithubAssets(HttpClient http, Pack.Config config, String dir) throws Exception {
        List<Asset> assets = new ArrayList<>();
        String url = config.githubApi + "/repos/" + config.githubRepo + "/contents/" + dir + "?ref=" + config.officialVersion;
        HttpRequest request = HttpRequest.newBuilder(URI.create(url))
                .header("Accept", "application/vnd.github+json")
                .header("User-Agent", "cdr-updater")
                .timeout(Duration.ofMinutes(2))
                .build();
        HttpResponse<String> response = http.send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() >= 400) {
            return assets;
        }
        Object parsed = Json.parse(response.body());
        if (!(parsed instanceof List<?> list)) {
            return assets;
        }
        Path tmp = Files.createTempDirectory("cdr-pw");
        try {
            for (Object item : list) {
                Map<String, Object> row = Json.object(item);
                String name = Json.str(row, "name");
                String download = Json.str(row, "download_url");
                if (!name.endsWith(".pw.toml") || download.isBlank()) {
                    continue;
                }
                Path meta = tmp.resolve(name);
                HttpResponse<Path> file = http.send(HttpRequest.newBuilder(URI.create(download))
                        .header("User-Agent", "cdr-updater")
                        .timeout(Duration.ofMinutes(2))
                        .build(), HttpResponse.BodyHandlers.ofFile(meta));
                if (file.statusCode() >= 400) {
                    continue;
                }
                assets.addAll(readAssetsFile(meta, dir));
            }
        } finally {
            Fs.deleteTree(tmp);
        }
        return assets;
    }

    private static List<Asset> readAssetsFile(Path meta, String assetDir) throws Exception {
        Map<String, Object> data = Toml.load(meta);
        String filename = Toml.str(data, "filename", "");
        if (filename.isBlank()) {
            return List.of();
        }
        Map<String, Object> download = Json.object(data.get("download"));
        Map<String, Object> curse = Json.object(Json.object(data.get("update")).get("curseforge"));
        String side = Sides.normalize(Toml.str(data, "side", defaultSideForDir(assetDir)));
        long projectId = Json.lng(curse, "project-id");
        if (projectId == 0) {
            projectId = Json.lng(curse, "projectId");
        }
        long fileId = Json.lng(curse, "file-id");
        if (fileId == 0) {
            fileId = Json.lng(curse, "fileId");
        }
        return List.of(new Asset(
                Fs.posix(assetDir + "/" + filename),
                side,
                filename,
                Toml.str(download, "url", ""),
                Toml.str(download, "hash-format", Toml.str(download, "hash_format", "")),
                Toml.str(download, "hash", ""),
                projectId,
                fileId
        ));
    }

    static List<Asset> readAssets(Path root) throws Exception {
        List<Asset> assets = new ArrayList<>();
        if (root == null || !Files.exists(root)) {
            return assets;
        }
        for (String assetDir : PackPaths.ASSET_DIRS) {
            Path metaRoot = root.resolve(assetDir);
            if (!Files.exists(metaRoot)) {
                continue;
            }
            for (Path meta : Fs.files(metaRoot)) {
                if (!meta.getFileName().toString().endsWith(".pw.toml")) {
                    continue;
                }
                assets.addAll(readAssetsFile(meta, assetDir));
            }
        }
        return assets;
    }

    static List<Asset> readCurseForgeManifest(Path packRoot) throws Exception {
        List<Asset> assets = new ArrayList<>();
        Path manifest = findManifest(packRoot);
        if (manifest == null) {
            return assets;
        }
        Map<String, Object> data = Json.object(Json.parse(Files.readString(manifest)));
        for (Object item : Json.array(data.get("files"))) {
            Map<String, Object> row = Json.object(item);
            String filename = firstNonBlank(Json.str(row, "fileName"), Json.str(row, "name"));
            String url = Json.str(row, "downloadUrl");
            if (url.isBlank()) {
                url = Json.str(row, "url");
            }
            long projectId = Json.lng(row, "projectID");
            if (projectId == 0) {
                projectId = Json.lng(row, "projectId");
            }
            long fileId = Json.lng(row, "fileID");
            if (fileId == 0) {
                fileId = Json.lng(row, "fileId");
            }
            if (filename.isBlank() && url.isBlank() && fileId == 0) {
                continue;
            }
            if (filename.isBlank()) {
                filename = fileId > 0 ? "cf-" + fileId + ".jar" : Fs.fileName(url);
            }
            String folder = folderForClientFile(filename, url);
            assets.add(new Asset(folder + "/" + filename, "client", filename, url, projectId, fileId));
        }
        return assets;
    }

    static String folderForClientFile(String filename, String url) {
        String name = (filename + " " + url).toLowerCase(Locale.ROOT);
        if (name.contains("shader") && !name.contains(".jar")) {
            return "shaderpacks";
        }
        if (name.contains(".zip") && !name.contains(".jar")) {
            return "resourcepacks";
        }
        return "mods";
    }

    private static Path locateExisting(Asset asset, Path clientRoot, Path serverRoot) {
        for (Path root : new Path[]{clientRoot, serverRoot}) {
            if (root == null) {
                continue;
            }
            Path path = root.resolve(asset.path);
            if (Files.isRegularFile(path)) {
                return path;
            }
        }
        return null;
    }

    private static Path download(HttpClient http, Asset asset, Path cache, Consumer<String> log) throws Exception {
        Path destination = cache.resolve(safeName(asset.filename.isBlank() ? "file-" + asset.fileId : asset.filename));
        if (usable(destination, asset)) {
            return destination;
        }
        Files.deleteIfExists(destination);
        List<String> urls = candidateUrls(http, asset, log);
        if (urls.isEmpty()) {
            return null;
        }
        for (String url : urls) {
            try {
                log.accept("下载客户端资源 " + asset.filename);
                HttpRequest request = downloadRequest(url).timeout(Duration.ofMinutes(10)).build();
                HttpResponse<Path> response = http.send(request, HttpResponse.BodyHandlers.ofFile(destination));
                if (response.statusCode() >= 400) {
                    log.accept("下载失败 HTTP " + response.statusCode() + " " + url);
                    Files.deleteIfExists(destination);
                    continue;
                }
                if (!usable(destination, asset)) {
                    log.accept("下载内容无效 " + asset.filename);
                    Files.deleteIfExists(destination);
                    continue;
                }
                return destination;
            } catch (Exception error) {
                Files.deleteIfExists(destination);
                log.accept("下载失败 " + asset.filename + "：" + error.getMessage());
            }
        }
        return null;
    }

    private static List<String> candidateUrls(HttpClient http, Asset asset, Consumer<String> log) {
        List<String> urls = new ArrayList<>();
        addUrl(urls, asset.url);
        java.util.LinkedHashSet<String> names = new java.util.LinkedHashSet<>();
        if (asset.filename != null && !asset.filename.isBlank() && !asset.filename.startsWith("cf-")) {
            names.add(asset.filename);
        }
        CfFile info = asset.fileId > 0 ? CF_FILES.get(asset.fileId) : null;
        if (info == null && asset.projectId > 0 && asset.fileId > 0) {
            curseForgeFileName(http, asset.projectId, asset.fileId, log);
            info = CF_FILES.get(asset.fileId);
        }
        if (info != null) {
            addUrl(urls, info.downloadUrl);
            if (!info.fileName.isBlank()) {
                names.add(info.fileName);
            }
        }
        if (asset.projectId > 0 && asset.fileId > 0) {
            addUrl(urls, officialDownloadUrl(asset.projectId, asset.fileId));
        }
        for (String name : names) {
            if (asset.fileId > 0) {
                for (String host : new String[]{"edge.forgecdn.net", "mediafilez.forgecdn.net", "media.forgecdn.net"}) {
                    addUrl(urls, "https://" + host + "/files/" + (asset.fileId / 1000) + "/" + (asset.fileId % 1000)
                            + "/" + encodePath(name));
                }
            }
        }
        return urls;
    }

    static Asset resolve(HttpClient http, Asset asset, Consumer<String> log) {
        String filename = asset.filename;
        String url = asset.url;
        if (asset.fileId > 0 && (filename.isBlank() || filename.startsWith("cf-") || url.isBlank() || isWebsiteCurseForge(url))) {
            if (!CF_FILES.containsKey(asset.fileId) && asset.projectId > 0) {
                curseForgeFileName(http, asset.projectId, asset.fileId, log);
            }
            CfFile info = CF_FILES.get(asset.fileId);
            if (info != null) {
                if (!info.fileName.isBlank()) {
                    filename = info.fileName;
                }
                if (!info.downloadUrl.isBlank()) {
                    url = info.downloadUrl;
                }
            }
        }
        if (filename.isBlank()) {
            filename = asset.fileId > 0 ? "cf-" + asset.fileId + ".jar" : "unknown.bin";
        }
        return new Asset(folderForClientFile(filename, url) + "/" + filename, asset.side, filename, url,
                asset.hashFormat, asset.hash, asset.projectId, asset.fileId);
    }

    static String curseForgeFileName(HttpClient http, long projectId, long fileId, Consumer<String> log) {
        String key = projectId + ":" + fileId;
        if (CF_NAMES.containsKey(key)) {
            return CF_NAMES.get(key);
        }
        CfFile cached = CF_FILES.get(fileId);
        if (cached != null) {
            CF_NAMES.put(key, cached.fileName);
            return cached.fileName;
        }
        if (http == null || projectId <= 0 || fileId <= 0) {
            CF_NAMES.put(key, "");
            return "";
        }
        String url = officialFileUrl(projectId, fileId);
        try {
            HttpRequest request = apiRequest(url).GET().timeout(Duration.ofSeconds(30)).build();
            HttpResponse<String> response = http.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() >= 400) {
                log.accept("CurseForge 官方 API 失败 HTTP " + response.statusCode());
                CF_NAMES.put(key, "");
                return "";
            }
            ingestFilesJson(response.body());
            CfFile info = CF_FILES.get(fileId);
            String name = info == null ? "" : info.fileName;
            CF_NAMES.put(key, name);
            return name;
        } catch (Exception error) {
            log.accept("CurseForge 官方 API 失败：" + error.getMessage());
            CF_NAMES.put(key, "");
            return "";
        }
    }

    static void configure(String apiKey) {
        configuredApiKey = apiKey == null ? "" : apiKey.trim();
    }

    static String apiKey() {
        String env = firstNonBlank(System.getenv("CURSEFORGE_API_KEY"), System.getenv("CF_API_KEY"), configuredApiKey);
        return env == null || env.isBlank() ? PACKWIZ_API_KEY : env;
    }

    static String officialFileUrl(long projectId, long fileId) {
        return "https://api.curseforge.com/v1/mods/" + projectId + "/files/" + fileId;
    }

    static String officialDownloadUrl(long projectId, long fileId) {
        return officialFileUrl(projectId, fileId) + "/download";
    }

    static boolean isWebsiteCurseForge(String url) {
        if (url == null || url.isBlank()) {
            return false;
        }
        String lower = url.toLowerCase(Locale.ROOT);
        return lower.contains("www.curseforge.com") || lower.contains("://curseforge.com/");
    }

    static void prefetch(HttpClient http, Collection<Asset> assets, Consumer<String> log) {
        if (http == null || assets == null || assets.isEmpty()) {
            return;
        }
        List<Long> ids = new ArrayList<>();
        for (Asset asset : assets) {
            if (asset.fileId > 0 && !CF_FILES.containsKey(asset.fileId) && !ids.contains(asset.fileId)) {
                ids.add(asset.fileId);
            }
        }
        if (ids.isEmpty()) {
            return;
        }
        log.accept("正在从 CurseForge 官方 API 查询 " + ids.size() + " 个文件");
        for (int start = 0; start < ids.size(); start += 50) {
            List<Long> chunk = ids.subList(start, Math.min(start + 50, ids.size()));
            try {
                Map<String, Object> payload = Json.map();
                payload.put("fileIds", new ArrayList<>(chunk));
                HttpRequest request = apiRequest("https://api.curseforge.com/v1/mods/files")
                        .header("Content-Type", "application/json")
                        .POST(HttpRequest.BodyPublishers.ofString(Json.stringify(payload), StandardCharsets.UTF_8))
                        .timeout(Duration.ofMinutes(2))
                        .build();
                HttpResponse<String> response = http.send(request, HttpResponse.BodyHandlers.ofString());
                if (response.statusCode() >= 400) {
                    log.accept("CurseForge 官方 API 批量查询失败 HTTP " + response.statusCode());
                    continue;
                }
                ingestFilesJson(response.body());
            } catch (Exception error) {
                log.accept("CurseForge 官方 API 批量查询失败：" + error.getMessage());
            }
        }
    }

    static void ingestFilesJson(String body) {
        if (body == null || body.isBlank()) {
            return;
        }
        Object parsed = Json.parse(body);
        List<Object> rows = Json.array(Json.object(parsed).get("data"));
        if (rows.isEmpty()) {
            Map<String, Object> single = Json.object(Json.object(parsed).get("data"));
            if (!single.isEmpty()) {
                rows = List.of(single);
            }
        }
        for (Object item : rows) {
            Map<String, Object> row = Json.object(item);
            long fileId = Json.lng(row, "id");
            if (fileId == 0) {
                continue;
            }
            long projectId = Json.lng(row, "modId");
            String name = firstNonBlank(Json.str(row, "fileName"), Json.str(row, "displayName"));
            String download = Json.str(row, "downloadUrl");
            CF_FILES.put(fileId, new CfFile(fileId, projectId, name, download));
            if (projectId > 0 && !name.isBlank()) {
                CF_NAMES.put(projectId + ":" + fileId, name);
            }
        }
    }

    private static HttpRequest.Builder apiRequest(String url) {
        return HttpRequest.newBuilder(URI.create(url))
                .header("User-Agent", "cdr-updater")
                .header("Accept", "application/json")
                .header("x-api-key", apiKey());
    }

    private static HttpRequest.Builder downloadRequest(String url) {
        HttpRequest.Builder builder = HttpRequest.newBuilder(URI.create(url))
                .header("User-Agent", "cdr-updater")
                .header("Accept", "*/*");
        if (needsApiKey(url)) {
            builder.header("x-api-key", apiKey());
        }
        return builder;
    }

    static boolean needsApiKey(String url) {
        if (url == null) {
            return false;
        }
        String lower = url.toLowerCase(Locale.ROOT);
        return lower.contains("curseforge.com") || lower.contains("forgecdn.net");
    }

    static boolean usable(Path path, Asset asset) throws Exception {
        if (!Files.isRegularFile(path) || Files.size(path) <= 0 || looksLikeHtml(path)) {
            return false;
        }
        return hashMatches(path, asset);
    }

    static boolean looksLikeHtml(Path path) throws Exception {
        try (var in = Files.newInputStream(path)) {
            byte[] header = in.readNBytes(64);
            String text = new String(header, java.nio.charset.StandardCharsets.US_ASCII).toLowerCase(Locale.ROOT);
            return text.contains("<html") || text.contains("<!doctype");
        }
    }

    static boolean hashMatches(Path path, Asset asset) throws Exception {
        if (asset == null || asset.hash == null || asset.hash.isBlank()) {
            return true;
        }
        String algo = switch (asset.hashFormat.toLowerCase(Locale.ROOT)) {
            case "sha1", "sha-1" -> "SHA-1";
            case "sha256", "sha-256" -> "SHA-256";
            case "sha512", "sha-512" -> "SHA-512";
            default -> "";
        };
        if (algo.isBlank()) {
            return true;
        }
        return asset.hash.equalsIgnoreCase(Fs.digest(path, algo));
    }

    static String encodePath(String filename) {
        StringBuilder out = new StringBuilder();
        byte[] bytes = filename.getBytes(java.nio.charset.StandardCharsets.UTF_8);
        for (byte raw : bytes) {
            int value = raw & 0xff;
            char ch = (char) value;
            if ((ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z') || (ch >= '0' && ch <= '9')
                    || ch == '-' || ch == '_' || ch == '.' || ch == '~') {
                out.append(ch);
            } else {
                out.append(String.format("%%%02X", value));
            }
        }
        return out.toString();
    }

    private static void addUrl(List<String> urls, String url) {
        if (url != null && !url.isBlank() && !isWebsiteCurseForge(url) && !urls.contains(url)) {
            urls.add(url);
        }
    }

    static String forgeCdn(long fileId, String filename) {
        return "https://edge.forgecdn.net/files/" + (fileId / 1000) + "/" + (fileId % 1000) + "/"
                + encodePath(filename);
    }

    static Path findManifest(Path packRoot) {
        if (packRoot == null) {
            return null;
        }
        Path direct = packRoot.resolve("manifest.json");
        if (Files.isRegularFile(direct)) {
            return direct;
        }
        Path parent = packRoot.getParent();
        if (parent != null && Files.isRegularFile(parent.resolve("manifest.json"))) {
            return parent.resolve("manifest.json");
        }
        return null;
    }

    private static String defaultSideForDir(String assetDir) {
        if ("resourcepacks".equals(assetDir) || "shaderpacks".equals(assetDir)) {
            return "client";
        }
        return "both";
    }

    private static String firstNonBlank(String... values) {
        for (String value : values) {
            if (value != null && !value.isBlank()) {
                return value;
            }
        }
        return "";
    }

    private static String extension(String url, String folder) {
        if (url != null && url.toLowerCase(Locale.ROOT).contains(".zip")) {
            return ".zip";
        }
        return "shaderpacks".equals(folder) || "resourcepacks".equals(folder) ? ".zip" : "";
    }

    private static String safeName(String filename) {
        return filename.replace('\\', '_').replace('/', '_').replace(':', '_');
    }
}
