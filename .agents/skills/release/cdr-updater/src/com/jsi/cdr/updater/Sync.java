package com.jsi.cdr.updater;

import javax.swing.JOptionPane;
import java.awt.GraphicsEnvironment;
import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.security.MessageDigest;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Duration;
import java.util.ArrayList;
import java.util.HexFormat;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.Semaphore;
import java.util.function.Consumer;

final class Sync {
    static final class Result {
        final String officialVersion;
        final String changelogKind;
        final String changelogText;
        final boolean changed;
        final List<Map<String, String>> applied;
        final List<String> keptLocal;

        Result(String officialVersion, String changelogKind, String changelogText, boolean changed,
               List<Map<String, String>> applied, List<String> keptLocal) {
            this.officialVersion = officialVersion;
            this.changelogKind = changelogKind;
            this.changelogText = changelogText;
            this.changed = changed;
            this.applied = applied;
            this.keptLocal = keptLocal;
        }
    }

    static final class Client {
        private final HttpClient http = HttpClient.newBuilder()
                .version(HttpClient.Version.HTTP_1_1)
                .connectTimeout(Duration.ofSeconds(20))
                .build();
        private final String base;
        private final String side;
        private final String token;
        private final String instanceId;
        private final String instancePath;
        private final String hostname;

        Client(String base) {
            this(base, "client", null, "");
        }

        Client(String base, String side, Path instance) {
            this(base, side, instance, "");
        }

        String server() {
            return base;
        }

        String token() {
            return token;
        }

        Client(String base, String side, Path instance, String token) {
            this.base = base.endsWith("/") ? base : base + "/";
            this.side = side == null || side.isBlank() ? "client" : side;
            this.token = token == null ? "" : token.trim();
            if ("server".equals(this.side) && instance != null) {
                try {
                    this.instanceId = Connections.ensureInstanceId(instance);
                } catch (Exception error) {
                    throw new IllegalStateException("无法写入服务端实例 ID", error);
                }
                this.instancePath = instance.toAbsolutePath().normalize().toString();
                this.hostname = Connections.localHostname();
            } else {
                this.instanceId = "";
                this.instancePath = "";
                this.hostname = "";
            }
        }

        private void identity(HttpRequest.Builder builder) {
            builder.header("X-CDR-Side", side);
            if (!token.isBlank()) {
                builder.header("X-CDR-Token", token);
            }
            if ("server".equals(side)) {
                if (!instanceId.isBlank()) {
                    builder.header("X-CDR-Instance-Id", instanceId);
                }
                if (!instancePath.isBlank()) {
                    builder.header("X-CDR-Instance-Path", Connections.encodePath(instancePath));
                }
                if (!hostname.isBlank()) {
                    builder.header("X-CDR-Hostname", hostname);
                }
            }
        }

        Map<String, Object> json(String method, String path, Object payload) throws Exception {
            HttpRequest.Builder builder = HttpRequest.newBuilder(URI.create(base + path))
                    .header("Accept", "application/json")
                    .header("User-Agent", "cdr-updater-client");
            identity(builder);
            if (payload == null) {
                builder.method(method, HttpRequest.BodyPublishers.noBody());
            } else {
                builder.header("Content-Type", "application/json")
                        .method(method, HttpRequest.BodyPublishers.ofString(Json.stringify(payload), StandardCharsets.UTF_8));
            }
            HttpResponse<String> response = http.send(builder.build(), HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() >= 400) {
                throw new IllegalStateException("更新服务器返回 " + response.statusCode() + ": " + response.body());
            }
            return Json.object(Json.parse(response.body()));
        }

        byte[] download(String sha256) throws Exception {
            Path tmp = Files.createTempFile("cdr-dl-", ".bin");
            try {
                downloadTo(sha256, tmp, 0, line -> {});
                return Files.readAllBytes(tmp);
            } finally {
                Files.deleteIfExists(tmp);
            }
        }

        String fileUrl(String sha256) {
            return base + "api/file/" + Fs.sha256Hex(sha256);
        }

        void downloadTo(String sha256, Path destination, long expected, Consumer<String> log) throws Exception {
            downloadTo(sha256, destination, expected, log, true);
        }

        void downloadTo(String sha256, Path destination, long expected, Consumer<String> log, boolean parallel) throws Exception {
            downloadTo(sha256, destination, expected, log, parallel, null);
        }

        void downloadTo(String sha256, Path destination, long expected, Consumer<String> log, boolean parallel, String label) throws Exception {
            String digest = Fs.sha256Hex(sha256);
            String name = label == null || label.isBlank()
                    ? (destination.getFileName() == null ? digest : destination.getFileName().toString())
                    : label;
            HttpRequest.Builder builder = HttpRequest.newBuilder(URI.create(base + "api/file/" + digest))
                    .header("User-Agent", "cdr-updater-client")
                    .timeout(Duration.ofMinutes(30));
            if ("小文件压缩包".equals(label)) {
                builder.header("X-CDR-Lanes", "2");
            }
            identity(builder);
            Path partial = destination.resolveSibling(destination.getFileName() + ".cdrtmp");
            try {
                Net.toFile(http, builder, partial, expected, name, log, true, parallel);
                Files.createDirectories(destination.getParent());
                replaceInto(partial, destination);
            } catch (Exception error) {
                Files.deleteIfExists(partial);
                throw error;
            }
        }

        private Map<String, Object> readPack(String side, List<String> paths, Consumer<String> log) throws Exception {
            Map<String, Object> body = Json.map();
            body.put("side", side);
            body.put("paths", paths);
            HttpRequest.Builder builder = HttpRequest.newBuilder(URI.create(base + "api/pack"))
                    .header("Accept", "application/x-ndjson")
                    .header("Content-Type", "application/json")
                    .header("User-Agent", "cdr-updater-client")
                    .timeout(Duration.ofMinutes(60));
            identity(builder);
            builder.POST(HttpRequest.BodyPublishers.ofString(Json.stringify(body), StandardCharsets.UTF_8));
            HttpResponse<InputStream> response = http.send(builder.build(), HttpResponse.BodyHandlers.ofInputStream());
            if (response.statusCode() >= 400) {
                String detail;
                try (InputStream errorBody = response.body()) {
                    detail = new String(errorBody.readAllBytes(), StandardCharsets.UTF_8);
                }
                throw new IllegalStateException("更新服务器返回 " + response.statusCode() + ": " + detail);
            }
            Map<String, Object> done = null;
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(response.body(), StandardCharsets.UTF_8))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    if (line.isBlank()) {
                        continue;
                    }
                    Map<String, Object> row = Json.object(Json.parse(line));
                    String event = Json.str(row, "event");
                    if ("error".equals(event)) {
                        throw new IllegalStateException(Json.str(row, "detail"));
                    }
                    if ("progress".equals(event)) {
                        long finished = Json.lng(row, "done");
                        long total = Json.lng(row, "total");
                        Progress.note("打包 " + finished + "/" + total);
                        if (log != null && (finished == total || finished % 100 == 0)) {
                            log.accept("打包 " + finished + "/" + total);
                        }
                    } else if ("done".equals(event) || !Json.str(row, "sha256").isBlank()) {
                        done = row;
                    }
                }
            }
            if (done == null) {
                throw new IllegalStateException("打包没有返回结果");
            }
            return done;
        }

        Map<String, Object> requestPack(String side, List<Map<String, Object>> jobs, Consumer<String> log) throws Exception {
            List<String> paths = new ArrayList<>();
            for (Map<String, Object> job : jobs) {
                paths.add(Fs.posix(Json.str(job, "path")));
            }
            return readPack(side, paths, log);
        }

        void releasePack(String sha, Consumer<String> log) {
            discardPack(sha, log);
        }

        List<Map<String, String>> savePack(Path instanceDir, String packSha, long packSize, List<Map<String, Object>> jobs,
                                            Consumer<String> log, boolean parallel, String label) throws Exception {
            return finishPack(instanceDir, packSha, packSize, jobs, log, parallel, label);
        }

        private void discardPack(String sha, Consumer<String> log) {
            try {
                Map<String, Object> body = Json.map();
                body.put("discard", sha);
                json("POST", "api/pack", body);
            } catch (Exception error) {
                if (log != null) {
                    log.accept("服务端压缩包还在，删除失败：" + error.getMessage());
                }
            }
        }

        List<Map<String, String>> downloadPack(Path instanceDir, String side, List<Map<String, Object>> jobs,
                                               Consumer<String> log, boolean parallel) throws Exception {
            if (log != null) {
                log.accept(parallel ? "正在服务器上打包，完成后多线程下载这一个压缩包" : "正在服务器上打包，完成后单线程下载这一个压缩包");
            }
            Map<String, Object> meta = requestPack(side, jobs, log);
            return finishPack(instanceDir, Json.str(meta, "sha256"), Json.lng(meta, "size"), jobs, log, parallel, null);
        }

        private List<Map<String, String>> finishPack(Path instanceDir, String packSha, long packSize, List<Map<String, Object>> jobs,
                                                      Consumer<String> log, boolean parallel, String label) throws Exception {
            Map<String, Map<String, Object>> byPath = new LinkedHashMap<>();
            for (Map<String, Object> job : jobs) {
                byPath.put(Fs.posix(Json.str(job, "path")), job);
            }
            Path zipPath = null;
            List<Map<String, String>> written = new ArrayList<>();
            String packName = label == null || label.isBlank() ? "压缩包" : label;
            long budget = 0;
            for (Map<String, Object> job : jobs) {
                budget += Math.max(0, Json.lng(job, "size"));
            }
            try {
                zipPath = Files.createTempFile("cdr-pack-", ".zip");
                Progress.weigh(packName, packSize, budget);
                downloadTo(packSha, zipPath, packSize, log, parallel, packName);
                try (ZipFile zip = new ZipFile(zipPath.toFile())) {
                    var entries = zip.entries();
                    while (entries.hasMoreElements()) {
                        ZipEntry entry = entries.nextElement();
                        if (entry.isDirectory()) {
                            continue;
                        }
                        String rel = Fs.posix(entry.getName());
                        Map<String, Object> job = byPath.remove(rel);
                        if (job == null) {
                            continue;
                        }
                        String expect = Json.str(job, "sha256");
                        Path dest = instanceDir.resolve(rel);
                        Path partial = dest.resolveSibling(dest.getFileName() + ".cdrtmp");
                        Files.createDirectories(dest.getParent());
                        MessageDigest digest = MessageDigest.getInstance("SHA-256");
                        try (InputStream in = zip.getInputStream(entry); OutputStream out = Files.newOutputStream(partial)) {
                            byte[] buf = new byte[1024 * 128];
                            int n;
                            while ((n = in.read(buf)) >= 0) {
                                out.write(buf, 0, n);
                                digest.update(buf, 0, n);
                            }
                        }
                        String got = HexFormat.of().formatHex(digest.digest());
                        if (!got.equalsIgnoreCase(expect)) {
                            Files.deleteIfExists(partial);
                            throw new IllegalStateException("压缩包文件校验失败 " + rel);
                        }
                        replaceInto(partial, dest);
                        if (log != null) {
                            log.accept("下载完成 " + rel);
                        }
                        written.add(Map.of("path", rel, "sha256", expect));
                    }
                }
                Progress.settle(packName, budget);
            } finally {
                if (zipPath != null) {
                    Files.deleteIfExists(zipPath);
                }
                if (packSha != null && !packSha.isBlank()) {
                    discardPack(packSha, log);
                }
            }
            if (!byPath.isEmpty()) {
                throw new IllegalStateException("压缩包缺少 " + byPath.keySet().iterator().next());
            }
            return written;
        }
    }

    static Map<String, Object> loadState(Path instanceDir) throws Exception {
        Path statePath = instanceDir.resolve("cdr-updater-state.json");
        if (!Files.isRegularFile(statePath)) {
            return Json.map();
        }
        return Json.object(Json.parse(Files.readString(statePath)));
    }

    static List<Object> scan(Path instanceDir, List<Object> remoteFiles, List<String> managedPaths) throws Exception {
        List<Object> local = Json.list();
        java.util.LinkedHashSet<String> seen = new java.util.LinkedHashSet<>();
        List<String> candidates = new ArrayList<>();
        for (Object item : remoteFiles) {
            candidates.add(Json.str(Json.object(item), "path"));
        }
        candidates.addAll(managedPaths);
        for (String relRaw : candidates) {
            String rel = Fs.posix(relRaw);
            if (!seen.add(rel)) {
                continue;
            }
            Path path = instanceDir.resolve(rel);
            if (!Files.isRegularFile(path)) {
                continue;
            }
            Map<String, Object> row = Json.map();
            row.put("path", rel);
            row.put("sha256", Fs.sha256(path));
            row.put("size", Files.size(path));
            if (PackPaths.taggedTemplate(rel)) {
                row.put("managed_tag", PackPaths.hasManagedTag(Files.readString(path)));
                row.put("keep_local", Files.isRegularFile(instanceDir.resolve(PackPaths.SERVER_KEEP)));
            }
            local.add(row);
        }
        return local;
    }

    static Result apply(Path instanceDir, String side, Client client, Consumer<String> progress) throws Exception {
        return apply(instanceDir, side, client, progress, false);
    }

    static Result apply(Path instanceDir, String side, Client client, Consumer<String> progress, boolean askMultiProcess) throws Exception {
        Files.createDirectories(instanceDir);
        Map<String, Object> state = loadState(instanceDir);
        String previousVersion = Json.str(state, "official_version");
        List<String> managedPaths = new ArrayList<>();
        for (Object item : Json.array(state.get("managed_paths"))) {
            managedPaths.add(Fs.posix(String.valueOf(item)));
        }
        Map<String, String> syncedHashes = new LinkedHashMap<>();
        for (Map.Entry<String, Object> entry : Json.object(state.get("synced_hashes")).entrySet()) {
            syncedHashes.put(Fs.posix(entry.getKey()), String.valueOf(entry.getValue()));
        }
        progress.accept("正在拉取远程清单");
        Map<String, Object> remote = client.json("GET", "api/manifest?side=" + side, null);
        List<Object> remoteFiles = Json.array(remote.get("files"));
        List<Object> localFiles = scan(instanceDir, remoteFiles, managedPaths);
        Map<String, Map<String, Object>> localByPath = new LinkedHashMap<>();
        for (Object item : localFiles) {
            Map<String, Object> row = Json.object(item);
            localByPath.put(Json.str(row, "path"), row);
        }
        progress.accept("正在本地比对清单");
        List<Map<String, String>> applied = new ArrayList<>();
        List<String> keptLocal = new ArrayList<>();
        List<Map<String, Object>> jobs = new ArrayList<>();
        for (Object item : remoteFiles) {
            Map<String, Object> row = Json.object(item);
            String rel = Fs.posix(Json.str(row, "path"));
            if (Fs.unsafePath(rel)) {
                progress.accept("忽略非法路径 " + rel);
                continue;
            }
            Map<String, Object> local = localByPath.get(rel);
            String localSha = local == null ? null : Json.str(local, "sha256");
            String remoteSha = Json.str(row, "sha256");
            if (!Policy.shouldOverwriteLocal(rel, side, localSha, remoteSha, syncedHashes, overlayFlag(row),
                    managedTag(instanceDir, rel), keepServerProperties(instanceDir, rel))) {
                if (localSha != null && !localSha.equals(remoteSha)) {
                    keptLocal.add(rel);
                    progress.accept(("server".equals(side) ? "保留管理员改动 " : "保留玩家改动 ") + rel);
                }
                if (PackPaths.taggedTemplate(rel) && Boolean.TRUE.equals(managedTag(instanceDir, rel))) {
                    markServerPropertiesKeep(instanceDir);
                }
                continue;
            }
            jobs.add(row);
        }
        if (!jobs.isEmpty()) {
            long planned = 0;
            for (Map<String, Object> job : jobs) {
                planned += Math.max(0, Json.lng(job, "size"));
            }
            Progress.plan(planned);
            progress.accept("需要下载 " + jobs.size() + " 个文件");
        }
        boolean asked = askMultiProcess && jobs.size() > 1;
        boolean multiProcess = asked && confirmMultiProcess(jobs.size(), progress);
            List<Map<String, String>> packed = new ArrayList<>();
            if (jobs.size() > 1) {
                try {
                    if (multiProcess) {
                        packed.addAll(downloadFast(instanceDir, side, client, jobs, progress));
                    } else {
                        progress.accept("正在把 " + jobs.size() + " 个文件打包成一个压缩包下载");
                        packed.addAll(client.downloadPack(instanceDir, side, jobs, progress, false));
                    }
                } catch (Exception error) {
                    progress.accept("打包下载失败，改为逐个下载：" + error.getMessage());
                }
            }
            java.util.Set<String> donePaths = new java.util.LinkedHashSet<>();
            for (Map<String, String> item : packed) {
                donePaths.add(item.get("path"));
            }
            List<Map<String, Object>> rest = new ArrayList<>();
            for (Map<String, Object> job : jobs) {
                if (!donePaths.contains(Fs.posix(Json.str(job, "path")))) {
                    rest.add(job);
                }
            }
            if (!packed.isEmpty() && !rest.isEmpty()) {
                progress.accept("压缩包已完成的不再重下，还有 " + rest.size() + " 个文件");
            }
        try {
            if (!jobs.isEmpty()) {
                Progress.begin("同步文件", jobs.size());
            }
            List<Map<String, String>> written = new ArrayList<>(packed);
            if (!rest.isEmpty()) {
                written.addAll(downloadThreads(instanceDir, client, rest, progress));
            }
            for (Map<String, String> item : written) {
                syncedHashes.put(item.get("path"), item.get("sha256"));
                applied.add(Map.of("path", item.get("path"), "action", "write"));
            }
        } finally {
            Progress.end();
        }
        Set<String> managed = Set.copyOf(managedPaths);
        java.util.Set<String> remotePathSet = new java.util.LinkedHashSet<>();
        for (Object item : remoteFiles) {
            remotePathSet.add(Fs.posix(Json.str(Json.object(item), "path")));
        }
        for (String rel : managedPaths) {
            if (remotePathSet.contains(rel) || Fs.unsafePath(rel) || !Policy.shouldDeleteLocal(rel, managed)) {
                continue;
            }
            Path target = instanceDir.resolve(rel);
            if (Files.isRegularFile(target)) {
                progress.accept("更新器服务器已删除，正在移除 " + rel);
                Files.delete(target);
                applied.add(Map.of("path", rel, "action", "delete"));
            }
            syncedHashes.remove(rel);
        }
        List<String> remotePaths = new ArrayList<>();
        Map<String, String> remoteHashes = new LinkedHashMap<>();
        for (Object item : remoteFiles) {
            Map<String, Object> row = Json.object(item);
            String rel = Fs.posix(Json.str(row, "path"));
            remotePaths.add(rel);
            remoteHashes.put(rel, Json.str(row, "sha256"));
        }
        syncedHashes.entrySet().removeIf(entry -> !remotePathSet.contains(entry.getKey()));
        for (Map.Entry<String, String> entry : remoteHashes.entrySet()) {
            Map<String, Object> local = localByPath.get(entry.getKey());
            if (local != null && entry.getValue().equals(Json.str(local, "sha256"))) {
                syncedHashes.put(entry.getKey(), entry.getValue());
            }
        }
        boolean wroteProperties = applied.stream()
                .anyMatch(item -> "server.properties".equals(item.get("path")) && "write".equals(item.get("action")));
        if ("server".equals(side) && !wroteProperties && Boolean.TRUE.equals(managedTag(instanceDir, "server.properties"))) {
            Map<String, Object> local = localByPath.get("server.properties");
            String localSha = local == null ? null : Json.str(local, "sha256");
            String remoteSha = remoteHashes.get("server.properties");
            if (localSha != null && remoteSha != null && !localSha.equals(remoteSha)) {
                markServerPropertiesKeep(instanceDir);
            }
        }
        String version = Json.str(remote, "official_version");
        String text = previousVersion.equals(version) ? "" : version;
        if (!keptLocal.isEmpty()) {
            StringBuilder extra = new StringBuilder(text).append("\n\n【保留的本地改动】\n");
            for (String path : keptLocal) {
                extra.append("- 保留本地改动 ").append(path).append('\n');
            }
            text = extra.toString().trim();
        }
        Map<String, Object> next = Json.map();
        next.put("official_version", version);
        next.put("side", side);
        next.put("managed_paths", remotePaths);
        next.put("synced_hashes", syncedHashes);
        next.put("kept_local", keptLocal);
        String instanceId = Json.str(state, "instance_id");
        if ("server".equals(side)) {
            if (instanceId.isBlank()) {
                instanceId = Connections.ensureInstanceId(instanceDir);
            }
            next.put("instance_id", instanceId);
        } else if (!instanceId.isBlank()) {
            next.put("instance_id", instanceId);
        }
        Files.writeString(instanceDir.resolve("cdr-updater-state.json"), Json.stringify(next));
        return new Result(version, "", text, !applied.isEmpty(), applied, keptLocal);
    }

    static final class Check {
        final boolean needed;
        final boolean modsChanged;
        final String changelogText;
        final String officialVersion;

        Check(boolean needed, boolean modsChanged, String changelogText, String officialVersion) {
            this.needed = needed;
            this.modsChanged = modsChanged;
            this.changelogText = changelogText;
            this.officialVersion = officialVersion;
        }
    }

    static Check inspect(Path instanceDir, String side, Client client) throws Exception {
        Map<String, Object> state = loadState(instanceDir);
        List<String> managedPaths = new ArrayList<>();
        for (Object item : Json.array(state.get("managed_paths"))) {
            managedPaths.add(Fs.posix(String.valueOf(item)));
        }
        Map<String, String> syncedHashes = new LinkedHashMap<>();
        for (Map.Entry<String, Object> entry : Json.object(state.get("synced_hashes")).entrySet()) {
            syncedHashes.put(Fs.posix(entry.getKey()), String.valueOf(entry.getValue()));
        }
        Map<String, Object> remote = client.json("GET", "api/manifest?side=" + side, null);
        List<Object> remoteFiles = Json.array(remote.get("files"));
        List<Object> localFiles = scan(instanceDir, remoteFiles, managedPaths);
        boolean needed = false;
        boolean modsChanged = false;
        Map<String, Map<String, Object>> localByPath = new LinkedHashMap<>();
        for (Object item : localFiles) {
            Map<String, Object> row = Json.object(item);
            localByPath.put(Json.str(row, "path"), row);
        }
        java.util.Set<String> remotePaths = new java.util.LinkedHashSet<>();
        for (Object item : remoteFiles) {
            Map<String, Object> row = Json.object(item);
            String rel = Fs.posix(Json.str(row, "path"));
            remotePaths.add(rel);
            Map<String, Object> local = localByPath.get(rel);
            String localSha = local == null ? null : Json.str(local, "sha256");
            if (Policy.shouldOverwriteLocal(rel, side, localSha, Json.str(row, "sha256"), syncedHashes, overlayFlag(row),
                    managedTag(instanceDir, rel), keepServerProperties(instanceDir, rel))) {
                needed = true;
                if (PackPaths.isModPayload(rel)) {
                    modsChanged = true;
                }
            }
        }
        Set<String> managed = Set.copyOf(managedPaths);
        for (String rel : managedPaths) {
            if (!remotePaths.contains(rel) && Policy.shouldDeleteLocal(rel, managed)) {
                needed = true;
                if (PackPaths.isModPayload(rel)) {
                    modsChanged = true;
                }
            }
        }
        return new Check(needed, modsChanged, "", Json.str(remote, "official_version"));
    }

    private static boolean overlayFlag(Map<String, Object> row) {
        return Json.bool(row, "overlay");
    }

    private static Boolean managedTag(Path instanceDir, String rel) {
        if (!PackPaths.taggedTemplate(rel)) {
            return null;
        }
        try {
            Path file = instanceDir.resolve(rel);
            return Files.isRegularFile(file) && PackPaths.hasManagedTag(Files.readString(file));
        } catch (Exception ignored) {
            return false;
        }
    }

    private static boolean keepServerProperties(Path instanceDir, String rel) {
        return PackPaths.taggedTemplate(rel) && Files.isRegularFile(instanceDir.resolve(PackPaths.SERVER_KEEP));
    }

    private static boolean confirmMultiProcess(int count, Consumer<String> progress) {
        if (GraphicsEnvironment.isHeadless()) {
            return false;
        }
        int choice = JOptionPane.showConfirmDialog(null,
                "即将下载 " + count + " 个文件。\n\n选「是」大文件两个一起下，小文件打成一个包。\n选「否」全部打成一个压缩包，单连接下载。",
                "压缩包下载", JOptionPane.YES_NO_OPTION, JOptionPane.QUESTION_MESSAGE);
        boolean yes = choice == JOptionPane.YES_OPTION;
        progress.accept(yes ? "两个大文件同时下载" : "单连接下载压缩包");
        return yes;
    }

    private static final long DIRECT_MIN = 4L * 1024 * 1024;

    private static List<Map<String, String>> downloadFast(Path instanceDir, String side, Client client,
                                                          List<Map<String, Object>> jobs, Consumer<String> progress) throws Exception {
        List<Map<String, Object>> large = new ArrayList<>();
        List<Map<String, Object>> small = new ArrayList<>();
        for (Map<String, Object> job : jobs) {
            if (Json.lng(job, "size") >= DIRECT_MIN) {
                large.add(job);
            } else {
                small.add(job);
            }
        }
        progress.accept("大文件 " + large.size() + " 个同时下 2 个，小文件 " + small.size() + " 个打包");
        if (small.size() == 1) {
            large.add(small.get(0));
        }
        ExecutorService files = Executors.newFixedThreadPool(Math.min(2, Math.max(1, large.size())));
        ExecutorService packing = Executors.newSingleThreadExecutor();
        Future<Map<String, Object>> built = null;
        if (small.size() > 1) {
            List<Map<String, Object>> batch = small;
            built = packing.submit(() -> client.requestPack(side, batch, progress));
        }
        List<Map<String, String>> written = new ArrayList<>();
        try {
            List<Future<Map<String, String>>> tasks = new ArrayList<>();
            for (Map<String, Object> job : large) {
                tasks.add(files.submit(() -> downloadPlain(instanceDir, client, job, progress)));
            }
            for (Future<Map<String, String>> task : tasks) {
                written.add(task.get());
            }
            if (built != null) {
                try {
                    Map<String, Object> meta = built.get();
                    written.addAll(client.savePack(instanceDir, Json.str(meta, "sha256"), Json.lng(meta, "size"),
                            small, progress, true, "小文件压缩包"));
                } catch (Exception error) {
                    Throwable cause = error instanceof java.util.concurrent.ExecutionException && error.getCause() != null
                            ? error.getCause() : error;
                    progress.accept("小文件打包失败，改为逐个下载：" + cause.getMessage());
                }
            }
            return written;
        } catch (java.util.concurrent.ExecutionException error) {
            Throwable cause = error.getCause();
            if (cause instanceof Exception wrapped) {
                throw wrapped;
            }
            throw error;
        } finally {
            files.shutdownNow();
            packing.shutdownNow();
        }
    }

    private static List<Map<String, String>> downloadPackProcesses(Path instanceDir, String side, Client client,
                                                                   List<Map<String, Object>> jobs, Consumer<String> progress) throws Exception {
        Path jar = LaunchHook.updaterJar(instanceDir);
        String javaBin = Path.of(System.getProperty("java.home"), "bin",
                System.getProperty("os.name", "").toLowerCase().contains("win") ? "java.exe" : "java").toString();
        if (jar == null || !Files.isRegularFile(jar)) {
            progress.accept("找不到更新器，改为当前进程下载一个压缩包");
            return client.downloadPack(instanceDir, side, jobs, progress, false);
        }
        Path windowed = Path.of(javaBin).resolveSibling(javaBin.toLowerCase().endsWith(".exe") ? "javaw.exe" : "javaw");
        String launcher = Files.isRegularFile(windowed) ? windowed.toString() : javaBin;
        int batches = Math.min(4, jobs.size());
        Path launchJar = Files.createTempFile("cdr-updater-proc-", ".jar");
        Files.copy(jar, launchJar, java.nio.file.StandardCopyOption.REPLACE_EXISTING);
        launchJar.toFile().deleteOnExit();
        progress.accept("使用 " + jar.getFileName() + " 启动 " + batches + " 个下载窗口");
        List<List<Map<String, Object>>> groups = splitPacks(jobs, batches);
        List<Map<String, Object>> ready = new ArrayList<>();
        try {
            for (int i = 0; i < groups.size(); i++) {
                List<Map<String, Object>> group = groups.get(i);
                progress.accept("正在打包第 " + (i + 1) + "/" + groups.size() + " 个压缩包，" + group.size() + " 个文件");
                Map<String, Object> meta = client.requestPack(side, group, progress);
                Map<String, Object> item = new LinkedHashMap<>();
                item.put("sha256", Json.str(meta, "sha256"));
                item.put("size", Json.lng(meta, "size"));
                item.put("jobs", group);
                item.put("label", "压缩包 " + (i + 1) + "/" + groups.size());
                item.put("index", i);
                ready.add(item);
            }
        } catch (Exception error) {
            for (Map<String, Object> item : ready) {
                client.releasePack(Json.str(item, "sha256"), progress);
            }
            Files.deleteIfExists(launchJar);
            throw error;
        }
        int limit = groups.size();
        ExecutorService pool = Executors.newFixedThreadPool(limit);
        try {
            List<Future<List<Map<String, String>>>> tasks = new ArrayList<>();
            for (Map<String, Object> item : ready) {
                tasks.add(pool.submit(() -> runPackProcess(launcher, launchJar, instanceDir, side, client, item, progress)));
            }
            List<Map<String, String>> written = new ArrayList<>();
            List<Exception> failed = new ArrayList<>();
            for (Future<List<Map<String, String>>> task : tasks) {
                try {
                    written.addAll(awaitPack(task));
                } catch (Exception error) {
                    failed.add(error);
                    progress.accept("有一个压缩包失败：" + error.getMessage());
                }
            }
            if (!failed.isEmpty() && written.isEmpty()) {
                throw failed.get(0);
            }
            return written;
        } finally {
            pool.shutdownNow();
            Files.deleteIfExists(launchJar);
        }
    }

    private static List<List<Map<String, Object>>> splitPacks(List<Map<String, Object>> jobs, int batches) {
        List<Map<String, Object>> sorted = new ArrayList<>(jobs);
        sorted.sort((left, right) -> Long.compare(Json.lng(right, "size"), Json.lng(left, "size")));
        List<List<Map<String, Object>>> groups = new ArrayList<>();
        long[] load = new long[batches];
        for (int i = 0; i < batches; i++) {
            groups.add(new ArrayList<>());
        }
        for (Map<String, Object> job : sorted) {
            int best = 0;
            for (int i = 1; i < batches; i++) {
                if (load[i] < load[best]) {
                    best = i;
                }
            }
            groups.get(best).add(job);
            long size = Json.lng(job, "size");
            load[best] += size > 0 ? size : 1;
        }
        groups.removeIf(List::isEmpty);
        return groups;
    }

    private static List<Map<String, String>> awaitPack(Future<List<Map<String, String>>> task) throws Exception {
        try {
            return task.get();
        } catch (java.util.concurrent.ExecutionException error) {
            Throwable cause = error.getCause();
            if (cause instanceof Exception wrapped) {
                throw wrapped;
            }
            throw error;
        }
    }

    private static List<Map<String, String>> runPackProcess(String javaBin, Path jar, Path instanceDir, String side, Client client,
                                                            Map<String, Object> item, Consumer<String> progress) throws Exception {
        String label = Json.str(item, "label");
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("mode", "pack");
        payload.put("server", client.server());
        payload.put("side", side);
        payload.put("token", client.token());
        payload.put("instance", instanceDir.toAbsolutePath().toString());
        payload.put("sha256", Json.str(item, "sha256"));
        payload.put("size", Json.lng(item, "size"));
        payload.put("label", label);
        payload.put("index", Json.lng(item, "index"));
        payload.put("parallel", false);
        payload.put("jobs", item.get("jobs"));
        ProcessBuilder builder = new ProcessBuilder(javaBin, "-jar", jar.toString(), "fetch-job");
        builder.redirectErrorStream(true);
        Process process = builder.start();
        process.getOutputStream().write(Json.stringify(payload).getBytes(StandardCharsets.UTF_8));
        process.getOutputStream().close();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream(), StandardCharsets.UTF_8))) {
            String line;
            while ((line = reader.readLine()) != null) {
                progress.accept(line);
            }
        }
        int code = process.waitFor();
        if (code != 0) {
            client.releasePack(Json.str(item, "sha256"), progress);
            throw new IllegalStateException(label + " 下载失败，退出码 " + code);
        }
        progress.accept("进程完成 " + label);
        List<Map<String, String>> written = new ArrayList<>();
        for (Object job : Json.array(item.get("jobs"))) {
            Map<String, Object> row = Json.object(job);
            String rel = Fs.posix(Json.str(row, "path"));
            written.add(Map.of("path", rel, "sha256", Json.str(row, "sha256")));
        }
        return written;
    }

    private static List<Map<String, String>> downloadThreads(Path instanceDir, Client client, List<Map<String, Object>> jobs,
                                                             Consumer<String> progress) throws Exception {
        if (jobs.isEmpty()) {
            return List.of();
        }
        if (jobs.size() == 1) {
            return List.of(downloadJob(instanceDir, client, jobs.get(0), progress));
        }
        int workers = Math.min(16, jobs.size());
        ExecutorService pool = Executors.newFixedThreadPool(workers);
        try {
            List<Future<Map<String, String>>> tasks = new ArrayList<>();
            for (Map<String, Object> job : jobs) {
                tasks.add(pool.submit(() -> downloadJob(instanceDir, client, job, progress)));
            }
            List<Map<String, String>> written = new ArrayList<>();
            for (Future<Map<String, String>> task : tasks) {
                written.add(await(task));
            }
            return written;
        } finally {
            pool.shutdownNow();
        }
    }

    private static List<Map<String, String>> downloadProcesses(Path instanceDir, Client client, List<Map<String, Object>> jobs,
                                                               Consumer<String> progress) throws Exception {
        Path jar = LaunchHook.updaterJar(instanceDir);
        String javaBin = Path.of(System.getProperty("java.home"), "bin",
                System.getProperty("os.name", "").toLowerCase().contains("win") ? "java.exe" : "java").toString();
        if (jar == null || !Files.isRegularFile(jar)) {
            progress.accept("找不到更新器，改为当前进程多线程下载");
            return downloadThreads(instanceDir, client, jobs, progress);
        }
        int limit = Math.min(4, Runtime.getRuntime().availableProcessors());
        if (limit < 1) {
            limit = 1;
        }
        Semaphore gate = new Semaphore(limit);
        ExecutorService pool = Executors.newFixedThreadPool(limit);
        try {
            List<Future<Map<String, String>>> tasks = new ArrayList<>();
            for (Map<String, Object> job : jobs) {
                tasks.add(pool.submit(() -> {
                    gate.acquire();
                    try {
                        return runFetchProcess(javaBin, jar, instanceDir, client, job, progress);
                    } finally {
                        gate.release();
                    }
                }));
            }
            List<Map<String, String>> written = new ArrayList<>();
            for (Future<Map<String, String>> task : tasks) {
                written.add(await(task));
            }
            return written;
        } finally {
            pool.shutdownNow();
        }
    }

    private static Map<String, String> await(Future<Map<String, String>> task) throws Exception {
        try {
            return task.get();
        } catch (java.util.concurrent.ExecutionException error) {
            Throwable cause = error.getCause();
            if (cause instanceof Exception wrapped) {
                throw wrapped;
            }
            throw error;
        }
    }

    private static Map<String, String> runFetchProcess(String javaBin, Path jar, Path instanceDir, Client client,
                                                       Map<String, Object> row, Consumer<String> progress) throws Exception {
        String rel = Fs.posix(Json.str(row, "path"));
        String sha = Json.str(row, "sha256");
        Path dest = instanceDir.resolve(rel).toAbsolutePath();
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("url", client.fileUrl(sha));
        payload.put("dest", dest.toString());
        payload.put("label", rel);
        payload.put("size", Json.lng(row, "size"));
        ProcessBuilder builder = new ProcessBuilder(javaBin, "-jar", jar.toString(), "fetch-job");
        builder.redirectErrorStream(true);
        Process process = builder.start();
        process.getOutputStream().write(Json.stringify(payload).getBytes(StandardCharsets.UTF_8));
        process.getOutputStream().close();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream(), StandardCharsets.UTF_8))) {
            String line;
            while ((line = reader.readLine()) != null) {
                if (!line.contains("下载完成")) {
                    progress.accept(line);
                }
            }
        }
        int code = process.waitFor();
        if (code != 0) {
            throw new IllegalStateException("下载失败 " + rel + "，退出码 " + code);
        }
        progress.accept("进程完成 " + rel);
        return Map.of("path", rel, "sha256", sha);
    }

    private static Map<String, String> downloadJob(Path instanceDir, Client client, Map<String, Object> row,
                                                   Consumer<String> progress) throws Exception {
        String rel = Fs.posix(Json.str(row, "path"));
        String sha = Json.str(row, "sha256");
        progress.accept("下载 " + rel);
        long size = Json.lng(row, "size");
        client.downloadTo(sha, instanceDir.resolve(rel), size, progress, false, rel);
        Progress.settle(rel, size);
        return Map.of("path", rel, "sha256", sha);
    }

    private static Map<String, String> downloadPlain(Path instanceDir, Client client, Map<String, Object> row,
                                                     Consumer<String> progress) throws Exception {
        return downloadJob(instanceDir, client, row, progress);
    }

    private static void replaceInto(Path partial, Path dest) throws java.io.IOException {
        try {
            Files.move(partial, dest, java.nio.file.StandardCopyOption.REPLACE_EXISTING);
            return;
        } catch (java.io.IOException locked) {
            Path stale = dest.resolveSibling(dest.getFileName().toString() + ".old");
            try {
                Files.deleteIfExists(stale);
                if (Files.exists(dest)) {
                    Files.move(dest, stale);
                }
                Files.move(partial, dest, java.nio.file.StandardCopyOption.REPLACE_EXISTING);
            } catch (java.io.IOException error) {
                Files.deleteIfExists(partial);
                throw error;
            }
            try {
                Files.deleteIfExists(stale);
            } catch (java.io.IOException ignored) {
                stale.toFile().deleteOnExit();
            }
        }
    }

    private static void markServerPropertiesKeep(Path instanceDir) {
        try {
            Path keep = instanceDir.resolve(PackPaths.SERVER_KEEP);
            Files.createDirectories(keep.getParent());
            Files.writeString(keep, "keep\n");
        } catch (Exception ignored) {
            // next boot can still see the managed tag
        }
    }
}
